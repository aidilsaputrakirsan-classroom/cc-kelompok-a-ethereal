# Frontend Error Handling - Developer Documentation

## Overview
Dokumentasi lengkap untuk error handling components dan hooks yang digunakan di frontend untuk menangani 503 Service Unavailable responses dan retry mechanism.

## Components

### 1. ServiceStatusBanner Component

**Location:** `frontend/src/components/ServiceStatusBanner.jsx`

**Purpose:** 
Menampilkan banner untuk memberitahu user bahwa service tertentu sedang tidak tersedia.

**Props:**
```javascript
{
  isVisible: boolean,              // Control visibility banner
  message?: string,               // Custom message (default: auto)
  onRetry?: function,            // Callback untuk retry button
  serviceType?: 'auth' | 'task' | 'all'  // Untuk styling dan messaging
}
```

**Usage Example:**
```javascript
import ServiceStatusBanner from "../components/ServiceStatusBanner";

function MyComponent() {
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  
  const handleRetry = () => {
    setServiceUnavailable(false);
    // Retry logic here
  };

  return (
    <>
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Custom message"
        onRetry={handleRetry}
        serviceType="task"
      />
      
      {/* Your component content */}
    </>
  );
}
```

**Banner Types:**
- `auth`: Yellow warning banner (🔐)
- `task`: Orange warning banner (📋)
- `all`: Red alert banner (⚠️)

---

## Hooks

### 1. useApi Hook

**Location:** `frontend/src/hooks/useApi.js`

**Purpose:**
Custom hook untuk handle API calls dengan retry logic untuk 503 errors.

**Functions:**

#### `fetchWithRetry(url, options, maxRetries)`
Melakukan fetch dengan automatic retry untuk 503 responses.

**Parameters:**
- `url` (string): API endpoint
- `options` (object): Fetch options (method, headers, body, dll)
- `maxRetries` (number): Maksimal retry attempts (default: 3)

**Returns:**
```javascript
{
  success: boolean,
  data?: any,                      // Response data jika success
  status?: number,                 // HTTP status code
  error?: string                   // Error message jika failed
}
```

**Example Usage:**
```javascript
import { useApi } from "../hooks/useApi";

function MyComponent({ showToast }) {
  const { fetchWithRetry, loading, error } = useApi(showToast);
  
  const handleFetch = async () => {
    const result = await fetchWithRetry(
      `${API_URL}/tasks`,
      {
        headers: { Authorization: `Bearer ${token}` }
      },
      3  // max retries
    );
    
    if (result.success) {
      console.log("Data:", result.data);
    } else {
      console.log("Error:", result.error);
    }
  };

  return <button onClick={handleFetch}>Fetch Data</button>;
}
```

#### `useAuthServiceStatus()`
Hook untuk tracking auth service status.

**Returns:**
```javascript
{
  isAuthServiceDown: boolean,
  checkAuthService: async (apiUrl) => void
}
```

**Example:**
```javascript
const { isAuthServiceDown, checkAuthService } = useAuthServiceStatus();

// Check auth service
await checkAuthService("http://localhost:8000");
```

---

## Enhanced API Service

**Location:** `frontend/src/services/api.js`

**Purpose:**
Centralized API calls dengan consistent response structure.

**Response Structure:**
```javascript
{
  status: number,          // HTTP status code
  data: any | null,        // Response data
  error: string | null,    // Error message
  serviceUnavailable?: boolean,  // Flag untuk 503
  networkError?: boolean   // Flag untuk network error
}
```

**Available Methods:**
- `login({ email, password })`
- `getTasks(token)`
- `createTask(taskData, token)`
- `updateTask(taskId, taskData, token)`
- `deleteTask(taskId, token)`

**Example Usage:**
```javascript
import { api } from "../services/api";

// Login
const result = await api.login({
  email: "user@example.com",
  password: "password123"
});

if (result.serviceUnavailable) {
  // Handle 503
  showToast("Service unavailable");
} else if (result.error) {
  // Handle other errors
  showToast(result.error);
} else {
  // Success
  const token = result.data.access_token;
}
```

---

## Error Handling Pattern

Recommended pattern untuk handle errors di components:

