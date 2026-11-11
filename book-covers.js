// Cover art is decorative; script.js supplies an accessible title and reader button.
const transpositionsLetters = [..."TRANSPOSITIONS"].map((letter, index, letters) => {
  const t = index / (letters.length - 1);
  const wave = Math.sin(Math.PI * t);
  const x = 24 + t * 312;
  const y = 115 + wave * 8;
  const angle = Math.cos(Math.PI * t) * 4;
  const stretch = 1.8 - wave * 0.55;
  return `<text transform="translate(${x} ${y}) rotate(${angle}) scale(1 ${stretch})" text-anchor="middle" textLength="23" lengthAdjust="spacingAndGlyphs">${letter}</text>`;
}).join("");

const covers = {
  charli: `
    <img class="cover-photo charli-photo" src="assets/img/wuthering heights (2026)_screencap.jpeg" alt="">
    <div class="charli-title">CHARLI<br>GOES<br>GOTHIC</div>
    <div class="charli-description"><em>Wuthering Heights</em><br>by Charli xcx</div>
    <div class="award-slot award-slot--winner" data-award-slot>
      <span>2026 Tasties</span><b>Best Album<br>Review</b><span>Winner</span>
    </div>
    <div class="cover-imprint">Album Review · Tastemakers Magazine</div>`,
  feature: `
    <img class="cover-photo rave-photo" src="assets/img/now_raving-img.jpeg" alt="">
    <div class="cover-kicker">Feature · Tastemakers Magazine</div>
    <div class="raving-title"><span>NOW<br>RAVING:</span><span>HOLLYWOOD,<br>INFECTED</span></div>
    <div class="award-slot award-slot--nominee"><span>TASTIES AWARDS</span><span>SPRING 2026</span><b>NOMINEE</b><small>BEST FEATURE</small></div>`,
  mozart: `
    <img class="mozart-pattern mozart-pattern--one" src="assets/img/mozart_img-1.jpeg" alt="">
    <img class="mozart-pattern mozart-pattern--two" src="assets/img/mozart_img-2.jpeg" alt="">
    <div class="cover-kicker">Feature · NU Sci Magazine</div>
    <div class="mozart-title">Mozart’s<br>effect on<br>dissonance</div>
    <div class="mozart-category"><span>psychology,</span><span>neuroscience,</span><span>&amp; culture</span></div>`,
  adela: `
    <img class="cover-photo adela-photo" src="assets/img/adela_img.jpeg" alt="">
    <div class="adela-title"><span class="adela-name">ADÉL<span>A</span></span><span>ISN’T HERE</span><span>TO</span><span>APOLOGIZE</span></div>
    <div class="adela-description"><em>The Provocateur</em><br>by ADÉLA</div>
    <div class="cover-imprint">Album Review · MUSC2340</div>`,
  screenFinal: `
    <img class="research-art repetition-art" src="assets/img/repetition_img2.jpeg" alt="">
    <div class="cover-kicker research-kicker">Academic Research · MUSC2351</div>
    <div class="mozart-category research-category"><span>musicology,</span><span>film,</span><span>&amp; culture</span></div>
    <div class="repetition-title-block">
    <div class="repetition-stack"><div class="repetition-fade"><span>REPETITION</span><span>REPETITION</span></div><span class="repetition-solid">REPETITION</span></div>
    <div class="repetition-over">over</div>
    <div class="repetition-ending">
    <div class="repetition-resolution">resolution</div>
    <div class="repetition-subtitle">Electronic Film Scores<br>and Atemporal Cinema</div>
    </div>
    </div>`,
  ddjdsFinal: `
    <img class="research-art transpositions-photo" src="assets/img/transpositions-img.jpeg" alt="">
    <div class="cover-kicker research-kicker">Interactive Research · MUSC2340</div>
    <div class="mozart-category research-category"><span>musicology,</span><span>gender identity,</span><span>&amp; culture</span></div>
    <div class="transpositions-type-block">
    <svg class="transpositions-title" viewBox="0 0 360 140" aria-hidden="true">
      <g class="transpositions-lettering" fill="#192a48" stroke="#f0eedf" stroke-width="2" paint-order="stroke fill" font-family="Times New Roman, Times, serif" font-size="76">${transpositionsLetters}</g>
    </svg>
    <div class="transpositions-subtitle">The Way Sound Bends</div>
    </div>`,

};

export function coverMarkup(id) {
  return covers[id] || "";
}
