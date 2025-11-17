import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en', 'pt'],

  // Used when no locale matches
  defaultLocale: 'es',
  
  // Only show locale prefix for non-default locales (en, pt)
  // Spanish (es) will be accessible without prefix at /
  localePrefix: 'as-needed'
});

