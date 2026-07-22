/**
 * Shared Cursor Dot Script for GSAP Experiments
 * Auto-injects cursor markup, styles, and smooth mouse tracking across pages.
 */
(function () {
  function initCursor() {
    // Inject Cursor Styles if not already present
    if (!document.getElementById("cursor-dot-styles")) {
      const style = document.createElement("style");
      style.id = "cursor-dot-styles";
      style.textContent = `
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          margin: -5px 0 0 -5px;
          background: #111;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          mix-blend-mode: difference;
        }
      `;
      document.head.appendChild(style);
    }

    // Inject Cursor Element if not present
    let dot = document.querySelector(".cursor-dot");
    if (!dot) {
      dot = document.createElement("div");
      dot.className = "cursor-dot";
      document.body.appendChild(dot);
    }

    // Smooth movement logic
    if (typeof gsap !== "undefined") {
      const moveX = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power2.out" });
      const moveY = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power2.out" });

      document.addEventListener("mousemove", (e) => {
        moveX(e.clientX);
        moveY(e.clientY);
      });

      // Hover scale behavior
      const attachHoverListeners = () => {
        document.querySelectorAll("a, button, .card, [data-hover]").forEach((el) => {
          if (el.dataset.cursorBound) return;
          el.dataset.cursorBound = "true";
          el.addEventListener("mouseenter", () => {
            gsap.to(dot, { scale: 3.5, duration: 0.2, ease: "power2.out", overwrite: "auto" });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
          });
        });
      };

      attachHoverListeners();
      // Observer for dynamically added elements
      const observer = new MutationObserver(attachHoverListeners);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCursor);
  } else {
    initCursor();
  }
})();
