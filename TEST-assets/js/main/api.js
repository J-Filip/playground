//definiramo varijablu za koristenje jQuery objekata
//zabranjeno u mootoolsima koristiti varijablu jquery
var jquery = jQuery.noConflict();

//dropdown u headeru
jquery(document).ready(function(){
	var dropdown = jquery(".dropdown-wrapper");
	var site_dropdown = jquery('.site-menu-toggle');	
	var selected_wrapper = jquery('.site-dropdown-wrap');

	dropdown.on("click", function(e) {
		jquery(this).siblings().children(".dropdown-content").fadeOut(150);
		jquery(this).children(".dropdown-content").fadeToggle(150);
		jquery(this).siblings().removeClass('clicked');
		if (jquery(this).hasClass('clicked')) {
			jquery(this).removeClass('clicked');
		}
		else {
			jquery(this).addClass('clicked');
		}

		var links = jquery(this).find('ul li a');
		setTimeout(function() {
			assignTransformsToDropdownLinks(links);
		}, 200);
		
	});

	jquery(".two-level-dropdown-li").on("click", function(e) {
		if(jquery(e.target).hasClass('menu-override')) return;
		var li = jquery(this).find(".dropdown-content-2lvl");
		var sibling_lis = jquery(this).siblings().find(".dropdown-content-2lvl");
		sibling_lis.fadeOut(100);
		li.fadeToggle(150);
		e.stopPropagation();
	});

	jquery(document).on("click touchend", function(e) {		
		if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
			dropdown.children(".dropdown-content").fadeOut(150);
			dropdown.find(".dropdown-content-2lvl").fadeOut(150);
			dropdown.removeClass('clicked');
		}
		if (jquery(e.target).closest(selected_wrapper).length === 0) {
			site_dropdown.removeClass("selected");
			selected_wrapper.addClass('hide');
		}
	});

	var rightmenu = jquery("#right-menu").length;
	var clicktarget = jquery("#m10");

	if (rightmenu){
		clicktarget.children("i").css("color", "black");
		clicktarget.css("cursor", "pointer");
		clicktarget.on("click", function(e){
			var moveright = jquery("#right-menu").add(jquery("#content")).add(jquery("#sub-menu")).add(jquery("#site-menu")).add(jquery("#admin-student-submenu"));

			if (moveright.hasClass("css-move-right")){	
				moveright.removeClass("css-move-right");
				moveright.addClass("css-move-left");
			} else {			
				moveright.removeClass("css-move-left");
				moveright.addClass("css-move-right");
			}
		});
	}

	//meni cjelina dnevnika
	site_dropdown.on('click',function(e){	
		e.stopPropagation();
		var selected_dropdown = jquery(this);
		var selected_wrapper = jquery(this).siblings('.site-dropdown-wrap');

		var selected_dropdown_width = selected_dropdown.width();

		selected_wrapper.css('min-width', selected_dropdown_width + 2);

		selected_dropdown.toggleClass('selected');
		selected_wrapper.toggleClass('hide');
		jquery('.site-dropdown-wrap').each(function(i){
			if (!jquery(this).is(selected_wrapper)  && !jquery(this).hasClass('hide')){
				jquery(this).addClass('hide').siblings('.site-menu-toggle').removeClass('selected');
			}
		});	
	});

	var reports_dropdown =  jquery('.reports').children('a');
		reports_dropdown.on('click', function(e){
			e.stopPropagation();
			var height_reports = reports_dropdown.outerHeight(true);
			var selected_dropdown = jquery(this);
			var selected_report = jquery(this).next('.reports-wrap');

			if (selected_report.height() == 0){
				selected_report.css('padding', '0');
			}
			selected_report.css('margin-top', -height_reports-1);
			jquery('.reports-wrap').removeClass('hide').not(selected_report).addClass('hide');

			jquery(document).on("click touchend", function(e) {		
			    if (jquery(e.target).closest(selected_report).length === 0) {
			        selected_report.addClass('hide');
			    }
			});
	});

	 //pomicanje popup prozora kada se pojavi tipkovnica na mobile uredajima
	 //ne moze se znati kada se tipkovnica pojavi pa gleda resize
	 //uzme razliku visine screena nakon sto se tipkovnica pojavi i modal prozora pojavi te toliki top postavi
	 //takoder provjeri dali je modal window veci ili manji od preostalog height screena te tek onda pozicionira
	 //TODO: provjeriti zasto se popupovi ne pojavljuju na istom mjestu an ios i androidu (iOS vise na sredini ekrana, dok android na vrhu)
	  var originalSize = jquery(window).width() + jquery(window).height();
	  jquery(window).resize(function(){
	  	var modal_height = jquery('#modal-window').height();
	  	var height_keyboard = jquery(window).height();
	    if((jquery(window).width() + jquery(window).height() != originalSize) && (modal_height > jquery(window).height())){
			jquery('#modal-window').css('top', (height_keyboard-modal_height));
	    }else{
	     jquery('#modal-window').css('top', 20);
	    }
	  });


	//tableti kod click eventa ispali i mousemove event pa dolje fix ne radi
	//isMobile nije najpouzdaniji i trebat ce jos vidjeti gdje to ne radi
	if(!Browser.isMobile){
		document.documentElement.removeClass('no-hover');
		document.documentElement.addClass('hover');
	}
	
	if (jquery('#tbl-biljeske').length){
		var window_height = jquery(window).height();
		var content_height = jquery('#tbl-biljeske').offset().top;

		var pageslider = function (window_height){
			jquery('body','html').css('overflow-y', 'hidden');
			jquery('#tbl-biljeske').css('height', window_height-content_height-15);	
		}

		if (window_height >= 800){
			pageslider(window_height);
		}

		jquery(window).resize(function() {
			var window_height = jquery(this).height();
			if (window_height >= 800){
				pageslider(window_height);
			} else {
				jquery('body','html').css('overflow-y', 'auto');
				jquery('#tbl-biljeske').css('height', 'unset');	
			}
		}).resize();
	}

	//za linkove na koje zelimo sprjeciti event bubbling
	jquery('.stop-default').on('click',function(e){
		e.stopPropagation();
	});

	//scroll za dugacke nazive skole
	var span = jquery('#dropdown-school span');
	var div = jquery('#dropdown-school');

	if(div.length > 0 && span.length > 0) {
		var diff = span[0].offsetWidth - div[0].offsetWidth;
		if(diff > 0) {
			var css = '#dropdown-school span:hover{ transform: translate3d(-' + (diff + 5) + 'px,0,0); }';
			var style = jquery('<style></style>');

			if (style.styleSheet) {
    			style.styleSheet.cssText = css;
			} else {
    			style.append(document.createTextNode(css));
			}

			div.append(style);
		}
	}

	var assignTransformsToDropdownLinks = function($links) {
		jquery.each($links, function(index, item) {
			var $item = jquery(item);
			var $parent = jquery($item).closest('li');
			var diff = $parent[0].offsetWidth - $item[0].offsetWidth;

			if(diff < 0) {
				var id = $item.attr('id');
				var css = '#' + id + ':hover { transform: translate3d(' + (diff + 5) + 'px,0,0); }';
				var style = jquery('<style></style>');

				if (style.styleSheet) {
    				style.styleSheet.cssText = css;
				} else {
    				style.append(document.createTextNode(css));
				}

				$parent[0].append(style[0]);
			}
		});
	}
	//linkovi na koje hocemo loader staviti
	jquery('.edloader').on('click',function(){
		var wait = new edWait();
		wait.show();
	});

	//upozorenje za logout nakon 45min
	if(jquery('form#login').length == 0 && jquery('h1#accessibility-statement').length == 0) {
		var timeout = new edTimeout();
	}
});

/*
	 Trying to fix sticky hover problem on mobile devices
		https://github.com/twbs/bootstrap/pull/13049 
		var detectMouseMove = function() {
			document.documentElement.removeClass('no-hover');
			document.documentElement.addClass('hover');
			window.removeEvent('mousemove', detectMouseMove);
		};

		http://www.quirksmode.org/dom/events/mousemove.html
		window.document.addEvent('mousemove', detectMouseMove);

 Fontsize
 */
var cookieName = 'e-dnevnik fontsize';
var cookieDuration = 365;
var fontsize = Cookie.read(cookieName);

