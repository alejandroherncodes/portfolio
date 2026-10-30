import { articles } from "./articles.js";

document.querySelector("#year").textContent = new Date().getFullYear();

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
    card.style.backgroundColor = article.color;
    if (article.textColor) card.style.color = article.textColor;
    card.innerHTML = `
      <div class="story-heading">
        <div class="story-meta"></div>
        <span class="recognition"></span>
      </div>
      <h3><button class="story-open" aria-haspopup="dialog"></button></h3>
      <p></p>
      <div class="story-bottom"><span class="story-number">Read →</span></div>
    `;
    card.querySelector(".story-meta").textContent = article.publication;
    const recognition = card.querySelector(".recognition");
    recognition.textContent = article.recognition || "";
    recognition.hidden = !article.recognition;
    const button = card.querySelector("button");
    button.dataset.article = article.id;
    button.setAttribute("aria-label", article.title);
    (article.titleLines || [article.title]).forEach((text) => {
      const line = document.createElement("span");
      if (article.titleLines) line.className = "title-line";
      if (article.italicTitle && text.startsWith(article.italicTitle)) {
        const emphasis = document.createElement("em");
        emphasis.textContent = article.italicTitle;
        line.append(
          emphasis,
          document.createTextNode(text.slice(article.italicTitle.length)),
        );
      } else {
        line.textContent = text;
      }
      button.append(line);
    });
    if (article.review) {
      const callout = document.createElement("span");
      callout.className = "story-review";
      const label = document.createElement("strong");
      label.className = "story-review-label";
      label.textContent = "REVIEW:";
      const details = document.createElement("span");
      details.className = "story-review-details";
      const album = document.createElement("em");
      album.textContent = article.review.title;
      const artist = document.createElement("span");
      artist.className = "story-review-artist";
      artist.textContent = `by ${article.review.artist}`;
      details.append(album, artist);
      callout.append(label, details);
      card.insertBefore(callout, card.querySelector("p"));
    } else if (article.subtitle) {
      const subtitle = document.createElement("span");
      subtitle.className = "story-subtitle";
      const lines = Array.isArray(article.subtitle)
        ? article.subtitle
        : [article.subtitle];
      lines.forEach((line, index) => {
        if (index > 0) subtitle.append(document.createElement("br"));
        subtitle.append(document.createTextNode(line));
      });
      button.append(subtitle);
    }
    card.querySelector("p").textContent = article.summary;
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
