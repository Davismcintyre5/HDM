const defaults = {
  name: 'HDM Technologies',
  url: 'https://hdm.co.ke',
  logo: '',
  email: 'info@hdm.co.ke',
  phone: '+254 768 784 909',
  whatsapp: '+254 768 784 909',
  primaryColor: '#0a1628',
  accentColor: '#1e6ef0',
  textColor: '#1f2937',
  mutedColor: '#6b7280',
  bgColor: '#f4f4f5',
  cardColor: '#ffffff',
};

const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const layout = (brand, content) => {
  const b = { ...defaults, ...brand };
  const logoHtml = b.logo
    ? `<img src="${escape(b.logo)}" alt="${escape(b.name)}" style="max-height:48px;max-width:180px;display:block;margin:0 auto" />`
    : `<div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px">${escape(b.name)}</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escape(b.name)}</title>
</head>
<body style="margin:0;padding:0;background:${b.bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${b.textColor};line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${b.bgColor};padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${b.cardColor};border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06)">
          <tr>
            <td style="background:${b.primaryColor};padding:28px 32px;text-align:center">
              ${logoHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;font-size:15px;color:${b.textColor}">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;font-size:12px;color:${b.mutedColor};text-align:center">
              <div style="margin-bottom:10px">
                <strong style="color:${b.textColor}">${escape(b.name)}</strong>
              </div>
              <div style="margin-bottom:6px">
                <a href="mailto:${escape(b.email)}" style="color:${b.accentColor};text-decoration:none">${escape(b.email)}</a>
                &nbsp;·&nbsp;
                <a href="tel:${escape(b.phone).replace(/\s/g, '')}" style="color:${b.accentColor};text-decoration:none">${escape(b.phone)}</a>
              </div>
              <div style="margin-bottom:10px">
                <a href="https://wa.me/${escape(b.whatsapp).replace(/\D/g, '')}" style="color:${b.accentColor};text-decoration:none">WhatsApp</a>
                &nbsp;·&nbsp;
                <a href="${escape(b.url)}" style="color:${b.accentColor};text-decoration:none">${escape(b.url.replace(/^https?:\/\//, ''))}</a>
              </div>
              <div style="color:#9ca3af;font-size:11px">
                © ${new Date().getFullYear()} ${escape(b.name)}. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const button = (href, label, color) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0">
    <tr>
      <td style="background:${color};border-radius:8px">
        <a href="${escape(href)}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px">${escape(label)}</a>
      </td>
    </tr>
  </table>`;

const divider = () => `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />`;

const h1 = (text) => `<h1 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 16px">${escape(text)}</h1>`;

const p = (text) => `<p style="margin:0 0 16px;color:#374151;font-size:15px">${escape(text)}</p>`;

const credentialsBlock = (email, password) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border-radius:10px;padding:0;margin:20px 0;border:1px solid #e5e7eb">
    <tr><td style="padding:16px 20px;font-size:14px;color:#374151;font-family:monospace">
      <div style="margin-bottom:10px"><strong style="font-family:sans-serif;color:#0f172a">Email:</strong> ${escape(email)}</div>
      <div style="margin-bottom:10px"><strong style="font-family:sans-serif;color:#0f172a">Password:</strong> ${escape(password)}</div>
    </td></tr>
  </table>`;

const warningBlock = (text) => `
  <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;padding:12px 16px;margin:20px 0;font-size:13px;color:#78350f">
    ${escape(text)}
  </div>`;

const contactAdminNotification = ({ brand, name, email, message, receivedAt, adminUrl }) => {
  const b = { ...defaults, ...brand };
  const subject = `New contact from ${name}`;
  const content = `
    ${h1('New Contact Message')}
    ${p('You have received a new message from your website contact form.')}
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border-radius:10px;padding:0;margin:20px 0;border:1px solid #e5e7eb">
      <tr><td style="padding:16px 20px;font-size:14px;color:#374151">
        <div style="margin-bottom:10px"><strong style="color:#0f172a">Name:</strong> ${escape(name)}</div>
        <div style="margin-bottom:10px"><strong style="color:#0f172a">Email:</strong> <a href="mailto:${escape(email)}" style="color:${b.accentColor}">${escape(email)}</a></div>
        <div style="margin-bottom:10px"><strong style="color:#0f172a">Received:</strong> ${escape(receivedAt)}</div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;white-space:pre-wrap;color:#1f2937">${escape(message)}</div>
      </td></tr>
    </table>
    ${button(`mailto:${email}`, `Reply to ${name}`, b.accentColor)}
    ${adminUrl ? `<p style="font-size:13px;color:${b.mutedColor};margin:0"><a href="${escape(adminUrl)}" style="color:${b.accentColor}">Open in admin panel</a></p>` : ''}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `New contact from ${name} <${email}>\n\nReceived: ${receivedAt}\n\n${message}`,
  };
};

