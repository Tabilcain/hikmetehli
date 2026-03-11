# Security Checklist

Bu proje public/statik bir Cloudflare Pages uygulamasidir. Mevcut kapsamda login, admin paneli, dosya yukleme veya ozel kullanici API'si yoktur.

## Her release oncesi

- Repo icinde `.env`, secret, token veya API key bulunmadigini tara.
- Client bundle icine server-only anahtar sizmadigini kontrol et.
- `npm audit --omit=dev` calistir ve runtime/build zincirini etkileyen bulgulari gozden gecir.
- Prod bundle'da debug/dev-only yuzey birakma.
- Yeni route eklendiyse admin/auth olmadan hassas islem acmadigini kontrol et.

## Gelecekte auth veya admin eklenirse

- Gizli URL ile korunan admin route birakma; gercek auth zorunlu olsun.
- Tokenlari `localStorage` yerine guvenli cookie/httpOnly tasarimiyla ele al.
- Reset/login akislari hesap varligini ifsa etmesin.
- Hassas endpoint'lerde rate limiting zorunlu olsun.

## Gelecekte kullanici girdisi veya upload eklenirse

- XSS icin kullanici metnini sanitize et.
- Dosya yuklemelerinde tip ve boyut dogrulamasi yap.
- Hata mesajlarinda internal detay sizdirma.
