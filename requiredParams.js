const errors = require('feathers-errors');
const get = require('lodash/fp/get');

const defaultOptions = {
  Error: errors.BadRequest,
  emptyPredicate: data => f => typeof get(f, data) === 'undefined',
};

function getRequestData(hook) {
  switch (hook.method) {
    case 'get':
      return hook.params;
    case 'find':
      return hook.params.query;
    case 'create':
    case 'update':
    case 'patch':
      return hook.data;
    case 'remove':
      return hook.params;
    default:
      return {};
  }
}

module.exports = function requiredParams(...fields) {
  const opts = typeof fields[fields.length - 1] === 'object' ? fields.pop() : {};

  const options = Object.assign({}, defaultOptions, opts);
  if (Array.isArray(fields[0])) {
    fields = fields[0];
  }

  return function handler(hook) {
    if (hook.type !== 'before') {
      throw new errors.GeneralError('requiredParams is a before hook.');
    }

    const requestData = getRequestData(hook);
    const missingFields = fields.filter(options.emptyPredicate(requestData));
    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `Required field ${missingFields[0]} is missing.`
          : `Required fields ${missingFields.join(', ')} are missing.`;
      throw new options.Error(message);
    }

    return hook;
  };
};
