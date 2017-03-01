const errors = require('feathers-errors');
const { remove } = require('feathers-hooks');

module.exports = function removeSensitiveFields(modelName) {
  return function handler(hook) {
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }
    const config = hook.app.get('sensitiveFields');

    if (!config || !config[modelName]) {
      return hook;
    }

    const fields = config[modelName];
    return remove(...fields)(hook);
  };
};
