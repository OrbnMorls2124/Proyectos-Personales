
import { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Printer, Save, User, ShoppingCart, ArrowLeft, Loader2, Package } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Types
interface Product {
    id: string;
    code: string;
    name: string;
    price: string; // Decimal comes as string from Prisma usually, or number
    taxRate: string;
    isExonerated: boolean;
    stock: number;
}

interface Client {
    id: string;
    name: string;
    rtn: string | null;
    email: string | null;
    address: string | null;
}

interface LineItem {
    productId: string;
    code: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    subtotal: number;
    total: number;
}

export default function NewInvoice() {
    const navigate = useNavigate();

    // State
    const [items, setItems] = useState<LineItem[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Search States
    const [productQuery, setProductQuery] = useState('');
    const [clientQuery, setClientQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [showProductResults, setShowProductResults] = useState(false);
    const [showClientResults, setShowClientResults] = useState(false);

    // Loading / Processing
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for click outside
    const clientSearchRef = useRef<HTMLDivElement>(null);
    const productSearchRef = useRef<HTMLDivElement>(null);

    // Constants
    const API_URL = 'http://localhost:3000/api';

    // --- Effects ---

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
                setShowClientResults(false);
            }
            if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
                setShowProductResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search Products Debounced
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (productQuery.length > 1) {
                try {
                    const res = await axios.get(`${API_URL}/products?q=${productQuery}`);
                    setProducts(res.data);
                    setShowProductResults(true);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setShowProductResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [productQuery]);

    // Search Clients Debounced
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (clientQuery.length > 1) {
                try {
                    const res = await axios.get(`${API_URL}/clients?q=${clientQuery}`);
                    setClients(res.data);
                    setShowClientResults(true);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setShowClientResults(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [clientQuery]);

    // --- Handlers ---

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(amount);
    };

    const addProductToInvoice = (product: Product) => {
        const existingDetails = items.find(i => i.productId === product.id);

        if (existingDetails) {
            // Increment
            updateQuantity(product.id, existingDetails.quantity + 1);
        } else {
            // Add new
            const unitPrice = parseFloat(product.price);
            const taxRate = parseFloat(product.taxRate);

            const newItem: LineItem = {
                productId: product.id,
                code: product.code,
                name: product.name,
                quantity: 1,
                unitPrice: unitPrice,
                taxRate: taxRate,
                subtotal: unitPrice * 1,
                total: (unitPrice * 1) * (1 + (product.isExonerated ? 0 : taxRate))
            };

            setItems([...items, newItem]);
        }
        setProductQuery('');
        setShowProductResults(false);
    };

    const updateQuantity = (productId: string, newQty: number) => {
        if (newQty < 1) return;

        setItems(items.map(item => {
            if (item.productId === productId) {
                const subtotal = item.unitPrice * newQty;
                // Re-calculate tax based on original rate (simplified)
                // Ideally we keep isExonerated in the item or fetch it, but here taxRate is stored
                const taxVal = subtotal * item.taxRate;

                return {
                    ...item,
                    quantity: newQty,
                    subtotal: subtotal,
                    total: subtotal + taxVal
                };
            }
            return item;
        }));
    };

    const removeItem = (productId: string) => {
        setItems(items.filter(i => i.productId !== productId));
    };

    const handleCreateInvoice = async () => {
        if (!selectedClient) {
            alert("Por favor seleccione un cliente");
            return;
        }
        if (items.length === 0) {
            alert("Agregue al menos un producto");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                clientId: selectedClient.id,
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity
                })),
                paymentMethod: 'CASH' // Hardcoded for now
            };

            const res = await axios.post(`${API_URL}/invoices`, payload);
            console.log("Invoice Created:", res.data);
            alert("Factura creada exitosamente");
            navigate('/invoices');
        } catch (err) {
            console.error(err);
            alert("Error al crear la factura");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Calculations ---

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.total - item.subtotal), 0);
    const total = subtotal + taxAmount;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4 bg-slate-50 dark:bg-slate-900">

            {/* Header Actions */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/invoices')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                        Nueva Factura
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Borrador
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 h-full overflow-hidden">

                {/* LEFT PANEL: Items List */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* Table Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex space-x-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="flex-1">Producto</div>
                        <div className="w-24 text-center">Cant.</div>
                        <div className="w-24 text-right">Precio</div>
                        <div className="w-24 text-right">Total</div>
                        <div className="w-10"></div>
                    </div>

                    {/* Items Container */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                <ShoppingCart className="w-16 h-16 mb-4" />
                                <p>No hay productos en la factura</p>
                                <p className="text-sm">Busca productos en el panel derecho</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.productId} className="flex items-center p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors group">
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.code}</div>
                                    </div>

                                    <div className="w-24 flex items-center justify-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                            className="w-16 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div className="w-24 text-right text-slate-600 dark:text-slate-400 font-mono text-sm">
                                        {formatCurrency(item.unitPrice)}
                                    </div>

                                    <div className="w-24 text-right font-bold text-slate-800 dark:text-indigo-400 font-mono text-sm">
                                        {formatCurrency(item.total)}
                                    </div>

                                    <div className="w-10 flex justify-end">
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Totals Section */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-mono">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-sm text-slate-600 dark:text-slate-400">
                            <span>Impuesto (ISV)</span>
                            <span className="font-mono">{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xl font-bold text-slate-800 dark:text-white">Total a Pagar</span>
                            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight font-mono">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Controls (Client & Search) */}
                <div className="w-full lg:w-96 flex flex-col gap-4">

                    {/* Client Card */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative z-20">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Datos del Cliente
                        </h3>

                        {/* Client Search */}
                        <div className="relative mb-4" ref={clientSearchRef}>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente (RTN / Nombre)..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                                    value={clientQuery}
                                    onChange={(e) => setClientQuery(e.target.value)}
                                    onFocus={() => setShowClientResults(true)}
                                />
                            </div>

                            {/* Dropdown Results */}
                            {showClientResults && clients.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                    {clients.map(client => (
                                        <button
                                            key={client.id}
                                            className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors"
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setClientQuery('');
                                                setShowClientResults(false);
                                            }}
                                        >
                                            <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{client.name}</div>
                                            <div className="text-xs text-slate-500">{client.rtn || 'Sin RTN'}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Client Info */}
                        {selectedClient ? (
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-indigo-900 dark:text-indigo-200">{selectedClient.name}</span>
                                    <button onClick={() => setSelectedClient(null)} className="text-indigo-400 hover:text-indigo-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                                    <p>RTN: {selectedClient.rtn || 'N/A'}</p>
                                    <p>{selectedClient.email}</p>
                                    <p>{selectedClient.address}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dashed">
                                Ningún cliente seleccionado
                            </div>
                        )}
                    </div>

                    {/* Product Search Card */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 relative z-10">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Agregar Productos
                        </h3>

                        <div className="relative mb-4" ref={productSearchRef}>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto (Código / Nombre)..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                                    value={productQuery}
                                    onChange={(e) => setProductQuery(e.target.value)}
                                    onFocus={() => setShowProductResults(true)}
                                    // Auto focus on load
                                    autoFocus
                                />
                            </div>

                            {/* Dropdown Results */}
                            {showProductResults && products.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors group"
                                            onClick={() => addProductToInvoice(product)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{product.name}</span>
                                                <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{formatCurrency(parseFloat(product.price))}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{product.code}</span>
                                                <span className={`text-xs ${product.stock < 5 ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                                    Stock: {product.stock}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions / Keypad can go here later */}
                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                disabled={isSubmitting || items.length === 0}
                                onClick={handleCreateInvoice}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Printer className="w-5 h-5" />
                                        EMITIR FACTURA
                                    </>
                                )}
                            </button>

                            <button
                                disabled={isSubmitting}
                                className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Guardar Borrador
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icons
function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" /><path d="m6 6 18 18" />
        </svg>
    )
}
