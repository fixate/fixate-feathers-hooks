const get = require('lodash/fp/get');
const set = require('lodash/fp/set');

const deepPicker = fields => values => fields.reduce((acc, f) => {
  const value = get(f, values);
  if (value) {
    return set(f, value, acc);
  }
  return acc;
}, {});

module.exports = function permitFields(...fields) {
  if (Array.isArray(fields[0])) {
    fields = fields[0];
  }

  const pickFields = deepPicker(fields);

  return function handler(hook) {
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (hook.type === 'before') {
      hook.data = pickFields(hook.data);
    } else {
      hook.result = pickFields(hook.result);
    }

    return hook;
  };
};
