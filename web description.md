## **MÔ TẢ TRANG WEB: “CareerAI – Hướng nghiệp thông minh với AI”**

### **1\. Tổng quan**

Tên gọi: CareerAI  
Mục đích: Cung cấp một trợ lý ảo sử dụng trí tuệ nhân tạo (GPT-4) để hỗ trợ người dùng (sinh viên, người lao động) định hướng nghề nghiệp và xây dựng lộ trình phát triển năng lực cá nhân hóa theo ba giai đoạn của mô hình PIC (Sàng lọc – Khám phá chuyên sâu – Lựa chọn và lộ trình).  
Đối tượng người dùng: Học sinh lớp 12, sinh viên đại học (năm 1–4), người lao động trẻ (dưới 30 tuổi) có nhu cầu chuyển đổi nghề hoặc phát triển kỹ năng.  
Công nghệ đề xuất:

* Frontend: React.js \+ Tailwind CSS (hoặc Vue.js \+ Vite)  
* Backend: Node.js/Express (hoặc Python Flask)  
* AI: OpenAI API (GPT-4) hoặc Gemini API  
* Cơ sở dữ liệu: Firebase Firestore hoặc MongoDB (để lưu lịch sử hội thoại ẩn danh)  
* Hosting: Vercel (frontend) \+ Render (backend)

---

### **2\. Cấu trúc trang web (các trang/routing)**

Trang web có 4 trang chính:

| Trang | Đường dẫn | Mô tả |
| :---- | :---- | :---- |
| Trang chủ | `/` | Giới thiệu về công cụ, hướng dẫn nhanh, nút bắt đầu |
| Trợ lý AI (trải nghiệm chính) | `/assistant` | Chatbot hướng nghiệp theo ba giai đoạn PIC, hiển thị tiến trình |
| Bảng điều khiển lộ trình | `/roadmap` | Sau khi hoàn tất, hiển thị lộ trình phát triển năng lực chi tiết (khóa học, chứng chỉ, thực tập) – có thể xuất PDF |
| Giới thiệu / Tài liệu | `/about` | Giới thiệu về mô hình PIC, cách AI hoạt động, các nghiên cứu liên quan, và liên hệ |

---

### **3\. Mô tả chi tiết từng trang (kèm các thành phần giao diện)**

#### 3.1. Trang chủ (`/`)

Bố cục:

* Header: Logo \+ menu điều hướng (Trang chủ, Trợ lý AI, Lộ trình, Giới thiệu) \+ nút “Đăng nhập” (nếu có – có thể bỏ qua phiên bản demo).  
* Hero section:  
  * Tiêu đề lớn: *“CareerAI – Hướng nghiệp thông minh với AI”*  
  * Phụ đề: *“Dựa trên mô hình PIC – Sàng lọc, Khám phá, Lựa chọn – giúp bạn tìm đúng nghề và xây dựng lộ trình phát triển năng lực cá nhân hóa”*  
  * Nút CTA: “Bắt đầu ngay” (chuyển đến `/assistant`).  
* Các bước hướng dẫn nhanh:  
  * 3 bước được minh họa bằng icon \+ mô tả ngắn:  
    *Bước 1:* Trả lời câu hỏi về sở thích, kỹ năng, giá trị nghề nghiệp.  
    *Bước 2:* AI đề xuất 5–7 nghề phù hợp, bạn chọn nghề muốn khám phá.  
    *Bước 3:* Nhận lộ trình học tập và phát triển chi tiết, có thể tải về.  
* Footer: Thông tin bản quyền, liên kết đến nghiên cứu (khóa luận), liên kết GitHub (nếu mở mã nguồn).

#### 3.2. Trợ lý AI (`/assistant`) – **trang quan trọng nhất**

Thiết kế:

* Màn hình chia làm hai cột (trên desktop):  
  * Cột bên trái (chiếm 30%): Hiển thị tiến trình (progress bar) 3 giai đoạn:  
    * Giai đoạn 1 – Sàng lọc (Prescreening): Đã/đang hoàn thành  
    * Giai đoạn 2 – Khám phá chuyên sâu (In‑depth exploration): Đã/đang hoàn thành  
    * Giai đoạn 3 – Lựa chọn & Lộ trình (Choice): Đã/đang hoàn thành  
  * Bên cạnh tiến trình là tóm tắt các lựa chọn chính (ví dụ: 5 khía cạch quan trọng nhất, danh sách nghề đã chọn).  
  * Cột bên phải (chiếm 70%): Khung chat (giống ChatGPT) với trợ lý AI.

Luồng hoạt động của chatbot (theo mô hình PIC):

Giai đoạn 1 – Sàng lọc (Prescreening):

