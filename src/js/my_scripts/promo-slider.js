var promoSlider = (function() {
	var flag = true,
		timer;
	return {
		init: function() {
			var _this = this;
			_this.clickBtnLeft();
			_this.clickBtnRight();
			_this.autoplay();

		},

		clickBtnRight: function(){
			_this = this;

			$('.slider-promo__arrow--right').click(function(e){
				e.preventDefault();

				promoSlider.clearTimer();

				var btn = $(this),
					slide = $(this).closest('.slider-promo').find('.slider-promo__item'),
					slideActive = slide.filter('.active'),
					nextActive = slideActive.next(),
					firstSlide = slide.first();

				if(btn.hasClass('slider-promo__arrow--right')) {
					if(slideActive.next().length) {
						_this.moveSlide(nextActive, 'forwards');
					}
					else {
						_this.moveSlide(firstSlide, 'forwards');
					}
				}
			});
		},

		clickBtnLeft: function(){
			_this = this;

			$('.slider-promo__arrow--left').click(function(e){
				e.preventDefault();

				_this.clearTimer();

				var btn = $(this),
					slide = $(this).closest('.slider-promo').find('.slider-promo__item'),
					slideActive = slide.filter('.active'),
					nextActive = slideActive.next(),
					firstSlide = slide.first();

				if(btn.hasClass('slider-promo__arrow--left')) {
					_this.moveSlide(slideActive, 'backward');
				}
			});
		},

		moveSlide: function(slide, direction){
			var container = slide.closest('.slider-promo'),
				slides = container.find('.slider-promo__item'),
				slideActive = slides.filter('.active'),
				slidePrev = slideActive.prev(),
				lastSlide = slides.last(),
				slideHeigt = slide.height(),
				duration = 500,
				prevPositionActiveSlide = 0,
				postPositionActiveSlide = 0;

			if(flag) {

				flag = false;

				if (direction == 'forwards') {
					prevPositionActiveSlide = -slideHeigt;
					postPositionActiveSlide = 0;
					slideActive.addClass('forwards-active-style');
					slide.addClass('pre-active-visibility');
				}
				else if (direction == 'backward') {
					prevPositionActiveSlide = 0;
					postPositionActiveSlide = -slideHeigt;
					slidePrev.addClass('post-active-visibility');
				}

				slide.css({'top': prevPositionActiveSlide})
					.animate({top: postPositionActiveSlide}, duration, function () {
					if (direction == 'forwards') {
						slideActive.removeClass('active forwards-active-style');
						slide.removeClass('pre-active-visibility').addClass('active');
					}
					else {
						slide.removeClass('active').css({'top': prevPositionActiveSlide});
						if (slideActive.prev().length) {
							slidePrev.removeClass('post-active-visibility').addClass('active');
						}
						else {
							lastSlide.removeClass('post-active-visibility').addClass('active');
						}
					}
				});
				flag = true;
			}
		},

		autoplay: function() {
			_this = this;
			timer = setTimeout(function play() {
				$('.slider-promo__arrow--right').trigger('click');
				timerId = setTimeout(play, 3000);
			}, 3000);
		},

		clearTimer: function(){
			_this = this;
			if(timer){
				clearTimeout(timer);
				_this.autoplay();
			}
		}
	}
}());

