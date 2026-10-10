const HdmContact = require('../../models/hdm/Contact');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const contacts = await HdmContact.find().sort({ createdAt: -1 });
  return ok(res, contacts);
});

exports.get = asyncHandler(async (req, res) => {
  const contact = await HdmContact.findById(req.params.id);
  if (!contact) throw ApiError.notFound('Contact not found');
  return ok(res, contact);
});

exports.markRead = asyncHandler(async (req, res) => {
  const contact = await HdmContact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!contact) throw ApiError.notFound('Contact not found');
  return ok(res, contact);
});

exports.archive = asyncHandler(async (req, res) => {
  const contact = await HdmContact.findByIdAndUpdate(
    req.params.id,
    { isArchived: true, isRead: true },
    { new: true }
  );
  if (!contact) throw ApiError.notFound('Contact not found');
  return ok(res, contact);
});

exports.remove = asyncHandler(async (req, res) => {
  const contact = await HdmContact.findByIdAndDelete(req.params.id);
  if (!contact) throw ApiError.notFound('Contact not found');
  return ok(res, { message: 'Contact deleted' });
});