import { technology } from './data.json';

// Selectors
const tabsContainer = document.querySelector('[data-technology-tabs]');
const contentContainer = document.querySelector('[data-technology-content]');
const imageElement = document.querySelector('[data-technology-image-mobile]');
const imageSrcsetElement = document.querySelector('[data-technology-image-desktop]');
const nameElement = document.querySelector('[data-technology-name]');
const descriptionElement = document.querySelector('[data-technology-desc]');
const technologyContainer = document.querySelector('[data-technology-container]');

// Flags
let isActiveClass = 'is-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = contentContainer;
let onMouseDownY;
let currentTab = 0;

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
        contentContainer.classList.add(state === 'in' ? animInClass : animOutClass);
        imageElement.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        contentContainer.classList.remove(animInClass, animOutClass);
        imageElement.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    nameElement.innerHTML = newContent.name;
    descriptionElement.innerHTML = newContent.description;
    imageElement.src = newContent.images.mobile;
    imageSrcsetElement.srcset = newContent.images.desktop;
    imageElement.alt = newContent.images.alt;
}


// Checks where user clicked/touched on screen
// and assigns that value to onMouseDownY variable
const handleMouseDown = (event) => {
    if (isChangingContent) return;
    onMouseDownY = event.clientY || event.changedTouches[0].pageY;
    technologyContainer.style.cursor = "grabbing";
    event.preventDefault();
}

// Checks when the user released click/touch and save position
// If user moved mouse more than trigger move to the next/prev content.
const handleMouseUp = (event) => {
    if (isChangingContent) return;
    let tabElements = [...tabsContainer.children];
    let onMouseUpY = event.clientY || event.changedTouches[0].pageY;
    let offset = onMouseDownY - onMouseUpY;
    let trigger = 150;
    let isTriggered = false;
    technologyContainer.style.cursor = "grab";
    
    // Checks if user offset is higher than trigger.
    if (offset > trigger || offset < -trigger) {
        tabElements.forEach(tab => tab.classList.remove(isActiveClass));
        isTriggered = true;
    }

    // Checks which direction was triggered and which tab element is active.
    // Based on that it increment or decremenet currentTab value
    if (offset > trigger && currentTab < technology.length - 1) {
        currentTab++;
    } else if (offset < -trigger && currentTab > 0) {
        currentTab--;
    } else if (offset > trigger && currentTab == technology.length - 1) {
        currentTab = 0;
    } else if (offset < -trigger && currentTab == 0) {
        currentTab = technology.length - 1;
    }

    if (isTriggered) {
        let targetContent = technology.find((element) => element.id == currentTab);
    
        // Handles edge cases or errors that may occur, such as when the target content is not found 
        if (!targetContent) {
            console.error(`Content for tab "${currentTab}" not found.`);
            return;
        }

        handleTabChange(targetContent);
        tabElements[currentTab].classList.add(isActiveClass);
        isTriggered = false;
    }

}

// Event listeners
export default tabsContainer.addEventListener('click', (event) => {
    let eventTarget = event.target;
    let tabTarget = eventTarget.dataset.technologyTab;
    let tabElements = [...tabsContainer.children];
    let targetContent = technology.find((element) => element.id == tabTarget);
    
    // Handles edge cases or errors that may occur, such as when the target content is not found 
    if (!targetContent) {
        console.error(`Content for control "${tabTarget}" not found.`);
        return;
    }

    currentTab = tabTarget;

    if (eventTarget.classList.contains(isActiveClass) || isChangingContent) return;

    tabElements.forEach(tab => tab.classList.remove(isActiveClass));
    eventTarget.classList.add(isActiveClass);
    handleTabChange(targetContent);
})

technologyContainer.addEventListener('mousedown', handleMouseDown);
technologyContainer.addEventListener('trouchstart', handleMouseDown);
technologyContainer.addEventListener('mouseup', handleMouseUp);
technologyContainer.addEventListener('touchend', handleMouseUp);