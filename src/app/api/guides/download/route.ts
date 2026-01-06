import { NextRequest, NextResponse } from 'next/server';
import { validateGuideToken } from '@/lib/guide-token';
import { prisma } from '@/lib/prisma';
import { guides } from '@/data/guides';
import { jsPDF } from 'jspdf';

/**
 * Download guide PDF using a valid token
 * Token is generated and sent in welcome email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email parameter' },
        { status: 400 }
      );
    }

    // Validate token
    const validatedData = validateGuideToken(token);
    if (!validatedData) {
      return NextResponse.json(
        { error: 'Invalid or expired download link. Please request a new one from the guide page.' },
        { status: 401 }
      );
    }

    // Verify email matches
    if (validatedData.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match token' },
        { status: 401 }
      );
    }

    // Verify subscriber exists
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber || !subscriber.active) {
      return NextResponse.json(
        { error: 'Email not found or subscription inactive' },
        { status: 404 }
      );
    }

    // Find the guide
    const guide = guides.find(g => g.slug === validatedData.guideSlug);
    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateGuidePDF(guide);

    // Create filename from guide title
    const filename = guide.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') + '.pdf';

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error processing guide download:', error);
    return NextResponse.json(
      { error: 'Failed to process guide download' },
      { status: 500 }
    );
  }
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

// All modules use accent color for brand consistency
const MODULE_COLORS: Record<string, [number, number, number]> = {
  setup: [217, 119, 87],       // Brand accent
  features: [217, 119, 87],    // Brand accent
  prototype: [217, 119, 87],   // Brand accent
  prototyping: [217, 119, 87], // Brand accent
  collaboration: [217, 119, 87], // Brand accent
  github: [217, 119, 87],      // Brand accent
  practices: [217, 119, 87],   // Brand accent
  general: [217, 119, 87],     // Brand accent
};

/**
 * Generate a beautifully designed PDF from guide data
 */
