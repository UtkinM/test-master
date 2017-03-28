var searchOpen = (function() {
	return {
		init: function () {
			_this = this;
			_this.openControl();
			// _this.resize();
		},

		openControl: function () {
			if ($(window).width() <= 800) {
				$('.search__btn').click(function (e) {
					e.preventDefault();
					var btnControl = $(this),
						searchField = $(this).siblings('.search__field'),
						form = btnControl.closest('form');
					if (!searchField.hasClass('open')) {
						searchField.addClass('open')
					} else {
						form.trigger(submit);
					}
				})
			}
			else {
				$('.search__field').removeClass('open');
			}
		},
		resize: function () {
			$(window).resize(function () {
				var timerResize;
				clearTimeout(timerResize);
				timerResize = setTimeout(function () {
					_this.openControl();
				}, 1000);
			});
		}
	}
}());
