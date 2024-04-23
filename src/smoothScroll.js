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
  // Get the current viewport width and height
  const currentViewportWidth = window.innerWidth;
  const currentViewportHeight = window.innerHeight;

  // Calculate the change in viewport size
  const widthChange = Math.abs(currentViewportWidth - previousViewportWidth);
  const heightChange = Math.abs(currentViewportHeight - previousViewportHeight);

  // Define a threshold for considering a resize as "significant"
  const resizeThreshold = 50; // 50 pixels

  // Check if the resize is significant (not caused by the bottom menu disappearing)
  if (widthChange >= resizeThreshold || heightChange >= resizeThreshold) {
    console.log(event);
    window.scrollTo(0, 0);

    sectionTops = sectionContainers.map(section => ({
      id: section.id,
      top: section.getBoundingClientRect().top
    }));

    // Update the previous viewport width and height
    previousViewportWidth = currentViewportWidth;
    previousViewportHeight = currentViewportHeight;
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