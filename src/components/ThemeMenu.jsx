import { Palette } from "lucide-react";

const themes = [
  { id: "reading-park", label: "Reading park" },
  { id: "rainy-cafe", label: "Rainy cafe" },
  { id: "classic-library", label: "Classic library" },
];

export default function ThemeMenu({ theme, onChange }) {
  return <label className="theme-menu">
    <Palette size={15} aria-hidden="true" />
    <span className="sr-only">Choose visual theme</span>
    <select className="select-control" value={theme} onChange={(event) => onChange(event.target.value)} aria-label="Choose visual theme">
      {themes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  </label>;
}
