
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
        message += `${holder.pct.toFixed(1)}%|`;
    });
    message += "\n📋 Kết Luận:\n";
    message += `- 💵 Liquidity Ratio: ${holders[0].pct.toFixed(1)}%\n`;
    message += `- 🥇 Top 1 Holders: ${holders[1].pct.toFixed(1)}%\n`;
    message += `- 🔟 Top 10 Holders: ${holders.slice(1, 11).reduce((sum, holder) => sum + holder.pct, 0).toFixed(1)}%\n`;
    message += `- 🔝 Top 20 Holders: ${holders.slice(1, 21).reduce((sum, holder) => sum + holder.pct, 0).toFixed(1)}%`;
    return message;
};
export const generateTokenAnnouncement = (item, isNewToken = false, isViewToken = false) => {
    // Biến link thành text có thể nhấp
    const formatUrlAsText = (url) => url ? `(${url})` : "N/A";
    // Định dạng số với dấu phẩy
    const formatNumber = (num) => (num ? Math.round(num).toLocaleString("de-DE") : "0");
    const liquidityUsd = item.liquidity?.usd ?? 0;  // Nếu undefined thì lấy 0
    const fdv = item.fdv ?? 1;  // Nếu undefined hoặc 0 thì đặt giá trị hợp lý để tránh lỗi chia 0
    const percentage = (fdv !== 0) ? (liquidityUsd / fdv) * 100 : 0;

    //time
    const pairCreatedAt = new Date(item.pairCreatedAt); // Chuyển timestamp thành Date
    const now = new Date(); // Lấy thời gian hiện tại
// Tính khoảng cách thời gian (đơn vị: milliseconds)
    const diffMs = now - pairCreatedAt;
// Chuyển đổi sang phút, giờ, ngày
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
// Xuất kết quả phù hợp
    let timeDiffString = "";
    if (diffDays > 0) {
        timeDiffString = `${diffDays}D`;
    } else if (diffHours > 0) {
        timeDiffString = `${diffHours}H`;
    } else {
        timeDiffString = `${diffMinutes}M`;
    }

    return `
🔔 ${isNewToken ? 'New Token' : ""} ${isViewToken ? 'View Most Token' : ""}
➤ CA: ${item.baseToken?.address || "N/A"}
💎 Name: ${item.baseToken?.symbol || "Unknown"}
🔎 Chain: ${item.chainId || "N/A"}
🔗 Geckoterminal: ${formatUrlAsText(`https://www.geckoterminal.com/solana/pools/${item.baseToken?.address || ""}`)}
🔗 DEX: ${formatUrlAsText(item.url)}
🏛️ Market Cap: ${formatNumber(item.marketCap)}
💧 Liquidity: ${formatNumber(item.liquidity?.usd)} 📌${Math.round(percentage)}% 
╰┈➤ Age: 🌱${timeDiffString} ▐▐ 📢Boots: ${item.boosts?.active > 0 ? `${item.boosts?.active}⚡️` : '⚠️'}`;
};
export const generateTelegramMessage = (data) => `
🔥Liquidity Burned: ${Math.round(data.totalLiquidityUSD).toLocaleString('de-DE')} ${data.lpLockedPercentage > 50 ? '🟢' : '🔴'} ${parseFloat(data.lpLockedPercentage).toFixed(0)}%`;

export const generatetotalHolders = (item) => `
💰 Holders: ${item.totalHolders} ▐▐ 🚩 Score: ${item.score}`;

export const generateMessageAds = (item) => `
📣Ads: ${item ? '✅' : '❌'}`;

const formatNumber = (num) =>
    num ? num.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "0";
export const generateMessageGtScore = (item) => `
✨Geckoterminal Score: ${formatNumber(item)}
`;