import { crew } from './data.json';

// Selectors
const controlElements = document.querySelectorAll('[data-crew-control]');
const imageElement = document.querySelector('[data-crew-image]');
const subheadingElement = document.querySelector('[data-crew-subheading]');
const nameElement = document.querySelector('[data-crew-name]');
const descriptionElement = document.querySelector('[data-crew-desc]');
const contentContainer = document.querySelector('[data-crew-container]');

// Flags
let isActiveClass = 'is-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = nameElement;
let onMouseDownX;
let currentTab = 0;

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
        subheadingElement.classList.add(state === 'in' ? animInClass : animOutClass);
        descriptionElement.classList.add(state === 'in' ? animInClass : animOutClass);
        nameElement.classList.add(state === 'in' ? animInClass : animOutClass);
        imageElement.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        subheadingElement.classList.remove(animInClass, animOutClass);
        descriptionElement.classList.remove(animInClass, animOutClass);
        nameElement.classList.remove(animInClass, animOutClass);
        imageElement.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    nameElement.innerHTML = newContent.name;
    subheadingElement.innerHTML = newContent.role;
    descriptionElement.innerHTML = newContent.bio;
    imageElement.src = newContent.images.webp;
    imageElement.alt = newContent.images.alt;
}


// Checks where user clicked/touched on screen
// and assigns that value to onMouseDownX variable
const handleMouseDown = (event) => {
    if (isChangingContent) return;
    onMouseDownX = event.clientX || event.changedTouches[0].pageX;
    contentContainer.style.cursor = "grabbing";
    event.preventDefault();
}

// Checks when the user released click/touch and save position
// If user moved mouse more than trigger move to the next/prev content.
const handleMouseUp = (event) => {
    if (isChangingContent) return;
    let onMouseUpX = event.clientX || event.changedTouches[0].pageX;
    let offset = onMouseDownX - onMouseUpX;
    let trigger = 150;
    contentContainer.style.cursor = "grab";
    
    if (offset > trigger && currentTab < crew.length - 1 || offset < -trigger && currentTab > 0) {
        controlElements.forEach(tab => tab.classList.remove(isActiveClass));
    }

    if (offset > trigger && currentTab < crew.length - 1) {
        currentTab++;
        handleTabChange(currentTab);
        controlElements[currentTab].classList.add(isActiveClass);
    } else if (offset < -trigger && currentTab > 0) {
        currentTab--;
        handleTabChange(currentTab);
        controlElements[currentTab].classList.add(isActiveClass);
    }
}

// Event listeners
export default controlElements.forEach(tab => {
    tab.addEventListener('click', (event) => {
        let eventTarget = event.target;
        let tabTarget = eventTarget.dataset.crewControl;
        currentTab = tabTarget;
        if (eventTarget.classList.contains(isActiveClass) || isChangingContent) return;

        controlElements.forEach(tab => tab.classList.remove(isActiveClass));
        eventTarget.classList.add(isActiveClass);
        handleTabChange(tabTarget);
    })
})

contentContainer.addEventListener('mousedown', handleMouseDown);
contentContainer.addEventListener('trouchstart', handleMouseDown);
contentContainer.addEventListener('mouseup', handleMouseUp);
contentContainer.addEventListener('touchend', handleMouseUp);