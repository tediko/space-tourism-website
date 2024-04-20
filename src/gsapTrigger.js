import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Selects .panel elements from DOM
let panels = gsap.utils.toArray(".panel");

// Creates scroll trigger animations
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

export default document.addEventListener('DOMContentLoaded', () => {
    createScroll();
})