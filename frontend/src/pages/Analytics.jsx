import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  FileText, 
  Loader2, 
  AlertCircle
} from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChartData = async () => {
    try {
      const statsRes = await analyticsAPI.getStats();
      setStats(statsRes.data);

      const statusRes = await analyticsAPI.getStatusChart();
      setStatusData(statusRes.data);

      const deptRes = await analyticsAPI.getDeptChart();
      setDeptData(deptRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch statistical reporting records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  // Colors for Status Pie Chart
  const STATUS_COLORS = {
    submitted: '#94a3b8',    // Slate
    under_review: '#3b82f6', // Blue
    accepted: '#22c55e',     // Green
    rejected: '#ef4444'      // Red
  };

  const getStatusColor = (status) => STATUS_COLORS[status] || '#cbd5e1';

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Reports & System Analytics</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          View interactive enrollment metrics and graphical chart insights on active course streams.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Numerical metric blocks */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Applications</span>
            <p className="text-2xl font-black text-slate-800">{stats.total_applications}</p>
          </div>
          <div className="card p-5 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Curriculum Programs</span>
            <p className="text-2xl font-black text-slate-800">{stats.active_courses}</p>
          </div>
          <div className="card p-5 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decision Acceptance Rate</span>
            <p className="text-2xl font-black text-slate-800">
              {stats.total_applications > 0 ? ((stats.accepted / stats.total_applications) * 100).toFixed(0) : 0}%
            </p>
          </div>
          <div className="card p-5 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Backlog</span>
            <p className="text-2xl font-black text-brand-600">{stats.submitted + stats.under_review}</p>
          </div>
        </div>
      )}

      {/* Graphical charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Status Distribution Pie Chart */}
        <div className="card p-6 bg-white space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center">
            <PieIcon className="h-4.5 w-4.5 text-brand-600 mr-2" />
            <h2 className="text-sm font-bold text-slate-800">Application Status Distribution</h2>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            {statusData.length === 0 || statusData.every(d => d.count === 0) ? (
              <p className="text-xs text-slate-400 italic">No application data exists for status plotting.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name.toUpperCase().replace('_', ' ')]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Department Application Bar Chart */}
        <div className="card p-6 bg-white space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center">
            <BarChart3 className="h-4.5 w-4.5 text-brand-600 mr-2" />
            <h2 className="text-sm font-bold text-slate-800">Applications by Department</h2>
          </div>

          <div className="h-64">
            {deptData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic text-xs">
                No application data exists for department metrics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="count" name="Applications" fill="#0e90e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
