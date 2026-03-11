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

Bu proje public/statik yayin mantigiyla calisir; admin paneli veya browser tabanli icerik duzenleme alani yoktur.
