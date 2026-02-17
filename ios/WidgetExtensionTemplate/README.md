# iOS Widget Extension Template

Bu klasor, `WidgetKit` icin hazir widget dosya iskeletini icerir.

## Entegrasyon adimlari

1. Xcode icinde `App` projesine `Widget Extension` target ekle.
2. Bu klasordeki `HikmetHourlyWidget.swift` ve `WidgetContentEngine.swift` dosyalarini yeni target'a ekle.
3. `widget_verses.json` ve `widget_hadiths.json` dosyalarini extension target'a dahil et.
4. Widget `supportedFamilies` olarak:
   - `.systemSmall`
   - `.systemMedium`
   - `.accessoryInline`
   - `.accessoryRectangular`
5. Deeplink URL: `hikmetehli://hourly`
6. Build ve TestFlight icin archive al.

Not: Widget extension dosyalarini proje target'ina baglamadan derleme tamamlanmaz.
