const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
}, { timestamps: true, collection: 'hdm_invoice_counters' });

counterSchema.statics.nextFor = async function (key) {
  const doc = await this.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc.seq;
};

module.exports = mongoose.model('HdmInvoiceCounter', counterSchema);