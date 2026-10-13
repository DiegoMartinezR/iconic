// src/components/UI/IconMapper.jsx
import { 
    Square, Circle, Heart, Star, Hexagon, Triangle,
    Diamond, Film, Feather, Cloud, Flower, Zap
  } from "lucide-react";
  
  const IconMapper = ({ name, className = "" }) => {
    const iconComponents = {
      square: Square,
      circle: Circle,
      heart: Heart,
      star: Star,
      hexagon: Hexagon,
      triangle: Triangle,
      diamond: Diamond,
      film: Film,
      feather: Feather,
      cloud: Cloud,
      flower: Flower,
      zap: Zap,
      'square-rounded': Square
    };
  
    const IconComponent = iconComponents[name] || Square;
  
    return (
      <IconComponent className={`${className} ${name === 'square-rounded' ? 'rounded-md' : ''}`} />
    );
  };
  
  export default IconMapper;