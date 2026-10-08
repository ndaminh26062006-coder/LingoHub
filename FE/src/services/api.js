import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.lingohub.io.vn/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: global error handling ───────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;

    // 401 → clear auth and redirect to login
    if (status === 401) {
      localStorage.removeItem('lh_token');
      localStorage.removeItem('lh_user');
      window.location.href = '/login';
    }

    // 403 is expected for freemium paywall - don't log as error
    if (status === 403) {
      // Silently reject - FreemiumContext handles it
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Helper to extract validation errors into a flat object
// { email: 'Email không hợp lệ.', password: '...' }
// ─────────────────────────────────────────────────────────────────────────────
export function parseErrors(err) {
  const errors = err?.response?.data?.errors;
  if (!errors) {
    const msg = err?.response?.data?.message || 'Đã có lỗi xảy ra.';
    return { _global: msg };
  }
  // Laravel validation returns { field: ['msg1', 'msg2'] }
  return Object.fromEntries(
    Object.entries(errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: safely extract array from API response
// Handles both: res.data = [...] and res.data = { data: [...], meta: {...} }
// ─────────────────────────────────────────────────────────────────────────────
export function toArray(resData) {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data)) return resData.data;
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const authApi = {
  register: data => api.post('/auth/register', data),
  login:    data => api.post('/auth/login',    data),
  logout:   ()   => api.post('/auth/logout'),
  me:       ()   => api.get('/auth/me'),
  updateProfile: data => api.put('/auth/profile',  data),
  changePassword: data => api.put('/auth/password', data),
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const categoryApi = {
  list:   ()     => api.get('/categories'),
  get:    slug   => api.get(`/categories/${slug}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS (môn học)
// ─────────────────────────────────────────────────────────────────────────────
export const subjectApi = {
  list:   params => api.get('/subjects', { params }),
  get:    id     => api.get(`/subjects/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS (tài liệu trắc nghiệm - bảng documents)
// ─────────────────────────────────────────────────────────────────────────────
export const documentApi = {
  list:      params => api.get('/documents', { params }),
  get:       id     => api.get(`/documents/${id}`),
  questions: id     => api.get(`/documents/${id}/questions`),
  submit:    (id, answers) => api.post(`/documents/${id}/submit`, { answers }),
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMS (đề thi thử - bảng exams mới)
// ─────────────────────────────────────────────────────────────────────────────
export const examApi = {
  list:      params => api.get('/exams', { params }),
  get:       id     => api.get(`/exams/${id}`),
  questions: id     => api.get(`/exams/${id}/questions`),
  submit:    (id, answers) => api.post(`/exams/${id}/submit`, { answers }),
};

// ─────────────────────────────────────────────────────────────────────────────
// ESSAYS
// ─────────────────────────────────────────────────────────────────────────────
export const essayApi = {
  list:         params => api.get('/essays', { params }),
  get:          id     => api.get(`/essays/${id}`),
  unlockSample: id     => api.post(`/essays/${id}/unlock-sample`),
};

// ─────────────────────────────────────────────────────────────────────────────
// FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────
export const flashcardApi = {
  list:           params => api.get('/flashcards', { params }),
  adminDecks:     ()     => api.get('/flashcards/admin'),
  communityDecks: params => api.get('/flashcards/community', { params }),
  myDecks:        ()     => api.get('/flashcards/mine'),
  get:            id     => api.get(`/flashcards/${id}`),
  getCards:       id     => api.get(`/flashcards/${id}/cards`),
  create:         data   => api.post('/flashcards', data),
  update:         (id, data) => api.put(`/flashcards/${id}`, data),
  delete:         id     => api.delete(`/flashcards/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const paymentApi = {
  create:         data => api.post('/payments/sepay/create', data),
  getStatus:      refCode => api.get(`/payments/sepay/status/${refCode}`),
  getHistory:     ()   => api.get('/payments/history'),
};

// ─────────────────────────────────────────────────────────────────────────────
// LIKES
// ─────────────────────────────────────────────────────────────────────────────
export const likeApi = {
  getStats: (type, id) => api.get(`/likes/stats/${type}/${id}`),
  store: data => api.post('/likes', data),
  destroy: id => api.delete(`/likes/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const commentApi = {
  list: (type, id) => api.get(`/comments/${type}/${id}`),
  get: id => api.get(`/comments/${id}`),
  store: data => api.post('/comments', data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  destroy: id => api.delete(`/comments/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// FREEMIUM
// ─────────────────────────────────────────────────────────────────────────────
export const freemiumApi = {
  checkAccess: data => api.post('/freemium/check-access', data),
  getPricing: () => api.get('/freemium/pricing'),
  getUsageStats: data => api.post('/freemium/usage-stats', data),
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const subscriptionApi = {
  me:              ()   => api.get('/subscriptions/me'),
  checkSubject:    data => api.post('/subscriptions/check-subject', data),
  history:         ()   => api.get('/subscriptions/history'),
};

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const leaderboardApi = {
  get: params => api.get('/leaderboard', { params }),
};
export const adminApi = {
  // Dashboard
  stats: () => api.get('/admin/stats'),

  // Users
  users:       params    => api.get('/admin/users', { params }),
  getUser:     id        => api.get(`/admin/users/${id}`),
  updateUser:  (id, data) => api.put(`/admin/users/${id}`, data),
  toggleBlock: id        => api.put(`/admin/users/${id}/toggle-block`),
  deleteUser:  id        => api.delete(`/admin/users/${id}`),

  // Categories
  createCategory: data      => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: id        => api.delete(`/admin/categories/${id}`),

  // Subjects
  createSubject: data      => api.post('/admin/subjects', data),
  updateSubject: (id, data) => api.put(`/admin/subjects/${id}`, data),
  deleteSubject: id        => api.delete(`/admin/subjects/${id}`),

  // Documents (tài liệu trắc nghiệm)
  createDocument: data      => api.post('/admin/documents', data),
  updateDocument: (id, data) => api.put(`/admin/documents/${id}`, data),
  deleteDocument: id        => api.delete(`/admin/documents/${id}`),
  getDocumentQuestions: id  => api.get(`/admin/documents/${id}/questions`),
  bulkStoreDocumentQuestions: (docId, questions) => api.post(`/admin/documents/${docId}/questions/bulk`, { questions }),

  // Exams (đề thi thử)
  createExam: data      => api.post('/admin/exams', data),
  updateExam: (id, data) => api.put(`/admin/exams/${id}`, data),
  deleteExam: id        => api.delete(`/admin/exams/${id}`),
  getExamQuestions: id  => api.get(`/admin/exams/${id}/questions`),
  bulkStoreQuestions: (examId, questions) => api.post(`/admin/exams/${examId}/questions/bulk`, { questions }),

  // Essays
  essays:       ()         => api.get('/admin/essays'),
  createEssay:  data       => api.post('/admin/essays', data),
  updateEssay:  (id, data) => api.put(`/admin/essays/${id}`, data),
  deleteEssay:  id         => api.delete(`/admin/essays/${id}`),

  // Flashcards
  flashcards:        ()         => api.get('/admin/flashcards'),
  updateFlashcard:   (id, data) => api.put(`/admin/flashcards/${id}`, data),
  deleteFlashcard:   id         => api.delete(`/admin/flashcards/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD (User)
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getUserDashboard: () => api.get('/user/dashboard'),
};

export default api;
