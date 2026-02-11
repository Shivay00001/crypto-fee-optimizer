/**
 * API Handler for Crypto Fee Optimizer
 * Handles fetching, caching, and processing of fee data.
 */

const ApiService = {
    // --- Utilities ---

    /**
     * Get data from local storage with expiry check
     * @param {string} key 
     * @returns {object|null}
     */
    getFromCache: (key) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        try {
            const data = JSON.parse(cached);
            const now = Date.now();
            if (now - data.timestamp < CONFIG.cacheDuration) {
                console.log(`[Cache] Hit for ${key}`);
                return data.payload;
            }
        } catch (e) {
            console.error("Cache parse error", e);
        }
        return null;
    },

    /**
     * Save data to local storage
     * @param {string} key 
     * @param {object} payload 
     */
    saveToCache: (key, payload) => {
        const data = {
            timestamp: Date.now(),
            payload: payload
        };
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- Bitcoin Logic ---

    fetchBitcoinFees: async () => {
        // Check cache first
        const cached = ApiService.getFromCache('bitcoin_fees');
        if (cached) return cached;

        try {
            const response = await fetch(CONFIG.apis.bitcoin);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            // Structure data
            const result = {
                fast: data.fastestFee,
                standard: data.halfHourFee,
                slow: data.hourFee,
                unit: 'sat/vB'
            };

            ApiService.saveToCache('bitcoin_fees', result);
            return result;
        } catch (error) {
            console.error("Error fetching Bitcoin fees:", error);
            // Return null to handle UI error state
            return null;
        }
    },

    // --- Ethereum Logic ---

    fetchEthereumGas: async () => {
        const cached = ApiService.getFromCache('ethereum_fees');
        if (cached) return cached;

        // Try multiple RPCs if one fails
        for (const rpcUrl of CONFIG.apis.ethereum) {
            try {
                const response = await fetch(rpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        method: "eth_gasPrice",
                        params: [],
                        id: 1
                    })
                });

                if (!response.ok) continue;

                const data = await response.json();
                if (!data.result) continue;

                // Convert Hex to Gwei
                const gasWei = parseInt(data.result, 16);
                const gasGwei = Math.round(gasWei / 1e9);

                // Estimate variations (Public nodes usually just give one price, so we estimate)
                const result = {
                    fast: Math.round(gasGwei * 1.1),
                    standard: gasGwei,
                    slow: Math.max(1, Math.round(gasGwei * 0.9)), // Ensure not 0
                    unit: 'Gwei'
                };

                ApiService.saveToCache('ethereum_fees', result);
                return result;
            } catch (error) {
                console.warn(`RPC ${rpcUrl} failed:`, error);
                // Try next RPC
            }
        }

        console.error("All Ethereum RPCs failed");
        return null;
    },

    // --- Smart Analysis ---

    /**
     * Analyze fees to determine status (green/yellow/red)
     * @param {number} value Current fee
     * @param {string} type 'bitcoin' or 'ethereum'
     * @returns {object} { status: 'good'|'normal'|'high', text: string }
     */
    analyzeCongestion: (value, type) => {
        const thresholds = CONFIG.thresholds[type];

        if (value <= thresholds.low) {
            return { status: 'good', text: 'Low Congestion', color: 'green' };
        } else if (value <= thresholds.medium) {
            return { status: 'normal', text: 'Moderate Traffic', color: 'yellow' };
        } else {
            return { status: 'high', text: 'High Congestion', color: 'red' };
        }
    }
};
