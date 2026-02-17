
import React, { useState, useEffect, useCallback } from 'react';
import PatternBackground from './components/PatternBackground';
import ExamHeader from './components/ExamHeader';
import SidebarNavigation from './components/SidebarNavigation';
import { MOCK_QUESTIONS, Icons } from './constants';
import { ExamSession, UserAnswer } from './types';
import { storageService } from './services/storageService';
import { GoogleGenAI } from "@google/genai";

// GANTI URL INI dengan URL dari Deployment Google Apps Script Anda
const GOOGLE_SHEET_WEBAPP_URL = "URL_GOOGLE_APPS_SCRIPT_ANDA_DI_SINI";

const App: React.FC = () => {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    const saved = storageService.getSession();
    if (saved && !saved.isSubmitted) {
      setSession(saved);
    }
  }, []);

  const startExam = (name: string, studentClass: string) => {
    const newSession: ExamSession = {
      id: `CEIN-${Date.now()}`,
      studentName: name,
      studentClass: studentClass,
      studentId: `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      startTime: Date.now(),
      answers: [],
      isSubmitted: false
    };
    storageService.saveSession(newSession);
    setSession(newSession);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (!session) return;
    storageService.updateAnswer(questionId, optionId);
    setSession(prev => {
      if (!prev) return null;
      const updatedAnswers = [...prev.answers];
      const existingIdx = updatedAnswers.findIndex(a => a.questionId === questionId);
      const newAnswer = { questionId, selectedOptionId: optionId, timestamp: Date.now() };
      if (existingIdx > -1) updatedAnswers[existingIdx] = newAnswer;
      else updatedAnswers.push(newAnswer);
      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleFinish = useCallback(async () => {
    if (!session) return;
    setIsSubmitting(true);
    const finalSession = { ...session, isSubmitted: true, endTime: Date.now() };
    storageService.saveSession(finalSession);
    setSession(finalSession);
    setIsSubmitting(false);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const score = finalSession.answers.filter(ans => {
          const q = MOCK_QUESTIONS.find(mq => mq.id === ans.questionId);
          return q?.correctAnswerId === ans.selectedOptionId;
        }).length;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Berikan feedback singkat untuk siswa ${finalSession.studentName} kelas ${finalSession.studentClass} yang mendapat skor ${score}/${MOCK_QUESTIONS.length}. Gunakan bahasa yang memotivasi.`,
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        setAiAnalysis(response.text || "Analisis selesai.");
      }
    } catch (err) { console.error("AI Error:", err); }
  }, [session]);

  const handleSync = async () => {
    if (!session) return;
    setSyncStatus('syncing');
    
    const score = session.answers.filter(ans => {
      const q = MOCK_QUESTIONS.find(mq => mq.id === ans.questionId);
      return q?.correctAnswerId === ans.selectedOptionId;
    }).length;

    const dataToExport = {
      student: { name: session.studentName, class: session.studentClass, id: session.studentId },
      results: { 
        score, 
        totalQuestions: MOCK_QUESTIONS.length, 
        percentage: Math.round((score / MOCK_QUESTIONS.length) * 100),
        answers: session.answers 
      }
    };

    try {
      // 1. Mencoba kirim ke Google Sheets (Jika ada internet)
      const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors', // Penting untuk Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToExport)
      });

      // 2. Selalu berikan cadangan download JSON (Backup Offline)
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CEINCBT_${session.studentClass}_${session.studentName.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSyncStatus('synced');
    } catch (error) {
      console.error("Sync Error:", error);
      setSyncStatus('error');
      alert("Gagal sinkronisasi otomatis. File backup JSON telah diunduh, silakan serahkan ke guru.");
    }
    
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <PatternBackground />
        <div className="bg-white/90 backdrop-blur-xl border border-lime-100 p-8 rounded-[2.5rem] shadow-2xl shadow-lime-200/50 max-w-md w-full text-center">
          <div className="mb-6 relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-tr from-lime-500 to-yellow-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-lime-200 overflow-hidden border-4 border-white">
               <img 
                src="https://api.dicebear.com/7.x/initials/svg?seed=MAC&backgroundColor=84cc16&fontSize=40" 
                alt="Logo MA CNW"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
              RESMI
            </div>
          </div>
          <h2 className="text-3xl font-bold text-lime-900 mb-2">Welcome to CeinCBT</h2>
          <p className="text-lime-600/70 mb-8 font-medium italic">"Cerdas, Beradab, dan Wasathiyyah"</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get('name') as string;
            const studentClass = formData.get('class') as string;
            if (name && studentClass) startExam(name, studentClass);
          }} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-lime-700 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap Siswa</label>
              <input name="name" type="text" required placeholder="Masukkan nama..." className="w-full px-6 py-4 rounded-2xl bg-lime-50 border border-lime-100 focus:outline-none focus:ring-4 focus:ring-lime-200 transition-all text-lime-900 font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-lime-700 uppercase tracking-widest mb-1.5 ml-1">Pilih Kelas</label>
              <select name="class" required className="w-full px-6 py-4 rounded-2xl bg-lime-50 border border-lime-100 focus:outline-none focus:ring-4 focus:ring-lime-200 transition-all text-lime-900 font-semibold appearance-none cursor-pointer">
                <option value="">-- Pilih Kelas --</option>
                <option value="X-1">Kelas X - 1</option>
                <option value="X-2">Kelas X - 2</option>
                <option value="XI-IPA">Kelas XI - IPA</option>
                <option value="XI-IPS">Kelas XI - IPS</option>
                <option value="XII-IPA">Kelas XII - IPA</option>
                <option value="XII-IPS">Kelas XII - IPS</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-lime-600 to-lime-500 text-white py-4 mt-4 rounded-2xl font-bold text-lg hover:from-lime-700 hover:to-lime-600 transition-all shadow-xl shadow-lime-100 active:scale-95">Mulai Ujian</button>
          </form>
        </div>
      </div>
    );
  }

  if (session.isSubmitted) {
    const score = session.answers.filter(ans => {
      const q = MOCK_QUESTIONS.find(mq => mq.id === ans.questionId);
      return q?.correctAnswerId === ans.selectedOptionId;
    }).length;

    return (
      <div className="min-h-screen p-6 md:p-12">
        <PatternBackground />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/90 backdrop-blur-xl border border-lime-100 rounded-[2.5rem] p-12 text-center shadow-2xl shadow-lime-100/30">
            <div className="w-24 h-24 bg-lime-100 text-lime-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Icons.CheckCircle />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Ujian Selesai!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-8 rounded-3xl border border-lime-50 shadow-sm">
                <p className="text-xs text-lime-400 uppercase tracking-widest font-bold mb-2">Nilai Akhir</p>
                <p className="text-6xl font-black text-lime-600">{Math.round((score / MOCK_QUESTIONS.length) * 100)}%</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-lime-50 shadow-sm flex flex-col justify-center">
                <button 
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing' || syncStatus === 'synced'}
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 ${
                    syncStatus === 'synced' ? 'bg-emerald-500 text-white' : 
                    syncStatus === 'error' ? 'bg-amber-500 text-white' : 'bg-lime-600 text-white hover:bg-lime-700 active:scale-95 shadow-lg shadow-lime-100'
                  }`}
                >
                  {syncStatus === 'syncing' ? <span className="animate-spin w-5 h-5 border-2 border-white/50 border-t-white rounded-full"></span> : <Icons.Cloud />}
                  <span>{syncStatus === 'syncing' ? 'Mengirim...' : syncStatus === 'synced' ? 'Berhasil Terkirim!' : 'Sinkron ke Sistem'}</span>
                </button>
                <p className="text-xs text-gray-400 mt-3 font-medium italic">Klik saat ada internet untuk lapor otomatis.</p>
              </div>
            </div>

            {aiAnalysis && (
              <div className="text-left bg-lime-50 p-8 rounded-3xl border border-lime-100 mb-8">
                <h3 className="text-lime-900 font-bold mb-3 flex items-center space-x-2"><span>✨</span><span>Umpan Balik AI</span></h3>
                <div className="text-lime-800/80 leading-relaxed font-medium text-sm whitespace-pre-wrap">{aiAnalysis}</div>
              </div>
            )}

            <button onClick={() => { if (confirm('Data akan dihapus dari perangkat ini. Lanjutkan?')) { storageService.clearSession(); window.location.reload(); } }} className="text-lime-400 hover:text-lime-700 font-bold text-sm flex items-center justify-center space-x-2 mx-auto py-2 transition-colors">
              <Icons.LogOut /><span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIdx];
  const userAnswer = session.answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen flex flex-col">
      <PatternBackground />
      <ExamHeader studentName={session.studentName} studentClass={session.studentClass} durationMinutes={30} startTime={session.startTime} onTimeUp={handleFinish} />
      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        <SidebarNavigation questions={MOCK_QUESTIONS} currentIdx={currentQuestionIdx} answers={session.answers} onSelect={setCurrentQuestionIdx} onSubmit={handleFinish} />
        <div className="flex-grow space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-lime-100 p-8 md:p-12 shadow-2xl shadow-lime-100/50 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-50 rounded-bl-[4rem] -z-10 opacity-50"></div>
            <div className="flex items-center space-x-4 mb-8">
              <span className="bg-lime-100 text-lime-700 px-4 py-2 rounded-xl text-sm font-bold tracking-tight uppercase">Soal {currentQuestionIdx + 1}</span>
              <div className="h-0.5 flex-grow bg-lime-50/50"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-10 leading-relaxed">{currentQuestion.text}</h2>
            <div className="grid grid-cols-1 gap-4 mb-12">
              {currentQuestion.options.map((opt) => {
                const isSelected = userAnswer?.selectedOptionId === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelectOption(currentQuestion.id, opt.id)} className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-4 group ${isSelected ? 'bg-lime-600 border-lime-600 text-white shadow-lg shadow-lime-200 ring-4 ring-lime-100' : 'bg-white border-gray-100 text-gray-700 hover:border-lime-300 hover:bg-lime-50/50'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600'}`}>{opt.id.toUpperCase()}</div>
                    <span className="font-semibold text-lg">{opt.text}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-8 border-t border-lime-50 flex items-center justify-between">
              <button disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(prev => prev - 1)} className="px-6 md:px-8 py-3 rounded-xl font-bold text-lime-600 hover:bg-lime-100 disabled:opacity-30 transition-all flex items-center space-x-2"><svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg><span>Sebelumnya</span></button>
              <button disabled={currentQuestionIdx === MOCK_QUESTIONS.length - 1} onClick={() => setCurrentQuestionIdx(prev => prev + 1)} className="px-6 md:px-8 py-3 rounded-xl font-bold bg-lime-50 text-lime-600 hover:bg-lime-100 disabled:opacity-30 transition-all flex items-center space-x-2"><span>Selanjutnya</span><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
