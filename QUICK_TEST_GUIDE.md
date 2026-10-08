# 🧪 Quick Testing Guide - List View Comments & Likes

This guide shows you how to quickly test the new features on each page.

---

## 🎯 Quick Start

### 1. Start the Servers
```bash
# Terminal 1: Backend
cd BE
php artisan serve

# Terminal 2: Frontend
cd FE
npm run dev
```

### 2. Open in Browser
```
http://localhost:5173
```

### 3. Login (Required for voting/commenting)
- Email: `testcomment@test.com`
- Password: `password123`

---

## 📋 Testing Each Page

### ExamsPage - Test Exam Cards with Like/Dislike & Comments

**URL**: http://localhost:5173/exams

**Steps**:
1. ✅ Click any subject → See exam cards in list
2. ✅ Each exam card shows:
   - `👍 X` (like count)
   - `👎 Y` (dislike count)
   - `💬 Bình luận` (view comments button)
3. ✅ Click `👍` button → Count increases, button turns green
4. ✅ Click `👍` again → Count decreases, button returns to normal
5. ✅ Click `👎` button → Dislike count increases, button turns red
6. ✅ Click `💬 Bình luận` → Modal opens with comments
7. ✅ Type comment and click "📤 Gửi" → Comment appears instantly
8. ✅ Click ✕ on your comment → Comment deleted

**Expected**: All counts update in real-time, modal opens/closes smoothly

---

### CategoriesPage - Test Document Cards with Like/Dislike & Comments

**URL**: http://localhost:5173/categories

**Steps**:
1. ✅ Click any subject → See document cards in list
2. ✅ Same as ExamsPage (like/dislike/comments buttons on each card)
3. ✅ Test voting: Like → Change to dislike → Remove vote
4. ✅ Test comments: Post → Delete your own comment

**Expected**: Same behavior as ExamsPage

---

### EssaysPage - Test Essay Cards with Like/Dislike & Comments

**URL**: http://localhost:5173/essays

**Steps**:
1. ✅ Click any subject → See essay question cards in list
2. ✅ Same as ExamsPage (like/dislike/comments buttons on each card)
3. ✅ Test voting and comments

**Expected**: Same behavior as ExamsPage

---

### FlashcardPage - Test Deck Cards with Like/Dislike & Comments

**URL**: http://localhost:5173/flashcard

**Steps**:
1. ✅ See 3 tabs: "Bộ thẻ chính thức" (official), "Cộng đồng" (community), "Của tôi" (mine)
2. ✅ Each deck card shows:
   - `👍 X` (like count)
   - `👎 Y` (dislike count)
   - `💬 Bình luận` (view comments button)
3. ✅ Same testing as exam/document/essay cards
4. ✅ Click "▶ Học ngay" to enter study mode
5. ✅ Complete flashcard deck → See comments/likes section at end

**Expected**: Same behavior + in study completion, see full CommentsSection

---

## 🔍 Detailed Test Cases

### Test 1: View Stats Without Login
1. Open incognito window (no login)
2. Go to /exams
3. ✅ See like/dislike counts on cards
4. ✅ Click 👍 → See "Vui lòng đăng nhập" (login prompt)
5. ✅ Click 💬 → Modal opens
6. ✅ Try to post comment → See "Đăng nhập để bình luận" (login hint)

**Expected**: Stats visible but voting/commenting blocked without login

---

### Test 2: Vote - Like → Change to Dislike → Remove
1. Login as testcomment@test.com
2. Go to /exams, find exam with 0 likes
3. ✅ Initial: `👍 0` `👎 0`
4. ✅ Click 👍 → `👍 1` (green) `👎 0`
5. ✅ Click 👎 → `👍 0` `👎 1` (red) - changed vote
6. ✅ Click 👎 again → `👍 0` `👎 0` - removed vote
7. ✅ Refresh page → Still shows `👍 0` `👎 0` - persisted

**Expected**: Vote mechanism works correctly, persists on refresh

---

### Test 3: Post & Delete Comment
1. Go to any page (exam/doc/essay/deck)
2. Click 💬 on a card → CommentsModal opens
3. ✅ See existing comments (if any)
4. ✅ Type comment: "Test comment 123"
5. ✅ Click "📤 Gửi" → Comment appears instantly
6. ✅ See your name and today's date
7. ✅ Click ✕ on your comment → Confirmation dialog
8. ✅ Confirm delete → Comment removed
9. ✅ Refresh page → Comment still gone

**Expected**: Comment lifecycle (create → display → delete) works

---

### Test 4: Multiple Users Voting
1. Login as User A (testcomment@test.com)
2. Like an exam → `👍 1`
3. Open new incognito window, login as User B (different account)
4. Go to same exam → See `👍 1` still there
5. User B: Click 👍 → `👍 2` (both liked)
6. User B: Click 👎 → Change vote to `👍 1` `👎 1`
7. User A: Refresh → See `👍 1` `👎 1` (reflects both votes)

**Expected**: Each user has independent vote, counts are accurate

---

### Test 5: Multiple Users Commenting
1. User A: Go to exam, click 💬
2. Post comment: "Great material!"
3. User B (different browser): Go to same exam, click 💬
4. See User A's comment from step 2
5. Post comment: "I agree!"
6. User A: Refresh → See User B's comment
7. Both: See 2 comments, newest first

**Expected**: Comments visible to all users, real-time sync

---

