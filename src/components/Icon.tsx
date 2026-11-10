import {
  AirVent,
  Building2,
  ClipboardCheck,
  Fan,
  Flame,
  Gauge,
  Hammer,
  House,
  Leaf,
  MapPin,
  Mountain,
  Snowflake,
  Sun,
  ThermometerSun,
  Trees,
  Wind,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  snowflake: Snowflake,
  flame: Flame,
  wrench: Wrench,
  hammer: Hammer,
  'clipboard-check': ClipboardCheck,
  gauge: Gauge,
  'air-vent': AirVent,
  wind: Wind,
  'thermometer-sun': ThermometerSun,
  leaf: Leaf,
  fan: Fan,
  'map-pin': MapPin,
  house: House,
  building: Building2,
  mountain: Mountain,
  trees: Trees,
  sun: Sun,
}

export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const C = map[name] || Wrench
  return <C size={size} className={className} aria-hidden="true" strokeWidth={1.9} />
}
