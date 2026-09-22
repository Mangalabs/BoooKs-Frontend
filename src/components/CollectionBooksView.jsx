import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import BookDetailPanel from "./BookDetailPanel";
import BookCard from "./BookCard";

function getAuthor(book) {
  return book.contributors?.[0]?.name || "Unknown author";
}

export default function CollectionBooksView({ collection, books, locations, locationFilter, viewMode, onBack, onAddBook, onAssignLocation, onDeleteBook, onUpdateBook }) {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleBooks = books.filter((book) => (!locationFilter || book.locationId === locationFilter) && `${book.title || ""} ${getAuthor(book)} ${book.isbn || ""}`.toLowerCase().includes(normalizedQuery));

  return <div className="books-view books-page-layout">
    <div className="books-main-column">
    <div className="page-intro-with-detail">
    <div className="content-heading">
      <div>
        <button className="back-button" onClick={onBack}><ArrowLeft size={15} /> Back to overview</button>
        <p className="eyebrow">Collection / {collection.name}</p>
        <h1>All books</h1>
        <p className="lede">Every story gathered in this collection.</p>
      </div>
      <button className="button button-primary" onClick={onAddBook}>Add a book</button>
    </div>
    </div>
    <div className="books-toolbar">
      <span>{visibleBooks.length} {visibleBooks.length === 1 ? "book" : "books"}</span>
      <label className="search-box"><Search size={17} /><span className="sr-only">Search books</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find in this collection..." /></label>
    </div>
    {visibleBooks.length ? <div className={`books-with-detail ${viewMode === "spines" ? "spines-view" : ""}`}><div className="book-grid all-books-grid">{visibleBooks.map((book) => <BookCard book={book} locations={locations} onAssignLocation={onAssignLocation} onSelect={setSelectedBook} viewMode={viewMode} key={book.id} />)}</div></div> : <div className="empty-state"><h2>{books.length ? "No books found" : "This collection is empty"}</h2><p>{books.length ? "Try another title, author, or ISBN." : "Add the first book and let the collection take shape."}</p></div>}
    </div>
    <BookDetailPanel book={selectedBook} locations={locations} onClose={() => setSelectedBook(null)} onAssignLocation={onAssignLocation} onDelete={onDeleteBook} onUpdate={onUpdateBook} />
  </div>;
}
