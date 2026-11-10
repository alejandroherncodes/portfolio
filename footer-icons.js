import { createElement, Mail, Navigation2 } from "lucide";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const plane = document.querySelector(".footer-plane");
const footer = document.querySelector("footer");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

plane.append(
  createElement(Navigation2, { width: 21, height: 21, "stroke-width": 1.5 }),
);
document.querySelector("#footer-email").append(
  createElement(Mail, {
    width: 19,
    height: 19,
    "stroke-width": 1.5,
    "aria-hidden": "true",
  }),
);
const [width, height, , , path] = faLinkedinIn.icon;
document.querySelector("#footer-linkedin").append(
  createElement([["path", { d: path }]], {
    width: 17,
    height: 17,
    viewBox: `0 0 ${width} ${height}`,
    fill: "currentColor",
    stroke: "none",
    "aria-hidden": "true",
  }),
);
const reset = () => {
  plane.style.transform = "";
};
const clamp = (value) => Math.max(-1, Math.min(1, value));

footer.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const bounds = plane.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left - bounds.width / 2) / 100);
  const y = clamp((event.clientY - bounds.top - bounds.height / 2) / 80);
  plane.style.transform = `translate(${x * 3}px, ${y * 2}px) rotate(${x * 7}deg)`;
});
footer.addEventListener("pointerleave", reset);
window.addEventListener("blur", reset);
reducedMotion.addEventListener("change", reset);
finePointer.addEventListener("change", reset);
