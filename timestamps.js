module.exports = function timestamps(field, overwrite = false) {
  return (hook) => {
    if (overwrite || !hook.data[field]) {
      hook.data[field] = Date.now();
    }
  };
};
