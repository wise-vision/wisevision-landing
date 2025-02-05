# WiseVision Landing

## Stack

- [Next.js (React framework, SSR + serverless)](https://nextjs.org/) + Typescript
- [ThemeUI (CSS in JS)](https://theme-ui.com/)
- [Vercel (CI/CD, Deployment)](https://vercel.com/)

## Run locally

```
yarn
yarn dev

# whole with docusaurus
cd doc && yarn install && yarn build && cd .. && yarn dev

# or with docker
docker compose up --build
```

Strona będzie dostępna pod adresem [http://localhost:3000/](http://localhost:3000/)

## Konfiguracja zmiennych środowiskowych

Plik [.env](/.env) zawiera zmienne konfiguracyjne dla poszczególnych integracji wraz z domyślnymi
wartościami. Zmienne zaczynające się od `NEXT_PUBLIC_` są dostępne w przeglądarce i mogą być tam
udostępnianie. Zmienne kończące się `_SECRET` powinny być ustawiane w panelu
[Vercel](https://vercel.com/docs/environment-variables) i będą one dostępne tylko po stronie servera
(sekrety).

`NEXT_PUBLIC_GOOGLE_ANALYTICS` - Google Analytics `NEXT_PUBLIC_MAILCHIMP_URL` - MAILCHIMP
`NEXT_PUBLIC_LIVE_CHAT` - LiveChat tawk.to

`SMTP_HOST_SECRET` - Email SMTP `SMTP_USERNAME_SECRET` - Email user `SMTP_PASSWORD_SECRET` - Email
hasło

## Spis ważnych folderów/plików

- [./public/static](./public/static) - zawiera zdjęcia, ikony, video, .pdfy. Assety można linkować
  np. do obrazków poprzez `src=/static/...`
- [./src/pages](./src/pages) - zawiera pliki, które odpowiadają adresom stron -
  [Dokumentacja](https://nextjs.org/docs/basic-features/pages).
  - [./src/pages/api/contact](./src/pages/api/contact.tsx) - funkcja serverless/endpoint służący do
    obsługi formularza kontaktowego
  - [./src/pages/\_document](./src/pages/_document.tsx) - inicjalna struktura dokumentu HTML dla
    wszystkich stron (bez logiki JS)
  - [./src/pages/\_app](./src/pages/_app.tsx) - współdzielona logika dla wszystkich stron, np.
    SeoTagi/ThemeProvider
  - [./src/pages/404](./src/pages/404.tsx) - strona dla Page Not Found
  - [./src/pages/index](./src/pages/index.tsx) - strona główna
  - reszta stron, np: [./src/pages/do-pobrania](./src/pages/do-pobrania.tsx) - strona dostępna pod
    adresem `/do-pobrania`
- [./src/components](./src/components) - komponenty aplikacji
- [./src/routes](./src/routes.ts) - spis wszystkich ścieżek w aplikacji, używany do linkowania
  poszczególnych stron/assetów z jednego miejsca
- [./src/theme](./src/theme.tsx) - plik theme biblioteki
  [Theme UI](https://theme-ui.com/getting-started). Zawiera definicję kolorów, font sizów,
  spacingów, wariantów przycisków itd., które używane są w aplikacji.

## Theme UI

Biblioteka CSS in JS użyta do stylowania. Stanowi centralny punkt, gdzie zdefiniowane są wszystkie
kluczowe rzeczy dla designu, np. kolory, czcionki, warianty dla przycisków lub nagłówków. Kluczowe
zagadnienia

- [komponenty](https://theme-ui.com/getting-started#components)

```
<Box></Box> // tworzy element div
<Flex></Flex> // tworzy element div z `display: flex;`
<Heading as="h2" variant="largeHeading"></Heading> // tworzy element h2 ostylowany zgodnie z definicją z `theme.text.largeHeading`
```

- [sx prop](https://theme-ui.com/getting-started#sx-prop):

```
  <Box
    sx={{
      fontWeight: 'bold',
      fontSize: 4, // pobiera wartość z `theme.fontSizes[4]`
      color: 'primary', // pobiera wartość z `theme.colors.primary`
    }}>
    Hello
  </Box>

  // tworzy <button> o stylach zdefiniowanych w theme.buttons.primary i nadpisuje font-size
  <Button sx={{ fontSize: 7 }} />
```

- [style responsywne](https://theme-ui.com/getting-started#responsive-styles) w aplikacji, używane
  jest podejście mobile-first.

```
<Box
   sx={{
     // dodaje width 100% do wszystkich szerokości ekranu,
     // null omija breakpoint,
     // width 25% powyżej kolejnego breakpointu
     width: ['100%', null, '25%'],
   }}
 />
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.


## Clear the docker 

This will remove all your volumes

```bash
docker-compose down --volumes --remove-orphans
docker system prune --all --volumes --force
```
