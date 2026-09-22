import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { api } from "../api";

export default function LocationModal({ collectionId, location, onClose, onSaved }) {
  const [name, setName] = useState(location?.name || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { setError("Give this location a name."); return; }
    setBusy(true); setError("");
    try {
      const saved = location ? await api.renameLocation(location.id, trimmedName) : await api.createLocation(collectionId, trimmedName);
      onSaved(saved); onClose();
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <p className="eyebrow">Collection location</p><h2>{location ? "Rename location" : "Add a location"}</h2>
    <p>Give your books a real place to be found again.</p>
    <form onSubmit={submit}><label>Location name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Study shelf" maxLength={120} required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? "Saving..." : location ? "Save location" : "Add location"}{location ? <MapPin size={15} /> : <Plus size={15} />}</button></form>
  </div></div>;
}