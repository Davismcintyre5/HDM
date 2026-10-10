const cloudinary = require('../config/cloudinary');
const env = require('../config/env');

const folderPath = (folder) => `${env.cloudinary.folder}/${folder}`.replace(/\/+/g, '/');

const uploadFile = (buffer, filename, folder = 'uploads') =>
  new Promise((resolve, reject) => {
    const clean = String(filename).replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath(folder),
        public_id: `${clean}_${Date.now()}`,
        resource_type: 'image',
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const uploadRaw = (buffer, filename, folder = 'backups') =>
  new Promise((resolve, reject) => {
    const clean = String(filename).replace(/[^a-zA-Z0-9-_.]/g, '_');
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath(folder),
        public_id: clean.replace(/\.[^.]+$/, ''),
        resource_type: 'raw',
        format: clean.split('.').pop(),
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const deleteFile = (publicId, resourceType = 'image') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

const deleteFiles = (publicIds, resourceType = 'image') =>
  cloudinary.api.delete_resources(publicIds, { resource_type: resourceType });

const getUsage = () => cloudinary.api.usage();

const getFolders = () => cloudinary.api.root_folders();

const getSubFolders = (folder) => cloudinary.api.sub_folders(folderPath(folder));

const getFolderContents = (folder = '', maxResults = 50) =>
  cloudinary.api.resources({
    type: 'upload',
    prefix: folderPath(folder),
    max_results: maxResults,
  });

const getFileDetails = (publicId) => cloudinary.api.resource(publicId);

const deleteFolder = (prefix) =>
  cloudinary.api.delete_resources_by_prefix(folderPath(prefix));

const createFolder = (path) => cloudinary.api.create_folder(folderPath(path));

const renameFile = (from, to) => cloudinary.uploader.rename(from, to);

module.exports = {
  uploadFile,
  uploadRaw,
  deleteFile,
  deleteFiles,
  getUsage,
  getFolders,
  getSubFolders,
  getFolderContents,
  getFileDetails,
  deleteFolder,
  createFolder,
  renameFile,
};