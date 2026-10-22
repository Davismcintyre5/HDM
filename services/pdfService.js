const PDFDocument = require('pdfkit');
const axios = require('axios');

const imageCache = new Map();
const IMAGE_CACHE_TTL = 5 * 60 * 1000;

const fetchImageBuffer = async (url) => {
  if (!url) return null;

  const cached = imageCache.get(url);
  if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TTL) {
    return cached.buffer;
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HDM-PDF/1.0)',
      },
    });
    const buffer = Buffer.from(response.data);
    imageCache.set(url, { buffer, timestamp: Date.now() });
    return buffer;
  } catch (error) {
    console.error('fetchImageBuffer failed:', url, '→', error.message);
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
  stampLine: '#000000',
  stampDate: '#1e6ef0',
};

const buildAddressLine = (brand) => {
  const parts = [];
  if (brand.poBox) parts.push(brand.poBox);
  if (brand.city || brand.country) {
    const location = [brand.city, brand.country].filter(Boolean).join(', ');
    parts.push(location);
  }
  return parts.join('  ·  ');
};

const formatDateDDMMYYYY = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/* ============================================================
   Watermark — faint logo centered on the page
   ============================================================ */
const drawWatermark = async (doc, brand) => {
  if (!brand.logo) return;

  const imgBuffer = await fetchImageBuffer(brand.logo);
  if (!imgBuffer) return;

  try {
    const img = doc.openImage(imgBuffer);
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const maxSize = Math.min(pageWidth, pageHeight) * 0.55;
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const w = img.width * scale;
    const h = img.height * scale;

    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;

    doc.save();
    doc.opacity(0.06);
    doc.image(imgBuffer, x, y, { width: w, height: h });
    doc.restore();
  } catch (err) {
    console.error('Failed to place watermark:', err.message);
  }
};

/* ============================================================
   Letterhead
   ============================================================ */
const drawLetterhead = async (doc, brand, { compact = false } = {}) => {
  const pageWidth = doc.page.width;
  const marginX = compact ? 32 : 48;
  const contentWidth = pageWidth - marginX * 2;

  let cursorY = compact ? 28 : 40;

  const logoSize = compact ? 44 : 60;
  let logoRendered = false;

  if (brand.logo) {
    const imgBuffer = await fetchImageBuffer(brand.logo);
    if (imgBuffer) {
      try {
        const img = doc.openImage(imgBuffer);
        const scale = Math.min(logoSize / img.width, logoSize / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;

        doc.image(imgBuffer, marginX, cursorY, { width: w, height: h });
        logoRendered = true;
      } catch (err) {
        console.error('Failed to place logo:', err.message);
      }
    }
  }

  const textLeft = logoRendered ? marginX + logoSize + 12 : marginX;
  const textWidth = contentWidth - (textLeft - marginX);

  doc
    .font('Helvetica-Bold')
    .fontSize(compact ? 14 : 16)
    .fillColor(COLORS.primary)
    .text(brand.name || 'HDM Technologies', textLeft, cursorY, {
      width: textWidth,
      align: 'left',
      lineBreak: false,
    });

  let textCursor = cursorY + (compact ? 18 : 22);

  if (brand.tagline) {
    doc
      .font('Helvetica-Oblique')
      .fontSize(compact ? 7.5 : 8.5)
      .fillColor(COLORS.muted)
      .text(brand.tagline, textLeft, textCursor, {
        width: textWidth,
        align: 'left',
        lineBreak: false,
      });
    textCursor += compact ? 11 : 13;
  }

  const addressLine = buildAddressLine(brand);
  if (addressLine) {
    doc
      .font('Helvetica')
      .fontSize(compact ? 7 : 8)
      .fillColor(COLORS.text)
      .text(addressLine, textLeft, textCursor, {
        width: textWidth,
        align: 'left',
        lineBreak: false,
      });
    textCursor += compact ? 10 : 11;
  }

  const contactBits = [];
  if (brand.email) contactBits.push(brand.email);
  if (brand.website) contactBits.push(brand.website);
  if (brand.phone) contactBits.push(brand.phone);

  if (contactBits.length) {
    doc
      .font('Helvetica')
      .fontSize(compact ? 7 : 8)
      .fillColor(COLORS.accent)
      .text(contactBits.join('  ·  '), textLeft, textCursor, {
        width: textWidth,
        align: 'left',
        lineBreak: false,
      });
    textCursor += compact ? 10 : 11;
  }

  cursorY = Math.max(cursorY + logoSize, textCursor + (compact ? 4 : 6));

  doc.rect(0, 0, pageWidth, 4).fill(COLORS.primary);

  doc
    .strokeColor(COLORS.primary)
    .lineWidth(1.5)
    .moveTo(marginX, cursorY)
    .lineTo(pageWidth - marginX, cursorY)
    .stroke();

  doc
    .strokeColor(COLORS.accent)
    .lineWidth(0.5)
    .moveTo(marginX, cursorY + 2)
    .lineTo(pageWidth - marginX, cursorY + 2)
    .stroke();

  return cursorY + (compact ? 10 : 14);
};

/* ============================================================
   Stamp / seal — image with date ABOVE the line
   opts.date: Date | ISO string | null (defaults to now)
   ============================================================ */
const drawStamp = async (
  doc,
  imageUrl,
  { x, y, size = 70, showDate = false, date = null } = {}
) => {
  if (!imageUrl) return false;

  const imgBuffer = await fetchImageBuffer(imageUrl);
  if (!imgBuffer) return false;

  try {
    const img = doc.openImage(imgBuffer);
    const scale = Math.min(size / img.width, size / img.height, 1);
    const w = img.width * scale;
    const h = img.height * scale;

    doc.image(imgBuffer, x, y, { width: w, height: h });

    if (showDate) {
      const when = date ? new Date(date) : new Date();
      const dateStr = formatDateDDMMYYYY(when);
      if (!dateStr) return true;

      const lineY = y + h + 24;
      const lineX1 = x - 5;
      const lineX2 = x + w + 5;

      doc.font('Helvetica-Bold').fontSize(10);
      const dateWidth = doc.widthOfString(dateStr);

      doc
        .fillColor(COLORS.stampDate)
        .text(dateStr, x + w / 2 - dateWidth / 2, lineY - 15, {
          lineBreak: false,
        });

      doc
        .strokeColor(COLORS.stampLine)
        .lineWidth(1)
        .moveTo(lineX1, lineY)
        .lineTo(lineX2, lineY)
        .stroke();
    }

    return true;
  } catch (err) {
    console.error('Failed to place stamp/seal:', err.message);
    return false;
  }
};

/* ============================================================
   Footer — stamp + date on the RIGHT, seal on the LEFT
   ============================================================ */
const drawFooter = async (
  doc,
  brand,
  {
    footerNote,
    pageNumber,
    totalPages,
    showStamp = false,
    showSeal = false,
    stampDate = null,
    sealDate = null,
  } = {}
) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;
  const footerY = pageHeight - 70;

  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .moveTo(marginX, footerY)
    .lineTo(pageWidth - marginX, footerY)
    .stroke();

  const lines = [];
  if (footerNote) lines.push(footerNote);
  lines.push(
    `© ${new Date().getFullYear()} ${brand.name || 'HDM Technologies'}. All rights reserved.`
  );

  const contactBits = [];
  if (brand.email) contactBits.push(brand.email);
  if (brand.phone) contactBits.push(brand.phone);
  if (brand.website) contactBits.push(brand.website);
  if (contactBits.length) lines.push(contactBits.join('  ·  '));

  if (pageNumber && totalPages) {
    lines.push(`Page ${pageNumber} of ${totalPages}`);
  }

  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(lines.join('\n'), marginX, footerY + 10, {
      width: contentWidth,
      align: 'center',
      lineGap: 2,
    });

  // Seal — bottom-LEFT, no date
  if (showSeal && brand.sealUrl) {
    await drawStamp(doc, brand.sealUrl, {
      x: marginX,
      y: footerY - 140,
      size: 70,
      showDate: false,
      date: sealDate,
    });
  }

  // Stamp — bottom-RIGHT, with date
  if (showStamp && brand.stampUrl) {
    await drawStamp(doc, brand.stampUrl, {
      x: pageWidth - marginX - 70,
      y: footerY - 140,
      size: 70,
      showDate: true,
      date: stampDate,
    });
  }
};

