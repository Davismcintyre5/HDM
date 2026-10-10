const mongoose = require('mongoose');

const socialEntry = new mongoose.Schema({
  url: { type: String, default: '' },
  show: { type: Boolean, default: false },
}, { _id: false });

const sectionEntry = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const companySchema = new mongoose.Schema({
  name: { type: String, default: 'HDM Technologies' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  logoDark: { type: String, default: '' },
  favicon: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  whatsappMessage: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  primaryColor: { type: String, default: '#3908e7' },
  secondaryColor: { type: String, default: '#30dd0e' },
  accentColor: { type: String, default: '#10b981' },
  fontFamily: { type: String, default: 'Inter' },

  hero: {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    ctaPrimary: { type: String, default: 'Our Services' },
    ctaPrimaryLink: { type: String, default: '#services' },
    ctaSecondary: { type: String, default: 'Get in Touch' },
    ctaSecondaryLink: { type: String, default: '#contact' },
    backgroundType: { type: String, default: 'gradient' },
    backgroundImage: { type: String, default: '' },
    gradientStart: { type: String, default: '#0a5c8e' },
    gradientEnd: { type: String, default: '#1e3a5f' },
    typingText: [String],
    showLogo: { type: Boolean, default: true },
  },

  social: {
    facebook: { type: socialEntry, default: () => ({}) },
    twitter: { type: socialEntry, default: () => ({}) },
    instagram: { type: socialEntry, default: () => ({}) },
    linkedin: { type: socialEntry, default: () => ({}) },
    github: { type: socialEntry, default: () => ({}) },
    youtube: { type: socialEntry, default: () => ({}) },
    discord: { type: socialEntry, default: () => ({}) },
    stackoverflow: { type: socialEntry, default: () => ({}) },
  },

  sections: {
    hero: { type: sectionEntry, default: () => ({}) },
    websiteTypes: { type: sectionEntry, default: () => ({}) },
    features: { type: sectionEntry, default: () => ({}) },
    apps: { type: sectionEntry, default: () => ({}) },
    services: { type: sectionEntry, default: () => ({}) },
    projects: { type: sectionEntry, default: () => ({}) },
    gallery: { type: sectionEntry, default: () => ({}) },
    contact: { type: sectionEntry, default: () => ({}) },
  },

  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    customCSS: { type: String, default: '' },
  },
}, { timestamps: true, collection: 'hdm_companies' });

module.exports = mongoose.model('HdmCompany', companySchema);