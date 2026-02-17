import { useState, useEffect, useRef } from 'react'
import { Plus, X, Package, TrendingUp, ShoppingBag, Coins, Sun, Moon } from 'lucide-react'
import './App.css'

const translations = {
    es: {
        logoName: 'Te lo compro',
        rateLabel: 'HNL',
        title: 'Calcula tu Compra.',
        subtitle: 'Cotiza tus productos de USA con precisión instantánea.',
        priceLabel: 'Precio del Producto (USD)',
        placeholder: '0.00',
        btnAdd: 'Agregar',
        emptyTitle: 'Tu lista está vacía',
        emptySubtitle: 'Agrega un artículo para ver el desglose total.',
        basePrice: 'Precio Base',
        taxLabel: 'Tasa (7.5%)',
        feeLabel: 'Imp (25%)',
        subtotal: 'Subtotal',
        totalAccumulated: 'Total Acumulado (USD)',
        totalPayable: 'Total Neto a Pagar',
        disclaimer: '*Tarifa por peso (libra) L.180.00 no incluida en el cálculo.',
    },
    en: {
        logoName: 'Buy it for me',
        rateLabel: 'HNL Rate',
        title: 'Calculate your Purchase.',
        subtitle: 'Quote your USA products with instant precision.',
        priceLabel: 'Product Price (USD)',
        placeholder: '0.00',
        btnAdd: 'Add',
        emptyTitle: 'Your list is empty',
        emptySubtitle: 'Add an item to see the total breakdown.',
        basePrice: 'Base Price',
        taxLabel: 'Tax (7.5%)',
        feeLabel: 'Fee (25%)',
        subtotal: 'Subtotal',
        totalAccumulated: 'Accumulated Total (USD)',
        totalPayable: 'Net Total to Pay',
        disclaimer: '*Weight fee (per pound) L.180.00 not included in the calculation.',
    }
};