switch (fontsize) {
	case 'small':
		document.documentElement.addClass('small');
	break;

	case 'large':
		document.documentElement.addClass('large');
	break;
}

/*
 l10n helper function
 depends on l10n global JSON object with key:value translations
 https://code.google.com/p/jsgettext/
 */
function _(s) {
	try {
		if (typeof l10n[s] != 'undefined') {
			return l10n[s];
		} else {
			throw 'l10n string not found';
		}
	} catch (e) {
		// l10n object or string not found
		return s;
	}
}

/*
name: Browser.Mobile
description: Provides useful information about the browser environment
authors: Christoph Pojer (@cpojer)
license: MIT-style license.
requires: [Core/Browser]
provides: Browser.Mobile
*/

(function(){
	Browser.Device = {
		name: 'other'
	};

	if (Browser.Platform.ios){
		var device = navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)[0];
		Browser.Device[device] = true;
		Browser.Device.name = device;
	}

	if (this.devicePixelRatio === 2)
		Browser.hasHighResolution = true;
		Browser.isMobile = !['mac', 'linux', 'win'].contains(Browser.Platform.name);
}).call(this);


/*
Default event type
*/
var default_event_type = 'click';

/*
	description: Sets window scroll position to 0 when navigating to some other page.
	This is the normal behaviour of all desktop browsers. This could also fix reflow issues.
*/

(function(){
	if (Browser.safari && Browser.isMobile) {
		window.onpagehide = function(e){
			window.scrollTo(0,0);
		};
	}
})();

/*
* DOMready
*/
(function(){
	window.addEvent('domready', function(){

		/* edLayout */
		new edLayout();

		/* edSelect */
		new edSelect();

		if(!Browser.isMobile) {
			$$('.icon-asterisk.required').set('data-tooltip', _('Obavezno polje'));
			new edTips('.tipper'); //svi elementi sa tipper css klasom imaju tooltipse
		}

		edFlashMessage();
	});
})();

/**
 * Tooltips 
 * svi elementi sa .tipper klasom ce imati tooltip
 * tekst postaviti u data-tooltip="subject::content"
 */

var edTips = new Class ({
	initialize: function (cssClass, event) {
		$$(cssClass).each(function(el,index) {
			var title = el.getProperty('data-tooltip');
			if (title.contains('::')){
				var content = title.split('::');
				el.store('tip:title', content[0]);
				el.store('tip:text', content[1]);
			}
			else {
				el.store('tip:title', '');
				el.store('tip:text', title);
			}
		});
		new Tips(cssClass, {'className':'edTips'}); // css klasa za opis tipsa
	}
});

/**
 * edSelect class 
 * On option element change it does POST or redirect (GET without query string) to form action URL
 *
 */

var edSelect = new Class ({

	Implements: [Events, Options],
	options: {
		cssClass: 'ed-select'
	},

	initialize: function () {
		var forms = $$('.'+this.options.cssClass);

		forms.each(function(form){
			var selects = form.getElements('select');

			selects.addEvent('change', function(e){
				var method = form.getProperty('method');
				if (method) method = method.toLowerCase();

				if (method === 'post') {
					form.submit();
				} else {
					var action = form.getProperty('action');
					if (action[action.length-1] !== '/') action = action+'/';

					window.location.href = action+e.target.getSelected().get("value");
				}
			});
		});
	}
});

/**
 * fixdatepickerinput
 * description: Fixes Android readonly input focus quirk (datepicker_date)
*/

var fixdatepickerinput = function(el){
	if (Browser.Platform.android){
		$$('input.date-picker, input.datetime-picker').addEvent('focus', function(){
			this.setProperty('disabled', 'disabled');
			// gost, fixa datepicker probijanje na Android 4
			$$('.droid-z-input').setProperty('disabled', 'disabled');
		});

		$$('input.date-picker, input.datetime-picker').addEvent('blur', function(){
			this.removeProperty('disabled');
			// gost, fixa datepicker probijanje na Android 4
			$$('.droid-z-input').removeProperty('disabled');
		});
	}
};

/*
* Enable static methods and properties
*/
Class.Mutators.Static = function(members) {
	this.extend(members);
};


/**
 * edLayout Class
 *
 * Calculates layout and reflows:
 *        #content  -> top and bottom paddings
 *        #sub-menu -> top position
/*
description:

 */

//var kbup = false;
var edLayout = new Class({

	options: {
		content_extra_bottom_padding: 20
		//keyboard_up: false
	},

	Static: {
		preventEvent: false,

		addTouchFeedback: function(elements) {
			/* Touch feedback on elements for devices that support touch events */
			if (Modernizr.touch) {
				var delay = 50; // ms
				var timeout;
				var touch_class = 'touched';
				var select_class = 'selected';
				var self = this;

				elements.addEvent('touchstart', function(e){
					var element = this;
					var touches = e.touches ? e.touches.length : 1;

					self.preventEvent = false;

					if(touches === 1){
						timeout = setTimeout(function() {
							element.addClass(touch_class);
						}, delay);
					}
				});

				elements.addEvents({
					touchmove: function(e){
						// osjetljivost se moze podesavati za x-os, ali y-os ne
						// jer se element ne updatea dok je u pokretu (scrollanje)
						self.preventEvent = true;
						clearTimeout(timeout);
						this.removeClass(touch_class);
					},
					touchend: function(e){
						if(!self.preventEvent){
							clearTimeout(timeout);
							this.removeClass(touch_class);
						}
					},
					click: function(e){
						if(self.preventEvent){
							new DOMEvent(e).stop();
						}
					}
				});
			}
		},

		autofocus: function() {
			if (!Browser.isMobile) {
				var el;
				if(!edModal.modalShown) {
					el = $$('.autofocus').pick();
					if (el) el.focus();
				} else {
					el = $$('#modal-window .autofocus').pick();
					if (el) el.focus();
				}
			}
		}
	},

	initialize: function() {
		this.set();

		// prevents iOS zoom/scrool to divs larger wider 92%
		if (Browser.safari && Browser.isMobile){
			var previous, scrollflag = false;

			window.addEvent('touchmove', function(e){
				scrollflag = true;
			});

			window.addEvent('scroll', function(e){
				scrollflag = false;
			});

			window.addEvent('touchstart', function(e){
				var time = Date.now(),
					previous_time = previous || time,
					difference = time - previous_time,
					touches = e.touches ? e.touches.length : 1;
				previous = time;

				if(difference && difference <= 500 && touches === 1 && !scrollflag)
					e.preventDefault();
			});
		}

		/* prevent dummy links with href="#" */
		$$('a').addEvent('click', function(e){
			if(this.getProperty('href') === '#') new DOMEvent(e).stop();
		});

		/*
		if (Browser.isMobile){
			//document.body.addEvent('touchstart', function(e){ });
		}*/

		/*
		* hard reflow
		* for iOS5 Touch area in fixed div
		* after programatically scrolled (e.g. reloaded)
		*/
		if (Browser.safari && Browser.isMobile){
			$(document.documentElement).setStyle('height', '100%');
		}

		var ios5fix = $('ios5fix');
		window.addEvent('load', function(){
			if (ios5fix) ios5fix.setStyle('height', 0);
		});


		// tipkovnica fix
		
  		
		// addTouchFeedback
		edLayout.addTouchFeedback($$('.ed-row.touch-row, .ed-row-fixed.touch-row, .button2, ul.menu li'));

		/* ikone */
		(function(){
			$$('.edit-field, .row-edit').each(function(item){
				if(item.tagName === 'TR'){
					item = item.lastElementChild;
				}
				item.adopt(new Element('i', {'class': 'icon-pencil'}));
			});
		})();

		/* automatic focus */
		edLayout.autofocus();
	},

	set: function() {
		var headerYsize = 0, submenuYsize = 0, sitemenuYsize = 0, rightmenuallXsize = 0, rightmenuXsize = 0, studentadminmenuYsize = 0, footerYsize = 0;
		var header = $('header'), submenu = $('sub-menu'), content = $('content'), sitemenu = $('site-menu'), 
		rightmenu = $('right-menu'), studentadminmenu = $('admin-student-submenu'), footer = $('footer');
		
		if (header) { 
			headerYsize = header.getSize().y;
		}

		if (footer) { 
			footerYsize = footer.getSize().y;
		}

		if (sitemenu){
			sitemenuYsize = sitemenu.getSize().y;
			sitemenu.setStyles({
				'top': headerYsize
			});
		}
		if (rightmenu) {
			rightmenu.setStyles({
				'top' : headerYsize
			});
		}

		if (submenu){
			submenuYsize = submenu.getSize().y;
			submenu.setStyles({
				'top': headerYsize + sitemenuYsize,
				'padding-right': rightmenuallXsize
			});
		}

		if (studentadminmenu) {
			studentadminmenuYsize = studentadminmenu.getSize().y;
			studentadminmenu.setStyles({
				'top': headerYsize + sitemenuYsize + submenuYsize,
			});
		}

		if (content){
			content.setStyles({
				'padding-top': headerYsize+submenuYsize+sitemenuYsize+studentadminmenuYsize,
				'padding-bottom': this.options.content_extra_bottom_padding,
				'min-height': $(document.documentElement).getSize().y-(headerYsize+submenuYsize+this.options.content_extra_bottom_padding+sitemenuYsize+footerYsize),
				'padding-right': rightmenuallXsize + 15
			});
		}

		if (Browser.safari && Browser.isMobile){
			this.reflow();
		}
	},

	unset: function() {
		var submenu = $('sub-menu'), content = $('content');

		if (submenu) submenu.setStyle('top',  0);

		if (content){
			content.setStyles({
				'padding-top': 0,
				'padding-bottom': content.getStyle('padding-bottom').toInt()
			});
		}

		if (Browser.safari && Browser.isMobile)
			this.reflow();
	},

	reflow: function(element){
		var el = element || document.documentElement;
		el.setStyle('height', el.offsetHeight+1);
		el.setStyle('height', el.offsetHeight-1);
	}
});

