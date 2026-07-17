import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applicationsAPI } from '../services/api';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Award,
  User,
  GraduationCap
} from 'lucide-react';

const ApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [app, setApp] = useState(null);
  const [status, setStatus] = useState('submitted');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchApplication = async () => {
    try {
      const res = await applicationsAPI.get(id);
      setApp(res.data);
      setStatus(res.data.status);
      setNotes(res.data.reviewer_notes || '');
    } catch (err) {
      console.error(err);
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const res = await applicationsAPI.updateStatus(id, {
        status,
        reviewer_notes: notes
      });
      setApp(res.data);
      setSuccess('Application status updated successfully. Student notification triggered!');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="card p-8 text-center text-slate-500 max-w-md mx-auto space-y-4">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
        <h3 className="font-bold text-slate-700">Application Not Found</h3>
        <Link to="/admin/dashboard" className="btn-primary text-xs inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/admin/dashboard" className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Student Credential summary card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main profile overview */}
          <div className="card p-6 sm:p-8 space-y-6 bg-white">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  Reviewing Candidate
                </span>
                <h1 className="text-xl font-bold text-slate-800 mt-2">
                  {app.student?.full_name}
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">{app.student?.email}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Submission Date</span>
                <span className="text-xs font-semibold text-slate-700 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                  {new Date(app.submitted_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Application metrics details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Academic GPA</span>
                <span className="text-lg font-black text-slate-800 flex items-center">
                  <Award className="h-5 w-5 mr-1 text-brand-500" />
                  {app.gpa.toFixed(2)} / 4.00
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Applied Program</span>
                <span className="text-sm font-bold text-slate-800 flex items-center truncate">
                  <GraduationCap className="h-5 w-5 mr-1.5 text-slate-500 shrink-0" />
                  {app.course?.code} ({app.course?.name})
                </span>
              </div>
            </div>

            {/* Statement of Purpose */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Statement of Purpose / Career Goals
              </h3>
              <p className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-650 text-xs leading-relaxed font-sans whitespace-pre-line">
                {app.statement_of_purpose || 'No statement of purpose provided.'}
              </p>
            </div>

            {/* Uploaded Verification Documents */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Verification Documents ({app.documents.length})
              </h3>
              {app.documents.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No documents uploaded by student yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {app.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileSpreadsheet className="h-5 w-5 text-slate-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-700 truncate" title={doc.filename}>{doc.filename}</p>
                          <span className="text-[9px] text-slate-400 capitalize">{doc.file_type}</span>
                        </div>
                      </div>
                      <a
                        href={`/api/v1/applications/${app.id}/document/${doc.id}`} // Dummy file read endpoint or directly read path
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-700 transition"
                        title="Download file"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Review Sidebar Panel */}
        <div className="space-y-6">
          <div className="card p-6 sm:p-8 space-y-6 bg-white">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Application Action
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 flex items-start space-x-2 text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 flex items-start space-x-2 text-xs">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-5">
              {/* Radio select / Select dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Update Review Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field cursor-pointer"
                  disabled={submitLoading}
                >
                  <option value="submitted">Submitted (Pending)</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted (Approve)</option>
                  <option value="rejected">Rejected (Decline)</option>
                </select>
              </div>

              {/* Remarks Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Reviewer Remarks
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide decision rationales, notes on academic records, transcripts verification, or missing prerequisites..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none leading-relaxed text-xs"
                  disabled={submitLoading}
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="btn-primary w-full py-2.5 space-x-2 text-xs"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Processing Decision...</span>
                  </>
                ) : (
                  <span>Submit Decision</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;
