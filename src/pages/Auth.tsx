import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Loader2, Sparkles, User, Fingerprint, Lock, Mail } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, getStudentEmail } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';
import { cn } from '../lib/utils';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentNumber: '',
    idNumber: '',
    fullName: '',
    surname: '',
    password: ''
  });

  const validateSAID = (id: string) => {
    if (id.length !== 13 || !/^\d+$/.test(id)) return false;
    const month = parseInt(id.substring(2, 4), 10);
    const day = parseInt(id.substring(4, 6), 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    let sum = 0;
    for (let i = 0; i < 13; i++) {
      let digit = parseInt(id.charAt(i), 10);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = getStudentEmail(formData.studentNumber);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, formData.password);
      } else {
        // Validation for registration
        if (!/^\d{9}$/.test(formData.studentNumber)) {
          throw new Error("Student number must be exactly 9 digits.");
        }

        if (!validateSAID(formData.idNumber)) {
          throw new Error("Invalid South African ID number format.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
        
        try {
          // Create profile in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            studentNumber: formData.studentNumber,
            idNumber: formData.idNumber,
            fullName: formData.fullName,
            surname: formData.surname,
            email: email
          });
        } catch (fErr) {
          handleFirestoreError(fErr, OperationType.WRITE, `users/${userCredential.user.uid}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Sign-in method 'Email/Password' is not enabled in your Firebase Console. Please enable it under Auth -> Sign-in method.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid student number or password. If you haven't registered yet, please create an account first.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-royal/10">
        
        {/* Left Side: Brand */}
        <div className="bg-royal p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <GraduationCap size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <Sparkles className="text-sunflower" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">CSAS TUT</h1>
            <p className="text-white/60 leading-relaxed font-medium">
              Soshanguve South Campus Smart Assistant. Access your academic path with precision.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-royal bg-slate-200" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-royal bg-sunflower flex items-center justify-center text-[10px] font-bold text-royal">
                +2k
              </div>
            </div>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Joined by thousands of students</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-royal mb-2">{isLogin ? 'Login to myTutor' : 'Create Student Account'}</h2>
            <p className="text-royal/50 text-sm">{isLogin ? 'Enter your student credentials to continue' : 'Enter your details to register on the Sosh South platform'}</p>
          </div>

          <form onSubmit={handleAction} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-rose/10 text-rose text-xs font-bold flex items-center gap-2 border border-rose/10"
                >
                  <Lock size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-royal/40">Student Number (9 digits)</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={9}
                  required
                  placeholder="e.g. 219123456"
                  value={formData.studentNumber}
                  onChange={e => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-royal/5 rounded-xl px-4 py-3 pl-11 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 transition-all"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-royal/30" />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-royal/40">ID Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 0501015678082"
                      value={formData.idNumber}
                      onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-royal/5 rounded-xl px-4 py-3 pl-11 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                    <Fingerprint size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-royal/30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-royal/40">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-royal/5 rounded-xl px-4 py-3 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-royal/40">Surname</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Doe"
                      value={formData.surname}
                      onChange={e => setFormData({ ...formData, surname: e.target.value })}
                      className="w-full bg-slate-50 border border-royal/5 rounded-xl px-4 py-3 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-royal/40">myTutor Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-royal/5 rounded-xl px-4 py-3 pl-11 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 transition-all"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-royal/30" />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-royal text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-royal/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-royal/40 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-royal font-bold hover:underline"
            >
              {isLogin ? 'Register now' : 'Log in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
