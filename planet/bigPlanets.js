(function () {
	
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 1000000000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 70000000;
	var renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClear = true;
	renderer.shadowMapEnabled	= true;
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
	
	var planetRadius=6371000;
	var satelliteRadius=1700000;
	var satelliteOrbit=38440000;
	var sunOrbit=149600000000;
	/*
	var testGeometry = new THREE.SphereGeometry( 1, 32, 32 );
	var earthMap = new THREE.TextureLoader().load("/img/earthmap1k.jpg");
	var earthBump = new THREE.TextureLoader().load("/img/earthbump1k.jpg");
	var earthSpecular = new THREE.TextureLoader().load("/img/earthspec1k.jpg");
	var testMaterial = new THREE.MeshPhongMaterial( 
			{color: 0xffffff,
		     map:earthMap,
		     bumpMap:earthBump, 
			 bumpScale:0.05,
			 specularMap : earthSpecular,
			 specular  : new THREE.Color('grey')});
	var testMesh=new THREE.Mesh( testGeometry, testMaterial );
	testMesh.receiveShadow=true;
	testMesh.castShadow=true;
	scene.add(testMesh);
	
	
	var testLight = new THREE.PointLight( 0xffffff, 1, 0 ,0);
	testLight.position.set( 1000, 0, 0 );//Limith 4 pointlight
	testLight.castShadow = true;
	scene.add( testLight );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( sunOrbit, 0, 0 );
	directionalLight.castShadow = true;
	scene.add( directionalLight );
	
	var satelliteGeometry = new THREE.SphereGeometry( 1700000, 20, 20 );
	var satelliteMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff,depthWrite  : true,
		depthTest: true} );
	var satellite=new THREE.Mesh( satelliteGeometry, satelliteMaterial );
	satellite.position.set(satelliteOrbit,0,0);
	satellite.receiveShadow=true;
	satellite.castShadow=true;
	scene.add( satellite );
	*/

	var planetGeometry = new THREE.SphereGeometry( planetRadius, 32, 32 );
	var earthMap = new THREE.TextureLoader().load("/img/earthmap1k.jpg");
	var earthBump = new THREE.TextureLoader().load("/img/earthbump1k.jpg");
	var earthSpecular = new THREE.TextureLoader().load("/img/earthspec1k.jpg");
	var planetMaterial = new THREE.MeshPhongMaterial( 
			{color: 0xffffff, 
			map:earthMap, 
			bumpMap:earthBump, 
			bumpScale:0.05,
			specularMap : earthSpecular,
			specular  : new THREE.Color('grey'),
			//depthWrite  : true,
			//depthTest: true
			} );
	var planet=new THREE.Mesh( planetGeometry, planetMaterial );
	//planet.receiveShadow=true;
	//planet.castShadow=true;
	
	var atmosphereMap = new THREE.TextureLoader().load("/img/earthcloudmap.png");
	var atmosphereGeometry   = new THREE.SphereGeometry(planetRadius+300000, 32, 32)
	var atmosphereMaterial  = new THREE.MeshPhongMaterial({
	  map     : atmosphereMap,
	  side        : THREE.FrontSide,
	  opacity     : 0.4,
	  transparent : true,
	  depthWrite  : false,
	  depthTest: false,
	  alphaTest: 0.4
	})
	var planetAtmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
	planet.add(planetAtmosphere)
	//scene.add(planetAtmosphere);
	scene.add(planet);
	
	var satelliteGeometry = new THREE.SphereGeometry( satelliteRadius, 20, 20 );
	var moonMap = new THREE.TextureLoader().load("/img/moonmap1k.jpg");
	var moonBump = new THREE.TextureLoader().load("/img/moonbump1k.jpg");
	var satelliteMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff
		,depthWrite  : true,
		depthTest: true,
		map: moonMap,
		bumpMap:moonBump, 
		bumpScale:0.05,
		} );
	var satellite=new THREE.Mesh( satelliteGeometry, satelliteMaterial );
	satellite.position.set(planetRadius+satelliteRadius+satelliteOrbit,0,0);
	//satellite.receiveShadow=true;
	//satellite.castShadow=true;
	satellite.orbit=Math.PI / 2;
	scene.add(satellite);
	
	var sunLight = new THREE.DirectionalLight( 0xffffff);
	sunLight.position.set( sunOrbit, 0, 0 );
	//sunLight.castShadow = true;
	scene.add( sunLight );
	
	camera.lookAt(planet);
	camera.updateProjectionMatrix();
	
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );
			planet.rotation.y  += 1/32 * delta;
			satellite.rotation.y += 1/32 * delta;
			if(satellite.orbit<2*Math.PI){
				satellite.orbit += delta/100;
			}else{
				satellite.orbit=0;
			}
			var satelliteX=(planetRadius+satelliteRadius+satelliteOrbit)*Math.sin(satellite.orbit);
			var satelliteZ=(planetRadius+satelliteRadius+satelliteOrbit)*Math.cos(satellite.orbit);
			satellite.position.set(satelliteX,0,satelliteZ);
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    
}());
