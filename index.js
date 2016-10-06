/* jshint node: true */
'use strict';

module.exports = {
  name: 'flood-simple-form',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    target.options.babel = target.options.babel || { includePolyfill: true };
  }
};
