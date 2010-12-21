
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
		if(options.debug) console.log("initied with options", options);

		return this.each(function() {
			var $container = $(this);

			// dom elements that trigger $toggleables
			var $triggers = $container.find(options.trigger);
			// dom elements that can be toggled
			var $toggleable = $container.find(options.target);

			$toggleable.bind("togglein", options.togglein).bind("toggleout", options.toggleout);

			$triggers.each(function() {
				var $trigger = $(this),
					$toggles = $toggleable;
					toggleGroup = $trigger.attr(options.group);

				if(options.debug) console.log("$toggleable ~ found new trigger", $trigger, toggleGroup);
				if(options.debug) console.log("	$toggles = $container.find("+options.target+")", $toggleable);

				if(toggleGroup) {
					$toggles = $toggles.filter("["+options.group+"*="+toggleGroup+"]");
					if(options.debug) $.log("		$toggles.filter(["+options.group+"*="+toggleGroup+"])", $toggleable);
				}
				if(options.filter) {
					$toggles = $toggles.filter(options.filter);
					if(options.debug) $.log("		$toggles.filter("+options.filter+")", $toggleable);
				}

				$trigger.live(options.event, function(e) {
					var toggleVal = $trigger.attr(options.toggle);
					if(!toggleVal) toggleVal = $trigger.val() ? $trigger.val() : $trigger.text();

					var $toggleOut = $toggles.filter(":not(["+options.toggle+"*="+toggleVal+"])");
					var $toggleIn = $toggles.filter("["+options.toggle+"*="+toggleVal+"]");

					if(options.debug) {
						console.log("$trigger." + options.event + " triggered with value \""+toggleVal+"\" on", $trigger);
						console.log("	$toggles.filter(" + ":not(["+options.toggle+"*="+toggleVal+"])", $toggleOut);
						console.log("	$toggles.filter(" + "["+options.toggle+"*="+toggleVal+"])", $toggleIn);
					}

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

})(jQuery);