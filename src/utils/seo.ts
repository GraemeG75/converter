import { getCategoryById } from '../engines/registry';

const SITE_NAME = 'Guid.Studio Universal Unit Converter';
const BASE_URL = 'https://guid.studio';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`;

export interface CategorySEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  jsonLd: object;
}

const CATEGORY_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords: string }> = {
  length: {
    title: 'Length & Distance Converter — Guid.Studio',
    description: 'Convert meters, kilometers, miles, feet, inches, yards, nautical miles, and light years instantly with real-time conversion calculations.',
    keywords: 'length converter, distance conversion, meters to feet, miles to km, inches to cm, unit converter'
  },
  area: {
    title: 'Area Unit Converter — Guid.Studio',
    description: 'Convert area measurements between square meters, square feet, acres, hectares, square kilometers, and square miles.',
    keywords: 'area converter, acres to hectares, square feet to square meters, area calculator'
  },
  volume: {
    title: 'Volume Unit Converter — Guid.Studio',
    description: 'Convert liquid and volumetric measurements including liters, milliliters, gallons, quarts, fluid ounces, cubic meters, and cups.',
    keywords: 'volume converter, liters to gallons, ml to fl oz, cubic meters, volume calculation'
  },
  angles: {
    title: 'Angle Converter & Interactive Protractor — Guid.Studio',
    description: 'Convert angle measurements between degrees, radians, gradians, arcminutes, and arcseconds with interactive visual protractor.',
    keywords: 'angle converter, degrees to radians, protractor, arcminute, gradian converter'
  },
  temperatures: {
    title: 'Temperature Unit Converter — Guid.Studio',
    description: 'Convert temperatures instantly between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with interactive thermometer visualizer.',
    keywords: 'temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, thermometer'
  },
  coordinates: {
    title: 'GPS Coordinates & Map Converter (DD, DMS, DDM, UTM, Geohash) — Guid.Studio',
    description: 'Convert geographic coordinates between Decimal Degrees (DD), Degrees Minutes Seconds (DMS), DDM, UTM, and Geohash strings.',
    keywords: 'coordinate converter, lat long to utm, dms converter, geohash encoder, geohash decoder, gps coordinates'
  },
  data: {
    title: 'Digital Data Size Converter (Bytes to TB) — Guid.Studio',
    description: 'Convert digital storage sizes between Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and Petabytes (PB).',
    keywords: 'data converter, bytes to mb, gb to tb, storage size calculator, kibibytes, binary data'
  },
  data_rate: {
    title: 'Data Transfer Rate & Download Time Calculator — Guid.Studio',
    description: 'Calculate internet speed and transfer rates: convert Mbps to MB/s, Gbps, Kbps, and estimate file download transfer times.',
    keywords: 'data rate converter, download time calculator, mbps to mbs, bandwidth converter, internet speed tool'
  },
  speed: {
    title: 'Speed & Velocity Converter — Guid.Studio',
    description: 'Convert speed and velocity units including m/s, km/h, mph, knots, and Mach numbers with real-time conversion factors.',
    keywords: 'speed converter, mph to kph, meters per second, knots to mph, mach converter'
  },
  mass: {
    title: 'Mass & Weight Unit Converter — Guid.Studio',
    description: 'Convert weight and mass units between grams, kilograms, pounds, ounces, metric tons, grains, and carats.',
    keywords: 'mass converter, weight converter, kg to lbs, grams to ounces, metric ton converter'
  },
  pressure: {
    title: 'Pressure Unit Converter — Guid.Studio',
    description: 'Convert pressure units between Pascals (Pa), kilopascals (kPa), bar, PSI, atmospheres (atm), and mmHg.',
    keywords: 'pressure converter, psi to bar, pa to kpa, atmosphere pressure, mmhg to psi'
  },
  energy: {
    title: 'Energy & Work Unit Converter — Guid.Studio',
    description: 'Convert energy units between Joules (J), Kilojoules (kJ), Calories (cal), Kilocalories (kcal), Watt-hours (Wh), and BTU.',
    keywords: 'energy converter, joules to calories, btu converter, watt hours, energy calculation'
  },
  power: {
    title: 'Power Unit Converter — Guid.Studio',
    description: 'Convert power units between Watts (W), Kilowatts (kW), Horsepower (hp), Megawatts (MW), and BTU per hour.',
    keywords: 'power converter, watts to horsepower, kw to hp, power calculation, megawatts'
  },
  time: {
    title: 'Time & Unix Epoch Timestamp Converter — Guid.Studio',
    description: 'Convert time units and Unix epoch timestamps between seconds, minutes, hours, days, years, and human readable UTC dates.',
    keywords: 'time converter, unix epoch timestamp, epoch converter, UTC time, epoch timestamp calculator'
  },
  color: {
    title: 'Color Format Converter (HEX, RGB, HSL, HSV, CMYK, Int) — Guid.Studio',
    description: 'Convert color values between HEX, RGB, HSL, HSV, CMYK, and Decimal Integer formats with live visual color previews.',
    keywords: 'color converter, hex to rgb, rgb to hsl, cmyk converter, color format picker, hex to int'
  },
  number_bases: {
    title: 'Number Base Converter (Binary, Hex, Octal, Dec) — Guid.Studio',
    description: 'Convert numbers across bases: Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16), and custom radix values.',
    keywords: 'number base converter, binary to hex, hex to dec, base 2 to base 10, octal converter'
  },
  typography: {
    title: 'Typography Unit Converter (PX, REM, EM, PT, PC) — Guid.Studio',
    description: 'Convert web typography units: Pixels (px), REM, EM, Points (pt), Picas (pc), and percentages based on custom root font size.',
    keywords: 'typography converter, px to rem, rem to px, em converter, pt to px calculator, font size converter'
  },
  roman_unicode: {
    title: 'Roman Numerals & Unicode Character Converter — Guid.Studio',
    description: 'Convert numbers to Roman Numerals (I, V, X, L, C, D, M), decode Roman numerals, and inspect Unicode character code points.',
    keywords: 'roman numeral converter, roman to decimal, unicode code point, character inspector, unicode hex'
  },
  uuid_guid: {
    title: 'UUID & GUID Generator and Formatter — Guid.Studio',
    description: 'Generate and format RFC 4122 compliant UUID v4 and GUID strings. Format with hyphens, braces, or uppercase.',
    keywords: 'uuid generator, guid generator, uuid v4, format guid, remove hyphens uuid, nil guid'
  }
};

/**
 * Updates dynamic meta tags in document head for SEO, Social Sharing, and Search Crawlers
 */
export function updateCategorySEO(categoryId: string): void {
  const category = getCategoryById(categoryId);
  const override = CATEGORY_SEO_OVERRIDES[categoryId];

  const title = override?.title || `${category.name} Converter — ${SITE_NAME}`;
  const description = override?.description || `${category.description} Free online unit conversion tool on Guid.Studio.`;
  const keywords = override?.keywords || `${category.name.toLowerCase()} converter, unit converter, universal converter, Guid.Studio`;
  const canonicalUrl = `${BASE_URL}/#${categoryId}`;

  // Update Page Title
  document.title = title;

  // Helper to update meta tag content
  const setMetaContent = (selector: string, content: string, createIfMissing = true, attributeName = 'name') => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el && createIfMissing) {
      el = document.createElement('meta');
      const attrVal = selector.replace(`meta[${attributeName}="`, '').replace('"]', '');
      el.setAttribute(attributeName, attrVal);
      document.head.appendChild(el);
    }
    if (el) {
      el.setAttribute('content', content);
    }
  };

  // Primary Meta Tags
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="keywords"]', keywords);
  setMetaContent('meta[name="robots"]', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaContent('meta[name="author"]', 'generatedpixel.dev');

  // Open Graph / Facebook / LinkedIn / Discord
  setMetaContent('meta[property="og:type"]', 'website', true, 'property');
  setMetaContent('meta[property="og:site_name"]', SITE_NAME, true, 'property');
  setMetaContent('meta[property="og:title"]', title, true, 'property');
  setMetaContent('meta[property="og:description"]', description, true, 'property');
  setMetaContent('meta[property="og:url"]', canonicalUrl, true, 'property');
  setMetaContent('meta[property="og:image"]', DEFAULT_IMAGE, true, 'property');
  setMetaContent('meta[property="og:image:width"]', '1200', true, 'property');
  setMetaContent('meta[property="og:image:height"]', '630', true, 'property');
  setMetaContent('meta[property="og:image:alt"]', title, true, 'property');

  // Twitter Cards
  setMetaContent('meta[name="twitter:card"]', 'summary_large_image');
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', DEFAULT_IMAGE);

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // Inject or update Dynamic Category JSON-LD Structured Data
  injectCategoryJsonLd(categoryId, title, description, canonicalUrl);
}

