import {
  Armchair,
  BedDouble,
  Candy,
  ChefHat,
  Clapperboard,
  Coffee,
  Croissant,
  Dices,
  Footprints,
  Gift,
  HandHeart,
  Images,
  MailOpen,
  MicVocal,
  NotebookPen,
  Popcorn,
  ShoppingBag,
  Sofa,
  Sparkles,
  TreePine,
  Trophy,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'

// Iconos disponibles para los días (el nombre se usa en contenido/dias.json)
const ICONOS: Record<string, LucideIcon> = {
  Armchair,
  BedDouble,
  Candy,
  ChefHat,
  Clapperboard,
  Coffee,
  Croissant,
  Dices,
  Footprints,
  Gift,
  HandHeart,
  Images,
  MailOpen,
  MicVocal,
  NotebookPen,
  Popcorn,
  ShoppingBag,
  Sofa,
  Sparkles,
  TreePine,
  Trophy,
  UtensilsCrossed,
  Wine,
}

export function Icono({ nombre, ...props }: { nombre: string } & LucideProps) {
  const C = ICONOS[nombre] ?? Gift
  return <C strokeWidth={1.8} {...props} />
}

// Formas para el confeti (en vez de emojis)
export const RUTA_CORAZON =
  'M12 21s-7.5-4.6-10-9.3C.3 8.3 2.2 4 6.1 4c2.2 0 3.6 1.2 4.4 2.4h3c.8-1.2 2.2-2.4 4.4-2.4 3.9 0 5.8 4.3 4.1 7.7C19.5 16.4 12 21 12 21z'
export const RUTA_ESTRELLA = 'M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5L7 14l-5.3-5 7.2-.9z'