/**
 * edActionMenu class
 *
 * Slider top menu for various purpose
 *
 * elements - clickable fields for menu activation
 * menuName - classname of the menu (inside #action-menu) that activates on element event
 *
 */

var edActionMenu = new Class({

	Implements: [Events, Options],
	options: {
		event_type: default_event_type
	},

	initialize: function(elements, menuName) {

		/* select */
		var delay = 75; // ms
		var timeout;
		var touch_class = 'touched';
		var select_class = 'selected';
		var prevent = false;

		$$(menuName+' *').setProperty('tabindex', '-1');

		if(Browser.isMobile){
			elements.addEvent('touchstart', function(e){
				var element = this;
				var touches = e.touches ? e.touches.length : 1;

				prevent = false;

				if(touches === 1){
					timeout = setTimeout(function() {
						$$('.'+touch_class).removeClass(touch_class);
						element.addClass(touch_class);
					}, delay);
				}
			});

			elements.addEvent('touchmove', function(e){
				// osjetljivost se moze podesavati za x-os, ali y-os ne
				// jer se element ne updatea dok je u pokretu (scrollanje)
				prevent = true;
				clearTimeout(timeout);
				$$('.'+touch_class).removeClass(touch_class);
			});
		}

		elements.addEvent(this.options.event_type,function(e){
			if(!prevent){
				selected = $$('.'+select_class);
				this.toggleClass(select_class);
				selected.removeClass(select_class);

				clearTimeout(timeout);
				this.removeClass(touch_class);

				$$('#action-menu div').removeClass('activate');

				if(this.hasClass(select_class)){
					$$(menuName).addClass('activate');
				}

				first	= this.getProperty('data-first');
				last	= this.getProperty('data-last');
				aID		= this.getProperty('data-action-id');
				aID2	= this.getProperty('data-action-id2');
				msg		= this.getProperty('data-msg');
				msg1		= this.getProperty('data-msg1');
				msg2		= this.getProperty('data-msg2');
				title	= this.getProperty('data-title');
				hide1	= this.getProperty('data-hide1');
				hide2	= this.getProperty('data-hide2');
				hide3	= this.getProperty('data-hide3');

				actions = $$(menuName+' a, '+menuName+' button').each(function(item, index){
					href = item.getProperty('data-href');
					if (aID2)
						href = href.replace('data-aid2', aID2);
					href = href.replace('data-aid', aID);
					/* ovo sa data hide bi se moglo ljepse napisati (array) */
					if (item.getProperty('data-hide1') && hide1)
						item.hide();
					else if(item.getProperty('data-hide1')){
						item.show();
					}
					if (item.getProperty('data-hide2') && hide2)
						item.hide();
					else if(item.getProperty('data-hide2'))
						item.show();
					if (item.getProperty('data-hide3') && hide3)
						item.hide();
					else if(item.getProperty('data-hide3'))
						item.show();

					if (msg) { item.setProperty('data-msg', msg); } else { item.setProperty('data-msg', ''); }
					if (msg1) { item.setProperty('data-msg1', msg1); } else { item.setProperty('data-msg1', ''); }
					if (msg2) { item.setProperty('data-msg2', msg2); } else { item.setProperty('data-msg2', ''); }

					if(title) {
						item.setProperty('data-title',title);
					}

					item.setProperty('href', href);
				});
			}
		});
	}
});

/**	
 * edFlashAlert
 * 
 * Flash message koji se u backendu radio s Flash::put
 * type: warning, error, success, info
 */

 var edFlashAlert = function(type, message){

 	var container = jquery('#flash-message-container')

 	if (!container.length){
 	 jquery(document.body).append('<div id="flash-message-container">' +		
		'<div class="flash-message resolution alert-'+ type +' t-center">' +
			'<i class="left icon-'+ type +'"></i>' +
			'<i class="right icon-cancel"></i>' +
			'<span>'+ message +'</span>' +
		'</div>'+
	'</div>');
 	}
 	if(!container.children('.flash-message').hasClass('resolution')){
 			container.append('<div class="flash-message resolution alert-'+ type +' t-center">' +
			'<i class="left icon-'+ type +'"></i>' +
			'<i class="right icon-cancel"></i>' +
			'<span>'+ message +'</span>' +
		'</div>');
 	} 
}

/**
 * edEditMenu class
 *
 * Context menu for various purposes
 */
function edEditMenu(element, menuElement) {
    this.el = jquery(element);
    this.menu = jquery(menuElement);
    this.actionID = false;

    var self = this;

    this.bindEvents = function(element) {
        jquery(element).on(default_event_type, function(ev) {
            ev.stopPropagation();

            var actionID = jquery(this).data('action-id');

            self.highlightSelection(this);
            self.populateActions(actionID);
            self.positionMenu(ev);
            self.showMenu();
        });

        jquery(document).on(default_event_type + " scroll", function(ev) {
            var menus = jquery('.editMenu');
            menus.css('display', 'none');

            jquery('.highlighted').removeClass('highlighted');
        });
    };

    this.bindMenuEvents = function() {
        var bound = jquery(this.menu).data('bound');

        if(!bound) {
            jquery(this.menu).on('click', function(ev) {
                ev.stopPropagation();
                self.hideMenu();
            });

            jquery(this.menu).data('bound', true);
        }
    };

    this.highlightSelection = function(el) {
    	jquery('.highlighted').removeClass('highlighted');
    	jquery(el).addClass('highlighted');
    };

    this.showMenu = function() {
        var otherMenus = jquery('.editMenu');
        otherMenus.css('display', 'none');

        this.menu.css('display', 'block');
    };

    this.hideMenu = function() {
        this.menu.css('display', 'none');
    };

    this.positionMenu = function(ev) {
        var height = this.menu.height();
        var width = this.menu.width();

        if((ev.clientX - width) < 20) {
            this.menu.css('left', '10px');
        }
        else {
            this.menu.css('left', ev.clientX - 105);
        }

        if((window.innerHeight - ev.clientY) < (height + 20)) {
        	this.menu.css('top', (window.innerHeight - height - 20) + 'px');
        }
        else {
        	this.menu.css('top', ev.clientY + 5);
        }
    }

    this.populateActions = function(actionID) {
        var options = jquery(this.menu).find('a');

        var elementData = this.el.data();

        var actionID2 = elementData.hasOwnProperty('actionId2') ? elementData.actionId2 : false;

        var hide1 = elementData.hasOwnProperty('hide1');
        var hide2 = elementData.hasOwnProperty('hide2');
        var hide3 = elementData.hasOwnProperty('hide3');

        var msg = elementData.hasOwnProperty('msg');
        var msg1 = elementData.hasOwnProperty('msg1');
        var msg2 = elementData.hasOwnProperty('msg2');

        jquery.each(options, function(i, val) {
            var item = jquery(val);

            href = item.data('href');
            if(actionID2) href = href.replace('data-aid2', actionID2);
            href = href.replace('data-aid', actionID);
            item.attr('href', href);

            item.parent().removeClass('hide');
           	if(item.data().hasOwnProperty('hide1') && hide1) item.parent().addClass('hide');
           	if(item.data().hasOwnProperty('hide2') && hide2) item.parent().addClass('hide');
           	if(item.data().hasOwnProperty('hide3') && hide3) item.parent().addClass('hide');

           	if(msg) item.attr('data-msg', elementData.msg);
           	if(msg1) item.attr('data-msg1', elementData.msg1);
           	if(msg2) item.attr('data-msg2', elementData.msg2);
        });        
    };

    this.init = function(element, menuElement) {
        this.menu = jquery(menuElement);

        this.bindMenuEvents();
        this.bindEvents(element);

        return this;
    };

    this.init(element, menuElement);
};

