import React, { useState, useEffect } from 'react';
import { applicationsAPI, coursesAPI } from '../services/api';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // App Form States
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gpa, setGpa] = useState('');
  const [statement, setStatement] = useState('');
  
  // Document Upload States
  const [uploadingDocType, setUploadingDocType] = useState('transcript');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // System States
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      const appRes = await applicationsAPI.list();
      setApplications(appRes.data);

      if (appRes.data.length === 0) {
        // Fetch courses if student has no application
        const courseRes = await coursesAPI.list();
        setCourses(courseRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }
    const gpaVal = parseFloat(gpa);
    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4.0) {
      setError('GPA must be a number between 0.0 and 4.0.');
      return;
    }

    setSubmitLoading(true);
    try {
      await applicationsAPI.submit({
        course_id: parseInt(selectedCourse),
        gpa: gpaVal,
        statement_of_purpose: statement
      });
      setSuccess('Application submitted successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit application.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please choose a file to upload.');
      return;
    }

    setUploadLoading(true);
    const activeApp = applications[0];
    try {
      await applicationsAPI.uploadDocument(
        activeApp.id,
        uploadingDocType,
        selectedFile
      );
      setSuccess(`Uploaded ${uploadingDocType} successfully!`);
      setSelectedFile(null);
      // Reset input element
      document.getElementById('file-input').value = '';
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload document.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  const activeApp = applications[0]; // Active application

  // Status mapping to steps
  const steps = [
    { label: 'Submitted', key: 'submitted', color: 'bg-brand-500' },
    { label: 'Under Review', key: 'under_review', color: 'bg-blue-500' },
    { label: 'Accepted / Rejected', key: 'decision', color: '' }
  ];

  const getStepStatus = (stepKey) => {
    if (!activeApp) return 'wait';
    const status = activeApp.status;

    if (stepKey === 'submitted') {
      return 'complete';
    }
    if (stepKey === 'under_review') {
      if (status === 'submitted') return 'wait';
      return 'complete';
    }
    if (stepKey === 'decision') {
      if (status === 'accepted') return 'accepted';
      if (status === 'rejected') return 'rejected';
      return 'wait';
    }
    return 'wait';
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Manage your admissions profile, track decision status, and request AI recommendations.
          </p>
        </div>
        {!activeApp && (
          <Link to="/recommendations" className="btn bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10 flex items-center space-x-1.5 py-2 px-4 rounded-lg backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-300" />
            <span>AI Recommendations</span>
          </Link>
        )}
      </div>

      {/* Message Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-start space-x-3 text-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* DASHBOARD CONDITIONAL RENDER */}
      {!activeApp ? (
        /* APPLY FORM WIZARD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="card lg:col-span-2 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">New Admission Application</h2>
              <p className="text-slate-500 text-xs mt-1">
                Fill in your credentials to apply. Ensure your GPA is entered correctly.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Select Target Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="input-field cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.code}] {c.name} ({c.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Accumulative GPA (Out of 4.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.75"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Statement of Purpose / Goals
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us about yourself, your career goals, and why you are interested in this course..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  className="input-field resize-y font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn-primary py-2.5 px-6 space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Help Card */}
          <div className="space-y-6">
            <div className="card p-6 bg-gradient-to-br from-brand-900 to-brand-950 text-white space-y-4">
              <Sparkles className="h-7 w-7 text-brand-300 fill-brand-400/20" />
              <h3 className="font-bold text-lg font-sans">Need Help Selecting?</h3>
              <p className="text-brand-100 text-xs leading-relaxed">
                Not sure which course matches your career targets and academic background? Use our Gemini AI Course Advisor for custom suggestions.
              </p>
              <Link to="/recommendations" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-300 hover:text-white transition">
                <span>Try Course Recommender</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="card p-6 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center">
                <Clock className="h-4.5 w-4.5 text-slate-400 mr-2" />
                Admissions Roadmap
              </h4>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                <li>1. Complete this application form.</li>
                <li>2. Upload transcript and identity verification.</li>
                <li>3. Review status updates dynamically on this portal.</li>
                <li>4. Decision is reached within 5 business days.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* TRACK DECISION & UPLOADS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracker Card */}
          <div className="card lg:col-span-2 p-6 sm:p-8 space-y-8">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-600 bg-brand-50 px-2 py-1 rounded uppercase">
                  Active Application
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-2">
                  {activeApp.course?.name || `Course ID: ${activeApp.course_id}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applied for {activeApp.course?.code} ({activeApp.course?.department}) &bull; GPA: {activeApp.gpa}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Submitted On</span>
                <span className="text-xs font-medium text-slate-700">
                  {new Date(activeApp.submitted_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Visual Progress Steps */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Workflow Tracker</h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-4 bg-slate-50 rounded-xl">
                {/* Step 1: Submitted */}
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Submitted</h4>
                    <span className="text-[10px] text-slate-500">Form registered successfully</span>
                  </div>
                </div>

                {/* Arrow / Line separator */}
                <div className="hidden sm:block h-px flex-1 bg-slate-200 mx-2"></div>

                {/* Step 2: Under Review */}
                <div className="flex items-center space-x-3">
                  {getStepStatus('under_review') === 'complete' ? (
                    <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Under Review</h4>
                    <span className="text-[10px] text-slate-500">Admissions counselor reviewing</span>
                  </div>
                </div>

                {/* Arrow / Line separator */}
                <div className="hidden sm:block h-px flex-1 bg-slate-200 mx-2"></div>

                {/* Step 3: Decision */}
                <div className="flex items-center space-x-3">
                  {getStepStatus('decision') === 'accepted' && (
                    <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  {getStepStatus('decision') === 'rejected' && (
                    <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  {getStepStatus('decision') === 'wait' && (
                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Decision reached</h4>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {activeApp.status === 'accepted' || activeApp.status === 'rejected' ? activeApp.status : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer notes */}
            {activeApp.reviewer_notes && (
              <div className={`p-4 rounded-xl border ${
                activeApp.status === 'accepted' 
                  ? 'bg-green-50/50 border-green-100 text-green-900' 
                  : activeApp.status === 'rejected'
                    ? 'bg-red-50/50 border-red-100 text-red-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                  Reviewer Notes
                </h4>
                <p className="text-xs leading-relaxed">{activeApp.reviewer_notes}</p>
              </div>
            )}
          </div>

          {/* Documents Widget Card */}
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Documents & Verification</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Upload your required transcript and ID to proceed.
              </p>
            </div>

            {/* Upload form */}
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">
                  Document Type
                </label>
                <select
                  value={uploadingDocType}
                  onChange={(e) => setUploadingDocType(e.target.value)}
                  className="input-field"
                >
                  <option value="transcript">Transcript (PDF)</option>
                  <option value="id_proof">Proof of Identity (PDF/Image)</option>
                  <option value="recommendation">Letter of Recommendation (PDF)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">
                  Choose File
                </label>
                <input
                  type="file"
                  id="file-input"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploadLoading || !selectedFile}
                className="btn-primary w-full py-2 flex items-center justify-center space-x-2 text-xs"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </>
                )}
              </button>
            </form>

            {/* Uploaded documents list */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Uploaded Files ({activeApp.documents.length})
              </h4>
              {activeApp.documents.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {activeApp.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-150 text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate font-medium text-slate-700" title={doc.filename}>{doc.filename}</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded shrink-0">
                        {doc.file_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
