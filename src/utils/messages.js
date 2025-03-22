export const generateRiskMessage = (risks) => {
    let message = '\n⛔ Mức độ rủi ro:\n';
    risks.forEach(({ level, name, description, value, score }) => {
        message += `Mức độ: ${level === "danger" ? "🔴 Danger" : "☣️ Warning"}\n`;
        message += `- ${name}\n`;
        message += `- 📄 Mô tả: ${description}\n`;
        if (value) message += `- 💯 Tỷ lệ nắm giữ: ${value}\n`;
        message += `- 📌 Điểm rủi ro: ${score}\n`;
    });
    return risks.length ? message : '\n💯 **Token Không có rủi ro** 💯\n';
};

export const generateTopHoldersMessage = (holders) => {
    let message = "\n📊**Top Holder Coin**\n";
    holders.slice(0, 11).forEach(holder => {
        message += `${holder.pct.toFixed(2)}%|`;
    });
    message += "\n📋 Kết Luận:\n";
    message += `- 💵 Liquidity Ratio: ${holders[0].pct.toFixed(2)}%\n`;
    message += `- 🥇 Top 1 Holders: ${holders[1].pct.toFixed(2)}%\n`;
    message += `- 🔟 Top 10 Holders: ${holders.slice(1, 11).reduce((sum, holder) => sum + holder.pct, 0).toFixed(2)}%\n`;
    message += `- 🔝 Top 20 Holders: ${holders.slice(1, 21).reduce((sum, holder) => sum + holder.pct, 0).toFixed(2)}%`;
    return message;
};

// export const generateTokenAnnouncement = (item, isNewToken = false, isViewToken = false) => `
// 🔔 ${isNewToken ? 'New Token' : ""} ${isViewToken ? 'View Most Token' : ""}
// ➤ CA: ${item.baseToken.address}
// 💎 Name: ${item.baseToken?.symbol || ""}
// 🔎 Chain: ${item.chainId}
// 🔗 [Geckoterminal](https://www.geckoterminal.com/solana/pools/${item.baseToken.address})
// 🔗 DEX: (${item.url || ""})
// 🏛️ Market Cap: ${item.marketCap ? item.marketCap.toLocaleString() : "0"}
// 💧 Liquidity: ${item.liquidity?.usd ? item.liquidity.usd.toLocaleString() : "0"}\n`;

export const generateTokenAnnouncement = (item, isNewToken = false, isViewToken = false) => {
    return {
        text: `
🔔 ${isNewToken ? 'New Token' : ""} ${isViewToken ? 'View Most Token' : ""}
➤ CA: ${item.baseToken.address}
💎 Name: ${item.baseToken?.symbol || ""}
🔎 Chain: ${item.chainId}
🏛️ Market Cap: ${item.marketCap ? item.marketCap.toLocaleString() : "0"}
💧 Liquidity: ${item.liquidity?.usd ? item.liquidity.usd.toLocaleString() : "0"}
        `,
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔗 Geckoterminal", url: `https://www.geckoterminal.com/solana/pools/${item.baseToken.address}` }],
                [{ text: "🔗 DEX", url: item.url || "https://example.com" }]
            ]
        }
    };
};


export const generateTelegramMessage = (data) => `
💰 Tổng Liquidity: ${parseFloat(data.totalLiquidityUSD).toLocaleString()}
📈 Phần trăm LP Locked: ${data.lpLockedPercentage > 50 ? '🟢' : '🔴'} ${data.lpLockedPercentage}%`;

export const generateToken1 = (item) => `
🚩 Score: ${item}`;
export const generatetotalHolders = (item) => `
💰 Holders: ${item}`;
export const generateMessageAds = (item) => `
📢Ads: ${item ? '✅' : '❌'}`;
export const generateMessageBoot = (item) => `
📢Boots: ${item.boosts?.active > 0 ? `${item.boosts?.active}⚡️` : '⚠️'}`;
export const generateMessageGtScore = (item) => `
✨Geckoterminal Score: ${item}`;