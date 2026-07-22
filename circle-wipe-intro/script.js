gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
  
  let bottleFloat, circleBreathe;

  const splitNav = new SplitText(".nav-items a", { type: "words", wordsClass: "nav-word" });
  const splitHeading = new SplitText(".hero-header h1", { type: "lines, words, chars", charsClass: "char" });
  const splitFooter = new SplitText(".hero-footer p", { type: "lines", linesClass: "footer-line" });
  const splitMobileNav = new SplitText(".mobile-menu-items a", { type: "words", wordsClass: "menu-mobile-word" });
  const splitMobileFooter = new SplitText(".mobile-menu-footer p", { type: "lines", linesClass: "menu-mobile-footer-line" });

  gsap.set(".nav-logo", { opacity: 0 });
  gsap.set(splitNav.words, { yPercent: 100 });
  gsap.set(splitFooter.lines, { yPercent: 100 });
  gsap.set(splitHeading.chars, { yPercent: 60, opacity: 0, scale: 0.5 });
  
  gsap.set(".mobile-menu", { display: "none" });
  gsap.set(".mobile-menu-background", { clipPath: "circle(0% at 92% 50px)" });
  gsap.set(splitMobileNav.words, { yPercent: 100 });
  gsap.set(splitMobileFooter.lines, { yPercent: 100 });

  const isMobile = window.innerWidth < 768;
  const scaleFactor = isMobile ? 0.55 : 1.0;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const navLogo = document.querySelector(".nav-logo");
  const navRect = navLogo.getBoundingClientRect();
  const deltaX = (navRect.left + navRect.width / 2) - cx;
  const deltaY = (navRect.top + navRect.height / 2) - cy;
  
  // Read the natural CSS width of the preloader logo to compute the perfect scale factor dynamically
  const preloaderLogoEl = document.querySelector(".preloader-logo");
  const preloaderBaseWidth = parseFloat(window.getComputedStyle(preloaderLogoEl).width) || 150;
  const targetScale = navRect.width / preloaderBaseWidth;

  const maxX = cx - (isMobile ? 45 : 80);
  const maxY = cy - (isMobile ? 45 : 80);

  const itemTargets = [
    { x: -0.75 * maxX, y: -0.65 * maxY, rotation: -15 },
    { x: 0.85 * maxX, y: -0.45 * maxY, rotation: 12 },
    { x: -0.40 * maxX, y: 0.70 * maxY, rotation: -8 },
    { x: 0.60 * maxX, y: 0.60 * maxY, rotation: 18 },
    { x: -0.85 * maxX, y: 0.15 * maxY, rotation: 25 },
    { x: 0.25 * maxX, y: -0.80 * maxY, rotation: -20 }
  ];

  const items = gsap.utils.toArray(".item");
  let floatingTweens = [];

  function startFloating(element, index) {
    const drifts = [
      { x: "-=10", y: "-=10", rotation: "-=2" },
      { x: "+=10", y: "-=10", rotation: "+=2" },
      { x: "-=10", y: "+=10", rotation: "+=2" },
      { x: "+=10", y: "+=10", rotation: "-=2" },
      { x: "-=8", y: "+=12", rotation: "+=3" },
      { x: "+=12", y: "-=8", rotation: "-=3" }
    ];
    
    const tween = gsap.to(element, {
      x: drifts[index].x,
      y: drifts[index].y,
      rotation: drifts[index].rotation,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    floatingTweens.push(tween);
  }

  function startHeroFloating(element, index) {
    let driftX, driftY, driftRot, duration;
    
    if (index === 0) { // Chilli (middle left of bottle)
      driftX = "-=12";
      driftY = "+=10";
      driftRot = "+=6";
      duration = 3.2;
    } else if (index === 1) { // Cherry (far right)
      driftX = "+=8";
      driftY = "-=12";
      driftRot = "-=8";
      duration = 2.7;
    } else if (index === 2) { // Onion (top of ORDERED)
      driftX = "-=14";
      driftY = "+=14";
      driftRot = "+=10";
      duration = 4.8;
    } else if (index === 3) { // Pineapple (bottom right on bottle)
      driftX = "+=16";
      driftY = "-=14";
      driftRot = "-=12";
      duration = 4.1;
    } else if (index === 4) { // Garlic (bottom left background)
      driftX = "-=10";
      driftY = "-=12";
      driftRot = "+=8";
      duration = 3.6;
    } else { // Habanero (upper right background)
      driftX = "+=12";
      driftY = "+=15";
      driftRot = "-=10";
      duration = 4.3;
    }
    
    gsap.to(element, {
      x: driftX,
      y: driftY,
      rotation: driftRot,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      bottleFloat = gsap.to(".hero-image-bottle-wrapper", {
        y: "+=12",
        duration: 4, // Offset duration to prevent synchronization with background circle
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      circleBreathe = gsap.to(".hero-image-background", {
        y: "+=12",
        scale: 0.85,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  });

  // Phase 1: Circle wipes
  tl.to(".preloader-revealer", {
    clipPath: "circle(100% at 50% 50%)",
    duration: 1.2,
    ease: "power4.inOut",
    stagger: 0.2
  });

  tl.set(".preloader-revealer:not(.revealer-4)", { display: "none" });

  // Phase 2: Items and logo entrance
  tl.addLabel("entrance", "-=0.25");

  tl.to(".preloader-logo", {
    scale: 1,
    opacity: 1,
    duration: 0.9,
    ease: "back.out(1.5)"
  }, "entrance");

  items.forEach((item, index) => {
    tl.to(item, {
      x: itemTargets[index].x,
      y: itemTargets[index].y,
      rotation: itemTargets[index].rotation,
      scale: 1,
      duration: 1.2,
      ease: "back.out(1.2)",
      onComplete: () => startFloating(item, index)
    }, "entrance");
  });

  tl.set(".preloader-background", { display: "none" });

  tl.to({}, { duration: 0.15 });

  // Phase 3: Exit sequence
  tl.add(() => {
    floatingTweens.forEach(tween => tween.kill());
  });

  tl.to(".preloader-background", {
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "exit");

  tl.set(".preloader-revealer", { display: "none" }, "exit");

  const heroPositions = isMobile ? [
    { x: -75, y: 140, scale: 0.7 }, // Chilli (closer to bottle, shifted down)
    { x: 140, y: 80, scale: 0.65 }, // Cherry (far right, in view)
    { x: -140, y: -240, scale: 0.8 }, // Onion (shifted up and left, away from text)
    { x: 80, y: 240, scale: 0.9 }, // Pineapple (more towards the bottom of the bottle)
    { x: -145, y: 170, scale: 0.75 }, // Garlic (bottom left background)
    { x: 130, y: -120, scale: 0.8 } // Habanero (upper right background)
  ] : [
    { x: -120, y: 180, scale: 0.8 }, // Chilli (closer to bottle, shifted down)
    { x: 520, y: 60, scale: 0.7 }, // Cherry (far right)
    { x: -480, y: -300, scale: 0.9 }, // Onion (shifted up and left, away from text)
    { x: 130, y: 360, scale: 1.1 }, // Pineapple (more towards the bottom of the bottle)
    { x: -460, y: 260, scale: 0.85 }, // Garlic (bottom left background)
    { x: 480, y: -220, scale: 0.9 } // Habanero (upper right background)
  ];

  items.forEach((item, index) => {
    tl.to(item, {
      x: heroPositions[index].x,
      y: heroPositions[index].y,
      rotation: index === 0 ? -10 : index === 1 ? 10 : index === 2 ? -25 : index === 3 ? 30 : index === 4 ? 15 : -15,
      scale: heroPositions[index].scale,
      filter: index >= 2 ? "blur(6px)" : "blur(0px)",
      duration: 1.0,
      ease: "power4.inOut",
      onComplete: () => {
        startHeroFloating(item, index);
        if (index >= 2) {
          // Blur hover for background items
          gsap.set(item, { pointerEvents: "auto" });
          item.addEventListener("mouseenter", () => {
            gsap.to(item, { filter: "blur(0px)", scale: heroPositions[index].scale * 1.15, duration: 0.4, ease: "power2.out" });
          });
          item.addEventListener("mouseleave", () => {
            gsap.to(item, { filter: "blur(6px)", scale: heroPositions[index].scale, duration: 0.6, ease: "power2.out" });
          });
        }
      }
    }, "exit");
  });

  tl.to(".preloader-logo", {
    x: deltaX,
    y: deltaY,
    scale: targetScale,
    opacity: 0,
    duration: 0.9,
    ease: "power3.inOut"
  }, "exit");

  tl.fromTo(".nav-logo",
    { opacity: 0, x: -8 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
    "exit+=0.4"
  );

  tl.set(".preloader-logo", { display: "none" }, "exit+=0.9");

  tl.to(splitNav.words, {
    yPercent: 0,
    duration: 0.6,
    ease: "power4.out",
    stagger: 0.05
  }, "exit+=0.2");

  tl.to(splitHeading.chars, {
    yPercent: 0,
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "elastic.out(1, 0.75)",
    stagger: 0.02
  }, "exit+=0.3");

  tl.to(splitFooter.lines, {
    yPercent: 0,
    duration: 0.6,
    ease: "power4.out",
    stagger: 0.1
  }, "exit+=0.4");

  tl.to(".hero-image-background", {
    scale: 1,
    duration: 0.6,
    ease: "power4.out"
  }, "exit+=0.3");

  tl.to(".hero-image-bottle-wrapper img", {
    y: 0,
    rotation: 8,
    duration: 0.9,
    ease: "power4.out"
  }, "exit+=0.4");

  // Enable hero interaction through preloader
  tl.set(".preloader", { pointerEvents: "none" });

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
let isMenuOpen = false;
let menuTimeline;

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    
    if (menuTimeline) menuTimeline.kill();
    menuTimeline = gsap.timeline();
    
    if (isMenuOpen) {
      gsap.set(mobileMenu, { display: "block" });
      
      menuTimeline.to(".hamburger .line-1", {
        y: 6,
        rotation: 45,
        duration: 0.4,
        ease: "power2.inOut"
      }, "start");
      menuTimeline.to(".hamburger .line-2", {
        y: -6,
        rotation: -45,
        duration: 0.4,
        ease: "power2.inOut"
      }, "start");
      
      menuTimeline.to(".mobile-menu-background", {
        clipPath: "circle(150% at 92% 50px)",
        duration: 0.8,
        ease: "power3.inOut"
      }, "start");
      
      menuTimeline.to(splitMobileNav.words, {
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05
      }, "start+=0.5");
      
      menuTimeline.to(splitMobileFooter.lines, {
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08
      }, "start+=0.6");
      
    } else {
      menuTimeline.to(".hamburger .line-1", {
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "start");
      menuTimeline.to(".hamburger .line-2", {
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "start");
      
      menuTimeline.to(splitMobileNav.words, {
        yPercent: 100,
        duration: 0.4,
        ease: "power3.in"
      }, "start");
      menuTimeline.to(splitMobileFooter.lines, {
        yPercent: 100,
        duration: 0.4,
        ease: "power3.in"
      }, "start");
      
      menuTimeline.to(".mobile-menu-background", {
        clipPath: "circle(0% at 92% 50px)",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(mobileMenu, { display: "none" });
        }
      }, "start+=0.1");
    }
  });
}
});
