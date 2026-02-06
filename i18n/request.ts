import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically varies based on the route, but since we haven't set up
  // routed middleware yet, we'll default to the logical flow or use the locale 
  // passed from the layout (if we were using the App Router fully localized).

  // For this simple integration, we'll trust the locale fits, or valid it.
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default
  };
});
