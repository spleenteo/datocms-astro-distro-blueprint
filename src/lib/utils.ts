import { getLocale } from '@lib/i18n';

export const getHomeHref = ({ locale = getLocale() } = {}) => {
  return `/${locale}/`;
};
