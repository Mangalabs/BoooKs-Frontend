import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { api } from "../api";

export default function OwnersModal({ collection, onClose }) {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [removingEmail, setRemovingEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.owners(collection.id)
      .then(setOwners)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [collection.id]);

  async function submit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) { setError("Enter an email address."); return; }
    setBusy(true);
    setError("");
    try {
      const owner = await api.addOwner(collection.id, trimmedEmail);
      setOwners((previous) => previous.some((existing) => existing.email === owner.email) ? previous : [...previous, owner]);
      setEmail("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeOwner(ownerEmail) {
    setRemovingEmail(ownerEmail);
    setError("");
    try {
      await api.removeOwner(collection.id, ownerEmail);
      setOwners((previous) => previous.filter((owner) => owner.email !== ownerEmail));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRemovingEmail("");
    }
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <p className="eyebrow">{collection.name}</p>
    <h2>Manage owners</h2>
    <p>Everyone who owns this shelf can add books, rename it, and invite others.</p>
    <form onSubmit={submit} className="owners-form">
      <label>Owner email<input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="friend@example.com" required /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary button-wide" disabled={busy}>{busy ? "Adding..." : "Add owner"} <UserPlus size={15} /></button>
    </form>
    {!loading && <ul className="owners-list">
      {owners.map((owner) => <li className="owners-list-item" key={owner.email}>
        <span><strong>{owner.name}</strong><small>{owner.email}</small></span>
        {owners.length > 1 && <button className="icon-button danger-button" title={`Remove ${owner.email}`} disabled={removingEmail === owner.email} onClick={() => removeOwner(owner.email)}><Trash2 size={14} /></button>}
      </li>)}
    </ul>}
  </div></div>;
}
