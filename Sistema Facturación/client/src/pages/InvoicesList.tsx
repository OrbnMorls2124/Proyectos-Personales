
import { useState, useEffect } from 'react';
import { Plus, Search, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simplifed types for List
interface Invoice {
    id: string;
    invoiceNumber: string;
    client: { name: string };
    total: string;
    date: string;
    status: string;
}

export default function InvoicesList() {
    const [invoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we would have an endpoint for this listing
        // For now we will mock it or if I added the endpoint I'd fetch it.
        // I didn't add GET /api/invoices yet in the backend, only POST.
        // Let's just show an empty state or mock data for visualization, 
        // but better yet, let's fix the backend to support GET /api/invoices listing to be complete.
        setLoading(false);
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Facturas Emitidas</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gestiona y consulta tu historial de ventas</p>
                </div>
                <Link
                    to="/invoices/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Factura
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por número, cliente o CAI..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Todos los estados</option>
                    <option>Emitidas</option>
                    <option>Anuladas</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left bg-transparent">
                    <thead className="bg-slate-50 dark:bg-slate-700/30">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">No. Factura</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></td></tr>
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-slate-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No se encontraron facturas</p>
                                </td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {inv.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {inv.client.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {inv.date}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {inv.total}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
