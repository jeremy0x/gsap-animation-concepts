gsap.registerPlugin(CustomEase);

document.addEventListener("DOMContentLoaded", () => {
  CustomEase.create("hop", "M0,0 C0.05,0.05 0.15,0.45 0.4,0.8 C0.65,0.95 0.8,1 1,1");

  const introCards = gsap.utils.toArray(".intro-cards .card");
  const outroCards = gsap.utils.toArray(".outro-cards .card");
  const heroText = document.querySelector(".hero-animation-text");
  const totalIntroCards = introCards.length;

  function getLayoutRadius() {
    const w = window.innerWidth;
    if (w <= 480) return 140;
    if (w <= 768) return 190;
    if (w <= 1024) return 250;
    return 320;
  }

  const radius = getLayoutRadius();

  introCards.forEach((card, index) => {
    if (index === 0) {
      gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0, opacity: 0, zIndex: totalIntroCards });
    } else {
      const angle = ((index - 1) / (totalIntroCards - 1)) * (2 * Math.PI) - (Math.PI / 2);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      gsap.set(card, {
        x,
        y,
        rotation: (angle * 180 / Math.PI) + 90,
        scale: 0,
        opacity: 0,
        zIndex: totalIntroCards - index
      });
    }
  });

  outroCards.forEach((card, index) => {
    gsap.set(card, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1.0,
      opacity: 0,
      zIndex: outroCards.length - index
    });
  });

  gsap.set(heroText, { fontSize: "1.25rem", opacity: 1, y: 0 });

  function getTossPositions() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    const isTablet = screenWidth <= 1024;
    const cardWidth = isMobile ? 76 : (isTablet ? 105 : 130);
    const padding = isMobile ? 16 : (isTablet ? 32 : 64);
    const maxOffset = (screenWidth / 2) - (cardWidth / 2) - padding;
    const step = (maxOffset * 2) / 4;

    return [
      -maxOffset,
      -maxOffset + step,
      0,
      -maxOffset + step * 3,
      maxOffset
    ];
  }

  function getFullWidthFontSize() {
    const tempSpan = document.createElement("span");
    tempSpan.style.fontFamily = "'Barlow Condensed', sans-serif";
    tempSpan.style.fontWeight = "800";
    tempSpan.style.fontSize = "100px";
    tempSpan.style.letterSpacing = "-0.04em";
    tempSpan.style.textTransform = "uppercase";
    tempSpan.style.position = "absolute";
    tempSpan.style.visibility = "hidden";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.innerText = "EXPERIMENTAL";
    document.body.appendChild(tempSpan);

    const measuredWidth = tempSpan.getBoundingClientRect().width || 1;
    document.body.removeChild(tempSpan);

    return (100 * window.innerWidth) / measuredWidth;
  }

  const tl = gsap.timeline({ delay: 0.2 });

  tl.to(introCards, {
    scale: 1.0,
    opacity: 1,
    duration: 0.75,
    ease: "power3.out",
    stagger: 0.04
  });

  tl.to(introCards.slice(1), {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1.0,
    duration: 0.8,
    ease: "power2.inOut",
    stagger: 0.04
  }, "+=0.15");

  tl.add(() => {
    gsap.set(outroCards, { opacity: 1, scale: 1.0 });
    gsap.set(introCards, { opacity: 0, display: "none" });
  }, "+=0.1");

  const tossX = getTossPositions();
  outroCards.forEach((card, index) => {
    tl.to(card, {
      x: tossX[index],
      y: 0,
      scale: 1.0,
      rotation: 0,
      duration: 1.1,
      ease: "hop"
    }, "toss+=0.1");
  });

  tl.to(".nav", { y: 0, duration: 1.0, ease: "hop" }, "toss");

  tl.to(heroText, {
    fontSize: () => getFullWidthFontSize() + "px",
    duration: 1.2,
    ease: "hop"
  }, "toss+=0.1");

  window.addEventListener("resize", () => {
    const updatedPositions = getTossPositions();
    outroCards.forEach((card, index) => {
      gsap.to(card, {
        x: updatedPositions[index],
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    if (heroText) {
      gsap.to(heroText, {
        fontSize: getFullWidthFontSize() + "px",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
});