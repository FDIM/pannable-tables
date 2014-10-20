(function() {
	/**
	 * Enables panning for selected elements. Usefull for large tables
	 * @author dtr
	 * @param {type} ops
	 * @returns
	 */
	jQuery.fn.pannable = function(ops) {
		var settings = {};
		var init = function() {
			var $tbl = $(this);
			var $container = $tbl.parent();
			// table size is ok
			var vertical = false;
			var horizonal = false;

			var panning = false;
			var lastPos = {x: 0, y: 0};
			var currentPos = {x: 0, y: 0};
			var updatePan = function() {
				if (!panning) {
					return;
				}
				if (vertical) {
					$container.scrollTop($container.scrollTop() + currentPos.y);
				}
				if (horizonal) {
					$container.scrollLeft($container.scrollLeft() + currentPos.x);
				}
				currentPos.x = 0;
				currentPos.y = 0;
				window.requestAnimationFrame(updatePan, $container.get(0));
			}
			var allowedTags = ['td', 'tr', 'table', 'tbody', 'thead'];
			var mousedown = function(e) {
				if (e.which != 1 && e.which != 2) {
					return;
				}

				var targetTag = e.target.tagName.toLowerCase();
				if (allowedTags.indexOf(targetTag) != -1) {
					e.preventDefault();
					e.isPropagationStopped();
					panning = true;
					lastPos.x = e.pageX;
					lastPos.y = e.pageY;
					$('body').addClass('no-select');
					window.requestAnimationFrame(updatePan, $container.get(0));
					//updateInterval = setInterval(updatePan,updateDelay);
					$(document).bind('mouseup', mouseup).bind('mousemove', mousemove);
				}
			};
			var mouseup = function(e) {
				panning = false;
				$('body').removeClass('no-select');
				$(document).unbind('mouseup', mouseup).unbind('mousemove', mousemove);
			};
			var mousemove = function(e) {
				if (!panning) {
					return;
				}
				currentPos.x += lastPos.x - e.pageX;
				currentPos.y += lastPos.y - e.pageY;

				lastPos.x = e.pageX;
				lastPos.y = e.pageY;
			};
			// evaluate if table needs panning
			var mouseenter = function() {
				horizonal = true;
				vertical = true;
				if ($tbl.width() <= $container.width()) {
					horizonal = false;
				}
				if ($tbl.height() <= $container.height()) {
					vertical = false;
				}
				if(vertical || horizonal){
					$container.css({cursor: 'move'});
					$tbl.bind('mousedown', mousedown);
				}else{
					$container.css({cursor: ''});	
				}
			}
			var mouseleave = function(){
				$tbl.unbind('mousedown',mousedown);
			}
			$tbl.bind('mouseenter',mouseenter);
		}
		// initialize elements
		this.map(init);
		return this;
	}
}());