import { mediaBreakpoints as breakpoints } from './sass/breakpoints.module.scss';

// Selectors
const HAMBURGER_SELECTOR = document.querySelector('[data-hamburger]');
const MENU_SELECTOR = document.querySelector('[data-nav-list]');
const BODY_SELECTOR = document.querySelector('body');

// Flags
let openClass = 'open';
let closeClass = 'close';
let isMenuOpen = false;
let isAnimationEnd = true;
let mediaBreakpoints = JSON.parse(breakpoints.replace(/'/g, ''));
let mediaQuery = `(min-width: ${mediaBreakpoints.md})`;
let matchMedia = window.matchMedia(mediaQuery);

// Toggles mobile menu
const toggleMenu = () => {
    if (!isAnimationEnd) return;

    isMenuOpen = !isMenuOpen;
    isAnimationEnd = !isAnimationEnd;
    HAMBURGER_SELECTOR.ariaExpanded = isMenuOpen;


    if (isMenuOpen) {
        MENU_SELECTOR.classList.add(openClass);
        BODY_SELECTOR.style.overflowY = "hidden";

        MENU_SELECTOR.addEventListener('animationend', function navIn() {
            isAnimationEnd = !isAnimationEnd;
            
            MENU_SELECTOR.removeEventListener('animationend', navIn);
        })
        window.addEventListener('click', removeOnClickOutsideMenu);
    } else {
        MENU_SELECTOR.classList.add(closeClass);
        
        MENU_SELECTOR.addEventListener('animationend', function navOut() {
            isAnimationEnd = !isAnimationEnd;
            MENU_SELECTOR.classList.remove(openClass, closeClass);
            BODY_SELECTOR.style.overflowY = "unset";
            
            MENU_SELECTOR.removeEventListener('animationend', navOut);
            window.removeEventListener('click', removeOnClickOutsideMenu);
        })
    }
}

// Removes menu when user clicks outside menu container
const removeOnClickOutsideMenu = (event) => {
    if (event.target !== MENU_SELECTOR) {
        toggleMenu();
    }
}

// Disable menu
const disableMenu = (event) => {
    if (event.matches) {
        isMenuOpen = false;
        isAnimationEnd = true;
        HAMBURGER_SELECTOR.ariaExpanded = false;
        MENU_SELECTOR.classList.remove(openClass, closeClass);
        window.removeEventListener('click', removeOnClickOutsideMenu);
    }
}

// Event listeners
matchMedia.addEventListener('change', disableMenu)
export default HAMBURGER_SELECTOR.addEventListener('click', toggleMenu);