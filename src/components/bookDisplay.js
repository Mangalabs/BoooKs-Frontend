const spineColors = [
  { background: "#9f4f3c", text: "#fff8ed" },
  { background: "#3f674c", text: "#f5f0df" },
  { background: "#565e7b", text: "#fff8ed" },
  { background: "#c19a4d", text: "#2e382d" },
  { background: "#76546d", text: "#fff8ed" },
  { background: "#3e7372", text: "#fff8ed" },
];

function getBookSeed(book) {
  return `${book.id || ""}${book.isbn || ""}${book.title || ""}`.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function getSpineStyle(book) {
  const seed = getBookSeed(book);
  const pages = Number(book.numberOfPages);
  const basePages = Number.isFinite(pages) && pages > 0 ? pages : 240;
  const height = 185 + (seed % 46);
  const width = Math.min(82, Math.max(42, Math.round(basePages * 0.16)));
  const color = spineColors[seed % spineColors.length];

  return {
    "--spine-width": `${width}px`,
    "--spine-height": `${height}px`,
    "--spine-color": color.background,
    "--spine-text": color.text,
  };
}
