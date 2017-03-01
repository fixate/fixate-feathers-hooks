const errors = require('feathers-errors');
const get = require('lodash/fp/get');

const defaultOptions = {
  Error: errors.BadRequest,
};

module.exports = function requiredParams(...fields) {
  const opts = (typeof fields[fields.length - 1] === 'object') ?
    fields.pop() : {};

  const options = Object.assign({}, defaultOptions, opts);
  if (Array.isArray(fields[0])) {
    fields = fields[0];
  }

  return function handler(hook) {
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (hook.type !== 'before') {
      throw new errors.GeneralError('requiredParams is a before hook.');
    }

    const requestData = Object.assign({}, hook.data, hook.params.query);
    const missingFields = fields.filter(f => (typeof get(f, requestData) === 'undefined'))
    if (missingFields.length > 0) {
      const message = missingFields.length === 1 ?
        `Required field ${fields[0]} is missing.'` :
        `Required fields ${fields.join(', ')} are missing.'`
      throw new options.Error(message);
    }

    return hook;
  };
};