const contactAutoReply = ({ brand, name, message }) => {
  const b = { ...defaults, ...brand };
  const subject = `We received your message — ${b.name}`;
  const content = `
    ${h1(`Thanks, ${name}!`)}
    ${p(`We've received your message and our team will get back to you shortly.`)}
    ${p('Here is a copy of what you sent us:')}
    <div style="background:#f9fafb;border-left:4px solid ${b.accentColor};border-radius:6px;padding:16px 20px;margin:16px 0;font-size:14px;color:#374151;white-space:pre-wrap">${escape(message)}</div>
    ${p('If you need urgent assistance, reach us directly:')}
    <div style="font-size:14px;color:#374151">
      <div style="margin-bottom:6px">📧 <a href="mailto:${escape(b.email)}" style="color:${b.accentColor};text-decoration:none">${escape(b.email)}</a></div>
      <div style="margin-bottom:6px">📞 <a href="tel:${escape(b.phone).replace(/\s/g, '')}" style="color:${b.accentColor};text-decoration:none">${escape(b.phone)}</a></div>
      <div>💬 <a href="https://wa.me/${escape(b.whatsapp).replace(/\D/g, '')}" style="color:${b.accentColor};text-decoration:none">WhatsApp us</a></div>
    </div>
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Thanks, ${name}!\n\nWe received your message:\n\n${message}\n\nContact: ${b.email} | ${b.phone}`,
  };
};

const backupCompleted = ({ brand, fileName, fileUrl, fileSize, collections, completedAt, type }) => {
  const b = { ...defaults, ...brand };
  const subject = `Backup completed — ${fileName}`;
  const sizeKb = (fileSize / 1024).toFixed(1);
  const content = `
    ${h1('Backup Completed')}
    ${p('An automated backup ran successfully and has been stored on Cloudinary.')}
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#374151;margin:20px 0">
      <tr><td style="padding:8px 0;color:${b.mutedColor};width:140px">File:</td><td>${escape(fileName)}</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor}">Size:</td><td>${escape(sizeKb)} KB</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor}">Type:</td><td>${escape(type)}</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor}">Completed:</td><td>${escape(completedAt)}</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor};vertical-align:top">Collections:</td><td>${escape((collections || []).join(', '))}</td></tr>
    </table>
    ${button(fileUrl, 'Download Backup', b.accentColor)}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Backup completed: ${fileName} (${sizeKb} KB)\nDownload: ${fileUrl}`,
  };
};

const backupFailed = ({ brand, fileName, error, attemptedAt, adminUrl }) => {
  const b = { ...defaults, ...brand };
  const subject = `Backup FAILED — ${b.name}`;
  const content = `
    ${h1('Backup Failed')}
    <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:6px;padding:14px 18px;margin:16px 0;font-size:14px;color:#991b1b">
      <strong>Action required</strong> — the automated backup did not complete.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#374151;margin:20px 0">
      <tr><td style="padding:8px 0;color:${b.mutedColor};width:140px">Attempted:</td><td>${escape(attemptedAt)}</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor}">File:</td><td>${escape(fileName)}</td></tr>
      <tr><td style="padding:8px 0;color:${b.mutedColor};vertical-align:top">Error:</td><td style="color:#991b1b">${escape(error)}</td></tr>
    </table>
    ${adminUrl ? button(adminUrl, 'Open Backup Panel', '#dc2626') : ''}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Backup FAILED\n\nAttempted: ${attemptedAt}\nFile: ${fileName}\nError: ${error}`,
  };
};

const mongoStorageAlert = ({ brand, usedPercent, usedFormatted, limitFormatted, tier, adminUrl }) => {
  const b = { ...defaults, ...brand };
  const subject = `MongoDB storage at ${usedPercent}% — ${b.name}`;
  const color = usedPercent >= 90 ? '#dc2626' : usedPercent >= 80 ? '#f59e0b' : '#10b981';
  const content = `
    ${h1('MongoDB Storage Alert')}
    ${p(`Your MongoDB storage has reached ${usedPercent}% of the ${tier} tier limit.`)}
    <div style="background:#f9fafb;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
      <div style="font-size:42px;font-weight:700;color:${color};line-height:1">${usedPercent}%</div>
      <div style="font-size:13px;color:${b.mutedColor};margin-top:8px">${escape(usedFormatted)} of ${escape(limitFormatted)}</div>
      <div style="height:8px;background:#e5e7eb;border-radius:4px;margin-top:16px;overflow:hidden">
        <div style="height:100%;width:${Math.min(usedPercent, 100)}%;background:${color}"></div>
      </div>
    </div>
    ${p('Consider upgrading your tier or archiving old data before the limit is reached.')}
    ${adminUrl ? button(adminUrl, 'Open MongoDB Panel', b.accentColor) : ''}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `MongoDB storage at ${usedPercent}%\n${usedFormatted} of ${limitFormatted} (${tier} tier)`,
  };
};

