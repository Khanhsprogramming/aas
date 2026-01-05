
/**
 * HƯỚNG DẪN:
 * 1. Mở file Google Sheet của bạn.
 * 2. Menu Mở rộng -> Apps Script.
 * 3. Dán mã này vào và lưu lại.
 * 4. Nhấn "Triển khai" -> "Tùy chọn triển khai mới" -> "Ứng dụng Web".
 * 5. Chọn quyền truy cập là "Bất kỳ ai" (Anyone).
 * 6. Copy URL nhận được và dán vào file HTML ở trên.
 */

const SHEET_ID = "1zas90KpEk2IaGFMl4kWlGxBRQSiYClSCaMJkothqSfk";
const LATE_THRESHOLD = "07:30:00"; // Giờ giới hạn đi muộn

function doGet(e) {
  const p = e.parameter;
  if (p.action === 'scan') {
    return handleAttendance(p.studentId, p.name, p.className);
  }
  return createResponse({ success: false, message: "Yêu cầu không hợp lệ" });
}

function handleAttendance(id, name, className) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];
    
    const now = new Date();
    const dateStr = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");
    const timeStr = Utilities.formatDate(now, "GMT+7", "HH:mm:ss");
    
    // 1. Kiểm tra xem đã quét trong hôm nay chưa
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const rowDate = Utilities.formatDate(new Date(data[i][0]), "GMT+7", "yyyy-MM-dd");
      const rowId = data[i][1].toString();
      if (rowDate === dateStr && rowId === id) {
        return createResponse({ success: false, message: "Học sinh này đã điểm danh hôm nay rồi!" });
      }
    }
    
    // 2. Kiểm tra đi muộn
    const status = isLate(timeStr) ? "Late" : "On Time";
    
    // 3. Ghi vào Sheet
    sheet.appendRow([dateStr, id, name, className, timeStr, status]);
    
    return createResponse({
      success: true,
      message: status === "Late" ? "Ghi nhận đi muộn" : "Điểm danh thành công",
      data: { studentId: id, name: name, className: className, timestamp: timeStr, status: status }
    });
    
  } catch (err) {
    return createResponse({ success: false, message: "Lỗi Server: " + err.toString() });
  }
}

function isLate(timeStr) {
  const [h, m, s] = timeStr.split(':').map(Number);
  const [lh, lm, ls] = LATE_THRESHOLD.split(':').map(Number);
  if (h > lh) return true;
  if (h === lh && m > lm) return true;
  return false;
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
