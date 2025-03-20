import express from 'express';
const router = express.Router();

router.get('/cron', async (req, res) => {
    try {
        res.status(200).json({ message: 'Cron job executed successfully via scheduler' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/stop-cron', (req, res) => {
    try {
        if (global.scheduledCronJob) {
            global.scheduledCronJob.stop();
            res.status(200).json({ message: 'Cron job stopped successfully' });
        } else {
            res.status(400).json({ message: 'Cron job not running' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop cron job' });
    }
});

router.get('/start-cron', (req, res) => {
    try {
        if (global.scheduledCronJob) {
            global.scheduledCronJob.start();
            res.status(200).json({ message: 'Cron job started successfully' });
        } else {
            res.status(400).json({ message: 'Cron job not defined' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to start cron job' });
    }
});

export default router;
