import { Library, Plus } from "lucide-react";

export default function AllCollectionsView({ collections, onSelect, onCreate }) {
  return <div className="collections-view">
    <div className="content-heading">
      <div>
        <p className="eyebrow">Your library</p>
        <h1>All collections</h1>
        <p className="lede">Different reading lives, gathered under one roof.</p>
      </div>
      <button className="button button-primary" onClick={onCreate}><Plus size={17} /> Create collection</button>
    </div>
    {collections.length ? <div className="collection-grid">{collections.map((collection) => <button className="collection-card" key={collection.id} onClick={() => onSelect(collection.id)}><span className="collection-card-icon"><Library size={21} /></span><span className="collection-card-copy"><strong>{collection.name}</strong><small>Open collection</small></span><span className="collection-card-arrow">&#8594;</span></button>)}</div> : <div className="empty-state"><div className="empty-icon"><Library size={25} /></div><h2>Your library is waiting</h2><p>Create your first collection to give your books a home.</p><button className="button button-secondary" onClick={onCreate}><Plus size={16} /> Create your first collection</button></div>}
  </div>;
}
