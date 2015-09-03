 contextMngr = function(container){
	var _camera, _scene, _renderer,_canvas,_controls;
	var _animator = function(){
		if(_renderer != null){
			requestAnimationFrame( _animator );
			_renderer.render(_scene,_camera);
		}
	};
	var _meshes = [];
	var _container = container;
	
	function _setup(){
		var PERSPECTIVE_DIST = 2000;

		_camera = new THREE.PerspectiveCamera( 60, $(_container).width() /$(_container).height(), 1, PERSPECTIVE_DIST );
		_camera.position.set(0, 0, 10);
		_camera.lookAt(new THREE.Vector3(0,0,0));

		_scene = new THREE.Scene();
		_scene.add( new THREE.AmbientLight( 0xcccccc ) );
		var lightPoint = new THREE.DirectionalLight(  0xffffff, 1);
		var dir = new THREE.Vector3(1, 20 ,1 );
		lightPoint.position = dir;
		_scene.add(lightPoint  );
		_renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
		
		//_renderer.setPixelRatio( _container.devicePixelRatio );
		_renderer.setSize( $(_container).width(), $(_container).height());
		
		//_container.style.background = 'url(' + _container.toDataURL('image/png') + ')';
		//_container.style.backgroundSize = '32px 100%';
		_container.appendChild( _renderer.domElement );
		
		_animator();
		
	}

	
	_setup();

	return {
		container: _container,
		scene : _scene,
		camera : _camera,
		meshes : _meshes,
		renderer : _renderer,
		canvas : _canvas,
		animator : function(fn){
					_animator = fn;
				 }
	}
};

