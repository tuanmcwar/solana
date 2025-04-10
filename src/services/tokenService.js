import fetch from 'node-fetch';
import TokenModel from '../models/Token.js';
import {sendMessageToAllChats} from './telegramService.js';

import {
    generateRiskMessage,
    generateTelegramMessageLq,
    // generatetotalHolders,
    generateTokenAnnouncement,
    generateTopHoldersMessage, generateMessageAds, generateMessageGtScore

} from '../utils/messages.js';
import {calculateLPLocked, generateRandomIP} from '../utils/helpers.js';
import NewToken from '../models/NewToken.js';
import pkg from 'lodash';

const { pick, isEqual } = pkg;


export const fetchLatestProfiles = async () => {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching token profiles:", error);
        return [];
    }
};

export const fetchTokenGeckoterminal = async (tokenAddress) => {
    try {
        const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}/info`);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return {};
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching token details address: ${tokenAddress})`);
        return {};
    }
};
// export const fetchTokenGeckoterminal = async (tokenAddress, retryCount = 1) => {
//
//     try {
//         const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}/info`);
//
//         if (!response.ok) {
//             if (response.status === 429 && retryCount > 0) {
//                 console.warn(`Rate limited (429) geckoterminal for token ${tokenAddress}. Retrying in 30s...`);
//                 await delay(30000); // chờ 30 giây
//                 return await fetchTokenGeckoterminal(tokenAddress, retryCount - 1); // thử lại
//             } else {
//                 console.error(`HTTP error! status: ${response.status}`);
//                 return {};
//             }
//         }
//
//         const data = await response.json();
//         return data;
//
//     } catch (error) {
//         console.error(`Error fetching token details (address: ${tokenAddress}):`, error);
//         return {};
//     }
// };






export const fetchGetAdsToken = async (tokenAddress) => {
    try {
        const response = await fetch(`https://api.dexscreener.com/orders/v1/solana/${tokenAddress}`);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching token details address: ${tokenAddress})`);
        return [];
    }
};
// export const fetchGetAdsToken = async (tokenAddress, retryCount = 1) => {
//     try {
//         const response = await fetch(`https://api.dexscreener.com/orders/v1/solana/${tokenAddress}`);
//
//         if (!response.ok) {
//             if (response.status === 429 && retryCount > 0) {
//                 console.warn(`Rate limited (429) for token dexscreener tokenv1 ${tokenAddress}. Retrying in 30s...`);
//                 await delay(30000); // Delay 30s
//                 return await fetchGetAdsToken(tokenAddress, retryCount - 1); // Retry
//             } else {
//                 console.error(`HTTP error! status: ${response.status}`);
//                 return [];
//             }
//         }
//
//         const data = await response.json();
//         return data;
//
//     } catch (error) {
//         console.error(`Error fetching token details (address: ${tokenAddress}):`, error);
//         return [];
//     }
// };



export const fetchTokenDetails = async (chainId, tokenAddress) => {
    try {
        const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddress}`);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error fetching token details (chainId: ${chainId}, address: ${tokenAddress})`);
        return [];
    }
};

