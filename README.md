# Space tourism website

That was another entertaining challenge in which I learned a lot of new things! Right from the start I decided it would be a great idea to use **GSAP** library to create a *parallax* effect for sections, rather than creating subpages. Each section has tabs through which user can display content. In the *"crew"* and *"technology"* sections, the user can change tabs and content by moving the mouse/touch horizontally. Since the page has a lot of animations *ScrollTrigger* animations using **GSAP** are disabled for users who have set `prefers-reduced-motion`.

- Live Site URL: [space-tourism-tediko.netlify.app](https://space-tourism-tediko.netlify.app/)

## Table of contents

- [My process](#my-process)
  - [What I learned](#what-i-learned)
  - [Built with](#built-with)
- [Setup](#setup)
- [Overview](#overview)
  - [Screenshot](#screenshot)
- [Author](#author)

## My process

1. Shared variables between JavaScript and Sass since I needed to use media query breakpoint variable value for `matchMedia` but I didn't want to do it with copy and paste. I found a way to synchronize my css and js so that my CSS is the *source of truth* and share values with JavaScript. I used **CSS Modules** for this purpose. CSS Modules with *ICSS specification* introduces the `:export` directive to act as a way to export defined values. Coupled with Sass variables, it allows you to export them:

```scss
// breakpoints.module.scss
$my-breakpoint: '(min-width: 768px)';

:export {
  breakpointMedium: $my-breakpoint;
}
```

The exported values are imported like any other JavaScript module:

```jsx
import { breakpointMedium } from 'breakpoints.module.scss';
console.log(breakpointMedium) // Output: `(min-width: 768px)`
```

2. Each section has tabs through which user can display new content. New content is dynamically added in JavaScript so I needed find a way to prevent images from loading each time tab has changed. For this purpose I used the **Intersection Observer API** which helps me detect visibility of a section that appears in the user's viewport. When this happens the `preloadImages()` function is called and creates new `HTMLImageElement` instance with `Image()` constructor to which I attach the *src* of each image from the section:

```js
// Preload images using Image() constructor
const  preloadImages  = (imagesSrc) => {
	let  preloadedImages  = [];
	imagesSrc.forEach((src, index) => {
		preloadedImages[index] =  new  Image();
		preloadedImages[index].src  =  src;
	})
}
```

```js
// Create observer to preload images when user viewport is
// intersecting with given section. preloadImages() fn is invoked with
// images only for section that is intersecting.

const  createObserver  = () => {
let  targets  =  document.querySelectorAll('[data-preload]');
let  observer;

let  options  = {...};

let  callback  = (entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			// here would be logic to get images src from data.json and assign it to newImagesSrc
			preloadImages(newImagesSrc);
			observer.unobserve(entry.target);
		}
	});
};

observer  =  new  IntersectionObserver(callback, options);
targets.forEach(target  =>  observer.observe(target));
}
```

### What I learned

- [Share variables between JS and Sass](https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/) - A way to synchronize *CSS* and *JavaScript* so that CSS is the source of truth and share values/variables with JavaScript.
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - **Intersection Observer API** provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.
- [preload images in JS](https://stackoverflow.com/questions/3646036/preloading-images-with-javascript) - **Preload** lets you tell the browser about critical resources that you want to load.
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - The **`prefers-reduced-motion`**  is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion. The setting is used to convey to the browser on the device that the user prefers an interface that removes, reduces, or replaces motion-based animations.

### Built with

-  [GSAP library](https://gsap.com/docs/v3/) - **GSAP** is a JavaScript library for building high-performance animations that work in every major browser.
- [Vite](https://vitejs.dev/) - **Vite** is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts: a *dev server*, and *build command* that bundles your code with *Rollup*.
-  [Sass CSS pre-processor](https://sass-lang.com/). **Sass** is a stylesheet language that’s compiled to CSS. It allows to use variables, nested rules, mixins, functions, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.
-   [BEM - Block, Element, Modifier](https://getbem.com/) methodology, which is a popular naming convention for classes in HTML and CSS. BEM is useful when it comes to larger, more complex projects when code organization becomes crucial. The idea behind it is to speed up the development process, and ease the teamwork of developers by arranging CSS classes into independent modules.

## Setup
To run this project, clone the repository and install it locally:

```
$ git clone git@github.com:tediko/space-tourism-website.git
$ cd art-gallery
$ npm install
```

Start dev server and watch assets for changes:

```
$ npm run dev
```

*(optional)* Start a local web server and locally preview the production build:

```
$ npm run build
$ npm run preview
```

## Overview

### Screenshot

![Design preview for the Single-page design portfolio ](./public/preview.jpg)

## Author

- Frontend Mentor - [@tediko](https://www.frontendmentor.io/profile/tediko)
- Twitter - [@tediko123](https://www.twitter.com/tediko123)
