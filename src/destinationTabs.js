import { destinations } from './data.json';

// Selectors
const tabsContainer = document.querySelector('[data-destination-tabs]');
const planetImageElement = document.querySelector('[data-destination-planet]');
const titleElement = document.querySelector('[data-destination-title]');
const descriptionElement = document.querySelector('[data-destination-desc]');
const distanceElement = document.querySelector('[data-destination-distance]');
const timeElement = document.querySelector('[data-destination-time]');

// Flags
let tabActiveClass = 'tab-active';
let animInClass = 'anim-in';
let animOutClass = 'anim-out';
let isChangingContent = false;
let elementWithLongestAnimation = titleElement;

// Handles tab change
const handleTabClick = (targetContent) => {
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
        titleElement.classList.add(state === 'in' ? animInClass : animOutClass);
        descriptionElement.classList.add(state === 'in' ? animInClass : animOutClass);
        distanceElement.classList.add(state === 'in' ? animInClass : animOutClass);
        timeElement.classList.add(state === 'in' ? animInClass : animOutClass);
        planetImageElement.classList.add(state === 'in' ? animInClass : animOutClass);
    } else if (state === "remove") {
        titleElement.classList.remove(animInClass, animOutClass);
        descriptionElement.classList.remove(animInClass, animOutClass);
        distanceElement.classList.remove(animInClass, animOutClass);
        timeElement.classList.remove(animInClass, animOutClass);
        planetImageElement.classList.remove(animInClass, animOutClass);
    }
}

// Updates content
const updateContent = (newContent) => {
    titleElement.innerHTML = newContent.name;
    descriptionElement.innerHTML = newContent.description;
    distanceElement.innerHTML = newContent.distance;
    timeElement.innerHTML = newContent.travel;
    planetImageElement.src = newContent.images.webp;
    planetImageElement.alt = newContent.images.alt;
}

// Event listeners
export default tabsContainer.addEventListener('click', (event) => {
    let eventTarget = event.target;
    let tabTarget = eventTarget.dataset.destinationTab;
    let tabElements = [...tabsContainer.children];
    let targetContent = destinations.find((element) => element.name === tabTarget);
    
    // Handles edge cases or errors that may occur, such as when the target content is not found 
    if (!targetContent) {
        console.error(`Content for tab "${target}" not found.`);
        return;
    }

    if (eventTarget.classList.contains(tabActiveClass) || isChangingContent) return;

    tabElements.forEach(tab => tab.classList.remove(tabActiveClass));
    eventTarget.classList.add(tabActiveClass);
    handleTabClick(targetContent);
})
