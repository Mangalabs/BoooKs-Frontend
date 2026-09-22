import { useEffect, useState } from "react";
import { BookOpen, Leaf, LogOut, Plus, Search } from "lucide-react";
import { api } from "../api";
import AddBookModal from "./AddBookModal";
import CollectionModal from "./CollectionModal";
import OwnersModal from "./OwnersModal";
import ThemeMenu from "./ThemeMenu";
import CollectionBooksView from "./CollectionBooksView";
import AllCollectionsView from "./AllCollectionsView";
import LocationModal from "./LocationModal";
import BookDetailPanel from "./BookDetailPanel";
import BookViewToggle from "./BookViewToggle";
import citations from "../data/citations.json";
import LocationSidebar from "./LocationSidebar";
import CollectionPicker from "./CollectionPicker";
import BookCard from "./BookCard";
import ThemeDecorations from "./ThemeDecorations";

function getCitationForLoad() {
  const previousIndex = Number.parseInt(localStorage.getItem("boooks-citation-index"), 10);
  let nextIndex = Math.floor(Math.random() * citations.length);
  if (citations.length > 1 && Number.isInteger(previousIndex) && nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % citations.length;
  }
  localStorage.setItem("boooks-citation-index", String(nextIndex));
  return citations[nextIndex];
}

