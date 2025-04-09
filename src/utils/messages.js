
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

export const generateTopHoldersMessage = (rugCheckResult) => {
    const holders = rugCheckResult.topHolders;
    let message = `\n📊<b>Top Holder Coin</b>\n`;
    holders.slice(0, 11).forEach(holder => {
        const link = `https://solscan.io/account/${holder.owner}?remove_spam=true&exclude_amount_zero=true&token_address=${rugCheckResult.mint}#transfers`;
        const percent = holder.pct.toFixed(1);
        message += `<a href="${link}">${percent}%</a> | `;
    });

    message += "\n📋 <b>Kết Luận:</b>\n";
    message += `  ↳💵 <b> Liquidity Ratio:</b> ${holders[0].pct.toFixed(1)}%\n`;
    message += `  ↳🥇 <b> Top 1 Holders:</b> ${holders[1].pct.toFixed(1)}%\n`;
    message += `  ↳🔟 <b> Top 10 Holders:</b> ${holders.slice(1, 11).reduce((sum, holder) => sum + holder.pct, 0).toFixed(1)}%\n`;
    message += `  ↳🔝 <b> Top 20 Holders:</b> ${holders.slice(1, 21).reduce((sum, holder) => sum + holder.pct, 0).toFixed(1)}%\n`;
    message += `⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n`;
    message += `✈️✈️✈️✈️✈️ 𝓨𝗼𝘂'𝗿𝗲 𝗽𝗲𝗿𝗳𝗲𝗰𝘁! ✈️✈️✈️✈️✈️\n`;
    message += `( ๑‾̀◡‾́)✨🌼💫★💫🌼✨✨🌼💫★💫🌼✨\n`;
    message += `████████████████████████████████████ 100%`;



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

    // const website = item.info?.websites?.[0]?.url;
    // const twitter = item.info?.socials?.find(s => s.type === "twitter")?.url;
    // const telegram = item.info?.socials?.find(s => s.type === "telegram")?.url;
    //
    const website = item.info?.websites?.[0]?.url;
    const twitter = item.info?.socials?.find(s => s.type === "twitter")?.url;
    const telegram = item.info?.socials?.find(s => s.type === "telegram")?.url;

// Nếu twitter đúng định dạng cá nhân (không phải post/community), trích username
    const twitterUsername = twitter && /^https:\/\/x\.com\/[^\/]+$/.test(twitter)
        ? twitter.split('/').pop()
        : null;



    return `
 (づ ᴗ _ᴗ)づ♡ 💸💸💸💸💸💸💸💸💸💸💸💸${isNewToken ? 'New Token' : ""} ${isViewToken ? 'View Most Token' : ""}
 
➤ <b>CA:</b> <code>${item.baseToken?.address || "N/A"}</code>
💎 <b>Name:</b> ${item.baseToken?.symbol || "Unknown"}
🔎 <b>Chain:</b> ${item.chainId || "N/A"}
🔗 <b><a href="${item.url}"> DEX</a></b> || <b><a href="https://www.geckoterminal.com/solana/pools/${item.baseToken?.address}">Gecko</a></b> || <b><a href="https://mevx.io/solana/${item.pairAddress}">Mevx</a></b> || <b><a href="https://www.dextools.io/app/en/solana/pair-explorer/${item.pairAddress}">Dextool</a></b>
🏛️ <b>Market Cap:</b> ${formatNumber(item.marketCap)}
💧 <b>Liquidity:</b> ${formatNumber(item.liquidity?.usd)} 📌 ${Math.round(percentage)}% 
╰┈➤ <b>Age:</b> 🌱${timeDiffString} ▐▐ <b>📢Boots:</b> ${item.boosts?.active > 0 ? `${item.boosts?.active}⚡️` : '⚠️'}
📲 <b>Socials</b>
    ⤷${website ? `<b><a href="${website}">  Website</a></b>` : ''}   ${twitter ? `<b><a href="${twitter}">Twitter</a></b>${twitterUsername ? `<a href="https://t.me/phanes_bot?start=twitter_${twitterUsername}"> ⟫⏩⟪ </a>` : ''}` : ''}   ${telegram ? `<b><a href="${telegram}">Telegram</a></b>` : ''}`;
};


export const generateTelegramMessageLq = (item) => {
    const pumpFunMarket = item.markets?.find(m => m.marketType === "pump_fun_amm");

    const pumpValue = pumpFunMarket ? pumpFunMarket.mintLP : item.mint;
    const pumpValueLock = pumpFunMarket ? Number(pumpFunMarket.lp.lpLockedPct) : null;

    const rawNumber = pumpFunMarket
        ? Number(pumpFunMarket.lp.lpLockedUSD)
        : Number(item.totalMarketLiquidity);

    const roundedValue = Math.round(rawNumber).toLocaleString('en-US');
    const rawValue = `${roundedValue}`;

    const lockType = pumpFunMarket ? '💊 Pump_Fun' : '‼️ None';

    const lockStatus = pumpValueLock !== null && !isNaN(pumpValueLock)
        ? (pumpValueLock > 50 ? '🟢' : '🔴') + `${pumpValueLock.toFixed(0)}% ${lockType}`
        : `❓ Unknown Lock ${lockType}`;


    const creatorTokens = item.creatorTokens?.length ?? 0;

    const creatorInfoRugCheck = creatorTokens > 0 ? creatorTokens : 'None';


    return `
🔥 <b>Liquidity Burned</b>: <a href="https://solscan.io/token/${pumpValue}">${rawValue}</a>
🔐 <b>Lock Status</b>: ${lockStatus}
👨‍💻 <b>DEV</b>: <a href="https://solscan.io/account/${item.creator}#transfers">Solscan</a> || <a href="https://solscan.io/account/${item.creator}?remove_spam=true&exclude_amount_zero=true&token_address=${item.mint}#transfers">Dev Buy/Sell</a> 
🖨️ <b>Creator: </b><a href="https://solscan.io/account/${item.creator}?activity_type=ACTIVITY_SPL_INIT_MINT#defiactivities">Solscan</a>
💰 <b>Holders: </b><a href="https://solscan.io/token/${item.mint}#holders">${item.totalHolders}</a> ▐▐  🎯 Score: ${item.score}
☎️ <b><a href="https://t.me/spydefi_bot?start=${item.mint}">Check Call⌯⌲</a></b>`};

export const generateMessageAds = (item) => `
📣<b>Ads:</b> ${item.some(item => item?.type === 'tokenAd') ? '✅' : '❌'} ▐▐ 🔝 ${item.some(item => item?.type === 'communityTakeover') ? '✅' : '❌'}`;

const formatNumber = (num) =>
    num ? num.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "0";
export const generateMessageGtScore = (item) => `
✨<b>Geckoterminal Score:</b> ${formatNumber(item)}
`;