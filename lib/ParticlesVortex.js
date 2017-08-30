(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['three'], function(THREE) {
      return factory.apply(root, [THREE]);
    });
  } else if (typeof exports !== 'undefined') {
    var THREE = require('three');
    module.exports = factory(THREE);
  } else {
    factory(root.THREE);
  }

}(window, function(THREE) {
"use strict";
THREE.ParticleVortex = function(size) {
};
THREE.ParticleVortex.prototype = Object.assign( Object.create( THREE.Points.prototype ), {
	constructor: THREE.ParticleVortex
});

}));