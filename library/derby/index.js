var Config = function () {
  'use strict';

  this.filename = __filename;
  this.ns = 'ninja';
  this.scripts = {
    autocomplete: require('./autocomplete')
  };
  this.styles = [
    __dirname + '/../../source/ninja.autocomplete'
  ];
};

function components(derby, options) {
  'use strict';

  derby.createLibrary(new Config(), options);
}

components.decorate = 'derby';

module.exports = components;
