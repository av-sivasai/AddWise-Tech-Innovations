import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const QRScannerPage = () => {
  const [scannedValue, setScannedValue] = useState('');
  const [qrDetails, setQrDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!scannedValue.trim()) {
      toast.error('Please enter a QR code value');
      return;
    }

    setLoading(true);
    setError('');
    setQrDetails(null);

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/details/${scannedValue}`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      
      if (response.ok) {
        setQrDetails(data.qrCode);
        if (data.qrCode.isClaimed) {
          toast.success(`QR Code claimed by ${data.qrCode.user?.name || 'Unknown'}`);
        } else {
          toast.info('QR Code is available for claiming');
        }
      } else {
        setError(data.message || 'QR code not found');
        toast.error(data.message || 'QR code not found');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setError('Failed to scan QR code');
      toast.error('Failed to scan QR code');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen">
      <Navbar/>
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">QR Code Scanner</h1>
          
          <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Scan QR Code</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter QR Code Value:
              </label>
              <input
                type="text"
                value={scannedValue}
                onChange={(e) => setScannedValue(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter the QR code value to scan..."
              />
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </>
              ) : 'Scan QR Code'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              {error}
            </div>
          )}

          {qrDetails && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">QR Code Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-400">QR Code Value:</span>
                  <p className="text-white break-all mt-1">{qrDetails.value}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Status:</span>
                  <p className={`font-medium mt-1 ${qrDetails.isClaimed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {qrDetails.isClaimed ? 'Claimed' : 'Unclaimed'}
                  </p>
                </div>
                {qrDetails.isClaimed && (
                  <>
                    <div>
                      <span className="font-medium text-gray-400">Claimed by:</span>
                      <p className="text-white mt-1">
                        {qrDetails.user?.name || 'Unknown'} 
                        {qrDetails.user?.email && (
                          <span className="text-gray-400 text-sm block">{qrDetails.user.email}</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
                      <span className="font-bold text-green-300 text-lg">Purpose:</span>
                      <p className="text-green-100 text-lg mt-1">{qrDetails.purpose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Claimed on:</span>
                      <p className="text-white mt-1">{new Date(qrDetails.timestamp).toLocaleString()}</p>
                    </div>
                  </>
                )}
                {!qrDetails.isClaimed && (
                  <div>
                    <span className="font-medium text-gray-400">Generated on:</span>
                    <p className="text-white mt-1">{new Date(qrDetails.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;