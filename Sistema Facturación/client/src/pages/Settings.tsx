
import { Save, Building, FileDigit, Shield } from 'lucide-react';

export default function Settings() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Configuración del Sistema</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Administra los parámetros de la empresa y la facturación SAR</p>

            <div className="space-y-6">

                {/* Company Info */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3 items-center">
                        <Building className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-semibold text-slate-700 dark:text-white">Datos de la Empresa</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Legal</label>
                            <input type="text" defaultValue="Distribuidora Ejemplo S. de R.L." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Comercial</label>
                            <input type="text" defaultValue="Super Tienda 504" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RTN</label>
                            <input type="text" defaultValue="08011999123456" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                            <input type="text" defaultValue="+504 2233-4455" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dirección Principal</label>
                            <textarea defaultValue="Colonia Los Próceres, Tegucigalpa, M.D.C." rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* SAR Parameters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3 items-center">
                        <FileDigit className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-semibold text-slate-700 dark:text-white">Parámetros SAR (Secuencia de Facturación)</h2>
                    </div>
                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                                <p className="font-bold">Información Crítica</p>
                                <p>Estos cambios afectan directamente la numeración de documentos fiscales. Asegúrese de tener el documento de autorización válido.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clave de Autorización de Emisión (CAI)</label>
                                <input type="text" defaultValue="372E04-9F2844-434089-9A2276-857643-23" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rango Inicial</label>
                                <input type="text" defaultValue="000-001-01-00000001" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rango Final</label>
                                <input type="text" defaultValue="000-001-01-00002500" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha Límite Emisión</label>
                                <input type="date" defaultValue="2026-12-31" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        Descartar Cambios
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                        <Save className="w-4 h-4" />
                        Guardar Configuración
                    </button>
                </div>

            </div>
        </div>
    );
}
