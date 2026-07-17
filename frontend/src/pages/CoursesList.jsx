import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../services/api';
import { 
  BookOpen, 
  Search, 
  Layers, 
  UserCheck, 
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await coursesAPI.list({
        search: search || undefined,
        department: department || undefined,
        active_only: true
      });
      setCourses(res.data);
      
      // Auto-extract unique departments if not set yet
      if (departments.length === 0) {
        const uniqueDepts = [...new Set(res.data.map(c => c.department))];
        setDepartments(uniqueDepts);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, department]);

  return (
    <div className="space-y-8">
      {/* Banner header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Courses Catalog</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Browse active courses and requirements at Zenith University. Find the matching courses for your goals.
        </p>
      </div>

      {/* Filter panel */}
      <div className="card p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by code, title, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Department select */}
        <div className="relative w-full md:max-w-xs flex items-center space-x-2">
          <Layers className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid listing */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-12 text-center text-slate-500 max-w-md mx-auto space-y-3">
          <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No Courses Found</h3>
          <p className="text-slate-400 text-xs">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 bg-white">
              <div className="space-y-3">
                {/* Upper tags */}
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {course.department}
                  </span>
                  <span className="text-slate-500 uppercase">
                    ID: {course.code}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                    {course.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Lower metadata */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="flex items-center text-slate-500">
                  <Award className="h-4 w-4 mr-1 text-brand-500" />
                  {course.credits} Credits
                </span>
                <span className="flex items-center text-slate-500">
                  <UserCheck className="h-4 w-4 mr-1 text-slate-400" />
                  Capacity: {course.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
