import { mediaBreakpoints as breakpoints } from './sass/breakpoints.module.scss';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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


// Selects .panel elements from DOM
let panels = gsap.utils.toArray(".panel");

// Creates paralax effect animations
const createScroll = () => {
    panels.forEach((panel, index) => {
        const isLast = index === panels.length - 1;
        
        gsap.timeline({
            scrollTrigger: {
                trigger: panel,
                start: 'top top',
                scrub: 1,
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
    });

    matchMedia.add(lgBreakpoint, () => {
        document.querySelectorAll('.panel').forEach(panel => panel.classList.add('is-active'));
        createScroll();
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

export default initialLoad();