export default function AppShell({ theme, onThemeChange, bookView, onBookViewChange, user, onSignOut }) {
  const [collections, setCollections] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [books, setBooks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [collectionModal, setCollectionModal] = useState(null);
  const [ownersModal, setOwnersModal] = useState(null);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [locationModal, setLocationModal] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookQuery, setBookQuery] = useState("");
  const [citation] = useState(getCitationForLoad);

  useEffect(() => {
    api.collections().then((items) => {
      setCollections(items);
      setActiveId(items[0]?.id || "");
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeId) {
      setBooks([]);
      setLocations([]);
      return;
    }
    Promise.all([api.books(activeId), api.locations(activeId)])
      .then(([bookItems, locationItems]) => { setBooks(bookItems); setLocations(locationItems); })
      .catch((requestError) => setError(requestError.message));
  }, [activeId]);

  useEffect(() => {
    setShowAllBooks(false);
    setShowAllCollections(false);
    setLocationFilter("");
    setSelectedBook(null);
    setBookQuery("");
  }, [activeId]);

  async function deleteCollection(collection) {
    if (!window.confirm(`Delete “${collection.name}” and all of its books?`)) return;
    setError("");
    try {
      await api.deleteCollection(collection.id);
      const remaining = collections.filter((item) => item.id !== collection.id);
      setCollections(remaining);
      setActiveId(remaining[0]?.id || "");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function saveCollection(saved) {
    setCollections((current) => {
      const exists = current.some((collection) => collection.id === saved.id);
      return exists ? current.map((collection) => collection.id === saved.id ? saved : collection) : [...current, saved];
    });
    setActiveId(saved.id);
  }

  function saveLocation(saved) {
    setLocations((current) => {
      const exists = current.some((location) => location.id === saved.id);
      return exists ? current.map((location) => location.id === saved.id ? saved : location) : [...current, saved].sort((left, right) => left.name.localeCompare(right.name));
    });
  }

  async function deleteLocation(location) {
    if (!window.confirm(`Delete location “${location.name}”? Books assigned here will become unassigned.`)) return;
    try {
      await api.deleteLocation(location.id);
      setLocations((current) => current.filter((item) => item.id !== location.id));
      setBooks((current) => current.map((book) => book.locationId === location.id ? { ...book, locationId: null, locationName: null } : book));
      if (locationFilter === location.id) setLocationFilter("");
    } catch (requestError) { setError(requestError.message); }
  }

  async function assignLocation(book, locationId) {
    try {
      const updatedBook = await api.assignLocation(activeId, book, locationId);
      setBooks((current) => current.map((item) => item.id === book.id ? updatedBook : item));
      setSelectedBook((current) => current?.id === book.id ? updatedBook : current);
    } catch (requestError) { setError(requestError.message); }
  }

  async function deleteBook(book) {
    await api.deleteBook(activeId, book);
    setBooks((current) => current.filter((item) => item.id !== book.id));
    setSelectedBook((current) => current?.id === book.id ? null : current);
  }

  function updateBook(updatedBook) {
    setBooks((current) => current.map((item) => item.id === updatedBook.id ? updatedBook : item));
    setSelectedBook((current) => current?.id === updatedBook.id ? updatedBook : current);
  }

  const activeCollection = collections.find((collection) => collection.id === activeId);
  const initials = user?.name?.slice(0, 1).toUpperCase() || "R";
  const normalizedBookQuery = bookQuery.trim().toLowerCase();
  const filteredBooks = books.filter((book) => `${book.title || ""} ${book.contributors?.map((contributor) => contributor.name).join(" ") || ""} ${book.isbn || ""} ${book.locationName || ""}`.toLowerCase().includes(normalizedBookQuery));

  return <div className="app-page">
    <ThemeDecorations theme={theme} />
    <header className="topbar">
      <div className="wordmark"><span className="wordmark-icon"><BookOpen size={17} /></span> BoooKs</div>
      <div className="topbar-actions"><ThemeMenu theme={theme} onChange={onThemeChange} /><span className="user-greeting">Good reading, {user?.name?.split(" ")[0] || "friend"}</span><span className="avatar">{initials}</span><button className="icon-button" title="Sign out" onClick={onSignOut}><LogOut size={17} /></button></div>
    </header>
    <main className="workspace">
      <LocationSidebar activeId={activeId} locations={locations} books={books} locationFilter={locationFilter} loading={loading} citation={citation} onSelectAll={() => { setLocationFilter(""); setShowAllBooks(true); }} onSelectLocation={(locationId) => { setLocationFilter(locationId); setShowAllBooks(true); }} onCreateLocation={() => setLocationModal("create")} onRenameLocation={setLocationModal} onDeleteLocation={deleteLocation} onCreateCollection={() => setCollectionModal("create")} />
      <section className="content">
        {activeId && <BookViewToggle mode={bookView} onChange={onBookViewChange} />}
        <CollectionPicker collections={collections} activeId={activeId} activeCollection={activeCollection} showAllCollections={showAllCollections} onShowAll={() => { setShowAllCollections(true); setShowAllBooks(false); }} onSelect={(id) => { setActiveId(id); setShowAllCollections(false); }} onRename={() => setCollectionModal(activeCollection)} onDelete={() => deleteCollection(activeCollection)} onManageOwners={() => setOwnersModal(activeCollection)} />
        {showAllCollections ? <AllCollectionsView collections={collections} onSelect={(id) => { setActiveId(id); setShowAllCollections(false); }} onCreate={() => setCollectionModal("create")} /> : showAllBooks && activeCollection ? <CollectionBooksView collection={activeCollection} books={books} locations={locations} locationFilter={locationFilter} viewMode={bookView} onBack={() => { setShowAllBooks(false); setLocationFilter(""); }} onAddBook={() => setShowAdd(true)} onAssignLocation={assignLocation} onDeleteBook={deleteBook} onUpdateBook={updateBook} /> : <div className="overview-page-layout"><div className="overview-main-column">
        <div className="page-intro-with-detail"><div className="content-heading"><div><p className="eyebrow">Your library / {activeCollection?.name || "Getting started"}</p><h1>{activeCollection?.name || "A new reading life"}</h1><p className="lede">A little order for the stories that stay with you.</p></div>{activeId ? <button className="button button-primary" onClick={() => setShowAdd(true)}><Plus size={17} /> Add a book</button> : <button className="button button-primary" onClick={() => setCollectionModal("create")}><Plus size={17} /> Create a collection</button>}</div></div>
        {error && <div className="notice">{error}</div>}
        {loading ? <div className="loading-state">Opening your collections...</div> : <>
          <div className="stats-row"><div><span className="stat-number">{books.length}</span><span className="stat-label">books in collection</span></div><div><span className="stat-number">{locations.length}</span><span className="stat-label">locations</span></div><label className="search-box"><Search size={17} /><span className="sr-only">Find a book</span><input value={bookQuery} onChange={(event) => setBookQuery(event.target.value)} placeholder="Find a book..." aria-label="Find a book" /></label></div>
          <div className="section-title"><h2>Recent additions</h2><button className="text-button" onClick={() => setShowAllBooks(true)}>View all <span>→</span></button></div>
          {filteredBooks.length ? <div className={`books-with-detail ${bookView === "spines" ? "spines-view" : ""}`}><div className="book-grid">{filteredBooks.slice(0, 6).map((book) => <BookCard book={book} locations={locations} onAssignLocation={assignLocation} onSelect={setSelectedBook} viewMode={bookView} key={book.id} />)}</div></div> : books.length && bookQuery ? <div className="empty-state"><div className="empty-icon"><Search size={25} /></div><h2>No books found</h2><p>Try another title, author, ISBN, or location.</p></div> : activeId ? <div className="empty-state"><div className="empty-icon"><Leaf size={25} /></div><h2>Your collection is ready</h2><p>Add the first book and let the collection take shape.</p><button className="button button-secondary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add your first book</button></div> : <div className="empty-state"><div className="empty-icon"><Leaf size={25} /></div><h2>Begin with a collection</h2><p>Collections keep different reading lives beautifully apart.</p><button className="button button-secondary" onClick={() => setCollectionModal("create")}><Plus size={16} /> Create your first collection</button></div>}
        </>}
      </div><BookDetailPanel book={selectedBook} locations={locations} onClose={() => setSelectedBook(null)} onAssignLocation={assignLocation} onDelete={deleteBook} onUpdate={updateBook} /></div>}
      </section>
    </main>
    {showAdd && activeId && <AddBookModal collectionId={activeId} onClose={() => setShowAdd(false)} onAdded={() => api.books(activeId).then(setBooks)} />}
    {collectionModal && <CollectionModal collection={collectionModal === "create" ? null : collectionModal} onClose={() => setCollectionModal(null)} onSaved={saveCollection} />}
    {ownersModal && <OwnersModal collection={ownersModal} onClose={() => setOwnersModal(null)} />}
    {locationModal && activeId && <LocationModal collectionId={activeId} location={locationModal === "create" ? null : locationModal} onClose={() => setLocationModal(null)} onSaved={saveLocation} />}
  </div>;
}
