var layout = function(cxtMngr){
	var _objects;
	var _type = "circular";
	var dumbDemo_selected = 1;
	var _circular  = function(objects){
		_objects = objects;
		_type = "circular";
		_setInFrontCircular(0,true);
	};

	var _linear = function(objects){
		_objects = objects;
		_type = "linear";
		_setInFrontLinear(0,true);

	};

	var _horizontal =function(objects){
		_objects = objects;
		_type = "horizontal";
		_setInFrontHorizontal(1,true);
	};

	Array.prototype.rotate = function( n ) {
			  this.unshift.apply( this, this.splice( n, this.length ) )
			  return this;
			};

	var _setInFront = function(index){
		if(_type == "circular")
			_setInFrontCircular(index,false);
		else if(_type == "linear")
			_setInFrontLinear(index,false);			
		else if(_type == "horizontal")
			_setInFrontHorizontal(index,false);			
	};

	var _setInFrontLinear = function(objIndex,init){
		var objLen = _objects.length;
		var disp = {x : 100,y:0,z:100};

		for ( var i = 0; i < objLen; i ++ ) {
			var model = _objects[i];
			model.rotation.y = 0;
			if(i == 0){
				model.position.x = 0;
				model.position.y = 0;
				model.position.z = 0;
				
			}else{
				model.position.x = _objects[i - 1].position.x + disp.x;
				model.position.y = _objects[i - 1].position.y + disp.y;
				model.position.z = _objects[i - 1].position.z + disp.z;
			}
		}
	};

	
	var _setInFrontHorizontal = function(objIndex,init){

			var startZ = 100;
			var endZ = 300;
			var objLen = _objects.length;
			var centerPos = Math.floor(objLen/2);	
			if(init){
				
				var disp = 300;
				
				for ( var i = 0; i < objLen; i ++ ) {
					_objects[i].position.x = i > centerPos ? disp : (i == centerPos) ? 0 : -disp;
					_objects[i].position.z = startZ;
					_objects[i].position.y = 0;
					_objects[i].rotation.y = Math.PI/2;
					//objects[i].rotation.i = i > centerPos ? Math.PI : (i == centerPos) ? 0 : -disp;
					dumbDemo_selected = 1;
				}
			}else{
				var oldSelected = dumbDemo_selected;
				dumbDemo_selected = objIndex;
				
				var tweenObjOld = { 
						object : _objects[oldSelected],
						z: endZ
					};

				new TWEEN.Tween( tweenObjOld )
						.to( { z: startZ}, 1000 )
						.easing( TWEEN.Easing.Exponential.Out )
						.start()
						.onUpdate(function() {
							this.object.position.z = this.z;
						});
			}

			if(objIndex == centerPos){
				endZ = 400;
			}

			var tweenObj = { 
					object : _objects[objIndex],
					z: startZ
				};		
			new TWEEN.Tween( tweenObj )
					.to( { z: endZ}, 1000 )
					.easing( TWEEN.Easing.Quadratic.Out )
					.start()
					.onUpdate(function() {
						this.object.position.z = this.z;
					});
	};

	var _setInFrontCircular = function(objIndex,init){
		var objLen = _objects.length;
		var angle = Math.PI/ (objLen - 1);
		var dist = objIndex - Math.floor(objLen/2);
		var rotatedObjects = [];

		for ( var i = 0; i < objLen; i ++ ) {
			var car = _objects[i];
			var targetPos = car.position.clone();
			
			// Switch _objects index

			var currentAngle = (i * Math.PI/2   );
			var currentRotationY = (currentAngle - Math.PI/2)/2 ;

			var distAngle = dist*Math.PI/(objLen - 1);
			//var  rotatedIndex = (objLen + i - dist)%objLen ;

			var angleTarget = (currentAngle - distAngle);
			
			var rotationYTarget =   (angleTarget - Math.PI/2)/2 ;
			if(angleTarget < 0 ){
				angleTarget -= Math.PI - Math.PI/(objLen - 1);
				rotationYTarget =   (angleTarget - Math.PI/2)/2;
				rotationYTarget -= Math.PI;
				
			}
			else if(angleTarget > Math.PI ){
				angleTarget += Math.PI - Math.PI/(objLen - 1);
				rotationYTarget =   (angleTarget - Math.PI/2)/2;
				rotationYTarget += Math.PI;
				
			}
			
			
			var tweenObj = { object : _objects[i],
							angle: currentAngle,
							rotationY: currentRotationY
						};

			
			if(init){
				_objects[i].position.x =  Math.sin(currentAngle - Math.PI/2) * 500;
				_objects[i].position.z = Math.cos(currentAngle - Math.PI/2) * 500;
				_objects[i].rotation.y = currentRotationY + Math.PI/2;
			}else{
				if(distAngle != 0){
					new TWEEN.Tween( tweenObj )
						.to( { angle: angleTarget}, 1000 )
						.easing( TWEEN.Easing.Linear.None )
						.start()
						.onUpdate(function(){
							this.object.position.z = Math.cos(this.angle - Math.PI/2) * 500;
							this.object.position.x = Math.sin(this.angle - Math.PI/2 ) * 500;
							
						});

						new TWEEN.Tween( tweenObj )
						.to( { rotationY: rotationYTarget}, 1000 )
						.easing( TWEEN.Easing.Linear.None )
						.start()
						.onUpdate(function(){
							this.object.rotation.y = this.rotationY + Math.PI/2;
							
						});

				}
			}
			
			
		}

		if(!init)
			_objects.rotate(dist);

				
	};



	return {
		circular : _circular,
		linear : _linear,
		horizontal : _horizontal,
		setInFront : _setInFront
	};
};