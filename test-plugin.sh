#!/bin/bash

# Test Script for Document Analyzer Pro Plugin
# Run this after deployment to verify everything works

echo "🧪 Testing Document Analyzer Pro Plugin..."
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
  URL="http://localhost:3000"
  echo "⚠️  No URL provided, using default: $URL"
else
  URL="$1"
  echo "🌐 Testing URL: $URL"
fi

echo ""
echo "====================================="
echo "Test 1: Health Check"
echo "====================================="

HEALTH_RESPONSE=$(curl -s "$URL/health")
echo "$HEALTH_RESPONSE"

if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  exit 1
fi

echo ""
echo "====================================="
echo "Test 2: Plugin Manifest"
echo "====================================="

MANIFEST_RESPONSE=$(curl -s "$URL/.well-known/ai-plugin.json")
echo "$MANIFEST_RESPONSE" | head -c 200
echo "..."

if [[ $MANIFEST_RESPONSE == *"document_analyzer"* ]]; then
  echo "✅ Plugin manifest accessible"
else
  echo "❌ Plugin manifest failed"
  exit 1
fi

echo ""
echo "====================================="
echo "Test 3: OpenAPI Spec"
echo "====================================="

OPENAPI_RESPONSE=$(curl -s "$URL/openapi.yaml")
echo "$OPENAPI_RESPONSE" | head -c 200
echo "..."

if [[ $OPENAPI_RESPONSE == *"openapi"* ]]; then
  echo "✅ OpenAPI spec accessible"
else
  echo "❌ OpenAPI spec failed"
  exit 1
fi

echo ""
echo "====================================="
echo "Test 4: File Upload Endpoint (requires test file)"
echo "====================================="

# Create a simple test PDF (requires ghostscript or similar)
# Skip if no test file available

if [ -f "test.pdf" ] || [ -f "test.docx" ] || [ -f "test.xlsx" ]; then
  TEST_FILE=$(ls test.pdf test.docx test.xlsx 2>/dev/null | head -1)

  echo "📄 Uploading test file: $TEST_FILE"

  UPLOAD_RESPONSE=$(curl -s -X POST "$URL/analyze" \
    -F "file=@$TEST_FILE" \
    -F "query=test")

  echo "$UPLOAD_RESPONSE" | head -c 300
  echo "..."

  if [[ $UPLOAD_RESPONSE == *"success"* ]]; then
    echo "✅ File upload test passed"
  else
    echo "❌ File upload test failed"
    exit 1
  fi
else
  echo "⚠️  No test file found (test.pdf, test.docx, or test.xlsx)"
  echo "   Skipping upload test"
  echo "   To test upload, create a test file and run again"
fi

echo ""
echo "====================================="
echo "✅ All Tests Passed!"
echo "====================================="
echo ""
echo "📋 Next Steps:"
echo "1. Register plugin in ChatGPT: $URL"
echo "2. Test with real documents"
echo "3. Monitor logs for errors"
echo ""
echo "🚀 Ready to launch!"
