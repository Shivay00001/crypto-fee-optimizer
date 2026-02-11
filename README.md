# Crypto Transaction Fee Optimizer 🚀

A real-time, privacy-focused web tool to track Bitcoin transaction fees and Ethereum gas prices. Built with pure HTML/CSS/JS for maximum speed and SEO performance.

## 🌟 Features

- **Real-Time Data**: Fetches data from basic public APIs (mempool.space for BTC, Public RPCs for ETH).
- **Smart Logic**: Automatically categorizes fees as Low (Green), Medium (Yellow), or High (Red).
- **No API Keys**: Uses free, public endpoints. No registration required.
- **Privacy First**: No tracking, no cookies, no user login.
- **Monetization Ready**: Pre-built slots for Google AdSense and Affiliate links.

## 🛠️ Setup & Deployment

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/crypto-fee-optimizer.git
    ```

2. **Configuration**
    Open `js/config.js` to customize:
    - **Affiliate Links**: Change `CONFIG.affiliates` URLs to your own referral links (e.g., Binance, Trust Wallet, Ledger).
    - **Ads**: Paste your Google AdSense code into `index.html` where indicated (`ad-header`, `ad-footer`).

3. **Local Testing**
    Simply open `index.html` in your browser. No server required.

## 💰 How to Earn

### 1. Affiliate Links

The tool includes a "Recommended Tools" section.

- **Wallets**: Hardware wallets (Ledger/Trezor) or software wallets.
- **Exchanges**: Binance, Coinbase, Bybit.
- **Edit**: Go to `js/config.js` and update the URLs.

### 2. Google AdSense

- Get your AdSense code snippet.
- Place it in `index.html` inside the `<div class="ad-placeholder">` divs.
- Uncomment the AdSense script tag in the `<head>` section.

## 🚀 Deploy to GitHub Pages (Free Hosting)

1. Upload files to a GitHub repository.
2. Go to **Settings** > **Pages**.
3. Under **Source**, select `main` branch.
4. Your site will be live at `https://yourusername.github.io/repo-name/`.

## 📄 License & Disclaimer

**Open Source MIT License**.
This tool provides estimates only. Always check your wallet before confirming transactions. We are not responsible for financial losses.
