var meshEditor = function(cxtMngr,layoutMngr){

	var _ray,  _mouse;
	var _control , _gridHelper;
	var  _cxtMngr = cxtMngr;
	var _bboxHelper;
	var _layoutMngr = layoutMngr;
	var _controlsTrackBall;
	function _init(){
		var size = 1000;
		var step = 100;
		_gridHelper = new THREE.GridHelper( size, step );
		_control = new THREE.TransformControls( _cxtMngr.camera, _cxtMngr.renderer.domElement );
		_mouse = new THREE.Vector2();
		_control.addEventListener( 'change', _animate );
		//_control.addEventListener( 'objectChange', _onDocumentClick );
		_ray = new THREE.Raycaster()

		_cxtMngr.animator(_animate);

		window.addEventListener('keydown', _onKeyDown);
		_controlsTrackBall = new THREE.TrackballControls( _cxtMngr.camera );

		_controlsTrackBall.rotateSpeed = 1.0;
		_controlsTrackBall.zoomSpeed = 1.2;
		_controlsTrackBall.panSpeed = 0.8;
		_controlsTrackBall.noZoom = false;
		_controlsTrackBall.noPan = false;
		_controlsTrackBall.staticMoving = true;
		_controlsTrackBall.dynamicDampingFactor = 0.3;
		_controlsTrackBall.keys = [ 65, 83, 68 ];
		_controlsTrackBall.addEventListener( 'change', _animate );

		if($(_cxtMngr.container).hasClass('canvas')){
			_cxtMngr.container.addEventListener("mousedown",_onDocumentClick);
		

			window.addEventListener( 'keydown', function ( event ) {
				//console.log(event.which);
				switch ( event.keyCode ) {
		          case 81: // Q
		          _control.setSpace( control.space == "local" ? "world" : "local" );
		            // console.log('Q');
		            break;
		          case 87: // W
		          _control.setMode( "translate" );
		            // console.log('W');
		            break;
		          case 69: // E
		          _control.setMode( "rotate" );
		            // console.log('E');
		            break;
				case 82: // R
					_control.setMode( "scale" );
					// console.log('R');
					break;
				case 27: // Escape
					_control.detach();
					editorCommunicator.select(($(_cxtMngr.container).hasClass('canvas'))? ('canvas') : ('meshDispl'));
					// console.log('R');
					break;
					
				case 107: // +,=,num+
					_control.setSize( _control.size + 0.1 );
				break;
				case 189:
				case 10: // -,_,num-
					_control.setSize( Math.max(_control.size - 0.1, 0.1 ) );
				break;
				}
			});
		}
		
	}

	function _animate(){
		requestAnimationFrame( _animate );
		//TWEEN.update();
		_control.update();
		_controlsTrackBall.update();
		_cxtMngr.renderer.render(_cxtMngr.scene,_cxtMngr.camera);
	};

	var _addMesh = function(pathToModel,onLoad){

		var onLoadFn = onLoad || function(){};

		var onProgress =  function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
					
			}
		};

		var err  = function(xhr){
			console.log(err);
		};
		var loader = new THREE.SceneLoader();
		loader.load( pathToModel, function ( result )  {

				// create a mesh with models geometry and material
				// create a new material
				var model = result.scene.children[1];
				_cxtMngr.scene.add(model);
				_cxtMngr.meshes.push(model);
				_layoutMngr.linear(_cxtMngr.meshes);
				onLoadFn();

			}, onProgress,err);
	};

	

	var _displayGrid = function(val){
				
		if(val){
			_cxtMngr.scene.add( _gridHelper );
		}else{
			_cxtMngr.scene.remove( _gridHelper );
		}
	};

	
	var _removeMesh = function(obj){
		_cxtMngr.scene.remove(obj);
	};

	var _getAll = function(){
		return _cxtMngr.meshes;
	};

	var  _has  = function(object, key) {
	      return object ? hasOwnProperty.call(object, key) : false;
	};

	var _getParent = function(obj){
				
		var parent = obj;
		
		while(_has(parent,"parent")){
			if( _has(parent,'name') &&
				parent.name == 'Fbx_Root'){
					break;
			}
			parent = parent.parent;
		}

		return parent;
	};

	var _onDocumentClick = function ( event ) {

		var parentOffset = $(_cxtMngr.container).offset(); 
	   //or $(this).offset(); if you really just want the current element's offset
	   _mouse.x = (( event.clientX - parentOffset.left + window.scrollX ) / $(_cxtMngr.container).width() ) * 2 - 1;
		_mouse.y = - (( event.clientY  - parentOffset.top + window.scrollY )/ $(_cxtMngr.container).height() ) * 2 + 1;

		_ray.setFromCamera(_mouse, _cxtMngr.camera);
		var intersections = _ray.intersectObjects ( cxtMngr.meshes ,true);

		if ( intersections.length > 0 ) {
			
			var parent = _getParent(intersections[ 0 ].object);
			var index = _cxtMngr.meshes.indexOf( parent );
			_selected = _cxtMngr.meshes[index];
			
			_cxtMngr.scene.add(_control);
			_layoutMngr.setInFront(index,false);

			// raise event for object sleected.
			editorCommunicator.select('object');

			_control.detach();
			_control.attach( _selected );
			

		}

	};

	var _getSelected = function(){
		return _selected;
	}

	_init();

	return {
		add :  _addMesh,
		displayGrid: _displayGrid,
		getSelected : _getSelected,
		remove : _removeMesh,
		getAll : _getAll,
		unSelect : function(){_control.detach();}
	}

};