(function($) {
    $.fn.edEditMenu = function(menuElement) {
        return this.each(function() {
            new edEditMenu(this, menuElement);
        });
    }
}(jQuery));

/**
 * edSwitch
 *
 * Switch gumb
 */

function edSwitch(element, toggle_element){
	this.element = jquery(element);
	this.toggle_element = jquery(toggle_element);

	var self = this;

	jquery(self.element).on('click', function (){
		if(self.element.siblings('input').is(':disabled')) return;

		self.element.removeClass('no-transition');

		if (self.element.siblings('input').is(':checked'))
		{
			self.toggle_element.val('false');
 			this.removeClass('transition');
 			self.element.children('.toggle-content').html(_('Ne'));
		}
		else {
			self.toggle_element.val('true');
 			this.addClass('transition');
 			self.element.children('.toggle-content').html(_('Da'));
 		}
	});

	if (this.toggle_element.val() == 'true')
	{
		this.element.siblings('input').attr('checked','checked');
		this.element.addClass('no-transition');		
		this.element.children('.toggle-content').html(_('Da'));
 	}
}

(function($) {
    $.fn.edSwitch = function(toggle_element) {
    	return this.each(function() {
          return new edSwitch(this, toggle_element);
         });
    }
}(jQuery));

/**
 * edSearch
 *
 * Site search
 */
function edSearch(element) {
    this.overlay = jquery('#search-overlay');
    this.autocomplete = false;
    this.searchContainer = jquery('#search-container');
    this.cancelButton = jquery('#cancel-search');
    this.searchInput = jquery('#ed-search');
    this.csrf = jquery('')

    var self = this;

    this.bindEvents = function(element) {
    	this.overlay.on('click', function(ev) {
    		ev.stopPropagation();
    		ev.preventDefault();
    		self.showAutocomplete();
    	});

    	this.cancelButton.on('click', function(ev) {
    		ev.stopPropagation();
    		ev.preventDefault();
    		self.hideAutocomplete();
    	});

    	this.searchInput.on('focusout', function(ev) {
			if(self.searchContainer.hasClass('hide')) {
    			return;
    		}

    		self.hideAutocomplete();
    	});
		jquery("#ed-search").autocomplete({
			minLength: 3,
			source: function(request, response) {
				jquery.ajax( {
					url: "/search",
					dataType: "json",
					data: {
						term: request.term
					},
					success: function(data) {
						response(data);
					}
				});
			},
			select: function(event, ui) {
				self.searchInput.val(ui.item.label);
				window.location = ui.item.value;
				return false;
			},
			focus: function(event, ui) {
				self.searchInput.val(ui.item.label);
				return false;
			},
		});
	};

    this.showAutocomplete = function() {
    	this.overlay.addClass('hide');
    	this.searchContainer.removeClass('hide');
    	this.searchInput.focus();
    };

    this.hideAutocomplete = function() {
    	this.overlay.removeClass('hide');
    	this.searchContainer.addClass('hide');
    	this.searchInput.val('');
    };

    this.init = function(element) {
        this.bindEvents(element);
        return this;
    };

    this.init(element);
};

(function($) {
    $.fn.edSearch = function(searchElement) {
    	return new edSearch(searchElement);
    }
}(jQuery));

//////////////////////////////////////////// edDrag ////////////////////////////////////////////////////
//////////////////////////////// Extends/overrides MooTools Drag ////////////////////////////////////////
//////////////////////// Use CSS transforms for dragging instead of margins /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var edDrag = new Class({
	Extends: Drag,
	drag: function(event){
		var options = this.options;

		if (options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;

		for (var z in options.modifiers){
			if (options.modifiers.hasOwnProperty(z)) {
				if (!options.modifiers[z]) continue;
				this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];

				if(!this.X) this.X = -5000;
				if(!this.X) this.Y = -5000;

				if(!this.transformX) this.transformX = 0;
				if(!this.transformY) this.transformY = 0;

				var transform = '';

				if (options.invert) this.value.now[z] *= -1;

				if (options.limit && this.limit[z]){
					if ((this.limit[z][1] || this.limit[z][1] === 0) && (this.value.now[z] > this.limit[z][1])){
						this.value.now[z] = this.limit[z][1];
					} else if ((this.limit[z][0] || this.limit[z][0] === 0) && (this.value.now[z] < this.limit[z][0])){
						this.value.now[z] = this.limit[z][0];
					}
				}

				if (options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % options.grid[z]);

				if(this.cssTransform() && !Browser.ie) {
					switch(options.modifiers[z]) {
						case 'top': if(this.Y === -5000) this.Y = this.value.now[z];
									this.transformY += this.value.now[z] - this.Y;
									transform = 'translate(' + this.transformX + 'px,' +  this.transformY + 'px)';
									this.element.setStyles({
										'-webkit-transform' : transform,
										'-moz-transform' : transform,
										'-o-transform': transform,
										'-ms-transform' : transform,
										'transform' : transform
									});
									this.Y = this.value.now[z];
									break;
						case 'left': if(this.X === -5000) this.X = this.value.now[z];
									this.transformX += this.value.now[z] - this.X;
									transform = 'translate(' + this.transformX + 'px,' +  this.transformY + 'px)';
									this.element.setStyles({
										'-webkit-transform' : transform,
										'-moz-transform' : transform,
										'-o-transform' : transform,
										'-ms-transform' : transform,
										'transform' : transform
									});
									this.X = this.value.now[z];
									break;
						default: break;
					}
				} else {
					if (options.style) this.element.setStyle(options.modifiers[z], this.value.now[z] + options.unit);
					else this.element[options.modifiers[z]] = this.value.now[z];
				}
				//////////////////////////////////////////////////////////////////////////
			}
		}

		this.fireEvent('drag', [this.element, event]);
	},

	stop: function(event){
		var events = {
			mousemove: this.bound.drag,
			mouseup: this.bound.stop
		};
		events[this.selection] = this.bound.eventStop;
		this.document.removeEvents(events);
		this.Y = -5000;
		this.X = -5000;
		if (event) this.fireEvent('complete', [this.element, event]);
	},

	cssTransform: function() {
		var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
		for(var i = 0; i < prefixes.length; i++) {
			if(document.createElement('div').style[prefixes[i]] !== undefined) {
				return prefixes[i];
			}
		}
		return false;
	}
});


//////////////////////////////// edDrag extension /////////////////////////////////////
/*
* Enables dragging on touch devices
* by ccwasden @ stackoverflow.com
*/

