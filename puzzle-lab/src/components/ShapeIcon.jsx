import { Circle, Square, Triangle, Star, Heart, Hexagon } from 'lucide-react';

const ICONS = { circle: Circle, square: Square, triangle: Triangle, star: Star, heart: Heart, hexagon: Hexagon };

export default function ShapeIcon({ shape, color, size = 28 }) {
  const Icon = ICONS[shape] || Circle;
  return <Icon size={size} color={color} fill={color} strokeWidth={1.5} />;
}
