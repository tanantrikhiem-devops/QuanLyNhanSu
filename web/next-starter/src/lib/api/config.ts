/**
 * Cấu hình gọi API.
 *
 * Browser gọi thẳng FastAPI (backend đã bật CORS với `allow_credentials`).
 * Xác thực hoàn toàn bằng cookie httpOnly do backend phát — `access_token`
 * (60 phút) và `refresh_token` (30 ngày). JS không đọc được token nào, và cũng
 * không cần: browser tự đính kèm khi request có `credentials: "include"`.
 * Đây là mô hình an toàn nhất trước XSS — không có token nào nằm trong tầm với
 * của JavaScript.
 */

/**
 * Địa chỉ FastAPI.
 * `NEXT_PUBLIC_*` được nhúng vào bundle lúc **BUILD** → đổi giá trị phải build lại
 * (xem `build.args` trong `compose.yaml`).
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Prefix version của FastAPI (`app.include_router(api_router, prefix=...)`). */
export const API_VERSION_PREFIX = "/api/v1";

/** Trần thời gian cho một request, tránh spinner quay vô tận. */
export const REQUEST_TIMEOUT_MS = 15_000;
