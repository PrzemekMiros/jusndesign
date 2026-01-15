function appMain() {
  
	// Pobieramy aktualny adres URL
	var currentUrl = window.location.pathname;
	var menuLinks = document.querySelectorAll('.menu a');
	menuLinks.forEach(function(link) {
		link.classList.remove('link-active');
	});
	menuLinks.forEach(function(link) {
		if (link.getAttribute('href') === currentUrl) {
			link.classList.add('link-active');
		}
	});

	// Greeting
	if (document.querySelector("#greeting")) {
		const greeting = document.getElementById("greeting");
		const hour = new Date().getHours();
    const welcomeTypes = ["Dzien dobry", "Dobry wieczor"];
		let welcomeText = "";
		if (hour < 20) welcomeText = welcomeTypes[0];
		else welcomeText = welcomeTypes[1];
		greeting.innerHTML = welcomeText;
	}
  // Header scrolled
	(function() {
		var doc = document.documentElement;
		var w = window;
		var curScroll;
		var prevScroll = w.scrollY || doc.scrollTop;
		var curDirection = 0;
		var prevDirection = 0;
		var body = document.querySelector('body');
		var header = document.querySelector('.site-header');
		var toggled;
		var threshold = 20;

		var checkScroll = function() {
			curScroll = w.scrollY || doc.scrollTop;
			if (curScroll > prevScroll) {
				// scrolled down
				curDirection = 2;
			} else {
				// scrolled up
				curDirection = 1;
			}

			if (curDirection !== prevDirection) {
				toggled = toggleHeader();
			}

			// Add or remove 'scrolled' class based on scroll position
			if (curScroll > 150) {
				header.classList.add('scrolled');
			} else {
				header.classList.remove('scrolled');
			}

			prevScroll = curScroll;
			if (toggled) {
				prevDirection = curDirection;
			}
		};

		var toggleHeader = function() {
			toggled = true;
			if (curDirection === 2 && curScroll > threshold) {
				header.classList.add('hide');
				body.classList.add('sticky-up');
        body.classList.remove('sticky-down');
			} else if (curDirection === 1) {
				header.classList.remove('hide');
				body.classList.remove('sticky-up');
        body.classList.add('sticky-down');
			} else {
				toggled = false;
			}
			return toggled;
		};

		window.addEventListener('scroll', checkScroll);

	})();


	// Swiper

	if (document.querySelector('.swiper-works')) {
	var swiper = new Swiper(".swiper-works", {
		grabCursor: true,
		slidesPerView: 3,
		spaceBetween: 15,
		centeredSlides: false,
		loop: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		scrollbar: {
			el: '.swiper-scrollbar',
		},
		navigation: {
			nextEl: '.swiper-gal',
			prevEl: '.swiper-gal',
		},
		autoplay: {
			delay: 4000,
		},
		keyboard: {
			enabled: true
		},
		mousewheel: false,


		breakpoints: {
			0: {        
				slidesPerView: 1,
				centeredSlides: true
			},
			768: {        
				slidesPerView: 3,
				centeredSlides: false
			}
		}
	});
};


	if (document.querySelector('.swiper-reviews')) {
	var swiper = new Swiper(".swiper-reviews", {
		grabCursor: true,
		slidesPerView: 1,
		spaceBetween: 15,
		centeredSlides: false,
		loop: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		navigation: {
			nextEl: '.swiper-rev',
			prevEl: '.swiper-rev',
		},
		autoplay: {
			delay: 4000,
		},
		keyboard: {
			enabled: true
		},
		mousewheel: false,


	});
};


	// Acordion
	if (document.querySelector(".accordion")) {
		let t = document.getElementsByClassName("accordion");
		for (let e = 0; e < t.length; e++)
			t[e].addEventListener("click", function() {
				let e = this.nextElementSibling;
				if (e.style.maxHeight)
					(e.style.maxHeight = null), this.classList.remove("open");
				else {
					for (let a = 0; a < t.length; a++)
						t[a].classList.remove("open"),
						(t[a].nextElementSibling.style.maxHeight = null);
					(e.style.maxHeight = e.scrollHeight + "px"),
					this.classList.toggle("open");
				}
			});
	};

	if (document.querySelector('.form-outer')) {
		initMultiStepForm();

		function initMultiStepForm() {
			const progressNumber = document.querySelectorAll(".step").length;
			const slidePage = document.querySelector(".slide-page");
			const progressCheck = document.querySelectorAll(".step .check");
			const bullet = document.querySelectorAll(".step .bullet");
			const pages = document.querySelectorAll(".page");
			const nextButtons = document.querySelectorAll(".next");
			const prevButtons = document.querySelectorAll(".prev");
			const stepsNumber = pages.length;

			if (progressNumber !== stepsNumber) {
				console.warn(
					"Error, number of steps in progress bar do not match number of pages"
				);
			}

			document.documentElement.style.setProperty("--stepNumber", stepsNumber);

			let current = 1;

			for (let i = 0; i < nextButtons.length; i++) {
				nextButtons[i].addEventListener("click", function(event) {
					event.preventDefault();

					inputsValid = validateInputs(this);
					// inputsValid = true;

					if (inputsValid) {
						slidePage.style.marginLeft = `-${
                      (100 / stepsNumber) * current
                  }%`;
						bullet[current - 1].classList.add("active");
						progressCheck[current - 1].classList.add("active");
						current += 1;
					}
				});
			}

			for (let i = 0; i < prevButtons.length; i++) {
				prevButtons[i].addEventListener("click", function(event) {
					event.preventDefault();
					slidePage.style.marginLeft = `-${
                  (100 / stepsNumber) * (current - 2)
              }%`;
					bullet[current - 2].classList.remove("active");
					progressCheck[current - 2].classList.remove("active");
					current -= 1;
				});
			}

			function validateInputs(ths) {
				let inputsValid = true;

				const inputs =
					ths.parentElement.parentElement.querySelectorAll("input");
				for (let i = 0; i < inputs.length; i++) {
					const valid = inputs[i].checkValidity();
					if (!valid) {
						inputsValid = false;
						inputs[i].classList.add("invalid-input");
					} else {
						inputs[i].classList.remove("invalid-input");
					}
				}
				return inputsValid;
			}
		}

	}

	function getFormRedirectUrl(plUrl, enUrl) {
\tvar path = window.location.pathname || "";
\tvar docLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
\tif (path.indexOf("/en") === 0 || docLang === "en") {
\t\treturn enUrl;
\t}
\treturn plUrl;
}

function handleSubmit(formId, redirectUrl) {
		var form = document.getElementById(formId);

		if (form) {
			form.addEventListener('submit', function(e) {
				e.preventDefault();

				var formData = new FormData(form);
				var xhr = new XMLHttpRequest();

				var endpoint = form.getAttribute('action');
				xhr.open('POST', endpoint ? endpoint : ('https://www.futurewebstudio.pl/form/forms/' + formId + '.php'));

				xhr.onreadystatechange = function() {
					if (xhr.readyState === XMLHttpRequest.DONE) {
						if (xhr.status === 200) {
							var res = JSON.parse(xhr.responseText);
							if (res.status === 1) {
								form.reset();
								window.location.href = redirectUrl; // Przekieruj po pomyĹ›lnym wysĹ‚aniu formularza
							}
						}
					}
				};

				xhr.send(formData);
			});
		}
	}
	handleSubmit('briefForm', getFormRedirectUrl('/pl/wyslano-formularz/', '/en/sendform/'));
	handleSubmit('contactForm', getFormRedirectUrl('/pl/wyslano-formularz/', '/en/sendform/'));

// End
};


