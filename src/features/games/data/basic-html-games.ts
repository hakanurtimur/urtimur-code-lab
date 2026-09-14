import type { LessonGame } from "../types";

export const basicHtmlGames: LessonGame[] = [
  {
    id: "w1-tag-attribute-repair",
    weekId: "basic-html-week-1",
    weekOrder: 1,
    title: "Tag & Attribute Tamircisi",
    eyebrow: "Hafta 1 oyunu",
    description: "Elementleri onları tamamlayan attribute veya anlamlarla eşleştir.",
    tone: "violet",
    kind: "match",
    pairs: [
      { id: "p1", left: "<img>", right: "src + alt" },
      { id: "p2", left: "<a>", right: "href" },
      { id: "p3", left: "<h1>", right: "ana başlık" },
      { id: "p4", left: "<p>", right: "paragraf" },
    ],
  },
  {
    id: "w2-boilerplate-puzzle",
    weekId: "basic-html-week-2",
    weekOrder: 2,
    title: "Boilerplate Puzzle",
    eyebrow: "Hafta 2 oyunu",
    description: "Bir HTML belgesinin temel parçalarını doğru sıraya diz.",
    tone: "sky",
    kind: "order",
    items: ["<!DOCTYPE html>", "<html lang=\"tr\">", "<head>", "<title>…</title>", "</head>", "<body>", "</body>", "</html>"],
  },
  {
    id: "w3-nesting-tower",
    weekId: "basic-html-week-3",
    weekOrder: 3,
    title: "Nesting Kulesi",
    eyebrow: "Hafta 3 oyunu",
    description: "Parent–child ilişkisini bozmadan elementleri doğru iç içe sıraya koy.",
    tone: "peach",
    kind: "order",
    items: ["<main>", "<section>", "<figure>", "<img>", "<figcaption>", "</figure>", "</section>", "</main>"],
  },
  {
    id: "w4-document-skeleton",
    weekId: "basic-html-week-4",
    weekOrder: 4,
    title: "Belge İskeleti Kur",
    eyebrow: "Hafta 4 oyunu",
    description: "Tam belge yapısını ve içerik bölgelerini doğru sırada kur.",
    tone: "mint",
    kind: "order",
    items: ["<!DOCTYPE html>", "<html>", "<head>", "<meta charset=\"UTF-8\">", "<title>Bilim Fuarı</title>", "</head>", "<body>", "<main>…</main>", "</body>", "</html>"],
  },
  {
    id: "w5-seo-detective",
    weekId: "basic-html-week-5",
    weekOrder: 5,
    title: "SEO Dedektifi",
    eyebrow: "Hafta 5 oyunu",
    description: "Arama motorlarının sayfayı anlamasına yardım eden HTML ipuçlarını bul.",
    tone: "pink",
    kind: "quiz",
    questions: [
      { id: "q1", prompt: "Arama sonucundaki kısa açıklamaya en çok hangi bilgi yardım eder?", options: ["meta description", "button", "iframe"], answer: "meta description", explanation: "Meta description sayfanın kısa özetini taşır." },
      { id: "q2", prompt: "Bir sayfanın sekme başlığını hangi element belirler?", options: ["title", "h1", "strong"], answer: "title", explanation: "title head içinde bulunur ve tarayıcı sekmesinde görünür." },
      { id: "q3", prompt: "Aynı tür kartları birlikte stillendirmek için hangisi daha uygundur?", options: ["class", "id", "src"], answer: "class", explanation: "Class tekrar kullanılabilir; id benzersiz olmalıdır." },
    ],
  },
  {
    id: "w6-media-control-room",
    weekId: "basic-html-week-6",
    weekOrder: 6,
    title: "Medya Kontrol Merkezi",
    eyebrow: "Hafta 6 oyunu",
    description: "Audio/video elementlerini doğru kontrollerle eşleştir.",
    tone: "yellow",
    kind: "match",
    pairs: [
      { id: "m1", left: "controls", right: "oynatma düğmelerini gösterir" },
      { id: "m2", left: "muted", right: "sesi başlangıçta kapatır" },
      { id: "m3", left: "loop", right: "medyayı tekrar oynatır" },
      { id: "m4", left: "src", right: "medya kaynağını belirtir" },
    ],
  },
  {
    id: "w7-svg-lab",
    weekId: "basic-html-week-7",
    weekOrder: 7,
    title: "SVG Şekil Laboratuvarı",
    eyebrow: "Hafta 7 oyunu",
    description: "SVG, raster görsel ve medya fallback kavramlarını ayırt et.",
    tone: "violet",
    kind: "quiz",
    questions: [
      { id: "s1", prompt: "Bir ikon farklı boyutlarda keskin kalacaksa hangi format güçlü bir seçimdir?", options: ["SVG", "JPG", "TXT"], answer: "SVG", explanation: "SVG vektördür ve ölçeklenirken keskinliğini korur." },
      { id: "s2", prompt: "Video açılmadan önce gösterilecek görsel hangi attribute ile verilir?", options: ["poster", "target", "lang"], answer: "poster", explanation: "poster video için kapak görselidir." },
      { id: "s3", prompt: "Birden fazla video formatı sunmak için hangi element kullanılabilir?", options: ["source", "strong", "nav"], answer: "source", explanation: "source birden fazla medya kaynağı tanımlamaya yardım eder." },
    ],
  },
  {
    id: "w8-path-maze",
    weekId: "basic-html-week-8",
    weekOrder: 8,
    title: "Path Labirenti",
    eyebrow: "Hafta 8 oyunu",
    description: "Relative ve absolute path ipuçlarıyla doğru dosyaya ulaş.",
    tone: "sky",
    kind: "quiz",
    questions: [
      { id: "p1", prompt: "Aynı klasördeki about.html dosyasına hangisi gider?", options: ["./about.html", "../about.html", "https://about.html"], answer: "./about.html", explanation: "./ mevcut klasörü temsil eder." },
      { id: "p2", prompt: "Bir üst klasördeki index.html dosyasına hangisi gider?", options: ["../index.html", "./index.html", "/./index.html"], answer: "../index.html", explanation: "../ bir üst klasöre çıkar." },
      { id: "p3", prompt: "Tam web adresi verilen bir bağlantı hangi türdür?", options: ["absolute URL", "relative path", "fragment only"], answer: "absolute URL", explanation: "Protokol ve domain içeren adres absolute URL'dir." },
    ],
  },
];

export function getGameById(gameId: string) {
  return basicHtmlGames.find((game) => game.id === gameId) ?? null;
}

export function getGamesForWeek(weekId: string) {
  return basicHtmlGames.filter((game) => game.weekId === weekId);
}
