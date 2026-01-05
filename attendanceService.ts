
import { ScanResult, AttendanceRecord } from '../types';

/**
 * IMPORTANT: 
 * This URL is the Web App URL generated when you deploy your Google Apps Script.
 * For this demo, we'll use a placeholder that matches the script functionality.
 * Replace with your real URL after deploying the script provided.
 */
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby3j-M6X_X7P7oI_tE1fS7e_U6uN7E_K4vX/exec';

export const submitAttendance = async (
  studentId: string, 
  name: string, 
  className: string
): Promise<ScanResult> => {
  try {
    // In a real scenario, you'd call the GAS Web App.
    // GAS often requires JSONP or a simple fetch with mode 'no-cors' if just sending.
    // However, to get a JSON response, the script must be deployed as a Web App 
    // and correctly handle CORS.
    
    // Construct the URL with params (GET is often easier for simple GAS integrations)
    const url = new URL(GAS_WEB_APP_URL);
    url.searchParams.append('studentId', studentId);
    url.searchParams.append('name', name);
    url.searchParams.append('className', className);
    url.searchParams.append('action', 'scan');

    // MOCK RESPONSE FOR DEMO UI (Since the real script needs to be deployed by user)
    // To use real GAS, uncomment the fetch block below and comment the simulation.
    
    /*
    const response = await fetch(url.toString(), { method: 'GET' });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result;
    */

    // --- START SIMULATION ---
    console.log(`Submitting scan for: ${studentId} | ${name} | ${className}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    // Simulate "Late" if after 7:30 AM
    const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 30);
    
    // Simulate duplicate check (local only for demo)
    if (Math.random() < 0.1) {
      return {
        success: false,
        message: `Học sinh ${name} đã được điểm danh trước đó trong hôm nay!`
      };
    }

    const record: AttendanceRecord = {
      studentId,
      name,
      className,
      timestamp: currentTimeStr,
      status: isLate ? 'Late' : 'On Time'
    };

    return {
      success: true,
      message: `Điểm danh thành công: ${name}`,
      data: record
    };
    // --- END SIMULATION ---

  } catch (error) {
    console.error('Error submitting attendance:', error);
    return {
      success: false,
      message: 'Lỗi hệ thống khi gửi dữ liệu lên Google Sheets.'
    };
  }
};
