import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import usageTracker from '@/services/usageTracker';
import type { UsageMetric } from '@/types';

const DashboardView = () => {
  const metrics = useMemo<UsageMetric[]>(() => usageTracker.list(), []);

  const chartData = useMemo(
    () =>
      metrics.map((metric) => ({
        provider: metric.provider,
        calls: metric.totalCalls,
        tokens: metric.totalTokens
      })),
    [metrics]
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">Usage Dashboard</h1>
        <p className="text-sm text-black/60">Monitor API consumption across all connected providers.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.provider} className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
            <p className="text-xs uppercase tracking-wide text-black/50">{metric.provider}</p>
            <p className="text-2xl font-semibold mt-2">{metric.totalCalls}</p>
            <p className="text-xs text-black/40">Total Calls</p>
            <p className="text-sm text-black/60 mt-4">Tokens: {metric.totalTokens.toLocaleString()}</p>
            <p className="text-xs text-black/40 mt-2">Last Used: {new Date(metric.lastUsed).toLocaleString()}</p>
          </div>
        ))}
        {metrics.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-sm text-black/50">
            Generate code to start tracking usage metrics.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
        <h2 className="text-lg font-semibold mb-4">Calls by Provider</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55644a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#55644a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d7d2c8" />
              <XAxis dataKey="provider" stroke="#333" fontSize={12} />
              <YAxis stroke="#333" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="calls" stroke="#55644a" fillOpacity={1} fill="url(#colorCalls)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
