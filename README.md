# CareerAI - Hướng nghiệp thông minh với AI (PIC Model Prototype)

Dự án này là sản phẩm thực nghiệm phục vụ Khóa luận tốt nghiệp: **"Ứng dụng Trí tuệ Nhân tạo kết hợp Mô hình PIC trong Định hướng Nghề nghiệp & Phát triển Năng lực Cá nhân hóa"**.

---

## 🚀 Các phiên bản sản phẩm

Dự án được cấu trúc theo 2 dạng để thuận tiện cho việc trình bày và phát triển lâu dài:

### 1. Phiên bản Prototype ăn liền (`index.html` ở thư mục gốc)
* **Mục đích:** Demo nhanh cho Hội đồng hoặc người dùng thử nghiệm tức thì mà không cần cài đặt môi trường phức tạp (`npm install`).
* **Tính năng:** Tích hợp toàn bộ giao diện hiện đại, chế độ sáng/tối (Dark/Light mode), bộ điều hướng mượt mà, và **Trình giả lập AI Counselor (PIC State Machine)** cực kỳ chi tiết bằng Tiếng Việt. Có hỗ trợ xuất lộ trình ra PDF cực đẹp, lưu tạm phiên và cảnh báo hỗ trợ tâm lý.
* **Cách chạy:** Nhấp đúp chuột trực tiếp vào tệp `index.html` ở thư mục gốc để mở trên bất kỳ trình duyệt nào.

### 2. Phiên bản Cấu trúc Source Code đầy đủ (`frontend/` & `backend/`)
* **Mục đích:** Dành cho việc triển khai thực tế, kết nối API AI thực tế (OpenAI / Gemini) và lưu lịch sử vào Cơ sở dữ liệu.
* **Ngôn ngữ:** React JS + Tailwind CSS (Frontend) & Node.js/Express (Backend API).

---

## 📁 Cấu trúc Thư mục Dự án

```text
prototype khóa luận/
├── index.html                   # Bản demo nhanh tương tác đầy đủ (Client-side SPA)
├── README.md                    # Hướng dẫn sử dụng chi tiết
├── .env                         # Tệp cấu hình các mã khóa API (OpenAI/Gemini)
├── frontend/                    # Mã nguồn Frontend (ReactJS + Vite)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── hooks/
│   │   │   └── useChatSession.js
│   │   ├── components/
│   │   │   ├── ProgressSidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── QuickReplies.jsx
│   │   │   └── RoadmapView.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Assistant.jsx
│   │       ├── Roadmap.jsx
│   │       └── About.jsx
└── backend/                     # Mã nguồn API Server (NodeJS + Express)
    ├── package.json
    ├── server.js
    ├── controllers/
    │   └── chatController.js
    ├── routes/
    │   └── chat.js
    ├── services/
    │   ├── openaiService.js
    │   └── promptTemplates.js   # Các System Prompt cho từng giai đoạn PIC
    └── utils/
        └── sessionStore.js
```

---

## 🛠️ Hướng dẫn cài đặt & chạy phiên bản Source Code

### Bước 1: Thiết lập Backend (NodeJS)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo tệp `.env` tại thư mục gốc của dự án hoặc thư mục `backend/` và cấu hình:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Khởi động server backend:
   ```bash
   npm start
   ```
   *Mặc định server sẽ chạy tại địa chỉ: `http://localhost:5000`*

### Bước 2: Thiết lập Frontend (React + Vite)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các thư viện Frontend:
   ```bash
   npm install
   ```
3. Chạy môi trường phát triển (Local Server):
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173` hoặc tương tự.*

---

## 📘 Giới thiệu về Mô hình PIC trong CareerAI

Mô hình **PIC (Prescreening, In-depth Exploration, Choice)** do Giáo sư **Itamar Gati** đề xuất gồm 3 giai đoạn chính nhằm giảm thiểu sự quá tải thông tin hướng nghiệp:

1. **Sàng lọc (Prescreening):** Giảm thiểu hàng trăm ngành nghề xuống danh sách rút gọn (5-7 nghề) dựa trên bộ tiêu chí quan trọng của người học.
2. **Khám phá chuyên sâu (In-depth Exploration):** Phân tích chi tiết từng nghề nghiệp rút gọn về yêu cầu, thu nhập, công việc hằng ngày và trả lời các câu hỏi phản biện.
3. **Lựa chọn & Lộ trình (Choice & Roadmap):** So sánh các nghề còn lại trên ma trận quyết định, chốt lựa chọn tối ưu và AI đề xuất lộ trình phát triển năng lực 6-12 tháng.