* AI tự động gửi tin nhắn chào mừng và hỏi: trình độ học vấn, ngành học hiện tại (nếu có), mong muốn nghề nghiệp.  
* AI yêu cầu người dùng liệt kê 5–7 khía cạnh quan trọng nhất (ví dụ: mức lương, cân bằng cuộc sống, cơ hội thăng tiến, tính sáng tạo, môi trường làm việc…).  
* Với mỗi khía cạnh, AI hỏi mức độ lý tưởng và mức tối thiểu chấp nhận được.  
* Sau khi thu thập đủ, AI đề xuất danh sách rút gọn 5–7 nghề/nhóm nghề (có thể kèm link tham khảo).  
* Người dùng được hỏi: muốn loại bỏ nghề nào, hoặc muốn thêm nghề nào để khám phá thêm.  
* Kết thúc giai đoạn 1: AI tóm tắt danh sách rút gọn cuối cùng và hỏi người dùng có sẵn sàng sang giai đoạn 2 không.

Giai đoạn 2 – Khám phá chuyên sâu (In‑depth exploration):

* AI lần lượt lấy từng nghề trong danh sách rút gọn.  
* Với mỗi nghề, AI cung cấp:  
  * Mô tả hoạt động điển hình trong ngày.  
  * Yêu cầu về bằng cấp, kỹ năng cứng/mềm.  
  * Mức lương tham khảo (ước lượng, kèm lưu ý “dữ liệu có thể không chính xác 100% với thị trường Việt Nam”).  
* AI đặt 3 câu hỏi phản biện cho người dùng:  
  * *“Bạn có sẵn sàng đáp ứng các yêu cầu này không?”*  
  * *“Bạn có hứng thú với công việc hàng ngày như vậy không?”*  
  * *“Có khía cạnh nào khiến bạn lo lắng không?”*  
* Dựa trên câu trả lời, AI gợi ý nên giữ, tìm hiểu thêm hay loại bỏ nghề đó.  
* Kết thúc giai đoạn 2: AI tổng kết danh sách ngắn (2–3 nghề) phù hợp nhất.

Giai đoạn 3 – Lựa chọn & Lộ trình (Choice & Roadmap):

