/*global jQuery*/

exports.create = function (model, dom) {
  var input = dom.element('input');

  (function ($) {
    if ($.ninja === undefined) {
      require('ninja');
    }

    if ($.ninja.autocomplete === undefined) {
      require('../../ninja.autocomplete.js');
    }

    $(input).ninja('autocomplete');
  }(jQuery));
};
