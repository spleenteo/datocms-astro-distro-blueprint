import {
  loadTranslationsFromDatoCMS,
  updateTranslationTypes,
} from '../src/lib/i18n/loadTranslations.js';

async function main() {
  console.log('🌐 Loading translations from DatoCMS...');

  try {
    await loadTranslationsFromDatoCMS();
    await updateTranslationTypes();
    console.log('🎉 Translation loading completed successfully!');
  } catch (error) {
    console.error('💥 Error loading translations:', error);
    process.exit(1);
  }
}

main();
