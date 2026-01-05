
import React from 'react';
import { AttendanceRecord } from '../types';
import { Users, CheckCircle2, Clock3 } from 'lucide-react';

interface StatsCardsProps {
  records: AttendanceRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ records }) => {
  const total = records.length;
  const onTime = records.filter(r => r.status === 'On Time').length;
  const late = records.filter(r => r.status === 'Late').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Tổng lượt</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{total}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Đúng giờ</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{onTime}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Clock3 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Đi muộn</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{late}</p>
      </div>
    </div>
  );
};
