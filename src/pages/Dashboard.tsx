import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { baserowApi } from '../lib/baserowApi';
import type { ProxyItem } from '../lib/baserowApi';
import { LogOut, Copy, Globe, Clock, User, RefreshCw, Moon, Sun, Menu, X, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FastProxyLogo } from '../components/FastProxyLogo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [proxies, setProxies] = useState<ProxyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadUserProxies = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError(null);
      const userProxies = await baserowApi.getUserProxies(user.email);
      setProxies(userProxies);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Não foi possível carregar os dados do proxy. Tente novamente mais tarde.');
      console.error('Failed to fetch proxy data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProxies();
    const interval = setInterval(loadUserProxies, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const ProxyCard = ({ proxy }: { proxy: ProxyItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-white" />
            <h3 className="text-lg font-medium text-white">Detalhes do Proxy</h3>
          </div>
          <div className="flex items-center space-x-2">
            {proxy.status === 'active' ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              proxy.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {proxy.status === 'active' ? 'ATIVO' : 'EXPIRADO'}
            </span>
          </div>
        </div>
        {proxy.name && (
          <div className="mt-2 flex items-center space-x-2 text-white text-sm">
            <User className="h-4 w-4" />
            <span>{proxy.name}</span>
          </div>
        )}
        {proxy.order && (
          <div className="mt-1 text-blue-100 text-sm">
            Pedido: {proxy.order}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Endereço IP</p>
                <p className="font-mono text-sm dark:text-dark-text-primary truncate">{proxy.ip}</p>
              </div>
              <button 
                onClick={() => handleCopy(proxy.ip, `ip-${proxy.id}`)}
                className="ml-2 p-1.5 hover:bg-gray-200 dark:hover:bg-dark-border rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="h-4 w-4 text-gray-500 dark:text-dark-text-secondary" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Porta</p>
                <p className="font-mono text-sm dark:text-dark-text-primary">{proxy.port}</p>
              </div>
              <button 
                onClick={() => handleCopy(proxy.port.toString(), `port-${proxy.id}`)}
                className="ml-2 p-1.5 hover:bg-gray-200 dark:hover:bg-dark-border rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="h-4 w-4 text-gray-500 dark:text-dark-text-secondary" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Usuário</p>
                <p className="font-mono text-sm dark:text-dark-text-primary truncate">{proxy.username}</p>
              </div>
              <button 
                onClick={() => handleCopy(proxy.username, `username-${proxy.id}`)}
                className="ml-2 p-1.5 hover:bg-gray-200 dark:hover:bg-dark-border rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="h-4 w-4 text-gray-500 dark:text-dark-text-secondary" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Senha</p>
                <p className="font-mono text-sm dark:text-dark-text-primary truncate">{proxy.password}</p>
              </div>
              <button 
                onClick={() => handleCopy(proxy.password, `password-${proxy.id}`)}
                className="ml-2 p-1.5 hover:bg-gray-200 dark:hover:bg-dark-border rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="h-4 w-4 text-gray-500 dark:text-dark-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100 dark:border-dark-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proxy.purchase_date && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Comprado em: {format(new Date(proxy.purchase_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-text-secondary">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                Expira em: {format(new Date(proxy.expires_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => handleCopy(`${proxy.ip}:${proxy.port}:${proxy.username}:${proxy.password}`, `full-${proxy.id}`)}
              className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copiar Formato IP</span>
            </button>
            <button
              onClick={() => handleCopy(`${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`, `auth-${proxy.id}`)}
              className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copiar Formato Auth</span>
            </button>
          </div>
        </div>

        {proxy.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Observações:</span> {proxy.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black transition-colors duration-200">
      <nav className="bg-gray-800 dark:bg-gray-900 shadow-sm border-b border-gray-700 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FastProxyLogo className="h-8" />
              <h1 className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent hidden sm:block">
                Painel de Proxy
              </h1>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={loadUserProxies}
                className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Atualizar</span>
              </button>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-md">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{user?.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-5 w-5" />
                        <span>Modo claro</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5" />
                        <span>Modo escuro</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={loadUserProxies}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Atualizar</span>
                  </button>
                  <div className="px-3 py-2 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="truncate">{user?.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Seus Proxies</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Última atualização: {format(lastUpdated, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md animate-fade-in">
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : proxies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {proxies.map((proxy) => (
              <ProxyCard key={proxy.id} proxy={proxy} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum proxy encontrado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Não foram encontradas informações de proxy para sua conta.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}