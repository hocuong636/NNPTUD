# Kế hoạch triển khai (Implementation Plan)

**Giai đoạn 1: Khởi tạo Database Model**
*   Tạo schema `Inventory` bằng Mongoose với các trường: `product` (ObjectId, ref, unique), `stock`, `reserved`, `soldCount`.
*   Thiết lập các điều kiện `min: 0` để đảm bảo số lượng không bao giờ bị âm.

**Giai đoạn 2: Tích hợp logic tạo Inventory khi tạo Product**
*   Có thể xử lý bằng 2 cách:
    1.  **Mongoose Middleware:** Dùng hook `post('save')` trên schema `Product`.
    2.  **Service/Controller:** Thêm logic tạo `Inventory` ngay sau cú pháp `Product.create()` trong hàm tạo sản phẩm (khuyến nghị dùng Transaction/Session nếu cần đảm bảo toàn vẹn dữ liệu).

**Giai đoạn 3: Viết Controllers và Routes (Các API API Endpoints)**
*   **GET `/inventory`**: Truy vấn danh sách tất cả các inventory.
*   **GET `/inventory/:id`**: Truy vấn chi tiết, dùng `.populate('product')` để join với collection Product.
*   **POST `/inventory/add-stock`**: Dùng `$inc` tăng `stock`.
*   **POST `/inventory/remove-stock`**: Kiểm tra điều kiện `stock >= quantity`, dùng `$inc` giảm `stock`.
*   **POST `/inventory/reservation`**: Kiểm tra điều kiện `stock >= quantity`, dùng `$inc` để giảm `stock` và tăng `reserved`.
*   **POST `/inventory/sold`**: Kiểm tra điều kiện `reserved >= quantity`, dùng `$inc` để giảm `reserved` và tăng `soldCount`.

**Giai đoạn 4: Kiểm thử và Quản lý mã nguồn**
*   Cung cấp workspace trên Postman, tạo các request mẫu với body JSON tương ứng.
*   Chụp ảnh màn hình kết quả chạy thành công / thất bại.
*   Ghi nhận qua Git: `git add .`, tạo commit message có ý nghĩa.

---

# Prompt dành cho GitHub Copilot

Bạn hãy copy toàn bộ đoạn văn bản trong khung dưới đây và dán vào khung chat của GitHub Copilot (hoặc ChatGPT/Claude):

```text
Đóng vai trò là một Senior Backend Developer chuyên về Node.js, Express và MongoDB (Mongoose). Hãy giúp tôi viết mã nguồn hoàn chỉnh cho tính năng Quản lý Kho (Inventory) với những yêu cầu cụ thể sau đây:

### 1. Model:
Tạo một Mongoose Model `Inventory` với schema bao gồm:
- `product`: ObjectID, ref đến Mongoose model 'Product', required: true, unique: true.
- `stock`: Number, mặc định là 0, min: 0.
- `reserved`: Number, mặc định là 0, min: 0.
- `soldCount`: Number, mặc định là 0, min: 0.

### 2. Trigger - Tự động tạo Inventory:
- Viết một đoạn mã (có thể dùng Mongoose Middleware `post('save')` trên Product model, hoặc viết một Service mẫu) để đảm bảo: **Mỗi khi tạo 1 Product mới thì sẽ tự động tạo 1 Inventory tương ứng** với `product` là ID của Product vừa tạo, các thông số stock/reserved/soldCount bằng 0.

### 3. API Endpoints (Controllers & Routes):
Vui lòng viết các API sau (Method, Route, Controller):
- **Get All**: Trả về tất cả document trong collection Inventory.
- **Get By ID**: Get inventory theo ID và bắt buộc phải dùng `.populate()` để join lấy chi tiết của `product`.
- **Add Stock** (`POST /add-stock`): Nhận payload `{ productId, quantity }`. Sử dụng MongoDB operation `$inc` để **tăng** `stock` tương ứng với `quantity`.
- **Remove Stock** (`POST /remove-stock`): Nhận payload `{ productId, quantity }`. Phải kiểm tra kho (`stock` >= `quantity`). Dùng `$inc` để **giảm** `stock` tương ứng.
- **Reservation** (`POST /reservation`): Nhận payload `{ productId, quantity }`. Phải kiểm tra kho (`stock` >= `quantity`). Dùng `$inc` để đồng thời **giảm** `stock` và **tăng** `reserved` tương ứng.
- **Sold** (`POST /sold`): Nhận payload `{ productId, quantity }`. Phải kiểm tra lượng đã đặt trước (`reserved` >= `quantity`). Dùng `$inc` để đồng thời **giảm** `reserved` và **tăng** `soldCount` tương ứng.

### 4. Yêu cầu kỹ thuật & Chuẩn đầu ra:
- Phải bắt lỗi và xử lý ngoại lệ (try/catch), trả về HTTP Status Code hợp lý (200, 400, 404, 500).
- Chú ý xử lý tính nguyên tử (atomic updates) của cơ sở dữ liệu để tránh race-condition khi nhiều request đến cùng lúc.
- Ở cuối câu trả lời, hãy:
  1. Cấu trúc cho tôi các body JSON mẫu để tôi dán vào Postman thao tác test các chức năng.
  2. Viết sẵn lệnh Git (`git add`, `git commit -m`) với commit message hợp chuẩn Conventional Commits cho tính năng này.
```
