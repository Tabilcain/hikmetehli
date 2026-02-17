# Cloudflare Deploy Runbook

## On kosullar

- Cloudflare hesabinda `hikmetehli.com` zone yonetim yetkisi
- `hikmetehli-site` Pages project yetkisi
- Node.js + npm

## 1) Kurulum

```bash
npm install
npx wrangler login
```

## 2) Pages project (ilk sefer)

```bash
npx wrangler pages project create hikmetehli-site
```

## 3) Production deploy

```bash
npm run deploy:cf
```

Komut otomatik olarak `npm run build` calistirir ve `dist/` klasorunu Pages'e yukler.

## 4) Domain kontrol

Pages -> `hikmetehli-site` -> Custom Domains:

- `hikmetehli.com`
- `www.hikmetehli.com`

SSL durumu `Active` olmadan production kontrolu yapma.

## 5) Yayindan sonra kontrol

- `https://hikmetehli.com`
- `https://www.hikmetehli.com`

Kontrol listesi:

- Hero metni: `Hikmetten Tefekkure Vesile`
- Sosyal baslik: `Farkli Mecralar, Ortak Tefekkur`
- Saatlik baslik: `Zamana gore degisen ayet ve hadisler`
- Widget/ana ekrana ekle/kurulum kilavuzu bolumleri yok

## 6) Sorun giderme

- Yetki hatasi: `npx wrangler whoami` ile login kontrol et.
- Eski dosya gorunuyorsa: tarayicida hard refresh + Cloudflare cache purge.
