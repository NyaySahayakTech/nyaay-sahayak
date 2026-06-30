import React, { useState } from 'react';
import axios from 'axios';

const Analyze = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (text.length < 50) {
      setError("Please enter at least 50 characters to get a good analysis.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Node.js backend ko bhej rahe hain (Jo aage Python ko bhejega)
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/analyze', 
        { text: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Make sure both Node.js and Python servers are running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">New Case Analysis</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Input Area */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Enter Case Details</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
            placeholder="Type your legal problem here... (Minimum 50 characters)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "🤖 AI is analyzing (Takes ~10 secs)..." : "Analyze Case"}
          </button>
          
          {error && <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>}
        </div>

        {/* Right Side: AI Results */}
        <div className="w-full lg:w-2/3 bg-gray-50 p-6 rounded-2xl border border-gray-200 min-h-[500px]">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-6xl mb-4">⚖️</span>
              <p className="text-lg">Your AI analysis will appear here</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-blue-500">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="animate-pulse font-medium">Searching thousands of cases and analyzing legal provisions...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed">{result.summary}</p>
              </div>

              {/* Legal Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Legal Reasoning</h3>
                <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Similar Cases */}
              {result.similarCases && result.similarCases.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Past Similar Cases (Precedents)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.similarCases.map((caseItem, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <h4 className="font-bold text-blue-700 mb-1">{caseItem.caseTitle} ({caseItem.year})</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Similarity: {caseItem.similarityScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{caseItem.decision}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-400 text-center mt-8 italic">{result.disclaimer}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Analyze;