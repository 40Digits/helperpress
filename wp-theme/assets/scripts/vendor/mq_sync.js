define( function (){

	// fix indexof on ie8
	if (!Array.prototype.indexOf)
		Array.prototype.indexOf = function(elt /*, from*/){
			var len = this.length >>> 0,
				from = Number(arguments[1]) || 0,
				from = (from < 0) ? Math.ceil(from): Math.floor(from);

			if (from < 0)
				from += len;
			for (; from < len; from++)
				if (from in this && this[from] === elt)
					return from;

				return -1;
		};

	// Add Events Cross-browser
	// Set default
	var currentMQ = "unknown",

		reverseAssociations = {
			'mq_t'	: 'mq-tiny',
			'mq_s'	: 'mq-min-small',
			'mq_net': 'mq-min-netbook',
			'mq_m'	: 'mq-min-medium',
			'mq_p'	: 'mq-portrait',
			'mq_la'	: 'mq-landscape',
			'mq_l'	: 'mq-min-large',
			'mq_xl'	: 'mq-min-xlarge'
		},

		options = [
			'mq-tiny',
			'mq-min-small',
			'mq-min-netbook',
			'mq-min-medium',
			'mq-portrait',
			'mq-landscape',
			'mq-min-large',
			'mq-min-xlarge'
		],

		associations = {
			'mq-tiny'		: {
				'slug'		: 'mq_t',
				'value'		: 0,
				'bodyClass'	: 'device-phone'
			},

			'mq-min-small'	: {
				'slug'	: 'mq_s',
				'value'	: 1,
				'bodyClass'	: 'device-phone'
			},

			'mq-min-netbook'	: {
				'slug'	: 'mq_net',
				'value'	: 2,
				'bodyClass'	: 'device-tablet'
			},

			'mq-min-medium'	: {
				'slug'	: 'mq_m',
				'value'	: 3,
				'bodyClass'	: 'device-tablet'
			},

			'mq-portrait' :{
				'slug'	: 'mq_p',
				'value'	: 4,
				'bodyClass'	: 'device-tablet'
			},

			'mq-landscape' :{
				'slug'	: 'mq_la',
				'value'	: 5,
				'bodyClass'	: 'device-tablet'
			},

			'mq-min-large'	: {
				'slug'	: 'mq_l',
				'value'	: 6,
				'bodyClass'	: 'device-desktop'
			},

			'mq-min-xlarge'	: {
				'slug'	: 'mq_xl',
				'value'	: 7,
				'bodyClass'	: 'device-desktop'
			}
		},

		// Checks CSS value in active media query and syncs Javascript functionality
		mqSync = function(){

			// Fix for Opera issue when using font-family to store value
			if (window.opera){
				var activeMQ = window.getComputedStyle(document.body,':after').getPropertyValue('content');
			}
			// For all other modern browsers
			else if (window.getComputedStyle) 
			{
				var activeMQ = window.getComputedStyle(document.head,null).getPropertyValue('font-family');
			}
			// For oldIE
			else {
				// Use .getCompStyle instead of .getComputedStyle so above check for window.getComputedStyle never fires true for old browsers
				window.getCompStyle = function(el, pseudo) {
					this.el = el;
					this.getPropertyValue = function(prop) {
						var re = /(\-([a-z]){1})/g;
						if (prop == 'float') prop = 'styleFloat';
						if (re.test(prop)) {
							prop = prop.replace(re, function () {
								return arguments[2].toUpperCase();
							});
						}
						return el.currentStyle[prop] ? el.currentStyle[prop] : null;
					}
					return this;
				}
				var compStyle = window.getCompStyle(document.getElementsByTagName('head')[0], "");
				var activeMQ = compStyle.getPropertyValue("font-family");
			}

			if( ! ~options.indexOf(activeMQ) )
				activeMQ = 'mq-min-large';

			activeMQ = activeMQ.replace(/"/g, "");
			activeMQ = activeMQ.replace(/'/g, "");

			mqResult = associations[ activeMQ.toLowerCase() ];

			$('body').removeClass('device-tablet device-phone device-desktop').addClass(mqResult.bodyClass);

			return mqResult.slug;

		},// End mqSync

		test = function (val){
			var testVal = associations[ reverseAssociations[ val ] ].value,
				currVal = associations[ reverseAssociations[ mqSync() ] ].value;

			return ( currVal >= testVal ) ? true : false;
		};

	// Run on resize
	jQuery(window).resize(mqSync);

	return {
		active 	: mqSync,
		test	: test
	};

})