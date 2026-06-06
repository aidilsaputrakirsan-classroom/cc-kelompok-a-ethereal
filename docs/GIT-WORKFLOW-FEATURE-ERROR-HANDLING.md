# Git Workflow - Feature Error Handling UI

## 📌 Branch Information
- **Branch Name**: `feature/error-handling-ui`
- **Lead**: Frontend Lead
- **Status**: Ready for Git commands

---

## 🔄 Git Commands - Copy & Paste

### Step 1: Create & Checkout Branch
```bash
git checkout -b feature/error-handling-ui
```

### Step 2: Stage All Changes
```bash
git add .
```

### Step 3: Check Status
```bash
git status
```

### Step 4: View Changes (optional)
```bash
git diff --cached
```

### Step 5: Commit Changes
```bash
git commit -m "feat(frontend): implement error handling UI for 503 service unavailable

- Add ServiceStatusBanner component dengan color-coded styling (auth/task/all)
- Update LoginPage dengan 503 error handling dan retry button
- Update CreateTask dengan service unavailable banner
- Update EditTask dengan retry mechanism
- Update TaskList dengan service status tracking
- Add global health check di App.jsx setiap 30 detik
- Enhanced api.js dengan consistent response structure { status, data, error }
- Created useApi hook untuk retry logic (exponential backoff)
- Add comprehensive testing guide dan developer documentation

Fixes #feature-error-handling-ui
Closes #task-frontend-resilience"
```

### Step 6: View Commit
```bash
git show --stat
```

### Step 7: Push Branch to Remote (when ready)
```bash
git push origin feature/error-handling-ui
```

### Step 8: Create Pull Request on GitHub
```bash
# Open: https://github.com/your-repo/pulls
# Create PR from feature/error-handling-ui → main
# Title: feat(frontend): implement error handling UI for 503 service unavailable
# Description: See commit message
```

---

## 📋 Commit Message Template

Jika ingin customize commit message, gunakan template:

```
feat(frontend): implement error handling UI for 503 service unavailable

[DESCRIPTION]
Implementasi error handling UI untuk menangani 503 Service Unavailable responses
dengan retry mechanism dan service status banner di semua pages.

[CHANGES]
- ServiceStatusBanner component untuk visual feedback
- Enhanced api.js dengan response structure { status, data, error }
- useApi hook dengan exponential backoff retry logic
- Global health check di App.jsx (30 detik interval)
- Updated LoginPage, CreateTask, EditTask, TaskList dengan error handling
- Comprehensive testing & developer documentation

[TEST COVERAGE]
- LoginPage: Register & Login dengan 503
- CreateTask: POST /tasks dengan 503
- EditTask: GET & PUT /tasks/{id} dengan 503
- TaskList: GET tasks, DELETE, COMPLETE dengan 503
- App.jsx: Global health check untuk auth service

[DOCUMENTATION]
- docs/FRONTEND-ERROR-HANDLING-SUMMARY.md
- docs/frontend-error-handling-testing.md
- docs/frontend-error-handling-developer-guide.md
- /memories/repo/frontend-error-handling-implementation.md

Fixes: feature/error-handling-ui
```

---

## 📊 Files Changed Summary

### Created (3 files)
- `frontend/src/hooks/useApi.js`
- `frontend/src/components/ServiceStatusBanner.jsx`
- `docs/frontend-error-handling-testing.md`
- `docs/frontend-error-handling-developer-guide.md`
- `docs/FRONTEND-ERROR-HANDLING-SUMMARY.md`

### Modified (6 files)
- `frontend/src/services/api.js` ➕ 4 new methods, enhanced error handling
- `frontend/src/pages/LoginPage.jsx` ➕ ServiceStatusBanner, retry logic
- `frontend/src/pages/CreateTask.jsx` ➕ ServiceStatusBanner, disabled states
- `frontend/src/pages/EditTask.jsx` ➕ ServiceStatusBanner, retry mechanism
- `frontend/src/components/TaskList.jsx` ➕ ServiceStatusBanner, error handling
- `frontend/src/App.jsx` ➕ Global health check

**Total Files Changed**: 11
**Lines Added**: ~1,500+
**Lines Deleted**: ~200

---

## ✅ Pre-Commit Checklist

