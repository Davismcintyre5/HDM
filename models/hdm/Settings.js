const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  ai: {
    enabled: { type: Boolean, default: false },
    greeting: { type: String, default: "Hi! I'm HDM AI. Ask me about our services, apps, or projects." },
    widgetColor: { type: String, default: '#1e6ef0' },
    widgetPosition: { type: String, enum: ['left', 'right'], default: 'right' },
  },
}, { timestamps: true, collection: 'hdm_settings' });

module.exports = mongoose.model('HdmSettings', settingsSchema);