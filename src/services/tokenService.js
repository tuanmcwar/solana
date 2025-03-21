import fetch from 'node-fetch';
import TokenModel from '../models/Token.js';
import {sendMessageToAllChats} from './telegramService.js';
import {
    generateRiskMessage,
    generateTelegramMessage,
    generateToken1,
    generatetotalHolders,
    generateTokenAnnouncement,
    generateMessageBoot,
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

export const fetchTokenDetails = async (chainId, tokenAddress) => {
    try {
        const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`);
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

export const processTokensProfile = async (mappingData) => {

    const results = await Promise.allSettled(
        mappingData
            .filter(m => m.chainId === 'solana')
            .map(async (item) => {
                const _detail = await fetchTokenDetails(item.chainId, item.tokenAddress);
                const _gecko = await fetchTokenGeckoterminal(item.tokenAddress);
                const _adsToken = await fetchGetAdsToken(item.tokenAddress);
                const _itemDetail = _detail[0];
                const _dataFinal = {..._itemDetail, gecko: _gecko, adsToken: _adsToken };
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
        // &&
        // item.gecko?.data?.attributes?.gt_score >= 30
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
            if (true) {
                const message = `${generateTokenAnnouncement(item)}
                ${generateTopHoldersMessage(rugCheckResult.topHolders)}

                ${generateToken1(rugCheckResult.score)}
                ${generateTelegramMessage(lpLocked)}
                ${generatetotalHolders(rugCheckResult.totalHolders)}
                ${generateMessageAds(item.adsToken.some(item => item?.type === 'tokenAd'))}
                ${generateMessageBoot(item)}
                ${generateMessageGtScore(item.gecko?.data?.attributes?.gt_score)}
                `;
                
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
// ${generateRiskMessage(rugCheckResult.risks)}

export const processTokensNew = async (mappingData, isNewToken = false) => {
    const detailsArr = await Promise.all(
        mappingData.map(item => fetchTokenDetails(item.chainId, item.tokenAddress))
    );
    const allDetails = detailsArr.flat();

    const filteredData = allDetails.filter(item =>
        item.chainId === 'solana' &&
        item.fdv > 100000 &&
        item.fdv < 500000000 &&
        item.volume?.h24 > 500000 &&
        item.liquidity?.usd > 10000 &&
        item.priceChange?.h24 > 0 &&
        item?.info?.socials?.length > 0 &&
        item.txns?.h24?.buys > 1000
    );

    for (const item of filteredData) {
        if(item?.baseToken?.address) {
            const rugCheckResult = await fetchTokenCheckInRug(item.baseToken.address);
            const lpLocked = calculateLPLocked(rugCheckResult.markets);
            const sumTop10Holder = (rugCheckResult?.topHolders || []).slice(0, 10).reduce((sum, holder) => sum + holder.pct, 0);
            const sumTop1Holder = parseFloat(rugCheckResult?.topHolders?.[0]?.pct || 0).toFixed(2);
            if (lpLocked.lpLockedPercentage >= 95 && sumTop10Holder < 50 && sumTop1Holder < 10) {
                const message = `${generateTokenAnnouncement(item, isNewToken)}${generateTopHoldersMessage(rugCheckResult.topHolders)}${generateRiskMessage(rugCheckResult.risks)}${generateTelegramMessage(lpLocked)}`;
                await sendMessageToAllChats(message);
            }
        }
    }
    return filteredData;
};

export const fetchNewTokens = async () => {
    try {
        const response = await fetch('https://api.rugcheck.xyz/v1/stats/new_tokens', {
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
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching new tokens:", error);
        return [];
    }
};

export const storeNewTokensInDB = async () => {
    try {
        const newTokens = await fetchNewTokens();
        if (!Array.isArray(newTokens)) {
            console.error("API new tokens không trả về mảng.");
            return;
        }
        for (const token of newTokens) {
            const tokenKey = token.id || token.tokenAddress || token.mint || JSON.stringify(token);
            const existingToken = await NewToken.findOne({ key: tokenKey });
            if (!existingToken) {
                try {
                    await new NewToken({
                        key: tokenKey,
                        data: token,
                        createdAt: new Date()
                    }).save();
                } catch (error) {
                    if (error.code === 11000) {
                        console.log(`Token '${tokenKey}' đã được lưu ở luồng khác. Bỏ qua.`);
                    } else {
                        throw error;
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error storing new tokens in DB:", error);
    }
};

export async function checkTokensInLast5Minutes() {
    try {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const tokens = await NewToken.find({
            createdAt: { $gte: fiveMinsAgo }
        });
        console.log(`Found ${tokens.length} tokens created in the last 5 minutes`);
        let mappingData = [];
        for (const tokenDoc of tokens) {
            const tokenKey = tokenDoc.key;
            const itemMapping = {
                chainId: 'solana',
                tokenAddress: tokenKey
            };
            mappingData.push(itemMapping);
        }
        await processTokensNew(mappingData, true);
    } catch (error) {
        console.error("Error in checkTokensInLast5Minutes:", error);
    }
}

export async function removeOldTokens() {
    try {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const result = await NewToken.deleteMany({
            createdAt: { $lte: fiveMinsAgo }
        });
    } catch (error) {
        console.error("Error in removeOldTokens:", error);
    }
}

export const mainProcess = async () => {
    try {
        const profiles = await fetchLatestProfiles();
        const mappingData = profiles.map(({ chainId, tokenAddress, url }) => ({ chainId, tokenAddress, url }));
        await processTokensProfile(mappingData, false);
    } catch (error) {
        console.error('Error in main process:', error);
    }
};
