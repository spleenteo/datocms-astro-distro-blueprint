import { defineMiddleware } from 'astro:middleware';
import { datocmsEnvironment } from '@root/datocms-environment';
import { DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN } from 'astro:env/server';

export const datocms = defineMiddleware(async ({ locals }, next) => {
  Object.assign(locals, {
    datocmsEnvironment,
    datocmsToken: DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
  });
  const response = await next();
  return response;
});
