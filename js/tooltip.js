;(function ($, Formstone, undefined) {

	"use strict";

	

	function construct(data) {
		this.on(Events.mouseEnter, data, onMouseEnter);
	}

	

	function destruct(data) {
		removeTooltip();

		this.off(Events.namespace);
	}

	

	function onMouseEnter(e) {
		removeTooltip();

		var data = e.data;

		data.left = e.pageX;
		data.top  = e.pageY;

		buildTooltip(data);
	}

	

	function onMouseLeave(e) {
		var data = e.data;

		Functions.clearTimer(data.timer);

		removeTooltip();
	}

	

	function onMouseMove(e) {
		positionTooltip(e.pageX, e.pageY);
	}

	

	function buildTooltip(data) {
		removeTooltip();

		var html = '';

		html += '<div class="';
		html += [RawClasses.base, RawClasses[data.direction] ].join(" ");
		html += '">';
		html += '<div class="' + RawClasses.content + '">';
		html += data.formatter.call(data.$el, data);
		html += '<span class="' + RawClasses.caret + '"></span>';
		html += '</div>';
		html += '</div>';

		Instance = {
			$tooltip    : $(html),
			$el         : data.$el
		};

		Formstone.$body.append(Instance.$tooltip);

		var $content = Instance.$tooltip.find(Classes.content),
			$caret   = Instance.$tooltip.find(Classes.caret),

			offset = data.$el.offset(),
			height = data.$el.outerHeight(),
			width  = data.$el.outerWidth(),

			tooltipLeft     = 0,
			tooltipTop      = 0,
			contentLeft     = 0,
			contentTop      = 0,
			caretLeft       = false,
			caretTop        = false,

			caretHeight     = $caret.outerHeight(true),
			caretWidth      = $caret.outerWidth(true),
			contentHeight   = $content.outerHeight(true),
			contentWidth    = $content.outerWidth(true);

		// position content
		if (data.direction === "right" || data.direction === "left") {
			caretTop   = (contentHeight - caretHeight) / 2;
			contentTop = -contentHeight / 2;

			if (data.direction === "right") {
				contentLeft = data.margin;
			} else if (data.direction === "left") {
				contentLeft = -(contentWidth + data.margin);
			}
		} else {
			caretLeft = (contentWidth - caretWidth) / 2;
			contentLeft = -contentWidth / 2;

			if (data.direction === "bottom") {
				contentTop = data.margin;
			} else if (data.direction === "top") {
				contentTop = -(contentHeight + data.margin);
			}
		}

		
		$content.css({
			top:  contentTop,
			left: contentLeft
		});

		$caret.css({
			top:  caretTop,
			left: caretLeft
		});

		
		if (data.follow) {
			data.$el.on(Events.mouseMove, data, onMouseMove);
		} else {
			if (data.match) {
				if (data.direction === "right" || data.direction === "left") {
					tooltipTop = data.top; 

					if (data.direction === "right") {
						tooltipLeft = offset.left + width;
					} else if (data.direction === "left") {
						tooltipLeft = offset.left;
					}
				} else {
					tooltipLeft = data.left; 

					if (data.direction === "bottom") {
						tooltipTop = offset.top + height;
					} else if (data.direction === "top") {
						tooltipTop = offset.top;
					}
				}
			} else {
				if (data.direction === "right" || data.direction === "left") {
					tooltipTop = offset.top + (height / 2);

					if (data.direction === "right") {
						tooltipLeft = offset.left + width;
					} else if (data.direction === "left") {
						tooltipLeft = offset.left;
					}
				} else {
					tooltipLeft = offset.left + (width / 2);

					if (data.direction === "bottom") {
						tooltipTop = offset.top + height;
					} else if (data.direction === "top") {
						tooltipTop = offset.top;
					}
				}
			}

			positionTooltip(tooltipLeft, tooltipTop);
		}

		data.timer = Functions.startTimer(data.timer, data.delay, function() {
			Instance.$tooltip.addClass(RawClasses.visible);
		});

		data.$el.one(Events.mouseLeave, data, onMouseLeave);
	}

	

	function positionTooltip(left, top) {
		if (Instance) {
			Instance.$tooltip.css({
				left : left,
				top  : top
			});
		}
	}

	

	function removeTooltip() {
		if (Instance) {
			Instance.$el.off( [Events.mouseMove, Events.mouseLeave].join(" ") );

			Instance.$tooltip.remove();
			Instance = null;
		}
	}

	

	function format(data) {
		return this.data("title");
	}

	

	var Plugin = Formstone.Plugin("tooltip", {
			widget: true,

			

			defaults: {
				delay        : 0,
				direction    : "top",
				follow       : false,
				formatter    : format,
				margin       : 15,
				match        : false
			},

			classes: [
				"content",
				"caret",
				"visible",
				"top",
				"bottom",
				"right",
				"left"
			],

			methods: {
				_construct    : construct,
				_destruct     : destruct
			}
		}),

		

		Classes       = Plugin.classes,
		RawClasses    = Classes.raw,
		Events        = Plugin.events,
		Functions     = Plugin.functions,

		

		Instance     = null;

})(jQuery, Formstone);