(function () {
	
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );
	var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 10000 );
	camera.position.x = 5;
	camera.position.y = 0;
	camera.position.z = 30;
	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClear = false;
	renderer.setFaceCulling( THREE.CullFaceNone );
	document.body.appendChild( renderer.domElement );
	
	//Lights
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	var directLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directLight.position = camera.position;
	scene.add(directLight);
	
	
	//Fog
	var fog = new THREE.FogExp2(0xAB82FF,2);
	//scene.fog=fog;
	
	//Stats
	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	
	//Init controls
	var controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.15;
	controls.keys = [ 65, 83, 68 ];
	
	//hydrogen buble
	var bubbleSize=8;
	/*var bubbleGeometry = new THREE.SphereGeometry( bubbleSize, 32, 32 );
	for ( var i = 0; i < 10; i ++ ) {

		var vertices = [];

		for ( var v = 0; v < bubbleGeometry.vertices.length; v ++ ) {
			var vClone = bubbleGeometry.vertices[ v ].clone();
			var cSin=Math.sin(Math.PI * 2 * ((v+i)/(bubbleGeometry.vertices.length+10)));
			vClone.x += vClone.x * cSin;
			vClone.y += vClone.y * cSin;
			vClone.z += vClone.z * cSin;
			vertices.push( vClone );
		}

		bubbleGeometry.morphTargets.push( { name: "morphTarget" + i, vertices: vertices } );

	}*/
	
	//var bubbleMaterial = new THREE.MeshPhysicalMaterial( {transparent:true, opacity:0.4, color: 0xAB82FF, roughness:0.22, metalness:0.5, morphTargets: true} );
	var bubble = new THREE.HydrogenBubble(bubbleSize);//THREE.HB.factory( bubbleSize, bubbleMaterial );
	//bubble.renderOrder=1;
	scene.add( bubble );
	
	/*var nucleusGeometry = new THREE.SphereGeometry( bubbleSize/4, 16, 16 );
	var nucleusMaterial = new THREE.MeshPhysicalMaterial( {transparent:true, opacity:0.4, color: 0x00E5EE, roughness:0.22, metalness:0.5} );
	var nucleus = new THREE.Mesh( nucleusGeometry, nucleusMaterial );
	nucleus.renderOrder=0;
	bubble.add( nucleus );*/
	bubble.scale.set(0.01,0.01,0.01);

	
	var curInfluence=0;
	var curFraction=0;
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );
			
			if(bubble.scale.length()<1){
				if(delta <1 ){
					bubble.scale.addScalar ( delta/5 );
				}
			}else{
				if(delta <1 ){
					bubble.evaporate(delta);
				}
			}
			/*var ci=Math.round(curInfluence/100) ;
			for ( var cl = 0; cl < 10; cl ++ ) {
				bubble.morphTargetInfluences[cl] = 0;
			}
			bubble.morphTargetInfluences[curInfluence] = curFraction
			if(curFraction<1){
				curFraction+= 0.01;//Speed ratio
			}else{
				curFraction=0;
				curInfluence++;
			}
			if(curInfluence>9){
				curInfluence=0;
			}*/
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    
}());
