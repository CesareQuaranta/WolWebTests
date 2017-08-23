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
	

	//Stats
	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	
	var controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.15;
	controls.keys = [ 65, 83, 68 ];
	
	//Particles
	var maxParticleCount = 800;
	var particleCount = 0;
	var maxRadius=10;
	var maxDepth=1;
    var particles = new THREE.Geometry();
    //Init vertices
    for (var p=0;p<maxParticleCount;p++){
    	particles.vertices.push(new THREE.Vector3(0, 0, camera.position.z));
    }
    var sprite = new THREE.TextureLoader().load( "/img/disc.png" );
    
    pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 5,
      sizeAttenuation: false, 
      blending: THREE.AdditiveBlending,
      map: sprite, 
      alphaTest: 0.5, 
      transparent: true
    });
    

	// create the particle system
	var particleSystem = new THREE.Points(
	    particles,
	    pMaterial);
	particleSystem.sortParticles = true;
	// add it to the scene
	scene.add(particleSystem);
	
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );
			//init new particle if needed
			if(particleCount<maxParticleCount){
				var np = particles.vertices[particleCount];
				np.radius=maxRadius;
				np.angle=Math.random() * Math.PI * 2;//Random Angle
				np.depth = (Math.random()-0.5)*maxDepth;
				 // add it to the geometry
				 //= np;
				 //particles.vertices.push(np);
				 particleCount++;
			}
			
		if(delta < 1){
			 //process particles position		
			  var pCount = particleCount;
			  while (pCount--) {

			    // get the particle
			    var particle =
			      particles.vertices[pCount];
			    particle.radius-=delta;//TODO Aggiungere funzione per bilanciare forza cinetica di rotazione seno o coseno?
			    if(particle.radius <=0){
			    	particle.radius = maxRadius;
			    	particle.z = 0;
			    }
			    particle.x=Math.sin(particle.angle) * particle.radius;
		    	particle.y=Math.cos(particle.angle) * particle.radius;
		    	particle.z=((maxRadius - particle.radius)/3)*particle.depth;
			  }
				
		}
		// add some rotation to the system
		particleSystem.rotation.z += delta*3;

			particleSystem.geometry.verticesNeedUpdate = true;
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    
}());
