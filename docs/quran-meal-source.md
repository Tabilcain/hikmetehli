# Quran Meal Source (Bulaç)

Bu projede `public/quran.json` içindeki `t` alanları (Türkçe meal), dış kaynaktan güncellenebilir.

## Kaynak formatı

Dosya UTF-8 plain text olmalı ve her satır şu formatta olmalı:

`sureNo|ayetNo|meal`

Örnek:

`2|255|Allah, O'ndan başka ilah olmayandır...`

## Güncelleme komutu

Varsayılan kaynak:

`/Users/myasirh/Downloads/tr.bulac.txt`

Komut:

```bash
npx tsx scripts/replace-quran-meal-from-bulac.mts
```

Özel dosya yolu vermek için:

```bash
npx tsx scripts/replace-quran-meal-from-bulac.mts /tam/yol/kaynak.txt
```

## Script davranışı

- Sadece meal alanını (`t`) günceller.
- `s`, `sn`, `an`, `a` alanlarını değiştirmez.
- `quran.json` ile kaynak dosya anahtarlarının (`sn|an`) birebir eşleşmesini zorunlu tutar.
- Fail-fast çalışır:
  - satır formatı bozuksa,
  - duplicate ayet anahtarı varsa,
  - toplam ayet sayısı 6236 değilse,
  - herhangi bir anahtar eksik/fazlaysa işlem durur.

## Fallback senkronizasyonu

Script ayrıca `src/data/verses.ts` içindeki fallback ayet listesinin `turkish` alanlarını da aynı meal kaynağıyla eşitler.

Bu sayede:

- ilk render sırasında,
- `quran.json` fetch başarısız olduğunda

ayet metinleri tutarlı kalır.

## Rollback

İstenmeyen sonuçta geri dönüş için:

```bash
git checkout -- public/quran.json src/data/verses.ts
```

veya ilgili commit'i revert edin.
