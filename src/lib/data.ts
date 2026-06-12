// Countries and their pricing multipliers for reviews
export const COUNTRIES = [
  // North America
  { code: 'us', name: 'United States', flag: '🇺🇸', region: 'North America', multiplier: 1.0, currency: 'USD' },
  
  // Eastern Europe  
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦', region: 'Eastern Europe', multiplier: 0.6, currency: 'USD' },
  { code: 'pl', name: 'Poland', flag: '🇵🇱', region: 'Central Europe', multiplier: 0.75, currency: 'USD' },
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', region: 'Central Europe', multiplier: 0.75, currency: 'USD' },
  { code: 'sk', name: 'Slovakia', flag: '🇸🇰', region: 'Central Europe', multiplier: 0.7, currency: 'USD' },
  { code: 'hu', name: 'Hungary', flag: '🇭🇺', region: 'Central Europe', multiplier: 0.7, currency: 'USD' },
  { code: 'ro', name: 'Romania', flag: '🇷🇴', region: 'Eastern Europe', multiplier: 0.65, currency: 'USD' },

  // Western Europe
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', region: 'Western Europe', multiplier: 1.1, currency: 'USD' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', region: 'Western Europe', multiplier: 1.05, currency: 'USD' },
  { code: 'fr', name: 'France', flag: '🇫🇷', region: 'Western Europe', multiplier: 1.0, currency: 'USD' },
  { code: 'it', name: 'Italy', flag: '🇮🇹', region: 'Western Europe', multiplier: 0.95, currency: 'USD' },
  { code: 'es', name: 'Spain', flag: '🇪🇸', region: 'Western Europe', multiplier: 0.9, currency: 'USD' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', region: 'Western Europe', multiplier: 1.05, currency: 'USD' },
  { code: 'be', name: 'Belgium', flag: '🇧🇪', region: 'Western Europe', multiplier: 1.0, currency: 'USD' },
  { code: 'at', name: 'Austria', flag: '🇦🇹', region: 'Western Europe', multiplier: 1.0, currency: 'USD' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', region: 'Western Europe', multiplier: 1.2, currency: 'USD' },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹', region: 'Western Europe', multiplier: 0.85, currency: 'USD' },

  // Northern Europe
  { code: 'se', name: 'Sweden', flag: '🇸🇪', region: 'Northern Europe', multiplier: 1.1, currency: 'USD' },
  { code: 'no', name: 'Norway', flag: '🇳🇴', region: 'Northern Europe', multiplier: 1.15, currency: 'USD' },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', region: 'Northern Europe', multiplier: 1.1, currency: 'USD' },
  { code: 'fi', name: 'Finland', flag: '🇫🇮', region: 'Northern Europe', multiplier: 1.05, currency: 'USD' },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', region: 'Northern Europe', multiplier: 1.05, currency: 'USD' },
];

export const PLATFORMS = [
  {
    id: 'google',
    name: 'Google Reviews',
    icon: '/icons/google.svg',
    color: '#4285F4',
    basePrice: 10,
    description: 'Real 5-star Google Maps reviews from verified accounts',
    packages: [5, 10, 25, 50, 100],
    deliveryDays: '3-7',
    guarantee: '30-day replacement guarantee',
    features: [
      'Real verified profiles',
      'Geo-targeted reviewers',
      'Natural delivery speed',
      'Custom review text available',
      '30-day drop protection',
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook Reviews',
    icon: '/icons/facebook.svg',
    color: '#1877F2',
    basePrice: 8,
    description: 'Authentic 5-star Facebook page reviews and recommendations',
    packages: [5, 10, 25, 50, 100],
    deliveryDays: '2-5',
    guarantee: '30-day replacement guarantee',
    features: [
      'Real Facebook accounts',
      'Country-specific profiles',
      'Gradual delivery',
      'Custom review text available',
      '30-day drop protection',
    ],
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot Reviews',
    icon: '/icons/trustpilot.svg',
    color: '#00B67A',
    basePrice: 15,
    description: 'Verified 5-star Trustpilot reviews for your business',
    packages: [5, 10, 25, 50],
    deliveryDays: '5-10',
    guarantee: '15-day replacement guarantee',
    features: [
      'Verified Trustpilot users',
      'High-quality profiles',
      'Safe delivery pace',
      'Custom review text available',
      '15-day drop protection',
    ],
  },
];

export function getCountryByCode(code: string) {
  return COUNTRIES.find(c => c.code === code);
}

export function getPlatformById(id: string) {
  return PLATFORMS.find(p => p.id === id);
}

export function calculatePrice(platformId: string, countryCode: string, quantity: number): number {
  const platform = getPlatformById(platformId);
  const country = getCountryByCode(countryCode);
  if (!platform || !country) return 0;
  return parseFloat((platform.basePrice * country.multiplier * quantity).toFixed(2));
}

export function getPricePerReview(platformId: string, countryCode: string): number {
  const platform = getPlatformById(platformId);
  const country = getCountryByCode(countryCode);
  if (!platform || !country) return 0;
  return parseFloat((platform.basePrice * country.multiplier).toFixed(2));
}
