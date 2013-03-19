var
  $ = require('jquery'),
  Ninja = require('ninja');

function Autocomplete(element, options) {
  var autocomplete = this;

  if (element) {
    autocomplete.$element = $(element);
    if (!autocomplete.$element.is('input')) {
      Ninja.error('Autocomplete may only be called with an <input> element.');
    }
  } else {
    Ninja.error('Autocomplete must include an <input> element.');
  }

  autocomplete.$wrapper = autocomplete.$element.wrap('<span class="ninja-autocomplete">').parent();

  autocomplete.$list = $('<div>', {
    'class': 'ninja-list',
    css: {
      top: this.$wrapper.outerHeight()
    }
  });

  if (options && options.length) {
    if ('list' in options) {
      autocomplete.list = options.list;
    } else {
      autocomplete.list = [];
    }

    if ('get' in options) {
      autocomplete.get = options.get;
    }

    if ('select' in options && $.isFunction(options.select)) {
      autocomplete.select = options.select;
    }
  } else {
    Ninja.error('Autocomplete called without options.');
  }

  autocomplete.index = -1;

  autocomplete.matchlist = [];

  autocomplete.$element.attr({
    autocomplete: 'off'
  }).data('ninja', {
    autocomplete: options
  }).on('blur.ninja', function () {
    autocomplete.$list.remove();
  }).on('focus.ninja, keyup.ninja', function (event) {
    if (autocomplete.$element.data('ninja-completed')) {
      autocomplete.$element.removeData('ninja-completed');
    } else {
      var keycode = event.which;

      if (!autocomplete.$element.val()) {
        autocomplete.$list.remove();
      } else if (!Ninja.key(keycode, ['arrowDown', 'arrowUp', 'escape', 'tab'])) {
        if ($.isFunction(autocomplete.get)) {
          autocomplete.get(autocomplete.$element.val(), function (list) {
            autocomplete.list = list;

            autocomplete.suggest(list);
          });
        } else {
          autocomplete.suggest(autocomplete.list);
        }
      }
    }
  }).on('keydown.ninja', function (event) {
    var keycode = event.which;

    if (Ninja.key(keycode, ['escape', 'tab'])) {
      autocomplete.$list.remove();
    } else if (keycode === Ninja.keys.enter && autocomplete.index > -1) {
      autocomplete.$element.trigger('select.ninja');
    } else if (Ninja.key(keycode, ['arrowDown', 'arrowUp'])) {
      if (autocomplete.index > -1) {
        autocomplete.$list.find('div:eq(' + autocomplete.index + ')').removeClass('ninja-hover');
      }

      if (keycode === Ninja.keys.arrowDown) {
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

      autocomplete.$list.find('div:eq(' + autocomplete.index + ')').addClass('ninja-hover');
    }
  }).on('select.ninja', function () {
    if (autocomplete.matchlist[autocomplete.index]) {
      autocomplete.$element.data('ninja-completed', true);

      autocomplete.$element.val(autocomplete.matchlist[autocomplete.index]);

      autocomplete.$list.remove();

      if ('select' in autocomplete) {
        autocomplete.select();
      }
    }
  });
}

Autocomplete.prototype.last = function () {
  return this.matchlist.length - 1;
};

Autocomplete.prototype.suggest = function (list) {
  var autocomplete = this;

  if (!$.isFunction(autocomplete.get)) {
    autocomplete.matchlist = $.map(list, function (option) {
      var value = autocomplete.$element.val();

      if (value !== option && new RegExp('^' + value, 'i').test(option)) {
        return option;
      } else {
        return null;
      }
    });
  } else {
    autocomplete.matchlist = list;
  }

  autocomplete.$list.empty();

  if (autocomplete.matchlist.length > 0) {
    $.each(autocomplete.matchlist, function (i, option) {
      $('<div>', {
        'class': 'ninja-item',
        html: option
      }).on('mouseenter.ninja', function () {
        if (autocomplete.index > -1) {
          autocomplete.$list.find('div:eq(' + autocomplete.index + ')').removeClass('ninja-hover');
        }

        autocomplete.index = i;
      }).on('mousedown.ninja', function () {
        autocomplete.$element.trigger('select.ninja');
      }).on('mouseleave.ninja', function () {
        autocomplete.index = -1;
      }).appendTo(autocomplete.$list);
    });

    autocomplete.index = -1;

    autocomplete.$list.appendTo(autocomplete.$wrapper);
  }
};

Ninja.prototype.autocomplete = function (element, options) {
  var $element = $(element);

  if ($element.data('ninja') && 'autocomplete' in $element.data('ninja')) {
    Ninja.error('Autocomplete called on the same element multiple times.');
  } else {
    $.extend(new Ninja(element, options), new Autocomplete(element, options));
  }
};
