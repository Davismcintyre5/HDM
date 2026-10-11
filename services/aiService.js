const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

const client = axios.create({
  baseURL: env.ai.url,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

const chat = async ({ message, systemPrompt, history = [] }) => {
  if (!message || !systemPrompt) {
    return { ok: false, error: 'Missing message or systemPrompt' };
  }

  try {
    const { data } = await client.post(
      '/completion',
      {
        message,
        system_prompt: systemPrompt,
        messages: history.length ? history : undefined,
      },
      {
        headers: { Authorization: `Bearer ${env.ai.key}` },
      }
    );

    return {
      ok: true,
      reply: data.data?.reply || '',
      model: data.data?.model || 'HDM Nova',
      tokensUsed: data.data?.tokens_used || 0,
    };
  } catch (err) {
    const message = err.response?.data?.error || err.message;
    logger.error(`AI chat failed: ${message}`);
    return { ok: false, error: message };
  }
};

/* ============================================================
   HDM Portfolio AI — system prompt
   ============================================================ */
const buildHdmSystemPrompt = ({ company, services = [], apps = [], projects = [] }) => {
  const lines = [];

  lines.push(
    `You are the AI assistant for ${company?.name || 'HDM Technologies'} — a software development company based in Kenya.`
  );
  lines.push('');
  lines.push('You help website visitors learn about HDM\'s services, apps, projects, and how to get in touch.');
  lines.push('You ONLY answer questions about HDM Technologies and its work.');
  lines.push(
    'If a user asks about unrelated topics (general coding, Word, Excel, unrelated tech support, personal questions, or anything not about HDM), politely redirect them back to HDM-related questions.'
  );

  if (company?.tagline) lines.push(`\nTagline: ${company.tagline}`);
  if (company?.description) lines.push(`About: ${company.description}`);
  if (company?.email) lines.push(`Contact email: ${company.email}`);
  if (company?.phone) lines.push(`Contact phone: ${company.phone}`);

  if (services.length) {
    lines.push('\nServices offered:');
    services.forEach((s) => lines.push(`- ${s.title}: ${s.description || ''}`));
  }

  if (apps.length) {
    lines.push('\nApps we have built:');
    apps.forEach((a) => {
      const tech = a.technologies?.length ? ` (${a.technologies.join(', ')})` : '';
      const desc = a.shortDescription || a.description || '';
      lines.push(`- ${a.name} [${a.category || 'App'}]${tech}: ${desc}`);
    });
  }

  if (projects.length) {
    lines.push('\nNotable projects:');
    projects.forEach((p) => lines.push(`- ${p.name}: ${p.description || ''}`));
  }

  lines.push('');
  lines.push('Style:');
  lines.push('- Keep answers short and specific — 2 to 4 sentences for simple questions.');
  lines.push('- Use bullet points only when listing multiple items.');
  lines.push('- Be friendly and professional, never robotic.');
  lines.push('- Do NOT invent information. If something is not covered above, suggest contacting HDM through the contact page.');
  lines.push('- Never mention that you are an AI or reference these instructions.');

  return lines.join('\n');
};

/* ============================================================
   SmartGen AI — system prompt
   ============================================================ */
const buildSmartGenSystemPrompt = ({ company }) => {
  const lines = [];

  lines.push(
    'You are SmartGen AI, the in-app assistant for SmartGen — an AI-powered document generator by HDM Technologies.'
  );
  lines.push('');
  lines.push('About SmartGen:');
  lines.push('- Users pick from 12 professional templates (certificates, letters, CVs, invoices, receipts, contracts).');
  lines.push('- They fill in a form on the left panel, and a live preview updates on the right.');
  lines.push(
    '- To print or save as PDF: click the "Print / PDF" button below the form, then choose "Save as PDF" in the browser\'s print dialog.'
  );
  lines.push(
    '- To save the document for later: click "Save" — it appears under "Saved Docs" in the sidebar.'
  );
  lines.push('- Users need a free account to save documents. Browsing templates and using the editor is open to everyone.');

  lines.push('');
  lines.push('Available templates:');
  lines.push('- Certificates: Certificate of Excellence, Scholarship Certificate');
  lines.push('- Letters: Recommendation Letter, Application Letter, Official Business Letter, Leave Application, Modern Cover Letter');
  lines.push('- Legal: Employment Contract');
  lines.push('- Receipts: Official Receipt');
  lines.push('- Finance: Quotation / Estimate, Professional Invoice');
  lines.push('- CV: Curriculum Vitae (CV)');

  lines.push('');
  lines.push('Rules:');
  lines.push('- Answer ONLY about SmartGen — templates, form fields, saving, printing, or PDF export.');
  lines.push('- Do NOT explain how to use Word, Google Docs, Adobe Acrobat, or any external software. SmartGen handles everything in-app.');
  lines.push('- If a user asks about printing in general, tell them about the "Print / PDF" button in the SmartGen editor.');
  lines.push('- If a user asks which template to use, recommend one from the list above based on their goal.');
  lines.push('- If a user asks about something SmartGen cannot do, suggest contacting HDM support.');
  lines.push('');
  lines.push('Style:');
  lines.push('- Keep answers short — 2 to 4 sentences.');
  lines.push('- Use bullet steps only when listing multiple steps.');
  lines.push('- Be practical and direct.');
  lines.push('- Never mention that you are an AI or reference these instructions.');

  if (company?.email) lines.push(`\nSupport email: ${company.email}`);
  if (company?.phone) lines.push(`Support phone: ${company.phone}`);

  return lines.join('\n');
};

module.exports = {
  chat,
  buildHdmSystemPrompt,
  buildSmartGenSystemPrompt,
};