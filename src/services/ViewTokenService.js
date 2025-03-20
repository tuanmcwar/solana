import {calculateLPLocked, generateRandomIP} from "../utils/helpers.js";
import {
    generateRiskMessage,
    generateTelegramMessage,
    generateTokenAnnouncement,
    generateTopHoldersMessage
} from "../utils/messages.js";
import {sendMessageToAllChats} from "./telegramService.js";
import fetch from "node-fetch";
import {fetchTokenCheckInRug, fetchTokenDetails} from "./tokenService.js";
import ViewToken from "../models/ViewToken.js";

import pkg from 'lodash';

const { pick, isEqual } = pkg;

export const fetchMostViewTokens = async () => {
    try {
        const response = await fetch('https://api.rugcheck.xyz/v1/stats/recent', {
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


export const processViewToken = async (mappingData) => {
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
        item.priceChange.m5 > -40 &&
        item.priceChange?.h24 > 0 &&
        item?.info?.socials?.length > 0 &&
        item.txns?.h24?.buys > 1000
    );

    for (const item of filteredData) {
        const tokenKey = `${item.url}-${item.baseToken?.symbol}`;
        const newTokenData = pick(item, ['url', 'baseToken', 'fdv', 'volume', 'liquidity', 'priceChange', 'txns', 'rugCheckResult']);
        const existingTokenData = await ViewToken.findOne({key: tokenKey});

        if (!existingTokenData) {
            const rugCheckResult = await fetchTokenCheckInRug(item.baseToken.address);
            const lpLocked = calculateLPLocked(rugCheckResult.markets);
            const sumTop10Holder = (rugCheckResult?.topHolders || []).slice(0, 10).reduce((sum, holder) => sum + holder.pct, 0);
            const sumTop1Holder = parseFloat(rugCheckResult?.topHolders?.[0]?.pct || 0).toFixed(2);
            if (lpLocked.lpLockedPercentage >= 95 && sumTop10Holder < 50 && sumTop1Holder < 10) {
                const message = `${generateTokenAnnouncement(item, false, true)}${generateTopHoldersMessage(rugCheckResult.topHolders)}${generateRiskMessage(rugCheckResult.risks)}${generateTelegramMessage(lpLocked)}`;
                await sendMessageToAllChats(message);
                await new ViewToken({key: tokenKey, data: newTokenData}).save();
            }
        } else if (!isEqual(existingTokenData.data, newTokenData)) {
            existingTokenData.data = newTokenData;
            await existingTokenData.save();
        }
    }
    return filteredData;
};

export const mainProcessMostViewToken = async () => {
    try {
        const tokens = await fetchMostViewTokens();
        let mappingData = [];
        for (const tokenDoc of tokens) {
            const tokenKey = tokenDoc.mint;
            const itemMapping = {
                chainId: 'solana',
                tokenAddress: tokenKey
            };
            mappingData.push(itemMapping);
        }
        await processViewToken(mappingData, false);
    } catch (error) {
        console.error('Error in main process:', error);
    }
};