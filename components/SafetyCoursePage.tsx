
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, PlayCircle, Award, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { auth } from '../services/firebase';
import { jsPDF } from "jspdf";
import SEOHead from './SEOHead';

const QUESTIONS = [
  {
    question: "What is the recommended following distance under normal driving conditions?",
    options: ["1 second", "2 seconds", "3-4 seconds", "10 seconds"],
    correct: 2
  },
  {
    question: "When are roads most slippery during a rainstorm?",
    options: ["After it has rained for an hour", "First 10-15 minutes", "After the rain stops", "They aren't slippery"],
    correct: 1
  },
  {
    question: "What does a flashing yellow traffic light mean?",
    options: ["Stop completely", "Proceed with caution", "Speed up", "Turn right only"],
    correct: 1
  },
  {
    question: "If you start to hydroplane, you should:",
    options: ["Slam on brakes", "Steer sharply", "Ease off gas and steer straight", "Accelerate"],
    correct: 2
  },
  {
    question: "Texting while driving increases crash risk by how much?",
    options: ["2x", "4x", "8x", "23x"],
    correct: 3
  }
];

const SafetyCoursePage: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [stage, setStage] = useState<'INTRO' | 'VIDEO' | 'QUIZ' | 'COMPLETE'>('INTRO');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = () => {
    if (userName.trim()) setStage('VIDEO');
  };

  const handleAnswer = (idx: number) => {
    // Record user answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = idx;
    setUserAnswers(newAnswers);

    if (idx === QUESTIONS[currentQuestion].correct) {
      setScore(s => s + 1);
    }
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      setStage('COMPLETE');
      saveCompletion();
    }
  };

  const saveCompletion = async () => {
    if (auth.currentUser) {
       try {
         await dbService.saveCourseCompletion({
            userId: auth.currentUser.uid,
            userName: userName,
            course: 'Defensive Driving 101',
            score: Math.round(((score + (QUESTIONS[currentQuestion].correct === QUESTIONS[currentQuestion].options.length ? 1 : 0)) / QUESTIONS.length) * 100),
            completedAt: new Date().toISOString()
         });
       } catch (e) {
         console.error("Failed to save completion", e);
       }
    }
  };

  const generateCertificate = () => {
    setIsGenerating(true);
    try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        // --- PAGE 1: OFFICIAL CERTIFICATE ---
        
        // Double Border
        doc.setLineWidth(1);
        doc.setDrawColor(50, 50, 50); 
        doc.rect(5, 5, width - 10, height - 10);
        
        doc.setLineWidth(2);
        doc.setDrawColor(37, 99, 235); // Professional Blue
        doc.rect(10, 10, width - 20, height - 20);

        // Ornamental Corners (Simple simulation)
        doc.setFillColor(37, 99, 235);
        doc.rect(10, 10, 15, 15, 'F');
        doc.rect(width - 25, 10, 15, 15, 'F');
        doc.rect(10, height - 25, 15, 15, 'F');
        doc.rect(width - 25, height - 25, 15, 15, 'F');

        // Title
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(36);
        doc.text("CERTIFICATE OF COMPLETION", width / 2, 45, { align: "center" });

        // Subtext
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("This is to certify that", width / 2, 65, { align: "center" });

        // Name
        doc.setFont("times", "bolditalic");
        doc.setFontSize(42);
        doc.setTextColor(0, 0, 0);
        doc.text(userName, width / 2, 85, { align: "center" });
        
        // Underline Name
        doc.setLineWidth(0.5);
        doc.line(width / 2 - 60, 88, width / 2 + 60, 88);

        // Course Info
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("has successfully completed the requirements for the", width / 2, 105, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text("Defensive Driving Safety Course", width / 2, 120, { align: "center" });

        // Details
        const finalScore = Math.round((score / QUESTIONS.length) * 100);
        const dateStr = new Date().toLocaleDateString();
        const certId = "DD-" + Date.now().toString().slice(-6) + "-" + Math.floor(Math.random() * 1000);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        
        // Stats Row
        const yStats = 150;
        doc.text(`Score Achieved: ${finalScore}%`, width / 2 - 50, yStats, { align: "center" });
        doc.text(`Completion Date: ${dateStr}`, width / 2 + 50, yStats, { align: "center" });

        // Footer / Signature Area
        const yFooter = 175;
        doc.setLineWidth(0.5);
        doc.line(40, yFooter, 110, yFooter); // Sig Line 1
        doc.line(width - 110, yFooter, width - 40, yFooter); // Sig Line 2

        doc.setFontSize(10);
        doc.text("Authorized Signature", 75, yFooter + 5, { align: "center" });
        doc.text(`Certificate ID: ${certId}`, width - 75, yFooter + 5, { align: "center" });

        // --- PAGE 2: TRANSCRIPT ---
        doc.addPage();
        
        // Transcript Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text("Course Transcript & Assessment Record", 20, 20);
        
        doc.setLineWidth(0.5);
        doc.line(20, 25, width - 20, 25);

        // Student Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Student Name: ${userName}`, 20, 35);
        doc.text(`Certificate ID: ${certId}`, 20, 42);
        doc.text(`Date: ${dateStr}`, 20, 49);
        doc.text(`Final Score: ${finalScore}%`, 20, 56);

        // Questions Table Header
        let yPos = 70;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, width - 40, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Question / Answer", 25, yPos + 2);
        doc.text("Result", width - 40, yPos + 2);
        yPos += 15;

        // Questions Loop
        QUESTIONS.forEach((q, i) => {
            const userAnswerIdx = userAnswers[i];
            const isCorrect = userAnswerIdx === q.correct;
            const userAnswerText = q.options[userAnswerIdx] || "No Answer";
            const correctAnswerText = q.options[q.correct];

            // Check for page break
            if (yPos > height - 30) {
                doc.addPage();
                yPos = 20;
            }

            // Question Text
            doc.setFont("helvetica", "bold");
            doc.setTextColor(50, 50, 50);
            const questionLines = doc.splitTextToSize(`${i + 1}. ${q.question}`, 180);
            doc.text(questionLines, 20, yPos);
            yPos += (questionLines.length * 5) + 2;

            // User Answer
            doc.setFont("helvetica", "normal");
            doc.setTextColor(isCorrect ? 0 : 200, isCorrect ? 100 : 0, 0); // Green/Red
            doc.text(`Selected: ${userAnswerText}`, 25, yPos);
            
            // Result Marker
            doc.text(isCorrect ? "PASS" : "FAIL", width - 40, yPos);
            yPos += 5;

            // Correct Answer (if wrong)
            if (!isCorrect) {
                doc.setTextColor(0, 100, 0);
                doc.text(`Correct Answer: ${correctAnswerText}`, 25, yPos);
                yPos += 5;
            }

            yPos += 8; // Spacing between items
        });

        doc.save(`${userName.replace(/\s/g, '_')}_Safety_Certificate.pdf`);
    } catch (e) {
        console.error(e);
        alert("Certificate generation failed.");
    } finally {
        setIsGenerating(false);
    }
  };

  const finalPercentage = Math.round((score / QUESTIONS.length) * 100);
  const passed = finalPercentage >= 80;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
      <SEOHead 
        title="Defensive Driving Safety Course | Earn Your Certificate"
        description="Complete our online defensive driving course to qualify for insurance discounts. Earn your official safety certificate in minutes."
        canonicalUrl="https://www.reducemyinsurance.net/safety-course"
        keywords={['defensive driving', 'safety course', 'insurance discount', 'driving certificate', 'safe driver']}
      />
      <Link to="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group self-start absolute top-32 left-6 lg:left-auto">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tools
      </Link>

      {stage === 'INTRO' && (
        <div className="glass-card p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>
           
           <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto text-green-400 mb-6 border border-green-500/20">
              <Shield className="w-10 h-10" />
           </div>
           
           <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Defensive Driving <span className="text-green-400">Course</span></h1>
           <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
             Complete this short safety refresher to qualify for "Safe Driver" discounts. 
             Review critical road safety concepts and earn your certificate instantly.
           </p>

           <div className="max-w-md mx-auto mt-8">
              <label className="block text-left text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Student Name (For Certificate)</label>
              <input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-green-500 transition-all"
              />
           </div>

           <button 
             onClick={handleStart}
             disabled={!userName}
             className="px-12 py-5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/20 active:scale-95 transition-all mt-8 flex items-center justify-center gap-3 mx-auto"
           >
             Start Course <PlayCircle className="w-5 h-5" />
           </button>
        </div>
      )}

      {stage === 'VIDEO' && (
        <div className="glass-card p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
           <h2 className="text-3xl font-heading font-bold text-white mb-8">Video Training Module</h2>
           <p className="text-slate-400 mb-8">Please watch the following video before proceeding to the quiz.</p>
           
           <div className="max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-black aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/AdpQeEapCWQ?si=r8wSBA8GgQFBDegX" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
           </div>

           <button 
             onClick={() => setStage('QUIZ')}
             className="px-12 py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
           >
             Continue to Quiz <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      )}

      {stage === 'QUIZ' && (
        <div className="max-w-2xl mx-auto glass-card p-10 rounded-[2.5rem] border-white/10 text-left">
           <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}></div>
              </div>
           </div>
           
           <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {QUESTIONS[currentQuestion].question}
           </h2>

           <div className="space-y-4">
              {QUESTIONS[currentQuestion].options.map((opt, idx) => (
                 <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/50 text-left text-slate-200 transition-all flex items-center gap-4 group"
                 >
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:border-green-500 group-hover:text-green-400">
                       {String.fromCharCode(65 + idx)}
                    </div>
                    {opt}
                 </button>
              ))}
           </div>
        </div>
      )}

      {stage === 'COMPLETE' && (
         <div className="glass-card p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
            <div className={`w-24 h-24 ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
               {passed ? <Award className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>
            
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
               {passed ? "Course Completed!" : "Please Try Again"}
            </h2>
            
            <p className="text-slate-400 mb-8">
               You scored <span className={`font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{finalPercentage}%</span>. 
               {passed ? " Great job! You can now download your certificate." : " You need 80% to pass."}
            </p>

            {passed ? (
               <button 
                  onClick={generateCertificate}
                  disabled={isGenerating}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
               >
                  {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
                  Download Official Certificate
               </button>
            ) : (
               <button 
                  onClick={() => { setScore(0); setCurrentQuestion(0); setStage('QUIZ'); setUserAnswers([]); }}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all"
               >
                  Retry Quiz
               </button>
            )}
         </div>
      )}
    </div>
  );
};

export default SafetyCoursePage;
