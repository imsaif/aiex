import puppeteer from 'puppeteer';

/**
 * Generate professional PDF using Puppeteer
 * Creates a high-quality ebook-style PDF with proper page breaks and styling
 */
export async function generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1024,
      height: 1440,
      deviceScaleFactor: 2,
    });

    // Set content with proper HTML
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle2',
    });

    // Generate PDF with professional settings
    const pdfBuffer = await page.pdf({
      format: 'letter',
      margin: {
        top: '0.5in',
        right: '0.75in',
        bottom: '0.5in',
        left: '0.75in',
      },
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
    });

    await page.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate professional ebook-style PDF with enhanced design
 * Features: chapter dividers, proper typography, page breaks, professional layout
 */
export function generateProfessionalPDFHTML(handbookHTML: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Design Patterns Handbook</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
    }

    @page {
      size: letter;
      margin: 0.5in 0.75in;
    }

    /* Chapter Divider Styles */
    .chapter-divider {
      page-break-before: always;
      page-break-after: avoid;
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
      position: relative;
      overflow: hidden;
    }

    .chapter-divider::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
    }

    .chapter-number {
      font-size: 180px;
      font-weight: 900;
      color: white;
      text-align: center;
      z-index: 1;
      line-height: 1;
      opacity: 0.9;
    }

    .chapter-title {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 28px;
      font-weight: 300;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
      color: white;
      text-align: center;
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    .cover-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
      pointer-events: none;
    }

    .cover-content {
      position: relative;
      z-index: 1;
      max-width: 600px;
    }

    .cover-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 40px;
      backdrop-filter: blur(10px);
    }

    .cover-title {
      font-size: 56px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }

    .cover-subtitle {
      font-size: 24px;
      font-weight: 300;
      line-height: 1.4;
      opacity: 0.8;
      margin-bottom: 60px;
      letter-spacing: 0.5px;
    }

    .cover-footer {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 14px;
      opacity: 0.6;
      letter-spacing: 1px;
    }

    /* TOC Styling */
    .toc-page {
      page-break-after: always;
      padding: 60px 0;
    }

    .toc-title {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 60px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .toc-list {
      list-style: none;
    }

    .toc-item {
      font-size: 18px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .toc-item-number {
      color: #999;
      font-weight: 600;
    }

    /* Pattern Content */
    .pattern-section {
      page-break-inside: avoid;
      margin-bottom: 48px;
      padding: 40px;
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .pattern-title {
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 12px;
      color: #0d0d0d;
    }

    .pattern-subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 24px;
      font-style: italic;
    }

    .pattern-content {
      font-size: 14px;
      line-height: 1.8;
      color: #333;
    }

    .pattern-content p {
      margin-bottom: 16px;
    }

    .pattern-content h3 {
      font-size: 18px;
      font-weight: 700;
      margin-top: 24px;
      margin-bottom: 12px;
      color: #0d0d0d;
    }

    .pattern-content ul,
    .pattern-content ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .pattern-content li {
      margin-bottom: 8px;
    }

    /* Images */
    .pattern-image {
      max-width: 100%;
      height: auto;
      margin: 24px 0;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      display: block;
      page-break-inside: avoid;
    }

    /* Decision Trees */
    .decision-tree {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
      font-size: 14px;
      page-break-inside: avoid;
    }

    .decision-tree-item {
      margin-bottom: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-left: 4px solid #0d0d0d;
      border-radius: 2px;
    }

    .decision-tree-item.do {
      border-left-color: #10b981;
      background: #f0fdf4;
    }

    .decision-tree-item.dont {
      border-left-color: #ef4444;
      background: #fef2f2;
    }

    /* Product Cards */
    .product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 16px;
      margin: 12px 0;
      page-break-inside: avoid;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .product-logo {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      object-fit: contain;
    }

    .product-info {
      flex: 1;
      min-width: 0;
    }

    .product-name {
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .product-description {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }

    /* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
      page-break-inside: avoid;
    }

    thead {
      background: #f9f9f9;
    }

    th {
      padding: 12px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #e5e7eb;
    }

    td {
      padding: 12px;
      border: 1px solid #e5e7eb;
    }

    /* Code Examples */
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 16px 0;
      font-size: 12px;
      line-height: 1.4;
      page-break-inside: avoid;
      border: 1px solid #e5e7eb;
    }

    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
      color: #333;
    }

    /* Footer */
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 11px;
      color: #999;
      padding-bottom: 20px;
      border-top: 1px solid #f0f0f0;
    }

    /* Utility Classes */
    .page-break-after {
      page-break-after: always;
    }

    .page-break-inside-avoid {
      page-break-inside: avoid;
    }

    /* Typography */
    h1 {
      font-size: 36px;
      font-weight: 900;
      margin-bottom: 24px;
      line-height: 1.2;
    }

    h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      margin-top: 32px;
      line-height: 1.2;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
      margin-top: 24px;
    }

    p {
      margin-bottom: 16px;
      line-height: 1.7;
    }

    strong {
      font-weight: 700;
    }

    em {
      font-style: italic;
    }

    /* Print optimizations */
    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Main Content -->
  ${handbookHTML}

  <div class="page-footer">
    <p>AI Design Patterns Handbook | © 2024 | For personal use only</p>
  </div>
</body>
</html>`;
}
