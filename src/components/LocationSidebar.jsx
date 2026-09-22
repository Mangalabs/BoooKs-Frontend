import { Leaf, Pencil, Plus, Trash2 } from "lucide-react";
import WeatherWidget from "./WeatherWidget";

export default function LocationSidebar({ activeId, locations, books, locationFilter, loading, citation, onSelectAll, onSelectLocation, onCreateLocation, onRenameLocation, onDeleteLocation, onCreateCollection }) {
  function booksAtLocation(locationId) {
    return books.filter((book) => book.locationId === locationId).length || "";
  }

  return <aside className="sidebar">
    <div className="sidebar-heading"><span>Locations</span></div>
    <nav className="collection-nav">
      {activeId && <button className={`location-link ${!locationFilter ? "selected" : ""}`} onClick={onSelectAll}><span className="location-icon">⌂</span>All locations<span className="location-count">{books.length || ""}</span></button>}
      {activeId && locations.map((location) => <div className={`location-item ${location.id === locationFilter ? "selected" : ""}`} key={location.id}>
        <button className="location-link" onClick={() => onSelectLocation(location.id)}><span className="location-icon">⌂</span>{location.name}<span className="location-count">{booksAtLocation(location.id)}</span></button>
        <div className="location-actions"><button className="icon-button" title={`Rename ${location.name}`} onClick={() => onRenameLocation(location)}><Pencil size={12} /></button><button className="icon-button danger-button" title={`Delete ${location.name}`} onClick={() => onDeleteLocation(location)}><Trash2 size={12} /></button></div>
      </div>)}
      {activeId && !locations.length && <p className="sidebar-empty">No locations in this collection yet.</p>}
      {activeId && <button className="button button-secondary sidebar-create" onClick={onCreateLocation}><Plus size={15} /> Add a location</button>}
      {!loading && !books.length && !activeId && <><p className="sidebar-empty">Your first collection is waiting.</p><button className="button button-secondary sidebar-create" onClick={onCreateCollection}><Plus size={15} /> Create a collection</button></>}
    </nav>
    <div className="sidebar-bottom"><WeatherWidget /><p className="sidebar-quote">“{citation.quote}”<br /><small>{citation.author}</small></p></div>
  </aside>;
}
