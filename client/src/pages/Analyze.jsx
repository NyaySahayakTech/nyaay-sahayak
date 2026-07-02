import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api/config';
import InputPanel from '../components/InputPanel';
import AnalyzingLoader from '../components/AnalyzingLoader';

const Analyze = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  // Load analysis parameters if user clicked a history case item on the Dashboard
  useEffect(() => {
    if (location.state && location.state.selectedCase) {
      setResult(location.state.selectedCase.analysis);
      // Clean up window navigation state to prevent re-rendering on manual refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAnalyze = async ({ text, file }) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      let response;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        response = await axios.post(`${API_BASE}/api/analyze`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        response = await axios.post(`${API_BASE}/api/analyze`, { text }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      }

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong. Make sure both Node.js and Python servers are running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 min-h-screen">
      <div className="mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-headline">New Case Analysis</h1>
        <p className="text-sm text-text-secondary mt-1">Submit case details or upload PDF briefs to consult our RAG precedents database.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Side: Input Panel Area */}
        <div className="w-full lg:w-1/3">
          <InputPanel onAnalyze={handleAnalyze} loading={loading} />
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium animate-fade-in text-center">
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Loader or Result Layout */}
        <div className="w-full lg:w-2/3 min-h-[500px]">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary/60 bg-surface/30 border border-dashed border-border rounded-2xl p-8">
              <span className="text-6xl mb-4 select-none">⚖️</span>
              <p className="text-lg font-medium text-text-primary/70">Your AI analysis will appear here</p>
              <p className="text-xs text-text-secondary mt-2 text-center max-w-xs leading-relaxed">
                Describe the situation or upload a domestic violence brief to see structured summaries, relevant acts, and precedents.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center">
              <AnalyzingLoader />
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Executive Summary Card */}
              <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-primary shadow-sm">
                <h3 className="text-xl font-bold text-text-primary mb-2">Executive Summary</h3>
                <p className="text-text-primary/95 text-sm leading-relaxed whitespace-pre-wrap">{result.summary}</p>
              </div>

              {/* Legal Analysis Card */}
              <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-purple-500 shadow-sm">
                <h3 className="text-xl font-bold text-text-primary mb-2">Legal Reasoning</h3>
                <p className="text-text-primary/95 text-sm leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
              </div>

              {/* Precedent Cases */}
              {result.similarCases && result.similarCases.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4 mt-8">Past Similar Cases (Precedents)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.similarCases.map((caseItem, idx) => (
                      <div key={idx} className="bg-surface p-5 rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                        <h4 className="font-bold text-primary mb-1">{caseItem.caseTitle} ({caseItem.year})</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                            Similarity: {caseItem.similarityScore}%
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{caseItem.decision}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-text-secondary text-center mt-8 italic">{result.disclaimer}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Analyze;