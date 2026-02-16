
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { BarChart3, Receipt, Users, Settings, Package, Menu, X, LogOut } from 'lucide-react'
import Login from './pages/Login'
import NewInvoice from './pages/NewInvoice'
import InvoicesList from './pages/InvoicesList'
import Inventory from './pages/Inventory'
import Clients from './pages/Clients'
import SettingsPage from './pages/Settings'

// Placeholder components
const Dashboard = () => (
    <div className="p-6 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Panel Principal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-transform hover:scale-[1.02]">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Ventas del Día</h3>
                <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">L 12,450.00</p>
                <div className="mt-4 flex items-center text-sm text-green-500">
                    <span>+12% vs ayer</span>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-transform hover:scale-[1.02]">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Facturas Emitidas</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">24</p>
                <div className="mt-4 flex items-center text-sm text-slate-400">
                    <span>Última hace 5 min</span>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-transform hover:scale-[1.02]">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Alertas de Stock</h3>
                <p className="text-3xl font-bold mt-2 text-orange-500">5</p>
                <div className="mt-4 flex items-center text-sm text-orange-400">
                    <span>Requieren atención</span>
                </div>
            </div>
        </div>
    </div>
)

function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation();

    // Don't show layout on login page
    if (location.pathname === '/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                        FacturaPRO
                    </span>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    <NavLink to="/" icon={<BarChart3 size={20} />} label="Dashboard" active={location.pathname === '/'} />
                    <NavLink to="/invoices" icon={<Receipt size={20} />} label="Facturación" active={location.pathname.startsWith('/invoices')} />
                    <NavLink to="/inventory" icon={<Package size={20} />} label="Inventario" active={location.pathname === '/inventory'} />
                    <NavLink to="/clients" icon={<Users size={20} />} label="Clientes" active={location.pathname === '/clients'} />
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                        <NavLink to="/settings" icon={<Settings size={20} />} label="Configuración" active={location.pathname === '/settings'} />
                    </div>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-700">
                    <Link to="/login" className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors duration-200">
                        <LogOut size={20} className="mr-3" />
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center space-x-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Juan Cajero</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Sucursal Principal</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            JC
                        </div>
                    </div>
                </header>

                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}

const NavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string, active?: boolean }) => (
    <Link
        to={to}
        className={`
      flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
      ${active
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }
    `}
    >
        <span className={`mr-3 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        <span>{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
    </Link>
)

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/invoices" element={<InvoicesList />} />
                    <Route path="/invoices/new" element={<NewInvoice />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
