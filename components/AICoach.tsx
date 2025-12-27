
import React, { useState } from 'react';
import { Send, Sparkles, Brain, Loader2, Quote } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const AICoach: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const getCoaching = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `The user is trying to focus but says: "${input}". 
      Acting as a high-performance productivity coach, provide a JSON response with:
      - "message": A empathetic and firm response.
      - "motivation": A powerful quote.
      - "strategy": A 3-step actionable technique to stop the distraction right now.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              motivation: { type: Type.STRING },
              strategy: { type: Type.STRING },
            },
            required: ["message", "motivation", "strategy"]
          }
        }
      });

      const data = JSON.parse(result.text);
      setResponse(data);
    } catch (error) {
      console.error(error);
      setResponse({
        message: "I'm having trouble connecting to the network, but remember: your goals are bigger than your distractions.",
        motivation: "Discipline is choosing between what you want now and what you want most.",
        strategy: "1. Stand up and stretch. 2. Close all social tabs. 3. Drink a glass of water."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex p-3 bg-indigo-600/20 rounded-2xl mb-4">
          <Brain className="text-indigo-400 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">ZenFlow AI Coach</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Tell the AI what's distracting you or how you're feeling, and get a custom strategy to stay on track.
        </p>
      </div>

      <div className="glass rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
        <div className="relative mb-6">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I keep checking Twitter because I'm bored with this spreadsheet..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] transition-all"
          />
          <button 
            onClick={getCoaching}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Get Advice
          </button>
        </div>

        {response && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-800/50 rounded-2xl border-l-4 border-indigo-500">
              <h4 className="text-xs uppercase font-black text-indigo-400 mb-2 tracking-widest">Coach Response</h4>
              <p className="text-slate-200 leading-relaxed italic">"{response.message}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <Quote className="text-amber-400 mb-3" size={24} />
                <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase">Motivation</h4>
                <p className="text-white font-medium italic">{response.motivation}</p>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-indigo-400" size={20} />
                    <h4 className="text-sm font-bold text-slate-400 uppercase">Immediate Strategy</h4>
                </div>
                <div className="text-slate-300 text-sm leading-loose whitespace-pre-line">
                  {response.strategy}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;