function App() {
    const [items, setItems] = useState([]);
    const [price, setPrice] = useState('');
    const [exchangeRate, setExchangeRate] = useState(25.00);
    const [isShaking, setIsShaking] = useState(false);
    const [lang, setLang] = useState('es');
    const [darkMode, setDarkMode] = useState(false);
    const inputRef = useRef(null);

    const t = translations[lang];

    const TAX_RATE = 0.075;
    const COMMISSION_RATE = 0.25;

    useEffect(() => {
        const fetchRate = async () => {
            const API_KEY = '83a08876f60f4cc9850ae8b714c093cb';
            const URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&symbols=HNL`;

            try {
                const response = await fetch(URL);
                const data = await response.json();
                if (data && data.rates && data.rates.HNL) {
                    setExchangeRate(data.rates.HNL);
                    console.log('Tasa oficial actualizada:', data.rates.HNL);
                }
            } catch (error) {
                console.warn('Error con Open Exchange Rates, usando fallback:', error);
            }
        };
        fetchRate();
    }, []);

    const toggleLang = () => {
        setLang(prev => prev === 'es' ? 'en' : 'es');
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newVal = !prev;
            if (newVal) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            return newVal;
        });
    };

    const formatMoney = (amount, currency = 'USD') => {
        if (currency === 'USD') {
            return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return 'L. ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    };

    const calculateItem = (priceVal) => {
        const p = Math.max(0, parseFloat(priceVal));
        const tax = parseFloat((p * TAX_RATE).toFixed(4));
        const subtotalWithTax = p + tax;
        const commission = parseFloat((subtotalWithTax * COMMISSION_RATE).toFixed(4));
        const totalUsd = subtotalWithTax + commission;
        const totalHnl = totalUsd * exchangeRate;

        return {
            id: Date.now(),
            price: p,
            tax,
            commission,
            totalUsd: Math.max(0, totalUsd),
            totalHnl: Math.max(0, totalHnl)
        };
    };

    const addItem = () => {
        const parsedPrice = parseFloat(price);
        if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
            return;
        }

        const newItem = calculateItem(price);
        setItems([newItem, ...items]);
        setPrice('');
        inputRef.current?.focus();
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const totals = items.reduce((acc, item) => ({
        usd: acc.usd + item.totalUsd,
        hnl: acc.hnl + item.totalHnl
    }), { usd: 0, hnl: 0 });

    return (
        <div className="container">
            <button className="theme-switcher" onClick={toggleDarkMode}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <nav className="navbar">
                <a href="#" className="logo">
                    <div className="logo-icon"><Package size={22} strokeWidth={3} /></div>
                    <span className="logo-text" style={{ fontSize: '1.4rem', fontWeight: 900 }}>{t.logoName}</span>
                </a>
                <div className="nav-actions">
                    <div className="rate-badge">
                        <TrendingUp size={16} />
                        <span>{t.rateLabel} <strong>{exchangeRate.toFixed(2)}</strong></span>
                    </div>
                    <button className="lang-switcher" onClick={toggleLang}>
                        <img
                            src={lang === 'es' ? 'https://flagcdn.com/es.svg' : 'https://flagcdn.com/us.svg'}
                            alt={lang.toUpperCase()}
                            className="lang-flag-img"
                        />
                        {lang.toUpperCase()}
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <header className="main-header">
                    <h1 className="title-display">{t.title}</h1>
                    <p className="subtitle">{t.subtitle}</p>
                </header>

                <section className="input-card animate-fade-in">
                    <label htmlFor="product-price" className="input-label">{t.priceLabel}</label>
                    <div className="input-wrapper">
                        <div className="input-group">
                            <span className="currency-symbol">$</span>
                            <input
                                ref={inputRef}
                                type="number"
                                id="product-price"
                                placeholder={t.placeholder}
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                className={isShaking ? 'shake' : ''}
                                autoComplete="off"
                            />
                        </div>
                        <button onClick={addItem} className="btn-add">
                            <Plus size={20} strokeWidth={3} />
                            <span>{t.btnAdd}</span>
                        </button>
                    </div>
                </section>

                <section className="items-list">
                    {items.length === 0 ? (
                        <div className="empty-state animate-fade-in">
                            <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ color: '#64748b', fontSize: '1.25rem' }}>{t.emptyTitle}</h3>
                            <p style={{ color: '#94a3b8' }}>{t.emptySubtitle}</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id} className="ticket-wrapper animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <button className="btn-remove-circle" onClick={() => removeItem(item.id)}>
                                    <X size={16} strokeWidth={3} />
                                </button>

                                <div className="ticket-card">
                                    <div className="ticket-header">
                                        <span>{t.basePrice}</span>
                                        <span>{t.taxLabel}</span>
                                        <span>{t.feeLabel}</span>
                                    </div>

                                    <div className="ticket-body">
                                        <span>{formatMoney(item.price)}</span>
                                        <span className="text-danger">+{formatMoney(item.tax)}</span>
                                        <span className="text-success">+{formatMoney(item.commission)}</span>
                                    </div>

                                    <div className="ticket-divider"></div>

                                    <div className="ticket-footer">
                                        <div className="price-tag-usd">
                                            {t.subtotal} <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatMoney(item.totalUsd)}</span>
                                        </div>
                                        <div className="price-tag-hnl">
                                            {formatMoney(item.totalHnl, 'HNL')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>

            {items.length > 0 && (
                <div className="summary-container">
                    <section className="summary-card animate-fade-in">
                        <div className="summary-row">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Coins size={14} /> {t.totalAccumulated}
                            </span>
                            <strong>{formatMoney(totals.usd)}</strong>
                        </div>
                        <div className="final-row">
                            <span className="final-label">{t.totalPayable}</span>
                            <span className="final-price">{formatMoney(totals.hnl, 'HNL')}</span>
                        </div>
                        <span className="disclaimer">
                            {t.disclaimer}
                        </span>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
