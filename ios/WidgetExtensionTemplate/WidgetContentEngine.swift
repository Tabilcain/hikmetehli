import Foundation

struct HourlyWidgetContent {
    let verseReference: String
    let verseText: String
    let hadithSource: String
    let hadithText: String
}

enum WidgetContentEngine {
    static func pickHourlyContent(date: Date = Date()) -> HourlyWidgetContent {
        let verses = loadArray(named: "widget_verses")
        let hadiths = loadArray(named: "widget_hadiths")

        guard !verses.isEmpty, !hadiths.isEmpty else {
            return HourlyWidgetContent(
                verseReference: "Ayet",
                verseText: "Saatlik içerik yüklenemedi.",
                hadithSource: "Hadis",
                hadithText: "Saatlik içerik yüklenemedi."
            )
        }

        let seed = hourlySeed(for: date)
        let verseIndex = Int(floor(seededRandom(seed) * Double(verses.count)))
        let hadithIndex = Int(floor(seededRandom(seed * 7 + 13) * Double(hadiths.count)))

        let verse = verses[verseIndex]
        let hadith = hadiths[hadithIndex]

        let surah = verse["s"] as? String ?? "Ayet"
        let surahNo = verse["sn"] as? Int ?? 0
        let ayahNo = verse["an"] as? Int ?? 0

        return HourlyWidgetContent(
            verseReference: surahNo > 0 ? "\(surah) \(surahNo):\(ayahNo)" : surah,
            verseText: verse["t"] as? String ?? "",
            hadithSource: hadith["s"] as? String ?? "Hadis",
            hadithText: hadith["t"] as? String ?? ""
        )
    }

    private static func loadArray(named: String) -> [[String: Any]] {
        guard let url = Bundle.main.url(forResource: named, withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let raw = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
            return []
        }
        return raw
    }

    private static func hourlySeed(for date: Date) -> Int {
        let c = Calendar.current.dateComponents([.year, .month, .day, .hour], from: date)
        let year = c.year ?? 0
        let month = c.month ?? 0
        let day = c.day ?? 0
        let hour = c.hour ?? 0
        return year * 1_000_000 + month * 10_000 + day * 100 + hour
    }

    private static func seededRandom(_ seed: Int) -> Double {
        let x = sin(Double(seed)) * 10000
        return x - floor(x)
    }
}
