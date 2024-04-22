import { mediaBreakpoints as breakpoints } from './sass/breakpoints.module.scss';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Selectors
let panels = [...document.querySelectorAll('.panel')];
let navItems = [...document.querySelectorAll('.header__item')];

// Flags
let isActiveClass = 'active';

// Add navItem active class when section is in viewport
const showActiveNavItemOnScroll = () => {
    panels.forEach((panel, index) => {
        ScrollTrigger.create({
            trigger: panel,
            start: "top 50%",
            end: "110% bottom",
            markers: false,
    
            onEnter: () => {
            navItems.forEach((item) => {
                item.classList.remove(isActiveClass);
            });
            navItems[index].classList.add(isActiveClass);
            },
            onEnterBack: () => {
            navItems.forEach((item) => {
                item.classList.remove(isActiveClass);
            });
            navItems[index].classList.add(isActiveClass);
            }
        });
    });
}


// Handles initial load and checks if user has prefers-reduced-motion media feature
const initialLoad = () => {
    let isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches; 
    if (isReduced) return;
    
    // data-state="ready" is used in CSS to add pre-animation styles
    // when user has not set prefers-reduced-motion to reduce.
    let elementsToAnimate = document.querySelectorAll('[data-state]');
    elementsToAnimate.forEach(element => {
        element.dataset.state = 'ready';
    })
    animate();
}

// Creates paralax effect animations
const createScroll = (topTrigger) => {
    panels.forEach((panel, index) => {
        const isLast = index === panels.length - 1;
        
        gsap.timeline({
            scrollTrigger: {
                trigger: panel,
                start: `${topTrigger} top`,
                scrub: 1,
                markers: false
            }
        })
        .to(panel, {
            ease: 'none',
            startAt: {filter: 'brightness(100%) blur(0px)'},
            filter: isLast ? 'none' : 'brightness(5%) blur(10px)',
            scale: 0.95,
            borderRadius: 40,
        }, '<')
    })
}

// Animates elements using gsap
// When a particular media query matches invokes createScroll() paralax animations
const animate = () => {
    let mediaBreakpoints = JSON.parse(breakpoints.replace(/'/g, ''));
    let desktopMediaQuery = mediaBreakpoints.lg;
    let matchMedia = gsap.matchMedia();
    let smBreakpoint = `(max-width: ${desktopMediaQuery})`;
    let lgBreakpoint = `(min-width: ${desktopMediaQuery})`;

    matchMedia.add(smBreakpoint, () => {
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('is-active'));
        createScroll('35%');
    });

    matchMedia.add(lgBreakpoint, () => {
        document.querySelectorAll('.panel').forEach(panel => panel.classList.add('is-active'));
        createScroll('top');
    });
    
    gsap.to(".hero__intro", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: 3,
            markers: false
        },
        y: -50,
        opacity: 0
    });

    gsap.to(".hero__cta", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: 3,
            markers: false
        },
        y: 50,
        opacity: 1
    });

    gsap.to(".destination__title", {
        scrollTrigger: {
            trigger: ".destination",
            start: "20% bottom",
            end: "90% bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".destination__content", {
        scrollTrigger: {
            trigger: ".destination",
            start: "40% bottom",
            end: "bottom bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".crew__title", {
        scrollTrigger: {
            trigger: ".crew",
            start: "20% bottom",
            end: "90% bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".crew__content", {
        scrollTrigger: {
            trigger: ".crew",
            start: "40% bottom",
            end: "bottom bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".technology__title", {
        scrollTrigger: {
            trigger: ".technology",
            start: "20% bottom",
            end: "90% bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".technology__image-wrapper", {
        scrollTrigger: {
            trigger: ".technology",
            start: "40% bottom",
            end: "90% bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });

    gsap.to(".technology__content", {
        scrollTrigger: {
            trigger: ".technology",
            start: "40% bottom",
            end: "bottom bottom",
            scrub: 3,
            markers: false
        },
        y: 0,
        opacity: 1
    });
}

showActiveNavItemOnScroll();
export default initialLoad();