const smartgenWelcomeVerify = ({ brand, name, verifyUrl, expiresInHours = 24 }) => {
  const b = { ...defaults, ...brand };
  const subject = `Welcome to ${b.name} — verify your email`;
  const content = `
    ${h1(`Welcome, ${name}!`)}
    ${p(`Thanks for signing up with ${b.name}. Please confirm your email address to activate your account.`)}
    ${button(verifyUrl, 'Verify My Email', b.accentColor)}
    ${p(`This link expires in ${expiresInHours} hours.`)}
    ${divider()}
    <p style="font-size:13px;color:${b.mutedColor};margin:0">
      If the button doesn't work, copy this link into your browser:<br />
      <a href="${escape(verifyUrl)}" style="color:${b.accentColor};word-break:break-all">${escape(verifyUrl)}</a>
    </p>
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Welcome, ${name}!\n\nVerify your email: ${verifyUrl}\n\nThis link expires in ${expiresInHours} hours.`,
  };
};

const smartgenPasswordReset = ({ brand, name, resetUrl, expiresInHours = 1 }) => {
  const b = { ...defaults, ...brand };
  const subject = `Reset your ${b.name} password`;
  const content = `
    ${h1('Password Reset Request')}
    ${p(`Hi ${name}, we received a request to reset your password.`)}
    ${button(resetUrl, 'Reset My Password', b.accentColor)}
    ${p(`This link expires in ${expiresInHours} hour${expiresInHours === 1 ? '' : 's'}.`)}
    ${warningBlock(`If you didn't request this, you can safely ignore this email. Your password won't change.`)}
    ${divider()}
    <p style="font-size:13px;color:${b.mutedColor};margin:0">
      Or copy this link:<br />
      <a href="${escape(resetUrl)}" style="color:${b.accentColor};word-break:break-all">${escape(resetUrl)}</a>
    </p>
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Reset your ${b.name} password\n\n${resetUrl}\n\nExpires in ${expiresInHours}h. If you didn't request this, ignore this email.`,
  };
};

const hdmAdminWelcome = ({ brand, name, email, password, loginUrl }) => {
  const b = { ...defaults, ...brand };
  const subject = `You've been added as an admin — ${b.name}`;
  const content = `
    ${h1(`Welcome, ${name}!`)}
    ${p(`You've been granted admin access to the ${b.name} control panel.`)}
    ${p('Use the credentials below to log in. For security, please change your password immediately after your first login.')}
    ${credentialsBlock(email, password)}
    ${button(loginUrl, 'Open Admin Panel', b.accentColor)}
    ${warningBlock(`Security notice: This password will only be shown once. Delete this email after saving your credentials.`)}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Welcome, ${name}!\n\nYou've been granted admin access to ${b.name}.\n\nEmail: ${email}\nPassword: ${password}\n\nLogin: ${loginUrl}\n\nPlease change your password after first login.`,
  };
};

const smartgenAdminWelcome = ({ brand, name, email, password, loginUrl }) => {
  const b = { ...defaults, ...brand };
  const subject = `You've been added as a SmartGen admin — ${b.name}`;
  const content = `
    ${h1(`Welcome, ${name}!`)}
    ${p(`You've been granted admin access to SmartGen at ${b.name}.`)}
    ${p('Use the credentials below to log in.')}
    ${credentialsBlock(email, password)}
    ${button(loginUrl, 'Open SmartGen', b.accentColor)}
    ${warningBlock(`Security notice: Change your password after first login.`)}
  `;
  return {
    subject,
    html: layout(b, content),
    text: `Welcome, ${name}!\n\nYou've been granted admin access to SmartGen at ${b.name}.\n\nEmail: ${email}\nPassword: ${password}\n\nLogin: ${loginUrl}`,
  };
};

module.exports = {
  contactAdminNotification,
  contactAutoReply,
  backupCompleted,
  backupFailed,
  mongoStorageAlert,
  smartgenWelcomeVerify,
  smartgenPasswordReset,
  hdmAdminWelcome,
  smartgenAdminWelcome,
};