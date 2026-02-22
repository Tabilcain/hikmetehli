# Hikmet Ehli

Hikmet Ehli web uygulamasi (`Vite + React + TypeScript`).

## Lokal gelistirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages deploy

Bu proje terminalden Cloudflare Pages'e deploy edilir.

1. Wrangler login:

```bash
npx wrangler login
```

2. Pages project olustur (ilk sefer):

```bash
npx wrangler pages project create hikmetehli
```

3. Deploy:

```bash
npm run deploy:cf
```

## Domain baglama

Cloudflare Pages panelinde `hikmetehli` projesine su domainleri bagla:

- `hikmetehli.com`
- `www.hikmetehli.com`

DNS kayitlari Pages'in verdigi degerlere gore guncellenmelidir.

## Not

`npm run lint` su anda projedeki eski `ui/*` dosyalarinda bulunan mevcut lint borclari nedeniyle temiz degil. Yayin kapisi olarak `npm run build` kullanilir.
