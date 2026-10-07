const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve plugin manifest
app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.json({
    schema_version: 'v1',
    name_for_human: 'Document Analyzer Pro',
    name_for_model: 'document_analyzer',
    description_for_human: 'Upload and analyze PDFs, Word docs, and Excel files. Extract text, data, and insights.',
    description_for_model: 'Helps users analyze documents. Accepts PDF, DOCX, and XLSX files. Can extract text content, summarize documents, extract data from tables, and answer questions about document contents.',
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: `${process.env.PLUGIN_URL || 'http://localhost:3000'}/openapi.yaml`
    },
    logo_url: `${process.env.PLUGIN_URL || 'http://localhost:3000'}/logo.png`,
    contact_email: 'support@documentanalyzer.com',
    legal_info_url: 'https://documentanalyzer.com/legal'
  });
});

// Serve OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
  res.type('text/yaml');
  res.send(`
openapi: 3.0.1
info:
  title: Document Analyzer Pro
  description: Analyze PDF, Word, and Excel documents
  version: 1.0.0
servers:
  - url: ${process.env.PLUGIN_URL || 'http://localhost:3000'}
paths:
  /analyze:
    post:
      operationId: analyzeDocument
      summary: Upload and analyze a document
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                  description: The document file to analyze
                query:
                  type: string
                  description: Optional specific question or analysis request
      responses:
        "200":
          description: Document analysis results
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  filename:
                    type: string
                  fileType:
                    type: string
                  content:
                    type: string
                  metadata:
                    type: object
                  analysis:
                    type: string
  /health:
    get:
      operationId: healthCheck
      summary: Check if the service is running
      responses:
        "200":
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main document analysis endpoint
app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const fileExt = path.extname(originalName).toLowerCase();
    const query = req.body.query || '';

    let result = {
      success: true,
      filename: originalName,
      fileType: fileExt,
      content: '',
      metadata: {},
      analysis: ''
    };

    // Process based on file type
    if (fileExt === '.pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);

      result.content = pdfData.text;
      result.metadata = {
        pages: pdfData.numpages,
        info: pdfData.info
      };

      if (query) {
        result.analysis = `Document contains ${pdfData.numpages} pages with ${pdfData.text.length} characters. ${
          pdfData.text.toLowerCase().includes(query.toLowerCase())
            ? `Found "${query}" in the document.`
            : `"${query}" not found in the document.`
        }`;
      } else {
        result.analysis = `PDF document with ${pdfData.numpages} pages successfully analyzed. Total text length: ${pdfData.text.length} characters.`;
      }

    } else if (fileExt === '.docx' || fileExt === '.doc') {
      const dataBuffer = await fs.readFile(filePath);
      const docResult = await mammoth.extractRawText({ buffer: dataBuffer });

      result.content = docResult.value;
      result.metadata = {
        messages: docResult.messages,
        wordCount: docResult.value.split(/\s+/).length
      };

      if (query) {
        result.analysis = `Document contains approximately ${result.metadata.wordCount} words. ${
          docResult.value.toLowerCase().includes(query.toLowerCase())
            ? `Found "${query}" in the document.`
            : `"${query}" not found in the document.`
        }`;
      } else {
        result.analysis = `Word document successfully analyzed. Approximate word count: ${result.metadata.wordCount}.`;
      }

    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetNames = workbook.SheetNames;

      let allData = {};
      let totalRows = 0;

      sheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        allData[sheetName] = jsonData;
        totalRows += jsonData.length;
      });

      result.content = JSON.stringify(allData, null, 2);
      result.metadata = {
        sheets: sheetNames,
        totalRows: totalRows,
        sheetCount: sheetNames.length
      };

      result.analysis = `Excel file with ${sheetNames.length} sheet(s) and ${totalRows} total rows analyzed. Sheets: ${sheetNames.join(', ')}`;

    } else {
      // Cleanup
      await fs.unlink(filePath);
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload PDF, DOCX, or XLSX files.'
      });
    }

    // Cleanup uploaded file
    await fs.unlink(filePath);

    res.json(result);

  } catch (error) {
    console.error('Analysis error:', error);

    // Cleanup on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to cleanup file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to analyze document: ' + error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Document Analyzer Plugin running on port ${PORT}`);
  console.log(`Plugin manifest: http://localhost:${PORT}/.well-known/ai-plugin.json`);
});
