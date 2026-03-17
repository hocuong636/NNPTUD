# 📬 Hướng Dẫn Test API Bằng Postman — Dự Án NNPTUD-C3

> **Base URL:** `http://localhost:3000/api/v1`
>
> **Server:** Node.js + Express + MongoDB (Mongoose)
>
> **Port mặc định:** `3000`

---

## 📋 Mục Lục

1. [Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
2. [Cài đặt Postman](#2-cài-đặt-postman)
3. [Khởi động Server](#3-khởi-động-server)
4. [API Roles](#4-api-roles)
5. [API Users](#5-api-users)
6. [API Auth (Đăng ký, Đăng nhập, Phân quyền)](#6-api-auth)
7. [API Categories](#7-api-categories)
8. [API Products](#8-api-products)
9. [API Inventory (Quản lý Kho)](#9-api-inventory)
10. [Quy trình test hoàn chỉnh từ đầu đến cuối](#10-quy-trình-test-hoàn-chỉnh-từ-đầu-đến-cuối)
11. [Xử lý lỗi thường gặp](#11-xử-lý-lỗi-thường-gặp)

---

## 1. Chuẩn bị môi trường

### Yêu cầu hệ thống

| Phần mềm    | Phiên bản tối thiểu | Ghi chú                          |
| ----------- | -------------------- | -------------------------------- |
| Node.js     | v18+                 | https://nodejs.org               |
| MongoDB     | v6+                  | Chạy trên `localhost:27017`      |
| Postman     | Mới nhất             | https://www.postman.com/downloads |

### Cài đặt dependencies

```bash
cd D:\code\NNPTUD-C3
npm install
```

### Kiểm tra MongoDB

Đảm bảo MongoDB đang chạy trên `mongodb://localhost:27017`. Database sẽ tự động tạo với tên `NNPTUD-C3`.

---

## 2. Cài đặt Postman

1. Tải Postman tại: https://www.postman.com/downloads
2. Cài đặt và mở Postman.
3. Tạo một **Collection** mới, đặt tên: `NNPTUD-C3 API Testing`.
4. Trong Collection, tạo các **Folder** tương ứng:
   - `Roles`
   - `Users`
   - `Auth`
   - `Categories`
   - `Products`
   - `Inventory`

### Cấu hình biến môi trường (Environment Variables)

1. Nhấn biểu tượng **Environments** (góc trên bên phải) → **Create Environment**.
2. Đặt tên: `NNPTUD-C3 Local`.
3. Thêm các biến:

| Variable       | Initial Value                    | Mô tả                  |
| -------------- | -------------------------------- | ----------------------- |
| `baseUrl`      | `http://localhost:3000/api/v1`   | Base URL của API        |
| `token`        | _(để trống)_                     | JWT token sau khi login |
| `roleId`       | _(để trống)_                     | ID của Role đã tạo     |
| `userId`       | _(để trống)_                     | ID của User đã tạo     |
| `categoryId`   | _(để trống)_                     | ID của Category đã tạo |
| `productId`    | _(để trống)_                     | ID của Product đã tạo  |
| `inventoryId`  | _(để trống)_                     | ID của Inventory        |

4. Nhấn **Save** và chọn environment `NNPTUD-C3 Local` ở dropdown góc trên bên phải.

> 💡 **Mẹo:** Trong URL, dùng `{{baseUrl}}` thay cho `http://localhost:3000/api/v1` để dễ quản lý.

---

## 3. Khởi động Server

```bash
cd D:\code\NNPTUD-C3
npm start
```

Khi thấy terminal hiện `connected` nghĩa là server đã kết nối thành công MongoDB và sẵn sàng nhận request.

---

## 4. API Roles

> **Base path:** `{{baseUrl}}/roles`
>
> ⚠️ **Test Roles TRƯỚC TIÊN** vì User cần có `role` khi tạo.

### 4.1 Tạo Role mới

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/roles`            |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

**Body:**
```json
{
  "name": "ADMIN",
  "description": "Quản trị viên hệ thống"
}
```

**Kết quả mong đợi:** `200 OK` — trả về object role vừa tạo (có `_id`).

> 📌 **Lưu lại `_id`** trả về → Gán vào biến `roleId` trong Environment.
>
> Hoặc thêm đoạn script sau vào tab **Tests** của Postman để tự động lưu:
> ```javascript
> let res = pm.response.json();
> pm.environment.set("roleId", res._id);
> ```

#### Tạo thêm role USER (tùy chọn):

```json
{
  "name": "USER",
  "description": "Người dùng thông thường"
}
```

#### Tạo thêm role MODERATOR (tùy chọn):

```json
{
  "name": "MODERATOR",
  "description": "Người kiểm duyệt"
}
```

---

### 4.2 Lấy tất cả Roles

| Thuộc tính | Giá trị             |
| ---------- | ------------------- |
| **Method** | `GET`               |
| **URL**    | `{{baseUrl}}/roles` |

**Kết quả mong đợi:** `200 OK` — mảng chứa các role.

---

### 4.3 Lấy Role theo ID

| Thuộc tính | Giá trị                      |
| ---------- | ---------------------------- |
| **Method** | `GET`                        |
| **URL**    | `{{baseUrl}}/roles/{{roleId}}` |

**Kết quả mong đợi:** `200 OK` — object role tương ứng.

---

### 4.4 Cập nhật Role

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `PUT`                          |
| **URL**     | `{{baseUrl}}/roles/{{roleId}}` |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

```json
{
  "description": "Quản trị viên cấp cao nhất"
}
```

**Kết quả mong đợi:** `200 OK` — object role đã được cập nhật.

---

### 4.5 Xóa Role (Soft Delete)

| Thuộc tính | Giá trị                        |
| ---------- | ------------------------------ |
| **Method** | `DELETE`                       |
| **URL**    | `{{baseUrl}}/roles/{{roleId}}` |

**Kết quả mong đợi:** `200 OK` — object role với `isDeleted: true`.

> ⚠️ **Lưu ý:** Đừng xóa role ADMIN nếu bạn còn cần dùng cho các bước test tiếp theo!

---

## 5. API Users

> **Base path:** `{{baseUrl}}/users`
>
> ⚠️ API `GET /users` yêu cầu đăng nhập với role **ADMIN** hoặc **MODERATOR**.

### 5.1 Tạo User mới

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/users`            |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

**Body:**
```json
{
  "username": "admin01",
  "password": "Admin@123456",
  "email": "admin01@gmail.com",
  "role": "{{roleId}}"
}
```

> ⚠️ **Password phải đạt yêu cầu:** ít nhất 8 ký tự, gồm 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.

**Kết quả mong đợi:** `200 OK` — object user vừa tạo.

> 📌 Lưu `_id` → biến `userId`.
> ```javascript
> let res = pm.response.json();
> pm.environment.set("userId", res._id);
> ```

---

### 5.2 Lấy tất cả Users

| Thuộc tính    | Giá trị              |
| ------------- | -------------------- |
| **Method**    | `GET`                |
| **URL**       | `{{baseUrl}}/users`  |
| **Headers**   | `Authorization: Bearer {{token}}` |

> 🔒 **Cần đăng nhập** với role ADMIN hoặc MODERATOR. Xem [mục 6.2](#62-đăng-nhập) để lấy token trước.

**Kết quả mong đợi:** `200 OK` — mảng users.

---

### 5.3 Lấy User theo ID

| Thuộc tính | Giá trị                         |
| ---------- | -------------------------------- |
| **Method** | `GET`                            |
| **URL**    | `{{baseUrl}}/users/{{userId}}`   |

**Kết quả mong đợi:** `200 OK` — object user (populate role).

---

### 5.4 Cập nhật User

| Thuộc tính  | Giá trị                         |
| ----------- | -------------------------------- |
| **Method**  | `PUT`                            |
| **URL**     | `{{baseUrl}}/users/{{userId}}`   |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                       |

```json
{
  "fullName": "Nguyễn Văn A",
  "status": true
}
```

**Kết quả mong đợi:** `200 OK` — object user đã cập nhật.

---

### 5.5 Xóa User (Soft Delete)

| Thuộc tính | Giá trị                        |
| ---------- | ------------------------------ |
| **Method** | `DELETE`                       |
| **URL**    | `{{baseUrl}}/users/{{userId}}` |

**Kết quả mong đợi:** `200 OK` — object user với `isDeleted: true`.

---

## 6. API Auth

> **Base path:** `{{baseUrl}}/auth`

### 6.1 Đăng ký (Register)

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/auth/register`    |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

```json
{
  "username": "user01",
  "password": "User@123456",
  "email": "user01@gmail.com"
}
```

> ℹ️ Register tự động gán role mặc định (hardcode ID `69b8f27483fa00b0a71e722b` trong code). Nếu role ID này không tồn tại trong DB, bạn cần sửa lại trong `routes/auth.js`.

**Kết quả mong đợi:** `200 OK` — object user vừa đăng ký.

---

### 6.2 Đăng nhập (Login)

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/auth/login`       |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

```json
{
  "username": "admin01",
  "password": "Admin@123456"
}
```

**Kết quả mong đợi:** `200 OK` — trả về **JWT token** (chuỗi string).

> 📌 **Rất quan trọng — Lưu token:**
>
> Cách 1: Copy token trả về → gán vào biến `token` trong Environment.
>
> Cách 2: Thêm script vào tab **Tests**:
> ```javascript
> pm.environment.set("token", pm.response.text());
> ```
>
> Sau đó, với các API yêu cầu xác thực, thêm Header:
> ```
> Authorization: Bearer {{token}}
> ```

> ⚠️ **Lưu ý:** Nếu đăng nhập sai 3 lần liên tiếp, tài khoản sẽ bị **khóa 1 giờ**.

---

### 6.3 Xem thông tin tài khoản đang đăng nhập (Me)

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `GET`                               |
| **URL**     | `{{baseUrl}}/auth/me`               |
| **Headers** | `Authorization: Bearer {{token}}`   |

**Kết quả mong đợi:** `200 OK` — object user hiện tại (populate role).

---

### 6.4 Đổi mật khẩu (Change Password)

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `POST`                              |
| **URL**     | `{{baseUrl}}/auth/changepassword`   |
| **Headers** | `Authorization: Bearer {{token}}`   |
|             | `Content-Type: application/json`    |
| **Body**    | raw → JSON                          |

```json
{
  "oldpassword": "Admin@123456",
  "newpassword": "Admin@654321"
}
```

**Kết quả mong đợi:** `200 OK` — `"doi thanh cong"`.

---

### 6.5 Quên mật khẩu (Forgot Password)

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `POST`                              |
| **URL**     | `{{baseUrl}}/auth/forgotpassword`   |
| **Headers** | `Content-Type: application/json`    |
| **Body**    | raw → JSON                          |

```json
{
  "email": "admin01@gmail.com"
}
```

**Kết quả mong đợi:** `200 OK` — `"kiem tra mail"`. Hệ thống gửi email chứa link reset.

---

### 6.6 Reset mật khẩu (Reset Password)

| Thuộc tính  | Giá trị                                            |
| ----------- | --------------------------------------------------- |
| **Method**  | `POST`                                              |
| **URL**     | `{{baseUrl}}/auth/resetpassword/<TOKEN_TỪ_EMAIL>`   |
| **Headers** | `Content-Type: application/json`                     |
| **Body**    | raw → JSON                                          |

```json
{
  "password": "NewPass@123456"
}
```

> Thay `<TOKEN_TỪ_EMAIL>` bằng token nhận được qua email.

**Kết quả mong đợi:** `200 OK` — `"thanh cong"`.

---

### 6.7 Đăng xuất (Logout)

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `POST`                              |
| **URL**     | `{{baseUrl}}/auth/logout`           |
| **Headers** | `Authorization: Bearer {{token}}`   |

**Kết quả mong đợi:** `200 OK` — `"logout"`.

---

## 7. API Categories

> **Base path:** `{{baseUrl}}/categories`
>
> ⚠️ **Test Categories TRƯỚC Products** vì Product cần có `category`.

### 7.1 Tạo Category mới

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/categories`       |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

```json
{
  "name": "Điện thoại"
}
```

**Kết quả mong đợi:** `200 OK` — object category (tự tạo `slug` từ `name`).

> 📌 Lưu `_id` → biến `categoryId`.
> ```javascript
> let res = pm.response.json();
> pm.environment.set("categoryId", res._id);
> ```

#### Tạo thêm category (tùy chọn):

```json
{
  "name": "Laptop"
}
```

---

### 7.2 Lấy tất cả Categories

| Thuộc tính | Giá trị                    |
| ---------- | -------------------------- |
| **Method** | `GET`                      |
| **URL**    | `{{baseUrl}}/categories`   |

**Kết quả mong đợi:** `200 OK` — mảng categories (chỉ lấy `isDeleted: false`).

---

### 7.3 Lấy Category theo ID

| Thuộc tính | Giá trị                                  |
| ---------- | ---------------------------------------- |
| **Method** | `GET`                                    |
| **URL**    | `{{baseUrl}}/categories/{{categoryId}}`  |

**Kết quả mong đợi:** `200 OK` — object category.

---

### 7.4 Cập nhật Category

| Thuộc tính  | Giá trị                                  |
| ----------- | ---------------------------------------- |
| **Method**  | `PUT`                                    |
| **URL**     | `{{baseUrl}}/categories/{{categoryId}}`  |
| **Headers** | `Content-Type: application/json`         |
| **Body**    | raw → JSON                               |

```json
{
  "name": "Smartphone",
  "description": "Danh mục điện thoại thông minh"
}
```

**Kết quả mong đợi:** `200 OK` — object category đã cập nhật.

---

### 7.5 Xóa Category (Soft Delete)

| Thuộc tính | Giá trị                                  |
| ---------- | ---------------------------------------- |
| **Method** | `DELETE`                                 |
| **URL**    | `{{baseUrl}}/categories/{{categoryId}}`  |

**Kết quả mong đợi:** `200 OK` — object category với `isDeleted: true`.

> ⚠️ Đừng xóa category nếu bạn còn cần dùng cho Products!

---

## 8. API Products

> **Base path:** `{{baseUrl}}/products`
>
> ⚠️ Đảm bảo đã tạo ít nhất 1 Category trước khi tạo Product.
>
> ℹ️ Khi tạo Product mới, hệ thống **tự động tạo 1 Inventory** tương ứng (via `post('save')` hook).

### 8.1 Tạo Product mới

| Thuộc tính  | Giá trị                        |
| ----------- | ------------------------------ |
| **Method**  | `POST`                         |
| **URL**     | `{{baseUrl}}/products`         |
| **Headers** | `Content-Type: application/json` |
| **Body**    | raw → JSON                     |

```json
{
  "title": "iPhone 16 Pro Max",
  "price": 34990000,
  "description": "iPhone 16 Pro Max 256GB chính hãng",
  "category": "{{categoryId}}",
  "images": [
    "https://i.imgur.com/example1.jpg",
    "https://i.imgur.com/example2.jpg"
  ]
}
```

**Kết quả mong đợi:** `200 OK` — object product vừa tạo (có `_id`, `slug` tự sinh).

> 📌 Lưu `_id` → biến `productId`.
> ```javascript
> let res = pm.response.json();
> pm.environment.set("productId", res._id);
> ```

> ✅ **Kiểm tra:** Gọi `GET {{baseUrl}}/inventory` — phải thấy 1 inventory mới được tạo tự động với `product` = `productId` vừa tạo.

#### Tạo thêm product (tùy chọn):

```json
{
  "title": "Samsung Galaxy S25 Ultra",
  "price": 29990000,
  "description": "Samsung Galaxy S25 Ultra 512GB",
  "category": "{{categoryId}}"
}
```

---

### 8.2 Lấy tất cả Products

| Thuộc tính | Giá trị                  |
| ---------- | ------------------------ |
| **Method** | `GET`                    |
| **URL**    | `{{baseUrl}}/products`   |

**Kết quả mong đợi:** `200 OK` — mảng products (populate category, chỉ lấy `isDeleted: false`).

#### Tìm kiếm & lọc (Query Params):

| URL                                                                 | Mô tả                              |
| ------------------------------------------------------------------- | ----------------------------------- |
| `{{baseUrl}}/products?title=iphone`                                 | Tìm theo title (không phân biệt hoa thường) |
| `{{baseUrl}}/products?minprice=10000000&maxprice=40000000`          | Lọc theo khoảng giá                |
| `{{baseUrl}}/products?title=samsung&minprice=20000000&maxprice=35000000` | Kết hợp tìm kiếm + lọc giá     |

---

### 8.3 Lấy Product theo ID

| Thuộc tính | Giá trị                                |
| ---------- | -------------------------------------- |
| **Method** | `GET`                                  |
| **URL**    | `{{baseUrl}}/products/{{productId}}`   |

**Kết quả mong đợi:** `200 OK` — object product.

---

### 8.4 Cập nhật Product

| Thuộc tính  | Giá trị                                |
| ----------- | --------------------------------------- |
| **Method**  | `PUT`                                   |
| **URL**     | `{{baseUrl}}/products/{{productId}}`    |
| **Headers** | `Content-Type: application/json`        |
| **Body**    | raw → JSON                              |

```json
{
  "price": 32990000,
  "description": "iPhone 16 Pro Max 256GB - Giảm giá đặc biệt"
}
```

**Kết quả mong đợi:** `200 OK` — object product đã cập nhật.

---

### 8.5 Xóa Product (Soft Delete)

| Thuộc tính | Giá trị                              |
| ---------- | ------------------------------------- |
| **Method** | `DELETE`                              |
| **URL**    | `{{baseUrl}}/products/{{productId}}`  |

**Kết quả mong đợi:** `200 OK` — object product với `isDeleted: true`.

> ⚠️ Đừng xóa product nếu bạn còn cần test Inventory!

---

## 9. API Inventory

> **Base path:** `{{baseUrl}}/inventory`
>
> ℹ️ Inventory được **tự động tạo** khi tạo Product. Bạn không cần tạo thủ công.

### 9.1 Lấy tất cả Inventory

| Thuộc tính | Giá trị                    |
| ---------- | -------------------------- |
| **Method** | `GET`                      |
| **URL**    | `{{baseUrl}}/inventory`    |

**Kết quả mong đợi:** `200 OK` — mảng tất cả inventory.

Ví dụ response:
```json
[
  {
    "_id": "665abc123def456789012345",
    "product": "664def789abc123456789012",
    "stock": 0,
    "reserved": 0,
    "soldCount": 0,
    "createdAt": "2026-03-17T10:00:00.000Z",
    "updatedAt": "2026-03-17T10:00:00.000Z"
  }
]
```

> 📌 Lưu `_id` của inventory → biến `inventoryId`.

---

### 9.2 Lấy Inventory theo ID (Populate Product)

| Thuộc tính | Giá trị                                    |
| ---------- | ------------------------------------------ |
| **Method** | `GET`                                      |
| **URL**    | `{{baseUrl}}/inventory/{{inventoryId}}`    |

**Kết quả mong đợi:** `200 OK` — object inventory với thông tin product đầy đủ.

Ví dụ response:
```json
{
  "_id": "665abc123def456789012345",
  "product": {
    "_id": "664def789abc123456789012",
    "title": "iPhone 16 Pro Max",
    "slug": "iphone-16-pro-max",
    "price": 34990000,
    "description": "iPhone 16 Pro Max 256GB chính hãng",
    "images": ["https://i.imgur.com/example1.jpg"],
    "category": "663aaa111bbb222ccc333ddd"
  },
  "stock": 0,
  "reserved": 0,
  "soldCount": 0
}
```

---

### 9.3 Thêm hàng vào kho (Add Stock)

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `POST`                              |
| **URL**     | `{{baseUrl}}/inventory/add-stock`   |
| **Headers** | `Content-Type: application/json`    |
| **Body**    | raw → JSON                          |

```json
{
  "productId": "{{productId}}",
  "quantity": 100
}
```

**Kết quả mong đợi:** `200 OK` — inventory với `stock` tăng thêm 100.

```json
{
  "_id": "...",
  "product": "{{productId}}",
  "stock": 100,
  "reserved": 0,
  "soldCount": 0
}
```

> ✅ **Test thêm:** Gọi lại lần nữa với `quantity: 50` → `stock` sẽ là `150`.

---

### 9.4 Giảm hàng trong kho (Remove Stock)

| Thuộc tính  | Giá trị                               |
| ----------- | -------------------------------------- |
| **Method**  | `POST`                                 |
| **URL**     | `{{baseUrl}}/inventory/remove-stock`   |
| **Headers** | `Content-Type: application/json`       |
| **Body**    | raw → JSON                             |

```json
{
  "productId": "{{productId}}",
  "quantity": 20
}
```

**Kết quả mong đợi:** `200 OK` — `stock` giảm 20 (từ 150 → 130).

#### Test trường hợp lỗi — Không đủ stock:

```json
{
  "productId": "{{productId}}",
  "quantity": 99999
}
```

**Kết quả mong đợi:** `400 Bad Request`
```json
{
  "message": "Khong du stock. Hien tai: 130, yeu cau: 99999"
}
```

---

### 9.5 Đặt trước hàng (Reservation)

> Chuyển hàng từ `stock` → `reserved`. Dùng khi khách đặt hàng nhưng chưa thanh toán.

| Thuộc tính  | Giá trị                               |
| ----------- | -------------------------------------- |
| **Method**  | `POST`                                 |
| **URL**     | `{{baseUrl}}/inventory/reservation`    |
| **Headers** | `Content-Type: application/json`       |
| **Body**    | raw → JSON                             |

```json
{
  "productId": "{{productId}}",
  "quantity": 30
}
```

**Kết quả mong đợi:** `200 OK` — `stock` giảm 30, `reserved` tăng 30.

```json
{
  "stock": 100,
  "reserved": 30,
  "soldCount": 0
}
```

#### Test trường hợp lỗi — Không đủ stock để đặt trước:

```json
{
  "productId": "{{productId}}",
  "quantity": 99999
}
```

**Kết quả mong đợi:** `400 Bad Request`
```json
{
  "message": "Khong du stock de reservation. Hien tai: 100, yeu cau: 99999"
}
```

---

### 9.6 Xác nhận bán hàng (Sold)

> Chuyển hàng từ `reserved` → `soldCount`. Dùng khi khách đã thanh toán thành công.

| Thuộc tính  | Giá trị                            |
| ----------- | ----------------------------------- |
| **Method**  | `POST`                              |
| **URL**     | `{{baseUrl}}/inventory/sold`        |
| **Headers** | `Content-Type: application/json`    |
| **Body**    | raw → JSON                          |

```json
{
  "productId": "{{productId}}",
  "quantity": 10
}
```

**Kết quả mong đợi:** `200 OK` — `reserved` giảm 10, `soldCount` tăng 10.

```json
{
  "stock": 100,
  "reserved": 20,
  "soldCount": 10
}
```

#### Test trường hợp lỗi — Không đủ reserved:

```json
{
  "productId": "{{productId}}",
  "quantity": 99999
}
```

**Kết quả mong đợi:** `400 Bad Request`
```json
{
  "message": "Khong du reserved de sold. Hien tai: 20, yeu cau: 99999"
}
```

---

## 10. Quy trình test hoàn chỉnh từ đầu đến cuối

Dưới đây là **thứ tự test từng bước** theo đúng luồng nghiệp vụ:

```
┌─────────────────────────────────────────────────────────┐
│                  QUY TRÌNH TEST API                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Bước 1: POST /roles         → Tạo role "ADMIN"        │
│              ↓ Lưu roleId                               │
│                                                         │
│  Bước 2: POST /users         → Tạo user admin           │
│              ↓ Lưu userId                               │
│                                                         │
│  Bước 3: POST /auth/login    → Đăng nhập                │
│              ↓ Lưu token                                │
│                                                         │
│  Bước 4: GET /auth/me        → Xác nhận đăng nhập OK   │
│                                                         │
│  Bước 5: POST /categories    → Tạo danh mục             │
│              ↓ Lưu categoryId                           │
│                                                         │
│  Bước 6: POST /products      → Tạo sản phẩm             │
│              ↓ Lưu productId                            │
│              ↓ (Inventory tự động được tạo)              │
│                                                         │
│  Bước 7: GET /inventory      → Kiểm tra inventory       │
│              ↓ Lưu inventoryId                          │
│                                                         │
│  Bước 8: POST /inventory/add-stock                      │
│          → Nhập 100 sản phẩm vào kho                    │
│              stock: 0 → 100                             │
│                                                         │
│  Bước 9: POST /inventory/remove-stock                   │
│          → Xuất 20 sản phẩm khỏi kho                   │
│              stock: 100 → 80                            │
│                                                         │
│  Bước 10: POST /inventory/reservation                   │
│           → Đặt trước 30 sản phẩm                       │
│              stock: 80 → 50, reserved: 0 → 30           │
│                                                         │
│  Bước 11: POST /inventory/sold                          │
│           → Xác nhận bán 10 sản phẩm                    │
│              reserved: 30 → 20, soldCount: 0 → 10       │
│                                                         │
│  Bước 12: GET /inventory/:id                            │
│           → Kiểm tra trạng thái cuối cùng               │
│              stock: 50, reserved: 20, soldCount: 10     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Bảng tổng hợp trạng thái Inventory qua các bước:

| Bước   | Thao tác         | `stock` | `reserved` | `soldCount` |
| ------ | ---------------- | ------- | ---------- | ----------- |
| Bước 6 | Tạo Product      | 0       | 0          | 0           |
| Bước 8 | Add Stock +100   | **100** | 0          | 0           |
| Bước 9 | Remove Stock -20 | **80**  | 0          | 0           |
| Bước 10| Reservation 30   | **50**  | **30**     | 0           |
| Bước 11| Sold 10          | 50      | **20**     | **10**      |

---

## 11. Xử lý lỗi thường gặp

### ❌ `"ban chua dang nhap"` (403 Forbidden)

**Nguyên nhân:** Chưa gửi token hoặc token hết hạn.

**Cách xử lý:**
1. Đăng nhập lại: `POST /auth/login`.
2. Copy token mới → cập nhật biến `token` trong Environment.
3. Đảm bảo Header: `Authorization: Bearer {{token}}` (có dấu cách sau "Bearer").

---

### ❌ `"thong tin dang nhap khong dung"` (404)

**Nguyên nhân:** Sai username/password hoặc tài khoản bị khóa (sai 3 lần → khóa 1 giờ).

**Cách xử lý:** Kiểm tra lại username/password. Nếu bị khóa, đợi 1 giờ hoặc sửa trực tiếp trong DB.

---

### ❌ `"Inventory not found for this product"` (404)

**Nguyên nhân:** Product ID không hợp lệ hoặc chưa có inventory tương ứng.

**Cách xử lý:**
1. Kiểm tra `productId` có đúng không.
2. Gọi `GET /inventory` để xem danh sách inventory hiện có.

---

### ❌ `"Khong du stock..."` (400)

**Nguyên nhân:** Số lượng yêu cầu vượt quá số lượng hiện có trong kho.

**Cách xử lý:** Gọi `GET /inventory` để kiểm tra `stock` hiện tại trước khi thao tác.

---

### ❌ `"quantity phai lon hon 0"` (400)

**Nguyên nhân:** Gửi `quantity` <= 0 hoặc không gửi `quantity`.

**Cách xử lý:** Đảm bảo body có `quantity` là số dương.

---

### ❌ `Cast to ObjectId failed` (500)

**Nguyên nhân:** ID gửi lên không đúng định dạng MongoDB ObjectId (24 ký tự hex).

**Cách xử lý:** Kiểm tra lại giá trị ID, phải là chuỗi hex 24 ký tự, ví dụ: `665abc123def456789012345`.

---

### ❌ Không nhận được body / body rỗng

**Nguyên nhân:** Chưa chọn đúng format Body trong Postman.

**Cách xử lý:**
1. Tab **Body** → chọn **raw**.
2. Dropdown bên phải chọn **JSON** (không phải Text).
3. Đảm bảo Header có `Content-Type: application/json`.

---

> 📝 **Tác giả:** Auto-generated for NNPTUD-C3 project
>
> 📅 **Cập nhật lần cuối:** 17/03/2026

