/*!
##Begin Immediately-Invoked Function Expression

Assign `jQuery` to `$`.

Enable ECMAScript 5 strict mode.
*/
(function ($) {
  'use strict';

/*
##Autocomplete Constructor
*/

  $.Ninja.Autocomplete = function (element, options) {
    var autocomplete = this;

    if (element) {
      autocomplete.$element = $(element);
      if (!autocomplete.$element.is('input')) {
        $.ninja.error('Autocomplete may only be called with an <input> element.');
      }
    } else {
      $.ninja.error('Autocomplete must include an <input> element.');
    }

    autocomplete.$element.attr({
      autocomplete: 'off'
    }).removeAttr('list');

    autocomplete.$wrapper = autocomplete.$element.wrap('<span class="nui-atc">').parent();

    autocomplete.$list = $('<div>', {
      css: {
        top: this.$wrapper.height() - 2
      }
    });

    if (options) {
      if ('datalist' in options) {
        autocomplete.datalist = options.datalist;
      } else {
        autocomplete.datalist = [];
      }

      if ('get' in options) {
        autocomplete.get = options.get;
      }
    } else {
      $.ninja.error('Autocomplete called without options.');
    }

    autocomplete.index = -1;

    autocomplete.matchlist = [];

    autocomplete.$element.on('blur.ninja', function () {
      autocomplete.$list.remove();
    });

    autocomplete.$element.on('keydown.ninja', function (event) {
      var keycode = event.which;

      if ($.ninja.key(keycode, ['escape', 'tab'])) {
        autocomplete.$list.remove();
      } else if (keycode === $.ninja.keys.enter && autocomplete.index > -1) {
        autocomplete.$element.val(autocomplete.matchlist[autocomplete.index]).blur();
      } else if ($.ninja.key(keycode, ['arrowDown', 'arrowUp'])) {
        if (autocomplete.index > -1) {
          autocomplete.$list.find(':eq(' + autocomplete.index + ')').removeClass('nui-hvr');
        }

        if (keycode === $.ninja.keys.arrowDown) {
          if (autocomplete.index === autocomplete.last()) {
            autocomplete.index = 0;
          } else {
            autocomplete.index += 1;
          }
        } else {
          if (autocomplete.index <= 0) {
            autocomplete.index = autocomplete.last();
          } else {
            autocomplete.index -= 1;
          }
        }

        autocomplete.$list.find(':eq(' + autocomplete.index + ')').addClass('nui-hvr');
      }
    });

    autocomplete.$element.on('focus.ninja, keyup.ninja', function (event) {
      var keycode = event.which;

      if (!autocomplete.$element.val()) {
        autocomplete.$list.remove();
      } else if (!$.ninja.key(keycode, ['arrowDown', 'arrowUp', 'escape', 'tab'])) {
        if ($.isFunction(autocomplete.get)) {
          autocomplete.get(autocomplete.$element.val(), function (datalist) {
            autocomplete.datalist = datalist;

            autocomplete.list(datalist);
          });
        } else {
          autocomplete.list(autocomplete.datalist);
        }
      }
    });

    autocomplete.$element.data('ninja', {
      autocomplete: options
    });

  };

/*
##Last

Determines position of the last available option.
*/
  $.Ninja.Autocomplete.prototype.last = function () {
    return this.matchlist.length - 1;
  };

/*
##List

Dynamically generates a list of options to display under the `<input>`.
*/
  $.Ninja.Autocomplete.prototype.list = function (datalist) {
    var autocomplete = this;

    if (!$.isFunction(autocomplete.get)) {
      autocomplete.matchlist = $.map(datalist, function (option) {
        var value = autocomplete.$element.val();

        if (value !== option && new RegExp('^' + value, 'i').test(option)) {
          return option;
        } else {
          return null;
        }
      });
    } else {
      autocomplete.matchlist = datalist;
    }

    autocomplete.$list.empty();

    if (autocomplete.matchlist.length > 0) {
      $.each(autocomplete.matchlist, function () {
        var option = this;

        $('<div>', {
          html: option
        }).on('hover.ninja', function () {
          $(this).toggleClass('nui-hvr');
        }).on('mousedown.ninja', function () {
          autocomplete.$element.val(option);
        }).appendTo(autocomplete.$list);
      });

      autocomplete.index = -1;

      autocomplete.$list.appendTo(autocomplete.$wrapper);
    }
  };

/*
Instance of Autcomplete constructor

Prevents multiple initialization.
*/
  $.ninja.autocomplete = function (element, options) {
    var $element = $(element);

    if ($element.data('ninja') && 'autocomplete' in $element.data('ninja')) {
      $.ninja.warn('Autocomplete called on the same element multiple times.');
    } else {
      $.extend(new $.Ninja(element, options), new $.Ninja.Autocomplete(element, options));
    }
  };

/*!
##End Immediately-Invoked Function Expression

Preserve jQuery's state while invoking.
*/
}(jQuery));
