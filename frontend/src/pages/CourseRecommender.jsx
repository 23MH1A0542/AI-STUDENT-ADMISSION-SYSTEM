import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { 
  Sparkles, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

const CourseRecommender = () => {
  const [gpa, setGpa] = useState('');
  const [interests, setInterests] = useState('');
  const [background, setBackground] = useState('');
  const [recommendations, setRecommendations] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    setError('');
    setRecommendations('');
    
    const gpaVal = parseFloat(gpa);
    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4.0) {
      setError('GPA must be a number between 0.0 and 4.0.');
      return;
    }
    if (!interests.trim()) {
      setError('Please specify your interests or career goals.');
      return;
    }

    setLoading(true);
    try {
      const res = await aiAPI.recommendations({
        gpa: gpaVal,
        interests,
        background
      });
      setRecommendations(res.data.recommendations);
      setIsMock(res.data.is_mock);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch course recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Basic parser to render double-asterisks as bold and single asterisks as bullets
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      let trimmed = line.trim();
      
      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-brand-700 mt-5 mb-2.5">
            {trimmed.replace('##', '').trim()}
          </h3>
        );
      }
      
      // Check for bullet lists
      const isBullet = trimmed.startsWith('*') || trimmed.startsWith('-');
      if (isBullet) {
        trimmed = trimmed.substring(1).trim();
      }

      // Parse bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          parts.push(trimmed.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-800">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < trimmed.length) {
        parts.push(trimmed.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : trimmed;

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-600 text-xs leading-relaxed mb-1">
            {content}
          </li>
        );
      }
      
      return (
        <p key={idx} className="text-slate-600 text-xs leading-relaxed mb-3">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10">
          <Sparkles className="h-40 w-40" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold tracking-widest text-brand-200 bg-brand-600/50 px-2.5 py-1 rounded-md uppercase inline-flex items-center space-x-1 mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Advisory Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Course Recommender</h1>
          <p className="text-brand-100 text-sm mt-2 leading-relaxed">
            Specify your academic details, target career pathways, and previous experience. Our Gemini engine will analyze current active courses to suggest the perfect path.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="card p-6 sm:p-8 space-y-6 lg:col-span-1 h-fit">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-800 text-base flex items-center">
              <ClipboardList className="h-5 w-5 text-brand-600 mr-2" />
              Academic Profile
            </h2>
            <p className="text-slate-400 text-[10px] mt-0.5">Input your target goals below.</p>
          </div>

          <form onSubmit={handleGetRecommendations} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Cumulative GPA
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 3.4"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Career Goals & Interests
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Software engineering, cloud architecture, mobile app dev, AI systems..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="input-field resize-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Academic Background (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Finished high school math, took a basic python class online..."
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="input-field resize-none"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 space-x-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Analyzing Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Get Recommendations</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 flex items-start space-x-2 text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 sm:p-8 min-h-[300px] flex flex-col justify-between">
            {recommendations ? (
              <div className="flex-1">
                {/* Result metadata */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <Award className="h-4.5 w-4.5 text-green-500 mr-2" />
                    Recommended Course Pathway
                  </h3>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">
                    {isMock ? 'Mock Advisor Engine' : 'Live Gemini Model'}
                  </span>
                </div>
                
                {/* Parsed Output */}
                <div className="space-y-1 pl-1">
                  {renderFormattedText(recommendations)}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                {loading ? (
                  <div className="space-y-3">
                    <Loader2 className="h-10 w-10 text-brand-500 animate-spin mx-auto" />
                    <p className="text-slate-500 text-xs">Zenith AI is analyzing our active course catalog and matching it to your criteria...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">No Recommendations Generated Yet</h3>
                    <p className="text-slate-400 text-xs">
                      Submit your academic stats and career targets on the left panel to trigger Gemini recommendations.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Disclaimer disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-150 text-[10px] text-slate-400 flex items-start space-x-1.5">
              <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-300" />
              <span>
                These suggestions are generated using artificial intelligence and are intended as a guide. Please consult with an Admissions Counselor to finalize your enrollment plans.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommender;
