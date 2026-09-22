import { Pencil, Trash2, Users } from "lucide-react";

export default function CollectionPicker({ collections, activeId, activeCollection, showAllCollections, onShowAll, onSelect, onRename, onDelete, onManageOwners }) {
  return <div className="collection-picker">
    <button className={`all-collections-button ${showAllCollections ? "active" : ""}`} onClick={onShowAll}>All collections</button>
    <select className="select-control" aria-label="Select collection" value={activeId} onChange={(event) => onSelect(event.target.value)}>
      <option value="">Select a collection</option>
      {collections.map((collection) => <option value={collection.id} key={collection.id}>{collection.name}</option>)}
    </select>
    {activeCollection && <>
      <button className="collection-action-button" onClick={onRename}><Pencil size={14} /> Rename collection</button>
      <button className="collection-action-button" onClick={onManageOwners}><Users size={14} /> Manage owners</button>
      <button className="icon-button danger-button" title={`Delete ${activeCollection.name}`} onClick={onDelete}><Trash2 size={14} /></button>
    </>}
  </div>;
}
