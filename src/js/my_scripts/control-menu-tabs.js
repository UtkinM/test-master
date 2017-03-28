
var controlMenuTabs = (function() {
	return {
		init: function(){
			var _this = this;
			_this.menuTabsSwitch();
			_this.switchMobileMenu();
			_this.resize();
		},

		menuTabsSwitch: function(){
			$('.header__menu-tabs-link').click(function(e){
				e.preventDefault();
				var tab = $(this).closest('.header__menu-tabs-item');
				var tabLink = $(this);
				var activePanel = $(tabLink.attr('href'));
				tab.siblings().removeClass('active').end().addClass('active');
				activePanel.siblings().removeClass('active').end().addClass('active');
			});
		},

		switchMobileMenu: function(){
			var menu = $('.header__menu-tabs'),
				toogle = menu.find('.header__menu-tabs-switch'),
				pageOverlay = $('.page-overlay');

			toogle.click(function(e){
				e.preventDefault();

				$(this).toggleClass('open');
				menu.toggleClass('open');
				$('body').toggleClass('hidden-for-mobile-menu');
				pageOverlay.toggleClass('open');
			});

			if($(window).width() > 800) {
				$(toogle, menu).removeClass('open');
				$('body').removeClass('hidden-for-mobile-menu');
				pageOverlay.removeClass('open');
			}

			$(window).click(function(e){
				if($(e.target).is('.page-overlay')) {
					toogle.removeClass('open');
					$('body').removeClass('hidden-for-mobile-menu');
					pageOverlay.removeClass('open');
				}
			});
		},

		resize: function(){
			$(window).resize(function(){
				var timeout_line_loader;
				clearTimeout(timeout_line_loader);
				timeout_line_loader = setTimeout(function() {
					switchMobileMenu();
				}, 1000);
			});
		}
	}
}());
