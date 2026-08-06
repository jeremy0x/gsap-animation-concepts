/**
 * GSAP & Anime.js Kinetic Trailer Intro Reveal
 */
document.addEventListener("DOMContentLoaded", () => {
  // Wrap each non-whitespace character in .header with <span class="letter">
  const textWrapper = document.querySelector(".header");
  if (textWrapper) {
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );
  }

  let mainTimeline = null;
  let animeAnimation = null;

  function runSequence() {
    // Kill existing instances if replaying
    if (mainTimeline) mainTimeline.kill();
    if (animeAnimation) animeAnimation.pause();

    // Hide navbar & subtext during sequence execution
    gsap.set(".nav", { opacity: 0, pointerEvents: "none", y: -10 });
    gsap.set(".header", { opacity: 1 });
    gsap.set(".titles > div", { x: -60, opacity: 0 });
    gsap.set("li.block", { x: -1600 });
    gsap.set(".header .letter", { opacity: 0, translateY: 80 });
    gsap.set(".hero-subtext", { opacity: 0, translateY: 20 });

    mainTimeline = gsap.timeline();

    // 1. Stagger In Titles: Make (t=0s), A (t=2s), Difference (t=4s)
    mainTimeline.to(
      ".titles > div",
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 2,
      },
      0
    );

    // 2. Stagger Out Titles: Make (t=1.2s), A (t=3.2s), Difference (t=5.2s)
    mainTimeline.to(
      ".titles > div",
      {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 2,
      },
      1.2
    );

    // 3. Stagger In Blocks from Left (-1600 -> 0) starting at t=4.2s
    mainTimeline.to(
      "li.block",
      {
        x: 0,
        duration: 3.0,
        ease: "expo.inOut",
        stagger: 0.16,
      },
      4.2
    );

    // 4. Stagger Out Blocks to Right (0 -> 1600) starting at t=6.8s
    mainTimeline.to(
      "li.block",
      {
        x: 1600,
        duration: 2.6,
        ease: "expo.inOut",
        stagger: 0.2,
      },
      6.8
    );

    // Function to reveal navbar once everything is completed
    const revealNavAfterDone = () => {
      gsap.to(".nav", {
        opacity: 1,
        y: 0,
        pointerEvents: "auto",
        duration: 0.8,
        ease: "power2.out",
      });
    };

    // 5. Anime.js Text Letter Reveal starting at 8.4s
    if (typeof anime !== "undefined") {
      animeAnimation = anime.timeline({
        complete: revealNavAfterDone,
      })
      .add({
        targets: ".header .letter",
        opacity: [0, 1],
        translateY: [80, 0],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 2000,
        delay: (el, i) => 8400 + 40 * i,
      })
      .add({
        targets: ".hero-subtext",
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutExpo",
        duration: 1200,
        offset: 8900,
      });
    } else {
      // GSAP fallback if anime.js is unavailable
      mainTimeline.to(
        ".header .letter",
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "expo.out",
          stagger: 0.04,
        },
        8.4
      );

      mainTimeline.to(
        ".hero-subtext",
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
        },
        8.9
      );

      mainTimeline.call(revealNavAfterDone, null, 10.5);
    }
  }

  // Initial Run
  runSequence();
});
