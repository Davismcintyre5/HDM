const HdmCommunication = require('../../models/hdm/Communication');
const HdmService = require('../../models/hdm/Service');
const HdmProject = require('../../models/hdm/Project');
const cloudinaryService = require('../../services/cloudinaryService');
const emailService = require('../../services/emailService');
const smsService = require('../../services/smsService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

/* ============================================================
   Auto-generate advert body from services or products
   ============================================================ */
const generateAdvertBody = async (advertKind) => {
  if (advertKind === 'services') {
    const services = await HdmService.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    if (!services.length) return '';

    const cards = services
      .map(
        (s) => `
        <div class="advert-card">
          <div class="advert-card-icon">${s.icon || '⚡'}</div>
          <h3 class="advert-card-title">${s.title || ''}</h3>
          <p class="advert-card-desc">${s.description || ''}</p>
        </div>`
      )
      .join('');

    return `<div class="advert-grid">${cards}</div>`;
  }

  if (advertKind === 'products') {
    const projects = await HdmProject.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    if (!projects.length) return '';

    const cards = projects
      .map((p) => {
        const tech =
          Array.isArray(p.technologies) && p.technologies.length
            ? `<div class="advert-card-tech">${p.technologies.join(' · ')}</div>`
            : '';
        return `
        <div class="advert-card">
          <h3 class="advert-card-title">${p.name || ''}</h3>
          <p class="advert-card-desc">${p.description || ''}</p>
          ${tech}
        </div>`;
      })
      .join('');

    return `<div class="advert-grid">${cards}</div>`;
  }

  return '';
};

/* ============================================================
   List
   ============================================================ */
exports.list = asyncHandler(async (req, res) => {
  const { type, status, search, limit = 100 } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (search) {
    const re = new RegExp(search.trim(), 'i');
    filter.$or = [{ title: re }, { subtitle: re }, { body: re }];
  }

  const items = await HdmCommunication.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 100, 500))
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  const [total, drafts, published, archived] = await Promise.all([
    HdmCommunication.countDocuments(),
    HdmCommunication.countDocuments({ status: 'draft' }),
    HdmCommunication.countDocuments({ status: 'published' }),
    HdmCommunication.countDocuments({ status: 'archived' }),
  ]);

  return ok(res, {
    communications: items,
    stats: { total, drafts, published, archived },
  });
});

/* ============================================================
   Get one
   ============================================================ */
exports.get = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
  if (!item) throw ApiError.notFound('Communication not found');
  return ok(res, item);
});

/* ============================================================
   Create
   ============================================================ */
exports.create = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    subtitle,
    body,
    fields,
    advertKind,
  } = req.body;

  if (!type) throw ApiError.badRequest('type is required');
  if (!title?.trim()) throw ApiError.badRequest('title is required');

  let finalBody = body || '';

  // Auto-generate body for adverts bundling services/products
  if (type === 'advert' && (advertKind === 'services' || advertKind === 'products')) {
    finalBody = await generateAdvertBody(advertKind);
  }

  const item = await HdmCommunication.create({
    type,
    title: title.trim(),
    subtitle: subtitle || '',
    body: finalBody,
    fields: fields || {},
    advertKind: advertKind || null,
    status: 'draft',
    createdBy: req.userId,
    updatedBy: req.userId,
  });

  return created(res, item);
});

/* ============================================================
   Update
   ============================================================ */
exports.update = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  const {
    title,
    subtitle,
    body,
    fields,
    advertKind,
    isPublic,
  } = req.body;

  if (title !== undefined) item.title = title;
  if (subtitle !== undefined) item.subtitle = subtitle;
  if (body !== undefined && item.type !== 'advert') item.body = body;
  if (fields !== undefined) item.fields = fields;
  if (advertKind !== undefined) item.advertKind = advertKind;
  if (isPublic !== undefined) item.isPublic = !!isPublic;

  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

