import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';

export const QRScanner = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const startScanner = async () => {
    try {
      setError('');
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError('Camera access denied or unavailable');
      onError?.(err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        ref={scannerRef}
        className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-black min-h-[300px]"
      />
      {error && <p className="text-error text-sm text-center">{error}</p>}
      <div className="flex justify-center gap-3">
        {!scanning ? (
          <Button onClick={startScanner}>Start Scanner</Button>
        ) : (
          <Button variant="secondary" onClick={stopScanner}>
            Stop Scanner
          </Button>
        )}
      </div>
      {scanning && (
        <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
          <Spinner size="sm" />
          Point camera at ticket QR code
        </div>
      )}
    </div>
  );
};
