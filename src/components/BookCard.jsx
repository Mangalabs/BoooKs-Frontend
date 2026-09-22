import { getSpineStyle } from "./bookDisplay";

export default function BookCard({ book, locations = [], onAssignLocation, onSelect, viewMode = "covers" }) {
  const spineMode = viewMode === "spines";

  function selectBook() {
    onSelect(book);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") selectBook();
  }

  return <article className="book-card" onClick={selectBook} onKeyDown={handleKeyDown} tabIndex="0" role="button">
    <div className={`book-cover ${spineMode ? "book-spine" : ""}`} style={spineMode ? getSpineStyle(book) : book.coverUrl ? { backgroundImage: `url(${book.coverUrl})` } : {}}>
      <span>{spineMode ? book.title || "Untitled" : book.coverUrl ? "" : "No cover yet"}</span>
    </div>
    <div className="book-info">
      <h3>{book.title || "Untitled book"}</h3>
      <p>{book.contributors?.[0]?.name || "Unknown author"}</p>
      <select className="select-control book-location-select" value={book.locationId || ""} onClick={(event) => event.stopPropagation()} onChange={(event) => onAssignLocation(book, event.target.value || null)} aria-label={`Location for ${book.title || "book"}`}><option value="">No location</option>{locations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select>
    </div>
  </article>;
}
