(function () {
	if($('.slider-promo').length){
		promoSlider.init();
	}

	if($('.header__menu-tabs').length){
		controlMenuTabs.init();
	}

	if($('.search').length){
		searchOpen.init();
	}
})();