if(!Browser.ie) {
	Class.refactor(edDrag, {
		attach: function(){
			this.handles.addEvent('touchstart', this.bound.start);
			return this.previous.apply(this, arguments);
		},

		detach: function(){
			this.handles.removeEvent('touchstart', this.bound.start);
			return this.previous.apply(this, arguments);
		},

		start: function(event){
			document.body.addEvents({
				touchmove: this.bound.check,
				touchend: this.bound.cancel
			});

			this.previous.apply(this, arguments);
		},

		check: function(event){
			if (this.options.preventDefault) event.preventDefault();
			var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
			if (distance > this.options.snap){
				this.cancel();
				this.document.addEvents({
					mousemove: this.bound.drag,
					mouseup: this.bound.stop
				});
				document.body.addEvents({
					touchmove: this.bound.drag,
					touchend: this.bound.stop
				});
				this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
			}
		},

		cancel: function(event){
			document.body.removeEvents({
				touchmove: this.bound.check,
				touchend: this.bound.cance
			});
			return this.previous.apply(this, arguments);
		},

		stop: function(event){
			document.body.removeEvents({
				touchmove: this.bound.drag,
				touchend: this.bound.stop
			});
			return this.previous.apply(this, arguments);
		}
	});
}

///////////////////////////////  edModal ////////////////////////////////////////////////
/*
* Used as a base for modal windows (popup-forms, confirms...)
* Example: new edModal({width: 400, closeButton: false}) - creates a new modal window 400
* pixels wide and without a "Close" button in the upper right corner
*/
var edModal = new Class({
	Static: {
		width: 650,
		height: 400,
		closeButton: false,
		modalOverlay: null,
		modalWindow: null,
		modalHeader: null,
		modalTitle: null,
		modalContent: null,
		modalClose: null,
		modalShown: false,
		savedState: null,

		createModal: function() {
			if(!edModal.modalCreated) {
				edModal.modalOverlay = new Element('div#modal');
				edModal.modalWindow = new Element('div#modal-window');
				edModal.modalHeader = new Element('div#modal-header');
				edModal.modalTitle = new Element('span#modal-title');
				edModal.modalClose = new Element('a#modal-close', {html:'<i class="icon-cancel"></i>', href: '#'});

				edModal.modalContent = new Element('div#modal-content');

				edModal.modalOverlay.adopt(
					edModal.modalWindow.adopt(
						edModal.modalHeader.adopt(
							edModal.modalTitle, edModal.modalClose),
						edModal.modalContent
					)
				);

				edModal.modalCreated = true;
			}

			edModal.modalWindow.addEvent('touchmove', function (e) {
				if(!e.target.hasClass('allowscroll')) {
					e.preventDefault();
				}
			});

			edModal.modalClose.addEvent('click', function(e) {
					edModal.closeModal(e);
			});

			edModal.modalWindow.setStyles({
				//'height': edModal.height,
				'width': edModal.width
			});

			edModal.modalOverlay.inject(document.body);

			new edDrag($('modal-window'), { handle: $('modal-header')});

			//drag u IE-u ima problema ako nije bindan na selectstart
			if(Browser.ie) {
				edModal.modalTitle.setStyle('cursor','move');
			} else {
				edModal.modalHeader.setStyle('cursor','move');
			}
		},

		setOptions: function(options) {
			Object.merge(edModal, options);
		},

		setTitle: function(title) {
			edModal.modalTitle.set('html',title);
		},

		setContentHTML: function(content) {
			edModal.modalContent.set('html',content);
		},

		adoptContent: function(content) {
			edModal.modalContent.adopt(content);
		},

		hideContent: function() {
			edModal.modalContent.getChildren().hide();

			edModal.savedState = {title: edModal.title, closeButton: edModal.closeButton, width: edModal.width, height: edModal.height };
		},

		showContent: function() {
			edModal.title = edModal.savedState.title;
			edModal.width = edModal.savedState.width;
			edModal.height = edModal.savedState.height;
			edModal.closeButton = edModal.savedState.closeButton;
			edModal.modalContent.getChildren().show();
			edModal.position();
			edModal.showModal();

			edModal.savedState = null;
		},

		empty: function() {
			edModal.modalContent.empty();
		},

		showOverlay: function() {
			edModal.modalOverlay.setStyle('visibility','visible');
		},

		hideOverlay: function() {
			edModal.modalOverlay.setStyle('visibility', 'none');
		},

		showModal: function() {
			edModal.modalWindow.setStyle('width',edModal.width);

			edModal.height =  edModal.modalContent.getSize().y + 45;
			edModal.modalTitle.set('html',edModal.title);

			if(edModal.closeButton)	{
				edModal.modalClose.show();
			} else {
					edModal.modalClose.hide();
			}

			edModal.position();

			//fix za required ikone u IE8
			if(Browser.ie && Browser.version === 8) {
				$$('.icon-asterisk.required').each(function(el) {
					new Element('a', {'class': 'icon-asterisk required'}).replaces(el);
				});
			}

			edModal.modalWindow.setStyle('visibility','visible');
			edModal.modalOverlay.setStyle('visibility','visible');
			
			if(!Browser.isMobile) {
				$$('.icon-asterisk.required').set('data-tooltip', _('Obavezno polje'));
				new edTips('.icon-asterisk.required, .tipper');

				edLayout.autofocus();
			}
		},

		position: function() {
			top_position = ((window.getSize().y - edModal.height)/2).toInt() - 50;
			if(top_position < 10 || Browser.Platform.android) {
				top_position = 10;
			}

			left_position = ((window.getSize().x - edModal.width)/2).toInt();

			width = edModal.width;
			height = edModal.height;

			edModal.modalWindow.setStyles({
				'width': width + 'px',
				/*'height': height + 'px',*/
				'left': left_position,
				'top': top_position
			});
		},

		refreshDimensions: function() {
			height =  edModal.modalContent.getSize().y + 45;
			edModal.modalWindow.setStyle('height',height+'px');
		},

		closeModal: function(e) {
			if(e) {
				new DOMEvent(e).stop();
			}

			//ako je otvoren datepicker, i njega ukloni
			if(edModal.modalShown) {
				$$('.datepicker_dashboard').destroy();
			}

			edModal.empty();

			edModal.modalWindow.setStyle('visibility','hidden');
			edModal.modalOverlay.setStyle('visibility','hidden');

			edModal.modalShown = false;
		}
	}
});

/////////////////////////////  edPopup  ///////////////////////////////////////////
/*
 * example - show popup on every clicked element with 'popup' css class:
 *   new edPopup ('.popup');
 *
 * Please define visibility:hidden in css for elements with this class - so user
 * cannot click them before domready/load!
 *
 * Use data-width and data-height on elements to define popup w/h
 *
 */

var edPopup = new Class({

	Implements: [Events, Options],
	options: {
		event_type: 'click',
		width: 650,
		height: 400
	},

	initialize: function(css) {

		// touchstart gives us faster response than click event
//		if (Modernizr.touch) this.options.event_type='touchstart';
		edModal.closeButton = true;
		edModal.createModal();

//		a=window.getSize();
//		$('popup-window').setStyle('margin-top',a.y+'px');

		$$(css).setStyle('visibility', 'visible');
		this.attach(css);
	},

	attach: function (css) {
		$$(css).each(function(el) {
			var self = this;
			el.addEvent(this.options.event_type, function(e){
				self.getContents(this, e);
			});
		}.bind(this));
	},

	getContents: function (el, e) {
		//new DOMEvent(e).stop();
		e.preventDefault();

		edModal.showOverlay();

		title = el.getProperty('data-title');
		edModal.title = title;
		edModal.closeButton = true;
		w = el.getProperty('data-width');

		if(w) {
			edModal.width = w;
		} else {
			edModal.width = 650;
		}

		if(title) {
			edModal.setTitle(title);
		}

		var self = this;

		new Request.HTML({
			method: 'get',
			//public options?
			update: edModal.modalContent,
			url: el.get('href') ? el.get('href') : el.get('data-href'),
			noCache: true,
			onSuccess: function (response) {
//				if (Browser.Platform.ios)
//					$('popup-window').addClass('sl');
//				else
//					$('popup-window').setStyle('margin-top',150);

				new edValidate('#modal-window form');

				edModal.showModal();
				edModal.modalShown = true;

				//automatically trim string on paste event
				//must be some delay to get pasted value instead original
				$$('#modal-window form input[type=text]').addEvent('paste', function(e){
					(function(){
						this.value=this.value.trim();
					}).bind(this).delay(1000);
				});

				$$('.popup-close').addEvent(default_event_type, function(ev) {
					edModal.closeModal();
				});
			},			
			onFailure: function () {
				edModal.setContentHTML('<p class="t-center bold mt30" style="height:100px;">' + _('Dogodila se greška!') + '</p>');
				edModal.showModal();
			}
		}).send();
	}
});

