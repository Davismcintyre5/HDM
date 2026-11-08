const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Web Apps', 'Mobile', 'Desktop', 'APIs', 'Games', 'Open Source', 'Security', 'Other'],
    default: 'Web Apps',
  },
  technologies: [String],
  icon: { type: String, default: '' },
  screenshots: [String],
  urls: {
    live: { type: String, default: '' },
    github: { type: String, default: '' },
    playstore: { type: String, default: '' },
    appstore: { type: String, default: '' },
  },
  features: [String],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  ratingSource: { type: String, default: '' },
  version: { type: String, default: '1.0.0' },
  baseViews: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['live', 'development', 'coming_soon'],
    default: 'coming_soon',
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'hdm_apps' });

appSchema.index({ category: 1, isActive: 1 });
appSchema.index({ featured: 1, isActive: 1 });

module.exports = mongoose.model('HdmApp', appSchema);