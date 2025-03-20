import express from 'express';
import { connectDB } from './services/db.js';
import {
    startSchedulerCheckMostViewToken,
    startSchedulerCheckNewToken,
    startSchedulerCheckTokenProfile,
    startSchedulerGetNewToken
} from './cron/scheduler.js';
import { PORT } from './config/config.js';

const app = express();

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();

    // Khởi chạy scheduler và lưu vào biến toàn cục để các route có thể truy cập
    global.scheduledCronJob = startSchedulerCheckTokenProfile();

    // global.scheduledMostViewToken = startSchedulerCheckMostViewToken();
    // global.scheduledGetNewToken = startSchedulerGetNewToken();
    // global.scheduledCheckCheckNewToken = startSchedulerCheckNewToken();
});
