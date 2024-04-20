import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

// Get a list of all the sections
let sections = gsap.utils.toArray(".panel");

// Calculate the top position of each section relative to the viewport
let sectionTops = sections.map(section => ({
  id: section.id,
  top: section.getBoundingClientRect().top
}));

// Function to update the sectionTops array on window resize (debounced)
const updateSectionTops = () => {
  sectionTops = sections.map(section => ({
    id: section.id,
    top: section.getBoundingClientRect().top
  }));
}

// Debounce the updateSectionTops function
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Call updateSectionTops() immediately to initialize sectionTops
updateSectionTops();

// Add a click event listener to each navigation link
export default gsap.utils.toArray("[data-link]").forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const targetSection = sectionTops.find(section => section.id === targetId);
    gsap.to(window, { duration: 1, scrollTo: targetSection.top });
  });
});

// Add debounced event listener for window resize
window.addEventListener('resize', debounce(updateSectionTops, 250));