* AI tạo bảng so sánh đơn giản giữa các nghề cuối cùng dựa trên các khía cạch đã thu thập.  
* AI hỏi: *“Dựa trên bảng so sánh, bạn nghiêng về nghề nào nhất?”*  
* Sau khi người dùng chọn (hoặc xếp hạng), AI đề xuất lộ trình phát triển năng lực 6–12 tháng, bao gồm:  
  * 3–4 khóa học trực tuyến (tên khóa, nền tảng như Coursera, Udemy, F8, [Kyna.vn](https://kyna.vn/)…).  
  * 1–2 chứng chỉ nên đạt.  
  * Hoạt động thực tập/dự án khuyến nghị.  
  * Lời khuyên về xây dựng mạng lưới.  
* AI hỏi cuối: *“Bạn có cảm thấy tự tin với lộ trình này không? Có rào cản gì không?”* – nếu có rào cản (tài chính, thời gian), AI gợi ý phiên bản tiết kiệm hơn.  
* Kết thúc phiên: Hiển thị nút “Xem lộ trình chi tiết” (chuyển sang `/roadmap`) và “Xuất PDF”.

Tính năng bổ sung trong trang `/assistant`:

* Nút “Tạm dừng và lưu”: lưu tiến trình hội thoại hiện tại (lên localStorage hoặc database) để tiếp tục sau.  
* Nút “Đặt lại phiên”: xóa toàn bộ lịch sử và bắt đầu lại.  
* Hiển thị “gợi ý câu trả lời nhanh” (dưới dạng chip) để người dùng có thể click thay vì gõ.  
* Trong trường hợp AI phát hiện từ khóa cảm xúc tiêu cực (lo âu, trầm cảm, bế tắc), hiển thị cảnh báo: *“Có vẻ bạn đang căng thẳng. Bạn nên nói chuyện với tư vấn viên tâm lý hoặc gọi đến đường dây hỗ trợ 1900 XXXX. Tôi vẫn sẵn sàng cung cấp thông tin.”*

#### 3.3. Bảng điều khiển lộ trình (`/roadmap`)

Thiết kế:

* Header: tiêu đề “Lộ trình phát triển năng lực cá nhân hóa – \[Tên ngành nghề đã chọn\]”.  
* Nút “Xuất PDF” và “Chia sẻ”.  
* Nội dung chính được chia thành các phần:  
  1\. Tóm tắt nghề nghiệp đã chọn – một đoạn ngắn.  
  2\. Khoảng trống kỹ năng – so sánh kỹ năng hiện tại (người dùng khai báo) với yêu cầu của nghề.  
  3\. Lộ trình học tập (6 tháng) – bảng với cột: Thời gian (tuần/tháng), Khóa học, Nền tảng, Chi phí (ước lượng).  
  4\. Chứng chỉ khuyến nghị – danh sách kèm link đăng ký.  
  5\. Hoạt động thực hành – dự án mẫu, tình nguyện, thực tập.  
  6\. Tài nguyên bổ sung – sách, blog, cộng đồng (nhóm Facebook, Discord, LinkedIn).  
* Phần cuối có nút “Quay lại trợ lý AI để điều chỉnh” và “Tải xuống PDF”.

#### 3.4. Trang Giới thiệu / Tài liệu (`/about`)

Bố cục:

* Giới thiệu về dự án (bối cảnh khóa luận, mục tiêu).  
* Giải thích ngắn gọn về mô hình PIC (kèm hình minh họa).  
* Các nghiên cứu liên quan (trích dẫn Gati et al., Bankins, Patel, các nghiên cứu trong nước).  
* Thông tin về giảng viên hướng dẫn, sinh viên thực hiện.  
* Liên hệ (email, GitHub).

---

### **4\. Luồng dữ liệu và tích hợp AI**

Sơ đồ luồng dữ liệu tổng quát:

1. Người dùng nhập tin nhắn tại ô chat → gửi lên backend.  
2. Backend nhận message, gắn kèm system prompt (đã được thiết kế cho từng giai đoạn PIC) và lịch sử hội thoại (10–15 tin nhắn gần nhất).  
3. Gọi API OpenAI (GPT-4) hoặc Gemini.  
4. Nhận phản hồi, lưu lại lịch sử (phiên bản ẩn danh vào database hoặc file log) và gửi về frontend.  
5. Frontend hiển thị tin nhắn, cập nhật tiến trình (progress bar) dựa trên nội dung phản hồi (ví dụ: khi AI gửi tin nhắn “Kết thúc giai đoạn 1”, frontend chuyển trạng thái).  
6. Kết thúc phiên: lưu lộ trình (dưới dạng JSON) để hiển thị tại `/roadmap`.

Xử lý đặc biệt:

* Sử dụng function calling (OpenAI) để khi AI xác định đã đủ thông tin cho một giai đoạn, nó trả về một JSON cấu trúc (ví dụ: `{ stage: "prescreening_complete", shortlist: [...] }`) thay vì chỉ văn bản. Frontend dựa vào JSON đó để chuyển trạng thái và lưu dữ liệu.  
* Lưu trữ lịch sử phiên theo `session_id` (có thể dùng localStorage hoặc cookie).

---

### **5\. Các tệp tin / cấu trúc thư mục dự kiến (cho vibe code)**

career-ai/  
├── frontend/  
│   ├── public/  
│   ├── src/  
│   │   ├── components/  
│   │   │   ├── ChatWindow.jsx  
│   │   │   ├── ProgressSidebar.jsx  
│   │   │   ├── MessageBubble.jsx  
│   │   │   ├── QuickReplies.jsx  
│   │   │   └── RoadmapView.jsx  
│   │   ├── pages/  
│   │   │   ├── Home.jsx  
│   │   │   ├── Assistant.jsx  
│   │   │   ├── Roadmap.jsx  
│   │   │   └── About.jsx  
│   │   ├── services/  
│   │   │   └── api.js (gọi backend)  
│   │   ├── hooks/  
│   │   │   └── useChatSession.js  
│   │   ├── App.jsx  
│   │   └── main.jsx  
│   ├── package.json  
│   └── tailwind.config.js  
├── backend/  
│   ├── routes/  
│   │   └── chat.js  
│   ├── controllers/  
│   │   └── chatController.js  
│   ├── services/  
│   │   ├── openaiService.js  
│   │   └── promptTemplates.js (chứa system prompt cho 3 giai đoạn)  
│   ├── utils/  
│   │   └── sessionStore.js (lưu tạm lịch sử)  
│   ├── server.js  
│   └── package.json  
├── database/ (nếu dùng Firebase thì có firebase.json)  
├── README.md  
└── .env

### **6\. Giao diện tham khảo (mô tả bằng lời)**

Màu sắc: Chủ đạo là màu xanh dương nhạt (\#EFF6FF) kết hợp xanh đậm (\#1E3A8A) và xám nhạt, tạo cảm giác chuyên nghiệp, tin cậy, thân thiện.  
Phông chữ: Sans-serif (Inter, Roboto).  
Responsive: Trên mobile, cột trái (tiến trình) thu gọn lại thành thanh ngang phía trên khung chat, có thể mở rộng bằng nút hamburger.

Minh họa nhanh bằng ASCII (chỉ để hình dung bố cục desktop):

\+-------------------------------------------------------------------+  
|  \[Logo\]  CareerAI   \[Trang chủ\] \[Trợ lý AI\] \[Lộ trình\] \[Giới thiệu\] |  
\+-----------------------------------+-------------------------------+  
|                                   |                               |  
|  GIAI ĐOẠN 1: Sàng lọc      ✓     |  Trợ lý AI:                    |  
|  Danh sách nghề (5):              |  AI: Chào bạn\! Hãy cho tôi biết |  
|  • Lập trình viên                 |  5 khía cạnh quan trọng...      |  
|  • Chuyên viên Data               |                               |  
|  • ...                            |  Bạn: Mức lương, cơ hội...      |  
|                                   |                               |  
|  GIAI ĐOẠN 2: Khám phá       ◌     |  AI: Cảm ơn. Với mức lương...   |  
|  Đang xem: Data Analyst           |                               |  
|                                   |  \[Ô nhập tin nhắn\]  \[Gửi\]      |  
|                                   |                               |  
|  \[Tạm dừng\]  \[Đặt lại\]            |  \[Gợi ý: Lương 15tr+ | Linh hoạt\]|  
\+-----------------------------------+-------------------------------+  
|  Footer                                                            |  
\+-------------------------------------------------------------------+  