/* ============================================================
   Regenerate advert body (re-snapshot services/products)
   ============================================================ */
exports.regenerateAdvert = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');
  if (item.type !== 'advert') {
    throw ApiError.badRequest('Only adverts can be regenerated');
  }
  if (item.advertKind !== 'services' && item.advertKind !== 'products') {
    throw ApiError.badRequest('Only services/products adverts can be regenerated');
  }

  item.body = await generateAdvertBody(item.advertKind);
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

/* ============================================================
   Publish / Unpublish / Archive
   ============================================================ */
exports.publish = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  item.status = 'published';
  item.publishedAt = new Date();
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

exports.unpublish = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  item.status = 'draft';
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

exports.archive = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  item.status = 'archived';
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

/* ============================================================
   Delete (also cleans Cloudinary images)
   ============================================================ */
exports.remove = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  if (item.images?.length) {
    await Promise.all(
      item.images.map((img) =>
        cloudinaryService.deleteFile(img.publicId).catch(() => {})
      )
    );
  }

  await item.deleteOne();
  return ok(res, { message: 'Communication deleted' });
});

/* ============================================================
   Upload image
   ============================================================ */
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image uploaded');

  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  const result = await cloudinaryService.uploadFile(
    req.file.buffer,
    req.file.originalname,
    'communications'
  );

  item.images.push({
    url: result.secure_url,
    publicId: result.public_id,
    caption: req.body.caption || '',
    order: item.images.length,
  });
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

/* ============================================================
   Remove image
   ============================================================ */
exports.removeImage = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  const { publicId } = req.params;
  const idx = item.images.findIndex((img) => img.publicId === publicId);
  if (idx === -1) throw ApiError.notFound('Image not found in this communication');

  await cloudinaryService.deleteFile(publicId).catch(() => {});
  item.images.splice(idx, 1);
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, item);
});

/* ============================================================
   Send email
   body: { recipients: [emails], subject?, message? }
   ============================================================ */
exports.sendEmail = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  const { recipients } = req.body;
  if (!Array.isArray(recipients) || !recipients.length) {
    throw ApiError.badRequest('recipients array is required');
  }

  const subject = req.body.subject || item.title;
  const html = req.body.message || item.body || `<h2>${item.title}</h2>`;

  const results = await Promise.all(
    recipients.map((to) =>
      emailService.send({
        to,
        subject,
        html,
      })
    )
  );

  const sentCount = results.filter((r) => r.ok).length;

  item.emailedAt = new Date();
  item.emailRecipients = [
    ...(item.emailRecipients || []),
    ...recipients.filter((_, i) => results[i].ok),
  ];
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, {
    message: `Email sent to ${sentCount} of ${recipients.length} recipient(s)`,
    sent: sentCount,
    failed: recipients.length - sentCount,
  });
});

/* ============================================================
   Send SMS
   body: { recipients: [phones], message? }
   ============================================================ */
exports.sendSms = asyncHandler(async (req, res) => {
  const item = await HdmCommunication.findById(req.params.id);
  if (!item) throw ApiError.notFound('Communication not found');

  const { recipients } = req.body;
  if (!Array.isArray(recipients) || !recipients.length) {
    throw ApiError.badRequest('recipients array is required');
  }

  const content =
    req.body.message ||
    item.title ||
    'You have a new message from HDM Technologies.';

  const results = await Promise.all(
    recipients.map((to) => smsService.send({ to, content }))
  );

  const sentCount = results.filter((r) => r.ok).length;

  item.smsedAt = new Date();
  item.smsRecipients = [
    ...(item.smsRecipients || []),
    ...recipients.filter((_, i) => results[i].ok),
  ];
  item.updatedBy = req.userId;
  await item.save();

  return ok(res, {
    message: `SMS sent to ${sentCount} of ${recipients.length} recipient(s)`,
    sent: sentCount,
    failed: recipients.length - sentCount,
  });
});