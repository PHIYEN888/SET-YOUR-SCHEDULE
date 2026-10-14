# 💊 PillMate — Set Your Schedule! (Mini-Game Exhibition Demo)

<div align="center">

![PillMate Logo](public/images/mascot.png)

**Your Smart Healthcare Assistant at Home — Trợ Lý Sức Khỏe Thông Minh Tại Nhà**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub repo](https://img.shields.io/badge/GitHub-SET--YOUR--SCHEDULE-181717?logo=github&logoColor=white)](https://github.com/PHIYEN888/SET-YOUR-SCHEDULE)

*Một mini-game tương tác trải nghiệm nhanh dành cho gian hàng triển lãm, sự kiện công nghệ và giới thiệu sản phẩm hộp thuốc thông minh **PillMate**.*

</div>

---

## 🌟 Giới thiệu tổng quan (Overview)

**PillMate — Set Your Schedule!** là mini-game mô phỏng trải nghiệm người dùng với giải pháp hộp chia thuốc thông minh 7 ngày. Trò chơi giúp khách tham quan tại gian hàng triển lãm hiểu được cách cài đặt lịch uống thuốc khoa học, cách đèn LED hướng dẫn lấy thuốc đúng ngăn, và sự tiện lợi của chuông báo nhắc liều trong vòng **2–3 phút**.

### 🎮 4 Bước chơi liền mạch (Gameplay Flow):
1. **🎴 Bước 1: Bốc thăm thẻ thử thách (Draw Challenge)**:
   - Người chơi tự tay chọn 1 trong 3 lá bài bí ẩn để mở khóa nhiệm vụ (ví dụ: *Uống hàng ngày lúc 8:00 Sáng*, *Lịch đi làm Thứ 2 – Thứ 6*, hoặc *Lịch uống 3 lần/ngày*).
   - Có thể chọn tiếp tục hoặc bấm **Rút thẻ khác** để đổi thử thách.
2. **⏰ Bước 2: Cài đặt lịch uống thuốc (Set Schedule)**:
   - Chọn mốc giờ (Giờ, Phút :00, :15, :30, :45, AM/PM).
   - Chọn chu kỳ lặp lại (Mỗi ngày, Ngày trong tuần T2–T6, Cuối tuần T7–CN hoặc Tùy chọn).
   - Đặt tên thuốc (Vitamin, Thuốc huyết áp...) và kiểm tra tính hợp lệ.
3. **📅 Bước 3: Khớp lịch khay 7 ngày (Schedule Matching)**:
   - Ma trận tương tác 7 ngày x 4 buổi (Sáng, Trưa, Chiều, Tối).
   - Hỗ trợ chọn nhanh theo Thứ hoặc theo Buổi.
   - Kiểm tra mức độ trùng khớp giữa lịch cài đặt và ngăn thuốc thực tế.
4. **🔔 Bước 4: Thử nghiệm chuông & Uống thuốc (Test Reminder)**:
   - Mô phỏng chuông reo và đèn LED nhấp nháy trên mô hình hộp thuốc PillMate.
   - Nút tương tác **XÁC NHẬN ĐÃ UỐNG (MỞ NẮP)** để mô phỏng cảm biến ghi nhận tuân thủ liều lượng.
5. **🏆 Màn hình vinh danh & Quà tặng (Results & Leaderboard)**:
   - Tính điểm tối đa 300 điểm, tính thời gian hoàn thành.
   - Mở khóa danh hiệu thành tựu và huy hiệu nhận quà tại booth.
   - Nhập tên/nickname ghi danh vào **Bảng Xếp Hạng (Leaderboard)** của gian hàng.

---

## ✨ Tính năng nổi bật (Key Features)

- 🌐 **Hỗ trợ Song ngữ linh hoạt (Bilingual EN / VI)**: Chuyển đổi ngôn ngữ Tiếng Việt 🇻🇳 và Tiếng Anh 🇬🇧 tức thì trên Header.
- ⚡ **Luồng chơi tự động & mượt mà (Seamless Auto-Advancing)**: Khi hoàn thành mỗi bước xuất sắc, hệ thống tự động chúc mừng và chuyển tiếp sang bước sau mà không cần thao tác nút đệm phức tạp.
- 🏅 **Bảng Xếp Hạng Booth (Exhibition Leaderboard)**: Lưu trữ Top 15 kỷ lục điểm số và thời gian nhanh nhất, có tùy chọn đặt lại dữ liệu dành cho nhân viên gian hàng khi bắt đầu ngày mới.
- 🎵 **Hiệu ứng âm thanh chân thực (Web Audio API)**: Âm thanh click, ting ting thành công, chuông nhắc nhở và nhạc fanfare chiến thắng mà không cần tải file âm thanh ngoài.
- 📱 **Responsive & Kiosk Ready**: Giao diện tối ưu chuẩn cảm ứng cho Tablet, Màn hình Kiosk triển lãm, Laptop và Điện thoại.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icon Set**: [Lucide React](https://lucide.dev/)
- **Hiệu ứng**: Pure CSS 3D Transforms, Web Audio Synthesizer, Confetti Canvas

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### Yêu cầu hệ thống:
- [Node.js](https://nodejs.org/) (phiên bản 18+ khuyến nghị)
- Trình quản lý gói `pnpm` (hoặc `npm` / `yarn`)

### Các bước thực hiện:

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/PHIYEN888/SET-YOUR-SCHEDULE.git
   cd SET-YOUR-SCHEDULE
   ```

2. **Cài đặt dependencies**:
   ```bash
   pnpm install
   # hoặc: npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev Server)**:
   ```bash
   pnpm dev
   # hoặc: npm run dev
   ```
   Truy cập trình duyệt tại: `http://localhost:5173`

4. **Đóng gói dự án (Production Build)**:
   ```bash
   pnpm build
   pnpm preview
   ```

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
pill-mate-mini-game/
├── public/                 # Hình ảnh, icon, sticker quà tặng, mô hình hộp thuốc
│   └── images/
├── src/
│   ├── components/         # Các thành phần giao diện (UI Components)
│   │   ├── ui/             # Button, Modal dùng chung
│   │   ├── AppHeader.tsx   # Header, đồng hồ đếm ngược, chuyển ngôn ngữ, nút âm thanh
│   │   ├── ChallengeCardDeck.tsx # Bước 1: Bốc thăm 3 lá bài nhiệm vụ
│   │   ├── ReminderSetupForm.tsx  # Bước 2: Cài đặt giờ và chu kỳ
│   │   ├── ScheduleMatchingBoard.tsx # Bước 3: Ma trận 7 ngày x 4 buổi
│   │   ├── ReminderTestPanel.tsx     # Bước 4: Thử nghiệm đèn LED & Uống thuốc
│   │   ├── ResultScreen.tsx          # Màn hình kết quả & lưu kỷ lục
│   │   ├── LeaderboardModal.tsx      # Bảng vàng vinh danh tại booth
│   │   └── Mascot.tsx                # Linh vật robot PillMate tương tác
│   ├── game/               # Logic game, quy tắc và dữ liệu
│   │   ├── challenges.ts   # Danh sách 10 thẻ thử thách
│   │   ├── i18n.ts         # Từ điển song ngữ Tiếng Việt - Tiếng Anh
│   │   ├── logic.ts        # Thuật toán tính điểm, kiểm tra khớp lịch
│   │   ├── reducer.ts      # Quản lý trạng thái máy trạng thái trò chơi
│   │   ├── sound.ts        # Bộ phát âm thanh Web Audio API
│   │   └── storage.ts      # Lưu trữ LocalStorage (Leaderboard, Stats)
│   ├── App.tsx             # Luồng ứng dụng chính
│   └── index.css           # Cấu hình Tailwind và hiệu ứng chuyển động
├── package.json
└── vite.config.ts
```

---

## 📄 Bản quyền (License)

Dự án phát triển phục vụ mục đích trình diễn và giáo dục cộng đồng về tuân thủ dùng thuốc. Mọi thông tin chi tiết xin liên hệ đội ngũ phát triển **PillMate**.
