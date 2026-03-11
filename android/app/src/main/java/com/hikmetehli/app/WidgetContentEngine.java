package com.hikmetehli.app;

import android.content.Context;
import android.content.res.AssetManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;

public final class WidgetContentEngine {
    private static JSONArray hadithCache;

    private WidgetContentEngine() {}

    public static HourlyContent getHourlyContent(Context context) {
        ensureLoaded(context);
        int seed = getHourlySeed();

        if (hadithCache == null || hadithCache.length() == 0) {
            return HourlyContent.fallback();
        }

        int hadithIndex = (int) Math.floor(seededRandom(seed * 7 + 13) * hadithCache.length());

        try {
            JSONObject hadith = hadithCache.getJSONObject(hadithIndex);
            return new HourlyContent(
                hadith.optString("t", "Hadis yüklenemedi."),
                hadith.optString("s", ""));
        } catch (Exception ignored) {
            return HourlyContent.fallback();
        }
    }

    private static void ensureLoaded(Context context) {
        if (hadithCache != null) {
            return;
        }
        hadithCache = loadJsonArray(context.getAssets(), "widget_hadiths.json");
    }

    private static JSONArray loadJsonArray(AssetManager assets, String assetName) {
        try {
            InputStream stream = assets.open(assetName);
            BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
            reader.close();
            return new JSONArray(builder.toString());
        } catch (Exception ignored) {
            return null;
        }
    }

    private static int getHourlySeed() {
        Calendar now = Calendar.getInstance();
        return now.get(Calendar.YEAR) * 1000000
            + (now.get(Calendar.MONTH) + 1) * 10000
            + now.get(Calendar.DAY_OF_MONTH) * 100
            + now.get(Calendar.HOUR_OF_DAY);
    }

    private static double seededRandom(int seed) {
        double x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    public static class HourlyContent {
        public final String hadithText;
        public final String hadithSource;

        public HourlyContent(
            String hadithText,
            String hadithSource
        ) {
            this.hadithText = hadithText;
            this.hadithSource = hadithSource;
        }

        static HourlyContent fallback() {
            return new HourlyContent(
                "Saatlik hadis içeriği yüklenemedi.",
                ""
            );
        }
    }
}
