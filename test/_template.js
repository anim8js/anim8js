
var anim8 = require('../build/anim8js.js');

return;

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    this.variable = 1; // accessible in any test

    callback();
  },

  /**
   * Example test
   */
  testName: function(test)
  {
    test.expect( 8 );
    test.ok( true, 'value is truthy' );
    test.equal( 1, '1', '1 = "1"' );
    test.notEqual( this.variable, 2, '1 != 2' );
    test.deepEqual( [2], [2], '[2] = [2]' );
    test.notDeepEqual( [1], [2], '[1] != [2]' );
    test.strictEqual( 1, 1, '1 = 1' );
    test.notStrictEqual( 1, '1', '1 != 1' );
    test.throws(function() { throw 'Exception' }, 'Exception', 'Exception thrown as expected');
    test.done();
  }

};
