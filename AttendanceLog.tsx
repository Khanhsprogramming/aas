
import React from 'react';
import { AttendanceRecord } from '../types';
import { History, UserCheck, Clock } from 'lucide-react';

interface AttendanceLogProps {
  records: AttendanceRecord[];
}

export const AttendanceLog: React.FC<AttendanceLogProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          Lịch sử quét gần đây
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase">Hôm nay</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Học sinh</th>
              <th className="px-6 py-4">Lớp</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  Chưa có dữ liệu quét trong phiên làm việc này
                </td>
              </tr>
            ) : (
              records.map((record, idx) => (
                <tr key={`${record.studentId}-${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">
                        {record.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{record.name}</p>
                        <p className="text-xs text-slate-400">{record.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{record.className}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{record.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      record.status === 'On Time' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <UserCheck className="w-3 h-3" />
                      {record.status === 'On Time' ? 'Đúng giờ' : 'Muộn'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
