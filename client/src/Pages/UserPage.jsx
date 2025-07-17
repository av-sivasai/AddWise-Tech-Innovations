import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GEOAPIFY_API_KEY = '6b330008a9f3461789406fe858f61f95'; // Replace with your real key

const UserPage = () => {
  const user = useSelector((state) => state.user);
  const [claimedQrCodes, setClaimedQrCodes] = useState([]);
  const [unclaimedQrCodes, setUnclaimedQrCodes] = useState([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedValue, setScannedValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const scannerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  // Add a ref for the map container
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Only show the current user's claimed QR codes with locations
  const userClaimedQRCodesWithLocation = claimedQrCodes.filter(qr => qr.location && qr.location.lat && qr.location.lng);

  // Add tracking state for each QR
  const [trackingStatus, setTrackingStatus] = useState({});

  useEffect(() => {
    fetchData();
  }, [user.user._id]);

  // Cleanup scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  // Get user location when claim modal opens
  useEffect(() => {
    if (showClaimModal && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          (err) => {
            toast.error('Location permission denied or unavailable');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser.');
      }
    }
    if (!showClaimModal) {
      setUserLocation(null);
    }
  }, [showClaimModal]);

  // Show all claim locations on a full map (for current user only)
  useEffect(() => {
    if (mapRef.current && userClaimedQRCodesWithLocation.length > 0) {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
      const map = L.map(mapRef.current).setView([22.9734, 78.6569], 4);
      leafletMapRef.current = map;
      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`, {
        attribution: '© OpenMapTiles © OpenStreetMap contributors',
        maxZoom: 20,
      }).addTo(map);
      userClaimedQRCodesWithLocation.forEach(qr => {
        const marker = L.marker([qr.location.lat, qr.location.lng], {
          icon: L.icon({
            iconUrl: 'https://maps.geoapify.com/v1/icon/?type=awesome&color=%23ff0000&icon=marker&apiKey=' + GEOAPIFY_API_KEY,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })
        }).addTo(map);
        marker.bindPopup(`<b>QR:</b> ${qr.value}<br/><b>Purpose:</b> ${qr.purpose}`);
      });
      if (userClaimedQRCodesWithLocation.length > 1) {
        const bounds = L.latLngBounds(userClaimedQRCodesWithLocation.map(qr => [qr.location.lat, qr.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [userClaimedQRCodesWithLocation]);

  const fetchData = async () => {
    if (!user.user._id) return;
    
    // Fetch claimed QR codes
    try {
      const claimedUrl = `${import.meta.env.VITE_API_BASE_URL}/qr/user/${user.user._id}`;
      const claimedResponse = await fetch(claimedUrl, { credentials: 'include' });
      const claimedData = await claimedResponse.json();
      if (claimedResponse.ok) {
        setClaimedQrCodes(claimedData.qrCodes);
      }
    } catch (error) {
      console.error('Error fetching claimed QR codes:', error);
    }

    // Fetch unclaimed QR codes
    try {
      const unclaimedUrl = `${import.meta.env.VITE_API_BASE_URL}/qr/unclaimed`;
      const unclaimedResponse = await fetch(unclaimedUrl, { credentials: 'include' });
      const unclaimedData = await unclaimedResponse.json();
      if (unclaimedResponse.ok) {
        setUnclaimedQrCodes(unclaimedData.qrCodes);
      }
    } catch (error) {
      console.error('Error fetching unclaimed QR codes:', error);
    }
  };

  const handleClaimQR = (qrCode) => {
    setSelectedQR(qrCode);
    setShowClaimModal(true);
  };

  const handleSubmitClaim = async () => {
    if (!purpose.trim()) {
      toast.error('Please enter a purpose');
      return;
    }
    if (!userLocation) {
      toast.error('Location not available. Please allow location access.');
      return;
    }
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/claim`;
        const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        body: JSON.stringify({
          qrId: selectedQR._id,
          purpose: purpose.trim(),
          userId: user.user._id,
          location: userLocation
        })
        });
        const data = await response.json();
        if (response.ok) {
        setShowClaimModal(false);
        setPurpose('');
        setSelectedQR(null);
        setUserLocation(null);
        // Refresh data
        fetchData();
        toast.success('QR code claimed successfully!');
      } else {
        toast.error('Failed to claim QR code');
        }
      } catch (error) {
      console.error('Error claiming QR code:', error);
      toast.error('Failed to claim QR code');
    }
    setLoading(false);
  };

  // Camera scanner handlers
  const handleCameraScan = (decodedText, decodedResult) => {
    console.log('Scanned QR code:', decodedText);
    setScannedValue(decodedText);
    setShowCameraModal(false);
    
    // Stop the scanner
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    
    toast.success('QR code scanned successfully!');
    
    // Find the QR code in unclaimed list
    const foundQR = unclaimedQrCodes.find(qr => qr.value === decodedText);
    if (foundQR) {
      handleClaimQR(foundQR);
    } else {
      toast.error('QR code not found in available codes');
      }
    };

  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    // Ignore parse errors (no QR found)
    if (
      error &&
      (error.message?.includes('No MultiFormat Readers were able to detect the code') ||
       error.toString().includes('No MultiFormat Readers were able to detect the code'))
    ) {
      // Do not show toast for this
      return;
    }
    if (error && error.name === 'NotAllowedError') {
      toast.error('Camera access denied. Please allow camera permission in your browser.');
    } else if (error && error.name === 'NotFoundError') {
      toast.error('No camera device found.');
    } else {
      toast.error('Camera error: ' + (error?.message || 'Unknown error'));
    }
  };

  // Add useEffect for camera scanner
  useEffect(() => {
    let html5Qr;
    if (showCameraModal) {
      setTimeout(() => {
        const qrRegionId = 'qr-reader';
        if (document.getElementById(qrRegionId)) {
          html5Qr = new Html5Qrcode(qrRegionId);
          html5Qr.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0
            },
            (decodedText) => {
              console.log('QR SCAN SUCCESS:', decodedText); // Debug log
              setScannedValue(decodedText);
              setShowCameraModal(false);
              html5Qr.stop().then(() => html5Qr.clear());
              toast.success('QR code scanned successfully!');
              // Find the QR code in unclaimed list
              const foundQR = unclaimedQrCodes.find(qr => qr.value === decodedText);
              if (foundQR) {
                handleClaimQR(foundQR);
              } else {
                toast.error('QR code not found in available codes');
              }
            },
            (error) => {
              // Only show real errors, not parse errors
              if (
                error &&
                (error.message?.includes('No MultiFormat Readers were able to detect the code') ||
                  error.toString().includes('No MultiFormat Readers were able to detect the code'))
              ) {
                return;
              }
              if (error && error.name === 'NotAllowedError') {
                toast.error('Camera access denied. Please allow camera permission in your browser.');
              } else if (error && error.name === 'NotFoundError') {
                toast.error('No camera device found.');
              } else {
                toast.error('Camera error: ' + (error?.message || 'Unknown error'));
              }
            }
          );
        }
      }, 100);
    }
    return () => {
      if (html5Qr) {
        html5Qr.stop().then(() => html5Qr.clear());
      }
    };
  }, [showCameraModal]);

  // Image upload handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const processUploadedImage = async () => {
    if (!uploadedFile) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Get image data for QR code detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          const qrValue = code.data;
          setScannedValue(qrValue);
          setShowUploadModal(false);
          setUploadedFile(null);
          
          // Find the QR code in unclaimed list
          const foundQR = unclaimedQrCodes.find(qr => qr.value === qrValue);
          if (foundQR) {
            handleClaimQR(foundQR);
            toast.success('QR code detected and found in available codes!');
          } else {
            toast.error('QR code detected but not found in available codes');
          }
        } else {
          toast.error('No QR code found in the uploaded image');
        }
        setLoading(false);
      };
      
      img.onerror = () => {
        toast.error('Failed to load the uploaded image');
        setLoading(false);
      };
      
      // Load the image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(uploadedFile);
      
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      toast.error('Failed to process uploaded image');
      setLoading(false);
    }
  };

  // Add a component for tracking and displaying path for each QR
  const QRTrackerBox = ({ qr, onTrack, onStop, isTracking }) => {
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);

    useEffect(() => {
      if (mapRef.current && qr.path && qr.path.length > 0) {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }
        const map = L.map(mapRef.current).setView([qr.path[qr.path.length-1].lat, qr.path[qr.path.length-1].lng], 12);
        leafletMapRef.current = map;
        L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`, {
          attribution: '© OpenMapTiles © OpenStreetMap contributors',
          maxZoom: 20,
        }).addTo(map);
        // Draw path as polyline
        const latlngs = qr.path.map(p => [p.lat, p.lng]);
        if (latlngs.length > 1) {
          L.polyline(latlngs, { color: 'red' }).addTo(map);
        }
        // Add markers for each point with step labels
        latlngs.forEach(([lat, lng], idx) => {
          let label = '';
          if (idx === 0) label = 'Start';
          else if (idx === latlngs.length - 1) label = 'End';
          else label = (idx + 1).toString();
          L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: 'https://maps.geoapify.com/v1/icon/?type=awesome&color=%23ff0000&icon=marker&apiKey=' + GEOAPIFY_API_KEY,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          }).addTo(map).bindPopup(label);
        });
        map.invalidateSize();
      }
      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      };
    }, [qr.path]);

    return (
      <div className="bg-white p-4 rounded-lg border mb-6">
        <QRCodeSVG value={qr.value} size={128} />
        <p className="text-sm text-gray-600 mt-2 text-center break-all">{qr.value}</p>
        <p className="text-xs text-green-600 mt-1 text-center">Purpose: {qr.purpose}</p>
        <div ref={mapRef} style={{ height: 250, width: '100%', margin: '16px 0', borderRadius: 8 }} />
        <div className="flex gap-2">
          <button
            onClick={onTrack}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full disabled:opacity-50"
            disabled={!isTracking}
          >
            Track the device
          </button>
          <button
            onClick={onStop}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
          >
            Stop Tracking
          </button>
        </div>
      </div>
    );
  };

  // In the main UserPage component, add handlers for tracking and stopping
  const handleTrackDevice = async (qr) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/qr/${qr.value}/path`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ lat, lng })
        });
        const data = await response.json();
        if (response.ok) {
          setClaimedQrCodes((prev) => prev.map(q => q._id === qr._id ? { ...q, path: data.qrCode.path, location: data.qrCode.location } : q));
          toast.success('Device tracked and path updated!');
        } else {
          toast.error(data.message || 'Failed to track device');
        }
      } catch (error) {
        toast.error('Failed to track device');
      }
    }, (err) => {
      toast.error('Location permission denied or unavailable');
    });
    setTrackingStatus((prev) => ({ ...prev, [qr._id]: false })); // Disable tracking after one track
  };

  const handleStartTracking = (qr) => {
    setTrackingStatus((prev) => ({ ...prev, [qr._id]: true }));
  };

  const handleStopTracking = (qr) => {
    setTrackingStatus((prev) => ({ ...prev, [qr._id]: false }));
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-[#932558] p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ffffff] mb-6">User Dashboard</h1>
          <div className="bg-[#ba229c] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1c180d] mb-4">Welcome, {user.user.name}!</h2>
            <p className="text-white-600 mb-6">Scan or upload QR codes to claim them.</p>
            
            {/* Scan Options */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setShowCameraModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                📷 Scan with Camera
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                📁 Upload QR Image
              </button>
              <button
                onClick={() => {
                  const qrValue = prompt('Enter the QR code value:');
                  if (qrValue && qrValue.trim()) {
                    const foundQR = unclaimedQrCodes.find(qr => qr.value === qrValue.trim());
                    if (foundQR) {
                      handleClaimQR(foundQR);
                    } else {
                      toast.error('QR code not found in available codes');
                    }
                  }
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
              >
                ⌨️ Manual Entry
              </button>
            </div>
        </div>

          {/* Claimed QR Codes */}
          {claimedQrCodes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-[#1c180d]">Your Claimed QR Codes (with Tracking)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {claimedQrCodes.map((qr) => (
                <QRTrackerBox
                  key={qr._id}
                  qr={qr}
                  onTrack={() => handleTrackDevice(qr)}
                  onStop={() => handleStopTracking(qr)}
                  isTracking={trackingStatus[qr._id] !== false}
                />
              ))}
            </div>
          </div>
        )}

          {/* Interactive User QR Claim Locations Map (for current user only) */}
          {userClaimedQRCodesWithLocation.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-[#1c180d]">Your QR Claim Locations (Interactive Map)</h3>
              <div ref={mapRef} style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #eee' }}></div>
            </div>
          )}

          {claimedQrCodes.length === 0 && (
            <div className="text-center text-gray-500">
              <p>You haven't claimed any QR codes yet. Use the scan options above to claim QR codes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code with Camera</h3>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <div id="qr-reader" style={{ width: '100%', height: '300px' }}></div>
            </div>
            <div className="text-sm text-gray-600 mb-4 text-center">
              Point your camera at a QR code to scan it
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCameraModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload QR Code Image</h3>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full border rounded-md px-3 py-2"
              />
              {uploadedFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected: {uploadedFile.name}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={processUploadedImage}
                disabled={!uploadedFile || loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Process Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Claim QR Code</h3>
            <div className="mb-4">
              <QRCodeSVG value={selectedQR.value} size={128} />
              <p className="text-sm text-gray-600 mt-2 text-center break-all">{selectedQR.value}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose for this QR code:
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the purpose for this QR code..."
                rows="3"
              />
            </div>
            {userLocation && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Location:</label>
                <div className="w-full h-48 rounded overflow-hidden border">
                  <iframe
                    title="User Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${userLocation.lng},${userLocation.lat}&zoom=15&marker=lonlat:${userLocation.lng},${userLocation.lat};color:%23ff0000;size:large&apiKey=${GEOAPIFY_API_KEY}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setPurpose('');
                  setSelectedQR(null);
                  setUserLocation(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClaim}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Claiming...' : 'Claim'}
              </button>
            </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default UserPage; 