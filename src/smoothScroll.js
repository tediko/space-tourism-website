import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

// Get a list of all the sections
let sections = gsap.utils.toArray(".panel");

// Calculate the top position of each section relative to the viewport
let sectionTops = [];

// Function to update the sectionTops array on window resize (debounced)
function updateSectionTops() {
  // Scroll to the top of the page before calculating sectionTops
  window.scrollTo(0, 0);

  if (window.innerWidth >= 1024) {
    sectionTops = sections.map(section => section.getBoundingClientRect().top);
  } else {
    sectionTops = sections.map(section => section.id);
  }
}

// Debounce the updateSectionTops function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Add debounced event listener for window resize
window.addEventListener('resize', debounce(updateSectionTops, 250));

// Call updateSectionTops() immediately to initialize sectionTops
updateSectionTops();

// Add a click event listener to each navigation link
export default gsap.utils.toArray(".header__link").forEach(function(a, i) {
  a.addEventListener("click", function(e) {
    e.preventDefault();
    if (window.innerWidth >= 1024) {
      gsap.to(window, { duration: 1, scrollTo: sectionTops[i] });
    } else {
      gsap.to(window, { duration: 1, scrollTo: { y: `#${sections[i].id}`, offsetY: 0 } });
    }
  });
});