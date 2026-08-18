import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent as firebaseLogEvent, type Analytics } from 'firebase/analytics';
import { firebaseConfig } from '../firebase';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let analyticsInstance: Analytics | null = null;
let isGtagInitialized = false;

/**
 * Initializes Google Analytics via Firebase Analytics and/or direct gtag.js Measurement ID.
 */
export async function initAnalytics(): Promise<void> {
  const firebaseMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || firebaseMeasurementId;

  // 1. Initialize Firebase Analytics if supported
  try {
    if (typeof window !== 'undefined' && await isSupported()) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      analyticsInstance = getAnalytics(app);
      console.log('[Analytics] Firebase Analytics initialized successfully');
    }
  } catch (err) {
    console.warn('[Analytics] Firebase Analytics initialization failed:', err);
  }

  // 2. Initialize gtag.js if a Measurement ID is present and not already initialized
  if (typeof window !== 'undefined' && gaMeasurementId && !isGtagInitialized) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function (...args: any[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId, { send_page_view: false });

      // Inject gtag.js script asynchronously if not present
      const scriptId = 'ga-gtag-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
        document.head.appendChild(script);
      }

      isGtagInitialized = true;
      console.log(`[Analytics] Google Tag (gtag.js) initialized for ID: ${gaMeasurementId}`);
    } catch (err) {
      console.warn('[Analytics] Google Tag initialization failed:', err);
    }
  }
}

/**
 * Log custom events to both Firebase Analytics and gtag.js
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (analyticsInstance) {
      firebaseLogEvent(analyticsInstance, eventName, params);
    }
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.warn(`[Analytics] Failed to send event ${eventName}:`, err);
  }
}

/**
 * Track page view / category navigation
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

/**
 * Track user category view
 */
export function trackCategoryView(categoryId: string, categoryName: string): void {
  trackEvent('view_item_list', {
    item_list_id: categoryId,
    item_list_name: categoryName,
  });
  trackPageView(`Guid.Studio - ${categoryName}`, `#${categoryId}`);
}

/**
 * Track unit conversion actions
 */
export function trackConversion(categoryId: string, fromUnit: string, toUnit: string): void {
  trackEvent('unit_conversion', {
    category_id: categoryId,
    from_unit: fromUnit,
    to_unit: toUnit,
  });
}

/**
 * Track search queries
 */
export function trackSearch(searchQuery: string): void {
  if (!searchQuery.trim()) return;
  trackEvent('search', {
    search_term: searchQuery,
  });
}
