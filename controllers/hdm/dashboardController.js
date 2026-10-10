const HdmApp = require('../../models/hdm/App');
const HdmService = require('../../models/hdm/Service');
const HdmProject = require('../../models/hdm/Project');
const HdmPhoto = require('../../models/hdm/Photo');
const HdmContact = require('../../models/hdm/Contact');
const HdmUser = require('../../models/hdm/User');
const SmartGenUser = require('../../models/smartgen/User');
const SmartGenDocument = require('../../models/smartgen/Document');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.getStats = asyncHandler(async (req, res) => {
  const [
    apps,
    services,
    projects,
    photos,
    unreadMessages,
    totalContacts,
    hdmAdmins,
    smartgenUsers,
    smartgenDocuments,
  ] = await Promise.all([
    HdmApp.countDocuments(),
    HdmService.countDocuments(),
    HdmProject.countDocuments(),
    HdmPhoto.countDocuments(),
    HdmContact.countDocuments({ isRead: false }),
    HdmContact.countDocuments(),
    HdmUser.countDocuments({ isAdmin: true }),
    SmartGenUser.countDocuments(),
    SmartGenDocument.countDocuments(),
  ]);

  return ok(res, {
    hdm: { apps, services, projects, photos, totalContacts, unreadMessages, hdmAdmins },
    smartgen: { users: smartgenUsers, documents: smartgenDocuments },
  });
});