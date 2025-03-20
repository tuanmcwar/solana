import fetch from 'node-fetch';
import TokenModel from '../models/Token.js';
import {sendMessageToAllChats} from './telegramService.js';
import {generateMessageAds, generateTokenAnnouncement} from '../utils/messages.js';
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

export const fetchGetAdsToken = async (tokenAddress) => {
    try {
        const response = await fetch(`https://api.dexscreener.com/orders/v1/${process.env.CHAIN}/${tokenAddress}`);
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


export const processTokensProfile = async (mappingData) => {

    const results = await Promise.allSettled(
        mappingData
            .filter(m => m.chainId === `${process.env.CHAIN}`)
            .map(async (item) => {
                const _detail = await fetchTokenDetails(item.chainId, item.tokenAddress);
                const _adsToken = await fetchGetAdsToken(item.tokenAddress);
                const _itemDetail = _detail[0];
                const _dataFinal = {..._itemDetail, adsToken: _adsToken };
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
        item.chainId === `${process.env.CHAIN}` &&
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
    );

    for (const item of filteredData) {
        const tokenKey = `${item.url}-${item.baseToken?.symbol}`;
        const newTokenData = pick(item, ['url', 'baseToken', 'fdv', 'volume', 'liquidity', 'priceChange', 'txns', 'rugCheckResult']);
        const existingTokenData = await TokenModel.findOne({ key: tokenKey });
        if (!existingTokenData) {
            const message = `${generateTokenAnnouncement(item)}
                ${generateMessageAds(item.adsToken.some(item => item?.type === 'tokenAd'))}`
                await sendMessageToAllChats(message);
                await new TokenModel({ key: tokenKey, data: newTokenData }).save();
        } else if (!isEqual(existingTokenData.data, newTokenData)) {
            existingTokenData.data = newTokenData;
            await existingTokenData.save();
        }
    }
    return filteredData;
};

export const mainProcessTokenOther = async () => {
    try {
        const profiles = await fetchLatestProfiles();
        const mappingData = profiles.map(({ chainId, tokenAddress, url }) => ({ chainId, tokenAddress, url }));
        await processTokensProfile(mappingData, false);
    } catch (error) {
        console.error('Error in main process:', error);
    }
};
