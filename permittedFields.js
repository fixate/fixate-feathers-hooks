const errors = require('feathers-errors');
const {iff, isProvider, keep} = require('feathers-hooks-common');

module.exports = function removeSensitiveFields(modelName) {
  return function handler(hook) {
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }
    const config = hook.app.get('permittedFields');

    if (!config) {
      throw new errors.GeneralError('Sensitive Fields configuration not found!');
    }

    const model = config[modelName];

    if (!model) {
      throw new errors.GeneralError(`Permitted fields not configured for '${modelName}'`);
    }

    const removeFields = iff(isProvider('external'), keep(...model));
    return removeFields(hook);
  };
};
