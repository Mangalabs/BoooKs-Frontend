import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ title, message, confirmLabel = "Delete", busy, onCancel, onConfirm }) {
  return <div className="modal-backdrop" role="presentation" onClick={onCancel}><div className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(event) => event.stopPropagation()}>
    <div className="confirm-icon"><AlertTriangle size={20} /></div>
    <h2 id="confirm-title">{title}</h2>
    <p>{message}</p>
    <div className="confirm-actions"><button className="button button-secondary" onClick={onCancel} disabled={busy}>Cancel</button><button className="button button-danger" onClick={onConfirm} disabled={busy}>{busy ? "Deleting..." : confirmLabel}</button></div>
  </div></div>;
}