```javascript
import { useState } from "react";
import ServiceStatusBanner from "../components/ServiceStatusBanner";

function MyComponent({ token, showToast }) {
  const [loading, setLoading] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const handleAction = async () => {
    setLoading(true);
    setServiceUnavailable(false);

    try {
      const res = await fetch(`${API_URL}/endpoint`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      // Check for 503
      if (res.status === 503) {
        setServiceUnavailable(true);
        showToast("Service temporarily unavailable", "error");
        setLoading(false);
        return;
      }

      if (res.status >= 500) {
        throw new Error("Service error");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Request failed");
      }

      // Success handling
      showToast("Success!", "success");
    } catch (err) {
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service error")
      ) {
        setServiceUnavailable(true);
        showToast("Service temporarily unavailable", "error");
      } else {
        showToast(err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryAttempt(prev => prev + 1);
    // Retry akan trigger via useEffect dengan retryAttempt dependency
  };

  return (
    <>
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        onRetry={handleRetry}
        serviceType="task"
      />

      <button 
        onClick={handleAction} 
        disabled={loading}
      >
        {loading ? "Loading..." : "Do Action"}
      </button>
    </>
  );
}
```

---

## Integration with Pages/Components

### LoginPage.jsx
- Uses: `ServiceStatusBanner`, direct fetch calls
- Handles: 503 untuk auth login/register
- Retry: Manual via banner button

### CreateTask.jsx
- Uses: `ServiceStatusBanner`, direct fetch calls
- Handles: 503 untuk POST /tasks
- Retry: Manual via banner button

### EditTask.jsx
- Uses: `ServiceStatusBanner`, direct fetch calls
- Handles: 503 untuk GET dan PUT /tasks/{id}
- Retry: Via state tracking dengan useEffect

### TaskList.jsx
- Uses: `ServiceStatusBanner`, direct fetch calls
- Handles: 503 untuk GET /tasks dan DELETE /tasks/{id}
- Retry: Via state tracking dengan useEffect

### App.jsx
- Uses: `ServiceStatusBanner` global
- Handles: Global auth service health check setiap 30 detik
- Displays: Warning banner jika auth service down

---

## Best Practices

### 1. Always Check Status Code
```javascript
// ❌ Don't do this
if (res.ok) { ... }

// ✅ Do this
if (res.status === 503) {
  // Handle 503
} else if (res.status >= 500) {
  // Handle server errors
} else if (res.ok) {
  // Handle success
}
```

### 2. Disable Form Inputs During Loading
```javascript
<input 
  disabled={loading}
  className="..."
/>

<button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</button>
```

### 3. Show Appropriate Toast Messages
```javascript
// For 503
showToast("Service temporarily unavailable", "error");

// For network errors
showToast("Network error - please check your connection", "error");

// For validation errors
showToast("Please fill all required fields", "error");
```

### 4. Clean Up Banners on Success
```javascript
setServiceUnavailable(false);  // Hide banner on success
setError(null);                // Clear error state
```

---

## Testing Components

### Unit Testing Example (Jest + React Testing Library)

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import ServiceStatusBanner from "./ServiceStatusBanner";

describe("ServiceStatusBanner", () => {
  it("renders when isVisible is true", () => {
    render(<ServiceStatusBanner isVisible={true} serviceType="task" />);
    expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", () => {
    const mockRetry = jest.fn();
    render(
      <ServiceStatusBanner 
        isVisible={true} 
        onRetry={mockRetry}
        serviceType="task"
      />
    );
    
    fireEvent.click(screen.getByText("Retry"));
    expect(mockRetry).toHaveBeenCalled();
  });

  it("hides banner when close button clicked", () => {
    const { rerender } = render(
      <ServiceStatusBanner isVisible={true} serviceType="task" />
    );
    
    fireEvent.click(screen.getByText("✕"));
    
    rerender(
      <ServiceStatusBanner isVisible={false} serviceType="task" />
    );
    
    expect(screen.queryByText(/temporarily unavailable/i)).not.toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Banner Not Showing?
- Check `isVisible` prop is `true`
- Check z-index (banner uses `z-40`)
- Check CSS/Tailwind is properly configured

### Retry Not Working?
- Ensure `onRetry` callback is defined
- Check if `retryAttempt` state is triggering useEffect
- Verify retry logic inside useEffect

### 503 Errors Still Showing Error Toast?
- Check if you're handling 503 BEFORE checking `res.ok`
- Use `res.status === 503` instead of `res.status >= 500`

---

## Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:8000
```

---

## Performance Tips

1. Minimize re-renders: Use `useCallback` untuk handler functions
2. Debounce health checks: Use `setInterval` jangan terlalu frequent
3. Clean up timers: Clear intervals di `useEffect` cleanup
4. Lazy load banners: Only render when needed