// export const fetchTokenDetails = async (chainId, tokenAddress, retryCount = 1) => {
//     try {
//         const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddress}`);
//
//         if (!response.ok) {
//             if (response.status === 429 && retryCount > 0) {
//                 console.warn(`Rate limited (429) for token dexscreener id ${tokenAddress} on chain ${chainId}. Retrying in 30s...`);
//                 await delay(30000); // Đợi 30 giây
//                 return await fetchTokenDetails(chainId, tokenAddress, retryCount - 1); // Gọi lại
//             } else {
//                 console.error(`HTTP error! status: ${response.status}`);
//                 return [];
//             }
//         }
//
//         const data = await response.json();
//         return Array.isArray(data) ? data : [];
//
//     } catch (error) {
//         console.error(`Error fetching token details (chainId: ${chainId}, address: ${tokenAddress}):`, error);
//         return [];
//     }
// };
//
export const fetchTokenCheckInRug = async (mint) => {
    try {
        const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {
            method: 'GET',
            headers: {
                'X-Forwarded-For': generateRandomIP(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching rug check for mint ${mint}:`, error);
        return [];
    }
};

// export const fetchTokenCheckInRug = async (mint, retryCount = 1) => {
//     try {
//         const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {
//             method: 'GET',
//             headers: {
//                 'X-Forwarded-For': generateRandomIP(),
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//             }
//         });
//
//         if (!response.ok) {
//             if (response.status === 429 && retryCount > 0) {
//                 console.warn(`Rate limited (429) for mint rugcheck ${mint}. Retrying in 30 seconds...`);
//                 await delay(30000); // Chờ 30 giây
//                 return await fetchTokenCheckInRug(mint, retryCount - 1); // Thử lại
//             } else {
//                 console.error(`HTTP error! status: ${response.status}`);
//                 return [];
//             }
//         }
//
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching rug check for mint ${mint}:`, error);
//         return [];
//     }
// };



export const processTokensProfile = async (mappingData) => {

    const results = await Promise.allSettled(
        mappingData
            .filter(m => m.chainId === 'solana')
            .map(async (item) => {
                const _detail = await fetchTokenDetails(item.chainId, item.tokenAddress);
                // const _gecko = await fetchTokenGeckoterminal(item.tokenAddress);

                const _adsToken = await fetchGetAdsToken(item.tokenAddress);
                const _itemDetail = _detail[0];
                const _dataFinal = {..._itemDetail, adsToken: _adsToken };/*gecko: _gecko,*/
                return _dataFinal;
            })
    );

    const detailsArr = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (failed.length) {
        console.error("Some token data failed to fetch:", failed);
    }

    const allDetails = detailsArr.flat();


    const filteredData = allDetails.filter(item =>
        item.chainId === 'solana' &&
        item.fdv > 10000 &&
        item.fdv < 2000000 &&
        item.volume?.h24 > 20000 &&
        item.liquidity?.usd > 10000 &&
        item.priceChange?.m5 > -70 &&
        item.priceChange?.h1 > -70 &&
        item.priceChange?.h24 > 0 &&
        item.priceChange?.h6 > 0 &&
        item?.info?.socials?.length > 0 &&
        item.txns?.h24?.buys > 300

        // item.adsToken.some(item => item?.type === 'tokenAd') &&
        // item.boosts?.active >0 &&
        // item.gecko?.data?.attributes?.gt_score >= 0
    );

    for (const item of filteredData) {
        const tokenKey = `${item.url}-${item.baseToken?.symbol}`;
        const newTokenData = pick(item, ['url', 'baseToken', 'fdv', 'volume', 'liquidity', 'priceChange', 'txns', 'rugCheckResult']);
        const existingTokenData = await TokenModel.findOne({ key: tokenKey });
        if (!existingTokenData) {
            const rugCheckResult = await fetchTokenCheckInRug(item.baseToken.address);
            const lpLocked = calculateLPLocked(rugCheckResult.markets);
            const sumTop1Holder = parseFloat(rugCheckResult?.topHolders?.[0]?.pct || 0).toFixed(2);
            const sumTop10Holder = (rugCheckResult?.topHolders || []).slice(1, 11).reduce((sum, holder) => sum + holder.pct, 0);
            const sumTop20Holder = (rugCheckResult?.topHolders || []).slice(1, 21).reduce((sum, holder) => sum + holder.pct, 0);
            const scoreRugCheck = (rugCheckResult.score);
            const totalHoldersRugCheck = (rugCheckResult.totalHolders);
            // điều kiện timestamp
            const THIRTY_MINUTES = 30 * 60 * 1000; // 30 phút (milliseconds)
            const now = Date.now(); // Lấy timestamp hiện tại
            // if (true) {
                if (
                    sumTop1Holder < 30 &&
                    sumTop10Holder  < 30 &&
                    sumTop20Holder < 40  &&
                    scoreRugCheck < 1000 &&
                    (now - item.pairCreatedAt) < THIRTY_MINUTES
                    
                    
                    
                     /*&&&&
                    lpLocked.lpLockedPercentage >= 50 &&
                    totalHoldersRugCheck > 500*/) {

                const message = `${generateTokenAnnouncement(item)}
                ${generateMessageAds(item.adsToken)}
                ${generateTelegramMessageLq(rugCheckResult)}
                ${generateTopHoldersMessage(rugCheckResult)}
                `;
                // console.log(message);

                await sendMessageToAllChats(message);
                await new TokenModel({ key: tokenKey, data: newTokenData }).save();
            }
        } else if (!isEqual(existingTokenData.data, newTokenData)) {
            existingTokenData.data = newTokenData;
            await existingTokenData.save();
        }
    }
    return filteredData;
};
// ${generateTelegramMessageLq(lpLocked)}
// ${generatetotalHolders(rugCheckResult)}

// ${generateMessageGtScore(item.gecko?.data?.attributes?.gt_score)}

// ${generateMessageAds(item.adsToken.some(item => item?.type === 'tokenAd'))}
// ${generateRiskMessage(rugCheckResult.risks)}


export const mainProcess = async () => {
    try {

        const profiles = await fetchLatestProfiles();
        const mappingData = profiles.map(({ chainId, tokenAddress, url }) => ({ chainId, tokenAddress, url }));

        // console.log(`[${new Date().toISOString()}] mappingData`,mappingData);

        await processTokensProfile(mappingData, false);
    } catch (error) {
        console.error('Error in main process:', error);
    }
};



