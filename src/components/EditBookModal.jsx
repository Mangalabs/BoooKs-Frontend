import { useState } from "react";
import { Save } from "lucide-react";
import { api } from "../api";

const fields = [
  ["title", "Title"],
  ["publishDate", "Publication date"],
  ["contributors", "Contributors"],
  ["coverUrl", "Cover URL"],
  ["publishPlaces", "Published in"],
  ["numberOfPages", "Number of pages"],
  ["editionName", "Edition"],
  ["latestRevision", "Latest revision"],
  ["physicalFormat", "Format"],
  ["copyrightDate", "Copyright date"],
];

function toText(field, value) {
  if (value === null || value === undefined) return "";
  if (field === "publishDate" && typeof value === "object") return value.value || "";
  if (field === "contributors" && Array.isArray(value)) return value.map((contributor) => contributor.name || "").join(", ");
  return String(value);
}

function toValue(field, value) {
  if (!value) return null;
  if (field === "publishDate") return { value };
  if (field === "contributors") return value.split(",").map((name) => ({ name: name.trim() })).filter((contributor) => contributor.name);
  if (field === "numberOfPages") return Number(value);
  return value;
}

export default function EditBookModal({ collectionId, book, onClose, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(([field]) => [field, toText(field, book[field])] )));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) { setError("A title is required."); return; }
    setBusy(true); setError("");
    try {
      const values = Object.fromEntries(fields.map(([field]) => [field, toValue(field, form[field])]));
      const updated = await api.updateBook(collectionId, book, values);
      onSaved(updated);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="modal add-modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <p className="eyebrow">Personal collection</p><h2>Edit information</h2>
    <form onSubmit={submit}><div className="metadata-form">{fields.map(([field, label]) => <label key={field}>{label}<input type={field === "numberOfPages" ? "number" : field === "coverUrl" ? "url" : "text"} value={form[field]} onChange={(event) => updateField(field, event.target.value)} required={field === "title"} /></label>)}</div>{error && <p className="form-error">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? "Saving..." : "Save information"}<Save size={15} /></button></form>
  </div></div>;
}
