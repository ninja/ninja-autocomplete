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

  module('$.Ninja.Autocomplete', {
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

  module('ninja.autocompletes', {
    setup: function () {
      this.elements = $('#qunit-fixture').find('input');
    }
  });

  test('are chainable', function () {
    strictEqual(this.elements.ninja('autocomplete'), this.elements, 'should be chainable');
  });

  test('have class', function () {
    this.elements.ninja('autocomplete').each(function () {
      ok($(this).parent().hasClass('nui-atc'), 'wrapper should have nui-atc class');
    });
  });

  module('ninja.autocomplete.get', {
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

      this.element = $('#qunit-fixture').find('input.nui-tst-dvd');
    }
  });

  test('has class', function () {
    ok(this.element.parent().hasClass('nui-atc'), 'wrapper should have nui-atc class');
  });

  asyncTest('got async results', function () {
    var element = this.element;

    element.on('keydown', function (event) {
      event.stopImmediatePropagation();
    }).val('a').focus();

    setTimeout(function () {
      element.trigger({
        type: 'keydown',
        which: 40
      }).trigger({
        type: 'keydown',
        which: 13
      });

      strictEqual(element.val(), 'alfred hitchcock', 'should return alfred hitchcock as the first result for typing a');

      start();
    }, 300);

  });

  // test('<datalist>', function () {
  //   $.ninja.initialize();
  // });

  // test('option: datalist', function () {
  //   $('input#recipes').ninja('autocomplete', {
  //     datalist: ['chicken recipes', 'chicken recipes for kids', 'chicken recipes healthy', 'chicken recipes easy']
  //   });

  //   $.ninja.initialize();
  // });

  // test('option: get', function () {
  //   $('input#dvd').ninja('autocomplete', {
  //     get: function (q, callback) {
  //       $.ajax({
  //         url: 'http://completion.amazon.com/search/complete',
  //         dataType: 'jsonp',
  //         data: {
  //           q: q,
  //           mkt: 1,
  //           'search-alias': 'dvd'
  //         },
  //         success: function (data) {
  //           callback(data[1]);
  //         },
  //         error: function (request, status, message) {
  //           $.error(message);
  //         }
  //       });
  //     }
  //   });
  // });

}(window.jQuery));
