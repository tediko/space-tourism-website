import { destinations } from './data.json';

// Selectors
const TABS_SELECTOR = document.querySelectorAll('[data-destination-tab]');
const PLANET_SELECTOR = document.querySelector('[data-destination-planet]');
const TITLE_SELECTOR = document.querySelector('[data-destination-title]');
const DESC_SELECTOR = document.querySelector('[data-destination-desc]');
const DISTANCE_SELECTOR = document.querySelector('[data-destination-distance]');
const TIME_SELECTOR = document.querySelector('[data-destination-time]');

// Flags
let tabActiveClass = 'tab-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = TITLE_SELECTOR;

// Handles tab change
const handleTabChange = (target) => {
    let targetContent = destinations.find((element) => element.name === target);
    if (isChangingContent) return;
    isChangingContent = true;
    manageAnimationClasses('out');

    elementWithLongestAnimation.addEventListener('animationend', function contentOut(event) {
        let eventTarget = event.target;
        let hasAnimInClass = eventTarget.classList.contains(animInClass);
        let hasAnimOutClass = eventTarget.classList.contains(animOutClass);

        if (hasAnimOutClass && !hasAnimInClass) {
            updateContent(targetContent);
            manageAnimationClasses('in');
        }
        if (hasAnimInClass && hasAnimOutClass) {
            manageAnimationClasses('remove');
            isChangingContent = false;
            elementWithLongestAnimation.removeEventListener('animationend', contentOut);
        }        
    })
}

// Adds or removes animation classes on elements.
// state parameter can be either: 'in', 'out' or 'remove'
const manageAnimationClasses = (state) => {
    if (state === 'in' || state === 'out' & state != 'remove') {
        TITLE_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        DESC_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        DISTANCE_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        TIME_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        PLANET_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        TITLE_SELECTOR.classList.remove(animInClass, animOutClass);
        DESC_SELECTOR.classList.remove(animInClass, animOutClass);
        DISTANCE_SELECTOR.classList.remove(animInClass, animOutClass);
        TIME_SELECTOR.classList.remove(animInClass, animOutClass);
        PLANET_SELECTOR.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    TITLE_SELECTOR.innerHTML = newContent.name;
    DESC_SELECTOR.innerHTML = newContent.description;
    DISTANCE_SELECTOR.innerHTML = newContent.distance;
    TIME_SELECTOR.innerHTML = newContent.travel;
    PLANET_SELECTOR.src = newContent.images.webp;
    PLANET_SELECTOR.alt = newContent.images.alt;
}

// Event listeners
export default TABS_SELECTOR.forEach(tab => {
    tab.addEventListener('click', (event) => {
        let eventTarget = event.target;
        let tabTarget = eventTarget.dataset.destinationTab;
        if (eventTarget.classList.contains(tabActiveClass) || isChangingContent) return;

        TABS_SELECTOR.forEach(tab => tab.classList.remove(tabActiveClass));
        eventTarget.classList.add(tabActiveClass);
        handleTabChange(tabTarget);
    })
})