Sebelum commit, pastikan:

- [ ] Code sudah tested di local environment
- [ ] No console.error atau console.warn yang tidak perlu
- [ ] No hardcoded values (gunakan environment variables)
- [ ] Component props documented dengan JSDoc comments
- [ ] Error handling pattern consistent di semua components
- [ ] ServiceStatusBanner styling responsive di mobile/tablet/desktop
- [ ] No unused imports atau dead code
- [ ] Git status clean (no untracked files yang tidak diperlukan)

### Commands untuk Validation:

```bash
# Check for console.log di production code
grep -r "console\." frontend/src --include="*.jsx" --include="*.js" | grep -v "node_modules"

# Check for unused variables (need eslint configured)
npm run lint

# Check build status
npm run build
```

---

## 🚀 After Commit

### Next Steps:
1. **Push to Remote**
   ```bash
   git push origin feature/error-handling-ui
   ```

2. **Create Pull Request on GitHub**
   - Title: `feat(frontend): implement error handling UI for 503 service unavailable`
   - Description: Copy dari commit message
   - Assign reviewer: Team Lead Backend / Tech Lead

3. **Review & Feedback**
   - Address reviewer comments
   - Update branch jika diperlukan
   ```bash
   git add .
   git commit --amend  # jika perubahan kecil
   git push --force-with-lease  # push ulang
   ```

4. **Merge ke Main**
   ```bash
   # Option 1: Merge dari GitHub UI (recommended)
   # Click "Merge Pull Request" button

   # Option 2: Merge dari CLI
   git checkout main
   git pull origin main
   git merge feature/error-handling-ui
   git push origin main
   ```

---

## 📌 Important Notes

### ⚠️ RULE dari AGENTS.md
**JANGAN COMMIT DAN PUSH TANPA PERSETUJUAN USER!**

Sesuai dengan rule di AGENTS.md:
1. ✅ I already prepared the code
2. ✅ I created testing & documentation
3. ❌ I will NOT commit or push without your approval
4. ⏳ Wait for user approval before running git commands

---

## 🔍 How to Review Changes

### Option 1: Review di VS Code
```bash
git diff HEAD~0  # Show all changes
git diff HEAD~1 frontend/src/components/ServiceStatusBanner.jsx  # Specific file
```

### Option 2: Review di GitHub
Setelah push, GitHub akan show:
- Files changed
- Diff view (green untuk added, red untuk removed)
- Comment interface untuk discussion

### Option 3: Review via Terminal
```bash
git log --oneline -5          # Recent commits
git show HEAD --stat          # Current commit summary
git diff --staged             # Staged changes
```

---

## 🆘 Troubleshooting

### Issue: "fatal: not a git repository"
```bash
# Verify you're in project root
cd c:\Users\marth\cc-kelompok-a-ethereal
git status
```

### Issue: "branch already exists"
```bash
# If branch exists locally
git checkout feature/error-handling-ui  # switch to existing branch

# Or delete and recreate
git branch -D feature/error-handling-ui
git checkout -b feature/error-handling-ui
```

### Issue: "Changes not staged for commit"
```bash
# Stage changes
git add .

# Or stage specific file
git add frontend/src/components/ServiceStatusBanner.jsx
```

### Issue: "Permission denied" saat push
```bash
# Update git credentials atau use SSH key
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Or use SSH key (recommended untuk production)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
```

---

## 📞 Next Actions

1. **Review this guide** - Pastikan semua sesuai
2. **Test implementation** - Run di browser
3. **Approve for commit** - User approval needed
4. **Run git commands** - Based on approval
5. **Create PR** - For team review

---

**Ready for**: ⏳ User Approval
**Branch**: `feature/error-handling-ui`
**Status**: Implementation Complete ✅

---

## Quick Command Reference

```bash
# Full workflow in one copy-paste (after approval):
git checkout -b feature/error-handling-ui
git add .
git commit -m "feat(frontend): implement error handling UI for 503 service unavailable

- Add ServiceStatusBanner component
- Update LoginPage, CreateTask, EditTask, TaskList dengan error handling
- Global health check di App.jsx
- Enhanced api.js dengan consistent response structure
- Comprehensive testing & developer documentation"
git push origin feature/error-handling-ui
# Then create PR on GitHub
```

