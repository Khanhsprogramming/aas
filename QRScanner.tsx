
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (text: string) => void;
  isPaused: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isPaused }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize once
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          if (!isPaused) {
            onScan(decodedText);
          }
        },
        (error) => {
          // Silent errors during scanning are normal
          // console.warn(error);
        }
      );
    }

    return () => {
      // Cleanup is usually handled by the library, but manual clear can be used
      // However, html5-qrcode-scanner.clear() is async and can be buggy in React dev mode
    };
  }, [onScan, isPaused]);

  return (
    <div id="qr-reader" className="overflow-hidden rounded-xl border-none shadow-inner bg-slate-100"></div>
  );
};
