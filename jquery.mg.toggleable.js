
 /*
 * jQuery mgToggleable plugin
 *
 * Copyright (c) 2010 Magenta Creations. All rights reserved.
 * Licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.
 *  Summary : <http://creativecommons.org/licenses/by-nc-sa/3.0/>
 *  Legal : <http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode>
 *
 * Royalty-free license for commercial purpose available on demand
 *
 * contact@mg-crea.com
 * http://mg-crea.com
 */

(function( $, undefined ) {

if(!window.console) window.console = {};

$.fn.extend({

	toggleable : function(options) {

		var defaults = {
			trigger: ".ui-trigger-toggle", // anchors, selects, etc.
			event: "click.toggleable", // click, change, etc.
			group: "data-toggle-group",
			target: ".ui-toggleable",
			toggle: "data-toggle",
			debug: false,
			filter: null,
			activate: false,
			togglein: function(ev, ui) { // ui => trigger
				var $t = $(ev.target);
				//console.log('toggleIn', ev.target, ui);
				$t.addClass("ui-state-active").show();
				//if($t.is(".input.text, .input.checkbox")) $t.enableInput();
			},
			toggleout: function(ev, ui) { // ui => trigger
				var $t = $(ev.target);
				//console.log('toggleOut', ev.target, ui);
				$t.removeClass("ui-state-active").hide();
				//if($t.is(".input.text, .input.checkbox")) $t.disableInput();
			}
		};

		options = $.extend(defaults, options);

		if(!options.debug) logger.disableLogger();

		console.log("$toggleable ~ initied with options", options);

		return this.each(function() {
			var $container = $(this);

			// dom elements that trigger $toggleables
			var $triggers = $container.find(options.trigger);
			// dom elements that can be toggled
			var $toggleable = $container.find(options.target);

			$toggleable.bind("togglein", options.togglein).bind("toggleout", options.toggleout);

			$triggers.each(function() {
				var $trigger = $(this),
					$toggles = $toggleable,
					toggleGroup = $trigger.attr(options.group);

				console.log("$toggleable ~ found new trigger", $trigger, toggleGroup);
				console.log("	$toggles = $container.find("+options.target+")", $toggleable);

				if(toggleGroup) {
					$toggles = $toggles.filter("["+options.group+"*="+toggleGroup+"]");
					console.log("		$toggles.filter(["+options.group+"*="+toggleGroup+"])", $toggleable);
				}
				if(options.filter) {
					$toggles = $toggles.filter(options.filter);
					console.log("		$toggles.filter("+options.filter+")", $toggleable);
				}

				$trigger.bind(options.event, function(e) { // TODO : investigate why live() is not working
					var toggleVal = $trigger.attr(options.toggle);
					if(!toggleVal) toggleVal = $trigger.val() ? $trigger.val() : $trigger.text();

					var $toggleOut = $toggles.filter(":not(["+options.toggle+"*="+toggleVal+"])");
					var $toggleIn = $toggles.filter("["+options.toggle+"*="+toggleVal+"]");

					console.log("$trigger." + options.event + " triggered with value \""+toggleVal+"\" on", $trigger);
					console.log("	$toggles.filter(" + ":not(["+options.toggle+"*="+toggleVal+"])", $toggleOut);
					console.log("	$toggles.filter(" + "["+options.toggle+"*="+toggleVal+"])", $toggleIn);

					$triggers.not($trigger).removeClass("ui-state-active");
					$trigger.addClass("ui-state-active");

					$toggleOut.trigger("toggleout", $trigger);
					$toggleIn.trigger("togglein", $trigger);

				});

				if(options.activate) $trigger.trigger(options.event);

			});
		});
	}

});

/*
 * logger wrapper
 */

var logger = function() {
	var oldConsoleLog = null;
	var pub = {};

	pub.enableLogger = function enableLogger() {
		if(oldConsoleLog == null) return;
		window['console']['log'] = oldConsoleLog;
	};

	pub.disableLogger = function disableLogger() {
		oldConsoleLog = console.log;
		window['console']['log'] = function() {};
	};

	return pub;
}();

})(jQuery);