var edConfirm = new Class({

	Implements: [Events, Options],
	options: {
		event_type: 'click',
		message: '',
		target: undefined,
		onConfirm: null,
		onCancel: null,
		onInput: null,
		confirmMsg: null
	},

	initialize: function(css, message, options) {
		var self = this;

		self.options.message = message;

		if(typeOf(options) === 'object') {
			self.options = Object.merge(self.options, options);
		}

		$$(css).addEvent(self.options.event_type, function(ev) {
			new DOMEvent(ev).stop();

			self.options.target = this;

			self.showConfirm();

			$('confirm-cancel').addEvent(self.options.event_type, function(ev) {
				edModal.closeModal(ev);
				if(typeOf(self.options.onCancel) === 'function') {
					self.options.onCancel.call(self,ev, self.options.target);
				}
			});

			if(typeOf(self.options.onConfirm) === 'function') {
				$('confirm-ok').addEvent(self.options.event_type, function(ev) {
					edModal.closeModal(ev);
					self.options.onConfirm.call(self,ev,self.options.target);
				});
			} else {
				var href = this.get('href') ? this.get('href') : '#';
				$('confirm-ok').set('href', href);
			}

			var submit_buttons = $$(css).every(function(item, index){
				return item.get('tag') === 'input' && item.get('type') === 'submit';
			});

			if(submit_buttons) {
				$('confirm-ok').addEvent(default_event_type, function(ev) {
					ev.stop();
					var form = self.options.target.getParent();
					form.submit();
					edModal.closeModal(ev);
				});
			}
		});
	},

	showConfirm: function() {
		var self = this;

		var data_msg = self.options.target.get('data-msg') != null ? self.options.target.get('data-msg') : '';
		var data_msg1 = self.options.target.get('data-msg1') != null ? self.options.target.get('data-msg1') : '';
		var data_msg2 = self.options.target.get('data-msg2') != null ? self.options.target.get('data-msg2') : '';
		var msg = self.options.message;

		msg = msg.replace('confirm-msg2', data_msg2);
		msg = msg.replace('confirm-msg1', data_msg1);
		msg = msg.replace('confirm-msg', data_msg);
		
		var message = new Element('p#confirm-msg.m15.fs120.t-center', {html: msg});

		var buttons = new Element('div.t-center.mb15').adopt(
						new Element('a#confirm-ok.button2.mt10.mr30.confirm-button', {html: _('U redu'), 'href': '#'}),
						new Element('a#confirm-cancel.button2.mt10.confirm-button', {html: _('Odustani'), 'href': '#'})
		);

		edModal.empty();

		edModal.adoptContent(message);
		edModal.adoptContent(buttons);

		edModal.width = 400;
		edModal.title = '';
		edModal.closeButton = false;

		edModal.showModal();
	}
});

var edAlert = function(message, opts) {
	var alert_status = $('alert_status');

	if(!edModal.modalCreated) edModal.createModal();

	if(alert_status) alert_status.set('value', 'alert status present');

	if(edModal.modalShown) {
		if(alert_status) alert_status.set('value', 'attempting to hide modal content');
		edModal.hideContent();
		if(alert_status) alert_status.set('value', 'modal content hidden');
	}

	var options = {
		style: ''
	};

	if(opts) {
		Object.merge(options, opts);
	}

	if(alert_status) alert_status.set('value', 'options merged');

	if($('alert-container')) $('alert-container').destroy();

	if(alert_status) alert_status.set('value', 'alert container destroyed');

	var container = new Element('div#alert-container');

	var alert_message = new Element('p#alert-msg.m15.fs120.t-center', {html: message});

	var buttons = new Element('div.t-center.mb15').adopt(
					new Element('a#confirm-ok.button.mt10.confirm-button', {html: _('U redu'), 'href': '#', 'tabindex': '-1'})
				);

	if(alert_status) alert_status.set('value', 'elements createds');

	container.adopt(alert_message);
	container.adopt(buttons);
	edModal.adoptContent(container);

	if(alert_status) alert_status.set('value', 'elements adopted');

	edModal.width = 650;
	edModal.title = '<i class="icon-info-circled"></i>';
	edModal.closeButton = false;

	if(alert_status) alert_status.set('value', 'modal options set');
	
	alert_message.set('style', options.style);

	if(alert_status) alert_status.set('value', 'alert_message style set');

	edModal.showModal();

	if(alert_status) alert_status.set('value', 'modal shown');

	$('confirm-ok').focus();

	if(alert_status) alert_status.set('value', 'confirm_ok focused');

	if(alert_status) alert_status.set('value', 'attempting to bind handlers');

	$('confirm-ok').addEvent(default_event_type, function(ev) {
		if(edModal.modalShown) {
			if(alert_status) alert_status.set('value', 'modal shown, attempting to restore content');
			$('alert-container').destroy();
			edModal.showContent();
			if(alert_status) alert_status.set('value', 'modal content restored');
		} else {
			if(alert_status) alert_status.set('value', 'modal content not shown, nothing to restore');
			edModal.closeModal();
			if(alert_status) alert_status.set('value', 'modal closed');
		}
	});

	if(alert_status) alert_status.set('value', 'handlers bound');

	return true;
};

var edTimeout = new Class({

	Implements: [Events, Options],
	options: {
		event_type: 'click',
		timeout: null,
		message: '',
		onConfirm: null,
		onCancel: null,
		confirmMsg: null,
		buttons: null,
		confirmButton: null,
		timerLabel: null,
		cancelButton: null,
		interval: null,
		lastActivity: null,
		delay: 2405000
	},

	initialize: function(message, options) {
		var self = this;

		self.options.lastActivity = jquery('#last_activity').val();

		if(!self.options.lastActivity) return;

		self.options.message = message;

		if(typeOf(options) === 'object') {
			self.options = Object.merge(self.options, options);
		}

		self.options.confirmButton = new Element('a#timeout-ok.button2.mt10.mr30.confirm-button', {html: _('Nastavi rad'), 'href': '#'});
		self.options.timerLabel = new Element('p#timer-label.mt10.t-center', {html: _(''), 'href': '#'});
		self.options.cancelButton = new Element('a#timeout-cancel.button2.mt10.confirm-button', {html: _('Odustani'), 'href': '#'});

		self.options.cancelButton.addEvent(self.options.event_type, function(ev) {
			if(edModal.modalShown) {
				$('confirm-container').destroy();
				edModal.showContent();
			}
			else {
				edModal.closeModal(ev);
			}
		});

		self.options.confirmButton.addEvent(self.options.event_type, function(ev) {
			if(edModal.modalShown) {
				$('confirm-container').destroy();
				edModal.showContent();
			}
			else {
				edModal.closeModal(ev);
			}
			self.keepAlive();
		});

		self.options.buttons = new Element('div.t-center.mb15').adopt(
			self.options.confirmButton, self.options.cancelButton
		);

		self.options.timeout = setTimeout(
			function() {
				self.showTimeout();
			},
		self.options.delay);

		// visibility change handler - refresh timeouts
		var hidden, visibilityChange;
		if (typeof document.hidden !== "undefined") {
  			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		}

		if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  			console.log("visibility API not present");
		} else {
  			jquery(document).on(visibilityChange, self.handleVisibilityChange.bind(this));
		}
	},

	handleVisibilityChange: function() {
		var self = this;

		var sessionEnd = parseInt(this.options.lastActivity) * 1000 + parseInt(this.options.delay);
		var currentTime = Date.now();
		var newTimeout = sessionEnd - currentTime;

		clearTimeout(this.options.timeout);

		if(newTimeout < 0) {
			edModal.closeModal();
			this.redirect();
			return;
		}

		this.options.timeout = setTimeout(
			function() {
				self.showTimeout();
			}, newTimeout);
	},

	showTimeout: function() {
		var self = this;
		var msg = self.options.message;
		var container = new Element('div#confirm-container');
		var message = new Element('p#confirm-msg.m15.fs120.t-center', {html: 'Zbog sigurnosnih razloga, uskoro ćete biti automatski odjavljeni iz e-Dnevnik aplikacije<br><br> Za nastavak rada kliknite gumb "Nastavi rad"'});

		if(!edModal.modalCreated) edModal.createModal();
		
		if(edModal.modalShown) {
			edModal.hideContent();
		}

		container.adopt(message);
		container.adopt(self.options.timerLabel);
		container.adopt(self.options.buttons);

		edModal.adoptContent(container);

		edModal.width = 400;
		edModal.title = '';
		edModal.closeButton = false;

		edModal.showModal();

		self.startCountdown();
	},

	startCountdown: function() {

		var self = this;

		var countDownTime = (jquery('#last_activity').val() * 1000) + 2700000;

		self.options.interval = setInterval(function() {
			var now = new Date().getTime();

			var distance = countDownTime - now;
			  
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			self.options.timerLabel.set('html', "Vrijeme do automatske odjave: <b>" + minutes + " </b>minuta i <b>" + seconds + "</b> sekundi");

			if (distance < 1999) {
				self.clear();
				self.logout();
			}
		}, 1000);
	},

	clear: function() {
		var self = this;
		if(self.options.interval !== null) {
			clearInterval(self.options.interval);
		}
	},

	keepAlive: function() {
		var self = this;

		var request = new Request({
			method: 'GET',
			url: '/settings/keep_alive',
			onComplete: function (responseText) {
				try {
					var status = JSON.parse(responseText);
					if(status !== true) {
						self.redirect();
					}
					else {
						self.clear();
					}
				}
				catch(error) {
					self.redirect();
				}
			}
		});

		request.send();
	},

	redirect: function() {
		window.location.href = '/';
	},

	logout: function() {
		window.location.href = '/main/logout';
	}
});

