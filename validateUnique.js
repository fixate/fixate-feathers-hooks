const errors = require('feathers-errors');

const defaultOptions = {
  field: 'username',
  userService: '/users',
};

module.exports = function validateUnique(options) {
  const { field, userService } = Object.assign({}, defaultOptions, options);

  return hook => {
    if (hook.type !== 'before') {
      throw new errors.GeneralError('validateUnique must be used as a before hook.');
    }

    const value = hook.data[field];
    const recordId = hook.id || (hook.data ? hook.data._id : null);

    if (value) {
      const query = { $select: [field], [field]: value };
      if (recordId) {
        // Exclulde the record we are checking against
        query._id = { $ne: recordId };
      }
      return hook.app.service(userService)
        .find({ query, $limit: 1 })
        .then(users => {
          if (users.length === 0) {
            return hook;
          }

          return Promise.reject(new errors.BadRequest(`${field} is not unique.`, {
            errors: [{
              type: 'unique',
              name: field,
              message: `This ${field} is already in use.`,
            }],
          }));
        })
    }
  };
};
