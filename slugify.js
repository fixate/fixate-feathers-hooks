const S = require('string');

module.exports = function slugify(field, slugFields, overwrite = false) {
  return (hook) => {
    if (!Array.isArray(slugFields)) {
      slugFields = [slugFields];
    }

    if (overwrite || !hook.data[field]) {
      hook.data[field] = S(slugFields.map((f) => hook.data[f]).join('-')).slugify().s;
    }
  };
};
