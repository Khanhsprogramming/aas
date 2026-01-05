
import React, { useState, useEffect, useCallback } from 'react';
import { QRScanner } from './components/QRScanner';
import { AttendanceLog } from './components/AttendanceLog';
import { StatsCards } from './components/StatsCards';
import { Header } from './components/Header';
import { AttendanceRecord } from './types';
import { submitAttendance } from './services/attendanceService';
import { Bell, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [lastScan, setLastScan] = useState<AttendanceRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Audio for beep
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
  };

  const handleScan = useCallback(async (decodedText: string) => {
    if (isProcessing) return;

    // Pattern: StudentID|Name|Class
    const parts = decodedText.split('|');
    if (parts.length !== 3) {
      setError('Mã QR không hợp lệ. Định dạng yêu cầu: Mã|Tên|Lớp');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const [studentId, name, className] = parts;

    setIsProcessing(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await submitAttendance(studentId, name, className);
      
      if (result.success && result.data) {
        playBeep();
        setLastScan(result.data);
        setRecords(prev => [result.data!, ...prev].slice(0, 50));
        setSuccessMsg(result.message);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(result.message);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scanner & Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Máy Quét Điểm Danh
            </h2>
            
            <div className="relative">
              <QRScanner onScan={handleScan} isPaused={isProcessing} />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-2" />
                  <p className="font-medium text-slate-700">Đang kiểm tra dữ liệu...</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {successMsg && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{successMsg}</p>
                </div>
              )}
              
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-bottom-2">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {!error && !successMsg && !isProcessing && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm italic">Đưa mã QR của học sinh vào khung hình để quét</p>
                </div>
              )}
            </div>
          </div>

          {lastScan && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in zoom-in-95">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Thông tin vừa quét</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                  {lastScan.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-800">{lastScan.name}</p>
                  <p className="text-slate-500">ID: {lastScan.studentId} • Lớp: {lastScan.className}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      lastScan.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {lastScan.status === 'On Time' ? 'ĐÚNG GIỜ' : 'ĐI MUỘN'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{lastScan.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Stats & Log */}
        <div className="lg:col-span-7 space-y-6">
          <StatsCards records={records} />
          <AttendanceLog records={records} />
        </div>
      </main>
    </div>
  );
};

export default App;
