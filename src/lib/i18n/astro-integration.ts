import type { AstroIntegration } from 'astro';
import { loadTranslationsFromDatoCMS, updateTranslationTypes } from './loadTranslations.js';

export function datocmsI18n(): AstroIntegration {
  return {
    name: 'datocms-i18n',
    hooks: {
      'astro:config:setup': async ({ logger }) => {
        logger.info('Loading translations from DatoCMS...');
        try {
          await loadTranslationsFromDatoCMS();
          await updateTranslationTypes();
          logger.info('✅ Translations loaded successfully');
        } catch (error) {
          logger.error('❌ Failed to load translations:', error);
        }
      },
    },
  };
}
