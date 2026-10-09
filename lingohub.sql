-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th10 09, 2026 lúc 03:25 PM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `lingohub`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1B3A6B',
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `slug`, `name`, `icon`, `color`, `description`, `status`, `order`, `created_at`, `updated_at`) VALUES
(4, 'mon-ly-luan-chinh-tri', 'Môn lý luận chính trị', '', '#1B3A6B', NULL, 'active', 0, '2026-10-08 02:24:20', '2026-10-08 02:24:20'),
(5, 'mon-chuyen-nganh', 'Môn chuyên ngành', '', '#1B3A6B', NULL, 'active', 0, '2026-10-08 03:02:31', '2026-10-08 03:02:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `commentable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentable_id` bigint UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `commentable_type`, `commentable_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 5, 'Document', 5, 'hay', '2026-10-08 09:50:16', '2026-10-08 09:50:16'),
(2, 5, 'Document', 5, 'quá hay', '2026-10-08 09:50:21', '2026-10-08 09:50:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `documents`
--

CREATE TABLE `documents` (
  `id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `chapter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `questions_count` int NOT NULL DEFAULT '50',
  `duration` int NOT NULL DEFAULT '60',
  `difficulty` enum('Dễ','Trung bình','Khó') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Trung bình',
  `type` enum('exam','practice') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'exam',
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `attempts` bigint UNSIGNED NOT NULL DEFAULT '0',
  `rating` decimal(3,1) NOT NULL DEFAULT '0.0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `documents`
--

INSERT INTO `documents` (`id`, `subject_id`, `chapter`, `title`, `description`, `questions_count`, `duration`, `difficulty`, `type`, `status`, `attempts`, `rating`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 4, NULL, 'Đề trắc nghiệm số 1', NULL, 32, 60, 'Trung bình', 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:35:52', '2026-10-08 02:36:06'),
(2, 4, NULL, 'Đề trắc nghiệm số 3', NULL, 50, 60, 'Trung bình', 'exam', 'draft', 0, 0.0, 1, '2026-10-08 02:37:18', '2026-10-08 02:40:21'),
(3, 4, NULL, 'Đề trắc nghiệm số 2', NULL, 23, 60, 'Trung bình', 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:39:42', '2026-10-08 02:40:11'),
(4, 5, NULL, 'Đề trắc nghiệm sô 1', NULL, 50, 60, 'Trung bình', 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:47:36', '2026-10-08 02:47:41'),
(5, 5, 'HÀNG HÓA, THỊ TRƯỜNG VÀ VAI TRÒ CỦA CÁC CHỦ THỂ THAM GIA THỊ TRƯỜNG', 'Đề trắc nghiệm số 2', NULL, 40, 60, 'Trung bình', 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:48:29', '2026-10-08 02:48:33'),
(6, 6, 'CHƯƠNG 1: TỔNG QUAN VỀ RỦI RO', 'Đề số 1', NULL, 20, 60, 'Trung bình', 'exam', 'published', 0, 0.0, 1, '2026-10-08 03:02:32', '2026-10-08 03:02:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `essay_questions`
--

CREATE TABLE `essay_questions` (
  `id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `hint` text COLLATE utf8mb4_unicode_ci,
  `sample_answer` longtext COLLATE utf8mb4_unicode_ci,
  `time_limit` int NOT NULL DEFAULT '45',
  `difficulty` enum('Dễ','Trung bình','Khó') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Trung bình',
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `attempts` bigint UNSIGNED NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `essay_questions`
--

INSERT INTO `essay_questions` (`id`, `subject_id`, `title`, `chapter`, `question`, `hint`, `sample_answer`, `time_limit`, `difficulty`, `status`, `attempts`, `created_by`, `created_at`, `updated_at`) VALUES
(4, 4, 'Câu hỏi số 1 - Trình bày khái niệm Quản trị theo James Stoner & Stephen Robbins. Phân tích 4 chức năng cơ bản của quản trị (Hoạch định, Tổ chức, Lãnh đạo, Kiểm soát)', NULL, 'Trình bày khái niệm Quản trị theo James Stoner & Stephen Robbins. Phân tích 4 chức năng cơ bản của quản trị (Hoạch định, Tổ chức, Lãnh đạo, Kiểm soát) và nêu rõ vai trò của từng chức năng đối với sự vận hành của một tổ chức.', NULL, NULL, 10, 'Trung bình', 'published', 0, 1, '2026-10-08 02:45:46', '2026-10-08 02:45:46'),
(5, 4, 'Câu hỏi số 2 - Giải thích câu nói: \"Hoạt động quản trị là cần thiết đối với mọi tổ chức\". Phân biệt hai khái niệm Kết quả và Hiệu quả trong quản trị, đồng thời nêu c', NULL, 'Giải thích câu nói: \"Hoạt động quản trị là cần thiết đối với mọi tổ chức\". Phân biệt hai khái niệm Kết quả và Hiệu quả trong quản trị, đồng thời nêu các trường hợp cụ thể để nâng cao hiệu quả quản trị trong thực tế.', NULL, NULL, 10, 'Trung bình', 'published', 0, 1, '2026-10-08 02:46:16', '2026-10-08 02:46:16'),
(6, 6, 'Câu số 1 - Trình bày và so sánh sự khác biệt cơ bản giữa cách hiểu về rủi ro theo trường phái truyền thống và trường phái trung hòa. Ý nghĩa của trường phái trun', NULL, 'Trình bày và so sánh sự khác biệt cơ bản giữa cách hiểu về rủi ro theo trường phái truyền thống và trường phái trung hòa. Ý nghĩa của trường phái trung hòa đối với tư duy của nhà quản trị hiện đại là gì?', '• Trường phái truyền thống: xem rủi ro chủ yếu là sự không may, tổn thất hoặc nguy hiểm có thể xảy ra; trọng tâm là nhận diện và hạn chế tổn thất.\n• Trường phái trung hòa: xem rủi ro là sự không chắc chắn/khả năng sai lệch giữa kết quả thực tế và kết quả kỳ vọng, có thể dẫn đến tổn thất hoặc kết quả thuận lợi.\n• Ý nghĩa: nhà quản trị không chỉ tìm cách né tránh tổn thất mà còn phải nhận diện, đo lường, kiểm soát và khai thác những khả năng có thể tạo thành cơ hội.', NULL, 40, 'Trung bình', 'published', 0, 1, '2026-10-08 03:03:39', '2026-10-08 03:03:39'),
(7, 6, 'Câu hỏi số 2', 'CHƯƠNG 1: TỔNG QUAN VỀ RỦI RO', 'Phân biệt rủi ro thuần túy và rủi ro suy đoán. Nêu 2 ví dụ thực tế cho mỗi loại rủi ro này trong hoạt động của một doanh nghiệp xuất nhập khẩu.', '• Rủi ro thuần túy: chỉ có khả năng xảy ra tổn thất hoặc không xảy ra tổn thất, không tạo cơ hội sinh lợi. Ví dụ: hàng hóa xuất khẩu bị cháy; kho hàng bị ngập.\n• Rủi ro suy đoán: có thể dẫn đến tổn thất, hòa vốn hoặc có lợi ích. Ví dụ: doanh nghiệp đầu tư mở rộng sang một thị trường mới; doanh nghiệp kinh doanh ngoại tệ để tìm kiếm lợi nhuận.\n• Điểm phân biệt cốt lõi: rủi ro thuần túy không có khả năng tạo lợi ích, còn rủi ro suy đoán có cả khả năng đạt kết quả có lợi.', NULL, 40, 'Trung bình', 'published', 0, 1, '2026-10-08 03:04:07', '2026-10-09 04:37:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `chapter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `questions_count` int NOT NULL DEFAULT '50',
  `essay_questions_count` int NOT NULL DEFAULT '0',
  `scenario_questions_count` int NOT NULL DEFAULT '0',
  `duration` int NOT NULL DEFAULT '60',
  `type` enum('exam','practice') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'exam',
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `attempts` bigint UNSIGNED NOT NULL DEFAULT '0',
  `rating` decimal(3,1) NOT NULL DEFAULT '0.0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `exams`
--

INSERT INTO `exams` (`id`, `subject_id`, `chapter`, `title`, `description`, `questions_count`, `essay_questions_count`, `scenario_questions_count`, `duration`, `type`, `status`, `attempts`, `rating`, `created_by`, `created_at`, `updated_at`) VALUES
(4, 4, NULL, 'Đề thi số 1', NULL, 50, 0, 0, 60, 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:43:18', '2026-10-08 02:43:30'),
(5, 4, NULL, 'Đề thi số 2', NULL, 10, 0, 0, 60, 'exam', 'draft', 0, 0.0, 1, '2026-10-08 02:44:22', '2026-10-08 02:44:47'),
(6, 4, NULL, 'Đề thi số 2', NULL, 50, 0, 0, 60, 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:44:33', '2026-10-08 02:44:40'),
(7, 5, NULL, 'Đề thi số 1', NULL, 0, 3, 0, 75, 'exam', 'published', 1, 0.0, 1, '2026-10-08 02:50:46', '2026-10-08 04:30:15'),
(8, 5, NULL, 'Đề thi số 2', NULL, 0, 3, 0, 75, 'exam', 'published', 1, 0.0, 1, '2026-10-08 02:53:14', '2026-10-08 04:30:55'),
(9, 4, NULL, 'Đề thi số 3', NULL, 0, 0, 0, 75, 'exam', 'draft', 0, 0.0, 1, '2026-10-08 02:58:16', '2026-10-08 02:58:16'),
(10, 4, NULL, 'Đề thi số 3', NULL, 0, 3, 0, 75, 'exam', 'published', 0, 0.0, 1, '2026-10-08 02:58:21', '2026-10-08 02:58:51'),
(11, 7, NULL, 'Đề thi số 1', NULL, 15, 2, 0, 60, 'exam', 'published', 0, 0.0, 4, '2026-10-09 03:28:23', '2026-10-09 03:53:16'),
(12, 7, NULL, 'Đề thi số 2', NULL, 15, 3, 0, 60, 'exam', 'published', 0, 0.0, 4, '2026-10-09 03:50:03', '2026-10-09 03:50:52'),
(13, 7, NULL, 'Đề thi số 3', NULL, 15, 0, 0, 60, 'exam', 'draft', 0, 0.0, 4, '2026-10-09 04:01:57', '2026-10-09 04:01:57'),
(14, 7, NULL, 'Đề thi số 3', NULL, 15, 3, 0, 60, 'exam', 'draft', 0, 0.0, 4, '2026-10-09 04:02:11', '2026-10-09 06:44:54'),
(15, 7, NULL, 'Đề thi số 4', NULL, 15, 3, 0, 60, 'exam', 'published', 0, 0.0, 1, '2026-10-09 06:43:47', '2026-10-09 06:45:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'multiple_choice',
  `options` json DEFAULT NULL,
  `sub_questions` json DEFAULT NULL,
  `correct_answer` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `difficulty` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `exam_id`, `order`, `content`, `type`, `options`, `sub_questions`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`) VALUES
(151, 4, 1, 'Quản trị được thực hiện trong 1 tổ chức nhằm:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tối đa hóa lợi nhuận\"}, {\"id\": \"B\", \"text\": \"Đạt mục tiêu của tổ chức\"}, {\"id\": \"C\", \"text\": \"Sử dụng có hiệu quả cao nhất các nguồn lực\"}, {\"id\": \"D\", \"text\": \"Đạt được mục tiêu của tổ chức với hiệu suất cao\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(152, 4, 2, 'Điền vào chỗ trống: “Quản trị là những hoạt động cần thiết khi có nhiều người kết hợp với nhau trong 1 tổ chức nhằm thực hiện ________ chung”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Mục tiêu\"}, {\"id\": \"B\", \"text\": \"Lợi nhuận\"}, {\"id\": \"C\", \"text\": \"Kế hoạch\"}, {\"id\": \"D\", \"text\": \"Lợi ích\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(153, 4, 3, 'Điền vào chỗ trống: “Hoạt động quản trị chịu sự tác động của ________ đang biến động không ngừng”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Kỹ thuật\"}, {\"id\": \"B\", \"text\": \"Công nghệ\"}, {\"id\": \"C\", \"text\": \"Kinh tế\"}, {\"id\": \"D\", \"text\": \"Môi trường\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(154, 4, 4, 'Quản trị cần thiết cho:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Các tổ chức vì lợi nhuận và tổ chức phi lợi nhuận\"}, {\"id\": \"B\", \"text\": \"Các doanh nghiệp hoạt động sản xuất kinh doanh\"}, {\"id\": \"C\", \"text\": \"Các đơn vị hành chính sự nghiệp\"}, {\"id\": \"D\", \"text\": \"Các công ty lớn\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(155, 4, 5, 'Điền vào chỗ trống: “Quản trị hướng tổ chức đạt mục tiêu với ________ cao nhất và chi phí thấp nhất”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sự thỏa mãn\"}, {\"id\": \"B\", \"text\": \"Lợi ích\"}, {\"id\": \"C\", \"text\": \"Kết quả\"}, {\"id\": \"D\", \"text\": \"Lợi nhuận\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(156, 4, 6, 'Để tăng hiệu suất quản trị, các nhà quản trị có thể thực hiện bằng cách:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giảm chi phí ở đầu vào và doanh thu ở đầu ra không thay đổi\"}, {\"id\": \"B\", \"text\": \"Chi phí ở đầu vào không thay đổi và tăng doanh thu ở đầu ra\"}, {\"id\": \"C\", \"text\": \"Vừa giảm chi phí ở đầu vào và vừa tăng doanh thu ở đầu ra\"}, {\"id\": \"D\", \"text\": \"Tất cả những cách trên\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(157, 4, 7, 'Theo Henry Minzberg, các nhà quản trị phải thực hiện bao nhiêu vai trò:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"7\"}, {\"id\": \"B\", \"text\": \"14\"}, {\"id\": \"C\", \"text\": \"10\"}, {\"id\": \"D\", \"text\": \"4\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(158, 4, 8, 'Nghiên cứu của Henry Minzberg đã nhận dạng 10 vai trò của nhà quản trị và phân loại thành 3 nhóm vai trò, đó là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhóm vai trò lãnh đạo, vai trò thông tin, vai trò ra quyết định\"}, {\"id\": \"B\", \"text\": \"Nhóm vai trò tương quan nhân sự, vai trò xử lý các xung đột, vai trò ra quyết định\"}, {\"id\": \"C\", \"text\": \"Nhóm vai trò tương quan nhân sự, vai trò thông tin, vai trò ra quyết định\"}, {\"id\": \"D\", \"text\": \"Nhóm vai trò liên lạc, vai trò phân bổ tài nguyên, vai trò thương thuyết\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(159, 4, 9, 'Hiệu suất của quản trị chỉ có được khi:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Làm đúng việc\"}, {\"id\": \"B\", \"text\": \"Làm việc đúng cách\"}, {\"id\": \"C\", \"text\": \"Chi phí thấp\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(160, 4, 10, 'Trong quản trị tổ chức, quan trọng nhất là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Làm đúng việc\"}, {\"id\": \"B\", \"text\": \"Thực hiện mục tiêu đúng với hiệu suất cao\"}, {\"id\": \"C\", \"text\": \"Đạt được lợi nhuận\"}, {\"id\": \"D\", \"text\": \"Chi phí thấp\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(161, 4, 11, 'Hiệu quả và hiệu suất của quản trị chỉ có được khi:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Làm đúng việc\"}, {\"id\": \"B\", \"text\": \"Làm đúng cách\"}, {\"id\": \"C\", \"text\": \"Tỷ lệ giữa kết quả đạt được / chi phí bỏ ra cao\"}, {\"id\": \"D\", \"text\": \"Làm đúng cách để đạt được mục tiêu\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(162, 4, 12, 'Nhà quản trị thực hiện vai trò gì khi đưa ra quyết định áp dụng công nghệ mới vào sản xuất:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Vai trò người phân bổ tài nguyên\"}, {\"id\": \"B\", \"text\": \"Vai trò người thực hiện\"}, {\"id\": \"C\", \"text\": \"Vai trò người đại diện\"}, {\"id\": \"D\", \"text\": \"Vai trò người doanh nhân\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(163, 4, 13, 'Nhà quản trị thực hiện vai trò gì khi giải quyết vấn đề bãi công xảy ra trong doanh nghiệp:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Vai trò nhà kinh doanh\"}, {\"id\": \"B\", \"text\": \"Vai trò người giải quyết xáo trộn\"}, {\"id\": \"C\", \"text\": \"Vai trò người thương thuyết\"}, {\"id\": \"D\", \"text\": \"Vai trò người lãnh đạo\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(164, 4, 14, 'Nhà quản trị thực hiện vai trò gì khi đàm phán với đối tác về việc tăng đơn giá gia công trong quá trình thảo luận hợp đồng với họ:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Vai trò người liên lạc\"}, {\"id\": \"B\", \"text\": \"Vai trò người thương thuyết\"}, {\"id\": \"C\", \"text\": \"Vai trò người lãnh đạo\"}, {\"id\": \"D\", \"text\": \"Vai trò người đại diện\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(165, 4, 15, 'Mối quan hệ giữa khoa học và nghệ thuật quản trị được diễn đạt rõ nhất trong câu:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Khoa học là nền tảng để hình thành nghệ thuật\"}, {\"id\": \"B\", \"text\": \"Trực giác là quan trọng để thành công trong quản trị\"}, {\"id\": \"C\", \"text\": \"Cần vận dụng đúng các nguyên tắc khoa học vào quản trị\"}, {\"id\": \"D\", \"text\": \"Có mối quan hệ biện chứng giữa khoa học và nghệ thuật quản trị\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(166, 4, 16, 'Phát biểu nào sau đây không đúng?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Trực giác là quan trọng để thành công trong quản trị\"}, {\"id\": \"B\", \"text\": \"Có mối quan hệ biện chứng giữa khoa học và nghệ thuật quản trị\"}, {\"id\": \"C\", \"text\": \"Cần vận dụng đúng các nguyên tắc khoa học vào quản trị\"}, {\"id\": \"D\", \"text\": \"Khoa học là nền tảng để hình thành nghệ thuật quản trị\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(167, 4, 17, 'Nghệ thuật quản trị có được từ:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Từ cha truyền con nối\"}, {\"id\": \"B\", \"text\": \"Khả năng bẩm sinh\"}, {\"id\": \"C\", \"text\": \"Trải nghiệm qua thực hành quản trị\"}, {\"id\": \"D\", \"text\": \"Các chương trình đào tạo\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(168, 4, 18, 'Phát biểu nào sau đây là không đúng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nghệ thuật quản trị không thể học được\"}, {\"id\": \"B\", \"text\": \"Có được từ di truyền\"}, {\"id\": \"C\", \"text\": \"Trải nghiệm qua thực hành quản trị\"}, {\"id\": \"D\", \"text\": \"Khả năng bẩm sinh\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(169, 4, 19, 'Quản trị theo học thuyết Z là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Quản trị theo cách của Mỹ\"}, {\"id\": \"B\", \"text\": \"Quản trị theo cách của Nhật Bản\"}, {\"id\": \"C\", \"text\": \"Quản trị kết hợp theo cách của Mỹ và của Nhật Bản\"}, {\"id\": \"D\", \"text\": \"Các cách hiểu trên đều sai\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(170, 4, 20, 'Học thuyết Z chú trọng tới:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Mối quan hệ con người trong tổ chức\"}, {\"id\": \"B\", \"text\": \"Vấn đề lương bổng cho người lao động\"}, {\"id\": \"C\", \"text\": \"Sử dụng người dài hạn\"}, {\"id\": \"D\", \"text\": \"Đào tạo đa năng\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(171, 4, 21, 'Tác giả của học thuyết Z là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Người Mỹ\"}, {\"id\": \"B\", \"text\": \"Người Nhật\"}, {\"id\": \"C\", \"text\": \"Người Mỹ gốc Nhật\"}, {\"id\": \"D\", \"text\": \"Một người khác\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(172, 4, 22, 'Tác giả của học thuyết X là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"William Ouchi\"}, {\"id\": \"B\", \"text\": \"Frederick Herzberg\"}, {\"id\": \"C\", \"text\": \"Douglas McGregor\"}, {\"id\": \"D\", \"text\": \"Henry Fayol\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(173, 4, 23, 'Điền vào chỗ trống: “Trường phái quản trị khoa học quan tâm đến ________ lao động thông qua việc hợp lý hóa các bước công việc”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Điều kiện\"}, {\"id\": \"B\", \"text\": \"Năng suất\"}, {\"id\": \"C\", \"text\": \"Môi trường\"}, {\"id\": \"D\", \"text\": \"Trình độ\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(174, 4, 24, 'Điểm quan tâm chung của các trường phái quản trị là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Năng suất lao động\"}, {\"id\": \"B\", \"text\": \"Con người\"}, {\"id\": \"C\", \"text\": \"Hiệu quả\"}, {\"id\": \"D\", \"text\": \"Lợi nhuận\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(175, 4, 25, 'Để đạt hiệu quả, các nhà quản trị cần phải:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xác định và hoàn thành đúng mục tiêu\"}, {\"id\": \"B\", \"text\": \"Giảm chi phí đầu vào\"}, {\"id\": \"C\", \"text\": \"Tăng doanh thu ở đầu ra\"}, {\"id\": \"D\", \"text\": \"Tất cả đều chưa chính xác\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(176, 4, 26, 'Nhà quản trị cần phân bố thời gian nhiều nhất cho việc thực hiện chức năng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định và kiểm tra\"}, {\"id\": \"B\", \"text\": \"Điều khiển và kiểm tra\"}, {\"id\": \"C\", \"text\": \"Hoạch định và tổ chức\"}, {\"id\": \"D\", \"text\": \"Tất cả phương án trên đều không chính xác\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(177, 4, 27, 'Nhà quản trị cấp thấp cần thiết nhất:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Kỹ năng nhân sự\"}, {\"id\": \"B\", \"text\": \"Kỹ năng nhân sự + kỹ năng kỹ thuật\"}, {\"id\": \"C\", \"text\": \"Kỹ năng kỹ thuật\"}, {\"id\": \"D\", \"text\": \"Kỹ năng kỹ thuật + kỹ năng tư duy\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(178, 4, 28, 'Các chức năng cơ bản theo quản trị học hiện đại gồm:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"4 chức năng\"}, {\"id\": \"B\", \"text\": \"6 chức năng\"}, {\"id\": \"C\", \"text\": \"3 chức năng\"}, {\"id\": \"D\", \"text\": \"5 chức năng\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(179, 4, 29, 'Trong quản trị doanh nghiệp quan trọng nhất là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xác định đúng lĩnh vực hoạt động tổ chức\"}, {\"id\": \"B\", \"text\": \"Xác định đúng quy mô của tổ chức\"}, {\"id\": \"C\", \"text\": \"Xác định đúng trình độ và số lượng đội ngũ nhân viên\"}, {\"id\": \"D\", \"text\": \"Xác định đúng chiến lược phát triển của doanh nghiệp\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(180, 4, 30, 'Nhà quản trị cấp thấp cần tập trung thời gian nhiều nhất cho chức năng nào sau đây?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định\"}, {\"id\": \"B\", \"text\": \"Tổ chức và kiểm tra\"}, {\"id\": \"C\", \"text\": \"Điều khiển\"}, {\"id\": \"D\", \"text\": \"Tất cả các chức năng trên\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(181, 4, 31, 'Thời gian dành cho chức năng hoạch định sẽ cần nhiều hơn đối với nhà quản trị:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cấp cao\"}, {\"id\": \"B\", \"text\": \"Cấp trung\"}, {\"id\": \"C\", \"text\": \"Cấp thấp\"}, {\"id\": \"D\", \"text\": \"Tất cả các nhà quản trị\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(182, 4, 32, 'Hoạt động quản trị thị trường được thực hiện thông qua 4 chức năng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định, tổ chức, điều khiển, kiểm tra\"}, {\"id\": \"B\", \"text\": \"Hoạch định, nhân sự, chỉ huy, phối hợp\"}, {\"id\": \"C\", \"text\": \"Hoạch định, tổ chức, phối hợp, báo cáo\"}, {\"id\": \"D\", \"text\": \"Kế hoạch, chỉ đạo, tổ chức, kiểm tra\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(183, 4, 33, 'Trong 1 tổ chức, các cấp bậc quản trị thường được chia thành:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"2 cấp quản trị\"}, {\"id\": \"B\", \"text\": \"3 cấp quản trị\"}, {\"id\": \"C\", \"text\": \"4 cấp quản trị\"}, {\"id\": \"D\", \"text\": \"5 cấp quản trị\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(184, 4, 34, 'Cố vấn cho ban giám đốc của 1 doanh nghiệp thuộc cấp quản trị:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cấp cao\"}, {\"id\": \"B\", \"text\": \"Cấp giữa\"}, {\"id\": \"C\", \"text\": \"Cấp thấp (cơ sở)\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(185, 4, 35, 'Điền vào chỗ trống: “Chức năng hoạch định nhằm xác định mục tiêu cần đạt được và đề ra ________ hành động để đạt mục tiêu trong từng khoảng thời gian nhất định”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Quan điểm\"}, {\"id\": \"B\", \"text\": \"Chương trình\"}, {\"id\": \"C\", \"text\": \"Giới hạn\"}, {\"id\": \"D\", \"text\": \"Cách thức\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(186, 4, 36, 'Quan hệ giữa cấp bậc quản trị và các kỹ năng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chức vụ càng thấp thì kĩ năng về kỹ thuật càng quan trọng\"}, {\"id\": \"B\", \"text\": \"Chức vụ càng cao thì kỹ năng về tư duy càng quan trọng\"}, {\"id\": \"C\", \"text\": \"Nhà quản trị cần tất cả các kỹ năng, tuy nhiên chức vụ càng cao thì kỹ năng tư duy càng quan trọng\"}, {\"id\": \"D\", \"text\": \"Tất cả những tuyên bố nêu trên đều sai\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(187, 4, 37, 'Kỹ năng nào cần thiết ở mức độ như nhau đối với các nhà quản trị:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tư duy\"}, {\"id\": \"B\", \"text\": \"Kỹ thuật\"}, {\"id\": \"C\", \"text\": \"Nhân sự\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(188, 4, 38, 'Vai trò nào đã được thực hiện khi nhà quản trị đưa ra 1 quyết định để phát triển kinh doanh:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Vai trò người lãnh đạo\"}, {\"id\": \"B\", \"text\": \"Vai trò người đại diện\"}, {\"id\": \"C\", \"text\": \"Vai trò người phân bổ tài nguyên\"}, {\"id\": \"D\", \"text\": \"Vai trò người doanh nhân\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(189, 4, 39, 'Điền vào chỗ trống: “Nhà quản trị cấp thấp thì kỹ năng ________ càng quan trọng”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhân sự\"}, {\"id\": \"B\", \"text\": \"Chuyên môn\"}, {\"id\": \"C\", \"text\": \"Tư duy\"}, {\"id\": \"D\", \"text\": \"Giao tiếp\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(190, 4, 40, 'Mục tiêu của quản trị trong 1 tổ chức là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Đạt được hiệu quả và hiệu suất cao\"}, {\"id\": \"B\", \"text\": \"Sử dụng hợp lý các nguồn lực hiện có\"}, {\"id\": \"C\", \"text\": \"Tìm kiếm lợi nhuận\"}, {\"id\": \"D\", \"text\": \"Tạo sự ổn định để phát triển\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(191, 4, 41, 'Phát biểu nào sau đây là sai:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Quản trị cần thiết đối với bệnh viện\"}, {\"id\": \"B\", \"text\": \"Quản trị cần thiết đối với trường đại học\"}, {\"id\": \"C\", \"text\": \"Quản trị chỉ cần thiết đối với tổ chức có quy mô lớn\"}, {\"id\": \"D\", \"text\": \"Quản trị cần thiết đối với doanh nghiệp\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(192, 4, 42, 'Quản trị cần thiết trong các tổ chức để:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Đạt được lợi nhuận\"}, {\"id\": \"B\", \"text\": \"Giảm chi phí\"}, {\"id\": \"C\", \"text\": \"Đạt được mục tiêu với hiệu suất cao\"}, {\"id\": \"D\", \"text\": \"Tạo trật tự trong 1 tổ chức\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(193, 4, 43, 'Để tăng hiệu quả, các nhà quản trị có thể thực hiện bằng cách:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giảm chi phí ở đầu vào và kết quả ở đầu ra không thay đổi\"}, {\"id\": \"B\", \"text\": \"Chi phí ở đầu vào không đổi và tăng kết quả đầu ra\"}, {\"id\": \"C\", \"text\": \"Vừa giảm chi phí ở đầu vào và tăng kết quả đầu ra\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(194, 4, 44, 'Quản trị viên trung cấp trường tập trung vào việc ra các loại quyết định:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chiến lược\"}, {\"id\": \"B\", \"text\": \"Tác nghiệp\"}, {\"id\": \"C\", \"text\": \"Chiến thuật\"}, {\"id\": \"D\", \"text\": \"Tất cả các loại quyết định trên\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(195, 4, 45, 'Càng xuống cấp thấp hơn thời gian dành cho chức năng quản trị nào sẽ càng quan trọng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định\"}, {\"id\": \"B\", \"text\": \"Tổ chức và kiểm tra\"}, {\"id\": \"C\", \"text\": \"Điều khiển\"}, {\"id\": \"D\", \"text\": \"Tất cả các chức năng trên\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(196, 4, 46, 'Càng lên cấp cao hơn, thời gian dành cho chức năng quản trị nào sẽ càng quan trọng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định\"}, {\"id\": \"B\", \"text\": \"Tổ chức\"}, {\"id\": \"C\", \"text\": \"Điều khiển\"}, {\"id\": \"D\", \"text\": \"Tất cả các chức năng trên\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(197, 4, 47, 'Nhà quản trị phân bố thời gian nhiều nhất cho việc thực hiện chức năng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hoạch định\"}, {\"id\": \"B\", \"text\": \"Điều khiển và kiểm tra\"}, {\"id\": \"C\", \"text\": \"Tổ chức\"}, {\"id\": \"D\", \"text\": \"Tất cả phương án trên đều không chính xác\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(198, 4, 48, 'Nhà quản trị cấp cao cần thiết nhất kỹ năng:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhân sự\"}, {\"id\": \"B\", \"text\": \"Tư duy\"}, {\"id\": \"C\", \"text\": \"Kỹ thuật\"}, {\"id\": \"D\", \"text\": \"Kỹ năng tư duy + nhân sự\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(199, 4, 49, 'Mối quan hệ giữa các cấp bậc quản trị và các kỹ năng của nhà quản trị là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Ở bậc quản trị càng cao kỹ năng kỹ thuật càng có tầm quan trọng\"}, {\"id\": \"B\", \"text\": \"Ở bậc quản trị càng cao kỹ năng nhân sự càng có tầm quan trọng\"}, {\"id\": \"C\", \"text\": \"Kỹ năng nhân sự có tầm quan trọng như nhau đối với các cấp bậc quản trị\"}, {\"id\": \"D\", \"text\": \"Tất cả các phương án trên đều sai\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(200, 4, 50, 'Điền vào chỗ trống: “Nhà quản trị cấp thấp thì kỹ năng ________ càng quan trọng”:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhân sự\"}, {\"id\": \"B\", \"text\": \"Chuyên môn\"}, {\"id\": \"C\", \"text\": \"Tư duy\"}, {\"id\": \"D\", \"text\": \"Giao tiếp\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:43:30', '2026-10-08 02:43:30'),
(201, 6, 1, 'Điểm quan tâm chung giữa các trường phái quản trị khoa học, quản trị Hành chính, quản trị định lượng là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Con người\"}, {\"id\": \"B\", \"text\": \"Năng suất lao động\"}, {\"id\": \"C\", \"text\": \"Cách thức quản trị\"}, {\"id\": \"D\", \"text\": \"Lợi nhuận\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(202, 6, 2, 'Điền vào chỗ trống: “Trường phái tâm lý – xã hội trong quản trị nhấn mạnh đến vai trò của yếu tố tâm lý, quan hệ ______ của con người trong xã hội”', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xã hội\"}, {\"id\": \"B\", \"text\": \"Bình đẳng\"}, {\"id\": \"C\", \"text\": \"Đẳng cấp\"}, {\"id\": \"D\", \"text\": \"Lợi ích\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(203, 6, 3, 'Các lý thuyết quản trị cổ điển có hạn chế là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Quan niệm xí nghiệp là 1 hệ thống khép kín\"}, {\"id\": \"B\", \"text\": \"Chưa chú trọng đúng mức đến yếu tố con người\"}, {\"id\": \"C\", \"text\": \"Cả a & b\"}, {\"id\": \"D\", \"text\": \"Cách nhìn phiến diện\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(204, 6, 4, 'Lý thuyết “Quản trị khoa học” được xếp vào trường phái quản trị nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Trường phái tâm lý – xã hội\"}, {\"id\": \"B\", \"text\": \"Trường phái quản trị định lượng\"}, {\"id\": \"C\", \"text\": \"Trường phái quản trị cổ điển\"}, {\"id\": \"D\", \"text\": \"Trường phái quản trị hiện đại\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(205, 6, 5, 'Người đưa ra 14 nguyên tắc “Quản trị tổng quát” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Frederick W. Taylor (1856 – 1915)\"}, {\"id\": \"B\", \"text\": \"Henry Fayol (1814 – 1925)\"}, {\"id\": \"C\", \"text\": \"Max Weber (1864 – 1920)\"}, {\"id\": \"D\", \"text\": \"Douglas M Gregor (1900 – 1964)\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(206, 6, 6, 'Tư tưởng của trường phái quản trị tổng quát (hành chính) thể hiện qua:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"14 nguyên tắc của H.Fayol\"}, {\"id\": \"B\", \"text\": \"4 nguyên tắc của W.Taylor\"}, {\"id\": \"C\", \"text\": \"6 phạm trù của công việc quản trị\"}, {\"id\": \"D\", \"text\": \"Mô hình tổ chức quan liêu bàn giấy\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(207, 6, 7, '“Trường phái quản trị quá trình” được Harold Koontz đề ra trên cơ sở tư tưởng của:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"H. Fayol\"}, {\"id\": \"B\", \"text\": \"M. Weber\"}, {\"id\": \"C\", \"text\": \"R. Owen\"}, {\"id\": \"D\", \"text\": \"W. Taylor\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(208, 6, 8, 'Điền vào chỗ trống: “Theo trường phái định lượng tất cả các vấn đề quản trị đều có thể giải quyết được bằng ______”', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Mô tả\"}, {\"id\": \"B\", \"text\": \"Mô hình toán\"}, {\"id\": \"C\", \"text\": \"Mô phỏng\"}, {\"id\": \"D\", \"text\": \"Kỹ thuật khác nhau\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(209, 6, 9, 'Tác giả của “Trường phái quản trị quá trình” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Harold Koontz\"}, {\"id\": \"B\", \"text\": \"Henry Fayol\"}, {\"id\": \"C\", \"text\": \"R. Owen\"}, {\"id\": \"D\", \"text\": \"Max Weber\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(210, 6, 10, 'Trường phái Hội nhập trong quản trị được xây dựng từ:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sự tích hợp các lý thuyết quản trị trên cơ sở chọn lọc\"}, {\"id\": \"B\", \"text\": \"Trường phái quản trị hệ thống và trường phái ngẫu nhiên\"}, {\"id\": \"C\", \"text\": \"Một số trường phái khác nhau\"}, {\"id\": \"D\", \"text\": \"Quá trình hội nhập kinh tế toàn cầu\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(211, 6, 11, 'Mô hình 7’S theo quan điểm của Mckinsey thuộc trường phái quản trị nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Trường phái quản trị hành chính\"}, {\"id\": \"B\", \"text\": \"Trường phái quản trị hội nhập\"}, {\"id\": \"C\", \"text\": \"Trường phái quản trị hiện đại\"}, {\"id\": \"D\", \"text\": \"Trường phái quản trị khoa học\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(212, 6, 12, 'Các tác giả nổi tiếng của trường phái tâm lý – xã hội là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Mayo; Maslow; Gregor; Vroom\"}, {\"id\": \"B\", \"text\": \"Simon; Mayo; Maslow; Mayo; Maslow\"}, {\"id\": \"C\", \"text\": \"Maslow; Gregor; Vroom; Gannitx\"}, {\"id\": \"D\", \"text\": \"Taylor; Maslow; Gregor; Fayol\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(213, 6, 13, 'Nhà nghiên cứu về quản trị đã đưa ra lý thuyết “tổ chức quan liêu bàn giấy” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"M. Weber\"}, {\"id\": \"B\", \"text\": \"H. Fayol\"}, {\"id\": \"C\", \"text\": \"W. Taylor\"}, {\"id\": \"D\", \"text\": \"E. Mayo\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(214, 6, 14, 'Điền vào chỗ trống: “Theo trường phái định lượng tất cả các vấn đề quản trị đều có thể ______ được bằng các mô hình toán”', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Mô tả\"}, {\"id\": \"B\", \"text\": \"Giải quyết\"}, {\"id\": \"C\", \"text\": \"Mô phỏng\"}, {\"id\": \"D\", \"text\": \"Trả lời\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(215, 6, 15, 'Người đưa ra nguyên tắc “tổ chức công việc khoa học” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"W. Taylor\"}, {\"id\": \"B\", \"text\": \"H. Fayol\"}, {\"id\": \"C\", \"text\": \"C. Barnard\"}, {\"id\": \"D\", \"text\": \"Một người khác\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(216, 6, 16, 'Người đưa ra nguyên tắc “tập trung & phân tán” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"C. Barnard\"}, {\"id\": \"B\", \"text\": \"H. Fayol\"}, {\"id\": \"C\", \"text\": \"W. Taylor\"}, {\"id\": \"D\", \"text\": \"Một người khác\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(217, 6, 17, '“Năng suất lao động là chìa khóa để đạt hiệu quả quản trị” là quan điểm của trường phái:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tâm lý – xã hội trong quản trị\"}, {\"id\": \"B\", \"text\": \"Quản trị khoa học\"}, {\"id\": \"C\", \"text\": \"Quản trị định lượng\"}, {\"id\": \"D\", \"text\": \"Cả A và B\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(218, 6, 18, '“Ra quyết định đúng là chìa khóa để đạt hiểu quả quản trị” là quan điểm của trường phái:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Định lượng\"}, {\"id\": \"B\", \"text\": \"Khoa học\"}, {\"id\": \"C\", \"text\": \"Tổng quát\"}, {\"id\": \"D\", \"text\": \"Tâm lý – xã hội\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(219, 6, 19, 'Các lý thuyết quản trị cổ điển:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Không còn đúng trong quản trị hiện đại\"}, {\"id\": \"B\", \"text\": \"Còn đúng trong quản trị hiện đại\"}, {\"id\": \"C\", \"text\": \"Còn có giá trị trong quản trị hiện đại\"}, {\"id\": \"D\", \"text\": \"Cần phân tích để vận dụng linh hoạt\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(220, 6, 20, 'Người đưa ra nguyên tắc thống nhất chỉ huy là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"M. Weber\"}, {\"id\": \"B\", \"text\": \"H. Fayol\"}, {\"id\": \"C\", \"text\": \"C. Barnard\"}, {\"id\": \"D\", \"text\": \"Một người khác\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(221, 6, 21, 'Nguyên tắc thẩm quyền (quyền hạn) và trách nhiệm được đề ra bởi:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Herbert Simont\"}, {\"id\": \"B\", \"text\": \"M. Weber\"}, {\"id\": \"C\", \"text\": \"Winslow Taylor\"}, {\"id\": \"D\", \"text\": \"Henry Fayol\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(222, 6, 22, 'Các yếu tố trong mô hình 7’S của McKiney là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chiến lược; cơ cấu; hệ thống; tài chính; kỹ năng; nhân viên; mục tiêu phối hợp\"}, {\"id\": \"B\", \"text\": \"Chiến lược; hệ thống; mục tiêu phối hợp; phong cách; công nghệ; tài chính; nhân viên\"}, {\"id\": \"C\", \"text\": \"Chiến lược; kỹ năng; mục tiêu phối hợp; cơ cấu; hệ thống; nhân viên; phong cách\"}, {\"id\": \"D\", \"text\": \"Chiến lược; cơ cấu; hệ thống; đào tạo; mục tiêu; kỹ năng; nhân viên\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(223, 6, 23, 'Đại diện tiêu biểu của “Trường phái quản trị quá trình” là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Harold Koontz\"}, {\"id\": \"B\", \"text\": \"Henry Fayol\"}, {\"id\": \"C\", \"text\": \"Robert Owen\"}, {\"id\": \"D\", \"text\": \"Max Weber\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(224, 6, 24, 'Phân tích môi trường hoạt động của tổ chức nhằm:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xác định cơ hội & nguy cơ\"}, {\"id\": \"B\", \"text\": \"Xác định điểm mạnh & điểm yếu\"}, {\"id\": \"C\", \"text\": \"Phục vụ cho việc ra quyết định\"}, {\"id\": \"D\", \"text\": \"Để có thông tin\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(225, 6, 25, 'Môi trường ảnh hưởng đến hoạt động của 1 doanh nghiệp bao gồm:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Môi trường bên trong và bên ngoài\"}, {\"id\": \"B\", \"text\": \"Môi trường vĩ mô, vi mô và nội bộ\"}, {\"id\": \"C\", \"text\": \"Môi trường tổng quát, ngành và nội bộ\"}, {\"id\": \"D\", \"text\": \"Môi trường toàn cầu, tổng quát, ngành và nội bộ\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(226, 6, 26, 'Các biện pháp kiềm chế lạm phát nền kinh tế là tác động của môi trường?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tổng quát\"}, {\"id\": \"B\", \"text\": \"Ngành\"}, {\"id\": \"C\", \"text\": \"Bên ngoài\"}, {\"id\": \"D\", \"text\": \"Nội bộ\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:39', '2026-10-08 02:44:39'),
(227, 6, 27, 'Nhà quản trị cần phân tích môi trường để:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Có thông tin\"}, {\"id\": \"B\", \"text\": \"Lập kế hoạch kinh doanh\"}, {\"id\": \"C\", \"text\": \"Phát triển thị trường\"}, {\"id\": \"D\", \"text\": \"Để ra quyết định kinh doanh\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(228, 6, 28, 'Môi trường tác động đến doanh nghiệp và:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tạo các cơ hội cho doanh nghiệp\"}, {\"id\": \"B\", \"text\": \"Có ảnh hưởng đến quyết định và chiến lược hoạt động của doanh nghiệp\"}, {\"id\": \"C\", \"text\": \"Tác động đến phạm vi hoạt động của doanh nghiệp\"}, {\"id\": \"D\", \"text\": \"Tạo các đe dọa đối với doanh nghiệp\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(229, 6, 29, 'Khoa học và công nghệ phát triển nhanh đem lại cho doanh nghiệp:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhiều cơ hội\"}, {\"id\": \"B\", \"text\": \"Nhiều cơ hội hơn là thách thức\"}, {\"id\": \"C\", \"text\": \"Nhiều thách thức\"}, {\"id\": \"D\", \"text\": \"Tất cả đều chưa chính xác\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(230, 6, 30, 'Nghiên cứu yếu tố dân số là cần thiết để doanh nghiệp:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xác định cơ hội thị trường\"}, {\"id\": \"B\", \"text\": \"Xác định nhu cầu thị trường\"}, {\"id\": \"C\", \"text\": \"Ra quyết định kinh doanh\"}, {\"id\": \"D\", \"text\": \"Các định chiến lược sản phẩm\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(231, 6, 31, 'Nhân viên giỏi rời bỏ doanh nghiệp đến nơi khác, đó là yếu tố nào tác động đến doanh nghiệp?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Yếu tố dân số\"}, {\"id\": \"B\", \"text\": \"Yếu tố xã hội\"}, {\"id\": \"C\", \"text\": \"Yếu tố chính trị\"}, {\"id\": \"D\", \"text\": \"Yếu tố kinh tế\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(232, 6, 32, 'Việc điều chỉnh trần lãi suất huy động tiết kiệm là yếu tố tác động từ yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Kinh tế\"}, {\"id\": \"B\", \"text\": \"Chính trị và luật pháp\"}, {\"id\": \"C\", \"text\": \"Của môi trường ngành\"}, {\"id\": \"D\", \"text\": \"Nhà cung cấp\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(233, 6, 33, 'Chính sách phúc lợi xã hội là yếu tố thuộc:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Môi trường tổng quát\"}, {\"id\": \"B\", \"text\": \"Xã hội\"}, {\"id\": \"C\", \"text\": \"Yếu tố chính sách và pháp luật\"}, {\"id\": \"D\", \"text\": \"Yếu tố dân số\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(234, 6, 34, 'Kỹ thuật phân tích SWOT được dùng để:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xác định điểm mạnh – yếu của doanh nghiệp\"}, {\"id\": \"B\", \"text\": \"Xác định cơ hội – đe dọa đến doanh nghiệp\"}, {\"id\": \"C\", \"text\": \"Xác định các phương án kết hợp từ kết quả phân tích môi trường để xây dựng chiến lược\"}, {\"id\": \"D\", \"text\": \"Tổng hợp các thông tin từ phân tích môi trường\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(235, 6, 35, 'Phân tích đối thủ cạnh tranh là phân tích yếu tố của môi trường:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tổng quát\"}, {\"id\": \"B\", \"text\": \"Ngành\"}, {\"id\": \"C\", \"text\": \"Bên ngoài\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(236, 6, 36, 'Giá dầu thô trên thị trường thế giới tăng là ảnh hưởng của môi trường:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Toàn cầu\"}, {\"id\": \"B\", \"text\": \"Ngành\"}, {\"id\": \"C\", \"text\": \"Tổng quát\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(237, 6, 37, 'Xu hướng của tỉ giá là yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chính phủ và chính trị\"}, {\"id\": \"B\", \"text\": \"Kinh tế\"}, {\"id\": \"C\", \"text\": \"Của môi trường tổng quát\"}, {\"id\": \"D\", \"text\": \"Của môi trường ngành\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(238, 6, 38, 'Các biến động trên thị trường chứng khoán là yếu tố ảnh hưởng đến doanh nghiệp từ:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Môi trường ngành\"}, {\"id\": \"B\", \"text\": \"Môi trường đặc thù\"}, {\"id\": \"C\", \"text\": \"Yếu tố kinh tế\"}, {\"id\": \"D\", \"text\": \"Môi trường tổng quát\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(239, 6, 39, 'Với doanh nghiệp, việc nghiên cứu môi trường là công việc phải làm của:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giám đốc doanh nghiệp\"}, {\"id\": \"B\", \"text\": \"Các nhà chuyên môn\"}, {\"id\": \"C\", \"text\": \"Khách hàng\"}, {\"id\": \"D\", \"text\": \"Tất cả các nhà quản trị\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(240, 6, 40, 'Điền vào chỗ trống: “Khi nghiên cứu môi trường cần nhận diện các yếu tố tác động và ______ của các yếu tố đó”', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sự nguy hiểm\"}, {\"id\": \"B\", \"text\": \"Khả năng xuất hiện\"}, {\"id\": \"C\", \"text\": \"Mức độ ảnh hưởng\"}, {\"id\": \"D\", \"text\": \"Sự thay đổi\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(241, 6, 41, 'Tác động của sở thích theo nhóm tuổi đối với sản phẩm của doanh nghiệp là yếu tố thuộc về:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Kinh tế\"}, {\"id\": \"B\", \"text\": \"Dân số\"}, {\"id\": \"C\", \"text\": \"Chính trị xã hội\"}, {\"id\": \"D\", \"text\": \"Văn hóa\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(242, 6, 42, 'Sự điều tiết vĩ mô nền kinh tế VN thông qua các chính sách kinh tế, tài chính. Đó là tác động đến doanh nghiệp từ:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Môi trường tổng quát\"}, {\"id\": \"B\", \"text\": \"Môi trường ngành\"}, {\"id\": \"C\", \"text\": \"Yếu tố kinh tế\"}, {\"id\": \"D\", \"text\": \"Yếu tố chính trị và pháp luật\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(243, 6, 43, '“Mức tăng trưởng của nền kinh tế giảm sút” ảnh hưởng đến doanh nghiệp là yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chính trị\"}, {\"id\": \"B\", \"text\": \"Kinh tế\"}, {\"id\": \"C\", \"text\": \"Xã hội\"}, {\"id\": \"D\", \"text\": \"Của môi trường tổng quát\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(244, 6, 44, 'Người dân ngày càng quan tâm hơn đến chất lượng cuộc sống là sự tác động từ yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Kinh tế\"}, {\"id\": \"B\", \"text\": \"Chính trị – pháp luật\"}, {\"id\": \"C\", \"text\": \"Xã hội\"}, {\"id\": \"D\", \"text\": \"Dân số\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(245, 6, 45, 'Lãi suất huy động tiết kiệm của ngân hàng là tác động đến doanh nghiệp từ yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chính trị – pháp luật\"}, {\"id\": \"B\", \"text\": \"Kinh tế\"}, {\"id\": \"C\", \"text\": \"Nhà cung cấp\"}, {\"id\": \"D\", \"text\": \"Tài chính\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(246, 6, 46, 'Chính sách hỗ trợ lãi suất tín dụng cho doanh nghiệp vừa và nhỏ là tác động từ yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chính trị – pháp luật\"}, {\"id\": \"B\", \"text\": \"Kinh tế\"}, {\"id\": \"C\", \"text\": \"Nhà cung cấp\"}, {\"id\": \"D\", \"text\": \"Tài chính\"}]', NULL, 'A', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(247, 6, 47, 'Sự kiện sữa nhiễm chất melamina của các doanh nghiệp sản xuất sữa, ảnh hưởng đến:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Công nghệ\"}, {\"id\": \"B\", \"text\": \"Xã hội\"}, {\"id\": \"C\", \"text\": \"Dân số\"}, {\"id\": \"D\", \"text\": \"Khách hàng\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(248, 6, 48, 'Môi trường tác động đến doanh nghiệp và ảnh hưởng mạnh nhất đến:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cơ hội thị trường cho doanh nghiệp\"}, {\"id\": \"B\", \"text\": \"Quyết định về chiến lược hoạt động của doanh nghiệp\"}, {\"id\": \"C\", \"text\": \"Đến phạm vi hoạt động của doanh nghiệp\"}, {\"id\": \"D\", \"text\": \"Đe dọa về doanh số của doanh nghiệp\"}]', NULL, 'B', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(249, 6, 49, 'Nghiên cứu yếu tố xã hội là cần thiết để doanh nghiệp:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Phân tích dự đoán sự thay đổi nhu cầu tiêu dùng\"}, {\"id\": \"B\", \"text\": \"Nhận ra sự thay đổi thói quen tiêu dùng\"}, {\"id\": \"C\", \"text\": \"Nhận ra những vấn đề xã hội quan tâm\"}, {\"id\": \"D\", \"text\": \"Ra quyết định kinh doanh\"}]', NULL, 'D', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(250, 6, 50, 'Các biện pháp nhà nước hỗ trợ doanh nghiệp đầu tư công nghệ mới là tác động của nhóm yếu tố:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tổng quát\"}, {\"id\": \"B\", \"text\": \"Ngành\"}, {\"id\": \"C\", \"text\": \"Chính trị – luật pháp\"}, {\"id\": \"D\", \"text\": \"Kinh tế\"}]', NULL, 'C', NULL, 0, '2026-10-08 02:44:40', '2026-10-08 02:44:40'),
(251, 7, 1, 'Phân tích hai thuộc tính của hàng hóa sức lao động. Tại sao nói hàng hóa sức lao động là hàng hóa đặc biệt? Nó khác gì so với hàng hóa thông thường?', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:51:30', '2026-10-08 02:51:30'),
(252, 7, 2, 'Trình bày nội dung và tác động của quy luật cạnh tranh trong nền kinh tế thị trường. Liên hệ với thực tiễn cạnh tranh của các doanh nghiệp Việt Nam trong bối cảnh hội nhập kinh tế quốc tế hiện nay.', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:51:30', '2026-10-08 02:51:30'),
(253, 7, 3, 'Một nhà tư bản đầu tư 1.000.000 USD để sản xuất, trong đó:\n\n· Tư liệu sản xuất (máy móc, thiết bị, nguyên nhiên vật liệu): 800.000 USD.\n· Số công nhân làm thuê được thu hút vào sản xuất: 400 người.\n· Trình độ bóc lột sức lao động (tỷ suất giá trị thặng dư): 200%.', 'essay', NULL, '[{\"id\": \"a\", \"content\": \"Hãy xác định giá trị mới do 1 công nhân tạo ra và khối lượng giá trị thặng dư mà nhà tư bản thu được.\"}, {\"id\": \"b\", \"content\": \"Nếu nhà tư bản tăng cường độ lao động lên 1,5 lần, tiền lương của công nhân không đổi. Hãy xác định tỷ suất giá trị thặng dư mới và khối lượng giá trị thặng dư mới thu được.\"}]', NULL, NULL, 0, '2026-10-08 02:51:30', '2026-10-08 02:51:30'),
(254, 8, 1, 'So sánh sự giống và khác nhau cơ bản giữa công thức lưu thông hàng hóa giản đơn (H - T - H) và công thức chung của tư bản (T - H - T\'). Từ đó, làm rõ mâu thuẫn của công thức chung của tư bản và điều kiện để tiền tệ chuyển hóa thành tư bản.', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:53:42', '2026-10-08 02:53:42'),
(255, 8, 2, 'Phân tích luận điểm sau của V.I. Lênin: \"Độc quyền sinh ra từ cạnh tranh tự do. Nhưng sự xuất hiện của độc quyền không thủ tiêu cạnh tranh. Trái lại, độc quyền làm cho cạnh tranh trở nên đa dạng, gay gắt hơn.\"\n    Hãy lấy ví dụ thực tế minh họa và đề xuất các biện pháp kiểm soát độc quyền trong nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam hiện nay.', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:53:42', '2026-10-08 02:53:42'),
(256, 8, 3, 'rong một doanh nghiệp sản xuất, nhà tư bản đầu tư lượng vốn ban đầu là 240.000 USD, trong đó chi phí tư bản bất biến (c) gấp 3 lần chi phí tư bản khả biến (v). Doanh nghiệp hiện đang thuê 400 công nhân làm việc, với tỷ suất giá trị thặng dư ($m\'$) đạt 200%.', 'essay', NULL, '[{\"id\": \"a\", \"content\": \"Hãy tính tiền lương của mỗi công nhân, tổng khối lượng giá trị thặng dư ($M$) và tổng giá trị của toàn bộ hàng hóa do doanh nghiệp tạo ra.\"}, {\"id\": \"b\", \"content\": \"Nếu nhà tư bản quyết định mở rộng sản xuất, nâng tổng tư bản đầu tư lên thành 360.000 USD và cải tiến kỹ thuật làm cấu tạo hữu cơ ($c/v$) tăng lên thành 8/1. Biết rằng tiền lương trả cho mỗi công nhân không đổi và tỷ suất giá trị thặng dư vẫn giữ nguyên 200%, hãy xác định số lượng công nhân mà doanh nghiệp cần sử dụng và khối lượng giá trị thặng dư thu được lúc này.\"}]', NULL, NULL, 0, '2026-10-08 02:53:42', '2026-10-08 02:53:42'),
(257, 10, 1, 'Trình bày phương pháp sản xuất giá trị thặng dư tuyệt đối và phương pháp sản xuất giá trị thặng dư tương đối dưới chủ nghĩa tư bản. Tại sao nói giá trị thặng dư siêu ngạch là hình thức biến tướng của giá trị thặng dư tương đối?', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:58:51', '2026-10-08 02:58:51'),
(258, 10, 2, 'Phân tích nội dung và tác dụng của quy luật giá trị trong nền kinh tế hàng hóa. Doanh nghiệp Việt Nam cần vận dụng quy luật này như thế nào để nâng cao năng lực cạnh tranh và thu được lợi nhuận trong điều kiện hội nhập kinh tế quốc tế hiện nay?', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-08 02:58:51', '2026-10-08 02:58:51'),
(259, 10, 3, 'Một xí nghiệp có 200 công nhân làm thuê. Ban đầu, ngày làm việc là 10 giờ, trong 1 giờ lao động mỗi công nhân tạo ra lượng giá trị mới là 6 USD. Tỷ suất giá trị thặng dư ($m\'$) hiện tại là 200%, tiền lương mỗi ngày của 1 công nhân là 20 USD.', 'essay', NULL, '[{\"id\": \"a\", \"content\": \"Xác định thời gian lao động tất yếu, thời gian lao động thặng dư và độ dài ngày lao động của xí nghiệp (xem xét tính hợp lý với dữ kiện đề bài). Tính tổng khối lượng giá trị thặng dư ($M$) mà nhà tư bản thu được trong 1 ngày từ 200 công nhân.\"}, {\"id\": \"b\", \"content\": \"Nếu nhà tư bản quyết định giảm thời gian của ngày lao động xuống còn 9 giờ nhưng tăng cường độ lao động lên 50%, đồng thời giữ nguyên tiền lương công nhân (giá trị sức lao động không đổi). Hãy xác định tỷ suất giá trị thặng dư mới ($m\'\'$) và khối lượng giá trị thặng dư mới ($M\'$) nhà tư bản thu được. Nhà tư bản đã sử dụng phương pháp bóc lột giá trị thặng dư nào?\"}]', NULL, NULL, 0, '2026-10-08 02:58:51', '2026-10-08 02:58:51'),
(274, 12, 1, 'Một số phần tử cơ hội, xét lại đang phủ nhận thuyết Mác – Lênin về sứ mệnh lịch sử của giai cấp công nhân, họ nhận định giai cấp công nhân ngày nay thế nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Đã “teo đi”, đã “tan biến” vào giai tầng xã hội khác\"}, {\"id\": \"B\", \"text\": \"Đã “phình lên”, đã “kết tinh” thành giai cấp công nhân hùng mạnh\"}, {\"id\": \"C\", \"text\": \"Đã trở thành giai cấp tư sản\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C đều sai\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(275, 12, 2, 'Thời đại ngày nay là thời đại của nền “văn minh trí tuệ”, của “kinh tế tri thức”, do vậy vai trò của tầng lớp nào ngày càng trở nên quan trọng?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giai cấp tư sản\"}, {\"id\": \"B\", \"text\": \"Tầng lớp trí thức\"}, {\"id\": \"C\", \"text\": \"Giai cấp nông dân\"}, {\"id\": \"D\", \"text\": \"Tiểu tư sản\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(276, 12, 3, 'Trong xã hội, trí thức được gọi là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giai cấp đặc biệt\"}, {\"id\": \"B\", \"text\": \"Giai cấp thuần nhất\"}, {\"id\": \"C\", \"text\": \"Tầng lớp xã hội đặc biệt và không thuần nhất\"}, {\"id\": \"D\", \"text\": \"Tầng lớp xã hội độc lập\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(277, 12, 4, 'Điều kiện tiên quyết để xây dựng thành công chủ nghĩa xã hội là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giữ vững và tăng cường sự lãnh đạo của Đảng Cộng sản\"}, {\"id\": \"B\", \"text\": \"Củng cố khối đại đoàn kết toàn dân\"}, {\"id\": \"C\", \"text\": \"Mở rộng hợp tác quốc tế\"}, {\"id\": \"D\", \"text\": \"Giữ vững độc lập dân tộc và định hướng XHCN\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(278, 12, 5, 'Cơ sở kinh tế của nhà nước xã hội chủ nghĩa là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chế độ công hữu về tư liệu sản xuất chủ yếu\"}, {\"id\": \"B\", \"text\": \"Chế độ tư hữu về tư liệu sản xuất\"}, {\"id\": \"C\", \"text\": \"Chế độ sở hữu hỗn hợp\"}, {\"id\": \"D\", \"text\": \"Kinh tế thị trường tự do\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(279, 12, 6, 'Bản chất tư tưởng - văn hóa của nền dân chủ XHCN lấy hệ tư tưởng nào làm nền tảng?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tư tưởng Hồ Chí Minh\"}, {\"id\": \"B\", \"text\": \"Chủ nghĩa Mác – Lênin\"}, {\"id\": \"C\", \"text\": \"Tư tưởng dân chủ tư sản\"}, {\"id\": \"D\", \"text\": \"Nho giáo và các tôn giáo lớn\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(280, 12, 7, 'Hình thức dân chủ nào là hình thức nhân dân trực tiếp thể hiện ý chí và nguyện vọng của mình?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Dân chủ trực tiếp\"}, {\"id\": \"B\", \"text\": \"Dân chủ đại diện\"}, {\"id\": \"C\", \"text\": \"Dân chủ gián tiếp\"}, {\"id\": \"D\", \"text\": \"Dân chủ ủy quyền\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(281, 12, 8, 'Chức năng cơ bản nhất của nhà nước xã hội chủ nghĩa là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chức năng trấn áp\"}, {\"id\": \"B\", \"text\": \"Chức năng tổ chức và xây dựng\"}, {\"id\": \"C\", \"text\": \"Chức năng đối ngoại\"}, {\"id\": \"D\", \"text\": \"Chức năng quản lý hành chính\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(282, 12, 9, 'Yếu tố nào giữ vai trò quyết định đối với sự biến đổi của cơ cấu xã hội – giai cấp?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cơ cấu kinh tế\"}, {\"id\": \"B\", \"text\": \"Cơ cấu chính trị\"}, {\"id\": \"C\", \"text\": \"Cơ cấu văn hóa\"}, {\"id\": \"D\", \"text\": \"Cơ cấu dân số\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(283, 12, 10, 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam gồm những lực lượng cơ bản nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Công nhân, nông dân và tư sản\"}, {\"id\": \"B\", \"text\": \"Công nhân, nông dân và tri thức\"}, {\"id\": \"C\", \"text\": \"Công nhân, nông dân và tiểu thương\"}, {\"id\": \"D\", \"text\": \"Công nhân, trí thức và doanh nhân\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(284, 12, 11, 'Trong thời kỳ quá độ lên CNXH ở Việt Nam, nội dung nào của liên minh giai cấp giữ vai trò quyết định nhất?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nội dung kinh tế\"}, {\"id\": \"B\", \"text\": \"Nội dung chính trị\"}, {\"id\": \"C\", \"text\": \"Nội dung văn hóa – xã hội\"}, {\"id\": \"D\", \"text\": \"Nội dung tư tưởng\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(285, 12, 12, 'Đặc trưng cơ bản về mặt dân tộc là cộng đồng người có chung:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Lãnh thổ, ngôn ngữ, phương thức sinh hoạt kinh tế\"}, {\"id\": \"B\", \"text\": \"Nét văn hóa và tâm lý dân tộc\"}, {\"id\": \"C\", \"text\": \"Sự quản lý của một nhà nước (đối với dân tộc - quốc gia)\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(286, 12, 13, 'Theo chủ nghĩa Mác – Lênin, tôn giáo là một hiện tượng xã hội mang tính:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Lịch sử\"}, {\"id\": \"B\", \"text\": \"Quần chúng\"}, {\"id\": \"C\", \"text\": \"Chính trị\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52');
INSERT INTO `exam_questions` (`id`, `exam_id`, `order`, `content`, `type`, `options`, `sub_questions`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`) VALUES
(287, 12, 14, 'Gia đình thực hiện chức năng cơ bản nào để duy trì sự tồn tại và phát triển của loài người?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tái sản xuất ra con người\"}, {\"id\": \"B\", \"text\": \"Nuôi dưỡng và giáo dục\"}, {\"id\": \"C\", \"text\": \"Thỏa mãn nhu cầu tâm sinh lý\"}, {\"id\": \"D\", \"text\": \"Quản lý kinh tế gia đình\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(288, 12, 15, 'Cơ sở xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội bao gồm:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cơ sở kinh tế - xã hội\"}, {\"id\": \"B\", \"text\": \"Cơ sở chính trị - xã hội\"}, {\"id\": \"C\", \"text\": \"Cơ sở văn hóa\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(289, 12, 16, 'Ưu điểm và hạn chế của tư tưởng xã hội chủ nghĩa không tưởng phê phán', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(290, 12, 17, 'Tại sao quá độ lên chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa ở Việt Nam là sự lựa chọn dứt khoát và đúng đắn?', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(291, 12, 18, 'Vị trí của gia đình trong xã hội', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 03:50:52', '2026-10-09 03:50:52'),
(292, 11, 1, 'Những nhà tư tưởng tiêu biểu của chủ nghĩa xã hội không tưởng phê phán đầu thế kỷ XIX?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Grắccơ Babớp, Xanh Ximông, Sáclơ Phuriê\"}, {\"id\": \"B\", \"text\": \"Xanh Ximông, Sáclơ Phuriê, G. Mably\"}, {\"id\": \"C\", \"text\": \"Xanh Ximông, Sáclơ Phuriê, Rôbớt Ôoen\"}, {\"id\": \"D\", \"text\": \"Xanh Ximông, Giăng Mêliê, Rôbớt Ôoen\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(293, 11, 2, 'Nhà tư tưởng xã hội chủ nghĩa nào đã tiến hành thực nghiệm xã hội cộng sản trong lòng xã hội tư bản?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xanh Ximông\"}, {\"id\": \"B\", \"text\": \"Sáclơ Phuriê\"}, {\"id\": \"C\", \"text\": \"Grắccơ Babớp\"}, {\"id\": \"D\", \"text\": \"Rôbớt Ôoen\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(294, 11, 3, 'Những yếu tố tư tưởng XHCN được xuất hiện từ khi nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chế độ tư bản chủ nghĩa ra đời\"}, {\"id\": \"B\", \"text\": \"Sự xuất hiện chế độ tư hữu, xuất hiện giai cấp thống trị và bóc lột\"}, {\"id\": \"C\", \"text\": \"Sự xuất hiện giai cấp công nhân\"}, {\"id\": \"D\", \"text\": \"Thời cộng sản nguyên thủy\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(295, 11, 4, 'Đối tượng nghiên cứu của chủ nghĩa xã hội khoa học là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Là những quy luật và tính quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển hình thái kinh tế - xã hội cộng sản chủ nghĩa.\"}, {\"id\": \"B\", \"text\": \"Là những quy luật kinh tế hình thành, phát triển và hoàn thiện của các hình thái kinh tế - xã hội.\"}, {\"id\": \"C\", \"text\": \"Là những quy luật và tính quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển hình thái kinh tế - xã hội tư bản chủ nghĩa.\"}, {\"id\": \"D\", \"text\": \"Cả a, b và c.\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(296, 11, 5, 'Hạn chế của chủ nghĩa xã hội không tưởng trước Mác là…', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chưa thấy được sứ mệnh lịch sử của giai cấp công nhân\"}, {\"id\": \"B\", \"text\": \"Chưa chỉ ra được con đường đấu tranh cách mạng\"}, {\"id\": \"C\", \"text\": \"Không luận chứng được một cách khoa học về bản chất của chủ nghĩa tư bản và quy luật phát triển của chủ nghĩa tư bản\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C.\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(297, 11, 6, 'Nguồn gốc lý luận trực tiếp ra đời chủ nghĩa xã hội khoa học là…', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Triết học cổ điển Đức\"}, {\"id\": \"B\", \"text\": \"Kinh tế chính trị học cổ điển Anh\"}, {\"id\": \"C\", \"text\": \"Chủ nghĩa xã hội không tưởng – phê phán\"}, {\"id\": \"D\", \"text\": \"Cả a, b và c\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(298, 11, 7, 'Chọn phương án đúng nhất: Chủ nghĩa Mác – Lê-nin được cấu thành từ ba bộ phận lý luận cơ bản là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Chủ nghĩa xã hội không tưởng, Triết học Mác – Lê-nin, Kinh tế chính trị học Mác – Lê-nin\"}, {\"id\": \"B\", \"text\": \"Triết học Mác – Lê-nin, Kinh tế chính trị học Mác – Lê-nin, Chủ nghĩa xã hội khoa học.\"}, {\"id\": \"C\", \"text\": \"Kinh tế chính trị học, Chủ nghĩa xã hội không tưởng, Triết học Mác – Lê-nin\"}, {\"id\": \"D\", \"text\": \"Triết học cổ điển Đức, Kinh tế chính trị học cổ điển Anh, Chủ nghĩa xã hội không tưởng Pháp\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(299, 11, 8, 'Nhà nước nào mà Lê-nin gọi là “nửa nhà nước”?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Nhà nước chủ nô\"}, {\"id\": \"B\", \"text\": \"Nhà nước tư sản\"}, {\"id\": \"C\", \"text\": \"Nhà nước phong kiến\"}, {\"id\": \"D\", \"text\": \"Nhà nước XHCN\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(300, 11, 9, 'Tác phẩm đánh dấu sự ra đời của chủ nghĩa xã hội khoa học là tác phẩm…', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tư bản\"}, {\"id\": \"B\", \"text\": \"Chống Đuyrinh\"}, {\"id\": \"C\", \"text\": \"Tuyên ngôn của Đảng cộng sản\"}, {\"id\": \"D\", \"text\": \"Biện chứng của tự nhiên\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(301, 11, 10, 'Chọn ý đúng trong các ý sau về nhà nước…', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Đến giai đoạn cao của xã hội CSCN nhà nước tự tiêu vong\"}, {\"id\": \"B\", \"text\": \"Đến giai đoạn cao của xã hội CSCN nhà nước vẫn còn là nhà nước kiểu mới\"}, {\"id\": \"C\", \"text\": \"Đến giai đoạn cao của xã hội CSCN nhà nước vẫn sẽ còn duy trì\"}, {\"id\": \"D\", \"text\": \"Đến giai đoạn cao của xã hội CSCN nhà nước là nửa nhà nước\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(302, 11, 11, 'Nguyên tắc phân phối trong giai đoạn cao của hình thái CSCN là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Làm theo năng lực, hưởng theo lao động\"}, {\"id\": \"B\", \"text\": \"Làm theo năng lực, hưởng theo nhu cầu\"}, {\"id\": \"C\", \"text\": \"Làm ít hưởng ít, làm nhiều hưởng nhiều\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều sai.\"}]', NULL, 'B', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(303, 11, 12, 'Những nguyên tắc cơ bản của chủ nghĩa Mác – Lê-nin trong việc giải quyết vấn đề dân tộc là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Các dân tộc hoàn toàn bình đẳng\"}, {\"id\": \"B\", \"text\": \"Các dân tộc được quyền tự quyết\"}, {\"id\": \"C\", \"text\": \"Liên hiệp công nhân tất cả các dân tộc\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều đúng\"}]', NULL, 'D', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(304, 11, 13, 'Chọn phương án đúng nhất: Sự ra đời và phát triển của giai cấp công nhân hiện đại gắn liền với sự ra đời và phát triển của:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sản xuất thủ công\"}, {\"id\": \"B\", \"text\": \"Công trường thủ công\"}, {\"id\": \"C\", \"text\": \"Nền đại công nghiệp tư bản chủ nghĩa\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C đều sai.\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(305, 11, 14, 'Nội dung sứ mệnh lịch sử của giai cấp công nhân là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Xóa bỏ chế độ chiếm hữu nô lệ, xây dựng chế độ phong kiến\"}, {\"id\": \"B\", \"text\": \"Xóa bỏ chế độ phong kiến, xây dựng chế độ tư bản chủ nghĩa\"}, {\"id\": \"C\", \"text\": \"Xóa bỏ chế độ tư bản chủ nghĩa, xây dựng chế độ chủ nghĩa xã hội, chủ nghĩa cộng sản\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C đều sai\"}]', NULL, 'C', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(306, 11, 15, 'Trong chủ nghĩa tư bản, giai cấp công nhân đại biểu cho phương thức sản xuất:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tiên tiến\"}, {\"id\": \"B\", \"text\": \"Lạc hậu\"}, {\"id\": \"C\", \"text\": \"Manh mún\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'A', NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(307, 11, 16, 'Phân tích những đặc trưng cơ bản của chủ nghĩa xã hội, liên hệ với thực tiễn chủ nghĩa xã hội ở Việt Nam', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(308, 11, 17, 'Phân tích nội dung Cương lĩnh Dân tộc của V.I.Lênin, liên hệ với chính sách dân tộc của Đảng và Nhà nước Việt Nam trong giai đoạn hiện nay', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 03:53:16', '2026-10-09 03:53:16'),
(309, 14, 1, 'Tiền đề kinh tế – xã hội dẫn đến sự ra đời của chủ nghĩa xã hội khoa học là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sự phát triển của lực lượng sản xuất trong nền đại công nghiệp tư bản chủ nghĩa\"}, {\"id\": \"B\", \"text\": \"Sự trưởng thành của giai cấp công nhân hiện đại\"}, {\"id\": \"C\", \"text\": \"Phong trào đấu tranh của giai cấp công nhân chống lại giai cấp tư sản phát triển mạnh mẽ\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(310, 14, 2, 'Sự biến đổi của cơ cấu xã hội - giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội gắn liền với sự biến đổi của yếu tố nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Cơ cấu kinh tế\"}, {\"id\": \"B\", \"text\": \"Cơ cấu chính trị\"}, {\"id\": \"C\", \"text\": \"Cơ cấu tư tưởng\"}, {\"id\": \"D\", \"text\": \"Cơ cấu dân cư\"}]', NULL, 'A', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(311, 14, 3, 'Khái niệm nào dùng để chỉ cộng đồng người ổn định làm thành nhân dân một nước, có lãnh thổ riêng, nền kinh tế thống nhất, ngôn ngữ chung và có ý thức về văn hóa, lịch sử của mình?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Thị tộc\"}, {\"id\": \"B\", \"text\": \"Bộ lạc\"}, {\"id\": \"C\", \"text\": \"Bộ tộc\"}, {\"id\": \"D\", \"text\": \"Dân tộc (theo nghĩa quốc gia)\"}]', NULL, 'D', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(312, 14, 4, 'Tôn giáo có mấy bản chất cơ bản theo quan điểm của chủ nghĩa Mác - Lênin?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tính lịch sử\"}, {\"id\": \"B\", \"text\": \"Tính quần chúng\"}, {\"id\": \"C\", \"text\": \"Tính chính trị\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(313, 14, 5, 'Yếu tố nào là cơ sở để hình thành gia đình trong thời kỳ quá độ lên CNXH?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hôn nhân tự nguyện, tiến bộ\"}, {\"id\": \"B\", \"text\": \"Quan tế giữa vợ và chồng, cha mẹ và con cái dựa trên sự bình đẳng\"}, {\"id\": \"C\", \"text\": \"Chế độ công hữu về tư liệu sản xuất\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(314, 14, 6, 'Điền vào chỗ trống: “Dân chủ XHCN vừa mang bản chất giai cấp công nhân, vừa có tính nhân dân rộng rãi và tính ....... sâu sắc.”', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giai cấp\"}, {\"id\": \"B\", \"text\": \"Dân tộc\"}, {\"id\": \"C\", \"text\": \"Nhân đạo\"}, {\"id\": \"D\", \"text\": \"Xã hội\"}]', NULL, 'B', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(315, 14, 7, 'Trong các hình thức dân chủ dưới đây, hình thức nào cho phép cử tri trực tiếp bầu ra đại biểu đại diện cho quyền lực của mình?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Dân chủ trực tiếp\"}, {\"id\": \"B\", \"text\": \"Dân chủ đại diện (gián tiếp)\"}, {\"id\": \"C\", \"text\": \"Dân chủ tham vấn\"}, {\"id\": \"D\", \"text\": \"Cả A và B\"}]', NULL, 'B', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(316, 14, 8, 'Điểm khác biệt cơ bản giữa nhà nước XHCN với các nhà nước bóc lột trong lịch sử là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Đặt dưới sự lãnh đạo của Đảng Cộng sản, phục vụ lợi ích của đa số nhân dân lao động\"}, {\"id\": \"B\", \"text\": \"Có bộ máy công an, quân đội mạnh mẽ\"}, {\"id\": \"C\", \"text\": \"Sử dụng pháp luật để quản lý xã hội\"}, {\"id\": \"D\", \"text\": \"Coi trọng phát triển kinh tế\"}]', NULL, 'A', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(317, 14, 9, 'Nhóm xã hội nào được coi là lực lượng lao động sáng tạo đặc biệt, đóng vai trò quan trọng trong việc nâng cao dân trí và phát triển lực lượng sản xuất hiện đại?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giai cấp nông dân\"}, {\"id\": \"B\", \"text\": \"Giai cấp công nhân\"}, {\"id\": \"C\", \"text\": \"Tầng lớp trí thức\"}, {\"id\": \"D\", \"text\": \"Đội ngũ doanh nhân\"}]', NULL, 'C', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(318, 14, 10, 'Nguyên tắc căn bản nhất trong giải quyết vấn đề dân tộc theo chủ nghĩa Mác – Lênin là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Các dân tộc hoàn toàn bình đẳng\"}, {\"id\": \"B\", \"text\": \"Các dân tộc được quyền tự quyết\"}, {\"id\": \"C\", \"text\": \"Liên hiệp công nhân tất cả các dân tộc\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(319, 14, 11, 'Trong các chức năng của gia đình, chức năng nào quyết định trực tiếp đến sự tồn tại và phát triển của xã hội?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Tái sản xuất ra con người\"}, {\"id\": \"B\", \"text\": \"Nuôi dưỡng, giáo dục\"}, {\"id\": \"C\", \"text\": \"Thỏa mãn nhu cầu tâm sinh lý\"}, {\"id\": \"D\", \"text\": \"Kinh tế và tổ chức tiêu dùng\"}]', NULL, 'A', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(320, 14, 12, 'Nguyên nhân kinh tế - xã hội nào dẫn đến sự tồn tại của tín ngưỡng, tôn giáo trong thời kỳ quá độ lên CNXH?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Do trình độ nhận thức của người dân còn hạn chế\"}, {\"id\": \"B\", \"text\": \"Do sự tác động của tâm lý, thói quen lâu đời\"}, {\"id\": \"C\", \"text\": \"Do còn nhiều thành phần kinh tế, còn sự phân hóa giàu nghèo và bất bình đẳng xã hội\"}, {\"id\": \"D\", \"text\": \"Do các thế lực thù địch lợi dụng tôn giáo\"}]', NULL, 'C', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(321, 14, 13, 'Cương lĩnh chính trị đầu tiên của Đảng ta (2/1930) đã xác định con đường phát triển của cách mạng Việt Nam là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Làm cách mạng tư sản dân quyền và thổ địa cách mạng để đi tới xã hội tư bản\"}, {\"id\": \"B\", \"text\": \"Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản\"}, {\"id\": \"C\", \"text\": \"Tiến thẳng lên chủ nghĩa xã hội không qua giai đoạn phát triển tư bản\"}, {\"id\": \"D\", \"text\": \"Xây dựng nền kinh tế thị trường định hướng XHCN\"}]', NULL, 'B', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(322, 14, 14, 'Đặc trưng nào thể hiện bản chất tư tưởng - văn hóa của nền dân chủ XHCN?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Lấy chủ nghĩa Mác – Lênin làm nền tảng tinh thần xã hội\"}, {\"id\": \"B\", \"text\": \"Tiếp thu có chọn lọc toàn bộ văn hóa phương Tây\"}, {\"id\": \"C\", \"text\": \"Duy trì các phong tục tập quán cổ truyền\"}, {\"id\": \"D\", \"text\": \"Đặt niềm tin vào các tín ngưỡng dân gian\"}]', NULL, 'A', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(323, 14, 15, 'Yếu tố nào đóng vai trò là động lực chủ yếu của sự phát triển đất nước trong thời kỳ quá độ lên CNXH ở Việt Nam?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Sự ủng hộ của quốc tế\"}, {\"id\": \"B\", \"text\": \"Đại đoàn kết toàn dân tộc trên cơ sở liên minh công nhân - nông dân - trí thức\"}, {\"id\": \"C\", \"text\": \"Sự phát triển của các doanh nghiệp tư nhân\"}, {\"id\": \"D\", \"text\": \"Đổi mới công nghệ sản xuất\"}]', NULL, 'B', NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(324, 14, 16, 'Lý do giai cấp công nhân có sứ mệnh lịch sử lãnh đạo cách mạng xóa bỏ chế độ bóc lột, xây dựng xã hội cộng sản chủ nghĩa', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(325, 14, 17, 'Vận dụng Cương lĩnh dân tộc của V.I. Lênin để làm rõ chủ trương của Đảng tại Đại hội XIII', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(326, 14, 18, 'Phân tích các chức năng cơ bản của gia đình', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 04:02:37', '2026-10-09 04:02:37'),
(327, 15, 1, 'Trong chủ nghĩa tư bản, giai cấp công nhân có mấy đặc trưng cơ bản?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"2\"}, {\"id\": \"B\", \"text\": \"3\"}, {\"id\": \"C\", \"text\": \"4\"}, {\"id\": \"D\", \"text\": \"5\"}]', NULL, 'A', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(328, 15, 2, 'Một số thuật ngữ khác nhau được C.Mác và Ph.Ănghen sử dụng có ý nghĩa tương đồng với khái niệm giai cấp công nhân:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Giai cấp vô sản\"}, {\"id\": \"B\", \"text\": \"Giai cấp công nhân hiện đại\"}, {\"id\": \"C\", \"text\": \"Giai cấp công nhân đại công nghiệp\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(329, 15, 3, 'Nguyên nhân nhận thức cho sự tồn tại của tín ngưỡng, tôn giáo là', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Con người sợ sệt thần linh\"}, {\"id\": \"B\", \"text\": \"Con người chưa nhận thức và chế ngự được các hiện tượng tự nhiên, xã hội\"}, {\"id\": \"C\", \"text\": \"Con người huy động sức mạnh của thần linh\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều sai\"}]', NULL, 'B', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(330, 15, 4, 'Cách sắp xếp nào sau đây đúng về sự xuất hiện của các tộc người trong lịch sử?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Thị tộc, bộ lạc, bộ tộc, dân tộc\"}, {\"id\": \"B\", \"text\": \"Bộ tộc, bộ lạc, thị tộc, dân tộc\"}, {\"id\": \"C\", \"text\": \"Bộ lạc, thị tộc, bộ tộc, dân tộc\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều sai\"}]', NULL, 'A', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(331, 15, 5, 'Dân tộc ở Châu Á hình thành khi nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Khi chủ nghĩa tư bản hình thành và phát triển\"}, {\"id\": \"B\", \"text\": \"Khi cộng đồng hợp sức chống thiên tai và giặc ngoại xâm\"}, {\"id\": \"C\", \"text\": \"Khi ý thức dân tộc trỗi dậy\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều đúng\"}]', NULL, 'B', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(332, 15, 6, 'Một trong những vai trò của gia đình', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Gia đình là cội nguồn của nhân cách\"}, {\"id\": \"B\", \"text\": \"Gia đình là nơi nuôi dưỡng tình cảm và lý trí\"}, {\"id\": \"C\", \"text\": \"Gia đình là tế bào của xã hội\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều đúng\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(333, 15, 7, 'Phương pháp luận chung nhất của chủ nghĩa xã hội khoa học là...', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"CNDVBC và CNDVLS\"}, {\"id\": \"B\", \"text\": \"Lôgic và lịch sử\"}, {\"id\": \"C\", \"text\": \"Thống kê và so sánh\"}, {\"id\": \"D\", \"text\": \"Phân tích và so sánh\"}]', NULL, 'A', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(334, 15, 8, 'Phương pháp có tính đặc thù của chủ nghĩa xã hội khoa học là...?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Logic và lịch sử\"}, {\"id\": \"B\", \"text\": \"Thống kê và so sánh\"}, {\"id\": \"C\", \"text\": \"Phân tích và so sánh\"}, {\"id\": \"D\", \"text\": \"Phương pháp khảo sát và phân tích về mặt chính trị - xã hội dựa trên các điều kiện kinh tế - xã hội cụ thể\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(335, 15, 9, 'V.I.Lênin chia PTSX CSCN thành mấy giai đoạn?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Hai giai đoạn: CNXH và CNCS\"}, {\"id\": \"B\", \"text\": \"Ba giai đoạn: TKQĐ, CNXH và CNCS\"}, {\"id\": \"C\", \"text\": \"Bốn giai đoạn TKQĐ, CNXH, CNXH phát triển và CNCS\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều sai\"}]', NULL, 'B', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(336, 15, 10, 'Thời kỳ quá độ lên CNXH là tất yếu đối với:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Các nước bỏ qua CNTB lên CNXH\"}, {\"id\": \"B\", \"text\": \"Các nước TBCN kém phát triển lên CNXH\"}, {\"id\": \"C\", \"text\": \"Tất cả các nước xây dựng CNXH\"}, {\"id\": \"D\", \"text\": \"Các nước TBCN phát triển lên CNXH\"}]', NULL, 'C', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(337, 15, 11, 'Thực chất của TKQĐ lên CNXH là gì?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Là cuộc cải biến cách mạng về kinh tế\"}, {\"id\": \"B\", \"text\": \"Là cuộc cải biến cách mạng về chính trị\"}, {\"id\": \"C\", \"text\": \"Là cuộc cải biến cách mạng về tư tưởng và văn hoá\"}, {\"id\": \"D\", \"text\": \"Tất cả các câu đều đúng\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(338, 15, 12, 'Thời kỳ quá độ lên chủ nghĩa xã hội trên phạm vi cả nước ta bắt đầu từ khi nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"8/1945\"}, {\"id\": \"B\", \"text\": \"5/1954\"}, {\"id\": \"C\", \"text\": \"4/1975\"}, {\"id\": \"D\", \"text\": \"2/1930\"}]', NULL, 'C', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(339, 15, 13, 'Nền kinh tế tri thức được xem là:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Một phương thức sản xuất mới\"}, {\"id\": \"B\", \"text\": \"Một hình thái kinh tế - xã hội mới\"}, {\"id\": \"C\", \"text\": \"Một giai đoạn mới của CNTB hiện đại\"}, {\"id\": \"D\", \"text\": \"Một nấc thang phát triển của lực lượng sản xuất\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(340, 15, 14, 'So với các nền dân chủ trước đây, dân chủ xã hội chủ nghĩa có điểm khác biệt cơ bản nào?', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Không còn mang tính giai cấp.\"}, {\"id\": \"B\", \"text\": \"Là nền dân chủ phi lịch sử.\"}, {\"id\": \"C\", \"text\": \"Là nền dân chủ thuần tuý.\"}, {\"id\": \"D\", \"text\": \"Là nền dân chủ rộng rãi cho giai cấp công nhân và nhân dân lao động.\"}]', NULL, 'D', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(341, 15, 15, 'Giai cấp công nhân là tập đoàn người lao động sử dụng công cụ sản xuất có tính:', 'multiple_choice', '[{\"id\": \"A\", \"text\": \"Thủ công\"}, {\"id\": \"B\", \"text\": \"Công nghiệp\"}, {\"id\": \"C\", \"text\": \"Thô sơ\"}, {\"id\": \"D\", \"text\": \"Cả A, B, C\"}]', NULL, 'B', NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(342, 15, 16, 'Trình bày đặc điểm của giai cấp công nhân hiện nay', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(343, 15, 17, 'Trình bày chính sách tôn giáo của Đảng, Nhà nước Việt Nam hiện nay', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34'),
(344, 15, 18, 'Tại sao quy mô gia đình ngày nay (gia đình hạt nhân) tồn tại xu hướng thu nhỏ hơn so với quy mô gia đình truyền thống trước kia?', 'essay', NULL, '[]', NULL, NULL, 0, '2026-10-09 06:45:34', '2026-10-09 06:45:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashcard_cards`
--

CREATE TABLE `flashcard_cards` (
  `id` bigint UNSIGNED NOT NULL,
  `deck_id` bigint UNSIGNED NOT NULL,
  `front` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `back` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `flashcard_cards`
--

INSERT INTO `flashcard_cards` (`id`, `deck_id`, `front`, `back`, `subject`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Vật chất là gì? (Định nghĩa Lênin)', 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác.', 'Triết học', 1, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(2, 1, 'Ý thức là gì theo quan điểm triết học Mác-Lênin?', 'Ý thức là sự phản ánh hiện thực khách quan vào bộ óc con người, là hình ảnh chủ quan của thế giới khách quan. Ý thức có bản chất là một hình thức phản ánh đặc biệt — phản ánh có tính năng động, sáng tạo.', 'Triết học', 2, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(3, 1, 'Quy luật mâu thuẫn là gì?', 'Quy luật mâu thuẫn (quy luật thống nhất và đấu tranh của các mặt đối lập) là hạt nhân của phép biện chứng, chỉ ra nguồn gốc, động lực của sự vận động và phát triển.', 'Triết học', 3, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(4, 1, 'Phép biện chứng duy vật gồm những quy luật cơ bản nào?', '3 quy luật cơ bản:\n1. Quy luật mâu thuẫn\n2. Quy luật lượng - chất\n3. Quy luật phủ định của phủ định', 'Triết học', 4, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(5, 1, 'Thực tiễn là gì? Vai trò của thực tiễn với nhận thức?', 'Thực tiễn là toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội của con người. Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của nhận thức.', 'Triết học', 5, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(6, 2, 'Đảng Cộng sản Việt Nam thành lập ngày tháng năm nào?', '3/2/1930 — Đảng Cộng sản Việt Nam được thành lập tại Hội nghị hợp nhất các tổ chức cộng sản ở Hương Cảng (Trung Quốc) dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc.', 'Lịch sử Đảng', 1, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(7, 2, 'Cách mạng tháng Tám 1945 thành công vào ngày nào?', 'Ngày 19/8/1945 — Nhân dân Hà Nội giành chính quyền. Ngày 2/9/1945 — Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập.', 'Lịch sử Đảng', 2, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(8, 2, 'Đại hội Đảng lần thứ VI (1986) có ý nghĩa gì?', 'Đại hội VI (12/1986) là mốc mở đầu công cuộc Đổi mới toàn diện, chuyển từ kế hoạch hóa tập trung sang kinh tế thị trường có sự quản lý của Nhà nước.', 'Lịch sử Đảng', 3, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(9, 3, 'Co giãn của cầu theo giá (PED) là gì?', 'PED đo lường mức độ phản ứng của lượng cầu khi giá thay đổi.\nPED = %ΔQd / %ΔP\n• |PED| > 1: Cầu co giãn nhiều\n• |PED| < 1: Cầu co giãn ít', 'Kinh tế vi mô', 1, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(10, 3, 'Chi phí cơ hội là gì?', 'Chi phí cơ hội là giá trị của phương án tốt nhất bị từ bỏ khi đưa ra một quyết định lựa chọn.', 'Kinh tế vi mô', 2, '2026-10-08 02:11:53', '2026-10-08 02:11:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashcard_decks`
--

CREATE TABLE `flashcard_decks` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1B3A6B',
  `visibility` enum('public','private') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'private',
  `owner_type` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `likes` int UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `flashcard_decks`
--

INSERT INTO `flashcard_decks` (`id`, `name`, `subject`, `icon`, `color`, `visibility`, `owner_type`, `created_by`, `status`, `likes`, `created_at`, `updated_at`) VALUES
(1, 'Triết học Mác-Lênin', 'Triết học', '', '#1B3A6B', 'public', 'admin', 1, 'published', 0, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(2, 'Lịch sử Đảng', 'Lịch sử Đảng', '', '#c0392b', 'public', 'admin', 1, 'published', 0, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(3, 'Kinh tế vi mô - Ôn thi cuối kỳ', 'Kinh tế vi mô', '', '#16a34a', 'public', 'user', 2, 'published', 142, '2026-10-08 02:11:53', '2026-10-08 02:11:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `freemium_usages`
--

CREATE TABLE `freemium_usages` (
  `id` bigint UNSIGNED NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feature` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `freemium_usages`
--

INSERT INTO `freemium_usages` (`id`, `ip_address`, `device_id`, `feature`, `used_count`, `last_used_at`, `created_at`, `updated_at`) VALUES
(1, '127.0.0.1', '52dbe3fdeda38d369ca52be0e9c7562d', 'document', 2, '2026-10-08 03:22:26', '2026-10-08 03:12:38', '2026-10-08 03:22:26'),
(2, '127.0.0.1', '52dbe3fdeda38d369ca52be0e9c7562d', 'exam', 2, '2026-10-08 03:51:55', '2026-10-08 03:51:38', '2026-10-08 03:51:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `likeable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `likeable_id` bigint UNSIGNED NOT NULL,
  `is_liked` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `likeable_type`, `likeable_id`, `is_liked`, `created_at`, `updated_at`) VALUES
(38, 5, 'Document', 3, 1, '2026-10-08 10:01:32', '2026-10-08 10:01:32'),
(68, 5, 'Document', 5, 0, '2026-10-08 10:46:51', '2026-10-08 10:46:51'),
(70, 5, 'FlashcardDeck', 1, 0, '2026-10-08 10:48:32', '2026-10-08 10:48:32'),
(74, 5, 'FlashcardDeck', 2, 0, '2026-10-08 10:56:43', '2026-10-08 10:56:43'),
(75, 2, 'Document', 3, 1, '2026-10-08 10:56:58', '2026-10-08 10:56:58'),
(77, 6, 'Document', 5, 1, '2026-10-08 11:19:53', '2026-10-08 11:19:53'),
(79, 6, 'Document', 4, 0, '2026-10-08 11:20:05', '2026-10-08 11:20:05'),
(82, 2, 'Exam', 7, 1, '2026-10-08 11:20:44', '2026-10-08 11:20:44'),
(84, 2, 'Exam', 8, 1, '2026-10-08 11:20:50', '2026-10-08 11:20:50'),
(93, 2, 'Document', 5, 1, '2026-10-08 21:49:57', '2026-10-08 21:49:57'),
(94, 2, 'Document', 4, 1, '2026-10-08 21:49:59', '2026-10-08 21:49:59'),
(95, 2, 'Document', 1, 1, '2026-10-08 22:03:43', '2026-10-08 22:03:43'),
(96, 2, 'App\\Models\\Document', 5, 1, '2026-10-09 06:51:35', '2026-10-09 06:51:35'),
(97, 2, 'App\\Models\\Document', 4, 1, '2026-10-09 06:51:36', '2026-10-09 06:51:36'),
(98, 5, 'App\\Models\\Document', 5, 1, '2026-10-09 06:52:23', '2026-10-09 06:52:23'),
(99, 5, 'App\\Models\\Exam', 8, 1, '2026-10-09 06:52:47', '2026-10-09 06:52:47'),
(100, 5, 'App\\Models\\Exam', 15, 1, '2026-10-09 06:52:52', '2026-10-09 06:52:52'),
(101, 2, 'App\\Models\\Exam', 10, 1, '2026-10-09 07:26:01', '2026-10-09 07:26:01'),
(102, 2, 'App\\Models\\Exam', 6, 1, '2026-10-09 07:26:03', '2026-10-09 07:26:03'),
(103, 2, 'App\\Models\\Exam', 4, 1, '2026-10-09 07:26:06', '2026-10-09 07:26:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2024_01_01_000001_add_role_school_to_users_table', 1),
(6, '2024_01_01_000002_create_categories_table', 1),
(7, '2024_01_01_000003_create_exams_table', 1),
(8, '2024_01_01_000004_create_questions_table', 1),
(9, '2024_01_01_000005_create_essay_questions_table', 1),
(10, '2024_01_01_000006_create_flashcard_decks_table', 1),
(11, '2024_01_01_000007_create_flashcard_cards_table', 1),
(12, '2024_01_02_000001_add_free_uses_to_users_table', 1),
(13, '2024_01_03_000001_rename_exams_to_documents_create_new_exams', 1),
(14, '2024_01_03_000002_update_questions_foreign_key_to_documents', 1),
(15, '2024_01_04_000001_create_subjects_table', 1),
(16, '2024_01_05_000001_update_exams_add_subject_create_exam_questions', 1),
(17, '2024_01_05_000002_drop_difficulty_from_exams', 1),
(18, '2024_01_05_000003_add_chapter_to_essay_questions', 1),
(19, '2026_10_07_154734_create_subscriptions_table', 1),
(20, '2026_10_07_154755_create_freemium_usages_table', 1),
(21, '2026_10_07_154814_create_payment_transactions_table', 1),
(22, '2026_10_07_174204_create_comments_table', 1),
(23, '2026_10_07_174208_create_likes_table', 1),
(24, '2026_10_07_184629_create_user_exam_submissions_table', 1),
(25, '2026_10_07_184633_create_user_learning_streaks_table', 1),
(26, '2026_10_07_184637_add_leaderboard_fields_to_users_table', 1),
(27, '2026_10_08_000001_create_user_achievements_table', 1),
(28, '2026_10_08_010742_add_admin_role_to_users_table', 1),
(29, '2026_10_08_020000_create_user_document_submissions_table', 1),
(30, '2026_10_08_061924_add_type_column_to_exam_questions', 1),
(31, '2026_10_08_063205_add_essay_scenario_counts_to_exams', 1),
(32, '2026_10_08_064140_fix_freemium_usages_unique_constraint', 1),
(33, '2026_10_08_064749_populate_exam_questions_order', 1),
(34, '2026_10_08_080948_update_payment_transactions_add_expired_status', 1),
(35, '2026_10_08_085933_drop_subject_and_category_id_from_exams_table', 1),
(37, '2026_10_08_091038_drop_subject_and_category_id_from_essay_questions_table', 2),
(38, '2026_10_08_100519_increase_essay_questions_title_length', 3),
(40, '2026_10_09_update_subscriptions_plan_enum', 4),
(41, '2026_10_08_180612_create_user_exam_attempts_table', 5),
(42, '2026_10_09_160000_update_payment_transactions_plan_enum', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `reference_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `plan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjects` json DEFAULT NULL,
  `status` enum('pending','success','failed','expired') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sepay_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_transactions`
--

INSERT INTO `payment_transactions` (`id`, `user_id`, `reference_code`, `amount`, `plan`, `subjects`, `status`, `sepay_response`, `created_at`, `updated_at`) VALUES
(2, 5, 'LHYvjgmMDUtAjimry', 19000, '1subject', '[]', 'expired', NULL, '2026-10-08 08:14:10', '2026-10-08 08:34:09'),
(3, 5, 'LHfWorBmhdDwCSZ09', 19000, '1subject', '[]', 'success', '{\"id\": 88198395, \"code\": null, \"content\": \"LHfWorBmhdDwCSZ09 FT26282635408201 k2PZY3PA/331848\", \"gateway\": \"MBBank\", \"subAccount\": null, \"accumulated\": 0, \"description\": \"BankAPINotify LHfWorBmhdDwCSZ09 FT26282635408201 k2PZY3PA/331848\", \"transferType\": \"in\", \"accountNumber\": \"0772052220\", \"referenceCode\": \"FT26282260656229\", \"transferAmount\": 19000, \"transactionDate\": \"2026-10-08 22:36:00\"}', '2026-10-08 08:34:09', '2026-10-08 08:37:32'),
(4, 5, 'LHT6L1RUEw2tVGm6W', 19000, '1subject', '[]', 'pending', NULL, '2026-10-08 08:47:16', '2026-10-08 08:47:16'),
(5, 2, 'LHQVrerxuhtg1DDAl', 19000, '1subject', '[]', 'success', '{\"id\": 88466419, \"code\": null, \"content\": \"LHQVrerxuhtg1DDAl FT26282758409114 k2YJQVQY/061089\", \"gateway\": \"MBBank\", \"subAccount\": null, \"accumulated\": 0, \"description\": \"BankAPINotify LHQVrerxuhtg1DDAl FT26282758409114 k2YJQVQY/061089\", \"transferType\": \"in\", \"accountNumber\": \"0772052220\", \"referenceCode\": \"FT26282320242802\", \"transferAmount\": 19000, \"transactionDate\": \"2026-10-09 21:28:00\"}', '2026-10-09 07:27:16', '2026-10-09 07:27:55'),
(6, 2, 'LH4ROqDh472AVQdEK', 19000, '1subject', '[]', 'success', '{\"id\": 88467928, \"code\": null, \"content\": \"LH4ROqDh472AVQdEK FT26282529901438 k2YJJ5HB/103065\", \"gateway\": \"MBBank\", \"subAccount\": null, \"accumulated\": 0, \"description\": \"BankAPINotify LH4ROqDh472AVQdEK FT26282529901438 k2YJJ5HB/103065\", \"transferType\": \"in\", \"accountNumber\": \"0772052220\", \"referenceCode\": \"FT26282736166256\", \"transferAmount\": 19000, \"transactionDate\": \"2026-10-09 21:34:00\"}', '2026-10-09 07:34:15', '2026-10-09 07:39:39'),
(7, 2, 'LHnXdCXMa0CRM9APJ', 19000, '1subject', '[]', 'pending', NULL, '2026-10-09 07:39:21', '2026-10-09 07:39:21'),
(8, 7, 'LH1bnfqC6Bua1Uzcz', 19000, '1subject', '[7]', 'success', '{\"id\": 88475868, \"code\": null, \"content\": \"LH1bnfqC6Bua1Uzcz FT26283070308173 k2YJUTMP/316738\", \"gateway\": \"MBBank\", \"subAccount\": null, \"accumulated\": 0, \"description\": \"BankAPINotify LH1bnfqC6Bua1Uzcz FT26283070308173 k2YJUTMP/316738\", \"transferType\": \"in\", \"accountNumber\": \"0772052220\", \"referenceCode\": \"FT26282788724102\", \"transferAmount\": 19000, \"transactionDate\": \"2026-10-09 22:13:00\"}', '2026-10-09 08:13:01', '2026-10-09 08:13:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(36, 'App\\Models\\User', 5, 'auth_token', '78514906f3e71faa8e44a2ad72014688c74e71f3fa69376f19ea2b129aaaafa4', '[\"*\"]', NULL, NULL, '2026-10-09 06:54:33', '2026-10-09 06:54:33'),
(41, 'App\\Models\\User', 7, 'auth_token', '93d43630a08f7a5746befa1659b1398589d9ecb4a0b3612c1d98551d98a87803', '[\"*\"]', '2026-10-09 08:22:59', NULL, '2026-10-09 08:09:54', '2026-10-09 08:22:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `id` bigint UNSIGNED NOT NULL,
  `document_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json NOT NULL,
  `correct_answer` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `difficulty` enum('Dễ','Trung bình','Khó') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Trung bình',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`id`, `document_id`, `order`, `content`, `options`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Bốn chức năng cơ bản của quản trị là:', '[{\"id\": \"A\", \"text\": \"Hoạch định, thực hiện, kiểm tra và sửa sai.\"}, {\"id\": \"B\", \"text\": \"Hoạch định, thực hiện, đo lường và kiểm tra.\"}, {\"id\": \"C\", \"text\": \"Hoạch định, tổ chức, lãnh đạo và kiểm tra.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'C', '4 chức năng quản trị kinh điển là Hoạch định - Tổ chức - Lãnh đạo - Kiểm tra.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(2, 1, 2, 'Hiệu suất được định nghĩa là tỉ số giữa:', '[{\"id\": \"A\", \"text\": \"(Đầu ra - Đầu vào) / Đầu ra.\"}, {\"id\": \"B\", \"text\": \"Đầu ra / Đầu vào.\"}, {\"id\": \"C\", \"text\": \"Đầu vào / Đầu ra.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'B', 'Hiệu suất = Kết quả đầu ra / Nguồn lực đầu vào.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(3, 1, 3, 'Nhà quản trị có đặc điểm:', '[{\"id\": \"A\", \"text\": \"Điều khiển công việc của người khác.\"}, {\"id\": \"B\", \"text\": \"Trực tiếp thực hiện công việc.\"}, {\"id\": \"C\", \"text\": \"Có trách nhiệm nhưng không cần quyền hạn.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'A', 'Nhà quản trị làm việc thông qua người khác, khác với nhân viên thừa hành trực tiếp làm việc.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(4, 1, 4, 'Ba cấp bậc nhà quản trị trong tổ chức là:', '[{\"id\": \"A\", \"text\": \"Cấp cơ sở, cấp giữa và cấp cao.\"}, {\"id\": \"B\", \"text\": \"Cấp trẻ, cấp trung niên và cấp cao tuổi.\"}, {\"id\": \"C\", \"text\": \"Cấp thu nhập thấp, cấp thu nhập vừa và cấp thu nhập cao.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'A', '3 cấp bậc quản trị cơ bản: Cấp cao (Top), Cấp trung (Middle), Cấp cơ sở (First-line).', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(5, 1, 5, 'Ba kỹ năng cần thiết của nhà quản trị là:', '[{\"id\": \"A\", \"text\": \"Kỹ năng trình bày, kỹ năng tổng hợp và kỹ năng định hướng.\"}, {\"id\": \"B\", \"text\": \"Kỹ năng chuyên môn, kỹ năng giao tiếp và kỹ năng chiến lược.\"}, {\"id\": \"C\", \"text\": \"Kỹ năng kỹ thuật, kỹ năng nhân sự và kỹ năng tư duy.\"}, {\"id\": \"D\", \"text\": \"Kỹ năng kỹ thuật, kỹ năng tư duy và kỹ năng trình bày.\"}]', 'C', '3 kỹ năng của nhà quản trị: Kỹ thuật (Technical), Nhân sự (Human), Tư duy (Conceptual).', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(6, 1, 6, 'Vai trò quan hệ với con người của nhà quản trị bao gồm:', '[{\"id\": \"A\", \"text\": \"Đại gia, biểu tượng; lãnh đạo và liên lạc.\"}, {\"id\": \"B\", \"text\": \"Đại diện, tượng trưng; lãnh đạo và liên lạc.\"}, {\"id\": \"C\", \"text\": \"Đại diện, tượng trưng; lãnh đạo và trung gian.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'B', 'Vai trò quan hệ con người gồm: Vai trò đại diện/tượng trưng, vai trò lãnh đạo và vai trò liên lạc.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(7, 1, 7, 'Các vai trò thông tin của nhà quản trị gồm:', '[{\"id\": \"A\", \"text\": \"Phổ biến thông tin.\"}, {\"id\": \"B\", \"text\": \"Cung cấp thông tin.\"}, {\"id\": \"C\", \"text\": \"Thu thập và tiếp nhận thông tin.\"}, {\"id\": \"D\", \"text\": \"Cả 3 câu đều đúng.\"}]', 'D', 'Vai trò thông tin bao gồm: Thu thập, phổ biến và cung cấp thông tin.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(8, 1, 8, 'Các vai trò quyết định của nhà quản trị bao gồm:', '[{\"id\": \"A\", \"text\": \"Giải quyết các thay đổi và xung đột.\"}, {\"id\": \"B\", \"text\": \"Phân bổ tài nguyên.\"}, {\"id\": \"C\", \"text\": \"Thương thuyết, đàm phán.\"}, {\"id\": \"D\", \"text\": \"Cả 3 câu đều đúng.\"}]', 'D', 'Vai trò quyết định bao gồm: Khởi xướng thay đổi, giải quyết xung đột, phân bổ nguồn lực và thương thuyết.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(9, 1, 9, 'Quản trị là:', '[{\"id\": \"A\", \"text\": \"Quá trình hoạch định, tổ chức, bố trí nhân sự, lãnh đạo và kiểm soát có hệ thống các hoạt động trong một tổ chức nhằm đạt được các mục tiêu đã đề ra.\"}, {\"id\": \"B\", \"text\": \"Tiến trình làm việc với con người và thông qua con người, trong một môi trường luôn thay đổi nhằm đạt được mục tiêu của tổ chức.\"}, {\"id\": \"C\", \"text\": \"Nghệ thuật hoàn thành các mục tiêu đã vạch ra thông qua người khác.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'D', 'Cả 3 định nghĩa trên đều đúng và bổ sung cho nhau về khái niệm quản trị.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(10, 1, 10, 'Hoạt động quản trị sẽ không có hiệu suất khi:', '[{\"id\": \"A\", \"text\": \"Giảm thiểu chi phí đầu vào mà vẫn giữ nguyên giá trị sản lượng đầu ra.\"}, {\"id\": \"B\", \"text\": \"Giữ nguyên chi phí đầu vào mà tăng giá trị sản lượng đầu ra.\"}, {\"id\": \"C\", \"text\": \"Giảm chi phí đầu vào mà vẫn tăng giá trị sản lượng đầu ra.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'D', 'Các phương án A, B, C đều là biểu hiện của việc tăng hiệu suất, do đó không có phương án nào là \"không có hiệu suất\".', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(11, 1, 11, 'Người ta chia các cấp bậc nhà quản trị trong một tổ chức thành:', '[{\"id\": \"A\", \"text\": \"2 cấp.\"}, {\"id\": \"B\", \"text\": \"3 cấp.\"}, {\"id\": \"C\", \"text\": \"4 cấp.\"}, {\"id\": \"D\", \"text\": \"5 cấp.\"}]', 'B', 'Tổ chức thường chia thành 3 cấp quản trị: cấp cao, cấp trung và cấp cơ sở.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(12, 1, 12, 'Nhà quản trị:', '[{\"id\": \"A\", \"text\": \"Vừa là người tổ chức, người thực hiện và người kiểm tra.\"}, {\"id\": \"B\", \"text\": \"Vừa là người tổ chức, người điều khiển và người kiểm tra.\"}, {\"id\": \"C\", \"text\": \"Vừa là người tổ chức, người thực hiện và người điều khiển.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'B', 'Nhà quản trị đóng vai trò tổ chức, điều khiển và kiểm tra hoạt động của người khác.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(13, 1, 13, 'Ở cấp quản trị càng cao thì nhà quản trị càng cần nhiều kỹ năng về:', '[{\"id\": \"A\", \"text\": \"Kỹ thuật.\"}, {\"id\": \"B\", \"text\": \"Nhân sự.\"}, {\"id\": \"C\", \"text\": \"Tư duy.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'C', 'Càng lên cấp cao, kỹ năng tư duy (chiến lược) càng quan trọng, trong khi kỹ năng kỹ thuật giảm dần.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(14, 1, 14, 'Kỹ năng kỹ thuật của nhà quản trị:', '[{\"id\": \"A\", \"text\": \"Thể hiện trình độ chuyên môn, nghiệp vụ của nhà quản trị.\"}, {\"id\": \"B\", \"text\": \"Khả năng động viên và điều khiển những người cộng sự.\"}, {\"id\": \"C\", \"text\": \"Đòi hỏi nhà quản trị phải hiểu rõ mức độ phức tạp của môi trường và giảm thiểu mức độ phức tạp đó.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'A', 'Kỹ năng kỹ thuật liên quan đến trình độ chuyên môn, nghiệp vụ cụ thể.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(15, 1, 15, 'Kỹ năng nhân sự của nhà quản trị:', '[{\"id\": \"A\", \"text\": \"Thể hiện trình độ chuyên môn, nghiệp vụ của nhà quản trị.\"}, {\"id\": \"B\", \"text\": \"Khả năng động viên và điều khiển những người cộng sự và tập thể.\"}, {\"id\": \"C\", \"text\": \"Thể hiện bản sắc riêng của nhà quản trị.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'B', 'Kỹ năng nhân sự là khả năng làm việc, động viên và điều khiển con người.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(16, 1, 16, 'Kỹ năng tư duy của nhà quản trị:', '[{\"id\": \"A\", \"text\": \"Thể hiện trình độ chuyên môn, nghiệp vụ của nhà quản trị.\"}, {\"id\": \"B\", \"text\": \"Khả năng động viên và điều khiển những người cộng sự.\"}, {\"id\": \"C\", \"text\": \"Thể hiện bản sắc riêng của nhà quản trị.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'D', 'Kỹ năng tư duy là khả năng nhìn nhận tổng thể, phân tích và giải quyết vấn đề chiến lược, không phải các phương án A, B, C.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(17, 1, 17, 'Ba nhóm vai trò (lĩnh vực) của nhà quản trị là:', '[{\"id\": \"A\", \"text\": \"Vai trò đại diện, vai trò thông tin, vai trò lãnh đạo.\"}, {\"id\": \"B\", \"text\": \"Vai trò hoà giải, vai trò phân bổ tài nguyên, vai trò thương thuyết.\"}, {\"id\": \"C\", \"text\": \"Vai trò quan hệ với con người, vai trò thông tin, vai trò quyết định.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'C', 'Theo Mintzberg, 3 nhóm vai trò chính là: Quan hệ con người, Thông tin và Quyết định.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(18, 1, 18, 'Vai trò quan hệ với con người của nhà quản trị thể hiện ở:', '[{\"id\": \"A\", \"text\": \"Vai trò đại diện, người lãnh đạo, người liên lạc.\"}, {\"id\": \"B\", \"text\": \"Vai trò thu thập, phổ biến thông tin và phát ngôn.\"}, {\"id\": \"C\", \"text\": \"Vai trò doanh nhân, hoà giải, phân phối nguồn lực, thương thuyết.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'A', 'Vai trò quan hệ con người gồm: Đại diện, Lãnh đạo, Liên lạc.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(19, 1, 19, 'Vai trò thông tin của nhà quản trị thể hiện ở:', '[{\"id\": \"A\", \"text\": \"Vai trò đại diện, người lãnh đạo, người liên lạc.\"}, {\"id\": \"B\", \"text\": \"Vai trò thu thập, phổ biến thông tin và phát ngôn.\"}, {\"id\": \"C\", \"text\": \"Vai trò doanh nhân, hoà giải, phân phối nguồn lực, thương thuyết.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'B', 'Vai trò thông tin gồm: Thu thập, Phổ biến và Phát ngôn.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(20, 1, 20, 'Vai trò quyết định của nhà quản trị thể hiện ở:', '[{\"id\": \"A\", \"text\": \"Vai trò đại diện, người lãnh đạo, người liên lạc.\"}, {\"id\": \"B\", \"text\": \"Vai trò thu thập, phổ biến thông tin và phát ngôn.\"}, {\"id\": \"C\", \"text\": \"Vai trò doanh nhân, hoà giải, phân phối nguồn lực, thương thuyết.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'C', 'Vai trò quyết định gồm: Doanh nhân, Giải quyết xung đột, Phân bổ nguồn lực, Thương thuyết.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(21, 1, 21, 'Quản trị là:', '[{\"id\": \"A\", \"text\": \"Một khoa học vì có đối tượng nghiên cứu cụ thể, có phương pháp phân tích và có lý thuyết xuất phát từ nghiên cứu.\"}, {\"id\": \"B\", \"text\": \"Một khoa học vì sử dụng nhiều tri thức và thành tựu của các ngành khoa học khác.\"}, {\"id\": \"C\", \"text\": \"Một nghệ thuật vì để quản trị hữu hiệu, nhà quản trị phải biết vận dụng linh hoạt lý thuyết và kiến thức vào những tình huống cụ thể.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'D', 'Quản trị vừa là khoa học vừa là nghệ thuật, nên cả A, B, C đều đúng.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(22, 1, 22, 'Đặc điểm nổi bật nhất của nhà doanh nghiệp là:', '[{\"id\": \"A\", \"text\": \"Luôn thôi thúc để thành đạt.\"}, {\"id\": \"B\", \"text\": \"Rất tự tin và làm chủ vận mệnh của mình.\"}, {\"id\": \"C\", \"text\": \"Chỉ chọn mức độ rủi ro vừa phải, trong phạm vi lượng định.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'D', 'Nhà doanh nghiệp có đủ các đặc điểm: thôi thúc thành đạt, tự tin, và chấp nhận rủi ro có tính toán.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(23, 1, 23, 'Quản trị mang đặc tính:', '[{\"id\": \"A\", \"text\": \"Khoa học.\"}, {\"id\": \"B\", \"text\": \"Nghệ thuật.\"}, {\"id\": \"C\", \"text\": \"Cả hai câu đều đúng.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'C', 'Quản trị mang cả tính khoa học và tính nghệ thuật.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(24, 1, 24, 'Hiệu quả là kết quả khi:', '[{\"id\": \"A\", \"text\": \"So sánh đầu ra giữa các tiến trình quản trị khác nhau.\"}, {\"id\": \"B\", \"text\": \"So sánh đầu vào giữa các tiến trình quản trị khác nhau.\"}, {\"id\": \"C\", \"text\": \"So sánh năng suất giữa các tiến trình quản trị khác nhau.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'C', 'Hiệu quả thể hiện qua việc so sánh năng suất (kết quả đầu ra trên chi phí đầu vào) giữa các tiến trình.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(25, 1, 25, 'Tìm ra câu trả lời đúng nhất về nhà quản trị:', '[{\"id\": \"A\", \"text\": \"Chỉ áp dụng được trong các khách sạn.\"}, {\"id\": \"B\", \"text\": \"Không áp dụng được trong các trường học.\"}, {\"id\": \"C\", \"text\": \"Có thể áp dụng trong các trận đấu bóng đá.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'C', 'Quản trị có thể áp dụng ở mọi tổ chức, kể cả trong một trận bóng đá (huấn luyện viên quản trị đội bóng).', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(26, 1, 26, 'Người ta chia các cấp bậc quản trị trong một tổ chức thành:', '[{\"id\": \"A\", \"text\": \"2 cấp.\"}, {\"id\": \"B\", \"text\": \"3 cấp.\"}, {\"id\": \"C\", \"text\": \"4 cấp.\"}, {\"id\": \"D\", \"text\": \"5 cấp.\"}]', 'B', 'Tương tự câu 11, có 3 cấp bậc quản trị.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(27, 1, 27, 'Nhà quản trị thực hiện bao nhiêu vai trò:', '[{\"id\": \"A\", \"text\": \"3 vai trò\"}, {\"id\": \"B\", \"text\": \"8 vai trò\"}, {\"id\": \"C\", \"text\": \"10 vai trò\"}, {\"id\": \"D\", \"text\": \"12 vai trò\"}]', 'C', 'Theo Mintzberg, nhà quản trị thực hiện 10 vai trò khác nhau, chia thành 3 nhóm.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(28, 1, 28, 'Phát biểu đúng về quản trị:', '[{\"id\": \"A\", \"text\": \"Càng lên chức cao thì yêu cầu khả năng chuyên môn càng cao.\"}, {\"id\": \"B\", \"text\": \"Càng lên chức cao thì yêu cầu khả năng quản lý càng cao.\"}, {\"id\": \"C\", \"text\": \"Càng lên chức cao thì không cần khả năng chuyên môn.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'B', 'Càng lên cấp cao, yêu cầu về khả năng quản lý (tư duy, chiến lược) càng lớn.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(29, 1, 29, 'Phát biểu đúng về quản trị:', '[{\"id\": \"A\", \"text\": \"Nhà quản trị phải có khả năng tư duy trừu tượng về ngành nghề.\"}, {\"id\": \"B\", \"text\": \"Nhà quản trị phải có trình độ cao về ngành nghề.\"}, {\"id\": \"C\", \"text\": \"Nhà quản trị phải có khả năng nói và viết tốt.\"}, {\"id\": \"D\", \"text\": \"Nhà quản trị phải có khả năng chuyên môn về ngành nghề.\"}]', 'A', 'Nhà quản trị cần khả năng tư duy trừu tượng, khái quát hóa vấn đề (kỹ năng tư duy).', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(30, 1, 30, 'Giáo viên là:', '[{\"id\": \"A\", \"text\": \"Nhà quản trị cấp cao.\"}, {\"id\": \"B\", \"text\": \"Nhà quản trị cấp trung.\"}, {\"id\": \"C\", \"text\": \"Nhà quản trị cấp thấp.\"}, {\"id\": \"D\", \"text\": \"Người thừa hành.\"}]', 'D', 'Giáo viên trực tiếp thực hiện công việc giảng dạy, không quản trị người khác (trừ khi làm hiệu trưởng), nên là người thừa hành.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(31, 1, 31, 'Quản trị không cần thiết trong các:', '[{\"id\": \"A\", \"text\": \"Cơ sở tôn giáo\"}, {\"id\": \"B\", \"text\": \"Cơ sở giáo dục\"}, {\"id\": \"C\", \"text\": \"Tổ chức từ thiện\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'D', 'Quản trị cần thiết cho mọi tổ chức, kể cả tôn giáo, giáo dục và từ thiện.', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(32, 1, 32, 'Các nguồn lực của quản trị là:', '[{\"id\": \"A\", \"text\": \"Man, Materials, Machine, Methode, Money and Information.\"}, {\"id\": \"B\", \"text\": \"Customers, Suppliers, Government, Tax and Information.\"}, {\"id\": \"C\", \"text\": \"Man, Power, Authority, Assigment, Motivation and Information.\"}, {\"id\": \"D\", \"text\": \"Marketing, Materials, Machine, Methode, Money and Information.\"}]', 'A', 'Nguồn lực quản trị thường được nhắc đến với mô hình 5M + I (Man, Materials, Machine, Method, Money, Information).', 'Trung bình', '2026-10-08 02:36:06', '2026-10-08 02:36:06'),
(33, 2, 1, 'Môi trường hoạt động của doanh nghiệp ngày càng........, đòi hỏi nhà quản trị phải sẵn sàng phản ứng và đối phó với sự thay đổi môi trường.', '[{\"id\": \"A\", \"text\": \"tính\"}, {\"id\": \"B\", \"text\": \"phổ biến\"}, {\"id\": \"C\", \"text\": \"không thay đổi\"}, {\"id\": \"D\", \"text\": \"năng động\"}]', 'D', 'Môi trường kinh doanh luôn vận động, biến đổi không ngừng (năng động), đòi hỏi doanh nghiệp phải linh hoạt thích ứng.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(34, 2, 2, '......... bao gồm tất cả các yếu tố có ảnh hưởng đến tổ chức.', '[{\"id\": \"A\", \"text\": \"Môi trường tổ chức\"}, {\"id\": \"B\", \"text\": \"Môi trường nội tại\"}, {\"id\": \"C\", \"text\": \"Môi trường công việc\"}, {\"id\": \"D\", \"text\": \"Môi trường tổng quát\"}]', 'A', 'Môi trường tổ chức là khái niệm bao quát nhất, bao gồm cả môi trường bên trong và bên ngoài có ảnh hưởng đến tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(35, 2, 3, 'Tất cả các yếu tố sau là một phần môi trường công việc của tổ chức, ngoại trừ:', '[{\"id\": \"A\", \"text\": \"Khách hàng.\"}, {\"id\": \"B\", \"text\": \"Thị trường lao động.\"}, {\"id\": \"C\", \"text\": \"Đối thủ cạnh tranh.\"}, {\"id\": \"D\", \"text\": \"Người lao động.\"}]', 'D', 'Người lao động là yếu tố thuộc môi trường nội bộ (bên trong) của tổ chức, không phải môi trường công việc (bên ngoài).', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(36, 2, 4, 'Yếu tố nào sau đây không phải là một phần môi trường tổng quát?', '[{\"id\": \"A\", \"text\": \"Công nghệ.\"}, {\"id\": \"B\", \"text\": \"Kinh tế.\"}, {\"id\": \"C\", \"text\": \"Đối thủ cạnh tranh.\"}, {\"id\": \"D\", \"text\": \"Chính trị - luật pháp.\"}]', 'C', 'Đối thủ cạnh tranh thuộc môi trường công việc (vi mô), trong khi công nghệ, kinh tế, chính trị - luật pháp thuộc môi trường tổng quát (vĩ mô).', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(37, 2, 5, '......... của môi trường bên ngoài đại diện cho các sự kiện có nguồn gốc ở nước ngoài cũng như các cơ hội cho các công ty Việt Nam ở các nước khác.', '[{\"id\": \"A\", \"text\": \"Bối cảnh quốc gia\"}, {\"id\": \"B\", \"text\": \"Bối cảnh toàn cầu\"}, {\"id\": \"C\", \"text\": \"Bối cảnh quốc tế\"}, {\"id\": \"D\", \"text\": \"Bối cảnh Việt Nam\"}]', 'C', 'Bối cảnh quốc tế đề cập đến các yếu tố, sự kiện từ môi trường bên ngoài lãnh thổ quốc gia, tạo cơ hội hoặc thách thức cho doanh nghiệp.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(38, 2, 6, 'Stan là chủ sở hữu của một công ty tiếp thị nhỏ. Ông thiết kế chiến dịch quảng cáo hướng tới các nhóm dân cư trong thị trường Mỹ. Nhóm nhân khẩu học nào hiện nay có quy mô lớn nhất?', '[{\"id\": \"A\", \"text\": \"Thế hệ bùng nổ trẻ em (baby boomer).\"}, {\"id\": \"B\", \"text\": \"Thế hệ X.\"}, {\"id\": \"C\", \"text\": \"Thế hệ Y.\"}, {\"id\": \"D\", \"text\": \"Thế hệ trung niên.\"}]', 'A', 'Tại Mỹ, thế hệ Baby Boomer (sinh từ 1946-1964) là một trong những nhóm nhân khẩu có quy mô lớn và ảnh hưởng lớn đến thị trường tiêu dùng.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(39, 2, 7, 'SweetTooth Candies là công ty Mỹ sản xuất, phân phối kẹo và thức ăn nhanh trên toàn cầu. Nguồn cung cấp ca cao và đường lớn nhất của công ty là các công ty Nam Mỹ. Mối quan hệ kinh doanh này nhấn mạnh bối cảnh nào của môi trường công việc?', '[{\"id\": \"A\", \"text\": \"Khách hàng.\"}, {\"id\": \"B\", \"text\": \"Đối thủ cạnh tranh.\"}, {\"id\": \"C\", \"text\": \"Thị trường lao động.\"}, {\"id\": \"D\", \"text\": \"Nhà cung cấp.\"}]', 'D', 'Các công ty cung cấp nguyên liệu (ca cao, đường) cho SweetTooth được gọi là nhà cung cấp.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(40, 2, 8, '......... được bao gồm trong môi trường công việc của tổ chức.', '[{\"id\": \"A\", \"text\": \"Nhà cung cấp\"}, {\"id\": \"B\", \"text\": \"Công nghệ\"}, {\"id\": \"C\", \"text\": \"Chính phủ\"}, {\"id\": \"D\", \"text\": \"Đặc điểm dân số\"}]', 'A', 'Nhà cung cấp là một thành phần trực tiếp của môi trường công việc (vi mô) bên ngoài tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(41, 2, 9, '...... bao gồm những con người trong yếu tố môi trường được thuê để làm việc cho tổ chức.', '[{\"id\": \"A\", \"text\": \"Đối thủ cạnh tranh\"}, {\"id\": \"B\", \"text\": \"Thị trường lao động\"}, {\"id\": \"C\", \"text\": \"Nhà cung cấp\"}, {\"id\": \"D\", \"text\": \"Khách hàng\"}]', 'B', 'Thị trường lao động là nơi cung cấp nguồn nhân lực cho tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(42, 2, 10, 'Công ty Ally\'s Applesauce đang trong quá trình tuyển dụng sáu mươi công nhân mới. Phòng nhân sự đang gặp khó khăn do việc thiếu nhân sự có kỹ năng tại địa phương. Bối cảnh nào của môi trường bên ngoài liên quan đến trường hợp này?', '[{\"id\": \"A\", \"text\": \"Văn hóa – xã hội\"}, {\"id\": \"B\", \"text\": \"Đối thủ cạnh tranh\"}, {\"id\": \"C\", \"text\": \"Công nghệ\"}, {\"id\": \"D\", \"text\": \"Thị trường lao động\"}]', 'D', 'Việc thiếu hụt nhân sự có kỹ năng tại địa phương phản ánh tình trạng của thị trường lao động.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(43, 2, 11, 'Môi trường nội bộ bao gồm tất cả các mô tả sau, ngoại trừ:', '[{\"id\": \"A\", \"text\": \"Văn hóa công ty\"}, {\"id\": \"B\", \"text\": \"Cấu trúc tổ chức\"}, {\"id\": \"C\", \"text\": \"Cơ sở vật chất\"}, {\"id\": \"D\", \"text\": \"Thị trường lao động\"}]', 'D', 'Thị trường lao động là yếu tố bên ngoài, không thuộc môi trường nội bộ.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(44, 2, 12, 'Các tiến bộ khoa học và công nghệ trong một ngành công nghiệp cụ thể cũng như trong một xã hội rộng lớn được thể hiện trong bối cảnh môi trường tổng quát nào?', '[{\"id\": \"A\", \"text\": \"Bối cảnh văn hóa-xã hội\"}, {\"id\": \"B\", \"text\": \"Bối cảnh luật pháp – chính trị\"}, {\"id\": \"C\", \"text\": \"Bối cảnh kinh tế\"}, {\"id\": \"D\", \"text\": \"Bối cảnh công nghệ\"}]', 'D', 'Tiến bộ khoa học công nghệ thuộc về bối cảnh công nghệ của môi trường tổng quát.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(45, 2, 13, 'Hệ thống..... thu hút nguồn lực từ môi trường bên ngoài và hoàn trả sản phẩm và dịch vụ cho môi trường đó.', '[{\"id\": \"A\", \"text\": \"sản xuất\"}, {\"id\": \"B\", \"text\": \"đóng\"}, {\"id\": \"C\", \"text\": \"mở\"}, {\"id\": \"D\", \"text\": \"thông tin\"}]', 'C', 'Hệ thống mở tương tác với môi trường bên ngoài bằng cách nhận đầu vào và trả lại đầu ra.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(46, 2, 14, 'Môi trường...... đại diện cho bối cảnh bên ngoài của môi trường và ảnh hưởng...... đến tổ chức.', '[{\"id\": \"A\", \"text\": \"công việc, gián tiếp\"}, {\"id\": \"B\", \"text\": \"tổng quát, trực tiếp\"}, {\"id\": \"C\", \"text\": \"bên trong, gián tiếp\"}, {\"id\": \"D\", \"text\": \"tổng quát, gián tiếp\"}]', 'D', 'Môi trường tổng quát (vĩ mô) ảnh hưởng gián tiếp đến tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(47, 2, 15, 'Theo “góc thảo luận của nhà quản trị” tại chương văn hóa công ty và môi trường, bất cứ ai đang xem xét việc kinh doanh ở Trung Quốc nên ghi nhớ tất cả các điều sau đây, ngoại trừ:', '[{\"id\": \"A\", \"text\": \"kinh doanh luôn dựa trên mối quan hệ cá nhân\"}, {\"id\": \"B\", \"text\": \"đừng bỏ qua những cuộc trò chuyện ngắn\"}, {\"id\": \"C\", \"text\": \"hãy nhớ rằng các mối quan hệ không phải là ngắn hạn\"}, {\"id\": \"D\", \"text\": \"hiệu quả với việc sử dụng thời gian\"}]', 'D', 'Trong văn hóa kinh doanh Trung Quốc, việc xây dựng mối quan hệ (guanxi) thường được ưu tiên hơn là sự hiệu quả tức thời về thời gian.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(48, 2, 16, 'Theo “góc thảo luận của nhà quản trị” tại chương văn hóa công ty và môi trường, nguyên tắc nào sau đây thể hiện việc tạo dựng mối quan hệ tình cảm?', '[{\"id\": \"A\", \"text\": \"Đừng bỏ qua những cuộc trò chuyện ngắn.\"}, {\"id\": \"B\", \"text\": \"Kinh doanh luôn dựa trên mối quan hệ cá nhân\"}, {\"id\": \"C\", \"text\": \"Hãy nhớ rằng các mối quan hệ không phải là ngắn hạn\"}, {\"id\": \"D\", \"text\": \"Nên gặp gỡ thường xuyên\"}]', 'A', 'Những cuộc trò chuyện ngắn (small talk) giúp tạo dựng sự thân thiết và mối quan hệ tình cảm.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(49, 2, 17, 'Theo văn hóa Trung Quốc......thể hiện một liên kết hỗ trợ và đôi bên cùng có lợi giữa hai cá nhân.', '[{\"id\": \"A\", \"text\": \"Kaizen\"}, {\"id\": \"B\", \"text\": \"Ganqing\"}, {\"id\": \"C\", \"text\": \"Kansei\"}, {\"id\": \"D\", \"text\": \"Guanxi\"}]', 'B', 'Ganqing (cảm tình) trong văn hóa Trung Quốc thể hiện mối liên kết tình cảm và sự hỗ trợ lẫn nhau.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(50, 2, 18, 'Bối cảnh nào của môi trường tổng quát đại diện cho đặc điểm dân số, chuẩn mực, phong tục tập quán và các giá trị của dân cư tại nơi mà tổ chức hoạt động?', '[{\"id\": \"A\", \"text\": \"Bối cảnh pháp lý – chính trị\"}, {\"id\": \"B\", \"text\": \"Bối cảnh kinh tế\"}, {\"id\": \"C\", \"text\": \"Bối cảnh kỹ thuật\"}, {\"id\": \"D\", \"text\": \"Bối cảnh văn hóa -xã hội\"}]', 'D', 'Đặc điểm dân số, chuẩn mực, phong tục và giá trị thuộc về bối cảnh văn hóa - xã hội.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(51, 2, 19, 'Animal-One tổ chức một cuộc vận động để cộng đồng nhận thức về việc sử dụng động vật trong việc thử nghiệm mỹ phẩm. Nhóm này lên án các công ty mỹ phẩm truyền thống đồng thời khuyến khích những công ty khác không thử nghiệm trên động vật. Animal-One được mô tả tốt nhất như.......', '[{\"id\": \"A\", \"text\": \"người thời cổi\"}, {\"id\": \"B\", \"text\": \"tổ chức chính phủ\"}, {\"id\": \"C\", \"text\": \"nhóm áp lực\"}, {\"id\": \"D\", \"text\": \"tổ chức bền vững\"}]', 'C', 'Các nhóm hoạt động xã hội gây sức ép lên doanh nghiệp được gọi là nhóm áp lực (pressure groups).', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(52, 2, 20, 'Khi Miami Herald ra mắt tờ báo tiếng Tây ban nha, El Nuevo Herald, với các bài viết nhấn mạnh các tin tức và thể thao về Tây ban nha, Cuba, Mỹ la tinh, nó đang phản ứng với những thay đổi...... trong môi trường.', '[{\"id\": \"A\", \"text\": \"văn hóa xã hội\"}, {\"id\": \"B\", \"text\": \"kỹ thuật\"}, {\"id\": \"C\", \"text\": \"kinh tế\"}, {\"id\": \"D\", \"text\": \"đối thủ cạnh tranh\"}]', 'A', 'Sự thay đổi về thành phần dân cư, nhu cầu văn hóa của cộng đồng người gốc Tây Ban Nha là yếu tố văn hóa - xã hội.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(53, 2, 21, 'Các yếu tố môi trường tổng quát bao gồm sức mua của người tiêu dùng, tỷ lệ thất nghiệp, lãi suất được gọi là......', '[{\"id\": \"A\", \"text\": \"bối cảnh chính trị - pháp lý.\"}, {\"id\": \"B\", \"text\": \"bối cảnh văn hóa xã hội.\"}, {\"id\": \"C\", \"text\": \"bối cảnh kỹ thuật.\"}, {\"id\": \"D\", \"text\": \"bối cảnh kinh tế.\"}]', 'D', 'Sức mua, thất nghiệp, lãi suất là các chỉ số kinh tế vĩ mô.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(54, 2, 22, 'Thanh tra chính phủ yêu cầu công ty của bạn nâng cấp các thiết bị an toàn trong quá trình sản xuất của xưởng làm kem bơ. Bối cảnh môi trường bên ngoài nào đã ảnh hưởng đến những việc nâng cấp này.', '[{\"id\": \"A\", \"text\": \"Pháp lý – chính trị.\"}, {\"id\": \"B\", \"text\": \"Công việc.\"}, {\"id\": \"C\", \"text\": \"Văn hóa xã hội.\"}, {\"id\": \"D\", \"text\": \"Kinh tế.\"}]', 'A', 'Yêu cầu từ cơ quan chính phủ (thanh tra) thuộc bối cảnh pháp lý - chính trị.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(55, 2, 23, 'Bối cảnh...... của môi trường tổng quát bao gồm các quy định của chính quyền Trung ương và địa phương.', '[{\"id\": \"A\", \"text\": \"kỹ thuật.\"}, {\"id\": \"B\", \"text\": \"pháp luật – chính trị.\"}, {\"id\": \"C\", \"text\": \"kinh tế.\"}, {\"id\": \"D\", \"text\": \"văn hóa xã hội.\"}]', 'B', 'Các quy định của chính quyền là yếu tố pháp luật - chính trị.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(56, 2, 24, 'Điều nào sau đây KHÔNG phải là một trong những chiến lược thích ứng của tổ chức với những thay đổi để đối phó với sự bất ổn cao của môi trường?', '[{\"id\": \"A\", \"text\": \"Vai trò kết nối xuyên ranh giới.\"}, {\"id\": \"B\", \"text\": \"Quảng cáo/quan hệ công chúng.\"}, {\"id\": \"C\", \"text\": \"Sát nhập/liên doanh.\"}, {\"id\": \"D\", \"text\": \"Sự hợp tác liên tổ chức.\"}]', 'B', 'Quảng cáo/PR là hoạt động marketing, không phải là chiến lược cấu trúc để thích ứng với sự bất ổn của môi trường.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(57, 2, 25, 'Vai trò nào sau đây được thực hiện nhờ vào sự liên kết và phối hợp tổ chức với các yếu tố thiết yếu của môi trường bên ngoài?', '[{\"id\": \"A\", \"text\": \"Liên kết.\"}, {\"id\": \"B\", \"text\": \"Kết nối xuyên ranh giới.\"}, {\"id\": \"C\", \"text\": \"Điều khiển sự rối loạn.\"}, {\"id\": \"D\", \"text\": \"Lãnh đạo.\"}]', 'B', 'Vai trò kết nối xuyên ranh giới (boundary spanning) giúp tổ chức liên kết với môi trường bên ngoài.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(58, 2, 26, 'Một nhóm lợi ích làm việc trong khuôn khổ của chính trị -pháp lý nhằm ảnh hưởng để các công ty ứng xử có trách nhiệm xã hội được gọi là:', '[{\"id\": \"A\", \"text\": \"nhóm gây áp lực.\"}, {\"id\": \"B\", \"text\": \"nhóm pháp lý.\"}, {\"id\": \"C\", \"text\": \"nhóm ảnh hưởng về chính trị.\"}, {\"id\": \"D\", \"text\": \"nhóm xã hội.\"}]', 'A', 'Nhóm gây áp lực (pressure group) tác động đến chính trị - pháp lý để thay đổi hành vi doanh nghiệp.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(59, 2, 27, 'Để đối phó với áp lực từ những người bảo vệ môi trường, các tổ chức ngày càng trở nên nhạy cảm với sự suy giảm........', '[{\"id\": \"A\", \"text\": \"nguồn lực tự nhiên.\"}, {\"id\": \"B\", \"text\": \"nguồn lực kinh tế.\"}, {\"id\": \"C\", \"text\": \"nguồn lực tài chính.\"}, {\"id\": \"D\", \"text\": \"nguồn lực con người.\"}]', 'A', 'Các tổ chức quan tâm đến việc bảo vệ nguồn lực tự nhiên để đáp ứng yêu cầu của các nhóm môi trường.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(60, 2, 28, 'Bối cảnh nào của môi trường tổng quát bao gồm tất cả các yếu tố xuất hiện một cách tự nhiên trên trái đất?', '[{\"id\": \"A\", \"text\": \"Bối cảnh văn hóa xã hội.\"}, {\"id\": \"B\", \"text\": \"Bối cảnh công nghệ.\"}, {\"id\": \"C\", \"text\": \"Bối cảnh tự nhiên.\"}, {\"id\": \"D\", \"text\": \"Bối cảnh môi trường.\"}]', 'C', 'Các yếu tố tự nhiên (đất, nước, không khí, khí hậu...) thuộc bối cảnh tự nhiên.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(61, 2, 29, 'Integrated Computers Inc. muốn lập hồ sơ của khách hàng để gửi thư quảng cáo. Điều này có thể thấy ở môi trường nào sau đây:', '[{\"id\": \"A\", \"text\": \"Môi trường bên trong.\"}, {\"id\": \"B\", \"text\": \"Môi trường công việc.\"}, {\"id\": \"C\", \"text\": \"Môi trường tổng quát.\"}, {\"id\": \"D\", \"text\": \"Không có câu đúng.\"}]', 'B', 'Khách hàng là một phần của môi trường công việc (vi mô).', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(62, 2, 30, 'Những cá nhân và tổ chức trong môi trường có nhu cầu sử dụng sản phẩm và dịch vụ của tổ chức được gọi là:', '[{\"id\": \"A\", \"text\": \"Đối thủ cạnh tranh.\"}, {\"id\": \"B\", \"text\": \"Nhà cung cấp.\"}, {\"id\": \"C\", \"text\": \"Khách hàng.\"}, {\"id\": \"D\", \"text\": \"Người lao động.\"}]', 'C', 'Khách hàng là những người có nhu cầu sử dụng sản phẩm/dịch vụ.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(63, 2, 31, '...... thể hiện việc các nhà quản trị không có đủ các thông tin về các yếu tố trong môi trường để thấu hiểu và dự đoán các nhu cầu và sự thay đổi của môi trường.', '[{\"id\": \"A\", \"text\": \"Sự thích ứng.\"}, {\"id\": \"B\", \"text\": \"Rủi ro.\"}, {\"id\": \"C\", \"text\": \"Sự bất trắc.\"}, {\"id\": \"D\", \"text\": \"Kiến thức.\"}]', 'C', 'Sự bất trắc (uncertainty) xảy ra khi thiếu thông tin để dự đoán môi trường.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(64, 2, 32, 'Môi trường ...... bao gồm các yếu tố nhân khẩu học như mật độ dân số, phân bổ theo địa lý.', '[{\"id\": \"A\", \"text\": \"công nghệ.\"}, {\"id\": \"B\", \"text\": \"văn hóa – xã hội.\"}, {\"id\": \"C\", \"text\": \"pháp lý – chính trị.\"}, {\"id\": \"D\", \"text\": \"bên trong.\"}]', 'B', 'Các yếu tố nhân khẩu học thuộc bối cảnh văn hóa - xã hội.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(65, 2, 33, 'Roberta là nhà điều hành cao cấp tại một ngân hàng. Cô ấy dành nhiều thời gian trong ngày để gặp các quan chức chính quyền địa phương, khách hàng và các quan chức của ngân hàng liên bang để giải quyết các vấn đề quan trọng trong lĩnh vực ngân hàng. Vai trò của Roberta được mô tả như là......', '[{\"id\": \"A\", \"text\": \"kết nối xuyên ranh giới.\"}, {\"id\": \"B\", \"text\": \"sự thích ứng.\"}, {\"id\": \"C\", \"text\": \"tổ chức nội bộ.\"}, {\"id\": \"D\", \"text\": \"bên ngoài.\"}]', 'A', 'Việc gặp gỡ các bên bên ngoài (chính quyền, khách hàng, ngân hàng liên bang) là vai trò kết nối xuyên ranh giới.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(66, 2, 34, '......là hoạt động liên quan đến việc sử dụng các phần mềm phức hợp để xử lý một lượng lớn thông tin bên trong và bên ngoài để tìm kiếm các mô hình, khuynh hướng và mối quan hệ đảm bảo độ tin cậy thống kê.', '[{\"id\": \"A\", \"text\": \"Hoạt động thu thập thông tin sát nhập.\"}, {\"id\": \"B\", \"text\": \"Hoạt động thu thập thông tin kinh doanh.\"}, {\"id\": \"C\", \"text\": \"Hoạt động thu thập thông tin cạnh tranh.\"}, {\"id\": \"D\", \"text\": \"Hoạt động thu thập thông tin môi trường.\"}]', 'B', 'Đây là định nghĩa của Business Intelligence (BI) - thu thập thông tin kinh doanh.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(67, 2, 35, 'Cửa hàng trang sức của Kristen vừa thuê một người mua sắm ở các cửa hàng trang sức khác trong vùng để có được các thông tin về giá cả các sản phẩm của các đối thủ cạnh tranh. Điều này mô tả chiến lược gì?', '[{\"id\": \"A\", \"text\": \"Kết nối xuyên ranh giới.\"}, {\"id\": \"B\", \"text\": \"Một cấu trúc linh hoạt.\"}, {\"id\": \"C\", \"text\": \"Thực hành không công bằng.\"}, {\"id\": \"D\", \"text\": \"Gia tăng kế hoạch và dự báo.\"}]', 'A', 'Việc thu thập thông tin từ đối thủ là một hoạt động của vai trò kết nối xuyên ranh giới.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(68, 2, 36, 'Gần đây 3 công ty điện tử lớn đã hợp tác để phát triển việc đổi mới điện thoại di động. Đây là ví dụ về xu hướng quản lý nào?', '[{\"id\": \"A\", \"text\": \"Thuê ngoài gia công.\"}, {\"id\": \"B\", \"text\": \"Hợp tác liên tổ chức.\"}, {\"id\": \"C\", \"text\": \"Sát nhập.\"}, {\"id\": \"D\", \"text\": \"Kết nối xuyên ranh giới.\"}]', 'B', 'Sự hợp tác giữa các công ty độc lập để cùng phát triển là hợp tác liên tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(69, 2, 37, 'Jefferson and Squirelà một công ty quảng cáo được xem là có văn hóa công ty phát triển nhanh và sang trọng. Công ty sử dụng màu đậm với các điểm nhấn đắt tiền ở tất cả các hình thức trang trí văn phòng. Điều này minh họa cho cấp độvăn hóa nào của công ty?', '[{\"id\": \"A\", \"text\": \"Các yếu tố có thể quan sát được.\"}, {\"id\": \"B\", \"text\": \"Những giả định cơ bản.\"}, {\"id\": \"C\", \"text\": \"Các giá trị rõ ràng.\"}, {\"id\": \"D\", \"text\": \"Anh hùng.\"}]', 'A', 'Màu sắc, trang trí văn phòng là những biểu hiện hữu hình, có thể quan sát được của văn hóa.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(70, 2, 38, 'Trong môi trường kinh doanh bên ngoài hiện nay, điều nào sau là đúng:', '[{\"id\": \"A\", \"text\": \"Văn hóa công ty quyết định thành công.\"}, {\"id\": \"B\", \"text\": \"Các công ty ngày càng đối lập hơn bao giờ hết.\"}, {\"id\": \"C\", \"text\": \"Sát nhập đang giảm.\"}, {\"id\": \"D\", \"text\": \"Liên doanh đang gia tăng.\"}]', 'A', 'Trong môi trường cạnh tranh, văn hóa công ty mạnh là yếu tố then chốt quyết định sự thành công.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(71, 2, 39, 'Dựa trên quan điểm cho rằng các tổ chức đang đối phó với môi trường bên ngoài rất hỗn loạn và không chắc chắn, ngày càng nhiều tổ chức yêu cầu ......... thực hiện hoạt động kết nối xuyên ranh giới.', '[{\"id\": \"A\", \"text\": \"các lãnh đạo cấp cao.\"}, {\"id\": \"B\", \"text\": \"các nhà quản lý cấp trung.\"}, {\"id\": \"C\", \"text\": \"các nhà quản lý cấp thấp.\"}, {\"id\": \"D\", \"text\": \"tất cả những người lao động.\"}]', 'D', 'Trong môi trường phức tạp, mọi thành viên đều có thể tham gia vào việc kết nối với môi trường bên ngoài.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(72, 2, 40, 'Các công ty có thể giảm rào cản và gia tăng hợp tác với các tổ chức khác bằng cách tạo ra:', '[{\"id\": \"A\", \"text\": \"cấu trúc linh hoạt.\"}, {\"id\": \"B\", \"text\": \"mối quan hệ hợp tác với các tổ chức quốc tế.\"}, {\"id\": \"C\", \"text\": \"văn hóa công ty mới.\"}, {\"id\": \"D\", \"text\": \"kết hợp với nhà cung cấp mới.\"}]', 'A', 'Cấu trúc linh hoạt giúp tổ chức dễ dàng thích nghi và hợp tác với các tổ chức khác.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(73, 2, 41, '........ là một phần của Ford, nhà sản xuất Mỹ, thuộc môi trường công việc.', '[{\"id\": \"A\", \"text\": \"Tỷ lệ lạm phát.\"}, {\"id\": \"B\", \"text\": \"Chrysler.\"}, {\"id\": \"C\", \"text\": \"Amazon.com, một người bán sách trực tuyến.\"}, {\"id\": \"D\", \"text\": \"Văn hóa doanh nghiệp của công ty Ford.\"}]', 'D', 'Văn hóa doanh nghiệp là một phần của môi trường nội bộ, nhưng trong câu này có thể ý chỉ nó là một phần của tổ chức Ford (môi trường công việc nội bộ).', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(74, 2, 42, 'Nhiều tổ chức đang thích nghi với môi trường bằng cách phát triển ngày càng nhiều mối quan hệ......... hơn là mối quan hệ......... với các đối thủ cạnh tranh.', '[{\"id\": \"A\", \"text\": \"đối lập, hợp tác.\"}, {\"id\": \"B\", \"text\": \"hợp tác, đối lập.\"}, {\"id\": \"C\", \"text\": \"chiến lược, cạnh tranh.\"}, {\"id\": \"D\", \"text\": \"cạnh tranh, chiến lược.\"}]', 'B', 'Xu hướng hiện nay là chuyển từ đối đầu sang hợp tác với đối thủ cạnh tranh.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(75, 2, 43, 'Khi hai hay nhiều tổ chức kết hợp thành một tổ chức, nó được gọi là:', '[{\"id\": \"A\", \"text\": \"Liên doanh.\"}, {\"id\": \"B\", \"text\": \"Cấu trúc linh hoạt.\"}, {\"id\": \"C\", \"text\": \"Cấu trúc cơ học.\"}, {\"id\": \"D\", \"text\": \"Sát nhập.\"}]', 'D', 'Sát nhập (merger) là việc hai hay nhiều tổ chức hợp nhất thành một.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(76, 2, 44, 'Trong một liên doanh giữa công ty lớn và công ty nhỏ, công ty lớn có thể cung cấp tất cả những điều sau đây, ngoại trừ:', '[{\"id\": \"A\", \"text\": \"Bộ phận bán hàng.\"}, {\"id\": \"B\", \"text\": \"Nguồn tài chính.\"}, {\"id\": \"C\", \"text\": \"Các kênh phân phối.\"}, {\"id\": \"D\", \"text\": \"Nhà quản trị cấp cao.\"}]', 'A', 'Trong liên doanh, công ty lớn thường cung cấp tài chính, kênh phân phối, nhân sự cấp cao, nhưng bộ phận bán hàng thường do cả hai bên cùng xây dựng hoặc công ty nhỏ đảm nhận.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(77, 2, 45, 'Vào tháng tư, Molly Madison nhận giải thưởng “người lao động của tháng” tại bộ phận dịch vụ sửa chữa nội bộ. Molly có thể được xem là một phần của môi trường nào sau đây?', '[{\"id\": \"A\", \"text\": \"Môi trường tổng quát.\"}, {\"id\": \"B\", \"text\": \"Môi trường công việc.\"}, {\"id\": \"C\", \"text\": \"Môi trường kinh tế.\"}, {\"id\": \"D\", \"text\": \"Môi trường nội bộ.\"}]', 'D', 'Người lao động là một phần của môi trường nội bộ tổ chức.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(78, 2, 46, '......... của tổ chức là một phần của môi trường nội bộ của tổ chức đó.', '[{\"id\": \"A\", \"text\": \"Khách hàng.\"}, {\"id\": \"B\", \"text\": \"Người bán hàng.\"}, {\"id\": \"C\", \"text\": \"Chỉ số giá tiêu dùng.\"}, {\"id\": \"D\", \"text\": \"Nhà cung cấp.\"}]', 'B', 'Người bán hàng (nhân viên) là một phần của môi trường nội bộ.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(79, 2, 47, 'Văn hóa công ty được định nghĩa là:', '[{\"id\": \"A\", \"text\": \"Một tập hợp các giá trị cơ bản, niềm tin, sự thấu hiểu và các chuẩn mực được chia sẻ bởi các thành viên trong tổ chức.\"}, {\"id\": \"B\", \"text\": \"Mục tiêu, hành động hay các sự kiện được truyền đạt cho nhau.\"}, {\"id\": \"C\", \"text\": \"Một câu chuyện dựa trên sự kiện có thật được lặp lại thường xuyên và chia sẻ giữa các nhân viên trong tổ chức.\"}, {\"id\": \"D\", \"text\": \"Không có câu trả lời đúng.\"}]', 'A', 'Đây là định nghĩa chuẩn xác nhất về văn hóa công ty.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(80, 2, 48, '......... không được nhìn thấy rõ ràng là những yếu tố thiết yếu của văn hóa và nó định hướng mang tính vô thức cho những hành vi và các quyết định?', '[{\"id\": \"A\", \"text\": \"Các giả định và niềm tin cơ bản.\"}, {\"id\": \"B\", \"text\": \"Các khẩu hiệu và các nghi lễ.\"}, {\"id\": \"C\", \"text\": \"Ăn mặc và bố trí văn phòng.\"}, {\"id\": \"D\", \"text\": \"Không có câu trả lời đúng.\"}]', 'A', 'Các giả định và niềm tin cốt lõi thường vô hình, tồn tại trong tiềm thức và định hướng hành vi.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(81, 2, 49, 'Tại cấp độ nào của văn hóa công ty, mà ở đó một số giá trị trở nên gắn kết quá sâu sắc đến nỗi các thành viên không còn nhận thức có tính chủ định về nó?', '[{\"id\": \"A\", \"text\": \"Giá trị vô hình.\"}, {\"id\": \"B\", \"text\": \"Các giả định và niềm tin cơ bản.\"}, {\"id\": \"C\", \"text\": \"Ăn mặc và bố trí văn phòng.\"}, {\"id\": \"D\", \"text\": \"Khẩu hiệu và lễ nghi.\"}]', 'A', 'Khi giá trị đã ăn sâu vào tiềm thức, nó trở thành vô hình và không còn được nhận thức rõ ràng.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(82, 2, 50, '......... có liên quan đến cấp độ bề mặt của văn hóa công ty.', '[{\"id\": \"A\", \"text\": \"Các chuẩn mực.\"}, {\"id\": \"B\", \"text\": \"Cách cư xử.\"}, {\"id\": \"C\", \"text\": \"Các niềm tin.\"}, {\"id\": \"D\", \"text\": \"Tất cả các mô tả trên.\"}]', 'B', 'Cách cư xử (hành vi, giao tiếp) là biểu hiện bề mặt, dễ quan sát của văn hóa.', 'Trung bình', '2026-10-08 02:38:30', '2026-10-08 02:38:30'),
(106, 3, 1, 'Trường phái quản trị đầu tiên là:', '[{\"id\": \"A\", \"text\": \"Trường phái quá trình.\"}, {\"id\": \"B\", \"text\": \"Trường phái Định Lượng.\"}, {\"id\": \"C\", \"text\": \"Trường phái Quản Trị Khoa Học.\"}, {\"id\": \"D\", \"text\": \"Trường phái Thư Lại (hành chính).\"}]', 'C', 'Đây là trường phái đầu tiên, đánh dấu sự ra đời của lý thuyết quản trị chính thức, gắn liền với tên tuổi của F.W. Taylor.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(107, 3, 2, 'Trường phái Quản Trị Khoa Học xuất hiện năm:', '[{\"id\": \"A\", \"text\": \"1910.\"}, {\"id\": \"B\", \"text\": \"1911.\"}, {\"id\": \"C\", \"text\": \"1915.\"}, {\"id\": \"D\", \"text\": \"1916.\"}]', 'B', 'Năm 1911, Frederick Winslow Taylor xuất bản cuốn sách \"Những nguyên tắc quản trị khoa học\", đánh dấu sự ra đời của trường phái này.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(108, 3, 3, 'Các tác giả tiêu biểu trường phái Quản Trị Khoa Học là:', '[{\"id\": \"A\", \"text\": \"F. Taylor, H. Gantt, Frank và Lillian Gilbreth.\"}, {\"id\": \"B\", \"text\": \"F. Taylor, H. Fayol, Max Weber.\"}, {\"id\": \"C\", \"text\": \"F. Taylor, H. Simon, Frank và Lillian Gilbreth.\"}, {\"id\": \"D\", \"text\": \"F. Taylor, H. Fayol và H. Gantt.\"}]', 'A', 'Những cái tên này đều nổi tiếng với các nghiên cứu về tối ưu hóa quy trình làm việc và năng suất lao động.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(109, 3, 4, 'Vấn đề cơ bản của trường phái Quản Trị Khoa Học là:', '[{\"id\": \"A\", \"text\": \"Tâm lý có ảnh hưởng tới năng suất lao động.\"}, {\"id\": \"B\", \"text\": \"Quyền hành phải được cấp dưới thừa nhận.\"}, {\"id\": \"C\", \"text\": \"Áp dụng máy tính vào trong quản lý.\"}, {\"id\": \"D\", \"text\": \"Tiền lương theo mức độ hoàn thành công việc.\"}]', 'D', 'Trường phái này chú trọng đến việc trả lương theo sản phẩm và năng suất để khuyến khích công nhân làm việc hiệu quả.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(110, 3, 5, 'Trường phái Quản Trị Hành Chính đề cập đến vấn đề:', '[{\"id\": \"A\", \"text\": \"Cơ cấu và quyền hành trong tổ chức.\"}, {\"id\": \"B\", \"text\": \"Trả lương theo sản phẩm.\"}, {\"id\": \"C\", \"text\": \"Tiền thưởng vượt định mức.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'A', 'Trường phái này (đại diện là Henry Fayol) tập trung vào việc thiết lập cơ cấu tổ chức và các nguyên tắc quyền hành quản lý.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(111, 3, 6, 'Các lý thuyết về quản trị chính thức xuất hiện trên thế giới vào:', '[{\"id\": \"A\", \"text\": \"Đầu thế kỷ 18\"}, {\"id\": \"B\", \"text\": \"Cuối thế kỷ 18\"}, {\"id\": \"C\", \"text\": \"Đầu thế kỷ 19\"}, {\"id\": \"D\", \"text\": \"Đầu thế kỷ 20\"}]', 'D', 'Các lý thuyết quản trị chính thức (như Taylor, Fayol) ra đời vào đầu thế kỷ 20, đánh dấu bước ngoặt của quản trị học hiện đại.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(112, 3, 7, 'Các trường phái học thuyết quản trị từ đầu thế kỷ 20 đến nay tập trung vào:', '[{\"id\": \"A\", \"text\": \"Nhóm học thuyết cổ điển và tâm lý xã hội.\"}, {\"id\": \"B\", \"text\": \"Nhóm học thuyết định lượng và hiện đại.\"}, {\"id\": \"C\", \"text\": \"Cả 2 câu đều đúng.\"}, {\"id\": \"D\", \"text\": \"Cả 2 câu đều sai.\"}]', 'C', 'Lịch sử quản trị học chia thành nhiều nhóm trường phái khác nhau, bao gồm cả cổ điển, tâm lý xã hội, định lượng và hiện đại.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(113, 3, 8, 'Tác giả tiêu biểu của học thuyết Quản Trị Khoa Học là:', '[{\"id\": \"A\", \"text\": \"F. Taylor (1856-1915)\"}, {\"id\": \"B\", \"text\": \"Henry Gantt (1861-1919)\"}, {\"id\": \"C\", \"text\": \"Ông bà Gilbreth\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'D', 'Cả ba đại diện này đều có những đóng góp quan trọng cho trường phái Quản trị khoa học.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(114, 3, 9, 'Học thuyết quản trị của F.Taylor (1856-1915) đã có những đóng góp đáng kể cho ngành quản trị, cụ thể là:', '[{\"id\": \"A\", \"text\": \"Xác định phương pháp làm việc tối ưu.\"}, {\"id\": \"B\", \"text\": \"Sử dụng hệ thống tiền thưởng.\"}, {\"id\": \"C\", \"text\": \"Trả lương công nhân theo sản phẩm.\"}, {\"id\": \"D\", \"text\": \"Cả a và c đều đúng.\"}]', 'D', 'Taylor nổi tiếng với việc tìm ra \"phương pháp làm việc tốt nhất\" và trả lương theo sản phẩm, nhưng ông cũng bị phê phán vì không chú trọng đủ đến yếu tố tâm lý (đáp án b không hoàn toàn chính xác trong bối cảnh đóng góp cốt lõi).', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(115, 3, 10, 'Henry Gantt (1861-1919) đã đóng góp vào học thuyết quản trị cổ điển với các nội dung:', '[{\"id\": \"A\", \"text\": \"Loại bỏ các thao tác thừa của công nhân.\"}, {\"id\": \"B\", \"text\": \"Trả lương theo sản phẩm kết hợp với hệ thống tiền thưởng.\"}, {\"id\": \"C\", \"text\": \"Cả 2 câu đều đúng.\"}, {\"id\": \"D\", \"text\": \"Cả 2 câu đều sai.\"}]', 'B', 'Gantt nổi tiếng với biểu đồ Gantt và hệ thống trả lương theo sản phẩm kèm thưởng (Gantt chart & task and bonus system).', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(116, 3, 11, 'Trong học thuyết quản trị của mình, Henry Fayol (1841-1925) đã đưa ra:', '[{\"id\": \"A\", \"text\": \"4 công việc của doanh nghiệp và 14 nguyên tắc quản trị.\"}, {\"id\": \"B\", \"text\": \"5 công việc của doanh nghiệp và 14 nguyên tắc quản trị.\"}, {\"id\": \"C\", \"text\": \"6 công việc của doanh nghiệp và 14 nguyên tắc quản trị.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'B', 'Fayol chia hoạt động doanh nghiệp thành 6 nhóm (kỹ thuật, thương mại, tài chính, an ninh, kế toán, quản trị) và đề ra 14 nguyên tắc quản trị.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(117, 3, 12, 'Theo lý thuyết của Max Weber (1861-1920), ông yêu cầu phải xây dựng một tổ chức hợp lý và đặt tên cho tổ chức này là:', '[{\"id\": \"A\", \"text\": \"Tổ chức thư lại.\"}, {\"id\": \"B\", \"text\": \"Tổ chức độc lập.\"}, {\"id\": \"C\", \"text\": \"Tổ chức trật tự.\"}, {\"id\": \"D\", \"text\": \"Tổ chức công bằng.\"}]', 'A', 'Max Weber nổi tiếng với mô hình \"Bureaucracy\" (tổ chức quan liêu/thư lại) dựa trên các quy tắc hợp lý và thứ bậc quyền lực.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(118, 3, 13, 'Elton Mayo (1880-1949) đã chỉ ra yếu tố tác động đến năng suất của người công nhân là:', '[{\"id\": \"A\", \"text\": \"Ánh sáng làm việc.\"}, {\"id\": \"B\", \"text\": \"Tiền lương và tiền thưởng.\"}, {\"id\": \"C\", \"text\": \"Lợi ích tâm lý xã hội.\"}, {\"id\": \"D\", \"text\": \"Điều kiện làm việc.\"}]', 'C', 'Qua thí nghiệm Hawthorne, Mayo khám phá ra rằng các yếu tố tâm lý xã hội (như sự quan tâm, quan hệ nhóm) có ảnh hưởng lớn hơn cả điều kiện vật chất đến năng suất.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(119, 3, 14, 'Douglas Mc.Gregor (1909-1964) đã xây dựng giả thuyết về người lao động, bao gồm:', '[{\"id\": \"A\", \"text\": \"Thuyết X và Y.\"}, {\"id\": \"B\", \"text\": \"Thuyết X và Z.\"}, {\"id\": \"C\", \"text\": \"Thuyết Y và Z.\"}, {\"id\": \"D\", \"text\": \"Không có câu nào đúng.\"}]', 'A', 'McGregor nổi tiếng với hai quan điểm về bản chất con người: Thuyết X (con người lười biếng, cần kiểm soát) và Thuyết Y (con người thích làm việc, tự giác).', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11');
INSERT INTO `questions` (`id`, `document_id`, `order`, `content`, `options`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`) VALUES
(120, 3, 15, 'Lý thuyết định lượng trong quản trị được áp dụng trong việc:', '[{\"id\": \"A\", \"text\": \"Xác định kết quả hoạt động của doanh nghiệp.\"}, {\"id\": \"B\", \"text\": \"Ra quyết định của doanh nghiệp.\"}, {\"id\": \"C\", \"text\": \"Cả a và b đúng.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều sai.\"}]', 'B', 'Trường phái định lượng sử dụng các mô hình toán học, thống kê để hỗ trợ việc ra quyết định quản trị chính xác hơn.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(121, 3, 16, 'Theo khảo hướng quản trị theo quá trình, quá trình quản trị trong các tổ chức liên quan đến:', '[{\"id\": \"A\", \"text\": \"4 chức năng cơ bản.\"}, {\"id\": \"B\", \"text\": \"5 chức năng cơ bản.\"}, {\"id\": \"C\", \"text\": \"6 chức năng cơ bản.\"}, {\"id\": \"D\", \"text\": \"7 chức năng cơ bản.\"}]', 'A', 'Quản trị theo quá trình (Henri Fayol) thường được chia thành 4 chức năng: Hoạch định, Tổ chức, Lãnh đạo và Kiểm soát.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(122, 3, 17, 'Các tác giả tiêu biểu của trường phái Hành Chính là:', '[{\"id\": \"A\", \"text\": \"F. Taylor và H. Gantt.\"}, {\"id\": \"B\", \"text\": \"H. Fayol và M. Weber.\"}, {\"id\": \"C\", \"text\": \"F. Taylor và M. Weber.\"}, {\"id\": \"D\", \"text\": \"H. Gantt và H. Fayol.\"}]', 'B', 'Trường phái Hành chính (hay Quản trị hành chính) gắn liền với Henry Fayol và Max Weber.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(123, 3, 18, 'H.Fayol đề ra bao nhiêu nguyên tắc của quản trị:', '[{\"id\": \"A\", \"text\": \"10.\"}, {\"id\": \"B\", \"text\": \"12.\"}, {\"id\": \"C\", \"text\": \"14.\"}, {\"id\": \"D\", \"text\": \"16.\"}]', 'C', 'Henry Fayol đã đúc kết 14 nguyên tắc quản trị chung, được xem là nền tảng của quản trị học cổ điển.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(124, 3, 19, 'Các tác giả tiêu biểu của trường phái Tâm Lý – Xã Hội là:', '[{\"id\": \"A\", \"text\": \"H. Fayol và H. Gantt.\"}, {\"id\": \"B\", \"text\": \"Mary Parker Follett và Elton Mayo.\"}, {\"id\": \"C\", \"text\": \"Mary Parker Follett và H. Fayol.\"}, {\"id\": \"D\", \"text\": \"Không câu nào đúng.\"}]', 'B', 'Mary Parker Follett và Elton Mayo là hai đại diện tiêu biểu cho trường phái tâm lý - xã hội trong quản trị.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(125, 3, 20, 'Thuyết Z và kỹ thuật quản lý của Nhật Bản đặc biệt quan tâm đến quan hệ xã hội và yếu tố:', '[{\"id\": \"A\", \"text\": \"Tài chính.\"}, {\"id\": \"B\", \"text\": \"Con người.\"}, {\"id\": \"C\", \"text\": \"Máy móc thiết bị.\"}, {\"id\": \"D\", \"text\": \"Công nghệ.\"}]', 'B', 'Thuyết Z (William Ouchi) nhấn mạnh vào việc quản lý bằng con người, xây dựng mối quan hệ tin cậy, khuyến khích sự tham gia và làm việc nhóm.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(126, 3, 21, 'Vai trò của quản trị trong giai đoạn cuối thế kỷ 18 đến những năm 1930 là:', '[{\"id\": \"A\", \"text\": \"Tối đa hóa lợi nhuận.\"}, {\"id\": \"B\", \"text\": \"Tập trung sản xuất.\"}, {\"id\": \"C\", \"text\": \"Nâng cao năng suất lao động.\"}, {\"id\": \"D\", \"text\": \"Phát triển hoạt động sản xuất kinh doanh.\"}]', 'A', 'Trong giai đoạn này (thời kỳ cách mạng công nghiệp và quản trị cổ điển), mục tiêu chính của quản trị là tối đa hóa lợi nhuận thông qua tăng năng suất và hiệu quả.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(127, 3, 22, 'Theo Hugo Munsterberg, năng suất lao động bị chi phối bởi:', '[{\"id\": \"A\", \"text\": \"Khoa học kỹ thuật hiện đại.\"}, {\"id\": \"B\", \"text\": \"Máy móc thiết bị tốt.\"}, {\"id\": \"C\", \"text\": \"Tác phong lao động.\"}, {\"id\": \"D\", \"text\": \"Người sử dụng lao động.\"}]', 'C', 'Munsterberg (cha đẻ của tâm lý học công nghiệp) cho rằng tác phong và yếu tố tâm lý của người lao động ảnh hưởng trực tiếp đến năng suất.', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(128, 3, 23, 'Theo Chester Barnard (1886-1961), tổ chức là một hệ thống hợp pháp với yếu tố:', '[{\"id\": \"A\", \"text\": \"Có mục tiêu chung.\"}, {\"id\": \"B\", \"text\": \"Có sự thông đạt cần thiết.\"}, {\"id\": \"C\", \"text\": \"Sẵn sàng hợp tác.\"}, {\"id\": \"D\", \"text\": \"Tất cả đều đúng.\"}]', 'D', 'Barnard định nghĩa tổ chức là một hệ thống hợp tác bao gồm 3 yếu tố: mục tiêu chung, sự sẵn sàng hợp tác và hệ thống thông tin liên lạc (thông đạt).', 'Trung bình', '2026-10-08 02:40:11', '2026-10-08 02:40:11'),
(129, 4, 1, 'Thuật ngữ khoa học kinh tế chính trị lần đầu tiên xuất hiện ở đâu?', '[{\"id\": \"A\", \"text\": \"Châu Mỹ\"}, {\"id\": \"B\", \"text\": \"Châu Á\"}, {\"id\": \"C\", \"text\": \"Châu Âu\\nGiải thích: Thuật ngữ \\\"kinh tế chính trị\\\" (political economy) xuất hiện lần đầu ở châu Âu vào năm 1615.\"}, {\"id\": \"D\", \"text\": \"Châu Phi\"}]', 'C', 'Thuật ngữ \"kinh tế chính trị\" (political economy) xuất hiện lần đầu ở châu Âu vào năm 1615.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(130, 4, 2, 'Ai là tác giả của tác phẩm \'Chuyên luận về kinh tế chính trị\'?', '[{\"id\": \"A\", \"text\": \"Adam Smith\"}, {\"id\": \"B\", \"text\": \"David Ricardo\"}, {\"id\": \"C\", \"text\": \"A. Montchretien\\nGiải thích: A. Montchretien là người đã đưa ra thuật ngữ này trong tác phẩm của mình.\"}, {\"id\": \"D\", \"text\": \"Karl Marx\"}]', 'C', 'A. Montchretien là người đã đưa ra thuật ngữ này trong tác phẩm của mình.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(131, 4, 3, 'Chủ nghĩa trọng thương tập trung nghiên cứu vào lĩnh vực nào?', '[{\"id\": \"A\", \"text\": \"Sản xuất\"}, {\"id\": \"B\", \"text\": \"Lưu thông\\nGiải thích: Chủ nghĩa trọng thương cho rằng nguồn gốc của cải là từ lưu thông (thương mại).\"}, {\"id\": \"C\", \"text\": \"Tài chính\"}, {\"id\": \"D\", \"text\": \"Nông nghiệp\"}]', 'B', 'Chủ nghĩa trọng thương cho rằng nguồn gốc của cải là từ lưu thông (thương mại).', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(132, 4, 4, 'Chủ nghĩa trọng nông hướng việc nghiên cứu vào lĩnh vực nào?', '[{\"id\": \"A\", \"text\": \"Lưu thông\"}, {\"id\": \"B\", \"text\": \"Sản xuất\\nGiải thích: Chủ nghĩa trọng nông chuyển hướng nghiên cứu vào lĩnh vực sản xuất, đặc biệt là nông nghiệp.\"}, {\"id\": \"C\", \"text\": \"Tiền tệ\"}, {\"id\": \"D\", \"text\": \"Thương mại\"}]', 'B', 'Chủ nghĩa trọng nông chuyển hướng nghiên cứu vào lĩnh vực sản xuất, đặc biệt là nông nghiệp.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(133, 4, 5, 'Kinh tế chính trị cổ điển Anh được hình thành và phát triển trong khoảng thời gian nào?', '[{\"id\": \"A\", \"text\": \"Đầu thế kỷ XV đến giữa thế kỷ XVII\"}, {\"id\": \"B\", \"text\": \"Giữa thế kỷ XV đến nửa cuối thế kỷ XVII\"}, {\"id\": \"C\", \"text\": \"Cuối thế kỷ XVIII đến nửa đầu thế kỷ XIX\\nGiải thích: Đây là giai đoạn hình thành và phát triển rực rỡ của kinh tế chính trị cổ điển Anh.\"}, {\"id\": \"D\", \"text\": \"Nửa cuối thế kỷ XVII đến nửa đầu thế kỷ XVIII\"}]', 'C', 'Đây là giai đoạn hình thành và phát triển rực rỡ của kinh tế chính trị cổ điển Anh.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(134, 4, 6, 'Ai là người được xem là tiền bối lớn nhất của kinh tế chính trị cổ điển Anh với nhiều công trình nghiên cứu đồ sộ?', '[{\"id\": \"A\", \"text\": \"W.Petty\"}, {\"id\": \"B\", \"text\": \"A.Smith\\nGiải thích: Adam Smith được coi là cha đẻ của kinh tế học cổ điển.\"}, {\"id\": \"C\", \"text\": \"D.Ricardo\"}, {\"id\": \"D\", \"text\": \"Karl Marx\"}]', 'B', 'Adam Smith được coi là cha đẻ của kinh tế học cổ điển.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(135, 4, 7, 'Kinh tế chính trị là môn khoa học kinh tế nghiên cứu về điều gì?', '[{\"id\": \"A\", \"text\": \"Các hiện tượng tự nhiên\"}, {\"id\": \"B\", \"text\": \"Các quy luật chi phối sự vận động của các hiện tượng và quá trình hoạt động kinh tế\\nGiải thích: Đây là định nghĩa chung về đối tượng nghiên cứu của kinh tế chính trị.\"}, {\"id\": \"C\", \"text\": \"Các quy luật vật lý\"}, {\"id\": \"D\", \"text\": \"Các quy luật hóa học\"}]', 'B', 'Đây là định nghĩa chung về đối tượng nghiên cứu của kinh tế chính trị.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(136, 4, 8, 'Lý luận kinh tế chính trị chia thành hai dòng chính kể từ sau ai?', '[{\"id\": \"A\", \"text\": \"D.Ricardo\"}, {\"id\": \"B\", \"text\": \"Adam Smith\\nGiải thích: Sau Adam Smith, lý luận kinh tế chính trị phát triển theo nhiều dòng khác nhau.\"}, {\"id\": \"C\", \"text\": \"Karl Marx\"}, {\"id\": \"D\", \"text\": \"V.I.Lenin\"}]', 'B', 'Sau Adam Smith, lý luận kinh tế chính trị phát triển theo nhiều dòng khác nhau.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(137, 4, 9, 'Bộ \'Tư bản\' của C.Mác tập trung trình bày về điều gì?', '[{\"id\": \"A\", \"text\": \"Các vấn đề chính trị\"}, {\"id\": \"B\", \"text\": \"Các phạm trù cơ bản của nền kinh tế thị trường tư bản chủ nghĩa\\nGiải thích: Bộ Tư bản phân tích các phạm trù kinh tế của chủ nghĩa tư bản.\"}, {\"id\": \"C\", \"text\": \"Các vấn đề văn hóa\"}, {\"id\": \"D\", \"text\": \"Các vấn đề xã hội\"}]', 'B', 'Bộ Tư bản phân tích các phạm trù kinh tế của chủ nghĩa tư bản.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(138, 4, 10, 'Đâu là một trong ba bộ phận cấu thành của chủ nghĩa Mác?', '[{\"id\": \"A\", \"text\": \"Triết học Mác-Lênin\"}, {\"id\": \"B\", \"text\": \"Kinh tế chính trị Mác-Lênin\"}, {\"id\": \"C\", \"text\": \"Chủ nghĩa xã hội khoa học\"}, {\"id\": \"D\", \"text\": \"Cả A, B và C đều đúng\\nGiải thích: Chủ nghĩa Mác gồm 3 bộ phận: Triết học, Kinh tế chính trị và Chủ nghĩa xã hội khoa học.\"}]', 'D', 'Chủ nghĩa Mác gồm 3 bộ phận: Triết học, Kinh tế chính trị và Chủ nghĩa xã hội khoa học.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(139, 4, 11, 'Điểm nổi bật trong đóng góp của V.I.Lênin vào lý luận kinh tế chính trị là gì?', '[{\"id\": \"A\", \"text\": \"Nghiên cứu về giá trị thặng dư\"}, {\"id\": \"B\", \"text\": \"Nghiên cứu về độc quyền và độc quyền nhà nước trong chủ nghĩa tư bản\\nGiải thích: Lênin có đóng góp lớn trong lý luận về chủ nghĩa tư bản độc quyền.\"}, {\"id\": \"C\", \"text\": \"Nghiên cứu về tiền tệ\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu về sản xuất\"}]', 'B', 'Lênin có đóng góp lớn trong lý luận về chủ nghĩa tư bản độc quyền.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(140, 4, 12, 'Kinh tế chính trị Mác - Lênin có nguồn gốc từ đâu?', '[{\"id\": \"A\", \"text\": \"Các nước phương Đông\"}, {\"id\": \"B\", \"text\": \"Các nước châu Phi\"}, {\"id\": \"C\", \"text\": \"Sự kế thừa và phát triển những giá trị khoa học kinh tế chính trị của nhân loại trước đó\\nGiải thích: Kinh tế chính trị Mác - Lênin kế thừa tinh hoa của nhân loại, đặc biệt là kinh tế chính trị cổ điển Anh.\"}, {\"id\": \"D\", \"text\": \"Các nước Mỹ Latinh\"}]', 'C', 'Kinh tế chính trị Mác - Lênin kế thừa tinh hoa của nhân loại, đặc biệt là kinh tế chính trị cổ điển Anh.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(141, 4, 13, 'Theo A.Smith, mục tiêu của kinh tế chính trị là gì?', '[{\"id\": \"A\", \"text\": \"Tạo ra nguồn thu nhập dồi dào và sinh kế phong phú cho người dân\\nGiải thích: Adam Smith nhấn mạnh mục tiêu mang lại sự thịnh vượng cho quốc gia và nhân dân.\"}, {\"id\": \"B\", \"text\": \"Nghiên cứu về tiền tệ\"}, {\"id\": \"C\", \"text\": \"Nghiên cứu về sản xuất\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu về thị trường\"}]', 'A', 'Adam Smith nhấn mạnh mục tiêu mang lại sự thịnh vượng cho quốc gia và nhân dân.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(142, 4, 14, 'Đối tượng nghiên cứu của kinh tế chính trị Mác - Lênin là gì?', '[{\"id\": \"A\", \"text\": \"Các yếu tố vật chất của lực lượng sản xuất\"}, {\"id\": \"B\", \"text\": \"Các quan hệ của sản xuất và trao đổi trong phương thức sản xuất\\nGiải thích: Đối tượng là các quan hệ xã hội của sản xuất và trao đổi.\"}, {\"id\": \"C\", \"text\": \"Các vấn đề chính trị\"}, {\"id\": \"D\", \"text\": \"Các vấn đề văn hóa\"}]', 'B', 'Đối tượng là các quan hệ xã hội của sản xuất và trao đổi.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(143, 4, 15, 'C.Mác thể hiện rõ nhất cách tiếp cận đối tượng nghiên cứu của mình trong tác phẩm nào?', '[{\"id\": \"A\", \"text\": \"Tuyên ngôn của Đảng Cộng sản\"}, {\"id\": \"B\", \"text\": \"Tư bản\\nGiải thích: Bộ Tư bản là tác phẩm thể hiện rõ nhất phương pháp tiếp cận của Mác.\"}, {\"id\": \"C\", \"text\": \"Hệ tư tưởng Đức\"}, {\"id\": \"D\", \"text\": \"Góp phần phê phán triết học pháp quyền của Hegel\"}]', 'B', 'Bộ Tư bản là tác phẩm thể hiện rõ nhất phương pháp tiếp cận của Mác.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(144, 4, 16, 'Theo Ph.Ăngghen, kinh tế chính trị theo nghĩa rộng là gì?', '[{\"id\": \"A\", \"text\": \"Khoa học về các quy luật chi phối sự sản xuất và trao đổi tư liệu sản xuất\"}, {\"id\": \"B\", \"text\": \"Khoa học về các quy luật chi phối sự sản xuất vật chất và sự trao đổi những tư liệu sinh hoạt vật chất trong xã hội loài người\\nGiải thích: Định nghĩa của Ăngghen về kinh tế chính trị theo nghĩa rộng.\"}, {\"id\": \"C\", \"text\": \"Khoa học về các quy luật chính trị\"}, {\"id\": \"D\", \"text\": \"Khoa học về các quy luật văn hóa\"}]', 'B', 'Định nghĩa của Ăngghen về kinh tế chính trị theo nghĩa rộng.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(145, 4, 17, 'V.I.Lênin nhấn mạnh điều gì về kinh tế chính trị?', '[{\"id\": \"A\", \"text\": \"Kinh tế chính trị nghiên cứu sự sản xuất\"}, {\"id\": \"B\", \"text\": \"Kinh tế chính trị không nghiên cứu sự sản xuất mà nghiên cứu những quan hệ xã hội giữa người với người trong sản xuất, nghiên cứu chế độ xã hội của sản xuất\\nGiải thích: Lênin nhấn mạnh đối tượng là các quan hệ xã hội, không phải kỹ thuật sản xuất.\"}, {\"id\": \"C\", \"text\": \"Kinh tế chính trị nghiên cứu các vấn đề chính trị\"}, {\"id\": \"D\", \"text\": \"Kinh tế chính trị nghiên cứu các vấn đề văn hóa\"}]', 'B', 'Lênin nhấn mạnh đối tượng là các quan hệ xã hội, không phải kỹ thuật sản xuất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(146, 4, 18, 'Khi xác định đối tượng nghiên cứu, kinh tế chính trị Mác - Lênin đặt các quan hệ xã hội của sản xuất và trao đổi trong mối liên hệ với yếu tố nào?', '[{\"id\": \"A\", \"text\": \"Trình độ của lực lượng sản xuất và kiến trúc thượng tầng tương ứng\\nGiải thích: Các quan hệ sản xuất luôn gắn với trình độ lực lượng sản xuất và kiến trúc thượng tầng.\"}, {\"id\": \"B\", \"text\": \"Các yếu tố tự nhiên\"}, {\"id\": \"C\", \"text\": \"Các yếu tố văn hóa\"}, {\"id\": \"D\", \"text\": \"Các yếu tố chính trị\"}]', 'A', 'Các quan hệ sản xuất luôn gắn với trình độ lực lượng sản xuất và kiến trúc thượng tầng.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(147, 4, 19, 'Trong các công trình nghiên cứu của kinh tế chính trị Mác - Lênin thuộc hệ thống các nước xã hội chủ nghĩa trước đây, đối tượng nghiên cứu thường được nhấn mạnh là gì?', '[{\"id\": \"A\", \"text\": \"Quan hệ sở hữu\"}, {\"id\": \"B\", \"text\": \"Quan hệ sản xuất\\nGiải thích: Các nước XHCN trước đây thường nhấn mạnh quan hệ sản xuất.\"}, {\"id\": \"C\", \"text\": \"Quan hệ phân phối\"}, {\"id\": \"D\", \"text\": \"Quan hệ trao đổi\"}]', 'B', 'Các nước XHCN trước đây thường nhấn mạnh quan hệ sản xuất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(148, 4, 20, 'Điều gì thể hiện sự nhất quán trong quan điểm của V.I.Lênin với quan điểm của C.Mác và Ph.Ăngghen về đối tượng nghiên cứu của kinh tế chính trị?', '[{\"id\": \"A\", \"text\": \"Nghiên cứu về sự phát triển của lực lượng sản xuất\"}, {\"id\": \"B\", \"text\": \"Nghiên cứu về các quy luật tự nhiên\"}, {\"id\": \"C\", \"text\": \"Kinh tế chính trị không nghiên cứu sự sản xuất mà nghiên cứu những quan hệ xã hội giữa người với người trong sản xuất, nghiên cứu chế độ xã hội của sản xuất\\nGiải thích: Sự nhất quán trong việc xác định đối tượng nghiên cứu.\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu về kiến trúc thượng tầng\"}]', 'C', 'Sự nhất quán trong việc xác định đối tượng nghiên cứu.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(149, 4, 21, 'Theo nghĩa hẹp, kinh tế chính trị là khoa học kinh tế nghiên cứu về điều gì?', '[{\"id\": \"A\", \"text\": \"Các quan hệ sản xuất và trao đổi trong một phương thức sản xuất nhất định\\nGiải thích: Theo nghĩa hẹp, kinh tế chính trị nghiên cứu quan hệ sản xuất và trao đổi.\"}, {\"id\": \"B\", \"text\": \"Các quy luật tự nhiên\"}, {\"id\": \"C\", \"text\": \"Các vấn đề chính trị\"}, {\"id\": \"D\", \"text\": \"Các vấn đề văn hóa\"}]', 'A', 'Theo nghĩa hẹp, kinh tế chính trị nghiên cứu quan hệ sản xuất và trao đổi.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(150, 4, 22, 'Đâu là một trong những hạn chế của chủ nghĩa trọng nông?', '[{\"id\": \"A\", \"text\": \"Nghiên cứu sâu về lĩnh vực lưu thông\"}, {\"id\": \"B\", \"text\": \"Cho rằng chỉ có nông nghiệp mới là sản xuất\\nGiải thích: Hạn chế lớn nhất của trọng nông là chỉ coi nông nghiệp là ngành sản xuất duy nhất.\"}, {\"id\": \"C\", \"text\": \"Nghiên cứu về tiền tệ\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu về giá trị\"}]', 'B', 'Hạn chế lớn nhất của trọng nông là chỉ coi nông nghiệp là ngành sản xuất duy nhất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(151, 4, 23, 'Kinh tế chính trị Mác - Lênin không xem nhẹ điều gì trong quá trình nghiên cứu?', '[{\"id\": \"A\", \"text\": \"Các quan hệ chính trị\"}, {\"id\": \"B\", \"text\": \"Các quan hệ kinh tế khách quan giữa các quá trình kinh tế trong một khâu và giữa các khâu của quá trình tái sản xuất xã hội\\nGiải thích: Kinh tế chính trị Mác - Lênin nghiên cứu toàn diện các khâu của tái sản xuất.\"}, {\"id\": \"C\", \"text\": \"Các quan hệ văn hóa\"}, {\"id\": \"D\", \"text\": \"Các quan hệ xã hội\"}]', 'B', 'Kinh tế chính trị Mác - Lênin nghiên cứu toàn diện các khâu của tái sản xuất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(152, 4, 24, 'Đối tượng nghiên cứu của kinh tế chính trị Mác - Lênin được khái quát như thế nào?', '[{\"id\": \"A\", \"text\": \"Các quan hệ xã hội của sản xuất và trao đổi mà các quan hệ này được đặt trong sự liên hệ biện chứng với trình độ phát triển của lực lượng sản xuất và kiến trúc thượng tầng tương ứng của phương thức sản xuất nhất định\\nGiải thích: Đây là khái quát đầy đủ và chính xác nhất.\"}, {\"id\": \"B\", \"text\": \"Các quy luật tự nhiên\"}, {\"id\": \"C\", \"text\": \"Các vấn đề chính trị\"}, {\"id\": \"D\", \"text\": \"Các vấn đề văn hóa\"}]', 'A', 'Đây là khái quát đầy đủ và chính xác nhất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(153, 4, 25, 'Đâu không phải là một bộ phận của quan hệ xã hội của sản xuất và trao đổi?', '[{\"id\": \"A\", \"text\": \"Quan hệ sở hữu\"}, {\"id\": \"B\", \"text\": \"Quan hệ quản lý\"}, {\"id\": \"C\", \"text\": \"Quan hệ tiêu dùng\"}, {\"id\": \"D\", \"text\": \"Quan hệ tôn giáo\\nGiải thích: Tôn giáo thuộc kiến trúc thượng tầng, không phải quan hệ sản xuất và trao đổi.\"}]', 'D', 'Tôn giáo thuộc kiến trúc thượng tầng, không phải quan hệ sản xuất và trao đổi.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(154, 4, 26, 'Thuật ngữ \'khoa học kinh tế chính trị\' xuất hiện lần đầu tiên ở châu Âu vào năm nào?', '[{\"id\": \"A\", \"text\": \"1615\\nGiải thích: Năm 1615, A. Montchretien dùng thuật ngữ này.\"}, {\"id\": \"B\", \"text\": \"1776\"}, {\"id\": \"C\", \"text\": \"1848\"}, {\"id\": \"D\", \"text\": \"1917\"}]', 'A', 'Năm 1615, A. Montchretien dùng thuật ngữ này.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(155, 4, 27, 'Ai là người đề xuất môn khoa học mới - môn kinh tế chính trị trong tác phẩm \'Chuyên luận về kinh tế chính trị\'?', '[{\"id\": \"A\", \"text\": \"Adam Smith\"}, {\"id\": \"B\", \"text\": \"David Ricardo\"}, {\"id\": \"C\", \"text\": \"A. Montchretien\\nGiải thích: Ông là người đầu tiên đề xuất môn học này.\"}, {\"id\": \"D\", \"text\": \"Karl Marx\"}]', 'C', 'Ông là người đầu tiên đề xuất môn học này.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(156, 4, 28, 'Kinh tế chính trị chính thức trở thành một môn học với các phạm trù và khái niệm chuyên ngành vào thế kỷ nào?', '[{\"id\": \"A\", \"text\": \"XVI\"}, {\"id\": \"B\", \"text\": \"XVII\"}, {\"id\": \"C\", \"text\": \"XVIII\\nGiải thích: Đến thế kỷ XVIII, kinh tế chính trị mới trở thành môn học chính thức.\"}, {\"id\": \"D\", \"text\": \"XIX\"}]', 'C', 'Đến thế kỷ XVIII, kinh tế chính trị mới trở thành môn học chính thức.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(157, 4, 29, 'Chủ nghĩa trọng thương tập trung nghiên cứu vào lĩnh vực nào?', '[{\"id\": \"A\", \"text\": \"Sản xuất\"}, {\"id\": \"B\", \"text\": \"Lưu thông\\nGiải thích: Trọng thương coi trọng thương mại, lưu thông hàng hóa.\"}, {\"id\": \"C\", \"text\": \"Tiêu dùng\"}, {\"id\": \"D\", \"text\": \"Phân phối\"}]', 'B', 'Trọng thương coi trọng thương mại, lưu thông hàng hóa.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(158, 4, 30, 'Chủ nghĩa trọng nông hướng việc nghiên cứu vào lĩnh vực nào?', '[{\"id\": \"A\", \"text\": \"Thương nghiệp\"}, {\"id\": \"B\", \"text\": \"Lưu thông\"}, {\"id\": \"C\", \"text\": \"Sản xuất\\nGiải thích: Trọng nông hướng vào sản xuất nông nghiệp.\"}, {\"id\": \"D\", \"text\": \"Tiêu dùng\"}]', 'C', 'Trọng nông hướng vào sản xuất nông nghiệp.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(159, 4, 31, 'Kinh tế chính trị cổ điển Anh được hình thành và phát triển trong khoảng thời gian nào?', '[{\"id\": \"A\", \"text\": \"Từ đầu thế kỷ XVII đến cuối thế kỷ XVIII\"}, {\"id\": \"B\", \"text\": \"Từ cuối thế kỷ XVIII đến nửa đầu thế kỷ XIX\\nGiải thích: Đây là thời kỳ đỉnh cao của kinh tế chính trị cổ điển Anh.\"}, {\"id\": \"C\", \"text\": \"Từ giữa thế kỷ XIX đến đầu thế kỷ XX\"}, {\"id\": \"D\", \"text\": \"Từ đầu thế kỷ XX đến nay\"}]', 'B', 'Đây là thời kỳ đỉnh cao của kinh tế chính trị cổ điển Anh.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(160, 4, 32, 'Ai là người mở đầu cho các quan điểm lý luận của kinh tế chính trị cổ điển Anh?', '[{\"id\": \"A\", \"text\": \"Adam Smith\"}, {\"id\": \"B\", \"text\": \"David Ricardo\"}, {\"id\": \"C\", \"text\": \"W. Petty\\nGiải thích: W. Petty được coi là người mở đầu cho kinh tế chính trị cổ điển Anh.\"}, {\"id\": \"D\", \"text\": \"Karl Marx\"}]', 'C', 'W. Petty được coi là người mở đầu cho kinh tế chính trị cổ điển Anh.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(161, 4, 33, 'Theo nghĩa rộng, kinh tế chính trị được Ph.Ăngghen định nghĩa là gì?', '[{\"id\": \"A\", \"text\": \"Khoa học về sự giàu có của các quốc gia\"}, {\"id\": \"B\", \"text\": \"Khoa học về các quy luật chi phối sản xuất và trao đổi vật chất trong xã hội loài người\\nGiải thích: Định nghĩa của Ăngghen.\"}, {\"id\": \"C\", \"text\": \"Khoa học về sự phân phối của cải trong xã hội\"}, {\"id\": \"D\", \"text\": \"Khoa học về quản lý kinh tế nhà nước\"}]', 'B', 'Định nghĩa của Ăngghen.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(162, 4, 34, 'Đối tượng nghiên cứu của kinh tế chính trị Mác - Lênin là gì?', '[{\"id\": \"A\", \"text\": \"Các quy luật tự nhiên chi phối hoạt động kinh tế\"}, {\"id\": \"B\", \"text\": \"Các quan hệ xã hội của sản xuất và trao đổi\\nGiải thích: Đối tượng là các quan hệ xã hội trong sản xuất và trao đổi.\"}, {\"id\": \"C\", \"text\": \"Các chính sách kinh tế của nhà nước\"}, {\"id\": \"D\", \"text\": \"Các hoạt động của doanh nghiệp\"}]', 'B', 'Đối tượng là các quan hệ xã hội trong sản xuất và trao đổi.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(163, 4, 35, 'Kinh tế chính trị Mác - Lênin không nghiên cứu về điều gì?', '[{\"id\": \"A\", \"text\": \"Các quan hệ xã hội giữa người với người trong sản xuất\"}, {\"id\": \"B\", \"text\": \"Chế độ xã hội của sản xuất\"}, {\"id\": \"C\", \"text\": \"Biểu hiện kỹ thuật của sự sản xuất\\nGiải thích: Kinh tế chính trị không nghiên cứu kỹ thuật sản xuất.\"}, {\"id\": \"D\", \"text\": \"Quan hệ giữa sản xuất và lưu thông\"}]', 'C', 'Kinh tế chính trị không nghiên cứu kỹ thuật sản xuất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(164, 4, 36, 'Trong các yếu tố sau, yếu tố nào không thuộc đối tượng nghiên cứu của kinh tế chính trị Mác - Lênin?', '[{\"id\": \"A\", \"text\": \"Quan hệ sở hữu\"}, {\"id\": \"B\", \"text\": \"Quan hệ quản lý\"}, {\"id\": \"C\", \"text\": \"Quan hệ phân phối\"}, {\"id\": \"D\", \"text\": \"Yếu tố vật chất của lực lượng sản xuất\\nGiải thích: Lực lượng sản xuất (vật chất) không thuộc đối tượng nghiên cứu trực tiếp.\"}]', 'D', 'Lực lượng sản xuất (vật chất) không thuộc đối tượng nghiên cứu trực tiếp.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(165, 4, 37, 'Mục đích nghiên cứu cao nhất của kinh tế chính trị Mác - Lênin là gì?', '[{\"id\": \"A\", \"text\": \"Thúc đẩy tăng trưởng kinh tế\"}, {\"id\": \"B\", \"text\": \"Phát hiện ra các quy luật chi phối quan hệ giữa người với người trong sản xuất và trao đổi\\nGiải thích: Mục đích cao nhất là tìm ra quy luật vận động.\"}, {\"id\": \"C\", \"text\": \"Xây dựng các chính sách kinh tế hiệu quả\"}, {\"id\": \"D\", \"text\": \"Giải thích các hiện tượng kinh tế\"}]', 'B', 'các hiện tượng kinh tế\nĐáp án đúng: B. Phát hiện ra các quy luật chi phối quan hệ giữa người với người trong sản xuất và trao đổi\nGiải thích: Mục đích cao nhất là tìm ra quy luật vận động.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(166, 4, 38, 'Điều gì phân biệt quy luật kinh tế và chính sách kinh tế?', '[{\"id\": \"A\", \"text\": \"Quy luật kinh tế mang tính chủ quan, chính sách kinh tế mang tính khách quan\"}, {\"id\": \"B\", \"text\": \"Quy luật kinh tế mang tính khách quan, chính sách kinh tế mang tính chủ quan\\nGiải thích: Quy luật là khách quan, chính sách do con người tạo ra (chủ quan).\"}, {\"id\": \"C\", \"text\": \"Quy luật kinh tế do nhà nước ban hành, chính sách kinh tế do thị trường quyết định\"}, {\"id\": \"D\", \"text\": \"Quy luật kinh tế tác động trực tiếp đến sản xuất, chính sách kinh tế tác động đến tiêu dùng\"}]', 'B', 'Quy luật là khách quan, chính sách do con người tạo ra (chủ quan).', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(167, 4, 39, 'Phương pháp nghiên cứu chủ yếu của kinh tế chính trị Mác - Lênin là gì?', '[{\"id\": \"A\", \"text\": \"Thực nghiệm\"}, {\"id\": \"B\", \"text\": \"Thống kê\"}, {\"id\": \"C\", \"text\": \"Trừu tượng hóa khoa học\\nGiải thích: Phương pháp trừu tượng hóa khoa học là chủ yếu.\"}, {\"id\": \"D\", \"text\": \"Mô hình hóa\"}]', 'C', 'Phương pháp trừu tượng hóa khoa học là chủ yếu.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(168, 4, 40, 'Kinh tế chính trị Mác - Lênin cung cấp điều gì?', '[{\"id\": \"A\", \"text\": \"Công cụ quản lý kinh tế vĩ mô\"}, {\"id\": \"B\", \"text\": \"Hệ thống tri thức lý luận về sự vận động của các quan hệ giữa người với người trong sản xuất và trao đổi\\nGiải thích: Cung cấp lý luận về sự vận động của các quan hệ xã hội.\"}, {\"id\": \"C\", \"text\": \"Các mô hình dự báo kinh tế\"}, {\"id\": \"D\", \"text\": \"Các giải pháp cụ thể cho các vấn đề kinh tế\"}]', 'B', 'Cung cấp lý luận về sự vận động của các quan hệ xã hội.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(169, 4, 41, 'Chức năng thực tiễn của kinh tế chính trị Mác - Lênin thể hiện ở việc gì?', '[{\"id\": \"A\", \"text\": \"Cung cấp các công cụ phân tích kinh tế\"}, {\"id\": \"B\", \"text\": \"Giúp người lao động và nhà hoạch định chính sách vận dụng các quy luật kinh tế vào thực tiễn\\nGiải thích: Chức năng thực tiễn là vận dụng vào thực tế.\"}, {\"id\": \"C\", \"text\": \"Dự báo các xu hướng phát triển kinh tế\"}, {\"id\": \"D\", \"text\": \"Xây dựng các mô hình kinh tế\"}]', 'B', 'Chức năng thực tiễn là vận dụng vào thực tế.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(170, 4, 42, 'Chức năng tư tưởng của kinh tế chính trị Mác - Lênin góp phần xây dựng điều gì?', '[{\"id\": \"A\", \"text\": \"Hệ thống pháp luật kinh tế\"}, {\"id\": \"B\", \"text\": \"Nền tảng tư tưởng mới cho những người lao động tiến bộ\\nGiải thích: Góp phần xây dựng nền tảng tư tưởng cho giai cấp công nhân.\"}, {\"id\": \"C\", \"text\": \"Các chính sách kinh tế vĩ mô\"}, {\"id\": \"D\", \"text\": \"Các mô hình tăng trưởng kinh tế\"}]', 'B', 'Góp phần xây dựng nền tảng tư tưởng cho giai cấp công nhân.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(171, 4, 43, 'Điều kiện để vận dụng thành thạo phép biện chứng duy vật trong nghiên cứu kinh tế chính trị Mác - Lênin là gì?', '[{\"id\": \"A\", \"text\": \"Thấy được sự tách biệt giữa các hiện tượng kinh tế\"}, {\"id\": \"B\", \"text\": \"Thấy được các hiện tượng và quá trình kinh tế hình thành, phát triển, chuyển hóa không ngừng\\nGiải thích: Phép biện chứng duy vật đòi hỏi xem xét sự vật trong vận động và phát triển.\"}, {\"id\": \"C\", \"text\": \"Xây dựng các mô hình kinh tế phức tạp\"}, {\"id\": \"D\", \"text\": \"Sử dụng các công cụ thống kê hiện đại\"}]', 'B', 'Phép biện chứng duy vật đòi hỏi xem xét sự vật trong vận động và phát triển.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(172, 4, 44, 'Trong nghiên cứu kinh tế chính trị Mác - Lênin, việc loại bỏ các yếu tố ngẫu nhiên, tạm thời cần đảm bảo yêu cầu gì?', '[{\"id\": \"A\", \"text\": \"Làm sai lệch bản chất của đối tượng nghiên cứu\"}, {\"id\": \"B\", \"text\": \"Phải nắm được bản chất, quy luật vận động của đối tượng\\nGiải thích: Loại bỏ yếu tố ngẫu nhiên để tìm ra bản chất, quy luật.\"}, {\"id\": \"C\", \"text\": \"Phải sử dụng số liệu thống kê\"}, {\"id\": \"D\", \"text\": \"Phải mô hình hóa\"}]', 'B', 'Loại bỏ yếu tố ngẫu nhiên để tìm ra bản chất, quy luật.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(173, 4, 45, 'Theo V.I. Lênin, kinh tế chính trị không nghiên cứu điều gì?', '[{\"id\": \"A\", \"text\": \"Nghiên cứu sự sản xuất\\nGiải thích: Lênin nhấn mạnh không nghiên cứu sự sản xuất (kỹ thuật) mà nghiên cứu quan hệ xã hội.\"}, {\"id\": \"B\", \"text\": \"Nghiên cứu những quan hệ xã hội giữa người với người trong sản xuất\"}, {\"id\": \"C\", \"text\": \"Nghiên cứu chế độ xã hội của sản xuất\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu sự phân phối sản phẩm\"}]', 'A', 'Lênin nhấn mạnh không nghiên cứu sự sản xuất (kỹ thuật) mà nghiên cứu quan hệ xã hội.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(174, 4, 46, 'Khi nghiên cứu về quan hệ lợi ích kinh tế giữa người lao động và người sử dụng sức lao động, yếu tố nào có thể bỏ qua?', '[{\"id\": \"A\", \"text\": \"Lợi ích kinh tế\"}, {\"id\": \"B\", \"text\": \"Tình cảm cá nhân\\nGiải thích: Nghiên cứu kinh tế chính trị tập trung vào lợi ích, giai cấp, không dựa vào tình cảm cá nhân.\"}, {\"id\": \"C\", \"text\": \"Quan hệ giai cấp\"}, {\"id\": \"D\", \"text\": \"Sự phân công lao động\"}]', 'B', 'Nghiên cứu kinh tế chính trị tập trung vào lợi ích, giai cấp, không dựa vào tình cảm cá nhân.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(175, 4, 47, 'Kinh tế chính trị Mác-Lênin có chức năng phương pháp luận, vậy chức năng này thể hiện ở chỗ nào?', '[{\"id\": \"A\", \"text\": \"Xây dựng hệ thống lý luận kinh tế hoàn chỉnh.\"}, {\"id\": \"B\", \"text\": \"Nền tảng lý luận khoa học cho việc nhận diện sâu hơn nội hàm khoa học của các khoa học kinh tế chuyên ngành.\\nGiải thích: Chức năng phương pháp luận là nền tảng cho các khoa học kinh tế khác.\"}, {\"id\": \"C\", \"text\": \"Cung cấp công cụ để dự báo kinh tế.\"}, {\"id\": \"D\", \"text\": \"Tạo ra các mô hình kinh tế phức tạp.\"}]', 'B', 'Chức năng phương pháp luận là nền tảng cho các khoa học kinh tế khác.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(176, 4, 48, 'Trong quá trình phát triển, các quan hệ của sản xuất và trao đổi chịu tác động bởi yếu tố nào?', '[{\"id\": \"A\", \"text\": \"Trình độ của lực lượng sản xuất\"}, {\"id\": \"B\", \"text\": \"Kiến trúc thượng tầng\"}, {\"id\": \"C\", \"text\": \"Ý thức của con người\"}, {\"id\": \"D\", \"text\": \"Cả A và B\\nGiải thích: Quan hệ sản xuất chịu tác động của lực lượng sản xuất và kiến trúc thượng tầng.\"}]', 'D', 'Quan hệ sản xuất chịu tác động của lực lượng sản xuất và kiến trúc thượng tầng.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(177, 4, 49, 'Theo đoạn trích, kinh tế chính trị Mác-Lênin là cơ sở khoa học cho?', '[{\"id\": \"A\", \"text\": \"Hoạt động đầu tư chứng khoán\"}, {\"id\": \"B\", \"text\": \"Nhận diện và định vị vai trò, trách nhiệm sáng tạo của mỗi cá nhân\\nGiải thích: Kinh tế chính trị Mác-Lênin giúp định vị vai trò của cá nhân trong xã hội.\"}, {\"id\": \"C\", \"text\": \"Hoạch định chính sách tiền tệ\"}, {\"id\": \"D\", \"text\": \"Phát triển công nghiệp quốc phòng\"}]', 'B', 'Kinh tế chính trị Mác-Lênin giúp định vị vai trò của cá nhân trong xã hội.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(178, 4, 50, 'Đâu là một trong những hạn chế của chủ nghĩa trọng nông?', '[{\"id\": \"A\", \"text\": \"Nghiên cứu sâu về lĩnh vực lưu thông\"}, {\"id\": \"B\", \"text\": \"Cho rằng chỉ có nông nghiệp mới là sản xuất\\nGiải thích: Đây là hạn chế cốt lõi của chủ nghĩa trọng nông khi chỉ coi nông nghiệp là ngành sản xuất duy nhất.\"}, {\"id\": \"C\", \"text\": \"Nghiên cứu về tiền tệ\"}, {\"id\": \"D\", \"text\": \"Nghiên cứu về giá trị\"}]', 'B', 'Đây là hạn chế cốt lõi của chủ nghĩa trọng nông khi chỉ coi nông nghiệp là ngành sản xuất duy nhất.', 'Trung bình', '2026-10-08 02:47:41', '2026-10-08 02:47:41'),
(179, 5, 1, 'Giá cả thị trường có chức năng gì?', '[{\"id\": \"A\", \"text\": \"Cả 3 đáp án đều đúng.\"}, {\"id\": \"B\", \"text\": \"Phân bố các nguồn lực.\"}, {\"id\": \"C\", \"text\": \"Thông tin.\"}, {\"id\": \"D\", \"text\": \"Thúc đẩy tiến bộ khoa học công nghệ.\"}]', 'A', 'Giá cả thị trường có 3 chức năng chính: thông tin, phân bổ nguồn lực và thúc đẩy tiến bộ kỹ thuật.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(180, 5, 2, 'Những nhân tố khách quan ảnh hưởng tới giá cả thị trường?', '[{\"id\": \"A\", \"text\": \"Cung cầu hàng hóa và sức mua của tiền.\"}, {\"id\": \"B\", \"text\": \"Cạnh tranh trên thị trường.\"}, {\"id\": \"C\", \"text\": \"Cả 3 đáp án đều đúng.\"}, {\"id\": \"D\", \"text\": \"Giá trị thị trường của hàng hóa.\"}]', 'C', 'Các nhân tố khách quan bao gồm cung cầu, sức mua của tiền, cạnh tranh và giá trị thị trường.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(181, 5, 3, 'Cung - cầu là quy luật kinh tế. Thế nào là cầu?', '[{\"id\": \"A\", \"text\": \"Biểu hiện lượng hàng hóa hay dịch vụ mà người tiêu dùng sẵn lòng mua tại các mức giá khác nhau trong một khoảng thời gian nhất định.\"}, {\"id\": \"B\", \"text\": \"Là nhu cầu của người mua hàng hoá.\"}, {\"id\": \"C\", \"text\": \"Là nhu cầu của thị trường về hàng hoá.\"}, {\"id\": \"D\", \"text\": \"Là sự mong muốn, sở thích của người tiêu dùng.\"}]', 'A', 'Cầu là lượng hàng hóa/dịch vụ mà người mua sẵn lòng và có khả năng mua tại các mức giá khác nhau trong một thời gian nhất định.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(182, 5, 4, 'Thế nào là cung hàng hoá?', '[{\"id\": \"A\", \"text\": \"Là số lượng hàng hoá xã hội sản xuất ra.\"}, {\"id\": \"B\", \"text\": \"Là toàn bộ khả năng cung cấp hàng hoá cho thị trường.\"}, {\"id\": \"C\", \"text\": \"Là toàn bộ số hàng hoá đem bán trên thị trường.\"}, {\"id\": \"D\", \"text\": \"Toàn bộ hàng hoá đem bán trên thị trường và có thể đưa nhanh đến thị trường ở một mức giá nhất định.\"}]', 'D', 'Cung là toàn bộ lượng hàng hóa/dịch vụ mà người bán sẵn sàng bán và có khả năng bán ở các mức giá khác nhau trong một thời gian nhất định.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(183, 5, 5, 'Hình thức tổ chức sản xuất kinh doanh điển hình của kinh tế cá thể tiểu chủ là:', '[{\"id\": \"A\", \"text\": \"Công ty trách nhiệm 1 thành viên.\"}, {\"id\": \"B\", \"text\": \"Cả 3 đáp án đều đúng.\"}, {\"id\": \"C\", \"text\": \"Kinh tế hộ gia đình.\"}, {\"id\": \"D\", \"text\": \"Kinh tế trang trại.\"}]', 'C', 'Kinh tế cá thể tiểu chủ thường tồn tại dưới hình thức hộ gia đình.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(184, 5, 6, 'Hàng hóa có mấy thuộc tính?', '[{\"id\": \"A\", \"text\": \"1\"}, {\"id\": \"B\", \"text\": \"2\"}, {\"id\": \"C\", \"text\": \"3\"}, {\"id\": \"D\", \"text\": \"4\"}]', 'B', 'Hàng hóa có 2 thuộc tính: giá trị sử dụng và giá trị.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(185, 5, 7, 'Cần có ít nhất mấy điều kiện để sản xuất hàng hóa ra đời?', '[{\"id\": \"A\", \"text\": \"1\"}, {\"id\": \"B\", \"text\": \"2\"}, {\"id\": \"C\", \"text\": \"3\"}, {\"id\": \"D\", \"text\": \"4\"}]', 'B', 'Sản xuất hàng hóa ra đời khi có 2 điều kiện: phân công lao động xã hội và sự tách biệt tương đối về kinh tế của những người sản xuất.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(186, 5, 8, 'Sản xuất hàng hóa là?', '[{\"id\": \"A\", \"text\": \"Hình thức tổ chức xã hội.\"}, {\"id\": \"B\", \"text\": \"Một hình thái kinh tế - xã hội.\"}, {\"id\": \"C\", \"text\": \"Một kiểu tổ chức kinh tế, trong đó những sản phẩm được sản xuất ra để trao đổi, mua bán.\"}, {\"id\": \"D\", \"text\": \"Tổ chức kinh tế.\"}]', 'C', 'Sản xuất hàng hóa là kiểu tổ chức kinh tế mà sản phẩm làm ra để trao đổi, mua bán trên thị trường.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(187, 5, 9, 'Hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Sản phẩm của lao động có thể thỏa mãn nhu cầu nào đó của con người.\"}, {\"id\": \"B\", \"text\": \"Sản phẩm của lao động để thỏa mãn nhu cầu của con người thông qua mua bán và trao đổi.\"}, {\"id\": \"C\", \"text\": \"Sản phẩm được sản xuất ra để đem bán.\"}, {\"id\": \"D\", \"text\": \"Sản phẩm ở trên thị trường.\"}]', 'B', 'Hàng hóa là sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người và được sản xuất ra để trao đổi, mua bán.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(188, 5, 10, 'Lao động cụ thể', '[{\"id\": \"A\", \"text\": \"Biểu hiện tính chất xã hội của người sản xuất hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Phạm trù lịch sử.\"}, {\"id\": \"C\", \"text\": \"Tạo ra giá trị của hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Tạo ra giá trị sử dụng của hàng hóa.\"}]', 'D', 'Lao động cụ thể là lao động có ích dưới một hình thức cụ thể của những nghề nghiệp chuyên môn nhất định, tạo ra giá trị sử dụng của hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(189, 5, 11, 'Năng suất lao động là', '[{\"id\": \"A\", \"text\": \"Các phương án trên đều đúng.\"}, {\"id\": \"B\", \"text\": \"Giống như kéo dài thời gian lao động.\"}, {\"id\": \"C\", \"text\": \"Năng lực sản xuất của người lao động tính bằng số sản phẩm sản xuất ra trong một đơn vị thời gian.\"}, {\"id\": \"D\", \"text\": \"Sự hao phí lao động trong một đơn vị thời gian.\"}]', 'C', 'Năng suất lao động là năng lực sản xuất của người lao động, được đo bằng số lượng sản phẩm sản xuất ra trong một đơn vị thời gian hoặc thời gian để sản xuất ra một đơn vị sản phẩm.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(190, 5, 12, '[LX301012] Nhân tố quan trọng nhất để tăng NSLĐ', '[{\"id\": \"A\", \"text\": \"Tổ chức quản lý\"}, {\"id\": \"B\", \"text\": \"Kỹ năng lao động\"}, {\"id\": \"C\", \"text\": \"Kỹ thuật công nghệ\"}, {\"id\": \"D\", \"text\": \"Điều kiện tự nhiên\"}]', 'C', 'Kỹ thuật công nghệ là nhân tố quan trọng nhất, mang tính đột phá để tăng năng suất lao động.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(191, 5, 13, 'Quy luật lưu thông tiền tệ?', '[{\"id\": \"A\", \"text\": \"Xác định lượng tiền cần thiết trong lưu thông.\"}, {\"id\": \"B\", \"text\": \"Xác định lượng tiền làm chức năng cất trữ.\"}, {\"id\": \"C\", \"text\": \"Xác định lượng tiền làm chức năng mua bán chịu.\"}, {\"id\": \"D\", \"text\": \"Xác định lượng tiền làm chức năng phương tiện lưu thông.\"}]', 'A', 'Quy luật lưu thông tiền tệ xác định lượng tiền cần thiết cho lưu thông hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(192, 5, 14, 'Trong các phạm trù kinh tế dưới đây, phạm trù nào được coi là tính hiệu của cơ chế thị trường?', '[{\"id\": \"A\", \"text\": \"Cung - cầu hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Giá cả thị trường.\"}, {\"id\": \"C\", \"text\": \"Sức mua của tiền.\"}, {\"id\": \"D\", \"text\": \"Thông tin thị trường.\"}]', 'B', 'Giá cả thị trường là phạm trù trung tâm, là tín hiệu quan trọng nhất của cơ chế thị trường.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(193, 5, 15, 'Chọn đáp án sai', '[{\"id\": \"A\", \"text\": \"Lao động trừu tượng là phạm trù vĩnh viễn.\"}, {\"id\": \"B\", \"text\": \"Lượng tiền cần thiết trong lưu thông tỉ lệ thuận với lượng hàng hóa lưu thông trên thị trường và giá cả của nó.\"}, {\"id\": \"C\", \"text\": \"Tiền làm chức năng phương tiện cất trữ là tiền để dành.\"}, {\"id\": \"D\", \"text\": \"Tiền làm đủ 5 chức năng phải là tiền vàng.\"}]', 'A', 'Lao động trừu tượng là phạm trù lịch sử, chỉ tồn tại trong nền sản xuất hàng hóa, không phải là phạm trù vĩnh viễn.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(194, 5, 16, 'Năng suất lao động có mối quan hệ như thế nào với lượng giá trị trong một đơn vị hàng hóa?', '[{\"id\": \"A\", \"text\": \"Không có mối liên hệ.\"}, {\"id\": \"B\", \"text\": \"Tỷ lệ nghịch.\"}, {\"id\": \"C\", \"text\": \"Tỷ lệ thuận.\"}, {\"id\": \"D\", \"text\": \"Tỷ lệ thuận.\"}]', 'B', 'Năng suất lao động tăng lên thì lượng giá trị trong một đơn vị hàng hóa giảm xuống (tỷ lệ nghịch).', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(195, 5, 17, 'Dịch vụ là?', '[{\"id\": \"A\", \"text\": \"Hàng hóa hữu hình.\"}, {\"id\": \"B\", \"text\": \"Hàng hóa vô hình.\"}, {\"id\": \"C\", \"text\": \"Không phải hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Là hàng hóa có thể cất trữ.\"}]', 'B', 'Dịch vụ là hàng hóa vô hình, không thể cất trữ.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(196, 5, 18, 'Kinh tế thị trường là?', '[{\"id\": \"A\", \"text\": \"Cả 3 đáp án đều sai.\"}, {\"id\": \"B\", \"text\": \"Là giai đoạn phát triển cao của kinh tế hàng hóa.\"}, {\"id\": \"C\", \"text\": \"Là giai đoạn xuất hiện trước kinh tế hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Xuất hiện cùng với kinh tế hàng hóa.\"}]', 'B', 'Kinh tế thị trường là giai đoạn phát triển cao của kinh tế hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(197, 5, 19, 'Quy luật cung cầu là quy luật kinh tế ... quan hệ giữa cung (bên bán) và cầu (bên mua) hàng hóa trên thị trường.', '[{\"id\": \"A\", \"text\": \"chi phối\"}, {\"id\": \"B\", \"text\": \"cơ bản chi phối\"}, {\"id\": \"C\", \"text\": \"của\"}, {\"id\": \"D\", \"text\": \"điều tiết\"}]', 'D', 'Quy luật cung cầu điều tiết quan hệ giữa cung và cầu hàng hóa trên thị trường.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(198, 5, 20, 'Điều kiện để sản xuất hàng hóa giản đơn ra đời?', '[{\"id\": \"A\", \"text\": \"Lực lượng sản xuất phát triển làm cho các quan hệ kinh tế được mở rộng.\"}, {\"id\": \"B\", \"text\": \"Mong muốn của con người muốn tiêu dùng những sản phẩm do người khác làm ra.\"}, {\"id\": \"C\", \"text\": \"Phân công lao động xã hội và chế độ tư hữu về TLSX.\"}, {\"id\": \"D\", \"text\": \"Sự tiến bộ của khoa học kĩ thuật giúp cho có thể sản xuất được những sản phẩm tốt hơn.\"}]', 'C', 'Sản xuất hàng hóa giản đơn ra đời dựa trên hai điều kiện: phân công lao động xã hội và chế độ tư hữu về tư liệu sản xuất.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(199, 5, 21, 'Thế nào là nền sản xuất hàng hóa TBCN?', '[{\"id\": \"A\", \"text\": \"Nền sản xuất dựa trên chế độ tư hữu về TLSX và chế độ bóc lột làm thuê.\"}, {\"id\": \"B\", \"text\": \"Nền sản xuất dựa trên cơ sở phân công lao động xã hội và chế độ tư hữu TBCN về TLSX.\"}, {\"id\": \"C\", \"text\": \"Nền sản xuất hàng hóa mà kẻ bóc lột không còn là chủ nô, chúa phong kiến mà là nhà tư bản.\"}, {\"id\": \"D\", \"text\": \"Nền sản xuất để phục vụ cho một thị trường rộng, vượt khỏi biên giới quốc gia.\"}]', 'B', 'Nền sản xuất hàng hóa TBCN dựa trên cơ sở phân công lao động xã hội và chế độ tư hữu TBCN về tư liệu sản xuất.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(200, 5, 22, 'Giá trị hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Biểu hiện tính hai mặt của hàng hóa mà mặt kia là giá trị sử dụng như một thuộc tính không thể thiếu của mọi loại hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Lao động xã hội kết tinh trong hàng hóa.\"}, {\"id\": \"C\", \"text\": \"Là số lượng thời gian thực tế phải bỏ ra để làm nên hàng hóa đó.\"}, {\"id\": \"D\", \"text\": \"Mối quan hệ về lượng giữa những giá trị sử dụng khác nhau.\"}]', 'B', 'Giá trị hàng hóa là lao động xã hội của người sản xuất hàng hóa kết tinh trong hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(201, 5, 23, 'Lao động trừu tượng tạo ra cái gì?', '[{\"id\": \"A\", \"text\": \"Biểu hiện tính chất cá nhân của người sản xuất hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Là phạm trù vĩnh viễn, không chỉ có trong sản xuất hàng hóa mà có trong mọi nền sản xuất chung.\"}, {\"id\": \"C\", \"text\": \"Tạo ra giá trị hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Tạo ra giá trị sử dụng của hàng hóa.\"}]', 'C', 'Lao động trừu tượng tạo ra giá trị của hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(202, 5, 24, 'Lượng giá trị của hàng hóa được tính bởi cái gì?', '[{\"id\": \"A\", \"text\": \"Hao phí mà người lao động đã bỏ ra để làm nên hàng hóa đó.\"}, {\"id\": \"B\", \"text\": \"Hao phí vật tư kỹ thuật và tiền lương chi phí cho công nhân.\"}, {\"id\": \"C\", \"text\": \"Lao động sống và lao động quá khứ kết tinh trong hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Thời gian lao động xã hội cần thiết.\"}]', 'D', 'Lượng giá trị hàng hóa được đo bằng thời gian lao động xã hội cần thiết để sản xuất ra hàng hóa đó.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(203, 5, 25, 'Chọn đáp án đúng nhất?', '[{\"id\": \"A\", \"text\": \"Cả 3 đáp án đều đúng.\"}, {\"id\": \"B\", \"text\": \"Đối với nhà tư bản cá biệt, giá trị cá biệt của hàng hóa của anh ta bằng giá trị xã hội của hàng hóa đó thì tốt nhất.\"}, {\"id\": \"C\", \"text\": \"Đối với nhà tư bản cá biệt, giá trị cá biệt của hàng hóa của anh ta cao hơn giá trị xã hội của hàng hóa đó thì tốt nhất.\"}, {\"id\": \"D\", \"text\": \"Đối với nhà tư bản cá biệt, giá trị cá biệt của hàng hóa của anh ta thấp hơn giá trị xã hội của hàng hóa đó thì tốt nhất.\"}]', 'D', 'Nhà tư bản muốn giá trị cá biệt thấp hơn giá trị xã hội để thu được lợi nhuận siêu ngạch.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(204, 5, 26, 'Yếu tố cần bản quyết định giá cả hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Giá trị của hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Giá trị sử dụng của hàng hóa cũng tức là chất lượng của hàng hóa đó.\"}, {\"id\": \"C\", \"text\": \"Quan hệ cung cầu.\"}, {\"id\": \"D\", \"text\": \"Thị hiếu, một thị trường và tâm lí xã hội của mỗi thời kì.\"}]', 'A', 'Giá trị là cơ sở, là yếu tố quyết định giá cả hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(205, 5, 27, 'Nội dung thời gian lao động xã hội cần thiết để sản xuất ra một hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Trong điều kiện sản xuất bình thường xét trên phạm vi quốc gia hoặc phạm vi quốc tế.\"}, {\"id\": \"B\", \"text\": \"Với cường độ lao động trung bình, trình độ thành thạo trung bình của một xí nghiệp hay một đơn vị sản xuất.\"}, {\"id\": \"C\", \"text\": \"Với trình độ kỹ thuật, kĩ năng và cường độ lao động trung bình của xã hội.\"}, {\"id\": \"D\", \"text\": \"Với trình độ lao động để giảm chi phí tiền lương trên 1 đơn vị sản phẩm.\"}]', 'C', 'Thời gian lao động xã hội cần thiết là thời gian lao động cần thiết để sản xuất ra một hàng hóa trong điều kiện trình độ kỹ thuật, kỹ năng và cường độ lao động trung bình của xã hội.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(206, 5, 28, 'Yếu tố nào làm giảm giá trị trong 1 đơn vị hàng hóa?', '[{\"id\": \"A\", \"text\": \"Tăng cường độ lao động để giảm chi phí tiền lương trên 1 đơn vị sản phẩm.\"}, {\"id\": \"B\", \"text\": \"Tăng năng suất lao động.\"}, {\"id\": \"C\", \"text\": \"Tăng thời gian lao động để giảm chi phí tiền lương trên 1 đơn vị sản phẩm.\"}, {\"id\": \"D\", \"text\": \"Tăng thêm trang bị vật chất và kĩ thuật cho lao động.\"}]', 'B', 'Tăng năng suất lao động sẽ làm giảm lượng giá trị trong một đơn vị hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(207, 5, 29, 'Lượng giá trị của hàng hóa?', '[{\"id\": \"A\", \"text\": \"Tỷ lệ nghịch với mức độ hao phí vật tư kỹ thuật trung bình của xã hội.\"}, {\"id\": \"B\", \"text\": \"Tỷ lệ nghịch với năng suất lao động.\"}, {\"id\": \"C\", \"text\": \"Tỷ lệ nghịch với thời gian lao động xã hội cần thiết để bỏ ra làm nên hàng hóa.\"}, {\"id\": \"D\", \"text\": \"Tỷ lệ với năng suất lao động trung bình của xã hội.\"}]', 'B', 'Lượng giá trị hàng hóa tỷ lệ nghịch với năng suất lao động.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(208, 5, 30, 'Lượng giá trị của hàng hóa?', '[{\"id\": \"A\", \"text\": \"Tỷ lệ nghịch với hao phí vật tư kỹ thuật đã bỏ ra để làm nên hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Tỷ lệ nghịch với tổng số thời gian lao động xã hội cần thiết đã bỏ ra để làm nên hàng hóa.\"}, {\"id\": \"C\", \"text\": \"Tỷ lệ thuận với năng suất lao động.\"}, {\"id\": \"D\", \"text\": \"Tỷ lệ thuận với thời gian lao động xã hội cần thiết.\"}]', 'D', 'Lượng giá trị hàng hóa tỷ lệ thuận với thời gian lao động xã hội cần thiết.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33');
INSERT INTO `questions` (`id`, `document_id`, `order`, `content`, `options`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`) VALUES
(209, 5, 31, 'Tiền là hàng hóa nhưng khác với hàng hóa thông thường ở điểm nào?', '[{\"id\": \"A\", \"text\": \"Có giá trị và giá trị sử dụng phổ biến trong phạm vi quốc gia và sau đó là quốc tế.\"}, {\"id\": \"B\", \"text\": \"Có thể được dùng làm phương tiện để trao đổi, tích lũy, bộc lộ.\"}, {\"id\": \"C\", \"text\": \"Có thể được dùng để mua bán các hàng hóa có giá trị tương đương với giá trị của bản thân tiền tệ.\"}, {\"id\": \"D\", \"text\": \"Là thước đo giá trị của các loại hàng hóa khác.\"}]', 'C', 'Tiền là hàng hóa đặc biệt, có thể dùng để mua bán các hàng hóa có giá trị tương đương.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(210, 5, 32, 'Chức năng cơ bản nhất của tiền là gì?', '[{\"id\": \"A\", \"text\": \"Phương tiện cất trữ.\"}, {\"id\": \"B\", \"text\": \"Phương tiện lưu thông.\"}, {\"id\": \"C\", \"text\": \"Phương tiện thanh toán.\"}, {\"id\": \"D\", \"text\": \"Thước đo giá trị.\"}]', 'D', 'Thước đo giá trị là chức năng cơ bản nhất của tiền.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(211, 5, 33, 'Quy luật giá trị là quy luật của nền kinh tế nào?', '[{\"id\": \"A\", \"text\": \"Kinh tế hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Mọi nền sản xuất trong lịch sử loài người.\"}, {\"id\": \"C\", \"text\": \"Sản xuất hàng hóa giản đơn.\"}, {\"id\": \"D\", \"text\": \"Sản xuất hàng hóa tư bản chủ nghĩa.\"}]', 'A', 'Quy luật giá trị là quy luật kinh tế cơ bản của nền sản xuất hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(212, 5, 34, 'Giá trị sử dụng của hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Cái tạo nên nội dung và ý nghĩa của giá trị hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Cơ sở của phân công lao động xã hội và để trao đổi giữa những lĩnh vực sản xuất khác nhau.\"}, {\"id\": \"C\", \"text\": \"Giá trị cho người khác sử dụng, là giá trị sử dụng cho xã hội.\"}, {\"id\": \"D\", \"text\": \"Giá trị để cho người sản xuất ra nó sử dụng trực tiếp hoặc đem trao đổi lấy 1 giá trị khác.\"}]', 'C', 'Giá trị sử dụng của hàng hóa là công dụng của nó, là giá trị sử dụng cho xã hội, cho người khác.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(213, 5, 35, 'Giá trị của hàng hóa do cái gì tạo ra?', '[{\"id\": \"A\", \"text\": \"Do lao động cụ thể mà người lao động đã bỏ ra để tạo nên hàng hóa đó.\"}, {\"id\": \"B\", \"text\": \"Do lao động phức tạp tạo ra.\"}, {\"id\": \"C\", \"text\": \"Do lao động trừu tượng tạo ra.\"}, {\"id\": \"D\", \"text\": \"Do quan hệ cung cầu của mỗi thời kì hoặc mỗi xã hội quyết định.\"}]', 'C', 'Lao động trừu tượng tạo ra giá trị của hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(214, 5, 36, 'Hai hàng hóa trao đổi với nhau trên cơ sở nào?', '[{\"id\": \"A\", \"text\": \"Có hao phí vật tư kĩ thuật của thế làm ra.\"}, {\"id\": \"B\", \"text\": \"Lượng thời gian lao động xã hội cần thiết.\"}, {\"id\": \"C\", \"text\": \"Phân công lao động làm cho người ta phải trao đổi giá trị sử dụng do mình làm ra lấy giá trị sử dụng khác do người khác làm ra.\"}, {\"id\": \"D\", \"text\": \"Tùy có giá trị sử dụng khác nhau nhưng đều cùng là sản phẩm của lao động.\"}]', 'B', 'Hai hàng hóa trao đổi với nhau dựa trên cơ sở hao phí lao động xã hội cần thiết (thời gian lao động xã hội cần thiết) để sản xuất ra chúng.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(215, 5, 37, 'Sản xuất hàng hóa giản đơn và sản xuất hàng hóa TBCN có điểm giống nhau cơ bản là gì?', '[{\"id\": \"A\", \"text\": \"Hàng hóa được sản xuất ra đều phải có giá trị sử dụng và thỏa mãn nhu cầu nào đó của người mua.\"}, {\"id\": \"B\", \"text\": \"Hàng hóa đều do người lao động sản xuất ra bằng lao động của mình.\"}, {\"id\": \"C\", \"text\": \"Đều dựa vào chế độ tư hữu TBCN tư liệu sản xuất.\"}, {\"id\": \"D\", \"text\": \"Đều sản xuất để bán, chứ không phải để tiêu dùng.\"}]', 'D', 'Cả hai đều là sản xuất hàng hóa, mục đích là để bán, trao đổi trên thị trường.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(216, 5, 38, 'Sản xuất hàng hóa giản đơn và sản xuất hàng hóa TBCN có điểm khác nhau cơ bản là gì?', '[{\"id\": \"A\", \"text\": \"Nền sản xuất hàng hóa giản đơn dựa trên kĩ thuật thủ công, còn sản xuất hàng hóa TBCN dựa trên cơ sở kĩ thuật cơ khí.\"}, {\"id\": \"B\", \"text\": \"Sản xuất hàng hóa giản đơn là sản xuất theo quy mô nhỏ, còn trong sản xuất hàng hóa TBCN là sản xuất theo quy mô lớn.\"}, {\"id\": \"C\", \"text\": \"Trong nền sản xuất hàng hóa giản đơn không có bóc lột, còn trong nền sản xuất hàng hóa TBCN có hiện tượng người bóc lột người.\"}, {\"id\": \"D\", \"text\": \"Trong nền sản xuất hàng hóa giản đơn, hàng hóa được sản xuất ra từng chiếc một, còn trong nền sản xuất hàng hóa TBCN, hàng hóa được sản xuất ra hàng loạt.\"}]', 'A', 'Điểm khác nhau cơ bản về trình độ kỹ thuật: sản xuất hàng hóa giản đơn dựa trên kỹ thuật thủ công, còn sản xuất hàng hóa TBCN dựa trên kỹ thuật cơ khí.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(217, 5, 39, 'Giá cả của hàng hóa là gì?', '[{\"id\": \"A\", \"text\": \"Là giá trị của hàng hóa.\"}, {\"id\": \"B\", \"text\": \"Là hình thức biểu hiện bằng tiền của giá trị hàng hóa.\"}, {\"id\": \"C\", \"text\": \"Là số tiền mà người mua tra cho người bán hàng hóa để được quyền sở hữu hàng hóa đó.\"}, {\"id\": \"D\", \"text\": \"Là thời gian lao động cần thiết để sản xuất ra hàng hóa đó.\"}]', 'B', 'Giá cả hàng hóa là hình thức biểu hiện bằng tiền của giá trị hàng hóa.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(218, 5, 40, 'Nếu muốn làm tăng số lượng sản phẩm sản xuất ra trong 1 thời gian nhất định, một tuần lễ chẳng hạn, thì giám đốc xí nghiệp phải sử dụng biện pháp gì?', '[{\"id\": \"A\", \"text\": \"Phải mua thêm nguyên liệu, tuyển thêm công nhân.\"}, {\"id\": \"B\", \"text\": \"Phải nâng cao năng suất lao động của công nhân, tăng cường độ lao động, tổ chức cho công nhân làm thêm giờ hoặc thêm ca.\"}, {\"id\": \"C\", \"text\": \"Phải tổ chức lại sản xuất, phân công lao động trong nội bộ xí nghiệp một cách hợp lí.\"}, {\"id\": \"D\", \"text\": \"Phải đổi mới kĩ thuật, nâng cao năng suất lao động của công nhân.\"}]', 'B', 'Để tăng số lượng sản phẩm trong một thời gian nhất định, cần tăng năng suất lao động, tăng cường độ lao động hoặc kéo dài thời gian lao động.', 'Trung bình', '2026-10-08 02:48:33', '2026-10-08 02:48:33'),
(239, 6, 1, 'Theo trường phái truyền thống (trường phái tiêu cực), rủi ro được hiểu là gì?', '[{\"id\": \"A\", \"text\": \"Sự bất trắc có thể đo lường được mang tính hai mặt.\"}, {\"id\": \"B\", \"text\": \"Những tổn thất, thiệt hại, nguy hiểm hoặc khó khăn có thể xảy ra cho con người.\"}, {\"id\": \"C\", \"text\": \"Cơ hội để tối đa hóa lợi nhuận trong môi trường bất định.\"}, {\"id\": \"D\", \"text\": \"Sự chênh lệch giữa giá trị kỳ vọng và kết quả thực tế.\"}]', 'B', 'Trường phái truyền thống chỉ nhìn nhận rủi ro dưới góc độ tiêu cực, coi rủi ro là những mất mát, nguy hiểm, thiệt hại hoặc yếu tố không chắc chắn gây bất lợi.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(240, 6, 2, 'Điểm khác biệt mấu chốt của trường phái trung hòa so với trường phái truyền thống là gì?', '[{\"id\": \"A\", \"text\": \"Trường phái trung hòa coi rủi ro chỉ mang lại tác động tiêu cực.\"}, {\"id\": \"B\", \"text\": \"Trường phái trung hòa cho rằng rủi ro không thể đo lường được.\"}, {\"id\": \"C\", \"text\": \"Trường phái trung hòa thừa nhận tính 2 mặt của rủi ro: vừa đem lại tổn thất vừa mang lại cơ hội.\"}, {\"id\": \"D\", \"text\": \"Trường phái trung hòa bác bỏ việc tài trợ rủi ro.\"}]', 'C', 'Trường phái trung hòa xem rủi ro là sự bất trắc có thể đo lường được và có tính chất hai mặt: vừa có thể gây thiệt hại, vừa có thể tạo ra cơ hội sinh lợi.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(241, 6, 3, 'Rủi ro thuần túy (Pure risk) là loại rủi ro mà khi xảy ra:', '[{\"id\": \"A\", \"text\": \"Chỉ gây ra thiệt hại, mất mát hoặc nguy hiểm, không tạo ra cơ hội sinh lợi.\"}, {\"id\": \"B\", \"text\": \"Chắc chắn đem lại lợi nhuận cao cho doanh nghiệp.\"}, {\"id\": \"C\", \"text\": \"Luôn có khả năng tạo ra cả lãi lẫn lỗ.\"}, {\"id\": \"D\", \"text\": \"Có thể phân tán hoàn toàn bằng cách lập quỹ đầu tư mạo hiểm.\"}]', 'A', 'Rủi ro thuần túy chỉ dẫn đến những thiệt hại, mất mát, nguy hiểm mà không gắn liền với cơ hội sinh lợi (ví dụ: hỏa hoạn, tai nạn).', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(242, 6, 4, 'Rủi ro suy đoán (Speculative risk) có đặc điểm nổi bật nào sau đây?', '[{\"id\": \"A\", \"text\": \"Chỉ dẫn đến tổn thất tài chính mà không thể kiểm soát.\"}, {\"id\": \"B\", \"text\": \"Luôn gắn liền giữa cơ hội tạo ra thuận lợi/lợi nhuận với nguy cơ tổn thất.\"}, {\"id\": \"C\", \"text\": \"Không thể đo lường được bằng các mô hình tài chính.\"}, {\"id\": \"D\", \"text\": \"Chỉ xuất hiện trong các thảm họa tự nhiên do môi trường gây ra.\"}]', 'B', 'Rủi ro suy đoán là loại rủi ro vừa có khả năng gây lỗ vừa có cơ hội tạo ra lợi nhuận (ví dụ: đầu cơ cổ phiếu, kinh doanh ngoại tệ).', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(243, 6, 5, 'Rủi ro có thể phân tán (Diversifiable risk) là loại rủi ro:', '[{\"id\": \"A\", \"text\": \"Ảnh hưởng đến toàn bộ thị trường và không thể loại trừ.\"}, {\"id\": \"B\", \"text\": \"Có thể giảm bớt tổn thất nhờ cơ chế đóng góp quỹ chung hoặc chia sẻ rủi ro.\"}, {\"id\": \"C\", \"text\": \"Chỉ xảy ra một lần duy nhất trong toàn bộ chu kỳ kinh doanh.\"}, {\"id\": \"D\", \"text\": \"Do lỗi nhận thức cá nhân của nhà lãnh đạo.\"}]', 'B', 'Rủi ro có thể phân tán là rủi ro có thể san sẻ hoặc giảm bớt thông qua đa dạng hóa danh mục hoặc lập quỹ đóng góp chung (như bảo hiểm).', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(244, 6, 6, 'Nhóm rủi ro nào sau đây thuộc rủi ro thảm họa theo cách phân loại truyền thống?', '[{\"id\": \"A\", \"text\": \"Nợ xấu ngân hàng gia tăng và lãi suất thị trường biến động.\"}, {\"id\": \"B\", \"text\": \"Hỏa hoạn nhà xưởng, sóng thần, chiến tranh, khủng bố.\"}, {\"id\": \"C\", \"text\": \"Hệ thống phần mềm kế toán bị lỗi gián đoạn chuỗi cung ứng.\"}, {\"id\": \"D\", \"text\": \"Xuất hiện đối thủ cạnh tranh mới trên thị trường mục tiêu.\"}]', 'B', 'Rủi ro thảm họa bao gồm các thảm họa tự nhiên hoặc các biến cố nghiêm trọng do con người/tác động gián tiếp (cháy nổ lớn, chiến tranh, khủng bố).', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(245, 6, 7, 'Biến động tỷ giá hối đoái, lãi suất vay vốn tăng vọt hoặc khách hàng mất khả năng thanh toán nợ thuộc nhóm rủi ro nào?', '[{\"id\": \"A\", \"text\": \"Rủi ro tác nghiệp.\"}, {\"id\": \"B\", \"text\": \"Rủi ro chiến lược.\"}, {\"id\": \"C\", \"text\": \"Rủi ro tài chính.\"}, {\"id\": \"D\", \"text\": \"Rủi ro môi trường văn hóa.\"}]', 'C', 'Rủi ro tài chính gắn liền với sự biến động bất lợi của các biến số tài chính như nợ xấu, tỷ giá, thị giá chứng khoán, lãi suất.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(246, 6, 8, 'Sự cố đứt gãy chuỗi cung ứng, thiết bị dây chuyền sản xuất bị hư hỏng, hoặc nhân viên bị tai nạn lao động thuộc phân loại nào?', '[{\"id\": \"A\", \"text\": \"Rủi ro tài chính.\"}, {\"id\": \"B\", \"text\": \"Rủi ro tác nghiệp (Operation risk).\"}, {\"id\": \"C\", \"text\": \"Rủi ro thảm họa.\"}, {\"id\": \"D\", \"text\": \"Rủi ro vĩ mô.\"}]', 'B', 'Rủi ro tác nghiệp phát sinh từ quy trình nội bộ bị lỗi, hệ thống/máy móc gặp sự cố, con người hoặc sự gián đoạn vận hành thường nhật.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(247, 6, 9, 'Nhận định nào sau đây là ĐÚNG về rủi ro chiến lược?', '[{\"id\": \"A\", \"text\": \"Chỉ xảy ra ở cấp độ phân xưởng sản xuất và không ảnh hưởng lâu dài.\"}, {\"id\": \"B\", \"text\": \"Gắn liền với tầm nhìn, sứ mệnh, mục tiêu và quyết định sự sống còn, hưng thịnh của tổ chức.\"}, {\"id\": \"C\", \"text\": \"Là rủi ro chỉ đo lường được bằng các báo cáo tài chính quá khứ.\"}, {\"id\": \"D\", \"text\": \"Không liên quan đến hoạt động quản trị của hội đồng quản trị.\"}]', 'B', 'Rủi ro chiến lược tác động trực tiếp đến định hướng sống còn, mục tiêu dài hạn và đường lối phát triển của toàn bộ tổ chức.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(248, 6, 10, 'Theo giáo trình, có bao nhiêu loại rủi ro chiến lược điển hình?', '[{\"id\": \"A\", \"text\": \"5.\"}, {\"id\": \"B\", \"text\": \"6.\"}, {\"id\": \"C\", \"text\": \"7.\"}, {\"id\": \"D\", \"text\": \"8.\"}]', 'C', 'Có 7 loại rủi ro chiến lược: rủi ro dự án, từ khách hàng, từ chuyển đổi, đối thủ cạnh tranh duy nhất, thương hiệu, ngành và đình trệ.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(249, 6, 11, 'Một doanh nghiệp xuất khẩu đồ gỗ sử dụng trên bao bì một biểu tượng tôn giáo nhạy cảm, khiến khách hàng và đối tác tại thị trường Trung Đông phản ứng tiêu cực. Đây là ví dụ của:', '[{\"id\": \"A\", \"text\": \"Rủi ro môi trường tự nhiên.\"}, {\"id\": \"B\", \"text\": \"Rủi ro do môi trường văn hóa.\"}, {\"id\": \"C\", \"text\": \"Rủi ro tác nghiệp thuần túy.\"}, {\"id\": \"D\", \"text\": \"Rủi ro do công nghệ mới.\"}]', 'B', 'Rủi ro văn hóa có thể phát sinh do doanh nghiệp thiếu hiểu biết về phong tục, tập quán, tín ngưỡng, tôn giáo và cách ứng xử của đối tác.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(250, 6, 12, 'Khi chính phủ nước sở tại đột ngột áp dụng hạn ngạch nhập khẩu đối với mặt hàng doanh nghiệp đang kinh doanh, doanh nghiệp đối mặt với:', '[{\"id\": \"A\", \"text\": \"Rủi ro môi trường chính trị.\"}, {\"id\": \"B\", \"text\": \"Rủi ro do nhận thức của khách hàng.\"}, {\"id\": \"C\", \"text\": \"Rủi ro thiên nhiên.\"}, {\"id\": \"D\", \"text\": \"Rủi ro tác nghiệp nội bộ.\"}]', 'A', 'Theo , sự can thiệp quá sâu của nhà nước, chẳng hạn hạn ngạch xuất nhập khẩu, là biểu hiện của rủi ro môi trường chính trị.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(251, 6, 13, 'Trường hợp nhà quản trị dự báo sai hoàn toàn về nhu cầu thị trường dẫn đến việc đầu tư nhà máy quy mô quá lớn nhưng không bán được hàng bắt nguồn từ:', '[{\"id\": \"A\", \"text\": \"Rủi ro do nhận thức của con người.\"}, {\"id\": \"B\", \"text\": \"Rủi ro thảm họa thiên nhiên.\"}, {\"id\": \"C\", \"text\": \"Rủi ro bất khả kháng.\"}, {\"id\": \"D\", \"text\": \"Rủi ro văn hóa quốc tế.\"}]', 'A', 'Rủi ro do nhận thức con người xảy ra khi nhận diện, phân tích sai thực tế khách quan, dẫn tới các quyết định kinh doanh sai lầm nghiêm trọng.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(252, 6, 14, 'Yếu tố nào sau đây KHÔNG thuộc môi trường bên ngoài của doanh nghiệp?', '[{\"id\": \"A\", \"text\": \"Khách hàng và đối thủ cạnh tranh.\"}, {\"id\": \"B\", \"text\": \"Biến động lãi suất và chính sách thuế của nhà nước.\"}, {\"id\": \"C\", \"text\": \"Quy trình kiểm soát chất lượng tại phân xưởng sản xuất.\"}, {\"id\": \"D\", \"text\": \"Văn hóa và tập quán tiêu dùng của người dân bản địa.\"}]', 'C', 'Quy trình sản xuất thuộc môi trường nội tại (môi trường bên trong) của doanh nghiệp.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(253, 6, 15, 'Khi tiếp cận rủi ro môi trường bên trong theo chuỗi giá trị, doanh nghiệp cần phân tích các khâu nào?', '[{\"id\": \"A\", \"text\": \"Đầu vào, chuỗi cung ứng và quá trình tác nghiệp.\"}, {\"id\": \"B\", \"text\": \"Môi trường chính trị và luật pháp quốc tế.\"}, {\"id\": \"C\", \"text\": \"Tỷ giá hối đoái và cán cân thương mại.\"}, {\"id\": \"D\", \"text\": \"Hành vi mua hàng của người tiêu dùng toàn cầu.\"}]', 'A', 'Theo , tiếp cận chuỗi giá trị bên trong gồm: khâu đầu vào, chuỗi cung ứng và quá trình tác nghiệp chế biến/sản xuất.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(254, 6, 16, 'Rủi ro liên quan đến các nghĩa vụ bồi thường hoặc tranh chấp pháp lý của doanh nghiệp thuộc nhóm đối tượng rủi ro nào?', '[{\"id\": \"A\", \"text\": \"Rủi ro về tài sản.\"}, {\"id\": \"B\", \"text\": \"Rủi ro về nhân lực.\"}, {\"id\": \"C\", \"text\": \"Rủi ro về trách nhiệm pháp lý.\"}, {\"id\": \"D\", \"text\": \"Rủi ro thị trường.\"}]', 'C', 'Theo cách phân loại theo đối tượng rủi ro , đây là rủi ro về trách nhiệm pháp lý.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(255, 6, 17, 'Một kho hàng bị cháy rụi dẫn đến mất trắng hàng triệu USD tiền nguyên liệu. Đây là rủi ro xét theo đối tượng nào?', '[{\"id\": \"A\", \"text\": \"Rủi ro về nhân lực.\"}, {\"id\": \"B\", \"text\": \"Rủi ro về tài sản.\"}, {\"id\": \"C\", \"text\": \"Rủi ro đạo đức.\"}, {\"id\": \"D\", \"text\": \"Rủi ro danh tiếng.\"}]', 'B', 'Thiệt hại trực tiếp lên hàng hóa, kho bãi, máy móc là rủi ro về mặt tài sản.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(256, 6, 18, 'Rủi ro xuất hiện khi các chuyên gia công nghệ chủ chốt của doanh nghiệp bị công ty đối thủ mua chuộc và đồng loạt từ chức thuộc loại:', '[{\"id\": \"A\", \"text\": \"Rủi ro về tài sản.\"}, {\"id\": \"B\", \"text\": \"Rủi ro về nhân lực.\"}, {\"id\": \"C\", \"text\": \"Rủi ro chuyển đổi.\"}, {\"id\": \"D\", \"text\": \"Rủi ro kinh tế vĩ mô.\"}]', 'B', 'Mất mát, biến động tiêu cực về mặt con người, nhân sự then chốt cấu thành rủi ro nhân lực.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(257, 6, 19, 'Hiện tượng các siêu cường kinh tế điều chỉnh chính sách tiền tệ gây biến động dây chuyền đến thị trường hàng hóa quốc tế phản ánh rủi ro từ:', '[{\"id\": \"A\", \"text\": \"Môi trường kinh tế.\"}, {\"id\": \"B\", \"text\": \"Môi trường nội bộ tổ chức.\"}, {\"id\": \"C\", \"text\": \"Rủi ro thảm họa.\"}, {\"id\": \"D\", \"text\": \"Rủi ro giáo dục.\"}]', 'A', 'Các động thái kinh tế vĩ mô của những nền kinh tế lớn tác động sâu sắc đến hệ thống thị trường thế giới, tạo nên sự bất ổn của môi trường kinh tế.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56'),
(258, 6, 20, 'Vì sao nói rủi ro trong kinh doanh quốc tế phức tạp hơn nhiều so với kinh doanh nội địa?', '[{\"id\": \"A\", \"text\": \"Do doanh nghiệp phải đối mặt đồng thời với sự khác biệt về luật pháp, văn hóa, chính trị và biến động tỷ giá giữa các nước.\"}, {\"id\": \"B\", \"text\": \"Do kinh doanh quốc tế không bao giờ được pháp luật nước sở tại bảo hộ.\"}, {\"id\": \"C\", \"text\": \"Do thị trường quốc tế không có các tổ chức tài chính trung gian.\"}, {\"id\": \"D\", \"text\": \"Do doanh nghiệp quốc tế chỉ gặp rủi ro thuần túy mà không có rủi ro suy đoán.\"}]', 'A', 'Môi trường kinh doanh quốc tế chịu sự chi phối đa dạng từ luật pháp quốc tế, văn hóa bản địa, biến động tỷ giá và bất ổn địa chính trị phức tạp hơn thị trường nội địa rất nhiều.', 'Trung bình', '2026-10-08 03:02:56', '2026-10-08 03:02:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `subjects`
--

INSERT INTO `subjects` (`id`, `category_id`, `name`, `slug`, `icon`, `description`, `status`, `order`, `created_at`, `updated_at`) VALUES
(4, 4, 'Quản trị học', 'quan-tri-hoc', '', NULL, 'active', 0, '2026-10-08 02:24:21', '2026-10-08 02:24:21'),
(5, 4, 'Kinh tế chính trị', 'kinh-te-chinh-tri', '', NULL, 'active', 0, '2026-10-08 02:47:35', '2026-10-08 02:47:35'),
(6, 5, 'Quản trị rủi ro', 'quan-tri-rui-ro', '', NULL, 'active', 0, '2026-10-08 03:02:31', '2026-10-08 03:02:31'),
(7, 4, 'CNXHKH', 'cnxhkh', '📖', NULL, 'active', 0, '2026-10-09 03:28:23', '2026-10-09 03:28:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `plan` enum('1subject','3subject','5subject','full') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subjects` json DEFAULT NULL,
  `price` int NOT NULL,
  `valid_from` date NOT NULL,
  `valid_until` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan`, `subjects`, `price`, `valid_from`, `valid_until`, `is_active`, `payment_reference`, `created_at`, `updated_at`) VALUES
(2, 5, '1subject', '[4]', 19000, '2026-10-08', '2126-09-14', 1, 'LHfWorBmhdDwCSZ09', '2026-10-08 08:37:32', '2026-10-08 08:59:03'),
(5, 2, '1subject', '[]', 19000, '2026-10-09', '2126-09-15', 1, 'LH4ROqDh472AVQdEK', '2026-10-09 07:39:39', '2026-10-09 07:39:39'),
(6, 7, '1subject', '[7]', 19000, '2026-10-09', '2126-09-15', 1, 'LH1bnfqC6Bua1Uzcz', '2026-10-09 08:13:43', '2026-10-09 08:13:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('student','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `admin_role` enum('super','content') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin role: super=full admin, content=content manager only',
  `school` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `major` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','blocked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `total_learning_hours` decimal(8,2) NOT NULL DEFAULT '0.00',
  `overall_accuracy` decimal(5,2) NOT NULL DEFAULT '0.00',
  `avg_speed_seconds` decimal(6,2) NOT NULL DEFAULT '0.00',
  `exams_completed` int NOT NULL DEFAULT '0',
  `last_exam_date` timestamp NULL DEFAULT NULL,
  `free_uses` smallint UNSIGNED NOT NULL DEFAULT '2',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `admin_role`, `school`, `major`, `year`, `phone`, `status`, `total_learning_hours`, `overall_accuracy`, `avg_speed_seconds`, `exams_completed`, `last_exam_date`, `free_uses`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin LingoHub', 'admin@lingohub.vn', 'admin', 'super', NULL, NULL, NULL, NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$/wB8OQccpnQEudO0pgdVe.Kn5GpJWyoo3XYJnQ0e29hgaKJSslbfW', NULL, '2026-10-08 02:11:52', '2026-10-08 02:19:08'),
(2, 'Nguyễn Văn Demo', 'demo@lingohub.vn', 'student', NULL, 'ĐH Kinh tế TP.HCM', 'Quản trị Kinh doanh', '3', NULL, 'active', 1.00, 0.00, 0.00, 2, NULL, 2, NULL, '$2y$12$5SoBY2QYJio9J3zRt/jPa.5b92q/xzIc/e2Iw0XqkJlJsUI3qItIu', NULL, '2026-10-08 02:11:53', '2026-10-08 04:30:55'),
(3, 'Trần Thị Sinh Viên', 'sinhvien@uni.edu.vn', 'student', NULL, 'ĐH Bách Khoa HN', 'Công nghệ thông tin', '2', NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$kPK94RIHKWi8tL/bNgFIOeS61dRGnIfYrkAD.5KyHpCwvPEnryLB2', NULL, '2026-10-08 02:11:53', '2026-10-08 02:11:53'),
(4, 'Nguyễn Đức Anh Minh', 'ndaminh26062006@gmail.com', 'admin', 'content', NULL, NULL, NULL, NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$.HaKR889W2W1099H6zliYu1yUvjcG4MYO7XGmCPtqZuP6nlWWtTkC', NULL, '2026-10-08 02:13:51', '2026-10-09 02:58:38'),
(5, 'Nguyễn Đức Minh Anh', 'ndaminh2606@gmail.com', 'student', NULL, NULL, NULL, NULL, NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$EoqAejjClAIju6DO1SPL..Br1sf9CquMa7mU./ltXYKSZsjus8T22', NULL, '2026-10-08 08:10:41', '2026-10-08 08:10:41'),
(6, 'Nguyễn Văn A', 'nva@gmail.com', 'admin', 'super', NULL, NULL, NULL, NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$6qS7yjNjb00Jwr22L5/S7eq7rayuwH22JOB.S1MRnNbv7N4Ov35hK', NULL, '2026-10-08 11:19:45', '2026-10-09 03:05:56'),
(7, 'Nguyễn Văn B', 'nvb@gmail.com', 'student', NULL, NULL, NULL, NULL, NULL, 'active', 0.00, 0.00, 0.00, 0, NULL, 2, NULL, '$2y$12$OyG7IZJaNQ5AMciVNVfaD.FKWA88JbHtY.ClAlITB3Z6Mm68QZLpe', NULL, '2026-10-09 07:41:16', '2026-10-09 07:41:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `achievement_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#6b7280',
  `unlocked_at` timestamp NULL DEFAULT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_document_submissions`
--

CREATE TABLE `user_document_submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `document_id` bigint UNSIGNED NOT NULL,
  `score` double(8,2) NOT NULL DEFAULT '0.00',
  `correct_count` int NOT NULL DEFAULT '0',
  `total_questions` int NOT NULL DEFAULT '0',
  `accuracy_percent` double(8,2) NOT NULL DEFAULT '0.00',
  `time_spent_seconds` int NOT NULL DEFAULT '0',
  `avg_time_per_question` double(8,2) DEFAULT NULL,
  `answered_count` int NOT NULL DEFAULT '0',
  `skipped_count` int NOT NULL DEFAULT '0',
  `is_passed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_exam_attempts`
--

CREATE TABLE `user_exam_attempts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_exam_attempts`
--

INSERT INTO `user_exam_attempts` (`id`, `user_id`, `exam_id`, `subject_id`, `attempted_at`, `created_at`, `updated_at`) VALUES
(1, 2, 11, 7, '2026-10-09 07:18:12', '2026-10-09 07:18:12', '2026-10-09 07:18:12'),
(2, 2, 12, 7, '2026-10-09 07:24:48', '2026-10-09 07:24:48', '2026-10-09 07:24:48'),
(3, 2, 15, 7, '2026-10-09 07:24:56', '2026-10-09 07:24:56', '2026-10-09 07:24:56'),
(4, 2, 8, 5, '2026-10-09 07:25:11', '2026-10-09 07:25:11', '2026-10-09 07:25:11'),
(5, 2, 10, 4, '2026-10-09 07:25:17', '2026-10-09 07:25:17', '2026-10-09 07:25:17'),
(6, 2, 7, 5, '2026-10-09 07:25:22', '2026-10-09 07:25:22', '2026-10-09 07:25:22'),
(7, 2, 4, 4, '2026-10-09 07:26:14', '2026-10-09 07:26:14', '2026-10-09 07:26:14'),
(8, 2, 6, 4, '2026-10-09 07:26:19', '2026-10-09 07:26:19', '2026-10-09 07:26:19'),
(9, 7, 11, 7, '2026-10-09 07:41:23', '2026-10-09 07:41:23', '2026-10-09 07:41:23'),
(10, 7, 15, 7, '2026-10-09 08:16:05', '2026-10-09 08:16:05', '2026-10-09 08:16:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_exam_submissions`
--

CREATE TABLE `user_exam_submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `score` decimal(4,2) NOT NULL,
  `correct_count` int NOT NULL,
  `total_questions` int NOT NULL,
  `accuracy_percent` decimal(5,2) NOT NULL,
  `time_spent_seconds` int DEFAULT NULL,
  `avg_time_per_question` decimal(6,2) DEFAULT NULL,
  `answered_count` int NOT NULL,
  `skipped_count` int NOT NULL DEFAULT '0',
  `mode` enum('exam','practice') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'exam',
  `is_passed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_exam_submissions`
--

INSERT INTO `user_exam_submissions` (`id`, `user_id`, `exam_id`, `score`, `correct_count`, `total_questions`, `accuracy_percent`, `time_spent_seconds`, `avg_time_per_question`, `answered_count`, `skipped_count`, `mode`, `is_passed`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 2, 7, 0.00, 0, 3, 0.00, 0, 0.00, 3, 0, 'exam', 0, '2026-10-08 04:30:15', '2026-10-08 04:30:15', '2026-10-08 04:30:15'),
(2, 2, 8, 0.00, 0, 3, 0.00, 0, 0.00, 3, 0, 'exam', 0, '2026-10-08 04:30:55', '2026-10-08 04:30:55', '2026-10-08 04:30:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_learning_streaks`
--

CREATE TABLE `user_learning_streaks` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `total_hours` decimal(8,2) NOT NULL DEFAULT '0.00',
  `current_streak_days` int NOT NULL DEFAULT '0',
  `last_activity_date` date DEFAULT NULL,
  `longest_streak_days` int NOT NULL DEFAULT '0',
  `hours_this_week` decimal(6,2) NOT NULL DEFAULT '0.00',
  `hours_this_month` decimal(6,2) NOT NULL DEFAULT '0.00',
  `exams_completed_week` int NOT NULL DEFAULT '0',
  `exams_completed_month` int NOT NULL DEFAULT '0',
  `overall_accuracy` decimal(5,2) NOT NULL DEFAULT '0.00',
  `avg_speed_seconds` decimal(6,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_learning_streaks`
--

INSERT INTO `user_learning_streaks` (`id`, `user_id`, `total_hours`, `current_streak_days`, `last_activity_date`, `longest_streak_days`, `hours_this_week`, `hours_this_month`, `exams_completed_week`, `exams_completed_month`, `overall_accuracy`, `avg_speed_seconds`, `created_at`, `updated_at`) VALUES
(1, 2, 1.00, 1, '2026-10-08', 1, 0.00, 0.00, 2, 2, 0.00, 0.00, '2026-10-08 04:30:15', '2026-10-08 04:30:55');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_user_id_foreign` (`user_id`),
  ADD KEY `comments_commentable_type_commentable_id_index` (`commentable_type`,`commentable_id`);

--
-- Chỉ mục cho bảng `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_created_by_foreign` (`created_by`),
  ADD KEY `documents_subject_id_foreign` (`subject_id`);

--
-- Chỉ mục cho bảng `essay_questions`
--
ALTER TABLE `essay_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `essay_questions_created_by_foreign` (`created_by`),
  ADD KEY `essay_questions_subject_id_foreign` (`subject_id`);

--
-- Chỉ mục cho bảng `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_new_created_by_fk` (`created_by`),
  ADD KEY `exams_subject_id_foreign` (`subject_id`);

--
-- Chỉ mục cho bảng `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_questions_exam_id_foreign` (`exam_id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `flashcard_cards`
--
ALTER TABLE `flashcard_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flashcard_cards_deck_id_foreign` (`deck_id`);

--
-- Chỉ mục cho bảng `flashcard_decks`
--
ALTER TABLE `flashcard_decks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flashcard_decks_created_by_foreign` (`created_by`);

--
-- Chỉ mục cho bảng `freemium_usages`
--
ALTER TABLE `freemium_usages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `freemium_usages_ip_address_device_id_feature_unique` (`ip_address`,`device_id`,`feature`),
  ADD KEY `freemium_usages_ip_address_index` (`ip_address`),
  ADD KEY `freemium_usages_used_count_index` (`used_count`),
  ADD KEY `freemium_usages_last_used_at_index` (`last_used_at`);

--
-- Chỉ mục cho bảng `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `likes_user_id_likeable_type_likeable_id_unique` (`user_id`,`likeable_type`,`likeable_id`),
  ADD KEY `likes_likeable_type_likeable_id_index` (`likeable_type`,`likeable_id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_transactions_reference_code_unique` (`reference_code`),
  ADD KEY `payment_transactions_user_id_status_index` (`user_id`,`status`),
  ADD KEY `payment_transactions_reference_code_index` (`reference_code`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_document_id_foreign` (`document_id`);

--
-- Chỉ mục cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subjects_slug_unique` (`slug`),
  ADD KEY `subjects_category_id_foreign` (`category_id`);

--
-- Chỉ mục cho bảng `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscriptions_user_id_unique` (`user_id`),
  ADD KEY `subscriptions_user_id_is_active_index` (`user_id`,`is_active`),
  ADD KEY `subscriptions_valid_until_index` (`valid_until`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_total_learning_hours_index` (`total_learning_hours`),
  ADD KEY `users_overall_accuracy_index` (`overall_accuracy`),
  ADD KEY `users_avg_speed_seconds_index` (`avg_speed_seconds`);

--
-- Chỉ mục cho bảng `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_achievements_user_id_achievement_key_unique` (`user_id`,`achievement_key`),
  ADD KEY `user_achievements_user_id_index` (`user_id`),
  ADD KEY `user_achievements_unlocked_at_index` (`unlocked_at`);

--
-- Chỉ mục cho bảng `user_document_submissions`
--
ALTER TABLE `user_document_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_document_submissions_user_id_index` (`user_id`),
  ADD KEY `user_document_submissions_document_id_index` (`document_id`),
  ADD KEY `user_document_submissions_completed_at_index` (`completed_at`),
  ADD KEY `user_document_submissions_user_id_created_at_index` (`user_id`,`created_at`);

--
-- Chỉ mục cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_exam_attempts_user_id_exam_id_subject_id_unique` (`user_id`,`exam_id`,`subject_id`),
  ADD KEY `user_exam_attempts_exam_id_foreign` (`exam_id`),
  ADD KEY `user_exam_attempts_subject_id_foreign` (`subject_id`),
  ADD KEY `user_exam_attempts_user_id_subject_id_index` (`user_id`,`subject_id`),
  ADD KEY `user_exam_attempts_attempted_at_index` (`attempted_at`);

--
-- Chỉ mục cho bảng `user_exam_submissions`
--
ALTER TABLE `user_exam_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_exam_submissions_user_id_index` (`user_id`),
  ADD KEY `user_exam_submissions_exam_id_index` (`exam_id`),
  ADD KEY `user_exam_submissions_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `user_exam_submissions_accuracy_percent_index` (`accuracy_percent`),
  ADD KEY `user_exam_submissions_avg_time_per_question_index` (`avg_time_per_question`);

--
-- Chỉ mục cho bảng `user_learning_streaks`
--
ALTER TABLE `user_learning_streaks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_learning_streaks_user_id_unique` (`user_id`),
  ADD KEY `user_learning_streaks_total_hours_index` (`total_hours`),
  ADD KEY `user_learning_streaks_hours_this_week_index` (`hours_this_week`),
  ADD KEY `user_learning_streaks_current_streak_days_index` (`current_streak_days`),
  ADD KEY `user_learning_streaks_overall_accuracy_index` (`overall_accuracy`),
  ADD KEY `user_learning_streaks_avg_speed_seconds_index` (`avg_speed_seconds`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `essay_questions`
--
ALTER TABLE `essay_questions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=345;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcard_cards`
--
ALTER TABLE `flashcard_cards`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `flashcard_decks`
--
ALTER TABLE `flashcard_decks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `freemium_usages`
--
ALTER TABLE `freemium_usages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- AUTO_INCREMENT cho bảng `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_document_submissions`
--
ALTER TABLE `user_document_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `user_exam_submissions`
--
ALTER TABLE `user_exam_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user_learning_streaks`
--
ALTER TABLE `user_learning_streaks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `exams_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `essay_questions`
--
ALTER TABLE `essay_questions`
  ADD CONSTRAINT `essay_questions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `essay_questions_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_new_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `exams_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `exam_questions_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `flashcard_cards`
--
ALTER TABLE `flashcard_cards`
  ADD CONSTRAINT `flashcard_cards_deck_id_foreign` FOREIGN KEY (`deck_id`) REFERENCES `flashcard_decks` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `flashcard_decks`
--
ALTER TABLE `flashcard_decks`
  ADD CONSTRAINT `flashcard_decks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `payment_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_document_submissions`
--
ALTER TABLE `user_document_submissions`
  ADD CONSTRAINT `user_document_submissions_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_document_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  ADD CONSTRAINT `user_exam_attempts_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_exam_attempts_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_exam_attempts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_exam_submissions`
--
ALTER TABLE `user_exam_submissions`
  ADD CONSTRAINT `user_exam_submissions_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_exam_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_learning_streaks`
--
ALTER TABLE `user_learning_streaks`
  ADD CONSTRAINT `user_learning_streaks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
