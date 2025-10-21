import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listUsage, summarizeUsage } from '@/services/usageTracker';
import type { UsageRecord, UsageSummary } from '@/types';
import './DashboardView.css';

const MOCK_DATA: UsageRecord = {
  id: 'mock',
  provider: 'openai',
  timestamp: new Date().toISOString(),
  promptTokens: 120,
  completionTokens: 220,
  costUSD: 0.15
};

export function DashboardView() {
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [summary, setSummary] = useState<UsageSummary>(() => summarizeUsage());

  useEffect(() => {
    const usageLog = listUsage();
    if (usageLog.length === 0) {
      setUsage([MOCK_DATA]);
    } else {
      setUsage(usageLog);
    }
    setSummary(summarizeUsage());
  }, []);

  const chartData = usage.reduce<Record<string, number>>((acc, record) => {
    acc[record.provider] = (acc[record.provider] ?? 0) + record.costUSD;
    return acc;
  }, {});

  const chartRows = Object.entries(chartData).map(([provider, value]) => ({ provider, value }));

  return (
    <div className="dashboard">
      <div className="dashboard__summary">
        <div>
          <h2>{summary.totalCalls}</h2>
          <p>Total API Calls</p>
        </div>
        <div>
          <h2>{summary.totalPromptTokens}</h2>
          <p>Prompt Tokens</p>
        </div>
        <div>
          <h2>{summary.totalCompletionTokens}</h2>
          <p>Completion Tokens</p>
        </div>
        <div>
          <h2>${summary.totalCostUSD.toFixed(2)}</h2>
          <p>Estimated Cost</p>
        </div>
      </div>

      <div className="dashboard__chart">
        <h3>Cost by Provider</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartRows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provider" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#55644a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard__table">
        <h3>Recent Usage</h3>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Prompt Tokens</th>
              <th>Completion Tokens</th>
              <th>Cost</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((record) => (
              <tr key={record.id}>
                <td>{record.provider}</td>
                <td>{record.promptTokens}</td>
                <td>{record.completionTokens}</td>
                <td>${record.costUSD.toFixed(2)}</td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardView;
