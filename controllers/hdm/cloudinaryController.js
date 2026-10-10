const cloudinaryService = require('../../services/cloudinaryService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.stats = asyncHandler(async (req, res) => {
  const usage = await cloudinaryService.getUsage();
  return ok(res, usage);
});

exports.folders = asyncHandler(async (req, res) => {
  const [rootFolders, rootFiles] = await Promise.all([
    cloudinaryService.getFolders(),
    cloudinaryService.getFolderContents('', 10),
  ]);
  return ok(res, {
    folders: rootFolders.folders || [],
    files: rootFiles.resources || [],
  });
});

exports.folderContents = asyncHandler(async (req, res) => {
  const folder = req.params[0] || '';
  const limit = Number(req.query.limit) || 50;

  const [files, subs] = await Promise.all([
    cloudinaryService.getFolderContents(folder, limit),
    cloudinaryService.getSubFolders(folder),
  ]);

  return ok(res, {
    resources: files.resources || [],
    subFolders: subs.folders || [],
    nextCursor: files.next_cursor || null,
  });
});

exports.file = asyncHandler(async (req, res) => {
  const { publicId } = req.query;
  if (!publicId) throw ApiError.badRequest('publicId required');
  const details = await cloudinaryService.getFileDetails(publicId);
  return ok(res, details);
});

exports.deleteFile = asyncHandler(async (req, res) => {
  const { publicIds } = req.body;
  if (!Array.isArray(publicIds) || !publicIds.length) {
    throw ApiError.badRequest('publicIds array required');
  }
  const result = await cloudinaryService.deleteFiles(publicIds);
  return ok(res, result);
});

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const folder = req.body.folder || 'uploads';
  const result = await cloudinaryService.uploadFile(req.file.buffer, req.file.originalname, folder);
  return ok(res, result);
});

exports.createFolder = asyncHandler(async (req, res) => {
  const { path } = req.body;
  if (!path) throw ApiError.badRequest('path required');
  const result = await cloudinaryService.createFolder(path);
  return ok(res, result);
});

exports.deleteFolder = asyncHandler(async (req, res) => {
  const { prefix } = req.body;
  if (!prefix) throw ApiError.badRequest('prefix required');
  const result = await cloudinaryService.deleteFolder(prefix);
  return ok(res, result);
});

exports.rename = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) throw ApiError.badRequest('from and to required');
  const result = await cloudinaryService.renameFile(from, to);
  return ok(res, result);
});