const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: false });

const communicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['memo', 'announcement', 'advert', 'official-letter', 'draft'],
    required: true,
    index: true,
  },

  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },

  fields: { type: mongoose.Schema.Types.Mixed, default: {} },

  advertKind: {
    type: String,
    enum: ['services', 'products', 'custom', null],
    default: null,
  },

  images: [imageSchema],

  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  },
  publishedAt: { type: Date, default: null },

  emailedAt: { type: Date, default: null },
  emailRecipients: [String],
  smsedAt: { type: Date, default: null },
  smsRecipients: [String],

  slug: { type: String, index: true, sparse: true, unique: true },
  isPublic: { type: Boolean, default: false, index: true },
  viewCount: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HdmUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HdmUser' },
}, { timestamps: true, collection: 'hdm_communications' });

communicationSchema.index({ type: 1, status: 1, createdAt: -1 });
communicationSchema.index({ isPublic: 1, status: 1, publishedAt: -1 });

communicationSchema.pre('save', function (next) {
  if ((this.isModified('title') || !this.slug) && this.title) {
    const base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = this._id ? this._id.toString().slice(-6) : Date.now().toString(36).slice(-6);
    this.slug = `${base}-${suffix}`;
  }
  next();
});

module.exports = mongoose.model('HdmCommunication', communicationSchema);