////////////// temp error logging //////////////////////////////////

var errorLogger = function(message, file, line) {
	var validate_status = $$('#validate_status');

	error_msg = '';
	error_msg += 'Message: ' + message + '; ';
	error_msg += 'File: ' + file + '; ';
	error_msg += 'Line: ' + line + '; ';

	if (validate_status) validate_status.set('value', error_msg);
}

////////////////////////////////////////////////////////////////////

/**
 * edValidate Class
 * validate required / optional form fields
 * example:
 *       new edValidate('#popup-window form'); //validate form in popup window
 *       new edValidate('form');
 *
 * TODO:
 *       -check for decimal values (decimal data-type)
 */
var edValidate = new Class({

	initialize: function(selector) {
		$$(selector).addEvent('submit', function(ev) {
			var validate_status = $$('#validate_status');
			var error_msgs = [];
			var rules = {
					int: {
						pattern: /^\d+$/,
						message: _('Polje') + ' data-msg ' + _('mora biti numerička vrijednost')
					},
					percent: {
						pattern: /^(\d{1,2}|100)(\.[0-9]{1,2})?$/,
						message: _('Polje') + ' data-msg ' + _('mora biti na dvije decimale (odvojeno točkom),\nne smije prelaziti 100.00 niti biti negativan broj')
					},
					decimal: {
						validator: function(item) {
							var separator = item.get('data-separator') ? item.get('data-separator') : '.,';
							return item.value.match(new RegExp('^\\d+([' + separator + '][\\d]{1,3})?$')) != null;
						},
						message: _('Polje') + ' data-msg ' + _('mora biti decimalni broj (odvojen zarezom, jedna do tri decimale)')
					},
					email: {
						pattern: /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i,
						message: _('E-mail adresa je neispravnog formata')
					},
					dbdate: {
						validator: function(item) {
							if(!item.value.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/)) return false;

							var parts = item.value.split('-').map(function(item, index) {return parseInt(item, 10); });
							var date = new Date(parts[0], (parts[1] - 1), parts[2]);

							if(date.getFullYear() != parts[0] || date.getMonth() != parts[1] - 1 || 
								date.getDate() != parts[2]) {
									return false;
							}
							return true;
						},
						message: _('Molimo unesite valjan datum u formatu gggg-mm-dd')
					},
					oib: {
						pattern: /^([0-9]{11})$/,
						message: _('OIB je neispravnog formata')
					},
					hredupersonuniqueid: {
						pattern: /^[a-zA-Z0-9\.-]+@skole.hr$/,
						message: _('Korisnička oznaka je neispravnog formata.\nPrimjer ispravne korisničke oznake: ime.prezime@skole.hr')
					}
				};

			if (validate_status) validate_status.set('value', 'before select');
			var formElements = ev.target.getElements('[data-required]');

			if (validate_status) validate_status.set('value', 'before try');
			try {
				if($$('.validation-error')) $$('.validation-error').removeClass('validation-error');

				formElements.each(function(e) {
					var type = e.getProperty('data-type');
					var allowempty = e.getProperty('data-allow-empty');
					var data_msg = e.getProperty('data-msg');
					var error = false;

					if (validate_status) validate_status.set('value', 'before allowempty');
					if (allowempty === 'true' && e.value === '') return;

					if (validate_status) validate_status.set('value', 'before processing rules');
					if(type && rules.hasOwnProperty(type)) {
						if(rules[type].hasOwnProperty('validator')) {
							if(rules[type].validator.call(this, e) === false) {
								error = true;
								error_msgs.push(rules[type].message.replace('data-msg', data_msg));
							}
						}

						if(rules[type].hasOwnProperty('pattern')) {
							if(!e.value.match(rules[type].pattern)) {
								error = true;
								error_msgs.push(rules[type].message.replace('data-msg', data_msg));
							}
						}
					}

					if (validate_status) validate_status.set('value', 'before push');
					if((e.value === '' || e.value === '[]') && !error) {
						error_msgs.push(_('Molimo unesite') + ' ' + data_msg);
						error = true;
					}

					if(error) {
						e.addClass('validation-error');
					}
				});

				if (validate_status) validate_status.set('value', 'before throw error');
				if(error_msgs.length > 0) {
					throw error_msgs.join('<br><br>');
				}
				if (validate_status) validate_status.set('value', 'try done');
			}
			catch (ex) {
				if (validate_status) validate_status.set('value', 'start catch / before edAlert');
					try {
						edAlert(ex);
					} catch(exc) {
						if (validate_status) validate_status.set('value', 'caught exc: ' + exc.message);
						return false;
					}
				if (validate_status) validate_status.set('value', 'before return');
				return false;
			}

			var validated = this.getElement('#validated');
			if(validated) validated.set('value', 'true');

			if(this.getElement('input[type=submit]')) {
				this.getElement('input[type=submit]').addClass('hide');
			}
		});
	}
});

var edFlashMessage = function() {
	setTimeout(function(){
    	 jquery('#flash-message-container .flash-message').addClass('fade-out');
	},5000);

	if(!jquery('#site-menu').length){
		jquery('#flash-message-container').css('top', '60px')
	}

	jquery(document.documentElement).on(default_event_type, function(e){
		jquery('#flash-message-container .flash-message').each(function(index){
			jquery(this).addClass('fade-out');
			var flashMessageContainer = jquery(this).parent();
			setTimeout(function(){
				flashMessageContainer.remove();
			}, 170);
		});	
	});
};

