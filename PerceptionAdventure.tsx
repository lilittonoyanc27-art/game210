import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Map as MapIcon, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  Trophy,
  Smile,
  Frown,
  Sparkles,
  Compass,
  MessageCircle,
  Laugh
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Data ---
const EXERCISES = [
  { q: "Yo ___ la televisión todas las noches.", a: "veo", opts: ["veo", "miro"], char: "Pedro" },
  { q: "¡___ ese pájaro tan bonito en el árbol!", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "No puedo ___ nada sin mis gafas.", a: "ver", opts: ["ver", "mirar"], char: "Pedro" },
  { q: "Ella se ___ en el espejo antes de salir.", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "¿Has ___ mi móvil? No lo encuentro.", a: "visto", opts: ["visto", "mirado"], char: "Pedro" },
  { q: "Estamos ___ una película de aventuras.", a: "viendo", opts: ["viendo", "mirando"], char: "Ernesto" },
  { q: "Los niños ___ los dibujos animados.", a: "ven", opts: ["ven", "miran"], char: "Pedro" },
  { q: "Él ___ el reloj para saber la hora.", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "Desde aquí se ___ las montañas nevadas.", a: "ven", opts: ["ven", "miran"], char: "Pedro" },
  { q: "¡___ con atención el experimento!", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "Ayer ___ a tu hermano en el cine.", a: "vi", opts: ["vi", "miré"], char: "Pedro" },
  { q: "Por favor, ___ por la ventana si llueve.", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "Quiero ___ tu habitación nueva.", a: "ver", opts: ["ver", "mirar"], char: "Pedro" },
  { q: "No me ___ así, por favor.", a: "mires", opts: ["veas", "mires"], char: "Ernesto" },
  { q: "Desde el avión se ___ las nubes.", a: "ven", opts: ["ven", "miran"], char: "Pedro" },
  { q: "Él ___ el mapa para no perderse.", a: "mira", opts: ["ve", "mira"], char: "Ernesto" },
  { q: "¿Puedes ___ el cartel desde tan lejos?", a: "ver", opts: ["ver", "mirar"], char: "Pedro" },
  { q: "Deja de ___ lo que estoy escribiendo.", a: "mirar", opts: ["ver", "mirar"], char: "Ernesto" },
  { q: "Sube al balcón para ___ el paisaje.", a: "ver", opts: ["ver", "mirar"], char: "Pedro" },
  { q: "¡No ___ atrás, sigue adelante!", a: "mires", opts: ["veas", "mires"], char: "Ernesto" }
];

// --- Utilities ---
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};

// --- Components ---

const Character = ({ type, state }: { type: 'Pedro' | 'Ernesto', state: 'idle' | 'asking' | 'laughing' | 'happy' }) => {
  const isPedro = type === 'Pedro';
  const color = isPedro ? 'bg-amber-500' : 'bg-blue-500';
  const shadowColor = isPedro ? 'shadow-amber-500/20' : 'shadow-blue-500/20';
  
  return (
    <motion.div 
      initial={false}
      animate={state === 'laughing' ? { rotate: [0, -10, 10, -10, 10, 0], y: [0, -20, 0, -20, 0] } : { y: [0, -5, 0] }}
      transition={state === 'laughing' ? { duration: 0.5, repeat: 2 } : { duration: 3, repeat: Infinity }}
      className="relative flex flex-col items-center"
    >
      {state === 'laughing' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1.2, y: -80 }}
          className="absolute z-20 pointer-events-none"
        >
          <div className="bg-white text-stone-900 px-4 py-2 rounded-2xl font-black italic shadow-xl border-2 border-stone-200">
             ¡JAJAJA! 😂
          </div>
        </motion.div>
      )}

      {/* 3D-ish Character Body */}
      <div className={`w-32 h-40 ${color} rounded-[50px] relative shadow-2xl ${shadowColor} border-t-8 border-white/20 perspective-1000`}>
        {/* Face */}
        <div className="absolute top-8 left-0 w-full flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <motion.div 
              animate={state === 'laughing' ? { height: 4, scaleY: 0.2 } : { height: 12, scaleY: 1 }}
              className="w-3 bg-stone-900 rounded-full" 
            />
            <motion.div 
              animate={state === 'laughing' ? { height: 4, scaleY: 0.2 } : { height: 12, scaleY: 1 }}
              className="w-3 bg-stone-900 rounded-full" 
            />
          </div>
          {isPedro && <div className="absolute top-[-40px] w-24 h-12 bg-stone-800 rounded-t-[100px] border-b-4 border-stone-900" />} {/* Hat */}
          {!isPedro && <div className="w-16 h-8 border-2 border-stone-900/10 rounded-full absolute top-[-10px]" />} {/* Glasses hint */}
          
          <motion.div 
            animate={state === 'laughing' ? { width: 30, height: 20, borderRadius: '20px 20px 40px 40px' } : { width: 16, height: 8 }}
            className="bg-stone-900 rounded-full mt-2" 
          />
        </div>
      </div>
      <p className="mt-4 font-black italic uppercase tracking-widest text-sm text-stone-400">{type}</p>
    </motion.div>
  );
};

