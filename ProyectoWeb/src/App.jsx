import { useState, useEffect, useRef } from 'react'
import { Plus, X, Package, TrendingUp, ShoppingBag, Coins } from 'lucide-react'
import './App.css'

function App() {
    const [items, setItems] = useState([]);
    const [price, setPrice] = useState('');
    const [exchangeRate, setExchangeRate] = useState(25.00);
    const [isShaking, setIsShaking] = useState(false);
    const inputRef = useRef(null);

    // Constants (Exactly as approved in previous versions)
    const TAX_RATE = 0.075;      // 7.5%
    const COMMISSION_RATE = 0.25; // 25%

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
            <nav className="navbar">
                <a href="#" className="logo">
                    <div className="logo-icon"><Package size={22} strokeWidth={3} /></div>
                    <span className="logo-text" style={{ fontSize: '1.4rem', fontWeight: 900 }}>Te lo compro</span>
                </a>
                <div className="rate-badge">
                    <TrendingUp size={16} />
                    <span>HNL <strong>{exchangeRate.toFixed(2)}</strong></span>
                </div>
            </nav>

            <main className="main-content">
                <header className="main-header">
                    <h1 className="title-display">Calcula tu Compra.</h1>
                    <p className="subtitle">Cotiza tus productos de USA con precisión instantánea.</p>
                </header>

                <section className="input-card animate-fade-in">
                    <label htmlFor="product-price" className="input-label">Precio del Producto (USD)</label>
                    <div className="input-wrapper">
                        <div className="input-group">
                            <span className="currency-symbol">$</span>
                            <input
                                ref={inputRef}
                                type="number"
                                id="product-price"
                                placeholder="0.00"
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
                            <span>Agregar</span>
                        </button>
                    </div>
                </section>

                <section className="items-list">
                    {items.length === 0 ? (
                        <div className="empty-state animate-fade-in">
                            <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ color: '#64748b', fontSize: '1.25rem' }}>Tu lista está vacía</h3>
                            <p style={{ color: '#94a3b8' }}>Agrega un artículo para ver el desglose total.</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id} className="ticket-wrapper animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <button className="btn-remove-circle" onClick={() => removeItem(item.id)}>
                                    <X size={16} strokeWidth={3} />
                                </button>

                                <div className="ticket-card">
                                    <div className="ticket-header">
                                        <span>Precio Base</span>
                                        <span>Tasa (7.5%)</span>
                                        <span>Imp (25%)</span>
                                    </div>

                                    <div className="ticket-body">
                                        <span>{formatMoney(item.price)}</span>
                                        <span className="text-danger">+{formatMoney(item.tax)}</span>
                                        <span className="text-success">+{formatMoney(item.commission)}</span>
                                    </div>

                                    <div className="ticket-divider"></div>

                                    <div className="ticket-footer">
                                        <div className="price-tag-usd">
                                            Subtotal <span style={{ color: '#1e293b', fontWeight: 700 }}>{formatMoney(item.totalUsd)}</span>
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
                                <Coins size={14} /> Total Acumulado (USD)
                            </span>
                            <strong>{formatMoney(totals.usd)}</strong>
                        </div>
                        <div className="final-row">
                            <span className="final-label">Total Neto a Pagar</span>
                            <span className="final-price">{formatMoney(totals.hnl, 'HNL')}</span>
                        </div>
                        <span className="disclaimer">
                            *Tarifa por peso (libra) L.180.00 no incluida en el cálculo.
                        </span>
                    </section>
                </div>
            )}
        </div>
    )
}

export default App
