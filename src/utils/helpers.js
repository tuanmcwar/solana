export const randomByte = () => Math.floor(Math.random() * 256);
export const generateRandomIP = () => `${randomByte()}.${randomByte()}.${randomByte()}.${randomByte()}`;

export const calculateLPLocked = (markets) => {
    let totalLiquidityUSD = 0, totalLockedUSD = 0;
    if (markets && markets.length > 0) {
        markets.forEach(market => {
            totalLiquidityUSD += (market.lp.baseUSD || 0) + (market.lp.quoteUSD || 0);
            totalLockedUSD += market.lp.lpLockedUSD || 0;
        });
    }
    const lpLockedPercentage = totalLiquidityUSD ? ((totalLockedUSD / totalLiquidityUSD) * 100).toFixed(2) : 0;
    return {
        totalLiquidityUSD: totalLiquidityUSD.toFixed(2),
        totalLockedUSD: totalLockedUSD.toFixed(2),
        lpLockedPercentage,
    };
};
