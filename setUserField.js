const errors = require('feathers-errors');
const get = require('lodash/fp/get');

const defaultOptions = {
  userField: '_id',
  overwrite: true,
};

module.exports = function setUserField(options) {
  const opts = Object.assign(defaultOptions, options);
  return (hook) => {
    if (hook.type === 'after') {
      throw new errors.GeneralError(
        'setUserField must be used in a before hook'
      );
    }

    const { user } = hook.params;
    if (!user) {
      throw new errors.GeneralError('setUserField hook should be used after populateUser hook.');
    }

    const { field, userField, overwrite } = options;

    if (overwrite || !hook.data[field]) {
      hook.data[field] = get(userField, user);
    }
  };
};
