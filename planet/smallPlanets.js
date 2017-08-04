(function () {
	var distanceCompression=20;//1-20
	//In kilometri
	var planetRadius=6371;
	var satelliteRadius=1700;
	var satelliteOrbit=384400/distanceCompression;
	var sunOrbit=149600000/distanceCompression;
	var sunRadius=695700;
	
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 1000000000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = planetRadius+satelliteOrbit+(satelliteRadius*2);
	var renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClear = true;
	renderer.shadowMap.enabled	= true;
	renderer.setFaceCulling( THREE.CullFaceNone );
	document.body.appendChild( renderer.domElement );
	
	//Lights
	var light = new THREE.AmbientLight( 0x404040 ,0.3); // soft white light
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

	var planetGeometry = new THREE.SphereGeometry( planetRadius, 64, 64 );
	var earthMap = new THREE.TextureLoader().load("/img/earthmap1k.jpg");
	var earthBump = new THREE.TextureLoader().load("/img/earthbump1k.jpg");
	var earthSpecular = new THREE.TextureLoader().load("/img/earthspec1k.jpg");
	var planetMaterial = new THREE.MeshPhongMaterial( 
			{color: 0xffffff, 
			map:earthMap, 
			bumpMap:earthBump, 
			bumpScale:0.5,
			specularMap : earthSpecular,
			specular  : new THREE.Color('grey'),
			depthWrite  : true,
			depthTest: true
			} );
	var planet=new THREE.Mesh( planetGeometry, planetMaterial );
	//planet.receiveShadow=true;
	planet.castShadow=true;
	planet.rotazione=0;
	var atmosphereMap = new THREE.TextureLoader().load("/img/earthcloudmap.png");
	var atmosphereGeometry   = new THREE.SphereGeometry(planetRadius+100, 64, 64)
	var atmosphereMaterial  = new THREE.MeshPhongMaterial({
	  map     : atmosphereMap,
	  side        : THREE.FrontSide,
	  opacity     : 0.4,
	  transparent : true,
	  depthWrite  : true,
	  depthTest: true,
	 // alphaTest: 1
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
	satellite.position.set(satelliteOrbit,0,0);
	satellite.receiveShadow=true;
	//satellite.castShadow=true;
	satellite.orbit=Math.PI*1.5;//2
	scene.add(satellite);
	
	var sunGeometry = new THREE.SphereGeometry( sunRadius, 64, 64 );
	var sunMap = new THREE.TextureLoader().load("/img/sunmap.jpg");
	var sunMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff,
		emissiveMap: sunMap,
		emissive:0xffffff
		} );
	var sun=new THREE.Mesh( sunGeometry, sunMaterial );
	sun.position.set(sunOrbit, 0, 0 );
	scene.add(sun);
	var sunLight = new THREE.DirectionalLight( 0xffffff);
	sunLight.position.set( satelliteOrbit+(satelliteRadius*2), 0, 0 );
	
	sunLight.castShadow = true;
	/*sunLight.shadowCameraLeft = -3000;
	sunLight.shadowCameraRight = 3000;
	sunLight.shadowCameraTop = 3500;
	sunLight.shadowCameraBottom = -3000;*/
	scene.add( sunLight );
	
	camera.lookAt(planet);
	camera.updateProjectionMatrix();
	var pAngle=THREE.Math.degToRad(27);
	var pAxis = new THREE.Vector3(0,1,0);
	pAxis.applyAxisAngle(new THREE.Vector3( 0, 0, 1 ),pAngle );
	pAxis.normalize();
	planet.rotation.z=pAngle;
	
	var vAngolarePianeta=((Math.PI*2)/(24*60*60*1000));//Xchè al millisecondo???
	var curPlanetQuaternion = planet.quaternion;
	var pQuaternion = new THREE.Quaternion();
	var now = new Date( Date.now()+(6*60*60*1000));//US timezone
	var midnight = new Date(now.getFullYear() , now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var deltaDay=now.getTime()-midnight.getTime();
	pQuaternion.setFromAxisAngle(pAxis, vAngolarePianeta*deltaDay);//imposta inizialmente in base all'ora del giorno

	curPlanetQuaternion.multiplyQuaternions(pQuaternion, curPlanetQuaternion);
	curPlanetQuaternion.normalize();
	
	planet.setRotationFromQuaternion(curPlanetQuaternion);
	
	var lineMaterial = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});

	var lineGeometry = new THREE.Geometry();
	pAxis.multiplyScalar(planetRadius+3000);
	lineGeometry.vertices.push(
			pAxis,
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( -pAxis.x, -pAxis.y, -pAxis.z )
	);

	var line = new THREE.Line( lineGeometry, lineMaterial );
	scene.add( line );
	
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );


			
			var curPlanetQuaternion = planet.quaternion;
			
			pQuaternion.setFromAxisAngle(pAxis,vAngolarePianeta*delta);
			curPlanetQuaternion.multiplyQuaternions(pQuaternion, curPlanetQuaternion);
			curPlanetQuaternion.normalize();
			
			planet.setRotationFromQuaternion(curPlanetQuaternion);
			//planet.rotation.y  += 1/32 * delta;
			satellite.rotation.y += 1/32 * delta;
			if(satellite.orbit<2*Math.PI){
				satellite.orbit += delta/100;
			}else{
				satellite.orbit=0;
			}
			var satelliteX=(satelliteOrbit)*Math.sin(satellite.orbit);
			var satelliteZ=(satelliteOrbit)*Math.cos(satellite.orbit);
			satellite.position.set(satelliteX,0,satelliteZ);
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    
}());
