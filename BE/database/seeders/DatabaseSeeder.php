<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Subject;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\EssayQuestion;
use App\Models\FlashcardDeck;
use App\Models\FlashcardCard;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ─────────────────────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Admin LingoHub',
            'email'    => 'admin@lingohub.vn',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        $demo = User::create([
            'name'     => 'Nguyễn Văn Demo',
            'email'    => 'demo@lingohub.vn',
            'password' => Hash::make('123456'),
            'role'     => 'student',
            'school'   => 'ĐH Kinh tế TP.HCM',
            'major'    => 'Quản trị Kinh doanh',
            'year'     => '3',
            'status'   => 'active',
        ]);

        User::create([
            'name'     => 'Trần Thị Sinh Viên',
            'email'    => 'sinhvien@uni.edu.vn',
            'password' => Hash::make('123456'),
            'role'     => 'student',
            'school'   => 'ĐH Bách Khoa HN',
            'major'    => 'Công nghệ thông tin',
            'year'     => '2',
            'status'   => 'active',
        ]);

        // ── Categories ────────────────────────────────────────────────────
        $daicuong = Category::create([
            'slug'        => 'dai-cuong',
            'name'        => 'Đại cương',
            'icon'        => '',
            'color'       => '#1B3A6B',
            'description' => 'Các môn học đại cương, nền tảng cho mọi ngành',
            'status'      => 'active',
            'order'       => 1,
        ]);

        $kinhte = Category::create([
            'slug'        => 'kinh-te',
            'name'        => 'Kinh tế',
            'icon'        => '💼',
            'color'       => '#F5A623',
            'description' => 'Kinh tế vi mô, vĩ mô, tài chính, kế toán',
            'status'      => 'active',
            'order'       => 2,
        ]);

        $chuyennganh = Category::create([
            'slug'        => 'chuyen-nganh',
            'name'        => 'Chuyên ngành',
            'icon'        => '🔬',
            'color'       => '#254d8f',
            'description' => 'Các môn chuyên ngành kỹ thuật, công nghệ',
            'status'      => 'active',
            'order'       => 3,
        ]);

        // ── Subjects ──────────────────────────────────────────────────────
        $subject1 = Subject::create([
            'category_id' => $kinhte->id,
            'name'        => 'Kinh tế vi mô',
            'slug'        => 'kinh-te-vi-mo',
            'icon'        => '📊',
            'description' => 'Kinh tế vi mô nghiên cứu hành vi của các chủ thể kinh tế',
            'status'      => 'active',
        ]);

        $subject2 = Subject::create([
            'category_id' => $daicuong->id,
            'name'        => 'Tư tưởng Hồ Chí Minh',
            'slug'        => 'tu-tuong-ho-chi-minh',
            'icon'        => '🏛️',
            'description' => 'Tư tưởng Hồ Chí Minh - bộ môn học về lý luận tư tưởng Hồ Chí Minh',
            'status'      => 'active',
        ]);

        $subject3 = Subject::create([
            'category_id' => $chuyennganh->id,
            'name'        => 'Cấu trúc dữ liệu & Giải thuật',
            'slug'        => 'cau-truc-du-lieu-giai-thuat',
            'icon'        => '💻',
            'description' => 'Cấu trúc dữ liệu và giải thuật',
            'status'      => 'active',
        ]);

        // ── Exams ─────────────────────────────────────────────────────────
        $exam1 = Exam::create([
            'subject_id'      => $subject1->id,
            'title'           => 'Kinh tế vi mô - Đề thi cuối kỳ 2024',
            'description'     => 'Đề thi cuối kỳ môn Kinh tế vi mô, bao gồm các chủ đề về cung cầu, co giãn, cấu trúc thị trường.',
            'questions_count' => 50,
            'duration'        => 60,
            'type'            => 'exam',
            'status'          => 'published',
            'attempts'        => 3420,
            'rating'          => 4.8,
            'created_by'      => $admin->id,
        ]);

        $exam2 = Exam::create([
            'subject_id'      => $subject2->id,
            'title'           => 'Tư tưởng Hồ Chí Minh - Bộ đề tổng hợp',
            'description'     => 'Bộ đề ôn tập tổng hợp môn Tư tưởng Hồ Chí Minh.',
            'questions_count' => 50,
            'duration'        => 50,
            'type'            => 'exam',
            'status'          => 'published',
            'attempts'        => 8900,
            'rating'          => 4.7,
            'created_by'      => $admin->id,
        ]);

        $exam3 = Exam::create([
            'subject_id'      => $subject3->id,
            'title'           => 'Cấu trúc dữ liệu - Đề ôn tập tổng hợp',
            'description'     => 'Bộ đề ôn tập môn Cấu trúc dữ liệu & Giải thuật.',
            'questions_count' => 50,
            'duration'        => 75,
            'type'            => 'exam',
            'status'          => 'published',
            'attempts'        => 2890,
            'rating'          => 4.9,
            'created_by'      => $admin->id,
        ]);

        // ── Questions for exam1 ───────────────────────────────────────────
        $sampleQuestions = [
            [
                'content' => 'Theo lý thuyết cầu, khi giá của một hàng hoá tăng lên, lượng cầu của hàng hoá đó sẽ:',
                'options' => [
                    ['id' => 'A', 'text' => 'Tăng lên'],
                    ['id' => 'B', 'text' => 'Giảm xuống'],
                    ['id' => 'C', 'text' => 'Không thay đổi'],
                    ['id' => 'D', 'text' => 'Tăng rồi giảm'],
                ],
                'correct_answer' => 'B',
                'explanation'    => 'Theo quy luật cầu, khi giá hàng hoá tăng lên, người tiêu dùng sẽ mua ít hàng hoá đó hơn, tức là lượng cầu giảm xuống.',
                'difficulty'     => 'Dễ',
            ],
            [
                'content' => 'Co giãn của cầu theo giá (PED) bằng -2 có nghĩa là:',
                'options' => [
                    ['id' => 'A', 'text' => 'Cầu hoàn toàn không co giãn'],
                    ['id' => 'B', 'text' => 'Cầu co giãn đơn vị'],
                    ['id' => 'C', 'text' => 'Cầu co giãn nhiều (co giãn cao)'],
                    ['id' => 'D', 'text' => 'Cầu co giãn ít (kém co giãn)'],
                ],
                'correct_answer' => 'C',
                'explanation'    => 'Khi |PED| > 1, cầu được gọi là co giãn nhiều. |PED| = 2 > 1, nên cầu co giãn nhiều.',
                'difficulty'     => 'Trung bình',
            ],
            [
                'content' => 'Chi phí cơ hội (opportunity cost) là gì?',
                'options' => [
                    ['id' => 'A', 'text' => 'Tổng chi phí sản xuất một đơn vị sản phẩm'],
                    ['id' => 'B', 'text' => 'Giá trị của lựa chọn tốt nhất bị bỏ qua khi đưa ra quyết định'],
                    ['id' => 'C', 'text' => 'Chi phí nguyên vật liệu trực tiếp'],
                    ['id' => 'D', 'text' => 'Chi phí lao động bình quân'],
                ],
                'correct_answer' => 'B',
                'explanation'    => 'Chi phí cơ hội là giá trị của phương án tốt nhất bị từ bỏ khi lựa chọn một phương án khác.',
                'difficulty'     => 'Dễ',
            ],
            [
                'content' => 'Thị trường cạnh tranh hoàn hảo có đặc điểm nào sau đây?',
                'options' => [
                    ['id' => 'A', 'text' => 'Có ít người bán, nhiều người mua'],
                    ['id' => 'B', 'text' => 'Sản phẩm có thể phân biệt được'],
                    ['id' => 'C', 'text' => 'Có rào cản gia nhập thị trường'],
                    ['id' => 'D', 'text' => 'Nhiều người mua, nhiều người bán, sản phẩm đồng nhất'],
                ],
                'correct_answer' => 'D',
                'explanation'    => 'Thị trường cạnh tranh hoàn hảo có: nhiều người mua và người bán, sản phẩm đồng nhất, tự do gia nhập và rời bỏ thị trường.',
                'difficulty'     => 'Dễ',
            ],
            [
                'content' => 'Đường ngân sách dịch chuyển song song ra phía ngoài khi:',
                'options' => [
                    ['id' => 'A', 'text' => 'Giá hàng hoá X tăng'],
                    ['id' => 'B', 'text' => 'Thu nhập của người tiêu dùng tăng'],
                    ['id' => 'C', 'text' => 'Giá hàng hoá Y tăng'],
                    ['id' => 'D', 'text' => 'Thu nhập của người tiêu dùng giảm'],
                ],
                'correct_answer' => 'B',
                'explanation'    => 'Khi thu nhập tăng, người tiêu dùng có thể mua nhiều hàng hoá hơn, đường ngân sách dịch chuyển song song ra ngoài.',
                'difficulty'     => 'Trung bình',
            ],
        ];

        // Pad to 50 questions for all 3 exams
        foreach ([$exam1, $exam2, $exam3] as $exam) {
            for ($i = 0; $i < 50; $i++) {
                $base = $sampleQuestions[$i % count($sampleQuestions)];
                ExamQuestion::create([
                    'exam_id'        => $exam->id,
                    'type'           => 'multiple_choice',
                    'order'          => $i + 1,
                    'content'        => "[Câu " . ($i + 1) . "] " . $base['content'],
                    'options'        => $base['options'],
                    'correct_answer' => $base['correct_answer'],
                    'explanation'    => $base['explanation'],
                    'difficulty'     => 0,
                ]);
            }
        }

        // ── Essay Questions ───────────────────────────────────────────────
        EssayQuestion::create([
            'subject_id'    => $subject2->id,
            'title'         => 'Tư tưởng HCM về vấn đề dân tộc',
            'question'      => 'Phân tích tư tưởng Hồ Chí Minh về vấn đề dân tộc và cách mạng giải phóng dân tộc. Liên hệ với thực tiễn Việt Nam hiện nay.',
            'hint'          => 'Trình bày: (1) Độc lập dân tộc gắn CNXH, (2) Vai trò của Đảng, (3) Đại đoàn kết toàn dân',
            'sample_answer' => "**Mở bài:** Tư tưởng Hồ Chí Minh về vấn đề dân tộc là một trong những di sản lý luận vĩ đại nhất...\n\n**Luận điểm 1:** Độc lập dân tộc gắn liền với CNXH...\n\n**Kết bài:** Tư tưởng HCM mãi là ánh sáng soi đường.",
            'time_limit'    => 45,
            'difficulty'    => 'Trung bình',
            'status'        => 'published',
            'created_by'    => $admin->id,
        ]);

        EssayQuestion::create([
            'subject_id'    => $subject2->id,
            'title'         => 'Ý nghĩa Cách mạng tháng Tám 1945',
            'question'      => 'Trình bày ý nghĩa lịch sử của Cách mạng tháng Tám năm 1945. Tại sao đây được coi là mốc son chói lọi trong lịch sử dân tộc Việt Nam?',
            'hint'          => 'Phân tích theo 3 ý nghĩa: dân tộc, giai cấp, quốc tế.',
            'sample_answer' => "**Mở bài:** Cách mạng tháng Tám 1945 là sự kiện vĩ đại nhất...\n\n**Ý nghĩa dân tộc:** Chấm dứt ách thống trị...\n\n**Kết bài:** CMT8 mãi là mốc son chói lọi.",
            'time_limit'    => 40,
            'difficulty'    => 'Trung bình',
            'status'        => 'published',
            'created_by'    => $admin->id,
        ]);

        EssayQuestion::create([
            'subject_id'    => $subject1->id,
            'title'         => 'Quy luật giá trị trong kinh tế hàng hóa',
            'question'      => 'Phân tích quy luật giá trị trong nền kinh tế hàng hóa. Vận dụng quy luật này vào thực tiễn nền kinh tế thị trường định hướng XHCN ở Việt Nam.',
            'hint'          => 'Trình bày: khái niệm, nội dung quy luật, biểu hiện và tác động trong KTTT VN',
            'sample_answer' => "**Mở bài:** Quy luật giá trị là quy luật kinh tế cơ bản nhất...",
            'time_limit'    => 45,
            'difficulty'    => 'Khó',
            'status'        => 'published',
            'created_by'    => $admin->id,
        ]);

        // ── Flashcard Decks (Admin) ───────────────────────────────────────
        $deck1 = FlashcardDeck::create([
            'name'       => 'Triết học Mác-Lênin',
            'subject'    => 'Triết học',
            'icon'       => '⚖️',
            'color'      => '#1B3A6B',
            'visibility' => 'public',
            'owner_type' => 'admin',
            'status'     => 'published',
            'created_by' => $admin->id,
        ]);

        $triietCards = [
            ['Vật chất là gì? (Định nghĩa Lênin)', 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác.'],
            ['Ý thức là gì theo quan điểm triết học Mác-Lênin?', 'Ý thức là sự phản ánh hiện thực khách quan vào bộ óc con người, là hình ảnh chủ quan của thế giới khách quan. Ý thức có bản chất là một hình thức phản ánh đặc biệt — phản ánh có tính năng động, sáng tạo.'],
            ['Quy luật mâu thuẫn là gì?', 'Quy luật mâu thuẫn (quy luật thống nhất và đấu tranh của các mặt đối lập) là hạt nhân của phép biện chứng, chỉ ra nguồn gốc, động lực của sự vận động và phát triển.'],
            ['Phép biện chứng duy vật gồm những quy luật cơ bản nào?', "3 quy luật cơ bản:\n1. Quy luật mâu thuẫn\n2. Quy luật lượng - chất\n3. Quy luật phủ định của phủ định"],
            ['Thực tiễn là gì? Vai trò của thực tiễn với nhận thức?', 'Thực tiễn là toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội của con người. Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của nhận thức.'],
        ];

        foreach ($triietCards as $i => [$front, $back]) {
            FlashcardCard::create([
                'deck_id' => $deck1->id,
                'front'   => $front,
                'back'    => $back,
                'subject' => 'Triết học',
                'order'   => $i + 1,
            ]);
        }

        $deck2 = FlashcardDeck::create([
            'name'       => 'Lịch sử Đảng',
            'subject'    => 'Lịch sử Đảng',
            'icon'       => '🏛️',
            'color'      => '#c0392b',
            'visibility' => 'public',
            'owner_type' => 'admin',
            'status'     => 'published',
            'created_by' => $admin->id,
        ]);

        $lsDangCards = [
            ['Đảng Cộng sản Việt Nam thành lập ngày tháng năm nào?', '3/2/1930 — Đảng Cộng sản Việt Nam được thành lập tại Hội nghị hợp nhất các tổ chức cộng sản ở Hương Cảng (Trung Quốc) dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc.'],
            ['Cách mạng tháng Tám 1945 thành công vào ngày nào?', 'Ngày 19/8/1945 — Nhân dân Hà Nội giành chính quyền. Ngày 2/9/1945 — Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập.'],
            ['Đại hội Đảng lần thứ VI (1986) có ý nghĩa gì?', 'Đại hội VI (12/1986) là mốc mở đầu công cuộc Đổi mới toàn diện, chuyển từ kế hoạch hóa tập trung sang kinh tế thị trường có sự quản lý của Nhà nước.'],
        ];

        foreach ($lsDangCards as $i => [$front, $back]) {
            FlashcardCard::create([
                'deck_id' => $deck2->id,
                'front'   => $front,
                'back'    => $back,
                'subject' => 'Lịch sử Đảng',
                'order'   => $i + 1,
            ]);
        }

        // Deck của sinh viên (public)
        $deck3 = FlashcardDeck::create([
            'name'       => 'Kinh tế vi mô - Ôn thi cuối kỳ',
            'subject'    => 'Kinh tế vi mô',
            'icon'       => '💡',
            'color'      => '#16a34a',
            'visibility' => 'public',
            'owner_type' => 'user',
            'status'     => 'published',
            'likes'      => 142,
            'created_by' => $demo->id,
        ]);

        FlashcardCard::create(['deck_id' => $deck3->id, 'front' => 'Co giãn của cầu theo giá (PED) là gì?', 'back' => "PED đo lường mức độ phản ứng của lượng cầu khi giá thay đổi.\nPED = %ΔQd / %ΔP\n• |PED| > 1: Cầu co giãn nhiều\n• |PED| < 1: Cầu co giãn ít", 'subject' => 'Kinh tế vi mô', 'order' => 1]);
        FlashcardCard::create(['deck_id' => $deck3->id, 'front' => 'Chi phí cơ hội là gì?', 'back' => 'Chi phí cơ hội là giá trị của phương án tốt nhất bị từ bỏ khi đưa ra một quyết định lựa chọn.', 'subject' => 'Kinh tế vi mô', 'order' => 2]);

        $this->command->info('✅ LingoHub seeded successfully!');
        $this->command->info('   Admin:    admin@lingohub.vn / admin123');
        $this->command->info('   Student:  demo@lingohub.vn / 123456');
    }
}
