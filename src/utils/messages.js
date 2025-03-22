
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

export const generateTokenAnnouncement = (item, isNewToken = false, isViewToken = false) => {
    const formatUrl = (url) => url?.replace(/\./g, "[.]") || "N/A"; // Làm mờ link
    const formatNumber = (num) => (num ? num.toLocaleString() : "0"); // Định dạng số

    return `
🔔 ${isNewToken ? 'New Token' : ""} ${isViewToken ? 'View Most Token' : ""}
➤ CA: ${item.baseToken?.address || "N/A"}
💎 Name: ${item.baseToken?.symbol || "Unknown"}
🔎 Chain: ${item.chainId || "N/A"}
🔗 Geckoterminal: https://www[.]geckoterminal.com/solana/pools/${item.baseToken?.address || ""}
🔗 DEX: ${formatUrl(item.url)}
🏛️ Market Cap: ${formatNumber(item.marketCap)}
💧 Liquidity: ${formatNumber(item.liquidity?.usd)}
  `;
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