### Test 6: Responsive Design (Mobile)
1. Open http://localhost:5173/exams
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test viewport sizes:
   - ✅ iPhone SE (375px): Buttons stack or shrink
   - ✅ iPad (768px): Horizontal layout
   - ✅ Desktop (1920px): Full layout
5. Click buttons, open modals → All work on mobile
6. Comments modal responsive on small screen

**Expected**: All functionality works on all screen sizes

---

## 🐛 Troubleshooting

### Issue: "👍" button doesn't change color when clicked
- Check: Are you logged in? (Check localStorage: `lh_token`)
- Check: Network tab - is `POST /api/likes` returning 200?
- Check: Browser console - any errors?

### Issue: Comments don't appear after posting
- Check: Click "📤 Gửi" button - is text showing "⏳ Đang gửi..."?
- Check: Network tab - is `POST /api/comments` returning 201?
- Check: Did you type something? Empty comments are ignored
- Refresh page - does comment appear?

### Issue: Modal doesn't open when clicking 💬
- Check: Are you on the right page? (/exams, /categories, /essays, /flashcard)
- Check: Browser console - any JavaScript errors?
- Check: Try another card - does modal open for others?

### Issue: Voting doesn't persist (refresh resets counts)
- Check: Did you click the button? Check for visual feedback
- Check: Network tab - see `POST /api/likes` request?
- Check: Backend API running? (http://localhost:8000/api/likes/stats/Exam/1)
- Check: Database: `php artisan tinker` → `DB::table('likes')->get()`

### Issue: Can't login
- Check: Email: `testcomment@test.com`
- Check: Password: `password123`
- Check: Backend running? (php artisan serve)
- Check: .env has DATABASE configured
- Reset: Run `php artisan migrate:fresh --seed`

---

## ✅ Pass/Fail Criteria

### ✅ PASS (All of these must be true)
- [ ] ExamsPage: Like/dislike buttons visible on exam cards
- [ ] ExamsPage: 💬 button opens CommentsModal
- [ ] CategoriesPage: Same as ExamsPage
- [ ] EssaysPage: Same as ExamsPage
- [ ] FlashcardPage: Deck cards have like/dislike/comments
- [ ] Voting: Can like/dislike as logged-in user
- [ ] Voting: Counts update instantly
- [ ] Voting: Voting persists after refresh
- [ ] Comments: Can view list of comments
- [ ] Comments: Can post as logged-in user
- [ ] Comments: Can delete own comments
- [ ] Comments: Comments persist after refresh
- [ ] Mobile: All features work on mobile viewport
- [ ] Build: No errors in console

### ❌ FAIL (Stop testing if any of these happen)
- [ ] Build errors on `npm run build`
- [ ] JavaScript errors in console (red 🔴)
- [ ] API returns 500 errors
- [ ] Like button throws unhandled exception
- [ ] Comments modal crashes page
- [ ] Can't login to test account

---

## 📊 Quick Stats Test

### Verify Each Type Has Correct Likeables

#### ExamsPage → Exam
```
likeableType="Exam"
POST /api/likes: { likeable_type: "Exam", likeable_id: 1 }
GET /api/likes/stats/Exam/1
```

#### CategoriesPage → Document
```
likeableType="Document"
POST /api/likes: { likeable_type: "Document", likeable_id: 1 }
GET /api/likes/stats/Document/1
```

#### EssaysPage → EssayQuestion
```
likeableType="EssayQuestion"
POST /api/likes: { likeable_type: "EssayQuestion", likeable_id: 1 }
GET /api/likes/stats/EssayQuestion/1
```

#### FlashcardPage → FlashcardDeck
```
likeableType="FlashcardDeck"
POST /api/likes: { likeable_type: "FlashcardDeck", likeable_id: 1 }
GET /api/likes/stats/FlashcardDeck/1
```

---

## 🎬 Demo Video Script (Optional)

### 30-Second Demo
1. (0-5s) Show /exams page → Point to exam card with like/dislike/comments buttons
2. (5-10s) Click 👍 → Count increases, button highlights green
3. (10-15s) Click 💬 → CommentsModal opens
4. (15-20s) Type comment → Post → See it appear with name/timestamp
5. (20-25s) Click ✕ → Delete comment → Confirm
6. (25-30s) Recap: "Like/dislike + comments integrated in all 4 list pages!"

---

## 📝 Test Log Template

Save this for documentation:

```
Test Date: 2026-09-29
Tester: [Your Name]
Environment: Local (localhost)

Pages Tested:
- [ ] ExamsPage ✅
- [ ] CategoriesPage ✅
- [ ] EssaysPage ✅
- [ ] FlashcardPage ✅

Features:
- [ ] View likes/dislikes on cards
- [ ] Vote (like/dislike)
- [ ] Toggle vote off
- [ ] Switch vote (like→dislike)
- [ ] View comments modal
- [ ] Post comment
- [ ] Delete own comment
- [ ] Mobile responsive

Issues Found:
[None]

Overall Status: ✅ PASS
```

---

## 🚀 Ready for Production?

If all tests pass ✅, the feature is production-ready!

**Checklist**:
- [x] Build succeeds
- [x] All 4 pages work
- [x] API integration verified
- [x] Mobile responsive
- [x] User voting works
- [x] Comments work
- [x] Data persists
- [x] No console errors

**Next**: Deploy to staging → QA testing → Production release

---

Good luck with testing! 🧪 If you find any issues, check the console for errors and browser Network tab for API responses.

