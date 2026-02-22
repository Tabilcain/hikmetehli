# Library Content Guide

Bu dokuman `/kutuphane` icerigini guncellemek icin kullanilir.

## 1) PDF dosyasini ekle

Dosyayi bu klasore koy:

- `public/library/pdf/`

Dosya adini orijinal haliyle koruyabilirsin.

## 2) Kapak olustur (PDF ilk sayfa + WebP)

MacOS icin:

```bash
qlmanage -t -s 1200 -o /tmp/library-covers "public/library/pdf/Kitap Adi.pdf"
cp "/tmp/library-covers/Kitap Adi.pdf.png" "public/library/covers/Kitap Adi.png"
/opt/homebrew/bin/cwebp -q 82 "public/library/covers/Kitap Adi.png" -o "public/library/covers/Kitap Adi.webp"
```

## 3) Kataloga ekle

Dosya:

- `public/library/catalog.v1.json`

Yeni kayit formati:

```json
{
  "id": "dualar-006",
  "slug": "kitap-adi",
  "title": "Kitap Adi",
  "category": "Dualar",
  "language": "tr",
  "coverPathWebp": "library/covers/Kitap Adi.webp",
  "coverPathPng": "library/covers/Kitap Adi.png",
  "coverPath": "library/covers/Kitap Adi.png",
  "pdfPath": "library/pdf/Kitap Adi.pdf",
  "pageCount": 10,
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

Notlar:

- V1'de tek kategori vardir: `Dualar`
- Yazar/yayinevi alani yoktur
- `slug` benzersiz olmalidir
- PDF dosyasi 25 MiB altinda olmalidir

## 4) Dogrulama

```bash
npm run validate:library-catalog
```

## 5) Build ve deploy

```bash
npm run build
npm run deploy:cf
```
