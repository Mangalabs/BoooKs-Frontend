import { BookMarked, Coffee, Flower2, Leaf, Sparkles } from "lucide-react";

const atmosphereByTheme = {
  "reading-park": [Flower2, Leaf, Sparkles],
  "rainy-cafe": [Coffee, Sparkles, Leaf],
  "classic-library": [BookMarked, BookMarked, Sparkles],
};

export default function AuthAtmosphere({ theme }) {
  const icons = atmosphereByTheme[theme] || atmosphereByTheme["reading-park"];
  const [FirstIcon, SecondIcon, ThirdIcon] = icons;

  return <div className={`auth-atmosphere auth-atmosphere-${theme}`} aria-hidden="true">
    <div className="auth-portal-ring auth-portal-ring-outer" />
    <div className="auth-portal-ring auth-portal-ring-inner" />
    <div className="auth-orbit auth-orbit-one"><span><FirstIcon size="100%" /></span></div>
    <div className="auth-orbit auth-orbit-two"><span><SecondIcon size="100%" /></span></div>
    <div className="auth-orbit auth-orbit-three"><span><ThirdIcon size="100%" /></span></div>
    <div className="auth-spark auth-spark-one" />
    <div className="auth-spark auth-spark-two" />
    <div className="auth-spark auth-spark-three" />
  </div>;
}
