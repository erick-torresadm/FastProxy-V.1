import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { baserowApi } from '../lib/baserowApi';
import { useQuery } from 'react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();

  const { data: proxies = [], isLoading } = useQuery(
    ['proxies', user?.email],
    () => user?.email ? baserowApi.getUserProxies(user.email) : Promise.resolve([]),
    {
      enabled: !!user?.email,
    }
  );

  // Calculate statistics
  const totalProxies = proxies.length;
  const activeProxies = proxies.filter(proxy => proxy.status === 'active').length;
  const expiringProxies = proxies.filter(proxy => {
    const expiryDate = new Date(proxy.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }).length;

  // Prepare data for charts
  const statusData = [
    { name: 'Ativos', value: activeProxies },
    { name: 'Expirados', value: totalProxies - activeProxies },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  // Generate sample usage data for the last 7 days
  const usageData = Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'dd/MM', { locale: ptBR }),
    usage: Math.floor(Math.random() * 100),
  }));

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Análise de Proxies
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visão geral do desempenho e status dos seus proxies
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total de Proxies"
            value={totalProxies}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Proxies Ativos"
            value={activeProxies}
            icon={Activity}
            color="bg-green-500"
          />
          <StatCard
            title="Proxies Expirando"
            value={expiringProxies}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Taxa de Atividade"
            value={`${Math.round((activeProxies / totalProxies) * 100)}%`}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Distribuição de Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Usage Over Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Uso ao Longo do Tempo
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    name="Uso (%)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proxy Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Desempenho dos Proxies
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proxies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="username"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="port"
                    name="Porta"
                    fill="#6366F1"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}