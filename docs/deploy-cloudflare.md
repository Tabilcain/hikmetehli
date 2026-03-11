# Cloudflare Deploy Runbook

## On kosullar

- Cloudflare hesabinda `hikmetehli.com` zone yonetim yetkisi
- `hikmetehli` Pages project yetkisi
- Node.js + npm

## 1) Kurulum

```bash
npm install
npx wrangler login
```

Yetki durumunu kontrol etmek icin:

```bash
npx wrangler whoami
```

## 2) Pages project (ilk sefer)

```bash
npx wrangler pages project create hikmetehli
```

## 3) Production deploy

```bash
npm run deploy:cf
```

Komut otomatik olarak `npm run build` calistirir ve `dist/` klasorunu Pages'e yukler.

## 4) Domain kontrol

Pages -> `hikmetehli` -> Custom Domains:

- `hikmetehli.com`
- `www.hikmetehli.com`

SSL durumu `Active` olmadan production kontrolu yapma.

## 5) Yayindan sonra kontrol

- `https://hikmetehli.com`
- `https://www.hikmetehli.com`

Kontrol listesi:

- Hero metni: `Hikmetten Tefekkure Vesile`
- Sosyal baslik: `Farkli Mecralar, Ortak Tefekkur`
- Saatlik baslik: `Zamana göre değişen sahih hadisler.`
- Widget/ana ekrana ekle/kurulum kilavuzu bolumleri yok
- `/muasir`, `/selef-incileri`, `/kutuphane` route'lari 200 donuyor
- Ana HTML shell ve JSON endpoint'lerinde beklenen `cache-control` header'lari gorunuyor

## 6) Sorun giderme

- Yetki hatasi: `npx wrangler whoami` ile login kontrol et.
- Cloudflare paneli `workers-and-pages/overview` isteklerinde gecici `504` verebilir; bu tek basina deploy'un basarisiz oldugu anlamina gelmez.
- Deploy'dan sonra canli domainde yeni `/assets/index-*.js` hash'ini ve temel route'lari kontrol et.
- Eski dosya gorunuyorsa: tarayicida hard refresh + Cloudflare cache purge.
