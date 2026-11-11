import { articles } from "./articles.js";
import { coverMarkup } from "./book-covers.js";
import "./assets/vendor/book-texture.js";
import "./assets/vendor/footer-icons.js";

const reader = document.querySelector("#print-reader");
const book = document.querySelector("#reader-book");
const stage = document.querySelector(".reader-stage");
const textToggle = document.querySelector("#reader-text-toggle");
const textView = document.querySelector("#reader-text");
const embedView = document.querySelector("#reader-embed");
const embedFrame = document.querySelector("#reader-embed-frame");
new ResizeObserver(([entry]) => {
  embedView.style.transform = `scale(${entry.contentRect.width / 1356})`;
}).observe(embedFrame);
let selectedBook;

function setTextView(value) {
  embedFrame.hidden = true;
  stage.classList.remove("is-embed");
  textView.hidden = !value;
  book.hidden = value;
  stage.classList.toggle("is-text", value);
  textToggle.setAttribute("aria-pressed", String(value));
  textToggle.textContent = value ? "Print view" : "Text only";
  stage.setAttribute("aria-label", value ? "Article text" : "Print pages");
  stage.scrollTo(0, 0);
}

renderCards();

document.querySelectorAll("[data-article]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedBook = button;
    button.closest(".story").classList.add("is-selected");
    const article = articles.find((item) => item.id === button.dataset.article);
    document.querySelector("#reader-summary").innerHTML = article.summary;
    document.querySelector(".reader-summary").open = false;
    const credit = document.querySelector("#reader-credit");
    credit.textContent = article.credit || "";
    credit.hidden = !article.credit;
    if (!article.textFile) {
      textRequest?.abort();
      textView.replaceChildren();
    } else {
      loadArticleText(article);
    }
    reader.setAttribute("aria-label", article.title + " — article reader");
    textToggle.hidden = !article.textFile || article.pages.length === 0;
    book.classList.toggle("is-document", article.layout === "document");
    book.classList.toggle(
      "is-spread",
      article.pages.length > 1 && article.layout !== "document",
    );
    book.replaceChildren(
      ...article.pages.map((source) => {
        const image = document.createElement("img");
        image.alt = source.alt;
        if (article.layout === "document") image.loading = "lazy";
        image.addEventListener("load", () => {
          image.style.setProperty(
            "--page-ratio",
            image.naturalWidth / image.naturalHeight,
          );
        });
        image.addEventListener("error", () => {
          const message = document.createElement("p");
          message.textContent =
            "This page could not load. Close the reader and try again.";
          image.replaceWith(message);
        });
        image.src = source.src;
        return image;
      }),
    );
    const issue = document.querySelector("#reader-issue");
    const articleLink =
      article.bibliography ||
      article.embed ||
      article.pdf ||
      article.issue ||
      article.url;
    issue.hidden = !articleLink;
    issue.textContent = article.issue
      ? "Read the full issue"
      : article.linkLabel || "Read original article";
    if (articleLink) issue.href = articleLink;
    reader.showModal();
    setTextView(!article.embed && article.pages.length === 0);
    if (article.embed) {
      book.hidden = true;
      embedView.title = article.title;
      embedView.src = article.embed;
      embedFrame.hidden = false;
      stage.classList.add("is-embed");
      stage.setAttribute(
        "aria-label",
        article.title + " — interactive project",
      );
    }
  });
});

textToggle.addEventListener("click", () => setTextView(textView.hidden));
document
  .querySelector("#reader-close")
  .addEventListener("click", () => reader.close());

function renderCards() {
  const cards = document.querySelector("#writing-cards");
  const fragment = document.createDocumentFragment();
  articles.forEach((article) => {
    const card = document.createElement("article");
    card.className = "story";
    card.dataset.cover = article.id;
    card.innerHTML = `<div class="cover-art" aria-hidden="true">${coverMarkup(article.id)}</div>
      <h3 class="cover-action"><button class="story-open" aria-haspopup="dialog"><span class="visually-hidden"></span></button></h3>`;
    const button = card.querySelector("button");
    button.dataset.article = article.id;
    button.querySelector("span").textContent = article.title;
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

let textRequest;

async function loadArticleText(article) {
  textRequest?.abort();
  const request = new AbortController();
  textRequest = request;
  const loading = document.createElement("p");
  loading.setAttribute("role", "status");
  loading.textContent = "Loading article…";
  textView.replaceChildren(loading);
  try {
    const response = await fetch(article.textFile, {
      signal: request.signal,
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Article request failed: ${response.status}`);
    const html = await response.text();
    if (request.signal.aborted) return;
    const content = document.createElement("template");
    content.innerHTML = html;
    textView.replaceChildren(content.content.cloneNode(true));
  } catch (error) {
    if (request.signal.aborted) return;
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = "The article text could not load.";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => loadArticleText(article));
    textView.replaceChildren(message, retry);
  }
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
  textRequest?.abort();
  embedView.removeAttribute("src");
});
