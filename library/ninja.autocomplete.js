/*jshint
  strict:true
*/

(function ($) {
  'use strict';

  $.Ninja.Autocomplete = function (element, options) {
    this.$wrapper = $(element).wrap('<span class="nui-atc">').parent();
    this.$list = $('<div>', {
      css: {
        top: this.$wrapper.height() - 2
      }
    });
    this.datalist = [];
    this.matchlist = [];
    if (options && options.get) {
      this.get = options.get;
    }
    this.index = -1;
  };

  $.Ninja.Autocomplete.prototype.last = function () {
    return this.matchlist.length - 1;
  };

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

  $.ninja.autocomplete = function (element, options) {
    var autocomplete = $.extend(new $.Ninja(element, options), new $.Ninja.Autocomplete(element, options));

    if (options && options.datalist) {
      autocomplete.datalist = options.datalist;
    } else if (autocomplete.$element.data('list')) {
      autocomplete.datalist = autocomplete.$element.data('list');
    } else if (autocomplete.$element.attr('list')) {
      $('datalist#' + autocomplete.$element.attr('list')).find('option').each(function () {
        autocomplete.datalist.push($(this).val());
      });
    }

    autocomplete.$element.attr({
      autocomplete: 'off'
    }).removeAttr('list');

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
  };
}(window.jQuery));
