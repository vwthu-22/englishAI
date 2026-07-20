
Here is the plan for the explanation:
1. `useAuthStore.ts`: Authentication & User Profile
2. `useUiStore.ts`: Sidebar toggle & Page routing
3. `useExerciseStore.ts`: History of practice exercises
4. `useBookmarkStore.ts`: Saved exercises (bookmarks) with localStorage sync
5. `useQuizStore.ts`: Landing page quizzes & Community published listening/reading quizzes
6. `useStatsStore.ts`: Statistics & chart data (weekly activity, monthly progress)
7. `useAppStore.ts`: Central hub (re-exporter) for backward compatibility


### 1. `useAuthStore.ts` (Quản lý Đăng nhập & Người dùng)
* **Phần quản lý:** Thông tin tài khoản người dùng và trạng thái xác thực.
* **State chính:**
  * `user`: Thông tin cá nhân của người dùng hiện tại (tên, email, cấp độ CEFR như B2, chuỗi ngày học liên tục `streak`,...).
  * `isLoggedIn`: Trạng thái đã đăng nhập hay chưa (boolean).
* **Actions:**
  * `login()`: Hàm đăng nhập (hiện tại set thông tin giả lập từ mock data).
  * `logout()`: Đăng xuất, xóa thông tin user và chuyển trạng thái đăng nhập về `false`.

### 2. `useUiStore.ts` (Quản lý Giao diện)
* **Phần quản lý:** Bố cục tổng thể (layout) và điều hướng hiển thị của ứng dụng.
* **State chính:**
  * `sidebarOpen`: Trạng thái mở/đóng của thanh menu bên trái (Sidebar).
  * `currentPage`: Trang hiện tại đang được hiển thị trên Dashboard chính (ví dụ: `'dashboard'`, `'listening'`, `'reading'`, `'exercises'`).
* **Actions:**
  * `setSidebarOpen(open)`: Bật/tắt thanh Sidebar.
  * `setCurrentPage(page)`: Chuyển trang/component trên màn hình chính.

### 3. `useExerciseStore.ts` (Quản lý Lịch sử làm bài)
* **Phần quản lý:** Danh sách lịch sử các bài tập/đề thi mà người dùng đã làm hoặc đang làm dở.
* **State chính:**
  * `exercises`: Mảng lưu trữ tất cả các bài tập lịch sử bao gồm điểm số, số câu đúng, loại bài tập (listening/reading), ngày tạo và trạng thái (hoàn thành/đang làm).
* **Actions:**
  * `addExercise(exercise)`: Thêm một bài tập vừa hoàn thành vào lịch sử học tập.
  * `deleteExercise(id)`: Xóa một bài tập khỏi lịch sử.
  * `setExercises(exercises)`: Cập nhật lại toàn bộ mảng lịch sử (ví dụ khi tải về từ server).

### 4. `useBookmarkStore.ts` (Quản lý Bài tập đã lưu)
* **Phần quản lý:** Lưu trữ các bài tập mà người dùng tìm thấy và muốn lưu lại để làm sau.
* **State chính:**
  * `bookmarks`: Danh sách mảng các bài tập đã đánh dấu lưu. Trạng thái này được đồng bộ và lưu trữ lâu dài dưới trình duyệt thông qua `localStorage` (key: `english_app_bookmarks`).
* **Actions:**
  * `toggleBookmark(item)`: Thêm hoặc xóa bài tập khỏi danh sách đã lưu.
  * `isBookmarked(id)`: Hàm kiểm tra nhanh một bài tập đã được lưu hay chưa dựa vào ID.
  * `loadBookmarks()`: Khởi tạo/tải lại danh sách đã lưu từ `localStorage` khi ứng dụng khởi chạy.

### 5. `useQuizStore.ts` (Quản lý Bài tập cộng đồng & Trang chủ)
* **Phần quản lý:** Quản lý danh sách các bài test hiển thị ngoài trang chủ (landing page) và các bài test do chính người dùng tự tạo ra bằng AI rồi xuất bản (publish) trong trang Listen/Read.
* **State chính:**
  * `landingQuizzes`: Danh sách các đề xuất bài học hiển thị cho người dùng chưa đăng nhập.
  * `publishedListeningQuizzes`: Các bài luyện nghe (Listening) do người dùng tự tạo bằng link YouTube và lưu lại.
  * `publishedReadingQuizzes`: Các bài luyện đọc (Reading) do người dùng tự tạo bằng văn bản/tài liệu và lưu lại.
* **Actions:**
  * `addPublishedListeningQuiz(quiz)` / `addPublishedReadingQuiz(quiz)`: Thêm bài luyện tập do AI tạo mới và xuất bản vào bộ nhớ lưu trữ `localStorage`.
  * `loadPublishedQuizzes()`: Đồng bộ danh sách bài tập đã xuất bản từ trình duyệt lên store.

### 6. `useStatsStore.ts` (Quản lý Thống kê & Biểu đồ)
* **Phần quản lý:** Các chỉ số học tập để vẽ biểu đồ trên Dashboard và Profile.
* **State chính:**
  * `weeklyData`: Số lượng bài học hoàn thành của từng ngày trong tuần (dùng để vẽ biểu đồ cột ở Dashboard).
  * `monthlyProgress`: Tiến trình điểm trung bình tăng trưởng qua 6 tháng gần nhất (dùng để vẽ biểu đồ vùng/đường ở Dashboard và trang cá nhân).
* **Actions:**
  * `setWeeklyData(data)` / `setMonthlyProgress(progress)`: Giúp cập nhật/cài đặt lại thông số thống kê mới nhận được từ API.

### 7. `useAppStore.ts` (Đầu mối trung tâm - Central Re-exporter)
* **Phần quản lý:** Đây không phải là một store chứa logic trực tiếp. Nó hoạt động như một **cổng xuất khẩu tập trung (hub)**.
* **Vai trò:** Import tất cả 6 store con ở trên và export chúng ra tại một nơi. Điều này đảm bảo tính tương thích ngược, giúp nhà phát triển có thể viết `import { useAuthStore } from '@/store/useAppStore'` thay vì phải tìm từng file nhỏ nếu thích, giúp việc viết code cực kỳ linh hoạt và khoa học.L