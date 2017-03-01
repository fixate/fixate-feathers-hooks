const timestamps = require('./timestamps');
const setUserField = require('./setUserField');
const optionalHashPassword = require('./optionalHashPassword');
const slugify = require('./slugify');
const scopeQueryTo = require('./scopeQueryTo');
const removeSensitiveFields = require('./removeSensitiveFields');
const permitFields = require('./permitFields');
const validateUnique = require('./validateUnique');
const requiredParams = require('./requiredParams');
const defaults = require('./defaults');

module.exports = {
  timestamps,
  setUserField,
  optionalHashPassword,
  slugify,
  scopeQueryTo,
  removeSensitiveFields,
  permitFields,
  validateUnique,
  requiredParams,
  defaults,
};
