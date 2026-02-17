package com.hikmetehli.app;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.PeriodicWorkRequestBuilder;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;

public class HourlyWidgetWorker extends Worker {
    private static final String UNIQUE_WORK_NAME = "hikmetehli_hourly_widget_refresh";

    public HourlyWidgetWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        HourlyWidgetProvider.updateAllWidgets(getApplicationContext());
        return Result.success();
    }

    public static void schedule(Context context) {
        PeriodicWorkRequest request = new PeriodicWorkRequestBuilder<HourlyWidgetWorker>(1, TimeUnit.HOURS)
            .build();

        WorkManager.getInstance(context)
            .enqueueUniquePeriodicWork(UNIQUE_WORK_NAME, ExistingPeriodicWorkPolicy.UPDATE, request);
    }
}
