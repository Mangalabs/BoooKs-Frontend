import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { api, ApiError } from "../api";

const metadataFields = [
  ["title", "Title", "The book's title"],
  ["publishDate", "Publication date", ""],
  ["contributors", "Contributors", "Author or contributors"],
  ["coverUrl", "Cover URL", "https://..."],
  ["publishPlaces", "Published in", ""],
  ["numberOfPages", "Number of pages", ""],
  ["editionName", "Edition", ""],
  ["latestRevision", "Latest revision", ""],
  ["physicalFormat", "Format", "Paperback"],
  ["copyrightDate", "Copyright date", ""],
];

function displayValue(field, value) {
  if (value === null || value === undefined) return "";
  if (field === "publishDate" && typeof value === "object") return value.value || "";
  if (field === "contributors" && Array.isArray(value)) return value.map((contributor) => contributor.name || "").join(", ");
  return String(value);
}

function requestValue(field, value) {
  if (field === "publishDate") return value ? { value } : null;
  if (field === "contributors") return value ? value.split(",").map((name) => ({ name: name.trim() })).filter((contributor) => contributor.name) : null;
  if (field === "numberOfPages") return value ? Number(value) : null;
  return value || null;
}

export default function AddBookModal({ collectionId, onClose, onAdded }) {
  const [isbn, setIsbn] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [manual, setManual] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function lookup() {
    setBusy(true);
    setMessage("");
    try {
      const result = await api.lookup(isbn);
      setMetadata(result);
      setForm(Object.fromEntries(metadataFields.map(([field]) => [field, displayValue(field, result[field])] )));
      setReviewing(true);
      setMessage(result.source === "cache" ? "Found in your local catalogue. Review the details before adding it." : "Found via Open Library. Review the details before adding it.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setMetadata({ isbn });
        setForm({ title: "" });
        setManual(true);
        setReviewing(true);
        setMessage("This ISBN was not found. Add its details manually to create it in your collection.");
      } else {
        setMessage(`${error.message} You can add this book manually instead.`);
      }
    } finally {
      setBusy(false);
    }
  }

  function addManually() {
    setMetadata({ isbn });
    setForm({ title: "" });
    setManual(true);
    setReviewing(true);
    setMessage("Add this book's details manually to create it in your collection.");
  }

  async function add() {
    const values = Object.fromEntries(Object.entries(form).map(([field, value]) => [field, requestValue(field, value)]));
    if (!values.title) { setMessage("A title is required."); return; }
    setBusy(true);
    setMessage("");
    try {
      const added = await api.addBook(collectionId, { isbn, metadata: values });
      if (!manual && added?.id) await api.updateBook(collectionId, added, values);
      onAdded(added);
      onClose();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextManual) {
    setManual(nextManual);
    setReviewing(nextManual);
    setMetadata(null);
    setForm(nextManual ? { title: "" } : {});
    setMessage("");
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="modal add-modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <p className="eyebrow">Grow the collection</p><h2>Add a book</h2>
    <div className="modal-tabs"><button className={!manual ? "active" : ""} onClick={() => switchMode(false)} type="button">ISBN lookup</button><button className={manual ? "active" : ""} onClick={() => switchMode(true)} type="button">No ISBN</button></div>
    {!reviewing && <><label>ISBN<input autoFocus value={isbn} onChange={(event) => setIsbn(event.target.value)} placeholder="978..." /></label><button className="button button-primary button-wide" disabled={busy || !isbn} onClick={lookup}>{busy ? "Searching..." : "Look up ISBN"} <Search size={15} /></button></>}
    {reviewing && <>
      <div className="review-heading"><span>{manual ? "Manual ISBN entry" : "Review book details"}</span>{!manual && <button type="button" className="text-button" onClick={() => setReviewing(false)}>Change ISBN</button>}</div>
      <p className="form-message">{message}</p>
      <div className="metadata-form">{metadataFields.map(([field, label, placeholder]) => <label key={field}>{label}<input type={field === "numberOfPages" ? "number" : field === "coverUrl" ? "url" : "text"} value={form[field] || ""} onChange={(event) => updateField(field, event.target.value)} placeholder={placeholder} required={field === "title"} /></label>)}</div>
      <button className="button button-primary button-wide" disabled={busy} onClick={add}>{busy ? "Adding to collection..." : "Add reviewed book"} <Plus size={15} /></button>
    </>}
    {!reviewing && message && <p className="form-message">{message}</p>}
    {!reviewing && message && <button type="button" className="button button-secondary button-wide" onClick={addManually}>Add this ISBN manually <Plus size={15} /></button>}
  </div></div>;
}
