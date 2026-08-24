export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'owner' | 'barista' | 'guest';
  shopName?: string;
}

export interface CartItem {
  id: string;
  title: string;
  category: 'equipment' | 'beans' | 'package' | 'service';
  price: number;
  formattedPrice: string;
  image: string;
  subtitle?: string;
  specs?: string;
  quantity: number;
}

export interface EquipmentTier {
  id: string;
  tabKey: 'home' | 'medium' | 'chain';
  label: string;
  name: string;
  subtitle: string;
  price: number;
  formattedPrice: string;
  pressure: string;
  boiler: string;
  pump: string;
  capacity: string;
  power: string;
  warranty: string;
  image: string;
  badge?: string;
  features: string[];
}

export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  subRegion: string;
  altitude: string;
  process: string;
  roastProfile: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  cuppingScore: number;
  flavorNotes: string[];
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  bagWeight: string;
}

export interface PillarItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  accentText: string;
}

export interface SolutionPackage {
  id: string;
  name: string;
  target: string;
  price: string;
  rawPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'cart';
}
