# Scenario-Based React Interview Questions & Answers

A curated guide of 50 practical, scenario-driven React interview questions with real-world problem statements, actionable solutions, and code examples.

---

## Table of Contents

- [Core Concepts & JSX](#1-core-concepts--jsx-q1-q8) (Q1–Q8)
- [React Hooks in Practice](#2-react-hooks-in-practice-q9-q18) (Q9–Q18)
- [State Management & Data Flow](#3-state-management--data-flow-q19-q26) (Q19–Q26)
- [Performance Optimization](#4-performance-optimization-q27-q34) (Q27–Q34)
- [Architecture & Design Patterns](#5-architecture--design-patterns-q35-q42) (Q35–Q42)
- [Concurrent React, Server Components & Modern APIs](#6-concurrent-react-server-components--modern-apis-q43-q50) (Q43–Q50)

---

## 1. Core Concepts & JSX (Q1–Q8)

### Q1: Conditional UI Rendering Without Layout Shift
**Scenario:** A component displays a live stock price ticker. When loading, the ticker disappears and shifts adjacent elements, causing an annoying layout shift (CLS).  
**Question:** How do you structure your JSX and conditional rendering to maintain layout stability while waiting for data?  
**Solution:** Render a fixed-dimension skeleton or placeholder instead of short-circuiting with `null` or `{isLoading && <Component />}`.

```jsx
export function StockTicker({ price, isLoading }) {
  return (
    <div className="ticker-wrapper" style={{ minHeight: "48px", display: "flex", alignItems: "center" }}>
      {isLoading ? (
        <div className="ticker-skeleton animate-pulse" style={{ width: "120px", height: "24px", background: "#e2e8f0" }} />
      ) : (
        <span className="ticker-value">${price.toFixed(2)}</span>
      )}
    </div>
  );
}
```

---

### Q2: Dynamic Component Rendering Based on API Response
**Scenario:** A CMS returns an array of dynamic section blocks (e.g., `hero`, `carousel`, `faq`). How do you dynamically render corresponding components safely?  
**Question:** How do you map dynamic block types to React components without massive `switch/case` statements?  
**Solution:** Use a component lookup map (dictionary pattern).

```jsx
import HeroBlock from './HeroBlock';
import CarouselBlock from './CarouselBlock';
import FaqBlock from './FaqBlock';

const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  carousel: CarouselBlock,
  faq: FaqBlock,
};

export function DynamicPageRenderer({ blocks }) {
  return (
    <main>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }
        return <Component key={block.id} {...block.data} />;
      })}
    </main>
  );
}
```

---

### Q3: Array Reordering Bugs with Index as Key
**Scenario:** A user deletes the first item in a list of inputs. Suddenly, the input contents shift incorrectly and values stay in the wrong fields.  
**Question:** Why does using `index` as a `key` break stateful list items, and how do you resolve it?  
**Solution:** React uses keys to match virtual DOM tree elements across renders. Using index causes React to preserve the internal state of existing DOM nodes while only removing the last DOM node. Always use unique, persistent identifiers.

```jsx
//    WRONG: items.map((item, index) => <InputItem key={index} item={item} />)

//   CORRECT:
export function TodoList({ items, onDelete }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <input defaultValue={item.text} />
          <button onClick={() => onDelete(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

---

### Q4: Preventing Unnecessary DOM Re-Mounting on Wrapper Change
**Scenario:** You want to wrap a child in a link (`<a>`) only if a `url` prop exists; otherwise render it in a plain `<div>`. When toggling, the internal component loses focus and state.  
**Question:** Why is state lost, and how do you conditionally wrap elements cleanly?  
**Solution:** Changing the parent DOM tag unmounts and remounts the whole sub-tree. Conditionally wrap using a custom wrapper utility or render prop without remounting children unnecessarily.

```jsx
function ConditionalWrapper({ condition, wrapper, children }) {
  return condition ? wrapper(children) : children;
}

export function Card({ title, url }) {
  return (
    <ConditionalWrapper
      condition={Boolean(url)}
      wrapper={(children) => <a href={url} className="card-link">{children}</a>}
    >
      <div className="card-content">
        <h3>{title}</h3>
      </div>
    </ConditionalWrapper>
  );
}
```

---

### Q5: Handling Event Bubbling in Nested Interactive Elements
**Scenario:** Clicking a "Delete" button inside an interactive table row triggers the table row's `onClick` (open details modal) as well as the delete handler.  
**Question:** How do you isolate inner interactive events from container click handlers?  
**Solution:** Call `e.stopPropagation()` inside the child event handler.

```jsx
export function TableRow({ rowData, onSelectRow, onDeleteRow }) {
  return (
    <tr onClick={() => onSelectRow(rowData.id)}>
      <td>{rowData.name}</td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRow(rowData.id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
```

---

### Q6: Capturing Non-React DOM Events Inside React Portals
**Scenario:** You render a modal via `ReactDOM.createPortal`. A click inside the modal triggers a listener on document body that was supposed to close only when clicking "outside".  
**Question:** Does React synthetic event bubbling honor DOM hierarchy or React component hierarchy?  
**Solution:** React's synthetic event bubbling propagates along the **React component tree**, not the real DOM tree. You can intercept clicks at the portal boundary or verify `event.target`.

```jsx
import { createPortal } from "react-dom";

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      {/* Stop propagation so clicks inside modal body do not trigger backdrop's onClose */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

---

### Q7: Preventing Controlled Component Reset Glitches
**Scenario:** An input is connected to controlled state. When the user types quickly or the API sets `undefined`, React throws an error about switching from uncontrolled to controlled.  
**Question:** How do you guarantee an input remains controlled at all times?  
**Solution:** Provide a fallback empty string `value={props.value ?? ""}` to avoid passing `undefined`.

```jsx
export function ControlledSearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type here..."
    />
  );
}
```

---

### Q8: Safe HTML Injection with Sanitization
**Scenario:** You need to render formatted text returned from a rich-text WYSIWYG editor containing HTML tags without exposing users to Cross-Site Scripting (XSS).  
**Question:** How do you safely render raw HTML in React?  
**Solution:** Always sanitize HTML using a verified library like `DOMPurify` before passing it to `dangerouslySetInnerHTML`.

```jsx
import DOMPurify from 'dompurify';

export function SafeHtmlPreview({ rawHtml }) {
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
```

---

## 2. React Hooks in Practice (Q9–Q18)

### Q9: Fixing Stale Closures in `useEffect` Timers
**Scenario:** A timer runs inside `useEffect`, updating a count every second. However, the UI count gets stuck at `1` or increments irregularly.  
**Question:** What causes this stale closure, and how do you fix it without re-triggering the timer effect every second?  
**Solution:** Use the functional state updater `setCount(prev => prev + 1)` so the closure doesn't depend on the current `count` variable.

```jsx
import { useState, useEffect } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      //   Functional updater accesses latest state without needing seconds in deps array
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <div>Elapsed time: {seconds}s</div>;
}
```

---

### Q10: Aborting Rapid Fetch Calls (Debounced Search)
**Scenario:** A user types "react" into an auto-complete box. Five API requests are dispatched. If request 3 finishes *after* request 5, outdated results overwrite the latest results.  
**Question:** How do you prevent race conditions in data-fetching effects?  
**Solution:** Use `AbortController` in the cleanup function of `useEffect`.

```jsx
import { useState, useEffect } from "react";

export function AutoComplete({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Fetch failed:", err);
        }
      });

    return () => {
      // Cancels in-flight request when query changes or component unmounts
      controller.abort();
    };
  }, [query]);

  return (
    <ul>
      {results.map((r) => <li key={r.id}>{r.name}</li>)}
    </ul>
  );
}
```

---

### Q11: Safely Tracking Previous Value
**Scenario:** You need to inspect whether a prop (e.g., `status`) changed from `"idle"` to `"error"` to trigger an analytics ping.  
**Question:** How do you inspect the previous value of a state or prop in React functional components?  
**Solution:** Store previous value using a `useRef` updated during render or in an effect.

```jsx
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
export function OrderStatus({ status }) {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === "processing" && status === "completed") {
      analytics.track("Order Completed Successfully");
    }
  }, [status, prevStatus]);

  return <div>Current Status: {status}</div>;
}
```

---

### Q12: Synchronizing DOM Measurements via `useLayoutEffect`
**Scenario:** A tooltip component computes its position based on the bounding rect of a target element. When rendered with `useEffect`, the tooltip briefly flickers at `(0, 0)` before jumping into position.  
**Question:** How do you eliminate visual flicker for DOM-dependent measurements?  
**Solution:** Use `useLayoutEffect` to run synchronous DOM measurements and updates *before* the browser paints.

```jsx
import { useState, useRef, useLayoutEffect } from "react";

export function Tooltip({ targetRef, text }) {
  const tooltipRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    setCoords({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    });
  }, [targetRef]);

  return (
    <div
      ref={tooltipRef}
      style={{ position: "fixed", top: coords.top, left: coords.left }}
      className="tooltip-box"
    >
      {text}
    </div>
  );
}
```

---

### Q13: Exposing Custom Imperative Methods with `useImperativeHandle`
**Scenario:** A parent form wizard needs to trigger `.validate()` and `.reset()` on a complex child credit-card input without managing internal sub-states directly.  
**Question:** How do you expose specific methods from a child component to a parent ref?  
**Solution:** Combine `forwardRef` with `useImperativeHandle`.

```jsx
import { forwardRef, useImperativeHandle, useState } from "react";

export const CreditCardInput = forwardRef(function CreditCardInput(props, ref) {
  const [number, setNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  useImperativeHandle(ref, () => ({
    validate() {
      const valid = number.replace(/\s/g, "").length === 16;
      setIsValid(valid);
      return valid;
    },
    reset() {
      setNumber("");
      setIsValid(true);
    },
  }));

  return (
    <div>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Card Number"
      />
      {!isValid && <span style={{ color: "red" }}>Must be 16 digits</span>}
    </div>
  );
});
```

---

### Q14: Managing Complex Multi-Field Form State with `useReducer`
**Scenario:** A registration form has 6 fields, dependencies between password & confirm password, and an asynchronous validation state. Managing 8 different `useState` hooks creates messy code.  
**Question:** When and how should you replace multiple `useState` hooks with `useReducer`?  
**Solution:** Group state transitions into a reducer function to centralize business logic and update state atomically.

```jsx
import { useReducer } from "react";

const initialState = { username: "", password: "", confirm: "", error: null };

function formReducer(state, action) {
  switch (action.type) {
    case "FIELD_CHANGE":
      return { ...state, [action.field]: action.value, error: null };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.password !== state.confirm) {
      dispatch({ type: "SET_ERROR", error: "Passwords do not match!" });
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.username}
        onChange={(e) => dispatch({ type: "FIELD_CHANGE", field: "username", value: e.target.value })}
      />
      <input
        type="password"
        value={state.password}
        onChange={(e) => dispatch({ type: "FIELD_CHANGE", field: "password", value: e.target.value })}
      />
      <input
        type="password"
        value={state.confirm}
        onChange={(e) => dispatch({ type: "FIELD_CHANGE", field: "confirm", value: e.target.value })}
      />
      {state.error && <p>{state.error}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
```

---

### Q15: Generating Accessible IDs Using `useId`
**Scenario:** You have a reusable input component used multiple times on a single page. If you hardcode `id="input"` and `htmlFor="input"`, labels bind to the wrong elements.  
**Question:** How does React generate unique, SSR-friendly IDs across components?  
**Solution:** Use the `useId()` hook to guarantee unique IDs on both client and server.

```jsx
import { useId } from "react";

export function FormField({ label, type = "text" }) {
  const id = useId();

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}
```

---

### Q16: Syncing with External Non-React Stores via `useSyncExternalStore`
**Scenario:** You need to subscribe a component to an external browser API (like `window.navigator.onLine` or a custom micro-frontend event bus) without teardown glitches or tearing during concurrent renders.  
**Question:** What is the recommended way to subscribe to external stores in modern React?  
**Solution:** Use `useSyncExternalStore`.

```jsx
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export function ConnectionStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div className={`badge ${isOnline ? "bg-green" : "bg-red"}`}>
      {isOnline ? "Connected" : "Offline"}
    </div>
  );
}
```

---

### Q17: Debouncing Rapid State Updates via Custom Hook
**Scenario:** An input field triggers real-time graph updates. Firing updates on every keystroke causes frame drops.  
**Question:** How do you implement a clean, reusable `useDebounce` hook?  
**Solution:** Return a debounced value that delays propagation until a specified timeout has elapsed.

```jsx
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Q18: Managing Element Click-Outside with Custom Hook
**Scenario:** A dropdown menu needs to close whenever a user clicks outside its container or presses the Escape key.  
**Question:** How do you build a reusable `useClickOutside` hook?  
**Solution:** Attach global event listeners to `document` and verify that the target node is outside the referenced element.

```jsx
import { useEffect, useRef } from "react";

export function useClickOutside(callback) {
  const domNodeRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return domNodeRef;
}
```

---

## 3. State Management & Data Flow (Q19–Q26)

### Q19: Avoiding Context Re-Render Cascades
**Scenario:** A `ThemeAndAuthContext` holds both user profile data and theme mode (`dark` / `light`). Whenever theme toggles, every authenticated component re-renders.  
**Question:** How do you prevent components from re-rendering when unrelated context slices change?  
**Solution:** Split your context into fine-grained contexts: `ThemeContext` and `AuthContext`.

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();
const AuthContext = createContext();

export function AppProviders({ children }) {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({ name: "Alex" });

  return (
    <AuthContext.Provider value={user}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

// Components consume only what they need
export function ProfileBadge() {
  const user = useContext(AuthContext); // Will NOT re-render on theme toggle!
  return <span>{user.name}</span>;
}
```

---

### Q20: Optimistic UI Updates with Immediate Rollback
**Scenario:** In a social media feed, clicking "Like" should update the counter instantly. If the API request fails, it should revert to the previous count and show a notification.  
**Question:** How do you build optimistic UI updates with error recovery?  
**Solution:** Store previous state, update UI optimistically, and catch errors to restore previous state.

```jsx
import { useState } from "react";

export function LikeButton({ initialLikes, postId }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    const previousLikes = likes;

    // 1. Optimistic update
    setLikes((prev) => prev + 1);
    setIsLiking(true);

    try {
      await api.likePost(postId);
    } catch (err) {
      // 2. Rollback on failure
      setLikes(previousLikes);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return <button onClick={handleLike}>❤️ {likes}</button>;
}
```

---

### Q21: Lifting State vs. Colocating State
**Scenario:** A large enterprise application has 40 variables stored in a single global Redux/Zustand store. Even simple modal open/close states are kept global, making features difficult to test.  
**Question:** What is the rule of thumb for lifting state vs. state colocation?  
**Solution:** Keep state as close to where it is used as possible (colocation). Only lift state when multiple sibling components genuinely need to share read/write access.

```
Rule of Thumb:
1. Component-only state (isDropdownOpen, formDraft) -> useState/useReducer inside component.
2. Sibling communication (DateRangePicker -> ResultsTable) -> Lift to common parent.
3. App-wide cross-cutting concerns (Auth, Permissions, Cart) -> Global store/Context.
```

---

### Q22: Derived State Anti-Pattern
**Scenario:** A component stores `items` in state and also creates `filteredItems` in state, updating both in separate effects. The two states frequently get out of sync.  
**Question:** Why is storing calculated data in state an anti-pattern, and what is the fix?  
**Solution:** Compute derived state during render. Use `useMemo` if the computation is expensive.

```jsx
import { useState, useMemo } from "react";

export function FilterList({ items }) {
  const [filterQuery, setFilterQuery] = useState("");

  //   Compute directly during render
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [items, filterQuery]);

  return (
    <div>
      <input value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
      <ul>{filteredItems.map(i => <li key={i.id}>{i.title}</li>)}</ul>
    </div>
  );
}
```

---

### Q23: Preventing State Mutation Bugs
**Scenario:** A developer updates a nested object directly: `state.user.preferences.theme = "dark"; setState(state);`. The UI fails to re-render.  
**Question:** Why did the component fail to re-render, and how do you update nested state correctly?  
**Solution:** React uses shallow reference equality (`Object.is`) to check for changes. Mutating existing objects retains the same reference. Create new object references using the spread operator or libraries like Immer.

```jsx
//    WRONG: state.user.address.city = "New York"; setState(state);

//   CORRECT:
setUserState((prev) => ({
  ...prev,
  user: {
    ...prev.user,
    address: {
      ...prev.user.address,
      city: "New York",
    },
  },
}));
```

---

### Q24: Resetting Component State When a Key Prop Changes
**Scenario:** A `<UserProfile userId={selectedId} />` component loads initial draft data into state. When clicking a different user from the sidebar, the form retains the old user's draft values.  
**Question:** How do you completely reset a component's internal state when an ID changes?  
**Solution:** Pass the changing ID as the `key` prop on the component from the parent. React will unmount and remount it with clean state.

```jsx
export function Dashboard({ currentUserId }) {
  // Changing key tells React to destroy the old instance and instantiate fresh state
  return <UserProfileEditor key={currentUserId} userId={currentUserId} />;
}
```

---

### Q25: Sharing Complex State Between Independent Browser Tabs
**Scenario:** When a user logs out in Tab A, Tab B should immediately log out and redirect to the login screen without a manual reload.  
**Question:** How do you synchronize state changes across multiple browser tabs in React?  
**Solution:** Listen to the `storage` event or use the `BroadcastChannel` API.

```jsx
import { useEffect } from "react";

export function useCrossTabSync(onLogout) {
  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");

    channel.onmessage = (event) => {
      if (event.data.type === "LOGOUT") {
        onLogout();
      }
    };

    return () => channel.close();
  }, [onLogout]);
}
```

---

### Q26: Managing Async Request States (Idle, Loading, Success, Error)
**Scenario:** Managing separate booleans `isLoading`, `isError`, and `isSuccess` results in impossible states (e.g., `isLoading === true` and `isSuccess === true` at the same time).  
**Question:** How do you eliminate impossible states in async UI workflows?  
**Solution:** Model async requests using a finite state status machine pattern (`status: 'idle' | 'pending' | 'success' | 'error'`).

```jsx
import { useState } from "react";

export function DataFetcher() {
  const [state, setState] = useState({
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    data: null,
    error: null,
  });

  const loadData = async () => {
    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetch("/api/items");
      const json = await res.json();
      setState({ status: "success", data: json, error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err.message });
    }
  };

  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") return <ErrorMessage error={state.error} />;
  if (state.status === "success") return <DataList items={state.data} />;

  return <button onClick={loadData}>Fetch Data</button>;
}
```

---

## 4. Performance Optimization (Q27–Q34)

### Q27: Virtualizing Massive Lists (10,000+ Items)
**Scenario:** Rendering a table with 10,000 transaction rows causes the browser DOM to freeze and consume 1GB+ of memory.  
**Question:** How do you efficiently render massive datasets in React?  
**Solution:** Use DOM virtualization (windowing) with libraries like `@tanstack/react-virtual` or `react-window` to render only the visible rows.

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualizedList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto", border: "1px solid #ccc" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Q28: Correct Usage of `React.memo` with Primitive and Non-Primitive Props
**Scenario:** A child component wrapped in `React.memo` still re-renders on every parent render, even though its props appear identical.  
**Question:** Why does `React.memo` fail when passing inline objects, arrays, or functions, and how do you fix it?  
**Solution:** `React.memo` does shallow equality checks. Inline functions or objects receive a new memory reference on every parent render. Wrap functions in `useCallback` and objects in `useMemo`.

```jsx
import { memo, useState, useCallback } from "react";

const HeavyChild = memo(function HeavyChild({ onAction, styleConfig }) {
  return <button style={styleConfig} onClick={onAction}>Click</button>;
});

export function Parent() {
  const [count, setCount] = useState(0);

  //   Stable references prevent HeavyChild from re-rendering
  const handleAction = useCallback(() => {
    console.log("Action performed");
  }, []);

  const config = useMemo(() => ({ padding: "8px 16px" }), []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Counter: {count}</button>
      <HeavyChild onAction={handleAction} styleConfig={config} />
    </div>
  );
}
```

---

### Q29: Code Splitting Modals and Secondary Routes
**Scenario:** A web app bundle is 3.5MB because an admin modal includes heavy chart and PDF exporting libraries that only 5% of users ever open.  
**Question:** How do you dynamically load heavy components on-demand?  
**Solution:** Use `React.lazy` and dynamic `import()` wrapped in `<Suspense>`.

```jsx
import { useState, lazy, Suspense } from "react";

// The chunk is only fetched over the network when opened
const LazyChartModal = lazy(() => import("./ChartModal"));

export function AnalyticsWidget() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Advanced Charts</button>
      {showModal && (
        <Suspense fallback={<div className="spinner">Loading charting engine...</div>}>
          <LazyChartModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

---

### Q30: Preventing Laggy Input with `useDeferredValue`
**Scenario:** As a user types into an input field, React immediately filters and renders a complex SVG network graph of 500 nodes, making the input box feel unresponsive.  
**Question:** How can you keep the text input responsive while allowing the graph rendering to lag slightly behind?  
**Solution:** Use `useDeferredValue` to deprioritize re-rendering the heavy graph.

```jsx
import { useState, useDeferredValue } from "react";
import ComplexGraph from "./ComplexGraph";

export function GraphSearch() {
  const [query, setQuery] = useState("");
  // Input responds immediately; graph gets updated with deferred value at lower priority
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ComplexGraph filter={deferredQuery} isStale={query !== deferredQuery} />
    </div>
  );
}
```

---

### Q31: Transitioning Non-Urgent UI Updates with `useTransition`
**Scenario:** A tab switcher switches between "Overview", "Analytics", and "Audit Logs". The "Audit Logs" tab has thousands of calculations, causing tab switching animation to freeze.  
**Question:** How do you maintain responsive UI transitions during intensive rendering?  
**Solution:** Wrap the tab selection update in `startTransition`.

```jsx
import { useState, useTransition } from "react";

export function TabContainer() {
  const [tab, setTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  const handleTabSwitch = (nextTab) => {
    // Non-urgent update: keeps buttons and inputs responsive while rendering the next tab
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <nav>
        <button onClick={() => handleTabSwitch("overview")}>Overview</button>
        <button onClick={() => handleTabSwitch("audit")}>Audit Logs</button>
      </nav>
      {isPending && <span className="loader">Rendering view...</span>}
      {tab === "overview" && <OverviewTab />}
      {tab === "audit" && <AuditLogsTab />}
    </div>
  );
}
```

---

### Q32: Avoiding Memory Leaks in Detached Event Listeners
**Scenario:** A component listens to window resize to toggle mobile nav. Profiling in Chrome DevTools shows heap size growing continuously during navigation.  
**Question:** What causes component event listener leaks and how do you guarantee cleanup?  
**Solution:** Always return a cleanup function removing the exact same callback reference that was registered.

```jsx
import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    //   Clean up listener reference when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}
```

---

### Q33: Optimizing High-Frequency Mouse Move or Scroll Handlers
**Scenario:** A draggable canvas tracks mouse coordinates. Updating React state on every single `mousemove` event causes severe frame-drops below 60fps.  
**Question:** How do you handle continuous mouse move updates smoothly?  
**Solution:** Store coordinates in a `useRef` and schedule DOM updates using `requestAnimationFrame`, or modify DOM styles directly via ref.

```jsx
import { useRef, useEffect } from "react";

export function DraggableCard() {
  const cardRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;

    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={cardRef} className="floating-card">Drag Me</div>;
}
```

---

### Q34: Detecting and Eliminating Unnecessary Re-renders
**Scenario:** A production dashboard page is sluggish. You suspect several nested cards are re-rendering constantly without state changes.  
**Question:** What tools and techniques do you use to locate the root causes of excess re-renders?  
**Solution:**
1. Use **React DevTools Profiler** with the option `"Highlight updates when components render"` turned on.
2. Record a session and inspect the **Flamegraph** to see which component triggered the commit and why (e.g., "hook 3 changed").
3. Use custom diagnostic hooks like `useWhyDidYouUpdate` during debugging.

```jsx
import { useEffect, useRef } from "react";

export function useWhyDidYouUpdate(name, props) {
  const prevProps = useRef({});

  useEffect(() => {
    const changesObj = {};
    Object.keys(props).forEach((key) => {
      if (prevProps.current[key] !== props[key]) {
        changesObj[key] = { from: prevProps.current[key], to: props[key] };
      }
    });

    if (Object.keys(changesObj).length) {
      console.log(`[why-did-you-update] ${name}:`, changesObj);
    }
    prevProps.current = props;
  });
}
```

---

## 5. Architecture & Design Patterns (Q35–Q42)

### Q35: Compound Components Pattern (Clean Form Controls)
**Scenario:** You are building an accordion or dropdown component. Using props like `accordionItems={[{title, content}]}` becomes rigid when users want icons, tooltips, or custom badges in headers.  
**Question:** How do you implement the Compound Components pattern for flexible consumer markup?  
**Solution:** Share internal toggle state via React Context among parent and sub-components.

```jsx
import { createContext, useContext, useState } from "react";

const ToggleContext = createContext();

export function Toggle({ children, onToggle }) {
  const [on, setOn] = useState(false);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return <ToggleContext.Provider value={{ on, toggle }}>{children}</ToggleContext.Provider>;
}

Toggle.Button = function ToggleButton({ ...props }) {
  const { on, toggle } = useContext(ToggleContext);
  return <button onClick={toggle} {...props} />;
};

Toggle.On = function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
};

Toggle.Off = function ToggleOff({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
};

// Usage:
// <Toggle>
//   <Toggle.On>The switch is ON</Toggle.On>
//   <Toggle.Off>The switch is OFF</Toggle.Off>
//   <Toggle.Button>Toggle</Toggle.Button>
// </Toggle>
```

---

### Q36: Error Boundaries with Granular Fallbacks
**Scenario:** A third-party charting widget throws an unhandled JavaScript exception. The entire application crashes to a blank white screen.  
**Question:** How do you prevent a single child crash from unmounting the whole app?  
**Solution:** Implement an Error Boundary wrapping that specific widget.

```jsx
import React from "react";

export class WidgetErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Widget crash caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback p-4 border border-red-500 rounded">
          <p>Unable to display chart.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### Q37: Render Props Pattern for Headless Logic
**Scenario:** You need to share cursor tracking logic with multiple components: one draws a laser pointer, another displays coordinate numbers.  
**Question:** How do you share behavior while leaving rendering control entirely to the consumer?  
**Solution:** Use the Render Props pattern (or custom hooks).

```jsx
import { useState } from "react";

export function MouseTracker({ render }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: "300px", border: "1px solid black" }}
      onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}
    >
      {render(coords)}
    </div>
  );
}

// Usage:
// <MouseTracker render={({ x, y }) => <p>Position: {x}, {y}</p>} />
```

---

### Q38: Higher-Order Components (HOC) for Route Authentication Guard
**Scenario:** 15 different page components require user authentication and role verification before mounting. Duplicating auth checks in every page is error-prone.  
**Question:** How do you write an HOC to guard access to authorized components?  
**Solution:** Create a `withAuth` wrapper component that inspects user state and redirects unauthorized visitors.

```jsx
import { Navigate } from "react-router-dom";

export function withAuth(Component, requiredRole) {
  return function AuthenticatedComponent(props) {
    const user = useCurrentUser(); // Custom auth hook

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/forbidden" replace />;
    }

    return <Component {...props} user={user} />;
  };
}
```

---

### Q39: Headless UI Component Architecture
**Scenario:** A company builds a unified design system. The web app uses Tailwind, while a subsidiary team uses CSS modules. Both need identical accessible keyboard navigation, ARIA states, and behavior.  
**Question:** What is the Headless Component pattern?  
**Solution:** Separate UI state/accessibility logic into custom hooks or headless components, providing props getters while allowing consumers to control all markup and styling.

```jsx
export function useAccordionItem({ isOpen, onToggle }) {
  return {
    buttonProps: {
      "aria-expanded": isOpen,
      onClick: onToggle,
    },
    panelProps: {
      role: "region",
      hidden: !isOpen,
    },
  };
}
```

---

### Q40: Polymorphic Components (The `as` Prop)
**Scenario:** You want a `<Button>` component that defaults to `<button>`, but can render as an `<a>` tag when given an `href` prop, while preserving all TypeScript types and HTML attributes.  
**Question:** How do you build a polymorphic component in React?  
**Solution:** Accept an `as` component type prop with a default tag value.

```jsx
export function CustomButton({ as: Component = "button", children, ...restProps }) {
  return (
    <Component className="btn-base-style" {...restProps}>
      {children}
    </Component>
  );
}

// Usage:
// <CustomButton>Click</CustomButton> -> renders <button>
// <CustomButton as="a" href="/dashboard">Link</CustomButton> -> renders <a>
```

---

### Q41: Scalable Controlled & Uncontrolled Hybrid Inputs
**Scenario:** You are building an open-source Design System input component. It should support controlled mode (when `value` is provided) and uncontrolled mode with internal state (when only `defaultValue` is provided).  
**Question:** How do you support both controlled and uncontrolled patterns cleanly?  
**Solution:** Check whether `value` is undefined to branch between controlled and uncontrolled behavior.

```jsx
import { useState } from "react";

export function FlexibleInput({ value: controlledValue, defaultValue = "", onChange }) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return <input value={currentValue} onChange={handleChange} />;
}
```

---

### Q42: Clean Feature Flags Implementation
**Scenario:** Your team wants to toggle dark mode v2 and a new payment gateway for 10% of users using feature flags without scattering messy `if/else` checks throughout JSX.  
**Question:** How do you cleanly structure feature flagging in React?  
**Solution:** Use a feature flag provider context and a declarative `<FeatureFlag>` wrapper component.

```jsx
import { createContext, useContext } from "react";

const FlagsContext = createContext({});

export function FeatureFlag({ flag, children, fallback = null }) {
  const flags = useContext(FlagsContext);
  return flags[flag] ? children : fallback;
}

// Usage:
// <FeatureFlag flag="new-checkout" fallback={<LegacyCheckout />}>
//   <NewStripeCheckout />
// </FeatureFlag>
```

---

## 6. Concurrent React, Server Components & Modern APIs (Q43–Q50)

### Q43: React Server Components (RSC) vs. Client Components
**Scenario:** An architect asks you to migrate a data-heavy dashboard to Server Components.  
**Question:** What code belongs in a Server Component vs. a Client Component?  
**Solution:**
- **Server Components:** Database access, file system reads, API calls with internal keys, heavy npm libraries (markdown parsers, dates) that shouldn't ship in client JS bundle.
- **Client Components:** Interactivity (`onClick`, `onChange`), browser APIs (`localStorage`, `window`), React hooks (`useState`, `useEffect`).

```jsx
// Server Component (Default in Next.js App Router)
// No "use client" directive
import db from "@/lib/db";
import ClientLikeButton from "./ClientLikeButton";

export default async function BlogPost({ id }) {
  const post = await db.post.findUnique({ where: { id } });

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Interactive boundary passed to client */}
      <ClientLikeButton postId={id} />
    </article>
  );
}
```

---

### Q44: Progressive Hydration & Selective Suspense
**Scenario:** A product page has a header, heavy recommendation carousel, and reviews. The reviews section takes 3 seconds to fetch data on the server, delaying page interactivity.  
**Question:** How does React `<Suspense>` solve this via selective hydration?  
**Solution:** Wrap slow independent server components in `<Suspense>`. React streams the initial shell and hydrates fast components first, then streams and hydrates the slow component when ready.

```jsx
import { Suspense } from "react";

export default function ProductPage() {
  return (
    <main>
      <ProductDetails />
      <Suspense fallback={<p>Loading reviews...</p>}>
        <SlowReviewsList />
      </Suspense>
    </main>
  );
}
```

---

### Q45: Form Submissions with React 19 / Modern Form Actions
**Scenario:** You need to handle a user update form submission that submits to a server action, automatically tracks pending state, and resets inputs cleanly.  
**Question:** How do modern React form actions simplify form state?  
**Solution:** Use action attributes and `useActionState` (or `useFormStatus`).

```jsx
import { useActionState } from "react";

async function updateProfile(previousState, formData) {
  const name = formData.get("name");
  try {
    await api.saveName(name);
    return { error: null, success: true };
  } catch (err) {
    return { error: err.message, success: false };
  }
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, { error: null, success: false });

  return (
    <form action={formAction}>
      <input name="name" required disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.success && <p>Updated successfully!</p>}
    </form>
  );
}
```

---

### Q46: Reading Promises Direct in Render via `use()`
**Scenario:** You are fetching an active theme or loading a data promise directly inside a child component without managing manual `useEffect` or `isLoading` boilerplate.  
**Question:** How does the modern `use()` API resolve promises and contexts during rendering?  
**Solution:** Pass the promise to `use()`. React will suspend until the promise resolves.

```jsx
import { use, Suspense } from "react";

function UserProfile({ userPromise }) {
  // Unwraps the promise value directly inside render
  const user = use(userPromise);
  return <h2>Hello, {user.name}</h2>;
}

export function App() {
  const promise = fetchUser(); // cached promise

  return (
    <Suspense fallback={<p>Fetching user details...</p>}>
      <UserProfile userPromise={promise} />
    </Suspense>
  );
}
```

---

### Q47: Hydration Mismatch Errors Between SSR & Client
**Scenario:** A component displays `<span>{new Date().toLocaleTimeString()}</span>`. SSR renders on server at 12:00:00, but client hydrates at 12:00:01, producing a hydration error.  
**Question:** How do you resolve server/client date/time mismatches?  
**Solution:** Delay rendering client-only details until after mounting, or suppress warning where appropriate using `suppressHydrationWarning`.

```jsx
import { useState, useEffect } from "react";

export function CurrentTime() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>Loading time...</span>;
  }

  return <span>{new Date().toLocaleTimeString()}</span>;
}
```

---

### Q48: Managing Page Transitions with Micro-Animations (View Transitions)
**Scenario:** When navigating between a product card list and a product detail page, you want the hero image to smoothly animate into place using the native browser View Transitions API.  
**Question:** How do you integrate View Transitions with React state changes?  
**Solution:** Wrap state updates in `document.startViewTransition`.

```jsx
export function ImageSwitcher({ nextImage }) {
  const [current, setCurrent] = useState("/img1.jpg");

  const changeImage = (newSrc) => {
    if (!document.startViewTransition) {
      setCurrent(newSrc);
      return;
    }

    document.startViewTransition(() => {
      setCurrent(newSrc);
    });
  };

  return <img src={current} onClick={() => changeImage("/img2.jpg")} style={{ viewTransitionName: "hero-image" }} />;
}
```

---

### Q49: Telemetry & Tracing with React Profiler API
**Scenario:** Your engineering team requires performance monitoring metrics (actual render durations) sent to an internal Datadog/Grafana pipeline in real-time.  
**Question:** How do you record programmatic render times in React?  
**Solution:** Wrap features with `<Profiler id="..." onRender={callback}>`.

```jsx
import { Profiler } from "react";

function onRenderCallback(id, phase, actualDuration, baseDuration) {
  if (actualDuration > 16) {
    // Flag slow commits longer than 1 standard frame (16ms)
    console.warn(`[Profiler: ${id}] Phase: ${phase}, Duration: ${actualDuration.toFixed(2)}ms`);
  }
}

export function MonitoredCheckout() {
  return (
    <Profiler id="CheckoutFlow" onRender={onRenderCallback}>
      <CheckoutForm />
    </Profiler>
  );
}
```

---

### Q50: Secure Token Storage: Memory vs. LocalStorage vs. HttpOnly Cookies
**Scenario:** An interviewer asks: *"Where should you store a JWT access token and refresh token in a React single-page app (SPA)?"*  
**Question:** What is the most secure pattern against XSS and CSRF?  
**Solution:**
1. **Never store sensitive refresh tokens in `localStorage` or `sessionStorage`:** Any malicious script or dependency injected via XSS can access `window.localStorage`.
2. **Best Practice:** 
   - Store the **Refresh Token** in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie that JavaScript cannot read.
   - Keep the short-lived **Access Token** in React application **memory** (e.g., inside an auth context or module variable).
   - Use an Axios/Fetch interceptor to automatically request a new access token via the cookie when the memory token expires.

```jsx
// React In-Memory Auth Store Example
let memoryAccessToken = null;

export const setAccessToken = (token) => {
  memoryAccessToken = token;
};

export const getAccessToken = () => memoryAccessToken;

// Interceptor silently refreshes via HttpOnly cookie when memory token is empty or expired
export async function authenticatedFetch(url, options = {}) {
  let token = getAccessToken();

  if (!token) {
    const res = await fetch("/api/auth/refresh", { method: "POST" }); // reads HttpOnly cookie
    const data = await res.json();
    token = data.accessToken;
    setAccessToken(token);
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
```