import { NextRequest, NextResponse } from 'next/server';
import { validateGuideToken } from '@/lib/guide-token';
import { prisma } from '@/lib/prisma';
import { guides } from '@/data/guides';
import { jsPDF } from 'jspdf';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.json({ error: 'Missing token or email parameter' }, { status: 400 });
  }

  const validatedData = validateGuideToken(token);
  if (!validatedData) {
    return NextResponse.json(
      { error: 'Invalid or expired download link. Please request a new one from the guide page.' },
      { status: 401 }
    );
  }

  if (validatedData.email !== email) {
    return NextResponse.json({ error: 'Email does not match token' }, { status: 401 });
  }

  const subscriber = await prisma.subscriber.findUnique({ where: { email } });
  if (!subscriber || !subscriber.active) {
    return NextResponse.json({ error: 'Email not found or subscription inactive' }, { status: 404 });
  }

  const guide = guides.find(g => g.slug === validatedData.guideSlug);
  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const pdfBuffer = await generateGuidePDF(guide);
  const filename = guide.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') + '.pdf';

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.byteLength.toString(),
    },
  });
}

// Brand colors - minimal palette following brand guidelines
const COLORS = {
  primary: [0, 0, 0] as [number, number, number],           // Black
  accent: [217, 119, 87] as [number, number, number],       // Brand orange #D97757
  accentLight: [255, 245, 241] as [number, number, number], // Very light orange bg
  text: [23, 23, 23] as [number, number, number],           // Near black text
  textSecondary: [82, 82, 82] as [number, number, number],  // Dark gray
  textMuted: [140, 140, 140] as [number, number, number],   // Medium gray
  background: [248, 248, 248] as [number, number, number],  // Light gray bg
  white: [255, 255, 255] as [number, number, number],
  codeBg: [30, 30, 30] as [number, number, number],         // Near black for code
};

// Known modules render in brand accent; unknown ids fall back to muted text.
const KNOWN_MODULES = new Set([
  'setup', 'features', 'prototype', 'prototyping', 'collaboration',
  'github', 'practices', 'figma', 'general',
]);
const getModuleColor = (id: string): [number, number, number] =>
  KNOWN_MODULES.has(id) ? COLORS.accent : COLORS.textSecondary;

