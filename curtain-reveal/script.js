gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create("hop", "M0,0 C0.05,0.05 0.1,0.3 0.4,0.7 C0.6,0.9 0.8,1 1,1");
CustomEase.create("hop2", "M0,0 C0.1,0.2 0.15,0.4 0.45,0.85 C0.65,0.95 0.85,1 1,1");

function splitElementText(selector, splitType, className) {
  return new SplitText(selector, {
    type: splitType,
    [`${splitType}Class`]: className
  });
}

const splitPreloaderTitle = splitElementText(".preloader-title", "chars", "preloader-char");
const splitHeroTitle = splitElementText(".hero-title", "chars", "hero-char");
const splitNavItems = new SplitText(".nav-links a", { type: "words", wordsClass: "nav-word" });
const splitFooterItems = new SplitText(".footer-label", { type: "lines", linesClass: "footer-line" });

document.querySelectorAll(".nav-word").forEach(el => {
  const wrapper = document.createElement("span");
  wrapper.className = "nav-word-wrapper";
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
});

document.querySelectorAll(".footer-line").forEach(el => {
  const wrapper = document.createElement("span");
  wrapper.className = "footer-line-wrapper";
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
});

gsap.set(".preloader", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
gsap.set(splitPreloaderTitle.chars, { yPercent: 100 });
gsap.set(splitHeroTitle.chars, { yPercent: 100, opacity: 0 });
gsap.set(".nav-word", { yPercent: 100, opacity: 0 });
gsap.set(".footer-line", { yPercent: 100, opacity: 0 });

const initialRotations = [-12, 8, -4, 15, -7, 5];
const images = gsap.utils.toArray(".preloader-image");

images.forEach((img, i) => {
  gsap.set(img, { rotation: initialRotations[i] });
});

let countTracker = { value: 0 };
const counterDisplay = document.querySelector(".counter-text");

function updateCounterDisplay() {
  if (counterDisplay) {
    counterDisplay.innerText = String(Math.floor(countTracker.value)).padStart(3, "0");
  }
}

const mainTimeline = gsap.timeline({ delay: 0.3 });

// 1. Fanned image stack expands into view
mainTimeline.to(images, {
  scale: 1,
  clipPath: "inset(0% 0% 0% 0%)",
  duration: 1.5,
  ease: "hop",
  stagger: 0.08
});

// 2. Preloader Header & Title reveal centered ON TOP of image stack
mainTimeline.set(".preloader-header", { opacity: 1 }, "-=1.1");

mainTimeline.to(splitPreloaderTitle.chars, {
  yPercent: 0,
  duration: 1.0,
  ease: "hop2",
  stagger: { each: 0.04, from: "random" }
}, "-=1.1");

// 3. Counter number counts up from 000 to 100 in the center on top of images
mainTimeline.to(countTracker, {
  value: 100,
  duration: 2.2,
  ease: "power2.out",
  onUpdate: updateCounterDisplay
}, "-=2.0");

// 4. Stagger out preloader title & counter
mainTimeline.to(splitPreloaderTitle.chars, {
  yPercent: -105,
  duration: 0.8,
  ease: "hop2",
  stagger: { each: 0.03, from: "random" }
}, "+=0.2");

mainTimeline.to(counterDisplay, {
  yPercent: -105,
  duration: 0.8,
  ease: "hop2"
}, "<");

// 5. Shrink preloader images
mainTimeline.to(images, {
  scale: 0,
  clipPath: "inset(45% 45% 45% 45%)",
  duration: 1.0,
  ease: "hop",
  stagger: { each: 0.05, from: "end" }
}, "-=0.6");

// 6. Curtain lifts up & triggers hero animations AFTER curtain clears
mainTimeline.to(".preloader", {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 1.2,
  ease: "hop",
  onComplete: () => {
    gsap.set(".preloader", { display: "none" });

    // Progressive sequential character reveal (N -> E -> B -> U -> L -> A) once preloader is gone
    gsap.fromTo(splitHeroTitle.chars,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12
      }
    );

    // Navigation words sweep up
    gsap.fromTo(".nav-word",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.04
      }
    );

    // Footer lines sweep up
    gsap.fromTo(".footer-line",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06
      }
    );
  }
}, "-=0.4");
