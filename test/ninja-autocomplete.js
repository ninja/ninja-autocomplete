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

  var
    list = [
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
    ],
    amazon = function (q, callback) {
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
          $.ninja.error(message);
        }
      });
    };

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
      this.instance = new $.Ninja.Autocomplete('<input type="text"/>', {
        list: ['one', 'two', 'three']
      });
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
    ok(this.instance.$wrapper.hasClass('ninja-autocomplete'), 'should have autocomplete class');
  });

  test('.list', function () {
    ok(this.instance.list, 'should exist');
    ok($.isArray(this.instance.list), 'should be an array');
    strictEqual(this.instance.list[0], 'one', 'first element should match specified option');
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
    strictEqual(this.$elements.ninja('autocomplete', {}), this.$elements, 'should be chainable');
  });

  module('list: [array]', {
    setup: function () {
      this.$element = $('#qunit-fixture').find('input.test-array');

      this.$element.ninja('autocomplete', {
        list: list
      });
    }
  });

  QUnit.done(function () {
    $('#qunit-examples').find('input.test-array').ninja('autocomplete', {
      list: list
    });
  });

  test('has wrapper', function () {
    var $wrapper = this.$element.parent();

    ok($wrapper.is('span'), 'should be a span element');

    ok($wrapper.hasClass('ninja-autocomplete'), 'wrapper have autocomplete class');
  });

  test('got results', function () {
    var
      $element = this.$element,
      $wrapper = $element.parent(),
      $list,
      $first;

    $element.val('a').focus();

    $list = $wrapper.find('div');

    $first = $list.find('div:first-child');

    ok($list.is('div'), 'list should be a div element');

    $element.trigger({
      type: 'keydown',
      which: 40
    }).trigger({
      type: 'keydown',
      which: 13
    });

    ok($element.on('select.ninja', function () {
      return true;
    }), 'should trigger select.ninja event');

    strictEqual($first.text(), $element.val(), 'should change the input to the first result');
  });

  module('get: function()', {
    setup: function () {
      this.$element = $('#qunit-fixture').find('input.test-function');

      this.$element.ninja('autocomplete', {
        get: amazon
      });
    }
  });


  QUnit.done(function () {
    $('#qunit-examples').find('input.test-function').ninja('autocomplete', {
      get: amazon
    });
  });

  asyncTest('got JSONP results', function () {
    var
      $element = this.$element,
      $wrapper = $element.parent();

    $element.val('a').focus();

    setTimeout(function () {
      var
        $list = $wrapper.find('div'),
        $first = $list.find('div:first-child');

      ok($list.is('div'), 'list should be a div element');

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
