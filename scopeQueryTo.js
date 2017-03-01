const errors = require('feathers-errors');

module.exports = function scopeQueryTo(objOrFn) {
  return (hook) => {
    if (hook.type === 'after') {
      throw new errors.GeneralError(
        'scopeQueryTo must be used in a before hook'
      );
    }

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    const query = (typeof objOrFn === 'function') ? objOrFn(hook) : objOrFn;

    hook.params.query = Object.assign(hook.params.query || {}, query);
  };
};