/* ============================================================
   buildTablePDF
   ============================================================ */
const buildTablePDF = async ({
  title,
  meta,
  headers,
  rows,
  brand,
  footerNote,
  showStamp = false,
  showSeal = false,
  stampDate = null,
  sealDate = null,
}) => {
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
      const footerHeight = showStamp || showSeal ? 230 : 70;

      await drawWatermark(doc, b);

      let cursorY = await drawLetterhead(doc, b);
      cursorY += 10;

      doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(COLORS.primary)
        .text(title, marginX, cursorY, {
          width: contentWidth,
          align: 'center',
          characterSpacing: 2,
        });

      cursorY = doc.y + 10;

      if (meta && meta.length) {
        doc.font('Helvetica').fontSize(9).fillColor(COLORS.muted);
        const metaLine = meta
          .map((m) => `${m.label}: ${m.value}`)
          .join('     •     ');
        doc.text(metaLine, marginX, cursorY, {
          width: contentWidth,
          align: 'center',
        });
        cursorY = doc.y + 20;
      }

      if (!headers || !headers.length) {
        await drawFooter(doc, b, {
          footerNote,
          showStamp,
          showSeal,
          stampDate,
          sealDate,
        });
        doc.end();
        return;
      }

      const headerRowHeight = 26;
      const rowHeight = 24;
      const colCount = headers.length;
      const colWidth = contentWidth / colCount;

      const drawTableHeader = () => {
        const y = cursorY;
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

      for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];

        if (cursorY + rowHeight > pageHeight - footerHeight - 20) {
          await drawFooter(doc, b, {
            footerNote,
            showStamp,
            showSeal,
            stampDate,
            sealDate,
          });
          doc.addPage();
          await drawWatermark(doc, b);
          cursorY = await drawLetterhead(doc, b);
          cursorY += 10;
          drawTableHeader();
        }

        const y = cursorY;

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

        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.4)
          .moveTo(marginX, y + rowHeight)
          .lineTo(pageWidth - marginX, y + rowHeight)
          .stroke();

        cursorY = y + rowHeight;
      }

      const tableHeight = rows.length * rowHeight + headerRowHeight;
      doc
        .strokeColor(COLORS.border)
        .lineWidth(0.7)
        .rect(marginX, cursorY - tableHeight, contentWidth, tableHeight)
        .stroke();

      await drawFooter(doc, b, {
        footerNote,
        showStamp,
        showSeal,
        stampDate,
        sealDate,
      });

      doc.end();
    } catch (err) {
      console.error('buildTablePDF error:', err);
      reject(err);
    }
  });
};

module.exports = {
  buildTablePDF,
  fetchImageBuffer,
  drawLetterhead,
  drawFooter,
  drawStamp,
  drawWatermark,
  buildAddressLine,
  formatDateDDMMYYYY,
};