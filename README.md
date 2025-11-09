# 🏙️ Hệ thống Quản lý Chung cư (Frontend)

Đây là dự án **frontend** cho phần mềm **Quản lý Chung cư**, được xây dựng bằng **React**.  
Ứng dụng này cung cấp một **Bảng điều khiển (Dashboard)** quản trị toàn diện, cho phép Ban quản lý thực hiện các nghiệp vụ cốt lõi, bao gồm **quản lý cư dân**, **quản lý căn hộ**, và **quản lý tài chính - khoản thu**.

Giao diện được thiết kế theo phong cách **hiện đại** (theme tối, hiệu ứng *kính mờ – glassmorphism*) và **hỗ trợ đa ngôn ngữ** (Tiếng Việt / Tiếng Anh).

![Ảnh chụp màn hình Trang chủ](https://github.com/user-attachments/assets/7cada972-d8b9-4824-963f-6ae1211f3bc8)

---

## 🚀 Các Tính năng Nổi bật

Dự án được chia thành các module chính với các chức năng chuyên sâu:

### 1. Trang chủ (Dashboard)
* **Thống kê nhanh:** Hiển thị tổng quan số lượng căn hộ, cư dân và khoản thu qua các thẻ (card) trực quan.  
* **Biểu đồ Doanh thu:** Biểu đồ cột thống kê tổng thu phí theo 6 tháng gần nhất (gọi API).  
* **Hoạt động Gần đây:** Giao diện tab hiển thị các biến động mới nhất về **Cư dân** (tạm trú, tạm vắng...) và **Thu phí** (thanh toán mới...).

---

### 2. Quản lý Căn hộ
* **Danh sách Căn hộ:** Hiển thị chi tiết danh sách các căn hộ trong chung cư.  
* **Bộ lọc Nâng cao:** Lọc căn hộ theo Số nhà, Loại căn hộ (Studio, 1PN, 2PN...), và khoảng Diện tích (sử dụng thanh trượt).

---

### 3. Quản lý Cư dân
* **Danh sách Cư dân:** Bảng hiển thị toàn bộ cư dân với các thông tin chi tiết (CCCD, Họ tên, SĐT...).  
* **Tìm kiếm:** Tìm kiếm cư dân theo nhiều tiêu chí (CCCD, Họ tên, CCCD Chủ hộ...).  
* **Quản lý Biến động:**  
  * Form cấp giấy **Tạm vắng**.  
  * Form cấp giấy **Tạm trú**.  
  * Thêm / Sửa / Xóa thông tin nhân khẩu.  
* **Quản lý Hộ gia đình:**  
  * Hiển thị danh sách các hộ gia đình.  
  * Cho phép thay đổi **chủ hộ**.  
* **Thống kê:**  
  * Biểu đồ tròn thống kê theo **Giới tính**.  
  * Biểu đồ cột thống kê theo **Độ tuổi**.  
  * Thống kê nhân khẩu mới theo **khoảng thời gian**.  
* **Truy vấn:**  
  * Xem **lịch sử thay đổi nhân khẩu** theo CCCD.

---

### 4. Quản lý Khoản thu
Giao diện tab hiện đại, chia làm 3 khu vực chức năng:

* **Quản lý Phí Bắt buộc:**  
  * **Tạo Khoản thu:** Form động cho phép tạo các loại phí khác nhau (Phí tiện ích, Phí chung cư, Phí gửi xe).  
  * **Tính tổng Thanh toán:** Gọi API `batch` để tính tổng phí cho toàn bộ căn hộ theo kỳ thu.  
  * **Xác nhận Thanh toán:** Form nhập ID kỳ thu và danh sách ID căn hộ đã nộp.  
  * **Xem Danh sách:** Mở modal chi tiết, lập danh sách các khoản thu bắt buộc theo ID kỳ thu.  
  * **Xuất Báo cáo:** Xuất file CSV chuyên nghiệp từ dữ liệu đã lập danh sách.

* **Quản lý Đóng góp Tự nguyện:**  
  * Tạo đợt đóng góp mới (Quỹ từ thiện, quỹ khuyến học...).  
  * Cập nhật chi tiết đóng góp của từng căn hộ.

* **Tra cứu Lịch sử Căn hộ:**  
  * Tra cứu toàn bộ lịch sử thanh toán (bắt buộc và tự nguyện) theo ID Căn hộ.

---

### 5. Cài đặt & Tài khoản
* **Cài đặt Chung:** Cập nhật thông tin chung của chung cư (Tên, Địa chỉ...).  
* **Đa ngôn ngữ:** Chuyển đổi giao diện giữa Tiếng Việt (VI) và Tiếng Anh (EN).  
* **Tài khoản:** Cập nhật thông tin cá nhân và thay đổi mật khẩu.

---

## 💻 Công nghệ sử dụng

### Frontend
* **React (v18+)**  
* **React Router (v6)** – Quản lý điều hướng trang (nested routes).  
* **SCSS (Sass)** – Viết CSS theo cấu trúc module.  
* **Axios** – Gọi API RESTful.  
* **Chart.js (react-chartjs-2)** – Vẽ các biểu đồ thống kê.  
* **Vanta.js (three.js)** – Tạo hiệu ứng hình nền động.  
* **react-i18next** – Quản lý đa ngôn ngữ (i18n).  
* **rc-slider** – Tạo thanh trượt (slider).

### Backend (Yêu cầu)
* Dự án này yêu cầu một backend **Spring Boot (Java)** đang chạy tại địa chỉ `http://localhost:8080`.  
* Backend sử dụng **JWT (JSON Web Token)** để xác thực.

---

## 🚀 Bắt đầu

Hướng dẫn cài đặt và chạy dự án này trên máy local của bạn.

### 1. Clone Repository
```bash
git clone https://github.com/Dinhthuy2k5/QL-Chung-cu.git
cd QL-Chung-cu
```

### 2. Cài đặt Dependencies
Dự án này có thể có xung đột phiên bản TypeScript giữa react-scripts và các thư viện mới hơn.
Sử dụng cờ --legacy-peer-deps để bỏ qua kiểm tra và cài đặt:
```bash
npm install --legacy-peer-deps
```

### 3. Khởi chạy Dự án
Sau khi cài đặt thành công, khởi chạy server phát triển:
```bash
npm start
```
Ứng dụng sẽ tự động mở trong trình duyệt của bạn tại http://localhost:3000.

### 4. Yêu cầu Bắt buộc
Đảm bảo rằng máy chủ Backend Spring Boot của bạn đang chạy tại địa chỉ http://localhost:8080 để các API có thể hoạt động.

### 📁 Cấu trúc Thư mục
```bash
src/
├── components/          # Các component con tái sử dụng
│   ├── apartment_component/
│   ├── home_component/
│   ├── receipt_component/
│   └── resident_component/
├── HOC/                 # Các Higher-Order Components (v.d: withRouter)
├── locales/             # Các file dịch thuật (en/vi)
│   ├── en/
│   └── vi/
├── pages/               # Các trang độc lập (v.d: Login, Change_Infor)
├── services/            # Các dịch vụ (v.d: localStorageService)
├── styles/              # Các file SCSS chính và chung
│   ├── home-styles/
│   ├── receipt-styles/
│   └── ...
├── views/               # Các component trang chính (tương ứng với 1 tab)
│   ├── Home.js
│   ├── Apartments.js
│   ├── Residents.js
│   ├── Receipt.js
│   ├── Settings.js
│   └── Nav/
├── App.js               # Component gốc, quản lý state chính và routes
├── App.scss             # Style chung cho App
├── i18n.js              # Cấu hình đa ngôn ngữ
└── index.js             # Điểm bắt đầu của ứng dụng
```

### 🧑‍💻 Tác giả & Đóng góp
Dự án được phát triển bởi Nguyễn Đình Thủy.
Nếu bạn muốn đóng góp, hãy fork repository này và gửi pull request.