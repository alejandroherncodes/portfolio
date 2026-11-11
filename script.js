import { articles } from "./articles.js?v=20261111-3";
import { coverMarkup } from "./book-covers.js?v=20261111-2";

const reader = document.querySelector("#print-reader");
const embedView = document.querySelector("#reader-embed");
const embedFrame = document.querySelector("#reader-embed-frame");
new ResizeObserver(([entry]) => {
  embedView.style.transform = `scale(${entry.contentRect.width / 1356})`;
}).observe(embedFrame);
let selectedBook;

renderCards();

// Decorative modules must not prevent the writing samples from appearing.
for (const path of [
  "./assets/vendor/book-texture.js?v=20261111-3",
  "./assets/vendor/footer-icons.js?v=20261111-2",
]) {
  import(path).catch((error) => console.warn("Optional decoration could not load:", error));
}

document.querySelectorAll("[data-article]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = articles.find((article) => article.id === button.dataset.article);
    if (item.document) {
      openDocumentReader(item, button);
      return;
    }
    if (item.textFile) {
      openTextReader(item, button);
      return;
    }
    if (item.embed) openEmbedReader(item, button);
  });
});

function openEmbedReader(article, button) {
  selectedBook = button;
  button.closest(".story").classList.add("is-selected");
  reader.setAttribute("aria-label", article.title + " — interactive project");
  const issue = document.querySelector("#reader-issue");
  issue.href = article.bibliography;
  issue.textContent = article.linkLabel;
  embedView.title = article.title;
  embedView.src = article.embed;
  reader.showModal();
}
document.querySelector("#reader-close").addEventListener("click", () => reader.close());

function renderCards() {
  const cards = document.querySelector("#writing-cards");
  const fragment = document.createDocumentFragment();
  articles.forEach((article) => {
    const card = document.createElement("article");
    card.className = "story";
    card.dataset.cover = article.id;
    card.innerHTML = `<div class="cover-art" aria-hidden="true">${coverMarkup(article.id)}</div>
      <h3 class="cover-action"><button class="story-open" aria-haspopup="dialog"><span class="visually-hidden"></span></button></h3>`;
    const button = card.querySelector(".story-open");
    button.dataset.article = article.id;
    button.querySelector("span").textContent = article.title;
    const blurb = document.createElement("p");
    blurb.className = "book-blurb";
    blurb.id = `blurb-${article.id}`;
    blurb.setAttribute("role", "tooltip");
    blurb.innerHTML = article.summary;
    button.setAttribute("aria-describedby", blurb.id);
    card.append(blurb);
    if (article.awardSticker) {
      const slot = card.querySelector("[data-award-slot]");
      if (slot) {
        const sticker = document.createElement("img");
        sticker.src = article.awardSticker;
        sticker.alt = "";
        slot.replaceChildren(sticker);
        slot.classList.add("has-sticker");
      }
    }
    fragment.append(card);
  });
  cards.replaceChildren(fragment);
}

reader.addEventListener("close", () => {
  const cover = selectedBook?.closest(".story");
  selectedBook?.blur();
  selectedBook = undefined;
  // Paint the lifted cover after the dialog disappears before settling it.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (selectedBook?.closest(".story") !== cover) {
        cover?.classList.remove("is-selected");
      }
    });
  });
  embedView.removeAttribute("src");
});

const textReader = document.querySelector("#text-reader");
const textContent = document.querySelector("#text-reader-content");
const textScroll = document.querySelector("#text-reader-scroll");
const printEdition = document.querySelector("#print-edition");
const printPages = document.querySelector("#print-pages");
const printButton = document.querySelector("#text-reader-print");
let activeArticle;
let activeCover;
let articleRequest;

function openTextReader(article, button) {
  activeArticle = article;
  activeCover = button;
  button.closest(".story").classList.add("is-selected");
  textReader.setAttribute("aria-label", article.title + " — article reader");
  const issueInToolbar = article.id === "charli" || article.id === "feature";
  const issueLink = document.querySelector("#text-reader-issue");
  issueLink.hidden = !issueInToolbar;
  if (issueInToolbar) issueLink.href = article.issue;
  else issueLink.removeAttribute("href");
  printButton.hidden = article.id === "charli" || !article.pages.length;
  const source = document.querySelector("#text-reader-source");
  const url = article.bibliography || article.issue || article.url;
  source.hidden = issueInToolbar || !url;
  if (url) source.href = url;
  else source.removeAttribute("href");
  source.textContent = article.linkLabel || "Read original article ➜";
  loadTextReader(article);
  textReader.showModal();
  textScroll.scrollTo(0, 0);
}

async function loadTextReader(article) {
  articleRequest?.abort();
  const request = new AbortController();
  articleRequest = request;
  const loading = document.createElement("p");
  loading.setAttribute("role", "status");
  loading.textContent = "Loading article…";
  textContent.replaceChildren(loading);
  try {
    const response = await fetch(article.textFile, { signal: request.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`Article request failed: ${response.status}`);
    const html = await response.text();
    if (request.signal.aborted) return;
    const template = document.createElement("template");
    template.innerHTML = html;
    textContent.replaceChildren(template.content.cloneNode(true));
  } catch (error) {
    if (request.signal.aborted) return;
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = "The article text could not load.";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => loadTextReader(article));
    textContent.replaceChildren(message, retry);
  }
}

function openPrintEdition() {
  if (!activeArticle?.pages.length || printEdition.open) return;
  printPages.classList.toggle("is-spread", activeArticle.id === "feature");
  document.querySelector("#print-edition-title").textContent = activeArticle.title;
  const credit = document.querySelector("#print-edition-credit");
  credit.textContent = activeArticle.credit || "";
  credit.hidden = !activeArticle.credit;
  printPages.replaceChildren(...activeArticle.pages.map((page, index) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = page.src;
    image.alt = page.alt;
    image.loading = index ? "lazy" : "eager";
    image.addEventListener("error", () => {
      const message = document.createElement("p");
      message.textContent = "This print page could not load. Return to the article to keep reading.";
      image.replaceWith(message);
    });
    const caption = document.createElement("figcaption");
    caption.textContent = `${index + 1} / ${activeArticle.pages.length}`;
    figure.append(image, caption);
    return figure;
  }));
  printEdition.showModal();
  printEdition.scrollTo(0, 0);
}
printButton.addEventListener("click", openPrintEdition);
document.querySelector("#print-edition-close").addEventListener("click", () => printEdition.close());
printEdition.addEventListener("close", () => printPages.replaceChildren());
document.querySelector("#text-reader-close").addEventListener("click", () => textReader.close());
textReader.addEventListener("close", () => {
  articleRequest?.abort();
  if (printEdition.open) printEdition.close();
  activeCover?.closest(".story").classList.remove("is-selected");
  activeCover = undefined;
  activeArticle = undefined;
});

const documentReader = document.querySelector("#document-reader");
const documentFrame = document.querySelector("#document-reader-frame");
let documentCover;

function openDocumentReader(article, button) {
  documentCover = button;
  button.closest(".story").classList.add("is-selected");
  documentReader.setAttribute("aria-label", article.title + " — document viewer");
  documentFrame.title = article.title + " — document viewer";
  documentFrame.src = article.document + "#toolbar=0&navpanes=0&view=FitH";
  documentReader.showModal();
}
document.querySelector("#document-reader-close").addEventListener("click", () => documentReader.close());
documentReader.addEventListener("close", () => {
  documentFrame.removeAttribute("src");
  documentCover?.closest(".story").classList.remove("is-selected");
  documentCover = undefined;
});
