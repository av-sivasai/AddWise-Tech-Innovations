import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AdminPage = () => {
  const user = useSelector((state) => state.user);
  const [numberOfQRCodes, setNumberOfQRCodes] = useState(1);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [allQRCodes, setAllQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/auth/users`;
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) setUsers(data.users);
      } catch (err) {}
    };
    // Fetch all QR codes
    const fetchAllQRCodes = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/qr/all`;
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) setAllQRCodes(data.qrCodes);
      } catch (err) {}
    };
    fetchUsers();
    fetchAllQRCodes();
  }, []);

  const generateRandomNumber = () => {
    const min = 1000000000000000;
    const max = 9999999999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleGenerateQRCodes = async () => {
    if (numberOfQRCodes < 1) {
      toast.error('Please enter a valid number of QR codes.');
      return;
    }
    setLoading(true);
    const newQRCodes = [];
    for (let i = 0; i < numberOfQRCodes; i++) {
      const randomNumber = generateRandomNumber();
      newQRCodes.push({
        value: randomNumber.toString(),
        timestamp: new Date().toISOString(),
      });
    }
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/save`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ qrCodes: newQRCodes })
      });
      if (response.ok) {
        setGeneratedQRCodes(newQRCodes);
        const allRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr/all`, { credentials: 'include' });
        const allData = await allRes.json();
        if (allRes.ok) setAllQRCodes(allData.qrCodes);
        toast.success(`${numberOfQRCodes} QR code(s) generated successfully!`);
      } else {
        toast.error('Failed to generate QR codes');
      }
    } catch (err) {
      toast.error('Failed to generate QR codes');
    }
    setLoading(false);
  };

  const downloadQRCode = (qrValue, index) => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector(`#qr-${index}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `qr-code-${qrValue}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const downloadAllQRCodes = () => {
    generatedQRCodes.forEach((qr, index) => {
      setTimeout(() => downloadQRCode(qr.value, index), index * 100);
    });
    toast.success('Downloading all QR codes...');
  };

  const handleDeleteQRCode = async (qrId) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/${qrId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        const allRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr/all`, { credentials: 'include' });
        const allData = await allRes.json();
        if (allRes.ok) setAllQRCodes(allData.qrCodes);
        toast.success('QR code deleted successfully!');
      } else {
        toast.error('Failed to delete QR code');
      }
    } catch (err) {
      toast.error('Failed to delete QR code');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 mb-8 transition-all duration-300 hover:shadow-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <div className="flex items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500">{user.user.name}</span>!</h2>
            <p className="text-gray-400 mb-6">Generate QR codes, download them, and share via WhatsApp/email. Users will scan them to claim.</p>
            
            <div className="mb-8 bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Generate QR Codes</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numberOfQRCodes}
                  onChange={(e) => setNumberOfQRCodes(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-32 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  disabled={loading}
                />
                <button
                  onClick={handleGenerateQRCodes}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : 'Generate QR Codes'}
                </button>
              </div>
            </div>

            {generatedQRCodes.length > 0 && (
              <div className="mb-8 bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Generated QR Codes</h3>
                  <button
                    onClick={downloadAllQRCodes}
                    className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-600 transition-all mt-2 sm:mt-0"
                  >
                    Download All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generatedQRCodes.map((qr, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all">
                      <div className="bg-white p-2 rounded">
                        <QRCodeSVG id={`qr-${index}`} value={qr.value} size={128} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center break-all">{qr.value}</p>
                      <button 
                        onClick={() => downloadQRCode(qr.value, index)}
                        className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded hover:from-blue-700 hover:to-indigo-700 text-xs w-full transition-all"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">All QR Codes & Assignments</h3>
              {allQRCodes.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No QR codes generated yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allQRCodes.map((qr) => (
                    <div key={qr._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all">
                      <div className="bg-white p-2 rounded">
                        <QRCodeSVG value={qr.value} size={128} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center break-all">{qr.value}</p>
                      <div className="mt-2">
                        <p className={`text-xs font-medium ${qr.isClaimed ? 'text-green-400' : 'text-yellow-400'}`}>
                          Status: {qr.isClaimed ? 'Claimed' : 'Unclaimed'}
                        </p>
                        {qr.isClaimed && (
                          <>
                            <p className="text-xs text-gray-400 mt-1">
                              Assigned to: {qr.user?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Purpose: {qr.purpose || 'Not specified'}
                            </p>
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteQRCode(qr._id)} 
                        className="mt-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded hover:from-red-700 hover:to-pink-700 text-xs w-full transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;