export default function PerceptionAdventure() {
  const [view, setView] = useState<'intro' | 'adventure' | 'finish'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [score, setScore] = useState(0);

  const currentEx = EXERCISES[currentIdx];

  const handleAnswer = (opt: string) => {
    if (feedback !== 'none') return;
    
    const isCorrect = opt.toLowerCase() === currentEx.a.toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      speak(currentEx.q.replace('___', opt));
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      
      setTimeout(() => {
        if (currentIdx < EXERCISES.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setFeedback('none');
        } else {
          setView('finish');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      // Laughing effect
      setTimeout(() => {
        setFeedback('none');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-stone-100 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12"
          >
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-amber-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/20"
              >
                <Compass size={48} className="text-white" />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                Misión <br /><span className="text-amber-500">Percepción</span>
              </h1>
              <p className="text-stone-500 font-bold italic uppercase tracking-widest text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Օգնե՛ք Պեդրոյին և Էռնեստոյին տարբերել Ver և Mirar բայերը: Զգո՛ւյշ եղեք, նրանք սիրում են ծիծաղել սխալների վրա:
              </p>
            </div>

            <div className="flex gap-12">
               <Character type="Pedro" state="idle" />
               <Character type="Ernesto" state="idle" />
            </div>

            <button 
              onClick={() => setView('adventure')}
              className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95"
            >
              Comenzar Aventura
            </button>
          </motion.div>
        )}

        {view === 'adventure' && (
          <motion.div 
            key="adventure"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 py-12"
          >
            {/* Progress HUD */}
            <div className="flex justify-between items-center mb-16">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-white/5 flex items-center justify-center font-black italic text-amber-500 shadow-xl">
                    {currentIdx + 1}
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Progreso</p>
                     <div className="w-48 h-2 bg-stone-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentIdx / EXERCISES.length) * 100}%` }}
                          className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        />
                     </div>
                  </div>
               </div>
               <div className="bg-stone-900 px-6 py-2 rounded-full border border-white/5 flex items-center gap-3 shadow-xl">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="font-black italic text-lg">{score}</span>
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
               {/* Question Area */}
               <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                  <div className="shrink-0">
                    <Character 
                      type={currentEx.char as any} 
                      state={feedback === 'wrong' ? 'laughing' : feedback === 'correct' ? 'happy' : 'asking'} 
                    />
                    {/* Other character also laughs if wrong */}
                    <div className="hidden">
                       <Character type={currentEx.char === 'Pedro' ? 'Ernesto' : 'Pedro'} state={feedback === 'wrong' ? 'laughing' : 'idle'} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-8 relative">
                     <div className="bg-stone-900 border-4 border-stone-800 p-8 md:p-12 rounded-[50px] relative shadow-4xl">
                        <div className="absolute top-[-20px] left-8 w-10 h-10 bg-stone-800 rotate-45" />
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                          {currentEx.q.split('___')[0]}
                          <span className="text-amber-500 px-2 underline decoration-stone-700 mx-2">
                             {feedback === 'correct' ? currentEx.a : '___'}
                          </span>
                          {currentEx.q.split('___')[1]}
                        </h2>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {currentEx.opts.map((opt) => (
                          <motion.button
                            key={opt}
                            disabled={feedback !== 'none'}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(opt)}
                            className={`py-8 rounded-[40px] border-4 font-black text-2xl uppercase italic tracking-tighter transition-all ${
                              feedback === 'correct' && opt === currentEx.a
                                ? 'bg-emerald-600 border-white text-white shadow-2xl scale-110 z-10'
                                : feedback === 'wrong' && opt !== currentEx.a
                                ? 'bg-red-600 border-white text-white rotate-2'
                                : 'bg-stone-900 border-white/5 hover:border-amber-500/40 text-stone-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </motion.button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Hint of secondary character laughing off-screen */}
            {feedback === 'wrong' && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed bottom-12 right-12 flex flex-col items-center gap-4"
              >
                <Character type={currentEx.char === 'Pedro' ? 'Ernesto' : 'Pedro'} state="laughing" />
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'finish' && (
          <motion.div 
            key="finish"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12"
          >
            <div className="space-y-6">
               <Trophy size={120} className="text-amber-500 mx-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
               <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">¡Misión<br />Cumplida!</h2>
               <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Վերջապես դուք տիրապետում եք Ver և Mirar բայերին։</p>
            </div>

            <div className="bg-stone-900/50 p-12 rounded-[60px] border border-white/5 shadow-inner">
               <p className="text-xs font-black uppercase tracking-[0.4em] text-stone-600 mb-2">Puntuación Final</p>
               <h3 className="text-8xl font-black italic text-white">{score}</h3>
            </div>

            <button 
              onClick={() => { setView('intro'); setCurrentIdx(0); setScore(0); }}
              className="flex items-center gap-3 px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-2xl"
            >
              <RotateCcw size={20} /> Reiniciar Aventura
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-8 border-t border-white/5 flex justify-center opacity-20">
         <p className="text-[10px] font-black uppercase tracking-[1em]">Adventure Lab v2.0</p>
      </footer>
    </div>
  );
}
