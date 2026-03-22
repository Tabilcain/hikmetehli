# Cloudflare Operations Playbook

Bu dokuman, bandwidth artisinin kokenini bulma, cache/HTTPS kurallarini dogrulama ve 4xx temizligini duzenli takip etme akisini standartlastirir.

## 1) Otomatik analiz raporu (Top URL, User-Agent, 4xx)

```bash
CF_API_TOKEN="<token>" \
CF_ZONE_ID="<zone-id>" \
CF_HOSTNAME="hikmetehli.com" \
CF_LOOKBACK_HOURS="168" \
npm run analyze:cf
```

Rapor dosyasi:

- `.artifacts/cloudflare/cloudflare-audit-<timestamp>.md`

Notlar:

- `CF_HOSTNAME` verilmezse zone icindeki tum hostlar analiz edilir.
- `CF_LOOKBACK_HOURS` varsayilan deger `168` (son 7 gun).
- Token minimum olarak GraphQL Analytics okuma yetkisine sahip olmali.

## 2) Cache ve HTTPS politikasi

Repo icinde aktif dosyalar:

- `public/_headers`
- `public/_redirects`

Bu dosyalarla uygulananlar:

1. `http -> https` zorlamasi
2. `www -> apex` kanonik yonlendirme
3. Statik dosyalarda uzun sureli cache (`/assets/*`, `/library/covers/*`)
4. Buyuk PDF dosyalarinda edge cache (`/library/pdf/*`)
5. JSON endpointlerde orta sureli edge cache
6. HTML shell'de kisa sureli cache
7. HSTS + temel security headers

## 3) Pageview dogrulama (SPA)

Route degisimlerinde event gonderimi:

- `src/components/RouteAnalyticsTracker.tsx`
- `src/lib/analytics.ts`

Davranis:

1. Her route degisiminde `hikmetehli:pageview` custom event'i gonderilir.
2. `VITE_GA_MEASUREMENT_ID` varsa otomatik GA4 script yuklenir.
3. GA4 icin `page_view` eventi, SPA route degisimlerinde manuel tetiklenir.

Env ornegi:

```bash
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## 4) 7 gun izleme hedefleri

1. `Cached requests rate` >= `%25`
2. `Page views / Visits` oraninda yukselis
3. Islek URL'lerde request basina byte degerinde dusus
4. `none (HTTP)` kategorisinin sifira inmesi
5. `5xx` oraninin sifirda kalmasi

## 5) Release oncesi kontrol

```bash
npm run build
npm run smoke:http
```

`smoke:http` asagidakileri otomatik denetler:

1. `_headers` cache/HSTS kurallari
2. `_redirects` HTTPS + kanonik host kurallari
3. SPA route'larinin 200 donmesi
4. PDF/cover/JSON asset erisimi