var edMultiSelect = new Class({
	Implements: [Events, Options],
	options: {
		event_type: default_event_type,
		input: null,
		elements: null,
		attributes: null,
		keys: null,
		fields: null,
		count: 0,
		limit: 0
	},


	initialize: function(options) {
		var self = this;

		if(typeOf(options) === 'object') {
			self.options = Object.merge(self.options, options);
		}
		this.options.fields	= [];

		edLayout.addTouchFeedback(this.options.elements);

		this.options.elements.addEvent(this.options.event_type, function(e) {
			if((this.getSiblings('.active').length + 1) > (self.options.limit) && self.options.limit > 0) {
				edAlert(_('Moguće je odabrati maksimalno ' + self.options.limit + ' elemenata!'));
				return;
			}

			if(!edLayout.preventEvent) {
				this.toggleClass('active');
				this.toggleClass('inactive');

				var el = this;

				var depended_on = this.get('data-depended-on');
				if(depended_on) {
					depended_on = depended_on.split(" ");
					depended_on.each(function(item) {
						if($(item)) {
							if(!el.hasClass('active')) {
								$(item).removeClass('active');
								$(item).addClass('inactive');
							}
						}
					});
				}

				var depends_on = this.get('data-depends-on');
				if(depends_on) {
					depends_on = depends_on.split(" ");
					depends_on.each(function(item) {
						if($(item)) {
							if(!$(item).hasClass('active')) {
								$(item).addClass('active');
								$(item).removeClass('inactive');
							}
						}
					});
				}

				icon = this.getFirst('.right');
				icon.toggleClass('icon-cancel');
				icon.toggleClass('icon-ok green');

				self.submit_fields();
			}
		});
	},

	submit_fields: function() {
		var self = this;
		self.options.fields = [];

		var selected = this.options.elements.filter('.active');
		selected.each(function(item,index) {
			self.options.fields[index] = {};
			self.options.keys.each(function(key) {
				self.options.fields[index][key] = item.get(key);
			});
		});

		this.options.input.set('value', JSON.stringify(self.options.fields));
		this.options.count = selected.length;
	},

	select_all: function() {
		var self = this;
		
		if(self.options.elements.length > self.options.limit && self.options.limit > 0) {
				edAlert(_('Odabir svih elemenata nije moguć') + '<br>(' + _('dopušteno je maksimalno') + ' ' + self.options.limit + ' ' + _('elemenata') + ')!');
				return;
		}

		this.options.elements.each(function(item,index){
			item.removeClass('inactive');
			item.addClass('active');

			icon = item.getFirst('.right');
			icon.set('class','icon-ok green right');
		});
		this.submit_fields();
	}
});

var edWait = new Class({
	Implements: [Events, Options],
	options: { },
	initialize: function() {
		if(!edModal.modalCreated) edModal.createModal();

		if(edModal.modalShown) edModal.hideContent();

		var container = new Element('div#wait-container');
		var wait_message = new Element('p#await-msg.m15.fs120.t-center', {html: _('Molimo pričekajte') 
		+ '<br><div class="lds-css ng-scope"><div class="lds-spinner" style="width:100%;height:100%"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>' });

		container.adopt(wait_message);
		edModal.adoptContent(container);
	},
	show: function() {
		edModal.closeButton = false;
		edModal.width = 400;
		edModal.title = '<i class="icon-info-circled"></i>';

		edModal.showOverlay();
		edModal.showModal();		
	},
	hide: function() {
		if(edModal.modalShown) {
			container.destroy();
			edModal.showContent();
		} else {
			edModal.closeModal();
		}
		edModal.hideOverlay();
	}
});

// table header rotations
Elements.implement({
	rotateHeaders: function(options) {
		var tableHeaders = this;
		var rotateClass = 'rotate-90';

		tableHeaders.each(function(th){
			// wrapInner implementation
			var inner = new Element('div', {'class': rotateClass, 'html': th.get('html')});
			th.empty();
			inner.inject(th);

			var rotate = th.getChildren('.'+rotateClass)[0];

			var thWidth = parseFloat(th.getStyle('width'));

			if (thWidth > 10) {
				rotate.setStyle('line-height', thWidth);
			} else {
				var rotateWidth = parseFloat(rotate.getStyle('width'));
				rotate.setStyle('line-height', rotateWidth);
			}

			// reset padding
			th.setStyle('padding', 0);

			/*global Modernizr:true*/
			if(Modernizr.csstransforms) {
			// IE9+, Chrome, Firefox, Opera
				th.setStyles({
					'width': rotate.getDimensions().height,
					'height': rotate.getDimensions().width,
					'vertical-align': 'bottom'
				});
			} else {
			// IE8, flipped width&height
				th.setStyles({
					'width': rotate.getDimensions().width,
					'height': rotate.getDimensions().height,
					'vertical-align': 'top'
				});
			}
		});

		/*IE8 filter rotate origin fix*/
		if(!Modernizr.csstransforms) {
			tableHeaders.each(function(th){
				// console.log(th.get('html'));
				var rotate = th.getChildren('.'+rotateClass)[0];
				var marginTop = parseFloat(th.getDimensions().height-th.getComputedSize().computedTop-th.getComputedSize().computedBottom)-parseFloat(rotate.getDimensions().height-rotate.getComputedSize().computedTop-rotate.getComputedSize().computedBottom);

				rotate.setStyle('margin-top', marginTop);
			});
		}
	}
});

window.addEvent('load', function(){
	new edValidate('form');

	// beta test 4 functionality
	new edPopup('.popup');
});

window.addEvent('unload', function(){
	$$('.popup').setStyle('display','none');
});

///////// Temp error logging ////////////////
if(typeof window.onerror !== 'undefined') {
	window.onerror = errorLogger;
}
/////////////////////////////////////////////

//HtmlTable.Sort parsers
HtmlTable.Parsers.date_hr = {
	match: /^\d{2}[\.\/ ]\d{2}[.\/ ]\d{2,4}\.$/,
	convert: function(){
		Date.defineParser('%d.%m.%Y.');
		var d = Date.parse(this.get('text').stripTags());
		return (typeOf(d) === 'date') ? d.format('db') : '';
	},
	type: 'date'
};

HtmlTable.Parsers.datetime_hr = {
	match: /^\d{2}[\.\/ ]\d{2}[.\/ ]\d{2,4}\. (([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))$/,
	convert: function(){
		Date.defineParser('%d.%m.%Y. %H:%M:%S');
		var d = Date.parse(this.get('text').stripTags());
		return (typeOf(d) === 'date') ? d.format('db') : '';
	},
	type: 'date'
};

HtmlTable.ParserPriority = ['date_hr', 'datetime_hr', 'date', 'input-checked', 'input-value', 'float', 'number'];

var sorted = function(ev, sortIndex) {
	var previous = $$('.current-sort');

	var icons = [];
	var icons_right = [];

	if(previous){
		previous.removeClass('current-sort');

		icons = previous.getElements('i');

		icons.each(function(item, index){
			icons_right[index] = item.hasClass('right')[0];
			item.set('class', 'icon-arrow-combo');
			if (icons_right[index] === true) item.addClass('right');
		});
	}

	var sortedColumn = $$('.sort-asc, .sort-desc');
	sortedColumn.addClass('current-sort');

	icons = sortedColumn.getElements('i');
	icons_right = [];

	icons.each(function(item, index){
		icons_right[index] = item.hasClass('right')[0];
	});

	sortedColumn.each(function(row, rowIndex){
		icons.each(function(item, index){
			if(!row.hasClass('sort-desc')) {
				item.set('class','icon-up-dir');
			} else {
				item.set('class','icon-down-dir');
			}

			if (icons_right[index] === true) item.addClass('right');
		});
	});
};


Locale.define('hr-HR', 'Date', {
	shortDate: '%d. %m. %Y.',
	days: [ 'nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota' ],
	days_abbr: ['N', 'P', 'U', 'S', 'Č', 'P', 'S'],
	months: [ 'siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac' ],
	months_abbr: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro']
});

Locale.use('hr-HR');

Date.defineFormats({
	date: '%Y-%m-%d',
	datetime: '%Y-%m-%d %H:%M:%S',
	hr_date: '%d. %m. %Y.',
	hr_datetime: '%d. %m. %Y. %H:%M'
});
Date.defineParser( '%d. %m. %Y.( %X)?' ); /* hr date parser */

Class.refactor(HtmlTable, {
	sort: function(index, reverse, pre){
		if (!this.head) return;

		if (!pre){
			this.clearSort();
			this.setSortedState(index, reverse);
			this.setHeadSort(true);
		}

		var parser = this.getParser();
		if (!parser) return;

		var rel;
		if (!Browser.ie){
			rel = this.body.getParent();
			this.body.dispose();
		}

		var data = this.parseData(parser).sort(function(a, b){
			if(typeof a.value === 'string' && typeof b.value === 'string') {
				return a.value.localeCompare(b.value);
			}

			if (a.value === b.value) return 0;
			return a.value > b.value ? 1 : -1;
		});

		if (this.sorted.reverse == (parser == HtmlTable.Parsers['input-checked'])) data.reverse(true);
		this.setRowSort(data, pre);

		if (rel) rel.grab(this.body);
		this.fireEvent('stateChanged');
		return this.fireEvent('sort', [this.body, this.sorted.index]);
	}
});





