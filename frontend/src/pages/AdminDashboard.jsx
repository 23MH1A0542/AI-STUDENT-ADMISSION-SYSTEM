import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI, analyticsAPI } from '../services/api';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Loader2, 
  AlertCircle,
  Eye,
  GraduationCap
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const statsRes = await analyticsAPI.getStats();
      setStats(statsRes.data);

      const appsRes = await applicationsAPI.list(statusFilter || undefined);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin stats and applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  // Helper status color badges
  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ";
    switch (status) {
      case 'accepted':
        return <span className={base + "bg-green-100 text-green-800"}>Accepted</span>;
      case 'rejected':
        return <span className={base + "bg-red-100 text-red-800"}>Rejected</span>;
      case 'under_review':
        return <span className={base + "bg-blue-100 text-blue-800"}>Under Review</span>;
      default:
        return <span className={base + "bg-slate-100 text-slate-700"}>Submitted</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Admissions Panel</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Process undergraduate admissions requests, view analytical reports, and modify the course catalog.
        </p>
      </div>

      {/* Stats Counter Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 bg-white space-y-2 border-l-4 border-l-brand-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Submissions</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-800">{stats.total_applications}</span>
            </div>
          </div>
          
          <div className="card p-5 bg-white space-y-2 border-l-4 border-l-green-500">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Approved</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-800">{stats.accepted}</span>
              <span className="text-[10px] text-slate-400 font-medium">({stats.total_applications > 0 ? ((stats.accepted/stats.total_applications)*100).toFixed(0) : 0}%)</span>
            </div>
          </div>

          <div className="card p-5 bg-white space-y-2 border-l-4 border-l-blue-500">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Under Review</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-800">{stats.under_review}</span>
            </div>
          </div>

          <div className="card p-5 bg-white space-y-2 border-l-4 border-l-red-500">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rejected</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-800">{stats.rejected}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Applications Table */}
      <div className="card bg-white">
        {/* Table header with filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Applications</h2>
            <p className="text-slate-400 text-[10px] mt-0.5">Undergraduate enrollment requests list.</p>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field max-w-xs cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileText className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs">No student applications match the filter parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/20">
                  <th className="p-4 pl-6">Student Name</th>
                  <th className="p-4">Applied Course</th>
                  <th className="p-4 text-center">GPA</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Student name / email */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold uppercase shrink-0">
                          {app.student?.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{app.student?.full_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400">{app.student?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Target course code / title */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{app.course?.name || `Course ID: ${app.course_id}`}</p>
                      <p className="text-[10px] text-brand-600 font-semibold">{app.course?.code}</p>
                    </td>

                    {/* GPA */}
                    <td className="p-4 text-center font-semibold text-slate-700">
                      {app.gpa.toFixed(2)}
                    </td>

                    {/* Submitted date */}
                    <td className="p-4 text-slate-500">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </td>

                    {/* Badge Status */}
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Eye review action link */}
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg text-xs font-semibold text-slate-700 transition"
                      >
                        <Eye className="h-4.5 w-4.5 mr-1" />
                        <span>Review</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
