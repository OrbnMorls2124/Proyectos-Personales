document.addEventListener('DOMContentLoaded', () => {
    const priceInput = document.getElementById('product-price');
    const addBtn = document.getElementById('add-btn');
    const itemsList = document.getElementById('items-list');
    const emptyState = document.getElementById('empty-state');
    const grandSummaryContainer = document.getElementById('grand-summary-container');
    const grandTotalUsdEl = document.getElementById('grand-total-usd');
    const grandTotalHnlEl = document.getElementById('grand-total-hnl');

    // Constants
    const TAX_RATE = 0.075; // 7.5%
    const COMMISSION_RATE = 0.25; // 25%
    let EXCHANGE_RATE = 25.00; // Default fallback

    // Fetch Real-time Exchange Rate (USD -> HNL)
    async function fetchExchangeRate() {
        const rateDisplay = document.getElementById('exchange-rate-display');
        try {
            // Using a free open API for exchange rates
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();

            if (data && data.rates && data.rates.HNL) {
                EXCHANGE_RATE = data.rates.HNL;

                // Update the badge in the UI
                if (rateDisplay) {
                    rateDisplay.style.transition = 'opacity 0.3s';
                    rateDisplay.style.opacity = '0';
                    setTimeout(() => {
                        rateDisplay.textContent = EXCHANGE_RATE.toFixed(2);
                        rateDisplay.style.opacity = '1';
                    }, 300);
                }
            }
        } catch (error) {
            console.warn('Error obtaining exchange rate, using default (25.00):', error);
        }
    }

    // Call immediately
    fetchExchangeRate();

    let items = [];

    function formatMoney(amount, currency = 'USD') {
        if (currency === 'USD') {
            return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return 'L. ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    function calculateItem(price) {
        const tax = price * TAX_RATE;
        const subtotalWithTax = price + tax;
        const commission = subtotalWithTax * COMMISSION_RATE;
        const totalUsd = subtotalWithTax + commission;
        const totalHnl = totalUsd * EXCHANGE_RATE;

        return {
            price,
            tax,
            commission,
            totalUsd,
            totalHnl
        };
    }

    function renderItems() {
        itemsList.innerHTML = '';

        if (items.length === 0) {
            itemsList.appendChild(emptyState);
            grandSummaryContainer.classList.add('hidden');
            return;
        }

        grandSummaryContainer.classList.remove('hidden');

        // Render each item
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'ticket-card';

            // Staggered animation
            card.style.animation = `slideIn 0.3s ease-out forwards`;

            card.innerHTML = `
                <button class="btn-remove-circle" onclick="window.removeItem(${index})" title="Eliminar">
                    <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
                
                <div class="ticket-header">
                    <span>Precio</span>
                    <span>Imp (7.5%)</span>
                    <span>Com (25%)</span>
                </div>
                
                <div class="ticket-body">
                    <span>${formatMoney(item.price)}</span>
                    <span style="color: #ef4444; font-size: 0.9em;">+${formatMoney(item.tax)}</span>
                    <span style="color: #10b981; font-size: 0.9em;">+${formatMoney(item.commission)}</span>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-total">
                    <div class="price-tag-usd">
                        Total USD: ${formatMoney(item.totalUsd)}
                    </div>
                    <div class="price-tag-hnl">
                        ${formatMoney(item.totalHnl, 'HNL')}
                    </div>
                </div>
            `;
            itemsList.appendChild(card);
        });

        updateTotals();
        lucide.createIcons();
    }

    function updateTotals() {
        const totalUsd = items.reduce((sum, item) => sum + item.totalUsd, 0);
        const totalHnl = items.reduce((sum, item) => sum + item.totalHnl, 0);

        grandTotalUsdEl.textContent = formatMoney(totalUsd);
        grandTotalHnlEl.textContent = formatMoney(totalHnl, 'HNL');
    }

    function addItem() {
        const price = parseFloat(priceInput.value);
        if (!price || price <= 0) {
            priceInput.classList.add('shake');
            setTimeout(() => priceInput.classList.remove('shake'), 300);
            return;
        }

        const calculated = calculateItem(price);
        // Add to beginning of array so new items appear at top
        items.unshift(calculated);

        priceInput.value = '';
        priceInput.focus();
        renderItems();
    }

    window.removeItem = function (index) {
        items.splice(index, 1);
        renderItems();
    };

    // Event Listeners
    addBtn.addEventListener('click', addItem);
    priceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    // Inline Animation Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .shake {
            animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(styleSheet);
});
