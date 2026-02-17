# Widget Implementation Notes

## Data Source

Widget icerigi backend kullanmadan uretilir.

- Ortak seed algoritmasi: `src/lib/hourlyContentEngine.ts`
- Export script: `npm run export:widget-data`
- Cikti dosyalari:
  - `native-shared/verses.compact.json`
  - `native-shared/hadiths.compact.json`
  - `android/app/src/main/assets/widget_verses.json`
  - `android/app/src/main/assets/widget_hadiths.json`
  - `ios/App/App/widget_verses.json`
  - `ios/App/App/widget_hadiths.json`

## Android

- Provider: `HourlyWidgetProvider`
- Worker: `HourlyWidgetWorker`
- Layout: `res/layout/widget_hourly_medium.xml`
- Widget config: `res/xml/hourly_widget_info.xml`
- Deeplink: `hikmetehli://hourly`

Not: Android lock screen widget destegi cihaz/launcher bagimlidir. Destek olmayan cihazlarda home widget kullanilir.

## iOS

`ios/WidgetExtensionTemplate` klasoru Swift WidgetKit template dosyalarini icerir.

Bu dosyalarin calisir hale gelmesi icin:
1. Xcode'da Widget Extension target eklenmeli.
2. Swift dosyalari ve JSON datalari bu target'a baglanmali.
3. App Group ve signing ayarlari yapilmali.

## Native Sync

```bash
npm run native:sync
```

Bu komut web build + widget data export + capacitor sync adimlarini tek seferde calistirir.
