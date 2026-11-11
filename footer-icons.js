import { createElement, Mail } from "lucide";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

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
