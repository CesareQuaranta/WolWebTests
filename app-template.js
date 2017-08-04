(function () {
	var wsConnection = new WebSocket("ws://localhost:8080/wol/test");
	
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
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
	
    var renderLoop =function () {
			requestAnimationFrame( renderLoop );
			var delta = clock.getDelta();
			controls.update( delta );
			renderer.render(scene, camera);
			stats.update();
    	 };
    renderLoop();
    

	wsConnection.onopen = function(event){
		  console.log("connessione effettuata");
		  var param={};
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
	  }
}());
