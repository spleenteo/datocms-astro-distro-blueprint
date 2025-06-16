# Come usare le icone

Attraverso il pacchetto astro:icon è possibile usare qualunque libreria gestita da [Iconify](https://iconify.design/docs/usage/svg/astro/).

Basta scegliere la libreri che ti interessa e installarna con:

`npm install @iconify-json/[iconoir]`

Ho scelto [Iconoir](https://icon-sets.iconify.design/iconoir/page-2.html?keyword=iconoir) totalmente a caso. Scegli le icone che interessano da questo link.

Poi in astro.config va importata la libreria (anche o più librerie) o solo alcune icone.

```js
integrations: [
    icon({
      include: {
        iconoir: ['*']
      },
    }),
  ]

```

Il componente, oltre al nome dell'icona, accetta props

```js
  <Icon name="iconoir:archery-match" size="50" color="red" />

  interface Props extends HTMLAttributes<"svg"> {
    /**
    * References a specific Icon
    */
    name: string;
    "is:inline"?: boolean;
    title?: string;
    desc?: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
  }
```

