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
  .fill("#ffffff02");
cover.call(grain);
fill(cover, grain.url());
const defs = cover.append("defs");
fill(
  cover,
  gradient(
    defs,
    "cover-light",
    [
      ["0%", "white", 0.005],
      ["45%", "white", 0],
      ["100%", "black", 0.005],
    ],
    { x1: "0%", y1: "32%", x2: "100%", y2: "68%" },
  ),
);
fill(
  cover,
  gradient(defs, "spine-light", [
    ["10%", "white", 0.03],
    ["20%", "#7e7e7e", 0.02],
    ["35%", "#7c7c7c", 0.02],
  ]),
  20,
);
fill(cover, "#0000000a", 1).attr("x", 19);
publish("cover-texture", cover);
