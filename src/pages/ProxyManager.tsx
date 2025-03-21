import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { baserowApi } from '../lib/baserowApi';
import { tagApi } from '../lib/tagApi';
import { TagSelector } from '../components/TagSelector';
import { ProxyTags } from '../components/ProxyTags';
import { Search, Filter, CheckSquare, Square, ChevronDown, ChevronUp, Tag as TagIcon } from 'lucide-react';
import type { ProxyItem } from '../lib/baserowApi';
import type { Tag } from '../lib/tagApi';

interface ProxyWithSelection extends ProxyItem {
  isSelected: boolean;
  tags: string[];
}

export default function ProxyManager() {
  const { user } = useAuth();
  const [proxies, setProxies] = useState<ProxyWithSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [expandedProxy, setExpandedProxy] = useState<string | null>(null);
  const [showTagSelector, setShowTagSelector] = useState<string | null>(null);

  const loadProxiesAndTags = async () => {
    if (!user?.email || !user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load proxies
      const userProxies = await baserowApi.getUserProxies(user.email);
      
      // Load tags for each proxy
      const proxiesWithTags = await Promise.all(
        userProxies.map(async (proxy) => {
          const tags = await tagApi.getProxyTags(proxy.id);
          return {
            ...proxy,
            isSelected: false,
            tags: tags.map(tag => tag.name)
          };
        })
      );
      
      setProxies(proxiesWithTags);
      
      // Collect all unique tags
      const uniqueTags = Array.from(
        new Set(proxiesWithTags.flatMap(proxy => proxy.tags))
      );
      setAllTags(uniqueTags);
      
    } catch (err) {
      console.error('Failed to load proxies and tags:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProxiesAndTags();
  }, [user]);

  const handleSelectProxy = (proxyId: string) => {
    setProxies(prev => prev.map(proxy => 
      proxy.id === proxyId ? { ...proxy, isSelected: !proxy.isSelected } : proxy
    ));
  };

  const handleSelectAllProxies = () => {
    const areAllSelected = proxies.every(proxy => proxy.isSelected);
    setProxies(prev => prev.map(proxy => ({ ...proxy, isSelected: !areAllSelected })));
  };

  const handleTagSelect = async (proxyId: string, tagName: string) => {
    try {
      const tag = await tagApi.createTag(user!.id, tagName, '#4B5563');
      await tagApi.addTagToProxy(proxyId, tag.id);
      
      setProxies(prev => prev.map(proxy => 
        proxy.id === proxyId 
          ? { ...proxy, tags: [...proxy.tags, tagName] }
          : proxy
      ));
      
      if (!allTags.includes(tagName)) {
        setAllTags(prev => [...prev, tagName]);
      }
      
      setShowTagSelector(null);
    } catch (err) {
      console.error('Error adding tag:', err);
      setError('Erro ao adicionar tag. Por favor, tente novamente.');
    }
  };

  const handleRemoveTag = async (proxyId: string, tagName: string) => {
    try {
      const tags = await tagApi.getTags(user!.id);
      const tagToRemove = tags.find(t => t.name === tagName);
      
      if (tagToRemove) {
        await tagApi.removeTagFromProxy(proxyId, tagToRemove.id);
        setProxies(prev => prev.map(proxy => 
          proxy.id === proxyId 
            ? { ...proxy, tags: proxy.tags.filter(t => t !== tagName) }
            : proxy
        ));
      }
    } catch (err) {
      console.error('Error removing tag:', err);
      setError('Erro ao remover tag. Por favor, tente novamente.');
    }
  };

  const filteredProxies = proxies.filter(proxy => {
    const matchesSearch = searchTerm === '' || 
      proxy.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => proxy.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const selectedCount = proxies.filter(p => p.isSelected).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciador de Proxies
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organize e gerencie seus proxies e tags
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Filters and Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar proxies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    multiple
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Proxy List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <button
                      onClick={handleSelectAllProxies}
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {proxies.every(p => p.isSelected) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proxy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredProxies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhum proxy encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProxies.map((proxy) => (
                    <React.Fragment key={proxy.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSelectProxy(proxy.id)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {proxy.isSelected ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {proxy.ip}:{proxy.port}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {proxy.username}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ProxyTags
                            tags={proxy.tags}
                            onRemoveTag={(tag) => handleRemoveTag(proxy.id, tag)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            proxy.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {proxy.status === 'active' ? 'Ativo' : 'Expirado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => setExpandedProxy(expandedProxy === proxy.id ? null : proxy.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            {expandedProxy === proxy.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedProxy === proxy.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  Gerenciar Tags
                                </h4>
                                <button
                                  onClick={() => setShowTagSelector(showTagSelector === proxy.id ? null : proxy.id)}
                                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                  <TagIcon className="h-4 w-4 mr-1" />
                                  {showTagSelector === proxy.id ? 'Cancelar' : 'Adicionar Tag'}
                                </button>
                              </div>
                              {showTagSelector === proxy.id && (
                                <TagSelector
                                  onTagSelect={(tag) => handleTagSelect(proxy.id, tag)}
                                  className="mt-4"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCount} proxy(ies) selecionado(s) de {proxies.length} total
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {allTags.length} tags disponíveis
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}