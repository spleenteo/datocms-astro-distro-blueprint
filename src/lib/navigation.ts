import { executeQuery } from '@lib/datocms/executeQuery';
import { SITE_LAYOUT_QUERY } from './datocms/commonFragments';
import { defaultLocale } from '@lib/i18n';

// Route mapping configuration
export const ROUTE_MAPPING = {
  Page: 'collection',
} as const;

// Social platform to icon mapping
export const SOCIAL_ICON_MAPPING = {
  facebook: 'tabler:brand-facebook',
  twitter: 'tabler:brand-x',
  x: 'tabler:brand-x',
  instagram: 'tabler:brand-instagram',
  linkedin: 'tabler:brand-linkedin',
  youtube: 'tabler:brand-youtube',
  tiktok: 'tabler:brand-tiktok',
  github: 'tabler:brand-github',
  telegram: 'tabler:brand-telegram',
  whatsapp: 'tabler:brand-whatsapp',
  discord: 'tabler:brand-discord',
  rss: 'tabler:rss',
} as const;

type ModelType = keyof typeof ROUTE_MAPPING;

// Simple function to build URLs with locale
export function buildUrl(slug: string, modelType: ModelType, locale: string) {
  const basePath = ROUTE_MAPPING[modelType];
  return `/${locale}/${basePath}/${slug}`;
}

// Transform navigation items into a simple format
function transformNavItem(item: any, locale: string) {
  switch (item.__typename) {
    case 'MenuDropdownRecord':
      return {
        text: item.staticLabel,
        links: item.pages
          .filter((pageItem: any) => pageItem.page && pageItem.page.slug)
          .map((pageItem: any) => ({
            text: pageItem.label || pageItem.page.title,
            href: buildUrl(pageItem.page.slug, 'Page', locale),
          })),
      };

    case 'MenuExternalItemRecord':
      return {
        text: item.label,
        href: item.url,
      };

    case 'MenuItemRecord':
      // Skip items without a page or slug
      if (!item.page || !item.page.slug) {
        return null;
      }
      return {
        text: item.label,
        href: buildUrl(item.page.slug, 'Page', locale),
      };

    default:
      return null;
  }
}

// Transform footer link item
function transformFooterLink(item: any, locale: string) {
  switch (item.__typename) {
    case 'MenuExternalItemRecord':
      return {
        text: item.label,
        href: item.url,
      };

    case 'MenuItemRecord':
      // Skip items without a page or slug
      if (!item.page || !item.page.slug) {
        return null;
      }
      return {
        text: item.label,
        href: buildUrl(item.page.slug, 'Page', locale),
      };

    default:
      return null;
  }
}

// Cache for site layout data
let siteLayoutCache: { locale: string; data: any } | null = null;

// Get all site layout data (navigation + footer) with a single query
async function getSiteLayoutData(locale?: string) {
  const validLocale = locale || defaultLocale;

  // Check cache
  if (siteLayoutCache && siteLayoutCache.locale === validLocale) {
    return siteLayoutCache.data;
  }

  try {
    const result = await executeQuery(SITE_LAYOUT_QUERY, {
      variables: { locale: validLocale as any },
      includeDrafts: false,
    });

    const admin = result?.admin;
    if (!admin) {
      return null;
    }

    // Cache the result
    siteLayoutCache = { locale: validLocale, data: admin };
    return admin;
  } catch (error: any) {
    // Check if we have partial data in the error response
    if (error.response?.body?.data?.admin) {
      const admin = error.response.body.data.admin;
      // Cache the partial result
      siteLayoutCache = { locale: validLocale, data: admin };
      return admin;
    }

    // console.error('Error fetching site layout data:', error.message);
    return null;
  }
}

// Get navigation data using the combined query
export async function getNavigationData(locale?: string) {
  try {
    const validLocale = locale || defaultLocale;
    const admin = await getSiteLayoutData(validLocale);

    // console.log('getNavigationData - locale ricevuto:', locale);
    // console.log('getNavigationData - tipo:', typeof locale);
    // console.log('getNavigationData - validLocale usato:', validLocale);

    if (!admin) {
      return {
        links: [],
        logo: null,
        callout: { text: '', backgroundColor: '#000000' },
      };
    }

    const links = admin.navLinks
      .map((item: any) => transformNavItem(item, validLocale))
      .filter(Boolean);

    return {
      links,
      logo: admin.logo
        ? {
            url: admin.logo.url,
            alt: admin.logo.alt,
            title: admin.logo.title,
          }
        : null,
      callout: {
        text: admin.calloutText || '',
        backgroundColor: admin.calloutBackground?.hex || '#000000',
      },
    };
  } catch (error) {
    return {
      links: [],
      logo: null,
      callout: { text: '', backgroundColor: '#000000' },
    };
  }
}

// Get footer data using the combined query
export async function getFooterData(locale?: string) {
  try {
    const validLocale = locale || defaultLocale;
    const admin = await getSiteLayoutData(validLocale);

    if (!admin) {
      return {
        links: [],
        socialLinks: [],
        footNote: '',
        secondaryLinks: [],
        logo: null,
      };
    }

    // Transform footer links into columns
    const links = admin.footerLinks.map((column: any) => ({
      title: column.widgetLabel,
      links: column.navLinks
        .map((item: any) => transformFooterLink(item, validLocale))
        .filter(Boolean),
    }));

    // Transform social links
    const socialLinks = admin.socialLinks.map((social: any) => {
      const platform = social.platform.toLowerCase();
      const icon = SOCIAL_ICON_MAPPING[platform as keyof typeof SOCIAL_ICON_MAPPING];

      return {
        ariaLabel: social.platform,
        href: social.url,
        code: social.iconName,
        icon: icon || 'tabler:external-link',
      };
    });

    return {
      links,
      socialLinks,
      footNote: admin.legalText?.value || '',
      secondaryLinks: [],
      logo: admin.logo
        ? {
            url: admin.logo.url,
            alt: admin.logo.alt,
            title: admin.logo.title,
          }
        : null,
    };
  } catch (error) {
    // console.error('Error processing footer data:', error);
    return {
      links: [],
      socialLinks: [],
      footNote: '',
      secondaryLinks: [],
      logo: null,
    };
  }
}
