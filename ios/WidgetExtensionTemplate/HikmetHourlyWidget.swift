import WidgetKit
import SwiftUI

struct HikmetHourlyEntry: TimelineEntry {
    let date: Date
    let verseTitle: String
    let verseText: String
    let hadithTitle: String
    let hadithText: String
}

struct HikmetHourlyProvider: TimelineProvider {
    func placeholder(in context: Context) -> HikmetHourlyEntry {
        HikmetHourlyEntry(
            date: Date(),
            verseTitle: "Bakara 2:269",
            verseText: "O, hikmeti dilediğine verir...",
            hadithTitle: "Buhari",
            hadithText: "İki nimet vardır ki insanların çoğu..."
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (HikmetHourlyEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<HikmetHourlyEntry>) -> Void) {
        let entry = makeEntry()
        let next = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date().addingTimeInterval(3600)
        completion(Timeline(entries: [entry], policy: .after(next)))
    }

    private func makeEntry() -> HikmetHourlyEntry {
        let content = WidgetContentEngine.pickHourlyContent()
        return HikmetHourlyEntry(
            date: Date(),
            verseTitle: content.verseReference,
            verseText: content.verseText,
            hadithTitle: content.hadithSource,
            hadithText: content.hadithText
        )
    }
}

struct HikmetHourlyWidgetEntryView: View {
    var entry: HikmetHourlyEntry

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(red: 0.05, green: 0.27, blue: 0.32), Color(red: 0.11, green: 0.38, blue: 0.44)],
                           startPoint: .topLeading,
                           endPoint: .bottomTrailing)
            VStack(alignment: .leading, spacing: 6) {
                Text(entry.date, style: .time)
                    .font(.system(size: 30, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                HStack(alignment: .top, spacing: 8) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.verseTitle)
                            .font(.caption2)
                            .foregroundStyle(Color.white.opacity(0.8))
                        Text(entry.verseText)
                            .font(.caption)
                            .foregroundStyle(.white)
                            .lineLimit(3)
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.hadithTitle)
                            .font(.caption2)
                            .foregroundStyle(Color.white.opacity(0.8))
                        Text(entry.hadithText)
                            .font(.caption)
                            .foregroundStyle(.white)
                            .lineLimit(3)
                    }
                }
            }
            .padding(12)
        }
        .widgetURL(URL(string: "hikmetehli://hourly"))
    }
}

struct HikmetHourlyWidget: Widget {
    let kind: String = "HikmetHourlyWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HikmetHourlyProvider()) { entry in
            HikmetHourlyWidgetEntryView(entry: entry)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryInline, .accessoryRectangular])
        .configurationDisplayName("Hikmet Ehli")
        .description("Saatlik ayet ve hadis")
    }
}
