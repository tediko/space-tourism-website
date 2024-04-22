import data from './data.json';

// Preload images using Image() constructor
const preloadImages = (imagesSrc) => {
    let preloadedImages = [];
    
    imagesSrc.forEach((src, index) => {
        preloadedImages[index] = new Image();
        preloadedImages[index].src = src;
    })
}

// Create observer to preload images when user viewport is 
// intersecting with given section. preloadImages() fn is invoked with
// images only for section that is intersecting.
const createObserver = () => {
    let targets = document.querySelectorAll('[data-preload]');
    let observer;

    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    };

    let callback = (entries, observer) => {
        entries.forEach((entry) => {
            let entryTargetName = entry.target.id;

            if (entry.isIntersecting) {
                const newImagesSrc = data[entryTargetName].reduce((acc, dataEntry) => {
                    for (const key in dataEntry.images) {
                        if (key !== 'alt') {
                            acc.push(dataEntry.images[key]);
                        }
                    }
                    return acc;
                }, []);

                preloadImages(newImagesSrc);
                observer.unobserve(entry.target);
            }
        });
    };

    observer = new IntersectionObserver(callback, options);
    targets.forEach(target => observer.observe(target));
}

export default createObserver();