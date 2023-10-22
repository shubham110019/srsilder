(function ($) {
    $.fn.srsilder = function (options) {
        let settings = $.extend(
            {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 3000,
                responsive: true,
                swipe: true,
            },
            options
        );

        let slider = this;
        let items = slider.find('.item');
        let slideCount = items.length;
        let currentSlide = 1; // Start at the duplicated first slide
        let slideWidth = 100 / settings.slidesToShow; // Calculate the slide width dynamically

        if (settings.infinite) {
            // Clone first and last elements
            slider.append(items.clone());
            slider.prepend(items.last().clone());
            items = slider.find('.item');
            slideCount = items.length;
        }

        items.css('width', slideWidth + '%'); // Set the item width inline

        function showSlides() {
            items.removeClass('active').hide();
            for (let i = currentSlide; i < currentSlide + settings.slidesToShow; i++) {
                let index = i;
                if (settings.infinite) {
                    index = i % slideCount;
                    if (index < 0) {
                        index = slideCount + index;
                    }
                }
                items.eq(index).show().addClass('active');
            }
        }

        function nextImage() {
            currentSlide = (currentSlide + settings.slidesToScroll) % slideCount;
            showSlides();
            let translateValue = -currentSlide * slideWidth;
            slider.css('transition', 'transform 0.5s ease-in-out');
            slider.css('transform', 'translate3d(' + translateValue + '%, 0, 0)');
        }

        function prevImage() {
            currentSlide = (currentSlide - settings.slidesToScroll + slideCount) % slideCount;
            showSlides();
            let translateValue = -currentSlide * slideWidth;
            slider.css('transition', 'transform 0.5s ease-in-out');
            slider.css('transform', 'translate3d(' + translateValue + '%, 0, 0)');
        }

        showSlides();

        slider.after('<div class="prev">&#10094;</div><div class="next">&#10095;</div>');

        $('.prev').on('click', prevImage);
        $('.next').on('click', nextImage);

        if (settings.autoplay) {
            let interval;

            function startAutoplay() {
                interval = setInterval(function () {
                    nextImage();
                }, settings.autoplaySpeed);
            }

            function stopAutoplay() {
                clearInterval(interval);
            }

            slider.hover(
                function () {
                    stopAutoplay();
                },
                function () {
                    startAutoplay();
                }
            );

            startAutoplay();
        }

        if (settings.swipe) {
            let startX, endX;
            slider.on('touchstart', function (e) {
                startX = e.touches[0].clientX;
            });

            slider.on('touchend', function (e) {
                endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) {
                    nextImage();
                } else if (endX - startX > 50) {
                    prevImage();
                }
            });
        }

        if (settings.responsive) {
            $(window).on('resize', function () {
                // Adjust the slide width on window resize
                slideWidth = 100 / settings.slidesToShow;
                items.css('width', slideWidth + '%');
                slider.css('transform', 'translateX(' + -currentSlide * slideWidth + '%)');
            });
        }
    };
})(jQuery);
