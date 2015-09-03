var worldManager = (function()
	{
		var _worlds = [];
		var _selected;
		var _create = function(div){
			var _contextMngr =  new  contextMngr(div);
			var _layoutManager =  new  layout(_contextMngr);
			var _meshEditor =  new  meshEditor(_contextMngr,_layoutManager);
			var world = {
				container : div,
				contextManager: _contextMngr,
				layoutManager : _layoutManager,
				meshEditor : _meshEditor
			};
			_selected = world;
			_worlds.push(world);
		};

		var _select  = function(div){
			$.each(_worlds,function(index,obj)
				{
					if(obj.container == div)
						_selected = obj;			
				});
			
		};
	
		return {
			create: _create,
			select: _select,
			getSelected: function(){return _selected;}
		};

	})();