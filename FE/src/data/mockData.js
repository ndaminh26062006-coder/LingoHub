// ===== Mock Data for LingoHub =====

export const categories = [
  {
    id: 'dai-cuong',
    name: 'Đại cương',
    icon: '📚',
    color: '#1B3A6B',
    description: 'Các môn học đại cương, nền tảng cho mọi ngành',
    count: 120,
    subjects: [
      { id: 'toan-cao-cap', name: 'Toán cao cấp', exams: 24, questions: 1200 },
      { id: 'vat-ly-dai-cuong', name: 'Vật lý đại cương', exams: 18, questions: 900 },
      { id: 'hoa-dai-cuong', name: 'Hóa đại cương', exams: 15, questions: 750 },
      { id: 'tieng-anh-dai-cuong', name: 'Tiếng Anh đại cương', exams: 30, questions: 1500 },
      { id: 'tu-tuong-hcm', name: 'Tư tưởng Hồ Chí Minh', exams: 20, questions: 1000 },
      { id: 'lich-su-dang', name: 'Lịch sử Đảng', exams: 16, questions: 800 },
    ],
  },
  {
    id: 'kinh-te',
    name: 'Kinh tế',
    icon: '💼',
    color: '#F5A623',
    description: 'Kinh tế vi mô, vĩ mô, tài chính, kế toán',
    count: 95,
    subjects: [
      { id: 'kinh-te-vi-mo', name: 'Kinh tế vi mô', exams: 22, questions: 1100 },
      { id: 'kinh-te-vi-mo-2', name: 'Kinh tế vĩ mô', exams: 20, questions: 1000 },
      { id: 'ke-toan-tai-chinh', name: 'Kế toán tài chính', exams: 18, questions: 900 },
      { id: 'quan-tri-kinh-doanh', name: 'Quản trị kinh doanh', exams: 25, questions: 1250 },
      { id: 'tai-chinh-doanh-nghiep', name: 'Tài chính doanh nghiệp', exams: 15, questions: 750 },
      { id: 'marketing', name: 'Marketing căn bản', exams: 19, questions: 950 },
    ],
  },
  {
    id: 'chuyen-nganh',
    name: 'Chuyên ngành',
    icon: '🔬',
    color: '#254d8f',
    description: 'Các môn chuyên ngành kỹ thuật, công nghệ, y dược',
    count: 148,
    subjects: [
      { id: 'cau-truc-du-lieu', name: 'Cấu trúc dữ liệu & Giải thuật', exams: 28, questions: 1400 },
      { id: 'mang-may-tinh', name: 'Mạng máy tính', exams: 20, questions: 1000 },
      { id: 'co-so-du-lieu', name: 'Cơ sở dữ liệu', exams: 24, questions: 1200 },
      { id: 'lap-trinh-oop', name: 'Lập trình hướng đối tượng', exams: 22, questions: 1100 },
      { id: 'he-dieu-hanh', name: 'Hệ điều hành', exams: 18, questions: 900 },
      { id: 'tri-tue-nhan-tao', name: 'Trí tuệ nhân tạo', exams: 16, questions: 800 },
    ],
  },
];

export const featuredExams = [
  {
    id: 'exam-1',
    title: 'Kinh tế vi mô - Đề thi cuối kỳ 2024',
    subject: 'Kinh tế vi mô',
    category: 'kinh-te',
    questions: 50,
    duration: 60,
    attempts: 3420,
    difficulty: 'Trung bình',
    rating: 4.8,
  },
  {
    id: 'exam-2',
    title: 'Toán cao cấp A1 - Đề thi HK1 2023-2024',
    subject: 'Toán cao cấp',
    category: 'dai-cuong',
    questions: 50,
    duration: 90,
    attempts: 5120,
    difficulty: 'Khó',
    rating: 4.6,
  },
  {
    id: 'exam-3',
    title: 'Cấu trúc dữ liệu - Đề ôn tập tổng hợp',
    subject: 'Cấu trúc dữ liệu & Giải thuật',
    category: 'chuyen-nganh',
    questions: 50,
    duration: 75,
    attempts: 2890,
    difficulty: 'Khó',
    rating: 4.9,
  },
  {
    id: 'exam-4',
    title: 'Tư tưởng Hồ Chí Minh - Bộ đề 200 câu',
    subject: 'Tư tưởng Hồ Chí Minh',
    category: 'dai-cuong',
    questions: 50,
    duration: 50,
    attempts: 8900,
    difficulty: 'Dễ',
    rating: 4.7,
  },
];

