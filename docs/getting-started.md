# Getting Started

**This is a starterkit to easily bootstrap your next web project. Here's how to get started.**

A huge thanks to DatoCMS for the [Astro Starter](https://www.datocms.com/marketplace/starters/astro-starter-kit) and [De Voorhoder](https://www.datocms.com/customer-stories/focusing-on-flexibility-extensibility-with-plugins-and-head-start) for their Head-Start projects. I've just cannibalized and ruined their great projects and this allowed me to learn A LOT! I'm pretty sure the best thing for me in the near future will be to use the Head-Start template, since it's really really well done, but I'm too slow to understand it at first glance. So, I'm taking it apart to understand each piece.

I love having a documentation area to keep track of implementations and a way to generate components and blocks on the fly from a template. That's so cool, since I want to create an "almost" empty project, with just a few queries connected to DatoCMS, to get a main menu, a footer, just one page and a collection as a boilerplate. The project comes with Tailwind installed; I like the utilities idea, but really hate how the HTML comes out with dozens of classes per tag. So, I'm trying Daisy, a library that lets you use Tailwind utilities within precomposed blocks in BEM style.

For now I'm deploying on Netlify, because it's simpler for me. But I'll check out Cloudflare as a serious alternative. Next step.

## Prequisites

It requires Node.js to be installed. See [/.nvmrc](../.nvmrc) for the correct version.

## Create a repository

- Create a project repository using [the Head Start repository template](https://github.com/new?owner=voorhoede&template_name=head-start&template_owner=voorhoede). You can use this link, or select 'Use template' on the repository page.
- Clone your new repository (`git clone`).
- Install the project dependencies (`npm install`).
- Create a `.env` file (`cp .env.example .env`).
- Update `datocms-environment` to the new environment:

```ts
// datocms-environment.ts:
export const datocmsEnvironment = 'main';
```

You can now run your project locally:

```shell
npm run dev
```

## Create a Netlify Pages application

- [Signup](https://dash.cloudflare.com/sign-up) or [login](https://dash.cloudflare.com/login) to your Cloudflare Dashboard.
- Go to Workers & Pages and hit 'Create application' and select 'Pages' (`/<your-cloudflare>/workers-and-pages/create/pages`).
- Connect to Git(Hub), select your repository and hit 'Begin setup'.
- Set 'Build command' to `npm run cloudflare:build`.
- Set 'Build output directory' to `dist/`.
- Under 'Environment variables' add the variables from your `.env` file.
- Hit 'Save and deploy'.

You're project is now deployed and will automatically be deployed on every git commit. To ensure changes in the CMS also redeploy the project, we need to connect DatoCMS to Cloudflare.
