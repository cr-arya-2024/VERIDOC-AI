'use client'
import React, { useState } from 'react';
import { Button } from './components/Button';
import { Card } from './components/Cards';
import { FileUpload } from './components/FileUpload';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeVerilogCode } from './services/geminiService';
import { AnalysisResult, AppState } from './lib/types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (code: string) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const data = await analyzeVerilogCode(code);
      setResult(data);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50 bg-[#0f172a]/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleReset}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
              V
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              VeriDoc AI
            </h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Benchmarks</a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">API</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col p-6 max-w-7xl mx-auto w-full">
        {appState === AppState.LANDING && (
          <div className="flex-grow flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center space-y-6 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                Verilog Analysis <br />
                <span className="text-indigo-500">Supercharged.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Upload your RTL designs and receive comprehensive documentation, logic insights, 
                and synthesis suggestions in seconds. Powered by advanced AI models.
              </p>
            </div>

            <FileUpload onAnalyze={handleAnalyze} isAnalyzing={false} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pt-12">
              <Card 
                title="Deep Logic Parsing" 
                subtitle="Beyond Linting"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>}
              >
                <p className="text-sm text-slate-400">Understand port functionality, signal flow, and potential timing bottlenecks automatically.</p>
              </Card>
              <Card 
                title="Synthesis Insights" 
                subtitle="Production Ready"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              >
                <p className="text-sm text-slate-400">Get estimates on gate count and suggestions for power or area optimizations.</p>
              </Card>
              <Card 
                title="Auto-Documentation" 
                subtitle="Smarter Handover"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              >
                <p className="text-sm text-slate-400">Generate executive summaries and port maps for your project stakeholders and team leads.</p>
              </Card>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex-grow flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing RTL Logic</h2>
              <p className="text-slate-400">Our silicon-grade AI is parsing modules and generating synthesis insights...</p>
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex-grow flex flex-col items-center justify-center space-y-6">
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center max-w-lg">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <Button onClick={handleReset}>Try Again</Button>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && result && (
          <AnalysisDisplay result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 p-8 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 VeriDoc AI. All rights reserved. Engineering excellence for the next generation of hardware.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