async function generateGuidePDF(guide: typeof guides[0]): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

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
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.textMuted);
      doc.text(guide.title, margin, 12);

      // Page number
      doc.text(`Page ${currentPage}`, pageWidth - margin - 15, 12);
    }
  };

  // Helper: Add page footer
  const addPageFooter = () => {
    doc.setFontSize(8);
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
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
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
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(guide.title, contentWidth);
  let titleY = 45;
  for (const line of titleLines) {
    doc.text(line, margin, titleY);
    titleY += 14;
  }

  // Subtitle/Tool
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.accent);
  doc.text(`A ${guide.tool} Learning Path`, margin, titleY + 8);

  // Description below black area
  yPos = 120;
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
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
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(stat.value, cardX + 5, statsY + 19);
    doc.setFont('helvetica', 'normal');
  });

  yPos = statsY + 40;

  // What you'll learn section
  if (guide.lessons && guide.lessons.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
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
      const moduleColor = MODULE_COLORS[moduleId] || COLORS.textSecondary;

      // Module card (removed break - show all modules)
      drawRoundedRect(margin, yPos, contentWidth, moduleCardHeight, 2, COLORS.background);

      // Module color indicator - subtle accent
      doc.setFillColor(...moduleColor);
      doc.roundedRect(margin + 1, yPos + 2, 2, moduleCardHeight - 4, 1, 1, 'F');

      // Module number - properly centered
      const modCircleX = margin + 14;
      const modCircleY = yPos + moduleCardHeight / 2;
      doc.setFillColor(...moduleColor);
      doc.circle(modCircleX, modCircleY, 4, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
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
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Table of Contents', margin, yPos);

  // Accent underline
  doc.setFillColor(...COLORS.accent);
  doc.rect(margin, yPos + 3, 50, 2, 'F');

  yPos += 20;

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
      const moduleColor = MODULE_COLORS[moduleId] || COLORS.textSecondary;

      // Module header with colored pill
      doc.setFillColor(...moduleColor);
      doc.roundedRect(margin, yPos - 1, 6, 6, 1, 1, 'F');

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(`${moduleIndex}. ${moduleName}`, margin + 10, yPos + 4);
      yPos += 12;

      // Lessons under module
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
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
        doc.text(lesson.title, margin + 16, yPos);

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

      const moduleColor = MODULE_COLORS[lesson.module || 'general'] || COLORS.textSecondary;

      // Lesson header block
      drawRoundedRect(margin - 5, yPos - 10, contentWidth + 10, 35, 4, COLORS.background);

      // Module color bar on left - subtle
      doc.setFillColor(...moduleColor);
      doc.roundedRect(margin - 4, yPos - 8, 2, 31, 1, 1, 'F');

      // Lesson number badge
      doc.setFillColor(...COLORS.accent);
      doc.roundedRect(margin + 5, yPos - 5, 24, 10, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.white);
      doc.text(`Lesson ${lesson.order}`, margin + 7, yPos + 2);

      // Lesson title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      const lessonTitleLines = doc.splitTextToSize(lesson.title, contentWidth - 35);
      doc.text(lessonTitleLines[0], margin + 5, yPos + 15);
      if (lessonTitleLines[1]) {
        doc.text(lessonTitleLines[1], margin + 5, yPos + 22);
      }

      // Duration pill
      doc.setFillColor(...COLORS.white);
      drawRoundedRect(pageWidth - margin - 25, yPos - 3, 22, 8, 2, COLORS.white, COLORS.textMuted);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(`${lesson.duration} min`, pageWidth - margin - 23, yPos + 2);

      yPos += 35;

      // Process sections
      if (lesson.sections && Array.isArray(lesson.sections)) {
        for (const section of lesson.sections) {
          checkPageBreak(20);

          switch (section.type) {
            case 'intro':
            case 'text':
              if (section.content) {
                yPos += 3;
                addText(section.content, margin, 10, COLORS.text);
                yPos += 5;
              }
              break;

            case 'heading':
              if (section.content) {
                yPos += 8;
                const headingSize = section.level === 'h2' ? 14 : 12;
                doc.setFillColor(...COLORS.accent);
                doc.rect(margin, yPos - 2, 2, headingSize * 0.6, 'F');
                addText(section.content, margin + 6, headingSize, COLORS.text, 'bold');
                yPos += 4;
              }
              break;

            case 'steps':
              if (section.steps && Array.isArray(section.steps)) {
                yPos += 5;
                for (const step of section.steps) {
                  checkPageBreak(30);

                  // Step container - handle both array and string content
                  const stepContentText = Array.isArray(step.content)
                    ? step.content.join(' | ')
                    : (step.content || '');
                  const stepContentLines = stepContentText
                    ? doc.splitTextToSize(stepContentText, contentWidth - 20)
                    : [];
                  const stepHeight = Math.max(25, 20 + stepContentLines.length * 5);

                  drawRoundedRect(margin, yPos, contentWidth, stepHeight, 3, COLORS.background);

                  // Step number circle - properly centered
                  const circleX = margin + 12;
                  const circleY = yPos + 12;
                  const circleR = 5;
                  doc.setFillColor(...COLORS.accent);
                  doc.circle(circleX, circleY, circleR, 'F');

                  // Center the number text in circle
                  doc.setFontSize(10);
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(...COLORS.white);
                  const numStr = String(step.number);
                  const numWidth = doc.getTextWidth(numStr);
                  doc.text(numStr, circleX - numWidth / 2, circleY + 1.5);

                  // Step title
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(...COLORS.text);
                  doc.text(step.title, margin + 22, circleY + 1.5);

                  // Step content bullets
                  if (step.content) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(...COLORS.textSecondary);
                    let bulletY = yPos + 20;

                    const contentItems = Array.isArray(step.content)
                      ? step.content.slice(0, 5)
                      : [step.content];

                    for (const item of contentItems) {
                      const bulletLines = doc.splitTextToSize(`• ${item}`, contentWidth - 30);
                      for (const line of bulletLines.slice(0, 2)) {
                        doc.text(line, margin + 22, bulletY);
                        bulletY += 4.5;
                      }
                    }
                  }

                  yPos += stepHeight + 5;
                }
              }
              break;

            case 'callout':
              checkPageBreak(30);
              yPos += 5;

              const calloutText = section.content || '';
              const calloutLines = doc.splitTextToSize(calloutText, contentWidth - 20);
              const calloutHeight = Math.max(20, (section.title ? 10 : 0) + calloutLines.length * 5 + 10);

              // Simple callout with subtle accent bar
              drawRoundedRect(margin, yPos, contentWidth, calloutHeight, 3, COLORS.accentLight);

              // Left accent bar - subtle
              doc.setFillColor(...COLORS.accent);
              doc.roundedRect(margin + 1, yPos + 3, 2, calloutHeight - 6, 1, 1, 'F');

              let calloutY = yPos + 6;
              if (section.title) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...COLORS.text);
                doc.text(section.title, margin + 10, calloutY + 3);
                calloutY += 10;
              }

              doc.setFont('helvetica', 'normal');
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

              // Code label if exists
              if (section.label) {
                doc.setFillColor(60, 60, 65);
                doc.roundedRect(margin + 3, yPos + 3, 40, 6, 1, 1, 'F');
                doc.setFontSize(6);
                doc.setTextColor(180, 180, 180);
                doc.text(section.language || 'code', margin + 5, yPos + 7);
              }

              doc.setTextColor(220, 220, 220);
              doc.setFontSize(8);
              doc.setFont('courier', 'normal');
              let codeY = yPos + (section.label ? 14 : 8);
              for (const line of codeLines) {
                doc.text(line.substring(0, 85), margin + 5, codeY);
                codeY += 4;
              }
              doc.setFont('helvetica', 'normal');

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
                  const listLines = doc.splitTextToSize(item, contentWidth - 12);
                  for (const line of listLines) {
                    doc.text(line, margin + 8, yPos);
                    yPos += 5;
                  }
                  yPos += 2;
                }
                yPos += 3;
              }
              break;

            case 'image':
              // Minimal image placeholder - brand colors only
              checkPageBreak(30);
              yPos += 5;

              const imageHeight = 25;
              drawRoundedRect(margin, yPos, contentWidth, imageHeight, 3, COLORS.background);

              // Simple centered label
              doc.setFontSize(9);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(...COLORS.textSecondary);
              const imageLabel = section.alt || section.label || 'See online guide for visual reference';
              const labelWidth = doc.getTextWidth(imageLabel);
              doc.text(imageLabel, margin + (contentWidth - labelWidth) / 2, yPos + imageHeight / 2 + 2);
              doc.setFont('helvetica', 'normal');

              yPos += imageHeight + 5;
              break;

            case 'success':
              checkPageBreak(20);
              yPos += 5;

              // Simple success box with subtle accent
              const successHeight = 20;
              drawRoundedRect(margin, yPos, contentWidth, successHeight, 3, COLORS.accentLight);
              doc.setFillColor(...COLORS.accent);
              doc.roundedRect(margin + 1, yPos + 3, 2, successHeight - 6, 1, 1, 'F');

              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
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
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text("You're Ready!", margin, yPos);

  doc.setFillColor(...COLORS.accent);
  doc.rect(margin, yPos + 3, 40, 2, 'F');

  yPos += 20;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
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
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(margin + 1, yPos + 4, 2, 42, 1, 1, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Continue Learning', margin + 10, yPos + 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
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
