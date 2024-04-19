import { crew } from './data.json';

// Selectors
const controlsContainer = document.querySelector('[data-crew-controls]');
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
let currentControl = 0;

// Handles tab change
const handleTabChange = (targetContent) => {
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
    let controlElements = [...controlsContainer.children];
    let onMouseUpX = event.clientX || event.changedTouches[0].pageX;
    let offset = onMouseDownX - onMouseUpX;
    let trigger = 150;
    contentContainer.style.cursor = "grab";
    let isTriggered = false;

    // Checks if user offset is higher than trigger.
    if (offset > trigger || offset < -trigger) {
        controlElements.forEach(tab => tab.classList.remove(isActiveClass));
        isTriggered = true;
    }

    if (offset > trigger && currentControl < crew.length - 1) {
        currentControl++;
    } else if (offset < -trigger && currentControl > 0) {
        currentControl--;
    } else if (offset > trigger && currentControl == crew.length - 1) {
        currentControl = 0;
    } else if (offset < -trigger && currentControl == 0) {
        currentControl = crew.length - 1;
    }
    
    if (isTriggered) {
        let targetContent = crew.find((element) => element.id == currentControl);
    
        // Handles edge cases or errors that may occur, such as when the target content is not found 
        if (!targetContent) {
            console.error(`Content for control "${currentControl}" not found.`);
            return;
        }

        handleTabChange(targetContent);
        controlElements[currentControl].classList.add(isActiveClass);
        isTriggered = false;
    }
}

// Event listeners
export default controlsContainer.addEventListener('click', (event) => {
        let eventTarget = event.target;
        let controlTarget = eventTarget.dataset.crewControl;
        let controlElements = [...controlsContainer.children];
        let targetContent = crew.find((element) => element.id == controlTarget);
    
        // Handles edge cases or errors that may occur, such as when the target content is not found 
        if (!targetContent) {
            console.error(`Content for control "${controlTarget}" not found.`);
            return;
        }

        currentControl = controlTarget;

        if (eventTarget.classList.contains(isActiveClass) || isChangingContent) return;

        controlElements.forEach(tab => tab.classList.remove(isActiveClass));
        eventTarget.classList.add(isActiveClass);
        handleTabChange(targetContent);
})

contentContainer.addEventListener('mousedown', handleMouseDown);
contentContainer.addEventListener('trouchstart', handleMouseDown);
contentContainer.addEventListener('mouseup', handleMouseUp);
contentContainer.addEventListener('touchend', handleMouseUp);