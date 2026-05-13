import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2,
  ChevronRight,
  BookOpen,
  Target,
  ArrowRight,
  X,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecommendationRequest } from '../types';
import { aiService } from '../services/ai';

export function Recommendations() {
  const [aps, setAps] = useState<number>(30);
  const [subjects, setSubjects] = useState<{ name: string; score: number }[]>([
    { name: 'Mathematics', score: 70 },
    { name: 'English', score: 65 },
  ]);
  const [interests, setInterests] = useState<string[]>(['Technology', 'Design']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', score: 50 }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: 'name' | 'score', value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getCourseRecommendations({
        apsScore: aps,
        subjects,
        interests
      });
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while generating predictions. Please ensure your student profile is complete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
      {/* Input Form */}
      <div className="space-y-8">
        <header>
          <div className="w-12 h-12 bg-royal text-white rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-royal">TUT AI Academic Coach</h1>
          <p className="text-royal/50 leading-relaxed max-w-md">
            Enter your academic profile below and let our AI analyze your eligibility for 
            TUT programmes at the Soshanguve South Campus.
          </p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-royal/5 shadow-sm space-y-8">
          {error && (
            <div className="p-4 bg-rose/5 border border-rose/10 rounded-2xl text-rose text-sm font-medium">
              {error}
            </div>
          )}
          {/* APS Score */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-royal/40">Overall APS Score</label>
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="15" 
                max="48" 
                value={aps} 
                onChange={(e) => setAps(parseInt(e.target.value))}
                className="flex-1 accent-royal"
              />
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-2xl border border-royal/5 text-royal">
                {aps}
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-royal/40">Key Subjects</label>
              <button 
                onClick={addSubject}
                className="text-xs font-bold text-royal hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Subject
              </button>
            </div>
            <div className="space-y-3">
              {subjects.map((sub, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="flex gap-3 group"
                >
                  <input 
                    type="text" 
                    placeholder="Subject Name"
                    value={sub.name}
                    onChange={(e) => updateSubject(i, 'name', e.target.value)}
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-royal/5 transition-all outline-none text-royal"
                  />
                  <input 
                    type="number" 
                    placeholder="%"
                    value={sub.score}
                    onChange={(e) => updateSubject(i, 'score', parseInt(e.target.value))}
                    className="w-20 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm text-center focus:ring-2 focus:ring-royal/5 transition-all outline-none text-royal"
                  />
                  <button 
                    onClick={() => removeSubject(i)}
                    className="p-3 bg-rose/5 text-rose rounded-xl hover:bg-rose/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="w-full py-4 bg-royal text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-royal/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" /> 
                Generate Predictions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8 min-h-[600px]">
        <div className="flex justify-between items-end border-b border-royal/5 pb-6">
          <h2 className="text-xl font-bold text-royal">Recommendations</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-royal/30">{recommendations.length} courses identified</span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {recommendations.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <div className="w-16 h-16 bg-royal/5 rounded-full flex items-center justify-center mb-4">
                  <Target size={24} className="text-royal" />
                </div>
                <p className="text-sm italic serif text-royal">Awaiting student profile data...</p>
              </div>
            )}

            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.courseName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedCourse(rec)}
                className="bg-white p-8 rounded-3xl border border-royal/5 shadow-sm group hover:border-royal/20 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-50 text-royal/60 text-[10px] font-bold uppercase tracking-widest rounded-full">{rec.faculty}</span>
                    <ArrowRight size={18} className="text-royal/20 group-hover:text-royal transition-colors group-hover:translate-x-1" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 text-royal">{rec.courseName}</h3>
                  <p className="text-sm text-royal/60 mb-6 leading-relaxed italic serif">"{rec.matchingReason}"</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {rec.careerAlignment.map((career: string) => (
                      <span key={career} className="px-2 py-1 bg-sunflower/10 text-royal text-[10px] font-semibold rounded border border-sunflower/20">
                        {career}
                      </span>
                    ))}
                  </div>

                  {rec.alternativePathway && (
                    <div className="bg-sunflower/5 p-4 rounded-xl border border-sunflower/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={12} className="text-sunflower" />
                        <span className="text-[10px] font-bold text-royal uppercase tracking-widest">Alternative Pathway</span>
                      </div>
                      <p className="text-xs text-royal/80 leading-relaxed font-medium">{rec.alternativePathway}</p>
                    </div>
                  )}
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100%] z-0 translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-royal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative z-10 border border-royal/10"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-royal/5 flex justify-between items-center z-20">
                <div>
                  <span className="text-[10px] font-bold text-royal/40 uppercase tracking-widest mb-1 block">{selectedCourse.faculty}</span>
                  <h2 className="text-2xl font-bold text-royal">{selectedCourse.courseName}</h2>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="w-10 h-10 bg-slate-50 text-royal hover:bg-royal hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Duration */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-royal/5">
                  <div className="w-10 h-10 bg-royal/10 text-royal rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-royal/40 uppercase tracking-widest">Duration</h4>
                    <p className="text-sm font-semibold text-royal">{selectedCourse.duration}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-royal uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={16} className="text-royal/30" />
                    About this Course
                  </h3>
                  <p className="text-royal/70 leading-relaxed italic">{selectedCourse.description}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-royal uppercase tracking-widest flex items-center gap-2">
                    <Award size={16} className="text-royal/30" />
                    How it helps you
                  </h3>
                  <p className="text-royal/70 leading-relaxed">{selectedCourse.benefits}</p>
                </div>

                {/* Job Demand */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-royal uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={16} className="text-royal/30" />
                    Future & Job Demand
                  </h3>
                  <div className="bg-sunflower/5 p-6 rounded-2xl border border-sunflower/20">
                    <p className="text-royal/80 leading-relaxed font-medium">{selectedCourse.jobDemand}</p>
                  </div>
                </div>

                {/* Career Paths */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-royal/40 uppercase tracking-widest">Career Opportunities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.careerAlignment.map((career: string) => (
                      <span key={career} className="px-4 py-2 bg-royal/5 text-royal text-xs font-bold rounded-xl border border-royal/10">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
