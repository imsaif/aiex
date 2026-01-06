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

/**
 * Generate a PDF from guide data
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

  // Helper to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPos + height > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper to wrap text
  const addWrappedText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;

    for (const line of lines) {
      checkPageBreak(lineHeight);
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    }
    yPos += 2; // Add small spacing after text block
  };

  // Cover page
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(guide.title, contentWidth);
  let titleY = 35;
  for (const line of titleLines) {
    doc.text(line, margin, titleY);
    titleY += 12;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${guide.tool} | ${guide.skillLevel}`, margin, titleY + 5);

  yPos = 100;

  // Description
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  const descLines = doc.splitTextToSize(guide.description, contentWidth);
  for (const line of descLines) {
    doc.text(line, margin, yPos);
    yPos += 6;
  }

  yPos += 15;

  // Guide metadata
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Read Time: ${guide.readTime} min`, margin + 5, yPos + 10);
  doc.text(`Lessons: ${guide.lessons?.length || 0}`, margin + 50, yPos + 10);
  doc.text(`Level: ${guide.skillLevel}`, margin + 95, yPos + 10);

  yPos += 40;

  // Table of Contents
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, yPos);
  yPos += 10;

  if (guide.lessons && guide.lessons.length > 0) {
    // Group lessons by module
    const moduleGroups = new Map<string, typeof guide.lessons>();
    for (const lesson of guide.lessons) {
      const module = lesson.module || 'general';
      if (!moduleGroups.has(module)) {
        moduleGroups.set(module, []);
      }
      moduleGroups.get(module)!.push(lesson);
    }

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

    for (const [moduleId, lessons] of Array.from(moduleGroups.entries())) {
      checkPageBreak(20);

      // Module header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text(moduleNames[moduleId] || moduleId, margin, yPos);
      yPos += 7;

      // Lessons in module
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      for (const lesson of lessons) {
        checkPageBreak(6);
        doc.text(`${lesson.order}. ${lesson.title}`, margin + 5, yPos);
        yPos += 6;
      }
      yPos += 5;
    }
  }

  // Start new page for lessons
  doc.addPage();
  yPos = margin;

  // Lesson content
  if (guide.lessons && guide.lessons.length > 0) {
    for (const lesson of guide.lessons) {
      checkPageBreak(30);

      // Lesson header
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, yPos, contentWidth, 15, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Lesson ${lesson.order}: ${lesson.title}`, margin + 5, yPos + 10);
      yPos += 25;

      // Duration
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Duration: ${lesson.duration} min`, margin, yPos);
      yPos += 8;

      // Process sections if available
      if (lesson.sections && Array.isArray(lesson.sections)) {
        for (const section of lesson.sections) {
          checkPageBreak(15);

          switch (section.type) {
            case 'intro':
            case 'text':
              if (section.content) {
                addWrappedText(section.content, 10, 'normal');
                yPos += 3;
              }
              break;

            case 'heading':
              if (section.content) {
                yPos += 3;
                addWrappedText(section.content, section.level === 'h2' ? 14 : 12, 'bold');
                yPos += 2;
              }
              break;

            case 'steps':
              if (section.steps && Array.isArray(section.steps)) {
                for (const step of section.steps) {
                  checkPageBreak(20);

                  // Step title
                  doc.setFillColor(245, 245, 245);
                  doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
                  doc.setTextColor(0, 0, 0);
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`Step ${step.number}: ${step.title}`, margin + 3, yPos + 7);
                  yPos += 13;

                  // Step content
                  if (step.content && Array.isArray(step.content)) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    for (const item of step.content) {
                      checkPageBreak(6);
                      const bulletLines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
                      for (const line of bulletLines) {
                        doc.text(line, margin + 3, yPos);
                        yPos += 5;
                      }
                    }
                    yPos += 3;
                  }
                }
              }
              break;

            case 'callout':
              checkPageBreak(25);
              const bgColor = section.calloutType === 'warning' ? [255, 243, 205] : [219, 234, 254];
              const borderColor = section.calloutType === 'warning' ? [245, 158, 11] : [59, 130, 246];

              doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);

              // Calculate callout height
              const calloutText = section.content || '';
              const calloutLines = doc.splitTextToSize(calloutText, contentWidth - 20);
              const calloutHeight = Math.max(25, calloutLines.length * 5 + 15);

              doc.roundedRect(margin, yPos, contentWidth, calloutHeight, 2, 2, 'F');
              doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
              doc.setLineWidth(0.5);
              doc.line(margin, yPos, margin, yPos + calloutHeight);

              if (section.title) {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(section.title, margin + 5, yPos + 7);
                yPos += 10;
              }

              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              for (const line of calloutLines) {
                doc.text(line, margin + 5, yPos + 3);
                yPos += 5;
              }
              yPos += 5;
              break;

            case 'code':
              checkPageBreak(20);
              doc.setFillColor(30, 30, 30);
              const codeContent = section.code || section.content || '';
              const codeLines = codeContent.split('\n');
              const codeHeight = Math.max(15, codeLines.length * 4 + 10);

              doc.roundedRect(margin, yPos, contentWidth, codeHeight, 2, 2, 'F');

              doc.setTextColor(220, 220, 220);
              doc.setFontSize(8);
              doc.setFont('courier', 'normal');
              let codeY = yPos + 5;
              for (const line of codeLines.slice(0, 15)) { // Limit lines
                doc.text(line.substring(0, 80), margin + 3, codeY); // Limit chars
                codeY += 4;
              }
              yPos += codeHeight + 5;
              doc.setFont('helvetica', 'normal');
              break;

            case 'list':
              if (section.items && Array.isArray(section.items)) {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                for (const item of section.items) {
                  checkPageBreak(6);
                  const listLines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
                  for (const line of listLines) {
                    doc.text(line, margin + 3, yPos);
                    yPos += 5;
                  }
                }
                yPos += 3;
              }
              break;
          }
        }
      } else if (lesson.content) {
        // Legacy content format - simple text
        addWrappedText(lesson.content.replace(/<[^>]*>/g, ''), 10);
      }

      yPos += 10;
    }
  }

  // Footer on last page
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('Generated from aiuxdesign.guide', margin, pageHeight - 10);
  doc.text(`Downloaded: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, pageHeight - 10);

  // Return as ArrayBuffer
  return doc.output('arraybuffer');
}
