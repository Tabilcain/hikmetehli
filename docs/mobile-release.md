# Mobile Release Flow

## 1. Build and Sync

```bash
npm install
npm run native:sync
```

Bu komutlar:
- Web production build alir
- Widget JSON verisini export eder
- Capacitor ile iOS/Android projelerini sync eder

## 2. iOS - TestFlight

1. `npx cap open ios`
2. Xcode'da signing ayarlarini yap (`com.hikmetehli.app`)
3. Product > Archive
4. Organizer > Distribute App > App Store Connect > TestFlight

## 3. Android - Internal Testing

1. `npx cap open android`
2. Android Studio'da `Build > Generate Signed Bundle / APK`
3. `AAB` dosyasini Google Play Console `Internal testing` kanalina yukle

## 4. Versioning

- Web: `package.json` version
- iOS: `MARKETING_VERSION`, `CURRENT_PROJECT_VERSION`
- Android: `versionName`, `versionCode`

## 5. Changelog Template

```md
## vX.Y.Z - YYYY-MM-DD
- Perf: iPhone animasyonlarinda hafif mod
- Widget: Saatlik sahih hadis home widget
- Install: iOS/Android ana ekrana ekleme kilavuzu
- Fix: ...
```
