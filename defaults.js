const deepAssign = require('deep-assign');

function prepare(params, ...args) {
  return Object.keys(params).reduce((obj, p) => {
    const value = params[p];
    const finalValue = typeof value === 'function' ? value(...args) : value;

    return Object.assign(obj, {[p]: finalValue});
  }, {});
}

module.exports = function defaults(params, options) {
  options = Object.assign({deep: false}, options);
  const assigner = options.deep ? deepAssign : Object.assign;
  return function handler(hook) {
    const preparedParams = prepare(params, hook);
    if (hook.type === 'before') {
      hook.params.query = assigner(preparedParams, hook.params.query);
    } else {
      hook.result = assigner(preparedParams, hook.result);
    }

    return hook;
  };
};
