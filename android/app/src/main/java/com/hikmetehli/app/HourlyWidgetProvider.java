package com.hikmetehli.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class HourlyWidgetProvider extends AppWidgetProvider {

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        HourlyWidgetWorker.schedule(context);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        super.onUpdate(context, appWidgetManager, appWidgetIds);
        HourlyWidgetWorker.schedule(context);

        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, HourlyWidgetProvider.class));
        for (int id : ids) {
            updateAppWidget(context, manager, id);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        WidgetContentEngine.HourlyContent content = WidgetContentEngine.getHourlyContent(context);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_hourly_medium);
        views.setTextViewText(R.id.widget_time, new SimpleDateFormat("HH:mm", Locale.forLanguageTag("tr-TR")).format(new Date()));
        views.setTextViewText(R.id.widget_date, new SimpleDateFormat("d MMMM EEEE", Locale.forLanguageTag("tr-TR")).format(new Date()));

        String verseRef = content.verseSurahNo > 0
            ? content.verseSurah + " " + content.verseSurahNo + ":" + content.verseAyahNo
            : "Ayet";

        views.setTextViewText(R.id.widget_verse_title, verseRef);
        views.setTextViewText(R.id.widget_verse_text, content.verseText);
        views.setTextViewText(R.id.widget_hadith_title, content.hadithSource.isEmpty() ? "Hadis" : content.hadithSource);
        views.setTextViewText(R.id.widget_hadith_text, content.hadithText);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("hikmetehli://hourly"));
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context,
            101,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
