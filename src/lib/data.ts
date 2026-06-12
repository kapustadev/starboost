// Countries and their pricing multipliers for reviews
export const COUNTRIES = [
  // North America
  { code: 'us', name: 'United States', flag: '🇺🇸', region: 'North America', multiplier: 1.0 },

  // Eastern Europe
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦', region: 'Eastern Europe', multiplier: 0.6 },
  { code: 'pl', name: 'Poland', flag: '🇵🇱', region: 'Central Europe', multiplier: 0.75 },
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', region: 'Central Europe', multiplier: 0.75 },
  { code: 'sk', name: 'Slovakia', flag: '🇸🇰', region: 'Central Europe', multiplier: 0.7 },
  { code: 'hu', name: 'Hungary', flag: '🇭🇺', region: 'Central Europe', multiplier: 0.7 },
  { code: 'ro', name: 'Romania', flag: '🇷🇴', region: 'Eastern Europe', multiplier: 0.65 },

  // Western Europe
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', region: 'Western Europe', multiplier: 1.1 },
  { code: 'de', name: 'Germany', flag: '🇩🇪', region: 'Western Europe', multiplier: 1.05 },
  { code: 'fr', name: 'France', flag: '🇫🇷', region: 'Western Europe', multiplier: 1.0 },
  { code: 'it', name: 'Italy', flag: '🇮🇹', region: 'Western Europe', multiplier: 0.95 },
  { code: 'es', name: 'Spain', flag: '🇪🇸', region: 'Western Europe', multiplier: 0.9 },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', region: 'Western Europe', multiplier: 1.05 },
  { code: 'be', name: 'Belgium', flag: '🇧🇪', region: 'Western Europe', multiplier: 1.0 },
  { code: 'at', name: 'Austria', flag: '🇦🇹', region: 'Western Europe', multiplier: 1.0 },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', region: 'Western Europe', multiplier: 1.2 },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹', region: 'Western Europe', multiplier: 0.85 },

  // Northern Europe
  { code: 'se', name: 'Sweden', flag: '🇸🇪', region: 'Northern Europe', multiplier: 1.1 },
  { code: 'no', name: 'Norway', flag: '🇳🇴', region: 'Northern Europe', multiplier: 1.15 },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', region: 'Northern Europe', multiplier: 1.1 },
  { code: 'fi', name: 'Finland', flag: '🇫🇮', region: 'Northern Europe', multiplier: 1.05 },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', region: 'Northern Europe', multiplier: 1.05 },
]

export const PLATFORMS = [
  {
    id: 'google',
    name: 'Google Reviews',
    shortName: 'Google',
    icon: '/icons/google.svg',
    color: '#4285F4',
    basePrice: 10,
    description: 'Real 5-star Google Maps reviews from verified accounts in your target country.',
    packages: [5, 10, 25, 50, 100],
    deliveryDays: '3–7',
    guarantee: '30-day replacement guarantee',
    features: [
      'Real verified Google profiles',
      'Geo-targeted reviewers',
      'Natural delivery speed',
      'Custom review text +$2/review',
      '30-day drop protection',
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook Reviews',
    shortName: 'Facebook',
    icon: '/icons/facebook.png',
    color: '#1877F2',
    basePrice: 8,
    description: 'Authentic 5-star Facebook page reviews and recommendations from real accounts.',
    packages: [5, 10, 25, 50, 100],
    deliveryDays: '2–5',
    guarantee: '30-day replacement guarantee',
    features: [
      'Real Facebook accounts',
      'Country-specific profiles',
      'Gradual delivery',
      'Custom review text +$2/review',
      '30-day drop protection',
    ],
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot Reviews',
    shortName: 'Trustpilot',
    icon: '/icons/trustpilot.svg',
    color: '#00B67A',
    basePrice: 15,
    description: 'Verified 5-star Trustpilot reviews for your business from real users.',
    packages: [5, 10, 25, 50, 100],
    deliveryDays: '5–10',
    guarantee: '15-day replacement guarantee',
    features: [
      'Verified Trustpilot users',
      'High-quality profiles',
      'Safe delivery pace',
      'Custom review text +$2/review',
      '15-day drop protection',
    ],
  },
]

// Extra charge per review for custom text written by us
export const CUSTOM_TEXT_SURCHARGE = 2

export type TextOption = 'none' | 'client' | 'ours'

export function getCountryByCode(code: string) {
  return COUNTRIES.find(c => c.code === code)
}

export function getPlatformById(id: string) {
  return PLATFORMS.find(p => p.id === id)
}

export function getPricePerReview(
  platformId: string,
  countryCode: string,
  textOption: TextOption = 'none'
): number {
  const platform = getPlatformById(platformId)
  const country = getCountryByCode(countryCode)
  if (!platform || !country) return 0
  const base = parseFloat((platform.basePrice * country.multiplier).toFixed(2))
  const textExtra = textOption === 'ours' ? CUSTOM_TEXT_SURCHARGE : 0
  return parseFloat((base + textExtra).toFixed(2))
}

export function calculatePrice(
  platformId: string,
  countryCode: string,
  quantity: number,
  textOption: TextOption = 'none'
): number {
  return parseFloat((getPricePerReview(platformId, countryCode, textOption) * quantity).toFixed(2))
}
