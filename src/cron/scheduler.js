import cron from 'node-cron';
import { mainProcess} from '../services/tokenService.js';
// import {mainProcessMostViewToken} from "../services/ViewTokenService.js";
import {mainProcessTokenOther} from "../services/tokenOtherService.js";

export const startSchedulerCheckTokenProfile = () => {
    return cron.schedule('*/2 * * * *', async () => {
        console.log(`[${new Date().toISOString()}] Run Scheduler check token profile ....`);
        if(process.env.OTHER_CHAIN === 1) {
            await mainProcessTokenOther();
        } else {
            await mainProcess();
        }
    });
};
// export const startSchedulerCheckTokenProfile = () => {
//     return cron.schedule('*/1 * * * *', async () => {
//         console.log(`[${new Date().toISOString()}] Run Scheduler check token profile ....`);
//
//             await mainProcess();
//
//     });
// };
//
// export const startSchedulerGetNewToken = () => {
//     return cron.schedule('*/1 * * * * *', async () => {
//         console.log(`[${new Date().toISOString()}] Run Scheduler get new token .....`);
//         await storeNewTokensInDB()
//     });
// };
//
// export const startSchedulerCheckNewToken = () => {
//     return cron.schedule('*/1 * * * *', async () => {
//         console.log(`[${new Date().toISOString()}] Run Scheduler check new token .....`);
//         await checkTokensInLast5Minutes();
//         await removeOldTokens();
//     });
// };
//
// export const startSchedulerCheckMostViewToken = () => {
//     return cron.schedule('*/1 * * * * *', async () => {
//         console.log(`[${new Date().toISOString()}] Run Scheduler check most view token .....`);
//         await mainProcessMostViewToken();
//     });
// };