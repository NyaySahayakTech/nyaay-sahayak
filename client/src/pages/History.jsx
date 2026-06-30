import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Agar user login nahi hai, toh login page par bhej do
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Naye cases upar dikhane ke liye reverse kar rahe hain
        setHistoryData(response.data.reverse());
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">Your Past Cases</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : historyData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <span className="text-5xl">🗂️</span>
          <p className="mt-4 text-gray-500 text-lg">No history found. Try analyzing a case first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {historyData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {item.inputType || 'Text'}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">Original Text:</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm mb-4 line-clamp-3">
                {item.caseText}
              </p>
              
              <h3 className="text-lg font-bold text-blue-700 mb-2">AI Summary:</h3>
              <p className="text-gray-700">
                {item.analysis?.summary || "Summary not available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;