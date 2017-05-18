# fixate-feathers-hooks

A mixed bag of feathers hooks that are useful in almost all projects.

They all curry the hook function, so the 'outer' call is used for configuration and returns a
function.

Dependencies:

- lodash/fp (Many hooks use this)
- bcryptjs (can remove see `optionalHashPassword` below)
- deep-assign (defaults)
- string (slugify)
- feathers-errors (setUserField)
- feathers-hooks (removeSensitiveFields)

Install: `npm install --save fixate-feathers-hooks`

Include:
`const defaults = require('fixate-feathers-hooks/defaults')` or
`const { defaults } = require('fixate-feathers-hooks');`

## Hooks

### defaults

Specify default query params or results. You can also use a function which
returns a calculated default.

```javascript
defaults({ q: 'foo', complex(hook) { return hook.params.anotherField } }, { deep: true })(hook);
// (before hook) params = { q: 'bar', anotherField: 'test123' } then params.query will have { q:'bar', complex: 'test123' }
```

### optionalHashPassword

Workaround for issue. Copy of feathers-authentication's `hashPassword` hook, but we can use this in
updates and patches because it doesn't try and hash a falsey password.
TODO: remove; fixed in [PR#287](https://github.com/feathersjs/feathers-authentication/pull/287)

### permitFields

Select fields in `data` (before hook) or `result` (after hook) to allow through using dot notation
(lodash get). Handles deeply nested objects too.

```javascript
permitFields('public.object', 'private.item.name')(hook);
```

### removeSensitiveFields

Configure fields which should be removed from api responses.
Configure `sensitiveFields` in your `default.json` (uses `app.get` and `feathers-hooks.remove` hook).

`>= 1.0.4` - Will throw an error if you use this hook without a configuration for the "model". This is to prevent typos causing data to leak.

```javascript
removeSensitiveFields('user')(hook);

// default.json
...
"sensitiveFields": {
  "user": ["password", "forgottenPasswordToken", ...],
  "creditCard": ["cvv"],
}
```

### requiredParams

Specify and validate required params - if params are missing throw an error (`BadRequest by default`)

```javascript
requiredParams('firstName', 'lastName', 'email', { Error: new Error('My custom error') })(hook);
```

### scopeQueryTo

Will ensure that `hook.params.query` has the specified values.

```javascript
scopeQueryTo({ status: 'active' })(hook);

// with function
const scopeToOwner = scopeQueryTo(hook => ({ user: hook.user._id }));
exports.before = {
  find: scopeToOwner,
  get: scopeToOwner,
  update: scopeToOwner,
  patch: scopeToOwner,
  remove: scopeToOwner,
};
```

### setUserField

Sets the `data` object to a field contained in `hooks.user` object.
If `overwrite` is `false`, then only set if data value is empty
(probably want to be careful of doing that).

```javascript
// with default options (except field which is required)
setUserField({ field: 'user', userField: '_id', overwrite: true })(hook);
```

### Slugify

Slugifies fields in object and sets the result to another field.

```javascript
slugify('mySlug', 'firstName'/*, overwrite = false*/);
// Or
slugify('mySlug', ['firstName', 'lastName']/*, overwrite = false*/);
```


### timestamps

Sets the current timestamp

```javascript
// true = Overwrites
const updatedAt = timestamp('updatedAt', true);
// Does not overwrite - note: if your database defaults to now you won't need this :)
const createdAt = timestamp('createdAt');
export.before = {
  create: createdAt,
  update: updatedAt,
  patch: updatedAt,
}
```

### validateUnique

Calls your `options.userService` service to check if `options.field` already exists. If not, it
will `BadRequest`, otherwise it'll let the request continue. Asynchronous, returns promise.
Useful for protecting against mongoose duplicate key errors and returning a useful error.

```javascript
// with defaults
validateUnique({ field: 'username', userService: '/users' })(hook);
```

## TODO

* Tests
* Remove optionalHashPassword

