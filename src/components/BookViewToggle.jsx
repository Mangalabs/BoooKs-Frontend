import { BookOpen, Grid2X2 } from "lucide-react";

export default function BookViewToggle({ mode, onChange }) {
  const spineMode = mode === "spines";
  return <div className="book-view-toggle" role="group" aria-label="Book display">
    <button className={!spineMode ? "active" : ""} onClick={() => onChange("covers")} aria-label="Show book covers" aria-pressed={!spineMode} title="Show covers"><Grid2X2 size={15} /></button>
    <button className={spineMode ? "active" : ""} onClick={() => onChange("spines")} aria-label="Show simulated book spines" aria-pressed={spineMode} title="Show spines"><BookOpen size={15} /></button>
  </div>;
}