async function generateGuidePDF(guide: typeof guides[0]): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Register Satoshi font
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  try {
    const satoshiRegular = readFileSync(path.join(fontsDir, 'satoshi-400.ttf'));
    const satoshiBold = readFileSync(path.join(fontsDir, 'satoshi-700.ttf'));
    const satoshiRegularB64 = satoshiRegular.toString('base64');
    const satoshiBoldB64 = satoshiBold.toString('base64');
    doc.addFileToVFS('Satoshi-Regular.ttf', satoshiRegularB64);
    doc.addFont('Satoshi-Regular.ttf', 'Satoshi', 'normal');
    doc.addFileToVFS('Satoshi-Bold.ttf', satoshiBoldB64);
    doc.addFont('Satoshi-Bold.ttf', 'Satoshi', 'bold');
    doc.setFont('Satoshi', 'normal');
  } catch {
    // Fallback to helvetica if font files not found
  }

  const fontFamily = doc.getFont().fontName === 'Satoshi' ? 'Satoshi' : 'helvetica';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;
  let currentPage = 1;

  // Module names mapping
  const moduleNames: Record<string, string> = {
    setup: 'Setup',
    features: 'Core Features',
    prototype: 'Prototype',
    prototyping: 'Prototyping Workflows',
    collaboration: 'Developer Collaboration',
    github: 'GitHub',
    practices: 'Best Practices',
    figma: 'Figma + Code',
    general: 'Lessons',
  };

  // Helper: Add page header (except cover)
  const addPageHeader = () => {
    if (currentPage > 1) {
      // Top accent line
      doc.setFillColor(...COLORS.accent);
      doc.rect(0, 0, pageWidth, 3, 'F');

      // Guide title in header
      doc.setFontSize(9);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...COLORS.textMuted);
      doc.text(guide.title, margin, 12);

      // Page number
      doc.text(`Page ${currentPage}`, pageWidth - margin - 15, 12);
    }
  };

  // Helper: Add page footer (only once per page)
  let footerDrawnOnPage = -1;
  const addPageFooter = () => {
    if (footerDrawnOnPage === currentPage) return;
    footerDrawnOnPage = currentPage;
    doc.setFontSize(8);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text('aiuxdesign.guide', margin, pageHeight - 8);
  };

  // Helper: Check page break and add new page if needed
  const checkPageBreak = (height: number): boolean => {
    if (yPos + height > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      currentPage++;
      addPageHeader();
      yPos = currentPage > 1 ? 25 : margin;
      return true;
    }
    return false;
  };

  // Helper: sanitize text for PDF rendering (replace problematic Unicode)
  const sanitize = (text: string): string => {
    return text
      .replace(/\u2014/g, ' - ')   // em dash
      .replace(/\u2013/g, ' - ')   // en dash
      .replace(/\u2018|\u2019/g, "'") // smart quotes
      .replace(/\u201C|\u201D/g, '"') // smart double quotes
      .replace(/\u2026/g, '...')   // ellipsis
      .replace(/\u2194/g, '<->');  // ↔
  };

  // Helper: Draw rounded rectangle with optional border
  const drawRoundedRect = (
    x: number, y: number, w: number, h: number, r: number,
    fill?: [number, number, number], stroke?: [number, number, number]
  ) => {
    if (fill) {
      doc.setFillColor(...fill);
      doc.roundedRect(x, y, w, h, r, r, 'F');
    }
    if (stroke) {
      doc.setDrawColor(...stroke);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, w, h, r, r, 'S');
    }
  };

  // Helper: Add wrapped text with proper line height
  const addText = (
    text: string,
    x: number,
    fontSize: number,
    color: [number, number, number] = COLORS.text,
    fontStyle: 'normal' | 'bold' = 'normal',
    maxWidth: number = contentWidth
  ): number => {
    doc.setFontSize(fontSize);
    doc.setFont(fontFamily, fontStyle);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(sanitize(text), maxWidth);
    const lineHeight = fontSize * 0.45;

    for (const line of lines) {
      if (checkPageBreak(lineHeight + 2)) {
        // After page break, continue
      }
      doc.text(line, x, yPos);
      yPos += lineHeight;
    }
    return lines.length * lineHeight;
  };

  // =====================
  // COVER PAGE
  // =====================

  // Full page accent background at top
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 100, 'F');

  // Accent stripe
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 100, pageWidth, 4, 'F');

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(32);
  doc.setFont(fontFamily, 'bold');
  const titleLines = doc.splitTextToSize(guide.title, contentWidth);
  let titleY = 45;
  for (const line of titleLines) {
    doc.text(line, margin, titleY);
    titleY += 14;
  }

  // Subtitle/Tool
  doc.setFontSize(14);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(...COLORS.accent);
  doc.text(`A ${guide.tool} Learning Path`, margin, titleY + 8);

  // Description below black area
  yPos = 120;
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'normal');
  const descLines = doc.splitTextToSize(guide.description, contentWidth);
  for (const line of descLines) {
    doc.text(line, margin, yPos);
    yPos += 6;
  }

  yPos += 15;

  // Quick stats cards
  const statsY = yPos;
  const cardWidth = (contentWidth - 10) / 3;

  const stats = [
    { label: 'Read Time', value: `${guide.readTime} min` },
    { label: 'Lessons', value: `${guide.lessons?.length || 0}` },
    { label: 'Level', value: guide.skillLevel },
  ];

  stats.forEach((stat, i) => {
    const cardX = margin + i * (cardWidth + 5);
    drawRoundedRect(cardX, statsY, cardWidth, 25, 3, COLORS.background);

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(stat.label, cardX + 5, statsY + 9);

    doc.setFontSize(14);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(stat.value, cardX + 5, statsY + 19);
    doc.setFont(fontFamily, 'normal');
  });

  yPos = statsY + 40;

  // What you'll learn section
  if (guide.lessons && guide.lessons.length > 0) {
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text("What You'll Learn", margin, yPos);
    yPos += 10;

    // Group by modules and show module cards
    const moduleGroups = new Map<string, typeof guide.lessons>();
    for (const lesson of guide.lessons) {
      const mod = lesson.module || 'general';
      if (!moduleGroups.has(mod)) moduleGroups.set(mod, []);
      moduleGroups.get(mod)!.push(lesson);
    }

    const modules = Array.from(moduleGroups.keys());
    const moduleCardHeight = 16; // Reduced from 18 to fit more modules

    for (let i = 0; i < modules.length; i++) {
      const moduleId = modules[i];
      const moduleName = moduleNames[moduleId] || moduleId;
      const lessonCount = moduleGroups.get(moduleId)!.length;
      const moduleColor = getModuleColor(moduleId);

      checkPageBreak(moduleCardHeight + 5);
      drawRoundedRect(margin, yPos, contentWidth, moduleCardHeight, 2, COLORS.background);

      // Module number - properly centered
      const modCircleX = margin + 14;
      const modCircleY = yPos + moduleCardHeight / 2;
      doc.setFillColor(...moduleColor);
      doc.circle(modCircleX, modCircleY, 4, 'F');
      doc.setFontSize(9);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...COLORS.white);
      const modNumStr = String(i + 1);
      const modNumWidth = doc.getTextWidth(modNumStr);
      doc.text(modNumStr, modCircleX - modNumWidth / 2, modCircleY + 1.5);

      // Module name
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      doc.text(moduleName, margin + 23, modCircleY + 1.5);

      // Lesson count
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(`${lessonCount} lesson${lessonCount > 1 ? 's' : ''}`, pageWidth - margin - 25, yPos + moduleCardHeight / 2 + 1.5);

      yPos += moduleCardHeight + 3; // Reduced spacing from 4 to 3
    }
  }

  // Footer on cover
  addPageFooter();

  // =====================
  // TABLE OF CONTENTS
  // =====================
  doc.addPage();
  currentPage++;
  addPageHeader();
  yPos = 30;

  // TOC Header
  doc.setFontSize(24);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Table of Contents', margin, yPos);

  yPos += 15;

  if (guide.lessons && guide.lessons.length > 0) {
    const moduleGroups = new Map<string, typeof guide.lessons>();
    for (const lesson of guide.lessons) {
      const mod = lesson.module || 'general';
      if (!moduleGroups.has(mod)) moduleGroups.set(mod, []);
      moduleGroups.get(mod)!.push(lesson);
    }

    let moduleIndex = 1;
    for (const [moduleId, lessons] of Array.from(moduleGroups.entries())) {
      checkPageBreak(25);

      const moduleName = moduleNames[moduleId] || moduleId;
      const moduleColor = getModuleColor(moduleId);

      // Module header
      doc.setFontSize(13);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(`${moduleIndex}. ${moduleName}`, margin, yPos + 4);
      yPos += 12;

      // Lessons under module
      doc.setFontSize(10);
      doc.setFont(fontFamily, 'normal');
      for (const lesson of lessons) {
        checkPageBreak(8);

        // Lesson number circle
        doc.setFillColor(...COLORS.background);
        doc.circle(margin + 8, yPos - 1.5, 3.5, 'F');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(String(lesson.order), margin + 6.5, yPos);

        // Lesson title
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.text);
        doc.text(sanitize(lesson.title), margin + 16, yPos);

        // Duration
        doc.setTextColor(...COLORS.textMuted);
        doc.text(`${lesson.duration} min`, pageWidth - margin - 15, yPos);

        yPos += 8;
      }
      yPos += 8;
      moduleIndex++;
    }
  }

  addPageFooter();

  // =====================
  // LESSON CONTENT
  // =====================
  if (guide.lessons && guide.lessons.length > 0) {
    let isFirstLesson = true;

    for (const lesson of guide.lessons) {
      const lessonHeaderHeight = 45; // Height needed for lesson header

      // Only start new page if not enough space for lesson header
      // First lesson always starts on new page after TOC
      if (isFirstLesson || yPos + lessonHeaderHeight > pageHeight - 40) {
        addPageFooter();
        doc.addPage();
        currentPage++;
        addPageHeader();
        yPos = 30;
      } else {
        // Add subtle separator line between lessons on same page
        yPos += 10;
        doc.setDrawColor(220, 220, 220); // Very light gray
        doc.setLineWidth(0.1);
        doc.line(margin + 30, yPos, pageWidth - margin - 30, yPos);
        yPos += 14;
      }

      isFirstLesson = false;

      const moduleColor = getModuleColor(lesson.module || 'general');

      // Lesson number badge
      const badgeText = `Lesson ${lesson.order}`;
      doc.setFontSize(7.5);
      doc.setFont(fontFamily, 'bold');
      const badgeW = doc.getTextWidth(badgeText) + 6;
      const badgeH = 7;
      doc.setFillColor(...COLORS.accent);
      doc.roundedRect(margin, yPos - 4, badgeW, badgeH, 1.5, 1.5, 'F');
      doc.setTextColor(...COLORS.white);
      doc.text(badgeText, margin + 3, yPos - 4 + badgeH / 2 + 1);

      // Duration with clock icon
      const durText = `${lesson.duration} min`;
      doc.setFontSize(8);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...COLORS.textSecondary);
      const durTextW = doc.getTextWidth(durText);
      const durX = pageWidth - margin - durTextW;
      doc.text(durText, durX, yPos + 1);
      const clockX = durX - 5;
      const clockY = yPos - 0.5;
      const clockR = 2.5;
      doc.setDrawColor(...COLORS.textSecondary);
      doc.setLineWidth(0.4);
      doc.circle(clockX, clockY, clockR, 'S');
      doc.line(clockX, clockY, clockX, clockY - 1.5);
      doc.line(clockX, clockY, clockX + 1.2, clockY - 0.5);

      // Lesson title
      doc.setFontSize(18);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...COLORS.text);
      const lessonTitleLines = doc.splitTextToSize(sanitize(lesson.title), contentWidth);
      const titleLineCount = Math.min(lessonTitleLines.length, 3);
      let titleDrawY = yPos + 12;
      for (let tl = 0; tl < titleLineCount; tl++) {
        doc.text(lessonTitleLines[tl], margin, titleDrawY);
        titleDrawY += 9;
      }

      yPos = titleDrawY + 4;

      // Helper: draw a subtle section divider
      const addSectionDivider = () => {
        yPos += 4;
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(margin, yPos, margin + contentWidth, yPos);
        yPos += 6;
      };

      // Process sections
      if (lesson.sections && Array.isArray(lesson.sections)) {
        const lessonTitleNorm = lesson.title.trim().toLowerCase();
        for (let sIdx = 0; sIdx < lesson.sections.length; sIdx++) {
          const section = lesson.sections[sIdx];

          // Skip heading that duplicates the lesson title
          if (section.type === 'heading' && section.content &&
              section.content.trim().toLowerCase() === lessonTitleNorm) {
            continue;
          }

          checkPageBreak(20);

          switch (section.type) {
            case 'intro':
            case 'text':
              if (section.content) {
                yPos += 4;
                addText(section.content, margin, 10, COLORS.text);
                yPos += 6;
              }
              break;

            case 'heading':
              if (section.content) {
                // Add divider before heading (unless it's the first section)
                if (sIdx > 0) {
                  addSectionDivider();
                }
                yPos += 4;
                const headingSize = section.level === 'h2' ? 14 : 12;
                addText(section.content, margin, headingSize, COLORS.text, 'bold');
                yPos += 6;
              }
              break;

            case 'steps':
              if (section.steps && Array.isArray(section.steps)) {
                yPos += 5;
                for (const step of section.steps) {
                  checkPageBreak(20);

                  const contentItems = step.content
                    ? (Array.isArray(step.content) ? step.content.slice(0, 5) : [step.content])
                    : [];

                  // Circle + title row
                  const circleX = margin + 3;
                  const circleR = 3;
                  doc.setFillColor(...COLORS.accent);
                  doc.circle(circleX, yPos, circleR, 'F');

                  // Center number in circle
                  doc.setFontSize(7.5);
                  doc.setFont(fontFamily, 'bold');
                  doc.setTextColor(...COLORS.white);
                  const numStr = String(step.number);
                  const numWidth = doc.getTextWidth(numStr);
                  doc.text(numStr, circleX - numWidth / 2, yPos + 1.1);

                  // Step title next to circle
                  doc.setFontSize(11);
                  doc.setFont(fontFamily, 'bold');
                  doc.setTextColor(...COLORS.text);
                  doc.text(sanitize(step.title), margin + 10, yPos + 1.5);
                  yPos += 7;

                  // Bullet items indented below
                  if (step.content) {
                    doc.setFont(fontFamily, 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(...COLORS.textSecondary);

                    for (const item of contentItems) {
                      const bulletLines = doc.splitTextToSize(`\u2022 ${sanitize(item)}`, contentWidth - 16);
                      for (const line of bulletLines.slice(0, 2)) {
                        checkPageBreak(5);
                        doc.text(line, margin + 10, yPos);
                        yPos += 4.5;
                      }
                    }
                  }

                  yPos += 7; // breathing room between steps
                }
                yPos += 3;
              }
              break;

            case 'callout':
              checkPageBreak(30);
              yPos += 5;

              const calloutText = sanitize(section.content || '');
              const calloutLines = doc.splitTextToSize(calloutText, contentWidth - 20);
              const calloutHeight = Math.max(20, (section.title ? 10 : 0) + calloutLines.length * 5 + 10);

              // Simple callout with subtle accent bar
              drawRoundedRect(margin, yPos, contentWidth, calloutHeight, 3, COLORS.accentLight);

              let calloutY = yPos + 6;
              if (section.title) {
                doc.setFontSize(10);
                doc.setFont(fontFamily, 'bold');
                doc.setTextColor(...COLORS.text);
                doc.text(sanitize(section.title), margin + 10, calloutY + 3);
                calloutY += 10;
              }

              doc.setFont(fontFamily, 'normal');
              doc.setFontSize(9);
              doc.setTextColor(...COLORS.textSecondary);
              for (const line of calloutLines) {
                doc.text(line, margin + 10, calloutY + 3);
                calloutY += 5;
              }

              yPos += calloutHeight + 5;
              break;

            case 'code':
              checkPageBreak(25);
              yPos += 5;

              const codeContent = section.code || section.content || '';
              const codeLines = codeContent.split('\n').slice(0, 20);
              const codeHeight = Math.max(20, codeLines.length * 4 + 15);

              // Code block with dark background
              drawRoundedRect(margin, yPos, contentWidth, codeHeight, 3, COLORS.codeBg);

              doc.setTextColor(220, 220, 220);
              doc.setFontSize(8);
              doc.setFont('courier', 'normal');
              let codeY = yPos + 8;
              for (const line of codeLines) {
                doc.text(line.substring(0, 85), margin + 5, codeY);
                codeY += 4;
              }
              doc.setFont(fontFamily, 'normal');

              yPos += codeHeight + 8;
              break;

            case 'list':
              if (section.items && Array.isArray(section.items)) {
                yPos += 3;
                doc.setFontSize(10);
                for (const item of section.items) {
                  checkPageBreak(8);

                  // Bullet point
                  doc.setFillColor(...COLORS.accent);
                  doc.circle(margin + 3, yPos - 1.5, 1.5, 'F');

                  doc.setTextColor(...COLORS.text);
                  const listLines = doc.splitTextToSize(sanitize(item), contentWidth - 12);
                  for (const line of listLines) {
                    doc.text(line, margin + 8, yPos);
                    yPos += 5;
                  }
                  yPos += 2;
                }
                yPos += 3;
              }
              break;

            case 'image': {
              checkPageBreak(30);
              yPos += 5;

              // Try to embed actual image from filesystem
              let imageEmbedded = false;
              if (section.src) {
                try {
                  // Try PNG version first, then original
                  const publicDir = path.join(process.cwd(), 'public');
                  const pngPath = path.join(publicDir, section.src.replace(/\.(gif|webp)$/i, '.png'));
                  const origPath = path.join(publicDir, section.src);
                  let imgPath = '';
                  let imgFormat: 'PNG' | 'JPEG' = 'PNG';

                  if (section.src.match(/\.png$/i)) {
                    imgPath = origPath;
                  } else if (section.src.match(/\.(gif|webp)$/i)) {
                    // Check if a PNG conversion exists
                    try { readFileSync(pngPath); imgPath = pngPath; } catch { /* no PNG version */ }
                  } else if (section.src.match(/\.jpe?g$/i)) {
                    imgPath = origPath;
                    imgFormat = 'JPEG';
                  }

                  if (imgPath) {
                    const imgData = readFileSync(imgPath);
                    const imgB64 = imgData.toString('base64');
                    const imgDataUri = `data:image/${imgFormat.toLowerCase()};base64,${imgB64}`;

                    // Calculate dimensions to fit content width while maintaining aspect ratio
                    const imgProps = doc.getImageProperties(imgDataUri);
                    const aspectRatio = imgProps.width / imgProps.height;
                    const imgWidth = Math.min(contentWidth, 160);
                    const imgHeight = imgWidth / aspectRatio;

                    checkPageBreak(imgHeight + 10);

                    // Center the image
                    const imgX = margin + (contentWidth - imgWidth) / 2;
                    drawRoundedRect(imgX - 2, yPos - 2, imgWidth + 4, imgHeight + 4, 3, COLORS.background);
                    doc.addImage(imgDataUri, imgFormat, imgX, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 3;
                    imageEmbedded = true;
                  }
                } catch {
                  // Failed to embed — fall through to placeholder
                }
              }

              if (!imageEmbedded) {
                doc.setFontSize(9);
                doc.setFont(fontFamily, 'normal');
                const imageLabel = sanitize(section.alt || section.label || 'See online guide for visual reference');
                const labelLines = doc.splitTextToSize(imageLabel, contentWidth - 16);
                const lineHeight = 5;
                const verticalPadding = 8;
                const imageHeight = Math.max(25, labelLines.length * lineHeight + verticalPadding * 2);

                checkPageBreak(imageHeight + 5);
                drawRoundedRect(margin, yPos, contentWidth, imageHeight, 3, COLORS.background);

                doc.setTextColor(...COLORS.textSecondary);
                let labelY = yPos + (imageHeight - labelLines.length * lineHeight) / 2 + lineHeight - 1;
                for (const line of labelLines) {
                  const lineWidth = doc.getTextWidth(line);
                  doc.text(line, margin + (contentWidth - lineWidth) / 2, labelY);
                  labelY += lineHeight;
                }
                yPos += imageHeight;
              }

              yPos += 5;
              break;
            }

            case 'success':
              checkPageBreak(20);
              yPos += 5;

              // Simple success box with subtle accent
              const successHeight = 20;
              drawRoundedRect(margin, yPos, contentWidth, successHeight, 3, COLORS.accentLight);

              doc.setFontSize(10);
              doc.setFont(fontFamily, 'bold');
              doc.setTextColor(...COLORS.text);
              doc.text(section.title || 'Complete', margin + 10, yPos + successHeight / 2 + 2);

              yPos += successHeight + 5;
              break;
          }
        }
      } else if (lesson.content) {
        // Legacy content format
        addText(lesson.content.replace(/<[^>]*>/g, ''), margin, 10, COLORS.text);
      }

      addPageFooter();
    }
  }

  // =====================
  // FINAL PAGE - Resources
  // =====================
  doc.addPage();
  currentPage++;
  addPageHeader();
  yPos = 30;

  // Thank you section
  doc.setFontSize(20);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text("You're Ready!", margin, yPos);

  yPos += 15;

  doc.setFontSize(11);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(...COLORS.textSecondary);
  const outroText = `Congratulations on completing the ${guide.title}! You now have the foundation to use ${guide.tool} effectively in your design workflow.`;
  const outroLines = doc.splitTextToSize(outroText, contentWidth);
  for (const line of outroLines) {
    doc.text(line, margin, yPos);
    yPos += 6;
  }

  yPos += 15;

  // Next steps box with subtle accent
  drawRoundedRect(margin, yPos, contentWidth, 50, 4, COLORS.accentLight);

  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Continue Learning', margin + 10, yPos + 12);

  doc.setFontSize(10);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(...COLORS.textSecondary);
  doc.text('• Explore more guides at aiuxdesign.guide/guides', margin + 10, yPos + 24);
  doc.text('• Browse AI design patterns at aiuxdesign.guide', margin + 10, yPos + 34);
  doc.text('• Join our newsletter for updates', margin + 10, yPos + 44);

  // Footer
  yPos = pageHeight - 40;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Generated from aiuxdesign.guide', margin, yPos);
  doc.text(`Downloaded: ${new Date().toLocaleDateString()}`, margin, yPos + 5);

  // Return as ArrayBuffer
  return doc.output('arraybuffer');
}