/**
 * Injects Category-specific WebApplication & FAQ schema markup
 */
function injectCategoryJsonLd(categoryId: string, title: string, description: string, url: string): void {
  const SCRIPT_ID = 'json-ld-category-schema';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const category = getCategoryById(categoryId);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': title,
    'description': description,
    'url': url,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'provider': {
      '@type': 'Organization',
      'name': 'Guid.Studio',
      'url': BASE_URL
    },
    'featureList': category.units.map(u => `Convert ${u.name} (${u.symbol})`)
  };

  script.textContent = JSON.stringify(jsonLdData, null, 2);
}

/**
 * Injects global site JSON-LD schemas for Search Engines (WebSite with SearchAction, WebApplication, FAQPage)
 */
export function injectGlobalJsonLd(): void {
  const SCRIPT_ID = 'json-ld-global-schema';
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.type = 'application/ld+json';

  const globalSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': BASE_URL,
      'description': 'Universal unit converter supporting physical units, geographic coordinates, color formats, digital data, base conversions, Roman numerals, and UUID/GUID generation.',
      'publisher': {
        '@type': 'Organization',
        'name': 'generatedpixel.dev',
        'url': 'https://generatedpixel.dev/',
        'email': 'mailto:hello@generatedpixel.dev'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${BASE_URL}/#search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What unit conversions does Guid.Studio support?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Guid.Studio supports 19 conversion categories: Length, Area, Volume, Angles, Temperature, GPS Coordinates (DD, DMS, DDM, UTM, Geohash), Data Storage, Data Transfer Rate, Speed, Mass, Pressure, Energy, Power, Time/Unix Epoch, Color Formats (HEX, RGB, HSL, HSV, CMYK, Int), Number Bases (Binary, Octal, Decimal, Hex), Typography (PX, REM, EM, PT), Roman Numerals & Unicode, and UUID/GUID Generation.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I convert latitude and longitude to UTM or Geohash?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Select the Coordinates category on Guid.Studio. Enter your latitude and longitude separated by a comma (e.g. 37.7749, -122.4194) and select UTM or Geohash as the output unit.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I generate a UUID v4 string?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Navigate to the UUID/GUID tool category on Guid.Studio to instantly generate RFC 4122 compliant UUID v4 strings in standard, hyphenless, or braced formats.'
          }
        }
      ]
    }
  ];

  script.textContent = JSON.stringify(globalSchemas, null, 2);
  document.head.appendChild(script);
}
