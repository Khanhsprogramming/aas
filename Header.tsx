
import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white py-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QR Attendance</h1>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">School Management System</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-800 rounded-full border border-indigo-600">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-indigo-100">Hệ thống đang hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
            <span>Secure Sync</span>
          </div>
        </div>
      </div>
    </header>
  );
};
