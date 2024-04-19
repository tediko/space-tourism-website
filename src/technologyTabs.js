import { technology } from './data.json';

// Selectors
const TABS_SELECTOR = document.querySelectorAll('[data-technology-tab]');
const CONTENT_CONTAINER_SELECTOR = document.querySelector('[data-technology-content]');
const IMAGE_SELECTOR = document.querySelector('[data-technology-image-mobile]');
const IMAGE_SRCSET_SELECTOR = document.querySelector('[data-technology-image-desktop]');
const SUBHEADING_SELECTOR = document.querySelector('[data-technology-subheading]');
const NAME_SELECTOR = document.querySelector('[data-technology-name]');
const DESC_SELECTOR = document.querySelector('[data-technology-desc]');
const TECHNOLOGY_CONTAINER_SELECTOR = document.querySelector('[data-technology-container]');

// Flags
let isActiveClass = 'is-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = CONTENT_CONTAINER_SELECTOR;
let onMouseDownY;
let currentTab = 0;

// Handles tab change
const handleTabChange = (target) => {
    let targetContent = technology.find((element) => element.id == target);
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
        CONTENT_CONTAINER_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
        IMAGE_SELECTOR.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        CONTENT_CONTAINER_SELECTOR.classList.remove(animInClass, animOutClass);
        IMAGE_SELECTOR.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    NAME_SELECTOR.innerHTML = newContent.name;
    DESC_SELECTOR.innerHTML = newContent.description;
    IMAGE_SELECTOR.src = newContent.images.mobile;
    IMAGE_SRCSET_SELECTOR.srcset = newContent.images.desktop;
    IMAGE_SELECTOR.alt = newContent.images.alt;
}


// Checks where user clicked/touched on screen
// and assigns that value to onMouseDownY variable
const handleMouseDown = (event) => {
    if (isChangingContent) return;
    onMouseDownY = event.clientY || event.changedTouches[0].pageY;
    TECHNOLOGY_CONTAINER_SELECTOR.style.cursor = "grabbing";
    event.preventDefault();
}

// Checks when the user released click/touch and save position
// If user moved mouse more than trigger move to the next/prev content.
const handleMouseUp = (event) => {
    if (isChangingContent) return;
    let onMouseUpY = event.clientY || event.changedTouches[0].pageY;
    let offset = onMouseDownY - onMouseUpY;
    let trigger = 150;
    TECHNOLOGY_CONTAINER_SELECTOR.style.cursor = "grab";
    
    if (offset > trigger || offset < -trigger) {
        TABS_SELECTOR.forEach(tab => tab.classList.remove(isActiveClass));
    }

    if (offset > trigger && currentTab < technology.length - 1) {
        currentTab++;
        handleTabChange(currentTab);
        TABS_SELECTOR[currentTab].classList.add(isActiveClass);
    } else if (offset < -trigger && currentTab > 0) {
        currentTab--;
        handleTabChange(currentTab);
        TABS_SELECTOR[currentTab].classList.add(isActiveClass);
    } else if (offset > trigger && currentTab == technology.length - 1) {
        currentTab = 0;
        handleTabChange(currentTab);
        TABS_SELECTOR[currentTab].classList.add(isActiveClass);
    } else if (offset < -trigger && currentTab == 0) {
        currentTab = technology.length - 1;
        handleTabChange(currentTab);
        TABS_SELECTOR[currentTab].classList.add(isActiveClass);
    }

}

// Event listeners
export default TABS_SELECTOR.forEach(tab => {
    tab.addEventListener('click', (event) => {
        let eventTarget = event.target;
        let tabTarget = eventTarget.dataset.technologyTab;
        currentTab = tabTarget;
        if (eventTarget.classList.contains(isActiveClass) || isChangingContent) return;

        TABS_SELECTOR.forEach(tab => tab.classList.remove(isActiveClass));
        eventTarget.classList.add(isActiveClass);
        handleTabChange(tabTarget);
    })
})

TECHNOLOGY_CONTAINER_SELECTOR.addEventListener('mousedown', handleMouseDown);
TECHNOLOGY_CONTAINER_SELECTOR.addEventListener('trouchstart', handleMouseDown);
TECHNOLOGY_CONTAINER_SELECTOR.addEventListener('mouseup', handleMouseUp);
TECHNOLOGY_CONTAINER_SELECTOR.addEventListener('touchend', handleMouseUp);