/**
 * Main Application Logic
 * Initializes data fetching, UI updates, and affiliate rendering.
 */

const App = {
    init: () => {
        console.log("Initializing Crypto Fee Optimizer...");
        App.renderAffiliates();
        App.updateAll();

        // Auto-refresh every 60s
        setInterval(App.updateAll, 60000);
    },

    updateAll: async () => {
        await Promise.all([
            App.updateBitcoin(),
            App.updateEthereum()
        ]);
    },

    updateBitcoin: async () => {
        App.setLoading('btc');
        const data = await ApiService.fetchBitcoinFees();

        if (!data) {
            App.setError('btc');
            return;
        }

        // Update Values
        document.getElementById('btc-slow').textContent = data.slow;
        document.getElementById('btc-standard').textContent = data.standard;
        document.getElementById('btc-fast').textContent = data.fast;

        // Smart Analysis
        const analysis = ApiService.analyzeCongestion(data.standard, 'bitcoin');
        App.updateStatus('btc', analysis);
    },

    updateEthereum: async () => {
        App.setLoading('eth');
        const data = await ApiService.fetchEthereumGas();

        if (!data) {
            App.setError('eth');
            return;
        }

        // Update Values
        document.getElementById('eth-slow').textContent = data.slow;
        document.getElementById('eth-standard').textContent = data.standard;
        document.getElementById('eth-fast').textContent = data.fast;

        // Smart Analysis
        const analysis = ApiService.analyzeCongestion(data.standard, 'ethereum');
        App.updateStatus('eth', analysis);
    },

    // --- UI Helpers ---

    updateStatus: (type, analysis) => {
        const badge = document.getElementById(`${type}-status`);
        const advice = document.getElementById(`${type}-advice`);
        const card = document.getElementById(`${type}-card`);

        // Update Badge
        badge.textContent = analysis.status.toUpperCase();
        badge.className = `status-badge status-${analysis.color}`;

        // Update Advice Text
        advice.textContent = analysis.text;

        // Optional: Add glow to card/border based on status (subtle)
        card.style.borderColor = `var(--${analysis.color})`;
    },

    setLoading: (type) => {
        // Optional: specific loading state if not using cached data
        // document.getElementById(`${type}-status`).textContent = 'Updating...';
    },

    setError: (type) => {
        document.getElementById(`${type}-status`).textContent = 'Error';
        document.getElementById(`${type}-status`).className = 'status-badge status-red';
        document.getElementById(`${type}-advice`).textContent = 'Failed to fetch data. Retrying...';
    },

    renderAffiliates: () => {
        const container = document.getElementById('affiliate-container');
        const { wallet, exchange } = CONFIG.affiliates;

        const markup = `
            <a href="${wallet.url}" target="_blank" rel="noopener noreferrer" class="affiliate-card">
                <div class="affiliate-info">
                    <h4>${wallet.name}</h4>
                    <p>${wallet.description}</p>
                </div>
                <div class="arrow">→</div>
            </a>
            <a href="${exchange.url}" target="_blank" rel="noopener noreferrer" class="affiliate-card">
                <div class="affiliate-info">
                    <h4>${exchange.name}</h4>
                    <p>${exchange.description}</p>
                </div>
                <div class="arrow">→</div>
            </a>
        `;

        container.innerHTML = markup;
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
