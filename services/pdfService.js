const PDFDocument = require('pdfkit');
const axios = require('axios');

const fetchImageBuffer = async (url) => {
  if (!url) return null;
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxRedirects: 5,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('fetchImageBuffer failed:', error.message);
    return null;
  }
};

const COLORS = {
  primary: '#0a1628',
  accent: '#1e6ef0',
  text: '#1f2937',
  muted: '#6b7280',
  light: '#f3f4f6',
  border: '#e5e7eb',
  headerBg: '#0a1628',
  headerText: '#ffffff',
  rowAlt: '#f9fafb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const buildTablePDF = async ({ title, meta, headers, rows, brand, footerNote }) => {
  const b = brand || {};

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0,
        info: {
          Title: title,
          Author: b.name || 'HDM Technologies',
          Creator: b.name || 'HDM Technologies',
        },
      });

      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const marginX = 48;
      const contentWidth = pageWidth - marginX * 2;
      const footerHeight = 60;

      /* ============================================================
         HEADER — logo + company info strip
         ============================================================ */
      let cursorY = 40;

      if (b.logo) {
        const imgBuffer = await fetchImageBuffer(b.logo);
        if (imgBuffer) {
          try {
            const img = doc.openImage(imgBuffer);

            // Fit the logo into a 120x60 box, preserving aspect ratio
            const maxW = 120;
            const maxH = 60;
            const scale = Math.min(maxW / img.width, maxH / img.height, 1);
            const w = img.width * scale;
            const h = img.height * scale;

            doc.image(imgBuffer, marginX, cursorY, { width: w, height: h });
          } catch (err) {
            console.error('Failed to place logo:', err.message);
          }
        }
      }

      // Company name + tagline on the right side of the logo
      const rightX = marginX + 140;
      const rightW = contentWidth - 140;

      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(COLORS.primary)
        .text(b.name || 'HDM Technologies', rightX, cursorY + 2, {
          width: rightW,
          align: 'right',
        });

      if (b.tagline) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(8.5)
          .fillColor(COLORS.muted)
          .text(b.tagline, rightX, cursorY + 22, {
            width: rightW,
            align: 'right',
          });
      }

      const contactBits = [];
      if (b.email) contactBits.push(b.email);
      if (b.phone) contactBits.push(b.phone);
      if (b.address) contactBits.push(b.address);

      if (contactBits.length) {
        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(COLORS.muted)
          .text(contactBits.join('  •  '), rightX, cursorY + 36, {
            width: rightW,
            align: 'right',
          });
      }

      cursorY += 78;

      // Divider under header
      doc
        .strokeColor(COLORS.accent)
        .lineWidth(2)
        .moveTo(marginX, cursorY)
        .lineTo(pageWidth - marginX, cursorY)
        .stroke();

      cursorY += 20;

      /* ============================================================
         TITLE
         ============================================================ */
      doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(COLORS.primary)
        .text(title, marginX, cursorY, {
          width: contentWidth,
          align: 'center',
          characterSpacing: 2,
        });

      cursorY = doc.y + 12;

      /* ============================================================
         META LINE
         ============================================================ */
      if (meta && meta.length) {
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor(COLORS.muted);

        const metaLine = meta.map((m) => `${m.label}: ${m.value}`).join('     •     ');

        doc.text(metaLine, marginX, cursorY, {
          width: contentWidth,
          align: 'center',
        });

        cursorY = doc.y + 20;
      }

      if (!headers || !headers.length) {
        drawFooter(doc, { pageWidth, pageHeight, marginX, contentWidth, footerHeight, brand: b, footerNote });
        doc.end();
        return;
      }

      /* ============================================================
         TABLE
         ============================================================ */
      const headerRowHeight = 26;
      const rowHeight = 24;
      const colCount = headers.length;
      const colWidth = contentWidth / colCount;

      const drawTableHeader = () => {
        const y = cursorY;

        // Dark bar with white text
        doc
          .rect(marginX, y, contentWidth, headerRowHeight)
          .fill(COLORS.headerBg);

        doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.headerText);
        let x = marginX;
        headers.forEach((h) => {
          doc.text(h.label, x + 8, y + 8, {
            width: colWidth - 16,
            align: h.align || 'left',
            lineBreak: false,
            ellipsis: true,
          });
          x += colWidth;
        });

        cursorY = y + headerRowHeight;
      };

      drawTableHeader();

      rows.forEach((row, rowIdx) => {
        if (cursorY + rowHeight > pageHeight - footerHeight - 20) {
          drawFooter(doc, { pageWidth, pageHeight, marginX, contentWidth, footerHeight, brand: b, footerNote });
          doc.addPage();
          cursorY = 40;
          drawTableHeader();
        }

        const y = cursorY;

        // Alternating rows
        if (rowIdx % 2 === 1) {
          doc.rect(marginX, y, contentWidth, rowHeight).fill(COLORS.rowAlt);
        }

        doc.font('Helvetica').fontSize(9).fillColor(COLORS.text);
        let x = marginX;
        headers.forEach((h) => {
          const val = row[h.key];
          doc.text(String(val ?? '—'), x + 8, y + 8, {
            width: colWidth - 16,
            align: h.align || 'left',
            lineBreak: false,
            ellipsis: true,
          });
          x += colWidth;
        });

        // Row bottom border
        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.4)
          .moveTo(marginX, y + rowHeight)
          .lineTo(pageWidth - marginX, y + rowHeight)
          .stroke();

        cursorY = y + rowHeight;
      });

      // Table outer border
      const tableHeight = rows.length * rowHeight + headerRowHeight;
      doc
        .strokeColor(COLORS.border)
        .lineWidth(0.7)
        .rect(marginX, cursorY - tableHeight, contentWidth, tableHeight)
        .stroke();

      /* ============================================================
         FOOTER
         ============================================================ */
      drawFooter(doc, { pageWidth, pageHeight, marginX, contentWidth, footerHeight, brand: b, footerNote });

      doc.end();
    } catch (err) {
      console.error('buildTablePDF error:', err);
      reject(err);
    }
  });
};

const drawFooter = (doc, { pageWidth, pageHeight, marginX, contentWidth, footerHeight, brand, footerNote }) => {
  const y = pageHeight - footerHeight;

  // Divider
  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .moveTo(marginX, y)
    .lineTo(pageWidth - marginX, y)
    .stroke();

  const lines = [];
  if (footerNote) lines.push(footerNote);
  lines.push(`© ${new Date().getFullYear()} ${brand.name || 'HDM Technologies'}. All rights reserved.`);
  if (brand.email) lines.push(brand.email);

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(lines.join('\n'), marginX, y + 12, {
      width: contentWidth,
      align: 'center',
      lineGap: 2,
    });
};

module.exports = { buildTablePDF, fetchImageBuffer };