/* ===================================================================
 * GHAFES UMaT-CF 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function ($) {
  "use strict";

  const cfg = {
    scrollDuration: 800, // smoothscroll duration
    mailChimpURL: "", // mailchimp url
  };
  const $WIN = $(window);

  // Add the User Agent to the <html>
  // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
  const doc = document.documentElement;
  doc.setAttribute("data-useragent", navigator.userAgent);

  /* Preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    $("html").addClass("ss-preload");

    $WIN.on("load", function () {
      // force page scroll position to top at page refresh
      // $('html, body').animate({ scrollTop: 0 }, 'normal');

      // will first fade out the loading animation
      $("#loader").fadeOut("slow", function () {
        // will fade out the whole DIV that covers the website.
        $("#preloader").delay(300).fadeOut("slow");
      });

      // for hero content animations
      $("html").removeClass("ss-preload");
      $("html").addClass("ss-loaded");
    });
  };

  /* Mobile Menu
   * ---------------------------------------------------- */
  const ssMobileMenu = function () {
    const toggleButton = $(".header-menu-toggle");
    const nav = $(".header-nav-wrap");

    toggleButton.on("click", function (event) {
      event.preventDefault();

      toggleButton.toggleClass("is-clicked");
      nav.slideToggle();
    });

    if (toggleButton.is(":visible")) nav.addClass("mobile");

    $WIN.on("resize", function () {
      if (toggleButton.is(":visible")) nav.addClass("mobile");
      else nav.removeClass("mobile");
    });

    nav.find("a").on("click", function () {
      if (nav.hasClass("mobile")) {
        toggleButton.toggleClass("is-clicked");
        nav.slideToggle();
      }
    });
  };

  /* Alert Boxes
   * ------------------------------------------------------ */
  const ssAlertBoxes = function () {
    $(".alert-box").on("click", ".alert-box__close", function () {
      $(this).parent().fadeOut(500);
    });
  };

  /* Smooth Scrolling
   * ------------------------------------------------------ */
  const ssSmoothScroll = function () {
    $(".smoothscroll").on("click", function (e) {
      const target = this.hash;
      const $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top,
          },
          cfg.scrollDuration,
          "swing"
        )
        .promise()
        .done(function () {
          // check if menu is open
          if ($("body").hasClass("menu-is-open")) {
            $(".header-menu-toggle").trigger("click");
          }

          window.location.hash = target;
        });
    });
  };

  /* Back to Top
   * ------------------------------------------------------ */
  const ssBackToTop = function () {
    const pxShow = 500;
    const $goTopButton = $(".ss-go-top");

    // Show or hide the button
    if ($(window).scrollTop() >= pxShow)
      $goTopButton.addClass("link-is-visible");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() >= pxShow) {
        if (!$goTopButton.hasClass("link-is-visible"))
          $goTopButton.addClass("link-is-visible");
      } else {
        $goTopButton.removeClass("link-is-visible");
      }
    });
  };

  /* Scroll-triggered Animations
   * ------------------------------------------------------ */
  const ssScrollAnimations = function () {
    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers
      $(".animate-on-scroll").addClass("animated");
      $(".fade-in-up, .fade-in-up-delay, .fade-in-up-delay-2, .fade-in-left, .fade-in-right").addClass("animated");
      return;
    }

    // Create observer with options
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          // Also animate child elements
          const children = entry.target.querySelectorAll(
            ".fade-in-up, .fade-in-up-delay, .fade-in-up-delay-2, .fade-in-left, .fade-in-right"
          );
          children.forEach(function (child) {
            setTimeout(function () {
              child.classList.add("animated");
            }, 100);
          });
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach(function (element) {
      observer.observe(element);
    });

    // Also observe fade-in elements directly
    const fadeElements = document.querySelectorAll(
      ".fade-in-up, .fade-in-up-delay, .fade-in-up-delay-2, .fade-in-left, .fade-in-right"
    );
    fadeElements.forEach(function (element) {
      if (!element.closest(".animate-on-scroll")) {
        observer.observe(element);
      }
    });
  };

  /* Parallax Effect
   * ------------------------------------------------------ */
  const ssParallax = function () {
    const parallaxElements = document.querySelectorAll(".parallax-bg");
    
    if (parallaxElements.length === 0) return;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(function (element) {
        const rect = element.getBoundingClientRect();
        const speed = 0.5;
        
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          const yPos = -(scrolled * speed);
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      });
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  };

  /* Initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    ssPreloader();
    ssMobileMenu();
    ssAlertBoxes();
    ssSmoothScroll();
    ssBackToTop();
    ssScrollAnimations();
    ssParallax();
  })();
})(jQuery);
