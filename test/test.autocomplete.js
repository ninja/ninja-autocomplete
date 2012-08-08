/*global $ */
/*jshint expr:true */

describe('$.Ninja.Autocomplete', function () {
  it('constructor', function () {
    expect($.Ninja.Autocomplete).to.be.a('function').and.not.an('object');
    expect($.Ninja).itself.to.not.respondTo('$element');
    expect($.Ninja).itself.to.not.respondTo('options');
  });
});

describe('$autocomplete', function () {
  var $autocomplete;

  before(function () {
    $autocomplete = new $.Ninja.Autocomplete($('<input type="text"/>'));
  });

  it('instance of $.Ninja.Autocomplete', function () {
    expect($autocomplete).to.be.an.instanceof($.Ninja.Autocomplete);
  });

  describe('properties', function () {
    it('$list', function () {
      expect($autocomplete).to.have.property('$list').and.be('div');
    });

    it('$wrapper', function () {
      expect($autocomplete).to.have.property('$wrapper').and.to.have.class('nui-atc').and.be('span');
    });

    it('datalist', function () {
      expect($autocomplete).to.have.property('datalist').and.be.an('array');
    });

    it('index', function () {
      expect($autocomplete).to.have.property('index').and.equal(-1);
    });
  });
});

