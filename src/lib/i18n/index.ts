import rosetta from 'rosetta';
import type { SiteLocale, TranslationKey } from '@lib/i18n/types';
import messages from '@lib/i18n/messages.json';
import { locales as siteLocales } from '@lib/site.json';

export const locales = siteLocales as SiteLocale[];
export const defaultLocale = locales[0];
export const cookieName = 'HEAD_START_LOCALE';
export type { SiteLocale, TranslationKey };

const i18n = rosetta(messages);

// Auto-load translations from DatoCMS in development
if (import.meta.env.DEV && Object.keys(messages).length === 0) {
  console.warn('⚠️ No translations found. Run `npm run load-translations` to fetch from DatoCMS');
}

if (typeof document !== 'undefined') {
  setLocale(document.documentElement.lang as SiteLocale);
} else {
  i18n.locale(defaultLocale);
}

export type T = typeof i18n.t & ((key: TranslationKey) => string);
// we use the 'any' type since this is used in the rosetta source-code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const t: T = (key: TranslationKey, params?: any[] | Record<string, any>, lang?: string) => {
  const translate = i18n.t.bind(i18n);
  const translation = translate(key, params, lang);
  if (!translation) console.warn(`\x1b[33mMissing translation for key: ${key}`);
  return translation;
};

export function getLocale() {
  return i18n.locale();
}

export function isLocale<T extends typeof locales>(locale: unknown): locale is T[number] {
  return Boolean(locale) && (locales as unknown[]).includes(locale);
}

export function setLocale(locale?: string) {
  if (isLocale(locale)) {
    return i18n.locale(locale);
  }
  return i18n.locale();
}

/**
 * Returns locale name for a given code in its own language.
 */
export function getLocaleName(code: string) {
  return new Intl.DisplayNames([code], { type: 'language' }).of(code);
}
