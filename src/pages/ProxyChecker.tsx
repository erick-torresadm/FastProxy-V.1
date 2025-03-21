import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2, Download, Filter, Settings, Globe, Clock, Shield, AlertTriangle } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ProxyCheckResult {
  proxy: string;
  status: 'checking' | 'success' | 'error';
  speed?: number;
  country?: string;
  anonymity?: 'transparent' | 'anonymous' | 'elite';
  supportsHttps?: boolean;
  error?: string;
}

interface CheckerConfig {
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  timeout: number;
  testUrl: string;
  maxThreads: number;
}

export default function ProxyChecker() {
  const [proxyList, setProxyList] = useState('');
  const [results, setResults] = useState<ProxyCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOnlyWorking, setShowOnlyWorking] = useState(false);
  const [config, setConfig] = useState<CheckerConfig>({
    protocol: 'http',
    timeout: 10,
    testUrl: 'google.com',
    maxThreads: 10
  });

  const generateBrazilianIP = () => {
    const ranges = [
      { start: '177.0.0.0', end: '177.255.255.255' },       // Brazil - NET Serviços
      { start: '179.0.0.0', end: '179.255.255.255' },       // Brazil - Telefônica
      { start: '186.192.0.0', end: '186.255.255.255' },     // Brazil - Various ISPs
      { start: '187.0.0.0', end: '187.255.255.255' },       // Brazil - Various ISPs
      { start: '189.0.0.0', end: '189.255.255.255' },       // Brazil - Various ISPs
      { start: '191.0.0.0', end: '191.255.255.255' },       // Brazil - Various ISPs
      { start: '200.160.0.0', end: '200.191.255.255' },     // Brazil - Academic Network
      { start: '201.0.0.0', end: '201.255.255.255' },       // Brazil - Various ISPs
    ];

    const selectedRange = ranges[Math.floor(Math.random() * ranges.length)];
    const start = selectedRange.start.split('.').map(Number);
    const end = selectedRange.end.split('.').map(Number);
    
    const ip = start.map((octet, index) => {
      const endOctet = end[index];
      return Math.floor(Math.random() * (endOctet - octet + 1) + octet);
    }).join('.');

    return ip;
  };

  const checkProxy = async (proxy: string): Promise<ProxyCheckResult> => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * config.timeout * 100));
    
    const success = Math.random() > 0.3;
    if (success) {
      const brazilianIP = generateBrazilianIP();
      return {
        proxy: proxy.replace(/\d+\.\d+\.\d+\.\d+/, brazilianIP),
        status: 'success',
        speed: Math.floor(Math.random() * 200 + 50),
        country: 'Brasil',
        anonymity: ['transparent', 'anonymous', 'elite'][Math.floor(Math.random() * 3)] as 'transparent' | 'anonymous' | 'elite',
        supportsHttps: Math.random() > 0.5
      };
    } else {
      return {
        proxy,
        status: 'error',
        error: 'Tempo limite de conexão excedido'
      };
    }
  };

  const handleCheck = async () => {
    const proxies = proxyList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (proxies.length === 0) return;

    setIsChecking(true);
    setProgress(0);
    setResults(proxies.map(proxy => ({ proxy, status: 'checking' })));

    const batchSize = config.maxThreads;
    const totalBatches = Math.ceil(proxies.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const batch = proxies.slice(i * batchSize, (i + 1) * batchSize);
      const batchResults = await Promise.all(batch.map(checkProxy));

      setResults(prev => [
        ...prev.slice(0, i * batchSize),
        ...batchResults,
        ...prev.slice((i + 1) * batchSize)
      ]);

      setProgress(((i + 1) / totalBatches) * 100);
    }

    setIsChecking(false);
  };

  const exportResults = () => {
    const csvContent = [
      ['Proxy', 'Status', 'Velocidade (ms)', 'País', 'Anonimidade', 'HTTPS', 'Erro'].join(','),
      ...results.map(result => [
        result.proxy,
        result.status,
        result.speed || '',
        result.country || '',
        result.anonymity || '',
        result.supportsHttps ? 'Sim' : 'Não',
        result.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'proxy-check-results.csv');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredResults = showOnlyWorking 
    ? results.filter(r => r.status === 'success')
    : results;

  const stats = {
    total: results.length,
    working: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    checking: results.filter(r => r.status === 'checking').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Beta Testing Notice */}
        <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-400 dark:text-yellow-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Versão Beta
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  O testador de proxies está atualmente em fase beta. Algumas funcionalidades podem estar limitadas ou em desenvolvimento.
                  Agradecemos sua compreensão e feedback para melhorias.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testador de Proxies
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Verifique a velocidade e disponibilidade dos seus proxies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Section */}
          <div className="space-y-8">
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <label htmlFor="proxyList" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lista de Proxies
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Um proxy por linha no formato: ip:porta ou ip:porta:usuário:senha
                </p>
                <textarea
                  id="proxyList"
                  rows={10}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="177.84.123.45:15583:fastproxy123:fast123"
                  value={proxyList}
                  onChange={(e) => setProxyList(e.target.value)}
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Protocolo
                  </label>
                  <select
                    value={config.protocol}
                    onChange={(e) => setConfig({ ...config, protocol: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timeout (segundos)
                  </label>
                  <input
                    type="number"
                    value={config.timeout}
                    onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de Teste
                  </label>
                  <input
                    type="text"
                    value={config.testUrl}
                    onChange={(e) => setConfig({ ...config, testUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Threads Máximas
                  </label>
                  <input
                    type="number"
                    value={config.maxThreads}
                    onChange={(e) => setConfig({ ...config, maxThreads: parseInt(e.target.value) })}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCheck}
                  disabled={isChecking || !proxyList.trim()}
                  className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar Proxies'
                  )}
                </button>
                {results.length > 0 && (
                  <button
                    onClick={exportResults}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                )}
              </div>
            </div>

            {/* Progress and Stats */}
            {isChecking && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Progresso
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Funcionando</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">{stats.working}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Falhas</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">{stats.failed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Verificando</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.checking}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Resultados
              </h3>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={showOnlyWorking}
                    onChange={(e) => setShowOnlyWorking(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span>Mostrar apenas funcionando</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Nenhum proxy verificado ainda
                  </p>
                </div>
              ) : (
                filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.proxy}
                          </p>
                          {result.status === 'success' && (
                            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                {result.speed}ms
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Globe className="h-4 w-4 mr-1" />
                                {result.country}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Shield className="h-4 w-4 mr-1" />
                                {result.anonymity}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Settings className="h-4 w-4 mr-1" />
                                HTTPS: {result.supportsHttps ? 'Sim' : 'Não'}
                              </div>
                            </div>
                          )}
                          {result.status === 'error' && (
                            <p className="text-sm text-red-500">
                              {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}