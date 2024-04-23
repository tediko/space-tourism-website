import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

// Selectors
const sectionContainers = [...document.querySelectorAll('.panel')];
const linkElements = [...document.querySelectorAll('[data-link]')];

// Flags
let sectionTops;
let previousViewportWidth = window.innerWidth;
let previousViewportHeight = window.innerHeight;

// Calculate the top position of each section relative to the viewport
// and update the sectionTops array on window resize (debounced) or initial load
const updateSectionTops = (event) => {
  // Check if the viewport width or height has actually changed
  // if it doesn't change and resize was caused by mobile browser don't do anything
  if (window.innerWidth !== previousViewportWidth || window.innerHeight !== previousViewportHeight) {
    window.scrollTo(0, 0);

    sectionTops = sectionContainers.map(section => ({
      id: section.id,
      top: section.getBoundingClientRect().top
    }));

    previousViewportWidth = window.innerWidth;
    previousViewportHeight = window.innerHeight;
  }
}

// Function to debounce resize event
const debounce = (mainFunction, delay) => {
  let timer;
  
  return function (...args) {
    clearTimeout(timer);
    
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

// Call updateSectionTops() immediately to initialize sectionTops
updateSectionTops();

// Add a click event listener to each navigation link
export default linkElements.forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetName = link.dataset.link;
    const targetSection = sectionTops.find(section => section.id === targetName);
    gsap.to(window, { duration: 2, scrollTo: targetSection.top });
  });
});

// Add debounced event listener for window resize
window.addEventListener('resize', debounce(updateSectionTops, 250));