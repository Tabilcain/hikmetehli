import Foundation

struct HourlyWidgetContent {
    let hadithSource: String
    let hadithText: String
}

enum WidgetContentEngine {
    static func pickHourlyContent(date: Date = Date()) -> HourlyWidgetContent {
        let hadiths = loadArray(named: "widget_hadiths")

        guard !hadiths.isEmpty else {
            return HourlyWidgetContent(
                hadithSource: "Hadis",
                hadithText: "Saatlik içerik yüklenemedi."
            )
        }

        let seed = hourlySeed(for: date)
        let hadithIndex = Int(floor(seededRandom(seed * 7 + 13) * Double(hadiths.count)))
        let hadith = hadiths[hadithIndex]

        return HourlyWidgetContent(
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
