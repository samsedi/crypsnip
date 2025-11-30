// src/i18n/cryptoCountries.ts
export const cryptoCountryLanguages: Record<string, string> = {
    // English-speaking (major crypto markets)
    US: 'en', CA: 'en', GB: 'en', AU: 'en', NG: 'en', ZA: 'en', IN: 'en',

    // Europe
    DE: 'de', FR: 'fr', ES: 'es', IT: 'it', PT: 'pt', NL: 'nl', PL: 'pl',
    RU: 'ru', TR: 'tr', CH: 'de', SE: 'sv', NO: 'no', DK: 'da',

    // Latin America (crypto adoption leaders)
    BR: 'pt', AR: 'es', MX: 'es', CO: 'es', VE: 'es', CL: 'es', PE: 'es',

    // Asia (major trading hubs)
    JP: 'ja', KR: 'ko', CN: 'zh', SG: 'en', HK: 'zh', PH: 'en', VN: 'vi',
    TH: 'th', ID: 'id', MY: 'ms', PK: 'ur',

    // Middle East/Africa
    AE: 'ar', SA: 'ar', KW: 'ar', EG: 'ar', KE: 'sw', GH: 'en',

    // Others
    UA: 'uk', CZ: 'cs', RO: 'ro', BG: 'bg', GR: 'el'
} as const;

export type CryptoCountryCode = keyof typeof cryptoCountryLanguages;