// Generate 50 sample questions for demo exam
export const generateQuestions = (count = 50) => {
  const sampleQuestions = [
    {
      id: 1,
      text: 'Theo lý thuyết cầu, khi giá của một hàng hoá tăng lên, lượng cầu của hàng hoá đó sẽ:',
      options: [
        { id: 'A', text: 'Tăng lên' },
        { id: 'B', text: 'Giảm xuống' },
        { id: 'C', text: 'Không thay đổi' },
        { id: 'D', text: 'Tăng rồi giảm' },
      ],
      correctAnswer: 'B',
      explanation:
        'Theo quy luật cầu, khi giá hàng hoá tăng lên (với các yếu tố khác không đổi), người tiêu dùng sẽ mua ít hàng hoá đó hơn, tức là lượng cầu giảm xuống. Đây là mối quan hệ nghịch chiều giữa giá và lượng cầu.',
      subject: 'Kinh tế vi mô',
      difficulty: 'Dễ',
    },
    {
      id: 2,
      text: 'Co giãn của cầu theo giá (PED) bằng -2 có nghĩa là:',
      options: [
        { id: 'A', text: 'Cầu hoàn toàn không co giãn' },
        { id: 'B', text: 'Cầu co giãn đơn vị' },
        { id: 'C', text: 'Cầu co giãn nhiều (co giãn cao)' },
        { id: 'D', text: 'Cầu co giãn ít (kém co giãn)' },
      ],
      correctAnswer: 'C',
      explanation:
        'Khi |PED| > 1, cầu được gọi là co giãn nhiều (co giãn cao). |PED| = 2 > 1, do đó cầu co giãn nhiều. Điều này có nghĩa là khi giá tăng 1%, lượng cầu giảm 2%.',
      subject: 'Kinh tế vi mô',
      difficulty: 'Trung bình',
    },
    {
      id: 3,
      text: 'Đường ngân sách (budget line) dịch chuyển song song ra phía ngoài khi:',
      options: [
        { id: 'A', text: 'Giá hàng hoá X tăng' },
        { id: 'B', text: 'Thu nhập của người tiêu dùng tăng' },
        { id: 'C', text: 'Giá hàng hoá Y tăng' },
        { id: 'D', text: 'Thu nhập của người tiêu dùng giảm' },
      ],
      correctAnswer: 'B',
      explanation:
        'Khi thu nhập tăng, người tiêu dùng có thể mua nhiều hàng hoá hơn ở cùng mức giá. Điều này làm đường ngân sách dịch chuyển song song ra phía ngoài (xa gốc toạ độ hơn) vì cả hai điểm chắn trên trục đều tăng.',
      subject: 'Kinh tế vi mô',
      difficulty: 'Trung bình',
    },
    {
      id: 4,
      text: 'Thị trường cạnh tranh hoàn hảo có đặc điểm nào sau đây?',
      options: [
        { id: 'A', text: 'Có ít người bán, nhiều người mua' },
        { id: 'B', text: 'Sản phẩm có thể phân biệt được' },
        { id: 'C', text: 'Có rào cản gia nhập thị trường' },
        { id: 'D', text: 'Nhiều người mua, nhiều người bán, sản phẩm đồng nhất' },
      ],
      correctAnswer: 'D',
      explanation:
        'Thị trường cạnh tranh hoàn hảo có đặc điểm: (1) Nhiều người mua và người bán, (2) Sản phẩm đồng nhất (homogeneous), (3) Tự do gia nhập và rời bỏ thị trường, (4) Thông tin hoàn hảo. Không có người nào có quyền lực thị trường.',
      subject: 'Kinh tế vi mô',
      difficulty: 'Dễ',
    },
    {
      id: 5,
      text: 'Chi phí cơ hội (opportunity cost) là gì?',
      options: [
        { id: 'A', text: 'Tổng chi phí sản xuất một đơn vị sản phẩm' },
        { id: 'B', text: 'Giá trị của lựa chọn tốt nhất bị bỏ qua khi đưa ra quyết định' },
        { id: 'C', text: 'Chi phí nguyên vật liệu trực tiếp' },
        { id: 'D', text: 'Chi phí lao động bình quân' },
      ],
      correctAnswer: 'B',
      explanation:
        'Chi phí cơ hội là giá trị của phương án tốt nhất bị từ bỏ khi lựa chọn một phương án khác. Đây là khái niệm cốt lõi trong kinh tế học, phản ánh rằng các nguồn lực khan hiếm và mọi lựa chọn đều có chi phí ẩn.',
      subject: 'Kinh tế vi mô',
      difficulty: 'Dễ',
    },
  ];

  const questions = [];
  for (let i = 0; i < count; i++) {
    const base = sampleQuestions[i % sampleQuestions.length];
    questions.push({
      ...base,
      id: i + 1,
      text: `[Câu ${i + 1}] ${base.text}`,
    });
  }
  return questions;
};

export const examList = [
  {
    id: 'exam-kinh-te-1',
    title: 'Kinh tế vi mô - Đề thi cuối kỳ 2024',
    subject: 'Kinh tế vi mô',
    categoryId: 'kinh-te',
    questions: 50,
    duration: 60,
    attempts: 3420,
    difficulty: 'Trung bình',
    rating: 4.8,
    description: 'Đề thi cuối kỳ môn Kinh tế vi mô, bao gồm các chủ đề về cung cầu, co giãn, cấu trúc thị trường.',
  },
  {
    id: 'exam-toan-1',
    title: 'Toán cao cấp A1 - Đề thi HK1 2023-2024',
    subject: 'Toán cao cấp',
    categoryId: 'dai-cuong',
    questions: 50,
    duration: 90,
    attempts: 5120,
    difficulty: 'Khó',
    rating: 4.6,
    description: 'Đề thi học kỳ 1 môn Toán cao cấp A1, bao gồm giới hạn, đạo hàm, tích phân.',
  },
  {
    id: 'exam-ctdl-1',
    title: 'Cấu trúc dữ liệu - Đề ôn tập tổng hợp',
    subject: 'Cấu trúc dữ liệu',
    categoryId: 'chuyen-nganh',
    questions: 50,
    duration: 75,
    attempts: 2890,
    difficulty: 'Khó',
    rating: 4.9,
    description: 'Bộ đề ôn tập tổng hợp môn Cấu trúc dữ liệu & Giải thuật.',
  },
];
