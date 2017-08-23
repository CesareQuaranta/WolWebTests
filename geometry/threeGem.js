(function () {
	var wsConnection = new WebSocket("ws://localhost:8080/wol/test");
	
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 10000 );
	camera.position.x = 5;
	camera.position.y = 0;
	camera.position.z = 30;
	var renderer = new THREE.WebGLRenderer({ alpha: true });
	//renderer.setClearColor( 0x000000, 0 );
	/*Tentativo bump map*/
	renderer.setClearColor( 0x060708 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.renderReverseSided = false;
	//
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );

	scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
	/*spotLight = new THREE.SpotLight( 0xffffbb, 2 );
	spotLight.position.set( 5, 5, 5 );
	scene.add( spotLight );
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 2048;
	spotLight.shadow.mapSize.height = 2048;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 1500;
	spotLight.shadow.camera.fov = 40;
	spotLight.shadow.bias = -0.005;*/
	
	var light2 = new THREE.SpotLight();
    light2.position.set(0, 30, 30);
    light2.intensity = 1.2;
    light2.castShadow = true;
    scene.add(light2);
	
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
	
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    
    var insertAsteroid = function (vertices,faces) {
    	
    	var asteroidGeometry = new THREE.Geometry();
    	for (var i = 0; i < vertices.length; i++) { 
    		asteroidGeometry.vertices.push(new THREE.Vector3(vertices[i].x,vertices[i].y,vertices[i].z));
    	}
    	for (var j = 0; j < faces.length; j++) { 
    		asteroidGeometry.faces.push( new THREE.Face3( faces[j].v1, faces[j].v2, faces[j].v3 ) );
    		asteroidGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(0, 1),new THREE.Vector2(1, 1)]);
     	}

   		
    	asteroidGeometry.computeFaceNormals();
    	asteroidGeometry.computeVertexNormals();
    	/*
    	asteroidGeometry.computeBoundingBox();

    	var max = asteroidGeometry.boundingBox.max,
    	    min = asteroidGeometry.boundingBox.min;
    	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    	for (var f = 0; f < faces.length; f++) { 
    		var v1 = asteroidGeometry.vertices[asteroidGeometry.faces[f].a], 
            v2 = asteroidGeometry.vertices[asteroidGeometry.faces[i].b], 
            v3 = asteroidGeometry.vertices[asteroidGeometry.faces[i].c];

    		asteroidGeometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
            new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
            new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
        ]);
    	} 
    	*/
      	//THREEx.GeometryUtils.center(asteroidGeometry);;
    	
    	var mapBump = new THREE.TextureLoader().load( "/img/bMetallic2.jpg" );
    	var map = new THREE.TextureLoader().load("/img/bMetallic.jpg");
    	map.wrapS=THREE.MirroredRepeatWrapping;
    	map.wrapT=THREE.MirroredRepeatWrapping;

    	var hgMaterial = new THREE.MeshPhongMaterial( {
			color: 0xffffff,
			specular: 0xffaa00,
			shininess: 100,
			bumpMap: mapBump,
			bumpScale: 0.5,
			map : map
		} );
    	var newAsteroid = new THREE.Mesh( asteroidGeometry,  hgMaterial);
    	newAsteroid.castShadow = true;
    	newAsteroid.receiveShadow = true;
    	scene.add(newAsteroid);
    	
    	var vHelper = new THREE.VertexNormalsHelper( newAsteroid, 2, 0x00ff00, 1 );
    	var fHelper = new THREE.FaceNormalsHelper( newAsteroid, 2, 0xff0000, 1 );
    	scene.add(vHelper);
    	scene.add(fHelper);
    	
    }
	wsConnection.onopen = function(event){
		  console.log("connessione effettuata");
		  var param={hg:{l1:5,l2:7,l3:10,l4:3,aX:28,a3X:-70.685,a1Y:200,a2Y:160,a3Y:180,aZ:68,cXZ:0.21,cY:0.35}};
	      wsConnection.send(JSON.stringify(param));
	    };
	  wsConnection.onclose = function(event){
		  console.log("connessione chiusa "+event.code +" "+event.reason);
	    }; 
	  wsConnection.onerror = function(event){
		  console.log("errore nella connessione "+event);
	    };
	  wsConnection.onmessage = function(event){
		  console.log("messaggio ricevuto:"+event.data) ;
		  try
		  {
		     var json = JSON.parse(event.data);
		     insertAsteroid(json.vertices,json.faces)
		  }
		  catch(e)
		  {
		  }
		  
		 /* var jsonMsg = JSON.parse(event.data);
		  jsonMsg.Phenomens.forEach(function processPhenomen(phenomen, i) {
			    /*if(phenomen.type === "A"){
			    	wol.sceneManager.insertAsteroid(phenomen.ID,phenomen.position,phenomen.materiaID,phenomen.geometry.vertices,phenomen.geometry.faces,{x:0,y:0,z:0},phenomen.rotation);
			    }*/
			//},this);
	  }
}());
