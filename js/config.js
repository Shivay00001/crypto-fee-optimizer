const CONFIG = {
    // API Endpoints
    apis: {
        bitcoin: 'https://mempool.space/api/v1/fees/recommended',
        ethereum: [
            'https://eth.llamarpc.com',
            'https://cloudflare-eth.com',
            'https://rpc.ankr.com/eth'
        ]
    },

    // Cache Settings (in milliseconds)
    cacheDuration: 60000, // 60 seconds

    // Smart Logic Thresholds
    thresholds: {
        bitcoin: {
            low: 20,    // sat/vB
            medium: 50  // sat/vB
        },
        ethereum: {
            low: 15,    // Gwei
            medium: 40  // Gwei
        }
    },

    // Affiliate Links (User Configurable)
    affiliates: {
        wallet: {
            name: "Trust Wallet",
            url: "https://trustwallet.com/download", // Replace with affiliate link
            description: "Best for mobile users"
        },
        exchange: {
            name: "Binance",
            url: "https://accounts.binance.com/register", // Replace with affiliate link
            description: "Low fee exchange"
        }
    },

    // Mock Mode for testing without fetching (set to false in production)
    debugValues: false
};
