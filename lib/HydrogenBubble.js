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
THREE.HydrogenBubble = function(size) {

	THREE.Object3D.call( this );
	this.type = 'Group';
	var extGeometry = new THREE.SphereGeometry( size, 32, 32 );
	var extMaterial =new THREE.MeshPhysicalMaterial( {transparent:true, opacity:0.4, color: 0xAB82FF, roughness:0.22, metalness:0.5, morphTargets: true} );
	var extBubble = new THREE.Mesh(extGeometry,extMaterial);
	extBubble.renderOrder=1;
	var nucGeometry = new THREE.SphereGeometry( size/4, 16, 16 );
	var nucMaterial = new THREE.MeshPhysicalMaterial( {transparent:true, opacity:0.4, color: 0x00E5EE, roughness:0.22, metalness:0.5} );
	var nucleus = new THREE.Mesh( nucGeometry, nucMaterial );
	nucleus.renderOrder=0;
	this.add(extBubble);
	this.add(nucleus);
	
	this.userData.bubbleSize = size;
	this.userData.maxBubblesGroup = 32;
	this.userData.maxBubbles4Group = 3;
	this.userData.bubblesGroups = [];
	this.userData.bubblesStartRadius = nucGeometry.parameters.radius;
	this.userData.bubblesSize = 0.2;
	this.userData.bubblesGeometry = new THREE.SphereGeometry( this.userData.bubblesSize, 8, 8 );
	this.userData.bubblesMaterial = new THREE.MeshPhysicalMaterial( {transparent:true, opacity:0.4, color: 0xFFFFFF, roughness:0.22, metalness:0.5} );


};

THREE.HydrogenBubble.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.HydrogenBubble,
	run : function(delta){
		this.evaporate(delta);
	},
	setRotationFromQuaternion : function(q){
		THREE.Object3D.prototype.setRotationFromQuaternion.call( this , q);
		//Todo rotate bubbles
	},
	evaporate : function(delta){
		//Bubbling up
		for(var bg = 0; bg < this.userData.bubblesGroups.length; bg ++ ){
			for(var bb = 0; bb<this.userData.bubblesGroups[bg].length; bb++){
				var cBubble = this.userData.bubblesGroups[bg][bb];
				if(!!cBubble && delta < 1){
					cBubble.userData.radius += delta;
					if (cBubble.userData.radius >= (this.userData.bubbleSize - this.userData.bubblesSize)){
						cBubble.userData.radius = this.userData.bubblesStartRadius;
					}
					cBubble.position.x=(Math.cos(cBubble.userData.anglez) * Math.cos(cBubble.userData.anglexy) * cBubble.userData.radius);
					cBubble.position.y=(Math.cos(cBubble.userData.anglez) * Math.sin(cBubble.userData.anglexy) * cBubble.userData.radius);
					cBubble.position.z=(Math.sin(cBubble.userData.anglez) * cBubble.userData.radius);
				}
			}
		}
		
		//new Bubbles
		if(this.userData.bubblesGroups.length < this.userData.maxBubblesGroup){
			if(this.userData.bubblesGroups.length === 0){
				var newBubbles = [];
				this.userData.bubblesGroups.push(newBubbles);
			}
			var curBubblesGroup = this.userData.bubblesGroups[this.userData.bubblesGroups.length-1];
			if (curBubblesGroup.length < this.userData.maxBubbles4Group){
				var newBubble = null;
				if (curBubblesGroup.length === 0){
					 newBubble= new THREE.Mesh( this.userData.bubblesGeometry, this.userData.bubblesMaterial );
					 newBubble.userData.radius = this.userData.bubblesStartRadius;
					 newBubble.userData.anglexy = Math.random() * Math.PI * 2;
					 newBubble.userData.anglez = Math.acos((2*Math.random())-1)-(Math.PI/2);
					 
				}else{
					var lastBubble = curBubblesGroup[curBubblesGroup.length-1];
					if (lastBubble.userData.radius > (this.userData.bubblesStartRadius + (this.userData.bubblesSize*2))){
						 newBubble = new THREE.Mesh( this.userData.bubblesGeometry, this.userData.bubblesMaterial );
						 newBubble.userData.radius = this.userData.bubblesStartRadius;
						 newBubble.userData.anglexy = lastBubble.userData.anglexy + ((Math.random() - 0.5)/3) ;
						 newBubble.userData.anglez = lastBubble.userData.anglez;
					}
				}
				if(!!newBubble)	{
					 newBubble.position.x = (Math.cos(newBubble.userData.anglez) * Math.cos(newBubble.userData.anglexy) * newBubble.userData.radius);
					 newBubble.position.y = (Math.cos(newBubble.userData.anglez) * Math.sin(newBubble.userData.anglexy) * newBubble.userData.radius);
					 newBubble.position.z = (Math.sin(newBubble.userData.anglez) * newBubble.userData.radius);
					 this.add( newBubble );
					 curBubblesGroup.push(newBubble);
				}
			}else{
				var nBubbles = [];
				this.userData.bubblesGroups.push(nBubbles);
			}
		}
	}

} );
return THREE.HydrogenBubble;
}));