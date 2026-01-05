
export interface AttendanceRecord {
  studentId: string;
  name: string;
  className: string;
  timestamp: string;
  status: 'On Time' | 'Late';
  message?: string;
}

export interface ScanResult {
  success: boolean;
  message: string;
  data?: AttendanceRecord;
}

export enum AttendanceStatus {
  ON_TIME = 'On Time',
  LATE = 'Late'
}
