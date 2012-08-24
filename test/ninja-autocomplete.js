(function ($) {
  'use strict';

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('constructor', {
    setup: function () {
      this.constructor = $.Ninja.Autocomplete;
    }
  });

  test('exists', function () {
    ok(this.constructor, 'should exist');
  });

  test('is a function', function () {
    ok($.isFunction(this.constructor), 'should be a function');
  });

  module('instance', {
    setup: function () {
      this.instance = new $.Ninja.Autocomplete('<input type="text"/>');
    }
  });

  test('is an instance', function () {
    ok(this.instance instanceof $.Ninja.Autocomplete, 'should be instance of $.Ninja.Autocomplete');
  });

  test('.$list', function () {
    ok(this.instance.$list, 'should exist');
    ok(this.instance.$list.is('div'), 'should be a div element');
  });

  test('.$wrapper', function () {
    ok(this.instance.$wrapper, 'should exist');
    ok(this.instance.$wrapper.is('span'), 'should be a span element');
    ok(this.instance.$wrapper.hasClass('nui-atc'), 'should have nui-atc class');
  });

  test('.datalist', function () {
    ok(this.instance.datalist, 'should exist');
    ok($.isArray(this.instance.datalist), 'should be an array');
  });

  test('.index', function () {
    ok(this.instance.index, 'should exist');
    strictEqual(this.instance.index, -1, 'should equal -1');
  });

  module('elements', {
    setup: function () {
      this.$elements = $('#qunit-fixture').find('input');
    }
  });

  test('are chainable', function () {
    strictEqual(this.$elements.ninja('autocomplete'), this.$elements, 'should be chainable');
  });

  test('have wrappers', function () {
    this.$elements.ninja('autocomplete').each(function () {
      var $wrapper = $(this).parent();

      ok($wrapper.is('span'), 'should be a span element');

      ok($wrapper.hasClass('nui-atc'), 'wrapper have nui-atc class');
    });
  });

  module('component.datalist', {
    setup: function () {
      $('input.nui-tst-treenuts').ninja('autocomplete', {
        datalist: [
          'Almond',
          'Beech nut',
          'Brazil nut',
          'Butternut',
          'Cashew',
          'Chestnut',
          'Chinquapin',
          'Coconut',
          'Filbert/hazelnut',
          'Ginko nut',
          'Hickory nut',
          'Lichee nut',
          'Macadamia nut/Bush nut',
          'Pecan',
          'Pine nut/Pinon nut',
          'Pistachio',
          'Sheanut',
          'Walnut/Heartnut'
        ]
      });

      this.$element = $('#qunit-fixture').find('input.nui-tst-treenuts');
    }
  });

  test('has wrapper', function () {
    var $wrapper = this.$element.parent();

    ok($wrapper.is('span'), 'should be a span element');

    ok($wrapper.hasClass('nui-atc'), 'wrapper have nui-atc class');
  });

  module('component <datalist>', {
    setup: function () {
      $.ninja.initialize();

      this.$element = $('#qunit-fixture').find('input[list]');
    }
  });

  module('component.get', {
    setup: function () {
      $('input.nui-tst-dvd').ninja('autocomplete', {
        get: function (q, callback) {
          $.ajax({
            url: 'http://completion.amazon.com/search/complete',
            dataType: 'jsonp',
            data: {
              q: q,
              mkt: 1,
              'search-alias': 'dvd'
            },
            success: function (data) {
              callback(data[1]);
            },
            error: function (request, status, message) {
              $.error(message);
            }
          });
        }
      });

      this.$element = $('#qunit-fixture').find('input.nui-tst-dvd');
    }
  });

  asyncTest('got async results', function () {
    var
      $element = this.$element,
      $wrapper = $element.parent();

    $element.on('keydown', function (event) {
      event.stopImmediatePropagation();
    }).val('a').focus();

    setTimeout(function () {
      var
        $list = $wrapper.find('div'),
        $first = $list.find('div:first-child');

      start();

      ok($list.is('div'), 'list should be a div element');

      stop();
      $element.trigger({
        type: 'keydown',
        which: 40
      }).trigger({
        type: 'keydown',
        which: 13
      });

      strictEqual($first.text(), $element.val(), 'should change the input to the first result');

      start();
    }, 500);

  });

}(window.jQuery));
