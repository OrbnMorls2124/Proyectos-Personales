
import { useState, useEffect } from 'react';
import { Search, Plus, Package, Edit } from 'lucide-react';
import axios from 'axios';

interface Product {
    id: string;
    code: string;
    name: string;
    price: string;
    stock: number;
    taxRate: string;
    isExonerated: boolean;
}

export default function Inventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        code: '',
        name: '',
        price: '',
        taxRate: '0.15',
        stock: '',
        isExonerated: false
    });

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/products?q=${search}`);
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/products', {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                taxRate: parseFloat(newProduct.taxRate)
            });
            setIsModalOpen(false);
            setNewProduct({ code: '', name: '', price: '', taxRate: '0.15', stock: '', isExonerated: false });
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error al crear producto');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventario de Productos</h1>
                    <p className="text-slate-500 dark:text-slate-400">Administra tu catálogo y existencias</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 relative">
                <Search className="absolute left-7 top-6.5 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por código o nombre..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-500">Cargando inventario...</div>
                ) : products.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:border-indigo-500 transition-colors group relative">

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Package className="w-6 h-6" />
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {product.stock < 10 ? 'Bajo Stock' : 'En Stock'}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-500 font-mono mb-4">{product.code}</p>

                        <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">Precio Unitario</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    L {parseFloat(product.price).toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-0.5">Existencia</p>
                                <p className={`text-xl font-bold ${product.stock < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {product.stock}
                                </p>
                            </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-indigo-500 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-600">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Producto</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej. REF-001"
                                        value={newProduct.code}
                                        onChange={e => setNewProduct({ ...newProduct, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio (L)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0.00"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Descripción detallada..."
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Inicial</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Impuesto (ISV)</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newProduct.isExonerated ? '0' : newProduct.taxRate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '0') {
                                                setNewProduct({ ...newProduct, isExonerated: true, taxRate: '0' });
                                            } else {
                                                setNewProduct({ ...newProduct, isExonerated: false, taxRate: val });
                                            }
                                        }}
                                    >
                                        <option value="0.15">15% (General)</option>
                                        <option value="0.18">18% (Alcohol/Tabaco)</option>
                                        <option value="0">Exento (0%)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                                >
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
