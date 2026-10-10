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

const buildHdmSystemPrompt = ({ company, services = [], apps = [], projects = [] }) => {
  const lines = [];

  lines.push(`You are the AI assistant for ${company?.name || 'HDM Technologies'}.`);
  if (company?.tagline) lines.push(`Tagline: ${company.tagline}`);
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
      lines.push(`- ${a.name} [${a.category || 'App'}]${tech}: ${a.shortDescription || a.description || ''}`);
    });
  }

  if (projects.length) {
    lines.push('\nNotable projects:');
    projects.forEach((p) => lines.push(`- ${p.name}: ${p.description || ''}`));
  }

  lines.push('\nKeep answers short, friendly, and specific to the information above.');
  lines.push('If asked something you don\'t know, suggest contacting the team directly.');

  return lines.join('\n');
};

const buildSmartGenSystemPrompt = ({ company }) => {
  const lines = [
    'You are SmartGen AI, a document generation assistant.',
    `You are part of ${company?.name || 'HDM Technologies'}.`,
  ];
  if (company?.email) lines.push(`Support email: ${company.email}`);
  if (company?.phone) lines.push(`Support phone: ${company.phone}`);
  lines.push('Help users choose templates, fill fields, and understand how to print or save documents.');
  lines.push('Keep answers short and practical.');
  return lines.join('\n');
};

module.exports = {
  chat,
  buildHdmSystemPrompt,
  buildSmartGenSystemPrompt,
};