# Frontend Error Handling - Testing Guide

## Overview
Testing guide untuk error handling dan retry mechanism di frontend untuk 503 Service Unavailable responses.

## Test Scenarios

### 1. LOGIN PAGE - 503 Response

**Setup:**
- Mock API endpoint `/auth/login` untuk return 503

**Test Case 1.1: Login dengan 503 Response**
- Steps:
  1. Open login page
  2. Enter email dan password
  3. Click "Log In"
  4. API returns 503
- Expected:
  - Toast message: "Service temporarily unavailable. Please try again later."
  - ServiceStatusBanner appears dengan message "Authentication service is temporarily unavailable"
  - Retry button tersedia di banner
  - Form inputs tetap disabled saat loading

**Test Case 1.2: Register dengan 503 Response**
- Steps:
  1. Open login page
  2. Click "Belum punya akun? Register"
  3. Fill nama, email, password
  4. Click "Sign Up"
  5. API returns 503
- Expected:
  - Toast message: "Service temporarily unavailable. Please try again later."
  - ServiceStatusBanner appears
  - Retry button tersedia

---

### 2. CREATE TASK PAGE - 503 Response

**Setup:**
- Mock API endpoint `/tasks` (POST) untuk return 503

**Test Case 2.1: Create task dengan 503 Response**
- Steps:
  1. Go to HomePage
  2. Click "+ Tambah Tugas"
  3. Fill form (title, description, deadline, attachment_url)
  4. Click "Simpan"
  5. API returns 503
- Expected:
  - Toast message: "Service temporarily unavailable. Please try again later."
  - ServiceStatusBanner appears dengan message "Task service is temporarily unavailable"
  - Form inputs tetap disabled
  - "Simpan" dan "Batal" buttons disabled
  - User dapat dismiss banner dengan close button (✕)

---

### 3. EDIT TASK PAGE - 503 Response

**Setup:**
- Mock API endpoints:
  - `/tasks/{id}` (GET) untuk return 503
  - `/tasks/{id}` (PUT) untuk return 503

**Test Case 3.1: Fetch Task Detail dengan 503 Response**
- Steps:
  1. Navigate to `/edit/1` (task id = 1)
  2. Page attempts to fetch task detail
  3. API returns 503
- Expected:
  - Loading message ditampilkan saat fetching
  - Error handling: redirect to home page dengan toast error
  - User tidak bisa edit task

**Test Case 3.2: Update Task dengan 503 Response**
- Steps:
  1. Open task detail yang sudah ter-load
  2. Edit beberapa fields
  3. Click "Simpan"
  4. API returns 503
- Expected:
  - ServiceStatusBanner appears
  - Toast message: "Service temporarily unavailable"
  - Form tetap ada, tidak redirect
  - User dapat click retry button untuk coba lagi

---

### 4. HOME PAGE - Task List 503 Response

**Setup:**
- Mock API endpoints:
  - `/tasks` (GET) untuk return 503
  - `/tasks/{id}` (DELETE) untuk return 503

**Test Case 4.1: Fetch Tasks dengan 503 Response**
- Steps:
  1. Navigate to HomePage
  2. TaskList component attempts to fetch tasks
  3. API returns 503
- Expected:
  - Toast message: "Service temporarily unavailable"
  - ServiceStatusBanner appears
  - Task list empty/not loaded
  - Retry button tersedia

**Test Case 4.2: Delete Task dengan 503 Response**
- Steps:
  1. HomePage dengan tasks sudah loaded
  2. Click delete button pada salah satu task
  3. API returns 503
- Expected:
  - ServiceStatusBanner appears
  - Toast error message
  - Task tidak dihapus dari list
  - Retry button tersedia

**Test Case 4.3: Complete Task dengan 503 Response**
- Steps:
  1. HomePage dengan tasks sudah loaded
  2. Click checkmark/complete button pada task
  3. API returns 503
- Expected:
  - ServiceStatusBanner appears
  - Toast error message
  - Task status tidak berubah
  - Retry button tersedia

---

### 5. APP LEVEL - Global Auth Service Health Check

**Setup:**
- Mock API endpoint `/health` untuk return 503 atau network error

**Test Case 5.1: Global Auth Service Down Banner**
- Steps:
  1. Open HomePage (sudah login)
  2. Wait 30 seconds untuk health check
  3. API returns 503
- Expected:
  - Global ServiceStatusBanner di top of page appears
  - Message: "Authentication service is temporarily unavailable. Some features may be limited."
  - Banner tidak hilang dengan sendiri, user harus close manual
  - Banner tetap visible saat navigasi antar pages

**Test Case 5.2: Service Recovery**
- Steps:
  1. Global banner visible
  2. Wait untuk next health check (30 seconds)
  3. API now returns 200 OK
- Expected:
  - Global banner disappears
  - Normal operation resumes

---

### 6. Retry Mechanism Testing

**Test Case 6.1: Click Retry Button**
- Steps:
  1. Trigger 503 error di any page
  2. ServiceStatusBanner appears dengan Retry button
  3. Click Retry button
  4. API now returns success (200)
- Expected:
  - Component retry fetch/request
  - Data loaded successfully
  - Banner disappears
  - Toast success message

---

### 7. Banner UI/UX Testing

**Test Case 7.1: Banner Colors dan Styling**
- Check:
  - Auth service banner: yellow/warning colors (bg-yellow-50, border-yellow-200)
  - Task service banner: orange colors (bg-orange-50, border-orange-200)
  - All services banner: red colors (bg-red-50, border-red-200)

**Test Case 7.2: Banner Responsive Design**
- Check on:
  - Desktop (1920px+)
  - Tablet (768px)
  - Mobile (360px)
- Expected:
  - Banner tetap visible dan readable
  - Buttons tetap clickable
  - Text tidak overflow

**Test Case 7.3: Banner Dismiss**
- Steps:
  1. Banner visible
  2. Click close button (✕)
- Expected:
  - Banner disappears
  - Service error masih ditampilkan via toast
  - Retry button hilang

---

## Test Data / Mock Setup

### Mock 503 Response
```javascript
// Using fetch mock atau Mock Service Worker (MSW)
fetch.mock = () => ({
  status: 503,
  json: async () => ({ 
    detail: "Service temporarily unavailable" 
  })
});
```

### Recommended Testing Tools
- **Jest + React Testing Library** - untuk unit tests
- **Mock Service Worker (MSW)** - untuk API mocking
- **Cypress atau Playwright** - untuk E2E tests
- **Postman** - untuk manual API testing

---

## Performance Considerations

- [ ] Health check timeout: 5 seconds
- [ ] Health check interval: 30 seconds (setelah login)
- [ ] Exponential backoff untuk retry: 1s, 2s, 4s
- [ ] Max retry attempts: 3

---

## Accessibility Testing

- [ ] Color contrast untuk banner (WCAG AA)
- [ ] ARIA labels untuk buttons
- [ ] Keyboard navigation (Tab through buttons)
- [ ] Screen reader announcement untuk banner appearance

---

## Browser Compatibility

Test on:
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

