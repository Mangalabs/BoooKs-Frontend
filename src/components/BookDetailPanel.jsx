import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import EditBookModal from "./EditBookModal";

function getAuthor(book) {
  return book.contributors?.map((contributor) => contributor.name).join(", ") || "Unknown author";
}

function Detail({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return <div className="book-detail-row"><dt>{label}</dt><dd>{typeof value === "object" ? value.value || JSON.stringify(value) : value}</dd></div>;
}

export default function BookDetailPanel({ book, locations = [], onClose, onAssignLocation, onDelete, onUpdate }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  if (!book) return null;

  async function deleteBook() {
    setDeleting(true);
    setError("");
    try {
      await onDelete(book);
      setConfirmingDelete(false);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeleting(false);
    }
  }

  return <aside className="book-detail-panel" aria-label="Book details">
    <button className="detail-close" onClick={onClose} aria-label="Close book details"><X size={17} /></button>
    <div className="detail-cover" style={book.coverUrl ? { backgroundImage: `url(${book.coverUrl})` } : {}}><span>{book.coverUrl ? "" : "No cover"}</span></div>
    <div className="detail-heading"><p className="eyebrow">Book details</p>{onUpdate && <button className="edit-book-button" onClick={() => setEditing(true)}><Pencil size={14} /> Edit information</button>}</div>
    <h2>{book.title || "Untitled book"}</h2>
    <p className="detail-author">{getAuthor(book)}</p>
    <label className="detail-location">Location<select className="select-control" value={book.locationId || ""} onChange={(event) => onAssignLocation?.(book, event.target.value || null)}><option value="">No location</option>{locations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
    <dl><Detail label="ISBN" value={book.isbn || "Personal edition"} /><Detail label="Published" value={book.publishDate} /><Detail label="Pages" value={book.numberOfPages} /><Detail label="Format" value={book.physicalFormat} /><Detail label="Edition" value={book.editionName} /><Detail label="Published in" value={book.publishPlaces} /><Detail label="Copyright" value={book.copyrightDate} /></dl>
    {error && <p className="form-error detail-error">{error}</p>}
    {onDelete && <button className="delete-book-button" onClick={() => setConfirmingDelete(true)}><Trash2 size={15} /> Delete from collection</button>}
    {editing && <EditBookModal collectionId={book.collectionId} book={book} onClose={() => setEditing(false)} onSaved={(updated) => { onUpdate(updated); setEditing(false); }} />}
    {confirmingDelete && <ConfirmModal title="Delete this book?" message={`This will remove “${book.title || "Untitled book"}” from this collection. This cannot be undone.`} busy={deleting} onCancel={() => setConfirmingDelete(false)} onConfirm={deleteBook} />}
  </aside>;
}
