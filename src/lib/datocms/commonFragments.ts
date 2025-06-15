import { graphql } from '@lib/datocms/graphql';

/*
 * This file lists a series of fragments not related to any specific Vue
 * component, but necessary in various parts of the code.
 */

export const TagFragment = graphql(`
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

// Combined query for all site-wide data (navigation + footer)
export const SITE_LAYOUT_QUERY = graphql(`
  query SiteLayoutQuery($locale: SiteLocale = en) {
    admin(locale: $locale) {
      calloutBackground {
        hex
      }
      calloutText
      navLinks {
        ... on MenuDropdownRecord {
          __typename
          staticLabel
          pages {
            label
            page {
              slug
              title
            }
          }
        }
        ... on MenuExternalItemRecord {
          __typename
          label
          url
        }
        ... on MenuItemRecord {
          __typename
          label
          page {
            slug
            title
          }
        }
      }
      # Footer specific fields
      footerLinks {
        navLinks {
          ... on MenuExternalItemRecord {
            __typename
            label
            url
          }
          ... on MenuItemRecord {
            __typename
            label
            page {
              slug
            }
          }
        }
        widgetLabel
      }
      legalText {
        value
      }
      socialLinks {
        platform
        url
      }
    }
  }
`);
