// Add a card by appending an entry here and creating its textFile in articles/.
// Array order is the order shown on the page. pages: [] opens directly in text view.
export const articles = [
  {
    id: "charli",
    title: "Wuthering Heights - Charli xcx",
    publication: "Tastemakers Magazine, Album Review",
    recognition: "2026 Tasties / Best Album Review Winner",
    summary:
      "Wuthering Heights stands out not because it's Charli’s strongest album, but because it demonstrates that she can work entirely inside someone else's world and still sound like no one other than herself.",
    color: "#d31c4dff",
    textFile: "articles/charli.html",
    pages: [
      {
        src: "assets/tastemakers/wuthering-heights_review copy.png",
        alt: "Charli xcx review, original print page",
      },
    ],
    issue: "https://www.tastemakersmag.com/issue/issue84",
  },
  {
    id: "feature",
    title: "Now Raving: Hollywood, Infected",
    publication: "Tastemakers Magazine, Feature",
    recognition: "2026 Tasties / Best Feature Nominee",
    summary:
      "Nothing else quite captures the present as accurately as electronic and techno music, and directors are noticing.",
    color: "#4DC141",
    textFile: "articles/feature.html",
    pages: [
      {
        src: "assets/tastemakers/now-raving1.webp",
        alt: "Electronic music in film scoring feature, page 1",
      },
      {
        src: "assets/tastemakers/nowraving2.webp",
        alt: "Electronic music in film scoring feature, page 2",
      },
    ],
    issue: "https://www.tastemakersmag.com/issue/issue84",
    credit: "Design by Nina Roshe",
  },
  {
    id: "mozart",
    title: "Mozart’s effect on dissonance",
    publication: "NU Sci Magazine, Feature",
    recognition: "Psychology, Neuroscience, and Culture",
    summary:
      "How pleasant music may help us tolerate uncertainty when the pressure is on.",
    color: "#AF79D2",
    textFile: "articles/mozart.html",
    pages: [],
    url: "https://www.nuscimagazine.com/mozarts-effect-on-dissonance",
    linkLabel: "Read on nuscimagazine.com",
  },
];
