import { BookMarked, BookOpen, Bookmark, Cloud, CloudRain, Coffee, Droplets, Flower2, Leaf, Sparkles, SunMedium, Trees } from "lucide-react";

const themeArt = {
  "reading-park": [Flower2, Leaf, Trees, SunMedium, Flower2, Leaf],
  "rainy-cafe": [Coffee, CloudRain, Cloud, Droplets, Coffee, Sparkles],
  "classic-library": [BookMarked, BookOpen, Bookmark, Sparkles, BookMarked, BookOpen],
};

export default function ThemeDecorations({ theme }) {
  const icons = themeArt[theme] || themeArt["reading-park"];

  return <div className={`theme-decorations theme-decorations-${theme}`} aria-hidden="true">
    <div className="theme-decoration-frame theme-decoration-frame-one" />
    <div className="theme-decoration-frame theme-decoration-frame-two" />
    {icons.map((Icon, index) => <span className={`theme-decoration-item theme-decoration-item-${index + 1}`} key={`${theme}-${index}`}><Icon size="100%" strokeWidth={1.2} /></span>)}
    <i className="theme-decoration-dot theme-decoration-dot-one" />
    <i className="theme-decoration-dot theme-decoration-dot-two" />
    <i className="theme-decoration-dot theme-decoration-dot-three" />
  </div>;
}
