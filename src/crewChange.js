import { crew } from './data.json';

// Selectors
const CONTROLS_SELECTOR = document.querySelectorAll('[data-crew-control]');
const IMAGE_SELECTOR = document.querySelector('[data-crew-image]');
const SUBHEADING_SELECTOR = document.querySelector('[data-crew-subheading]');
const NAME_SELECTOR = document.querySelector('[data-crew-name]');
const DESC_SELECTOR = document.querySelector('[data-crew-desc]');

// Flags
let isActiveClass = 'is-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = NAME_SELECTOR;

// Handles tab change
const handleTabChange = (target) => {
    let targetContent = crew.find((element) => element.id == target);
    console.log(targetContent);
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
        SUBHEADING_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        DESC_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        NAME_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        IMAGE_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        SUBHEADING_SELECTOR.classList.remove(animInClass, animOutClass);
        DESC_SELECTOR.classList.remove(animInClass, animOutClass);
        NAME_SELECTOR.classList.remove(animInClass, animOutClass);
        IMAGE_SELECTOR.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    NAME_SELECTOR.innerHTML = newContent.name;
    SUBHEADING_SELECTOR.innerHTML = newContent.role;
    DESC_SELECTOR.innerHTML = newContent.bio;
    IMAGE_SELECTOR.src = newContent.images.webp;
    IMAGE_SELECTOR.alt = newContent.images.alt;
}

// Event listeners
export default CONTROLS_SELECTOR.forEach(tab => {
    tab.addEventListener('click', (event) => {
        let eventTarget = event.target;
        let tabTarget = eventTarget.dataset.crewControl;
        if (eventTarget.classList.contains(isActiveClass) || isChangingContent) return;

        CONTROLS_SELECTOR.forEach(tab => tab.classList.remove(isActiveClass));
        eventTarget.classList.add(isActiveClass);
        handleTabChange(tabTarget);
    })
})
