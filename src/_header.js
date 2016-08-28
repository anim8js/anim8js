// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define('anim8', [], function() { // jshint ignore:line
      return factory(root);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global);  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    root.m8 = root.anim8 = factory(root);
    root.m8s = root.anim8s = root.anim8.anim8s;
  }
}(this, function(global)
{
