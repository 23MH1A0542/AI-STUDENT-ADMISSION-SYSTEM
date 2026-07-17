import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../services/api';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const CourseCRUD = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Null for create, course_id for update
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [credits, setCredits] = useState('3');
  const [capacity, setCapacity] = useState('50');
  const [isActive, setIsActive] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await coursesAPI.list({ active_only: false }); // Fetch all, active and inactive
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setDescription('');
    setDepartment('');
    setCredits('3');
    setCapacity('50');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingId(course.id);
    setCode(course.code);
    setName(course.name);
    setDescription(course.description || '');
    setDepartment(course.department);
    setCredits(course.credits.toString());
    setCapacity(course.capacity.toString());
    setIsActive(course.is_active);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const courseData = {
      code,
      name,
      description,
      department,
      credits: parseInt(credits),
      capacity: parseInt(capacity),
      is_active: isActive
    };

    try {
      if (editingId) {
        // Update
        await coursesAPI.update(editingId, courseData);
        setSuccess('Course updated successfully.');
      } else {
        // Create
        await coursesAPI.create(courseData);
        setSuccess('New course created successfully.');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save course details.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    setError('');
    setSuccess('');

    try {
      await coursesAPI.delete(id);
      setSuccess('Course deleted successfully.');
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner & Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manage Courses</h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Add new curricula, modify capacities, or toggle active enrollments.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs flex items-center space-x-1.5 py-2 px-4 rounded-lg shrink-0 shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Messaging alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Courses Catalog list table */}
      <div className="card bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Zenith Curriculum Directory</h2>
          <p className="text-slate-400 text-[10px] mt-0.5">List of active and inactive courses.</p>
        </div>

        <div className="overflow-x-auto">
          {courses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs">No courses registered yet. Click "Add Course" to begin.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/10">
                  <th className="p-4 pl-6">Code</th>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4 text-center">Credits</th>
                  <th className="p-4 text-center">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-brand-700">{course.code}</td>
                    <td className="p-4 font-semibold text-slate-800">{course.name}</td>
                    <td className="p-4 text-slate-500">{course.department}</td>
                    <td className="p-4 text-center">{course.credits}</td>
                    <td className="p-4 text-center">{course.capacity}</td>
                    <td className="p-4">
                      {course.is_active ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-green-100 text-green-800 uppercase tracking-wider">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-400 uppercase tracking-wider">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(course)}
                        className="inline-flex items-center justify-center p-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded text-slate-500 transition"
                        title="Edit Course"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="inline-flex items-center justify-center p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded text-slate-500 transition"
                        title="Delete Course"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* OVERLAY MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base font-sans">
                {editingId ? `Edit Course [${code}]` : 'Create New Course'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Intro to Coding"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Course details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                    Credits
                  </label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Toggle isActive */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Course Visibility</h4>
                  <p className="text-[10px] text-slate-450">Active courses appear in student catalogs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="text-brand-600 hover:text-brand-700 transition focus:outline-none"
                >
                  {isActive ? (
                    <ToggleRight className="h-10 w-10 stroke-[1.5]" />
                  ) : (
                    <ToggleLeft className="h-10 w-10 stroke-[1.5] text-slate-300" />
                  )}
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2"
                >
                  {editingId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCRUD;
