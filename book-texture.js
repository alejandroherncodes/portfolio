import textures from "textures";
import { select } from "d3-selection";

const theme = document.documentElement.style;
const surface = (width = "100%", height = "100%") =>
  select(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height);
const fill = (svg, paint, width = "100%") =>
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", "100%")
    .attr("fill", paint);
const publish = (name, svg) =>
  theme.setProperty(
    `--book-${name}`,
    `url("data:image/svg+xml,${encodeURIComponent(svg.node().outerHTML)}")`,
  );

function gradient(defs, id, stops, direction = {}) {
  const gradient = defs.append("linearGradient").attr("id", id);
  for (const [name, value] of Object.entries(direction))
    gradient.attr(name, value);
  for (const [offset, color, opacity] of stops) {
    gradient
      .append("stop")
      .attr("offset", offset)
      .attr("stop-color", color)
      .attr("stop-opacity", opacity);
  }
  return `url(#${id})`;
}

// Transparent cover artwork keeps each book's own background color visible.
const cover = surface();
const grain = textures
  .circles()
  .id("book-grain")
  .size(3)
  .radius(0.2)
  .fill("#ffffff0a");
cover.call(grain);
fill(cover, grain.url());
const defs = cover.append("defs");
fill(
  cover,
  gradient(
    defs,
    "cover-light",
    [
      ["0%", "white", 1 / 15],
      ["45%", "white", 0],
      ["100%", "black", 1 / 15],
    ],
    { x1: "0%", y1: "32%", x2: "100%", y2: "68%" },
  ),
);
fill(
  cover,
  gradient(defs, "spine-light", [
    ["10%", "white", 2 / 15],
    ["20%", "#7e7e7e", 0.133],
    ["35%", "#7c7c7c", 0.133],
  ]),
  20,
);
fill(cover, "#0002", 1).attr("x", 19);
publish("cover-texture", cover);

const svg = surface(2, 2);
const pages = textures
  .lines()
  .id("book-pages")
  .size(2)
  .orientation("vertical")
  .strokeWidth(1)
  .stroke("#ccc6b8")
  .background("#eee9dc")
  .shapeRendering("crispEdges");

svg.call(pages);
fill(svg, pages.url());
publish("page-texture", svg);

// Share the shadow geometry while CSS interpolates the lift/put-down animation.
const shadow = (x, y, blur, farX, farY, farBlur, opacity = 2) =>
  `2px 3px 0 #0002, ${x}px ${y}px ${blur}px #000${opacity}, ${farX}px ${farY}px ${farBlur}px #0001`;
for (const [state, values] of Object.entries({
  rest: [9, 12, 15, 18, 24, 32],
  hover: [12, 20, 24, 20, 32, 40],
  selected: [14, 26, 30, 24, 38, 46, 3],
}))
  theme.setProperty(`--book-shadow-${state}`, shadow(...values));
theme.setProperty("--book-edge-shadow", "1px 0 0 #0003");
