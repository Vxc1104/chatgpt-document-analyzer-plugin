# Document Analyzer Pro - ChatGPT Plugin

A powerful ChatGPT plugin that enables document analysis capabilities for PDF, Word (DOCX), and Excel (XLSX) files.

## Features

- 📄 **PDF Analysis**: Extract text, count pages, search content
- 📝 **Word Document Processing**: Parse DOCX files, word count, content search
- 📊 **Excel Data Extraction**: Read spreadsheets, extract tables, analyze data
- 🔍 **Smart Search**: Query specific information within documents
- ⚡ **Fast Processing**: Efficient document parsing and analysis

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your settings:
```
PORT=3000
PLUGIN_URL=http://localhost:3000
```

## Running Locally

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Testing the Plugin

1. Start the server: `npm start`
2. Visit: http://localhost:3000/.well-known/ai-plugin.json
3. Test health check: http://localhost:3000/health

## Deploying to Production

### Option 1: Railway (Recommended)

1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Add environment variables:
   - `PLUGIN_URL`: Your Railway URL (e.g., https://your-app.railway.app)
5. Deploy!

### Option 2: DigitalOcean App Platform

1. Create account at digitalocean.com
2. Go to Apps → Create App
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 3000
5. Add environment variable `PLUGIN_URL` with your app URL
6. Launch!

### Option 3: Heroku

```bash
heroku create your-plugin-name
heroku config:set PLUGIN_URL=https://your-plugin-name.herokuapp.com
git push heroku main
```

## Registering with ChatGPT

1. Go to ChatGPT → Settings → Beta Features → Plugins
2. Click "Plugin store" → "Develop your own plugin"
3. Enter your plugin URL: `https://your-domain.com`
4. ChatGPT will verify your manifest at `/.well-known/ai-plugin.json`
5. Install and test!

## API Endpoints

### POST /analyze
Upload and analyze a document.

**Parameters:**
- `file` (required): Document file (PDF, DOCX, XLSX)
- `query` (optional): Specific question or search term

**Response:**
```json
{
  "success": true,
  "filename": "document.pdf",
  "fileType": ".pdf",
  "content": "Extracted text content...",
  "metadata": {
    "pages": 10,
    "info": {}
  },
  "analysis": "Document analysis summary..."
}
```

### GET /health
Health check endpoint.

## Usage Examples

Once installed in ChatGPT, you can:

- "Analyze this PDF and summarize the key points"
- "Extract all the data from this Excel file"
- "Find mentions of 'revenue' in this Word document"
- "What are the main topics in this PDF?"
- "Convert this Excel sheet to a readable format"

## Monetization Strategy

### Freemium Model
- Free: 5 documents/month
- Pro ($9.99/mo): 100 documents/month
- Business ($29.99/mo): Unlimited

### Implementation (Next Steps)
1. Add authentication (OAuth 2.0)
2. Implement usage tracking with database
3. Integrate Stripe for payments
4. Add user dashboard

## Tech Stack

- Node.js + Express
- pdf-parse: PDF text extraction
- mammoth: Word document parsing
- xlsx: Excel file processing
- multer: File upload handling

## Security

- 10MB file size limit
- Automatic file cleanup after processing
- Input validation
- CORS enabled

## Support

For issues or questions, contact: support@documentanalyzer.com

## License

MIT
