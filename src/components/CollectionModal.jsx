import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "../api";

export default function CollectionModal({ collection, onClose, onSaved }) {
  const [name, setName] = useState(collection?.name || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Give this shelf a name.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const saved = collection
        ? await api.renameCollection(collection.id, trimmedName)
        : await api.createCollection(trimmedName);
      onSaved(saved);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <p className="eyebrow">Your shelves</p>
    <h2>{collection ? "Rename shelf" : "Create a shelf"}</h2>
    <p>{collection ? "Give this collection a name that feels like home." : "Make a place for a particular kind of reading."}</p>
    <form onSubmit={submit}>
      <label>Shelf name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Weekend reads" maxLength={120} required /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary button-wide" disabled={busy}>{busy ? "Saving..." : collection ? "Save name" : "Create shelf"} <Plus size={15} /></button>
    </form>
  </div></div>;
}
