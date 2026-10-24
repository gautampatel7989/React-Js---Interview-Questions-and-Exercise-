# 100 Concept-Wise React Interview Questions & Code Examples

A complete, concept-by-concept interview handbook covering core foundations, hooks, state management, performance, modern features (React 18/19), and design patterns with illustrative examples.

---

## Table of Contents
1. [Core React & JSX (Q1–Q10)](#1-core-react--jsx-q1q10)
2. [Components, Props & State (Q11–Q20)](#2-components-props--state-q11q20)
3. [Reconciliation, Virtual DOM & Fiber (Q21–Q30)](#3-reconciliation-virtual-dom--fiber-q21q30)
4. [Basic Hooks: useState, useEffect, useContext (Q31–Q40)](#4-basic-hooks-usestate-useeffect-usecontext-q31q40)
5. [Performance Hooks: useMemo & useCallback (Q41–Q50)](#5-performance-hooks-usememo--usecallback-q41q50)
6. [Refs & DOM Access (Q51–Q60)](#6-refs--dom-access-q51q60)
7. [Advanced Hooks & React 18/19 Additions (Q61–Q70)](#7-advanced-hooks--react-1819-additions-q61q70)
8. [Component Patterns & Architecture (Q71–Q80)](#8-component-patterns--architecture-q71q80)
9. [Forms, Routing & Data Fetching (Q81–Q90)](#9-forms-routing--data-fetching-q81q90)
10. [Error Handling, Testing & Best Practices (Q91–Q100)](#10-error-handling-testing--best-practices-q91q100)

---

## 1. Core React & JSX (Q1–Q10)

### Q1: What is JSX, and what does it compile to?
**Answer:** JSX is a syntax extension that resembles HTML. Compilers (like Babel or SWC) transform it into function calls like `React.createElement` or `jsxRuntime.jsx`.

```jsx
// Input
const element = <h1 className="title">Hello</h1>;

// Compiled Output
const element = jsxRuntime.jsx('h1', { className: 'title', children: 'Hello' });
```

---

### Q2: Why must JSX expressions have a single parent element?
**Answer:** JSX expressions compile to standard JavaScript function calls. In JS, a function cannot return multiple expressions simultaneously without an enclosing array or object. Fragments (`<>...</>`) allow grouping without adding extra DOM nodes.

```jsx
const Card = () => (
  <>
    <h3>Title</h3>
    <p>Description</p>
  </>
);
```

---

### Q3: What is the difference between an Element and a Component?
**Answer:** An **Element** is an immutable plain object describing what to display on the screen (`{ type: 'div', props: {...} }`). A **Component** is a function or class that returns elements.

```jsx
// Component (function)
const Button = ({ label }) => <button>{label}</button>;

// Element (descriptor object)
const buttonElement = <Button label="Click" />;
```

---

### Q4: Why must custom component names start with a capital letter?
**Answer:** JSX distinguishes HTML/SVG tags from custom components by case. Lowercase names (`<div />`) are compiled as string tags; capitalized names (`<Profile />`) are compiled as direct variable references.

---

### Q5: How does React protect against Cross-Site Scripting (XSS)?
**Answer:** React escapes string values embedded within curly braces (`{}`) before rendering them to the DOM, rendering malicious scripts as benign text.

```jsx
// Rendered harmlessly as text
const userInput = "<script>alert('hack')</script>";
const Element = () => <div>{userInput}</div>;
```

---

### Q6: How do you safely render unescaped HTML when strictly required?
**Answer:** Use `dangerouslySetInnerHTML`, ensuring the source HTML is sanitized (e.g., using DOMPurify).

```jsx
import DOMPurify from 'dompurify';

const SafeHtml = ({ rawHtml }) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawHtml) }} />
);
```

---

### Q7: What are Synthetic Events?
**Answer:** React's cross-browser wrapper around native browser events, providing a uniform API across platforms while managing event pooling and delegation.

```jsx
const ClickTracker = () => {
  const handleClick = (e) => {
    e.preventDefault(); // Works identically across all browsers
    console.log(e.nativeEvent); // Access native underlying DOM event
  };
  return <a href="/target" onClick={handleClick}>Visit</a>;
};
```

---

### Q8: Where are events attached in modern React (v17+)?
**Answer:** Events are delegated to the root DOM container hosting the React tree (e.g., `#root`) rather than the global `document` node, making micro-frontends and multi-root configurations safe.

---

### Q9: What is React StrictMode?
**Answer:** A development-only tool that highlights potential problems such as deprecated APIs, unsafe lifecycles, and side effects by intentionally double-invoking render methods and effects.

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

---

### Q10: What is conditional rendering and what is the pitfall of using `&&` with numbers?
**Answer:** Conditional rendering displays components based on conditions. If the condition evaluates to `0`, `0 && <Component />` evaluates to `0` and prints `0` on the screen.

```jsx
// Problem: Displays '0' when count is 0
{count && <ItemsList />}

// Solution: Explicit boolean check
{count > 0 && <ItemsList />}
```

---

## 2. Components, Props & State (Q11–Q20)

### Q11: What is the difference between Props and State?
**Answer:** Props are immutable parameters passed down from a parent component. State is mutable data managed locally within the component that triggers re-renders upon modification.

---

### Q12: Why should state never be mutated directly?
**Answer:** React detects changes by shallow-comparing previous and next state references. Mutating an object or array in place preserves its memory address, causing React to skip re-rendering.

```jsx
// Incorrect
items.push('new');
setItems(items);

// Correct
setItems([...items, 'new']);
```

---

### Q13: Why is state updating asynchronous / batched?
**Answer:** Batching groups multiple state updates into a single render pass, reducing layout thrashing and unnecessary re-renders.

```jsx
const handleClick = () => {
  // Batched into a single re-render in React 18+
  setCount((c) => c + 1);
  setFlag((f) => !f);
};
```

---

### Q14: How does the functional updater form of `setState` work?
**Answer:** When your next state relies on the current value, passing a function `(prev) => next` guarantees you read the most up-to-date queued value.

```jsx
const incrementThreeTimes = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
};
```

---

### Q15: What is "prop drilling" and how do you resolve it?
**Answer:** Passing props through intermediate components that do not need them. Resolved using the Context API, state libraries (Redux, Zustand), or component composition.

```jsx
// Resolved via composition
const Page = ({ header, content }) => (
  <div>
    {header}
    {content}
  </div>
);
```

---

### Q16: What are default props in functional components?
**Answer:** Functional components handle default values using standard JavaScript default parameter syntax.

```jsx
const Avatar = ({ size = 48, shape = 'circle' }) => (
  <div className={`avatar ${shape}`} style={{ width: size, height: size }} />
);
```

---

### Q17: What are controlled vs uncontrolled components?
**Answer:** In controlled components, form input values are driven by React state. In uncontrolled components, DOM form elements retain their own internal state accessed via refs.

```jsx
// Controlled
<input value={text} onChange={(e) => setText(e.target.value)} />

// Uncontrolled
<input ref={inputRef} defaultValue="initial" />
```

---

### Q18: What is "Lifting State Up"?
**Answer:** Moving shared state up to the closest common ancestor so multiple sibling components can access and synchronize with that data.

```jsx
const Parent = () => {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBar query={query} onQueryChange={setQuery} />
      <SearchResults query={query} />
    </>
  );
};
```

---

### Q19: What is pure component behavior?
**Answer:** A component is pure if it always returns the exact same JSX output for identical props and state, without causing observable side effects during rendering.

---

### Q20: How can you reset component state using keys?
**Answer:** Changing a component's `key` tells React to unmount the existing instance and mount a fresh one with reset internal state.

```jsx
// Form completely resets whenever userId changes
<UserProfileForm key={userId} userId={userId} />
```

---

## 3. Reconciliation, Virtual DOM & Fiber (Q21–Q30)

### Q21: What is the Virtual DOM?
**Answer:** A lightweight in-memory tree of JavaScript objects matching the actual DOM. React compares Virtual DOM trees to isolate real DOM mutations.

---

### Q22: What is Reconciliation?
**Answer:** The diffing algorithm React uses to determine which parts of the real DOM tree must be created, modified, or removed when state or props change.

---

### Q23: Why are stable `key` props mandatory in lists?
**Answer:** Keys help React identify which items in a list have changed, been added, or removed across renders, preserving correct element state.

---

### Q24: Why is using list indices as `key` an anti-pattern for dynamic lists?
**Answer:** When items are sorted, inserted, or deleted, indices change, causing internal state, inputs, and animations to attach to the wrong items.

```jsx
// Bad (dynamic list)
{items.map((item, index) => <TodoItem key={index} item={item} />)}

// Good
{items.map((item) => <TodoItem key={item.id} item={item} />)}
```

---

### Q25: What is React Fiber?
**Answer:** The complete rewrite of React's core reconciliation engine introduced in React 16. It enables incremental rendering by splitting rendering work into interruptible chunks.

---

### Q26: What are the two phases of React rendering in Fiber?
**Answer:**
1. **Render Phase:** Asynchronous and interruptible; React computes the diffs.
2. **Commit Phase:** Synchronous and uninterruptible; React applies mutations to the real DOM.

---

### Q27: How does element type comparison affect reconciliation?
**Answer:** If the element type changes between renders (e.g., from `<div>` to `<section>`), React destroys the entire old subtree and recreates it from scratch.

---

### Q28: How does React identify when to update an existing DOM node vs create a new one?
**Answer:** React compares element `type` and `key`. If both match, it updates the existing DOM node's attributes without recreating it.

---

### Q29: What happens when state is set to its current value?
**Answer:** React uses `Object.is` comparison. If the new state matches the current state, React bails out of re-rendering children or firing effects.

---

### Q30: What is tearing in Concurrent React?
**Answer:** A visual inconsistency where different components render UI using different versions of state because the asynchronous render was interrupted midway by a store update.

---

## 4. Basic Hooks: useState, useEffect, useContext (Q31–Q40)

### Q31: What are the fundamental Rules of Hooks?
**Answer:**
1. Only call hooks at the top level (never inside loops, conditions, or nested functions).
2. Only call hooks from React function components or custom hooks.

---

### Q32: Why does `useState` accept an initializer function?
**Answer:** Lazy initial state ensures computationally expensive setups run only once during the initial mount, not on every re-render.

```jsx
// Expensive setup runs only on mount
const [data, setData] = useState(() => parseMassiveJsonConfig());
```

---

### Q33: When does `useEffect` run?
**Answer:** It runs asynchronously **after** the render has been committed and the browser has painted the screen, ensuring non-blocking UI.

---

### Q34: What is the purpose of the `useEffect` cleanup function?
**Answer:** To abort fetches, unsubscribe from event listeners, clear timers, and prevent resource leaks before the component unmounts or before re-running the effect.

```jsx
useEffect(() => {
  const handler = () => console.log('Resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

---

### Q35: What happens when the `useEffect` dependency array is omitted, empty, or populated?
**Answer:**
* **Omitted (`none`):** Runs after every render.
* **Empty (`[]`):** Runs once after the initial mount.
* **Populated (`[a, b]`):** Runs on mount and whenever `a` or `b` changes.

---

### Q36: How do you handle race conditions in `useEffect` when fetching data?
**Answer:** Use an active flag or an `AbortController` in the cleanup function.

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/user/${id}`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setUser(data))
    .catch((err) => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort();
}, [id]);
```

---

### Q37: How does `useContext` work?
**Answer:** Subscribes a functional component to context changes, reading the value supplied by the nearest `<Context.Provider>` up the tree.

```jsx
const ThemeContext = createContext('light');

const Panel = () => {
  const theme = useContext(ThemeContext);
  return <div className={`panel-${theme}`} />;
};
```

---

### Q38: What causes components using `useContext` to re-render?
**Answer:** Whenever the context provider's `value` prop changes reference (`Object.is`), every consuming component re-renders, regardless of `React.memo`.

---

### Q39: How do you prevent unnecessary context re-renders?
**Answer:** Memoize the context value object using `useMemo`, or split the context into multiple smaller providers (e.g., separating state from dispatch).

```jsx
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
```

---

### Q40: What is the difference between `useEffect` and `useLayoutEffect`?
**Answer:** `useEffect` runs asynchronously after paint. `useLayoutEffect` fires synchronously after DOM mutations but before the browser paints, ideal for measuring DOM layout to avoid flickers.

```jsx
useLayoutEffect(() => {
  const height = ref.current.getBoundingClientRect().height;
  setBoxHeight(height);
}, []);
```

---

## 5. Performance Hooks: useMemo & useCallback (Q41–Q50)

### Q41: What does `useMemo` do?
**Answer:** Caches the result of a calculation between renders, recalculating only when specified dependencies change.

```jsx
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.value - b.value);
}, [items]);
```

---

### Q42: What does `useCallback` do?
**Answer:** Caches a function definition between renders to maintain a stable reference identity across re-renders.

```jsx
const handleAction = useCallback(() => {
  console.log('Action performed on', id);
}, [id]);
```

---

### Q43: What is the relationship between `useCallback` and `useMemo`?
**Answer:** `useCallback(fn, deps)` is syntactic sugar equivalent to `useMemo(() => fn, deps)`.

---

### Q44: When is `useCallback` actually useful?
**Answer:** Primarily when passing callback functions to memoized child components (`React.memo`) or as dependencies to other hooks (`useEffect`).

```jsx
const MemoizedChild = React.memo(({ onClick }) => <button onClick={onClick}>Run</button>);

const Parent = () => {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log('Clicked'), []);
  return <MemoizedChild onClick={handleClick} />;
};
```

---

### Q45: Does `useMemo` make all code faster?
**Answer:** No. Memoization incurs memory overhead and dependency comparisons on every render. If the calculation is cheap, `useMemo` adds more overhead than it saves.

---

### Q46: How does `React.memo` work?
**Answer:** A higher-order component that skips re-rendering a component if its new props are shallow-equal to its previous props.

```jsx
const UserBadge = React.memo(({ name }) => {
  return <span>{name}</span>;
});
```

---

### Q47: How can you customize the comparison logic in `React.memo`?
**Answer:** Pass a custom equality callback `(prevProps, nextProps) => boolean` as the second argument.

```jsx
const Row = React.memo(
  ({ item }) => <div>{item.title}</div>,
  (prev, next) => prev.item.id === next.item.id && prev.item.version === next.item.version
);
```

---

### Q48: Why do inline object literals break `React.memo`?
**Answer:** `{}` creates a new object reference in memory every render. A shallow comparison `prev.style === next.style` will evaluate to `false`.

```jsx
// Breaks memoization: style gets a new reference every render
<MemoizedCard style={{ margin: 10 }} />

// Preserves memoization
const cardStyle = { margin: 10 };
<MemoizedCard style={cardStyle} />
```

---

### Q49: How can you inspect why a component re-rendered?
**Answer:** Use the React DevTools Profiler, trace render commits, or use debugging tools like `why-did-you-render`.

---

### Q50: What is component virtualization?
**Answer:** Rendering only the visible items currently inside the viewport window rather than rendering thousands of DOM elements (e.g., using `react-window` or `@tanstack/react-virtual`).

---

## 6. Refs & DOM Access (Q51–Q60)

### Q51: What is `useRef` and what does it return?
**Answer:** `useRef` returns a mutable object `{ current: initialValue }` whose reference persists across the component's full lifecycle without triggering re-renders on mutation.

```jsx
const renderCount = useRef(0);
renderCount.current += 1;
```

---

### Q52: How do you access a DOM element using `useRef`?
**Answer:** Pass the ref object to an element's `ref` prop. React populates `.current` with the underlying DOM node on mount.

```jsx
const TextInput = () => {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current?.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
};
```

---

### Q53: What is the key difference between `useRef` and `useState`?
**Answer:** Updating `useState` triggers a component re-render; mutating `useRef.current` does not trigger a re-render.

---

### Q54: What is `forwardRef`?
**Answer:** A higher-order function that allows a component to receive a `ref` from a parent and pass it down to a child DOM node or component.

```jsx
const FancyInput = forwardRef((props, ref) => (
  <input ref={ref} className="fancy-input" {...props} />
));
```

---

### Q55: How does `forwardRef` work in React 19?
**Answer:** In React 19, `ref` is passed as a standard prop to function components, making the `forwardRef` wrapper obsolete.

```jsx
// React 19 native ref passing
const FancyInput = ({ ref, ...props }) => (
  <input ref={ref} className="fancy-input" {...props} />
);
```

---

### Q56: What does `useImperativeHandle` do?
**Answer:** Customizes the instance value exposed to parent components when using `ref`, hiding internal DOM details.

```jsx
const CustomPlayer = forwardRef((props, ref) => {
  const videoRef = useRef();

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause()
  }));

  return <video ref={videoRef} src="/video.mp4" />;
});
```

---

### Q57: How do you store previous state or prop values?
**Answer:** Capture the previous value inside a `useRef` updated in an effect.

```jsx
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
```

---

### Q58: What is a callback ref?
**Answer:** Passing a function instead of a ref object to the `ref` attribute. React calls this function with the DOM node when mounting and `null` when unmounting.

```jsx
const MeasureNode = () => {
  const refCallback = useCallback((node) => {
    if (node !== null) {
      console.log('Node height:', node.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={refCallback}>Target Box</div>;
};
```

---

### Q59: Why is modifying DOM nodes directly via refs discouraged?
**Answer:** Bypassing React's state-driven DOM updates can cause state desynchronization, layout inconsistencies, and unexpected overwrites during reconciliation.

---

### Q60: Can you store timer IDs in `useRef`?
**Answer:** Yes. Storing interval or timeout IDs in refs allows access across renders and inside cleanup handlers without triggering extra re-renders.

```jsx
const Timer = () => {
  const timerId = useRef();

  const start = () => {
    timerId.current = setInterval(() => console.log('Tick'), 1000);
  };

  useEffect(() => () => clearInterval(timerId.current), []);
  return <button onClick={start}>Start</button>;
};
```

---

## 7. Advanced Hooks & React 18/19 Additions (Q61–Q70)

### Q61: What is `useReducer` and when should you use it over `useState`?
**Answer:** A hook for managing complex state logic that involves multiple sub-values or where the next state depends heavily on the previous state.

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: 'increment' })}>{state.count}</button>;
};
```

---

### Q62: What is `useTransition`?
**Answer:** A hook that lets you mark state updates as non-urgent transitions, keeping the user interface responsive during heavy UI renders.

```jsx
const [isPending, startTransition] = useTransition();

const handleFilter = (e) => {
  const value = e.target.value;
  setInputValue(value); // Urgent: immediate input field update
  startTransition(() => {
    setFilterTerm(value); // Non-urgent: deferred heavy list filter
  });
};
```

---

### Q63: What is `useDeferredValue`?
**Answer:** A hook that accepts a value and defers updating that value until urgent rendering tasks have completed.

```jsx
const DeferredDisplay = ({ query }) => {
  const deferredQuery = useDeferredValue(query);
  return <HeavyList search={deferredQuery} />;
};
```

---

### Q64: What is `useId` and why is it preferred over `Math.random()`?
**Answer:** Generates unique, stable identifiers across both server and client rendering, preventing SSR hydration mismatches.

```jsx
const LabeledField = ({ label }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
};
```

---

### Q65: What is `useSyncExternalStore`?
**Answer:** A hook recommended for subscribing to external state stores (like Redux, Zustand, or browser APIs) to ensure concurrent-safe, tear-free reads.

```jsx
const isOnline = useSyncExternalStore(
  (callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  },
  () => navigator.onLine, // Client snapshot
  () => true              // Server snapshot
);
```

---

### Q66: What is the `useActionState` (formerly `useFormState`) hook in React 19?
**Answer:** A hook designed to manage state for async form actions, providing the current state, action trigger, and pending status.

```jsx
// React 19 Action State
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const res = await saveName(formData.get('name'));
  return res.success ? { error: null } : { error: res.message };
}, { error: null });
```

---

### Q67: What does the `useFormStatus` hook do?
**Answer:** Provides status information (like `pending`) about the parent `<form>` without requiring props to be passed down through child inputs or buttons.

```jsx
import { useFormStatus } from 'react-dom';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Submitting...' : 'Save'}</button>;
};
```

---

### Q68: What is `useOptimistic` in React 19?
**Answer:** A hook that lets you display optimistic UI state updates immediately while an asynchronous action is in-flight.

```jsx
const [optimisticMessages, setOptimisticMessages] = useOptimistic(
  messages,
  (state, newMessage) => [...state, { text: newMessage, sending: true }]
);
```

---

### Q69: What is the `use()` API in React 19?
**Answer:** A unified API that can read resources (such as Promises or Context) directly inside render, conditionally or within loops.

```jsx
const UserData = ({ promise }) => {
  const data = use(promise); // Suspends until the promise resolves
  return <div>{data.name}</div>;
};
```

---

### Q70: How do you build a custom hook?
**Answer:** By creating a function prefixed with `use` that calls other React hooks to encapsulate and share reusable stateful logic.

```jsx
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};
```

---

## 8. Component Patterns & Architecture (Q71–Q80)

### Q71: What are Higher-Order Components (HOCs)?
**Answer:** Pure functions that take an existing component and return an enhanced new component (e.g., adding authentication or telemetry).

```jsx
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <LoginRedirect />;
    return <WrappedComponent {...props} />;
  };
};
```

---

### Q72: What is the Render Props pattern?
**Answer:** A component design pattern where a component takes a function that returns a React element as a prop to share logic.

```jsx
const MouseTracker = ({ render }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}>
      {render(coords)}
    </div>
  );
};
```

---

### Q73: What is the Compound Components pattern?
**Answer:** A design pattern where components collaborate seamlessly via shared internal state (e.g., `<Select>` and `<Select.Option>`).

```jsx
const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === index ? 'active' : ''}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};
```

---

### Q74: What are React Portals and when should you use them?
**Answer:** Portals render child components into a different DOM subtree outside of the current component's parent hierarchy, useful for modals, tooltips, and dialogs.

```jsx
import { createPortal } from 'react-dom';

const Modal = ({ children }) => {
  return createPortal(
    <div className="modal-backdrop">{children}</div>,
    document.getElementById('modal-root')
  );
};
```

---

### Q75: How does event bubbling behave through Portals?
**Answer:** Events bubbling through React Portals follow the **React virtual component tree**, not the physical real DOM hierarchy.

---

### Q76: What are Container and Presentational components?
**Answer:** An architectural separation where **Container** components handle state, data fetching, and business logic, while **Presentational** components focus purely on rendering UI from props.

---

### Q77: What is the difference between Client and Server Components (RSC)?
**Answer:**
* **Server Components:** Execute exclusively on the server, have zero client bundle cost, and can access backend resources directly.
* **Client Components:** Hydrated and rendered in the browser, supporting state, effects, and interactive event handlers.

---

### Q78: How do you mark a component as a Client Component in Next.js / RSC?
**Answer:** By placing the `'use client';` directive at the top of the file before any imports.

```jsx
'use client';

import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};
```

---

### Q79: Can Server Components be imported into Client Components?
**Answer:** Server components cannot be imported directly into client components, but they can be passed as `children` or other props to client components.

```jsx
// Valid Composition
<ClientWrapper>
  <ServerComponent />
</ClientWrapper>
```

---

### Q80: What are Server Actions?
**Answer:** Asynchronous server functions invoked directly from client or server components (e.g., in form submissions) to mutate server-side data without creating manual API endpoints.

```jsx
// Server Action
async function updateUser(formData) {
  'use server';
  const name = formData.get('name');
  await db.user.update({ where: { id: 1 }, data: { name } });
}
```

---

## 9. Forms, Routing & Data Fetching (Q81–Q90)

### Q81: How do you handle multiple input fields with a single `useState`?
**Answer:** Store the inputs in an object and update them using dynamic object keys matching each input's `name` attribute.

```jsx
const [form, setForm] = useState({ firstName: '', email: '' });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
```

---

### Q82: How do you prevent unnecessary re-renders in large forms?
**Answer:** Use uncontrolled components with `useRef`, or use specialized form state management libraries like React Hook Form.

---

### Q83: What is the purpose of React Suspense?
**Answer:** Suspense lets components specify a fallback UI (like spinners) while their children are loading asynchronous resources (data, code-split scripts, or images).

```jsx
<Suspense fallback={<LoadingSpinner />}>
  <AsyncProfileDetails />
</Suspense>
```

---

### Q84: How do you implement code-splitting using `React.lazy`?
**Answer:** Combine dynamic imports with `React.lazy` and enclose the target component inside a `<Suspense>` wrapper.

```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));

const App = () => (
  <Suspense fallback={<p>Loading bundle...</p>}>
    <Dashboard />
  </Suspense>
);
```

---

### Q85: What is client-side routing?
**Answer:** Navigating between views without a full browser page refresh. The router listens to changes in the browser history API and conditionally mounts matching components.

---

### Q86: What is the difference between declarative and programmatic navigation?
**Answer:** Declarative navigation uses link components (`<Link to="/about">About</Link>`). Programmatic navigation uses imperative router methods (e.g., `navigate('/login')`).

---

### Q87: Why is fetching data inside raw `useEffect` considered problematic for large applications?
**Answer:** Raw effects often suffer from race conditions, lack caching, cause network waterfalls, and don't provide built-in revalidation on window focus. Dedicated tools (React Query/TanStack Query, SWR, or RSC) handle these automatically.

---

### Q88: How does SWR / TanStack Query solve client-side caching?
**Answer:** They employ the `stale-while-revalidate` cache invalidation strategy: serve cached data instantly, then refetch in the background and update the UI seamlessly.

---

### Q89: What is hydration in Server-Side Rendering (SSR)?
**Answer:** The client-side process where React attaches event listeners and hooks internal state onto pre-rendered HTML sent from the server.

---

### Q90: What causes a hydration mismatch error?
**Answer:** A mismatch occurs when the HTML pre-rendered on the server does not match the initial render tree produced on the client (e.g., referencing `window` or `Date.now()` during initial render).

---

## 10. Error Handling, Testing & Best Practices (Q91–Q100)

### Q91: What is an Error Boundary?
**Answer:** A component that catches JavaScript errors anywhere in its child component tree, logs the error, and renders a fallback UI instead of crashing the entire app.

---

### Q92: Why must Error Boundaries still be Class Components?
**Answer:** Only class components support the `componentDidCatch` and `getDerivedStateFromError` lifecycle methods. There are no functional hook equivalents yet.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Logged to telemetry:', error, info);
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```

---

### Q93: What errors do Error Boundaries NOT catch?
**Answer:**
1. Event handlers (e.g., errors in `onClick`).
2. Asynchronous code (e.g., `setTimeout`, `requestAnimationFrame`).
3. Server-side rendering errors.
4. Errors thrown inside the Error Boundary component itself.

---

### Q94: How do you handle errors inside asynchronous event handlers?
**Answer:** Catch errors using `try/catch` blocks and store the error in local component state.

```jsx
const SubmitBtn = () => {
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      await sendAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  return <button onClick={handleClick}>Submit</button>;
};
```

---

### Q95: What is the philosophy behind React Testing Library (RTL)?
**Answer:** Test your software the way users interact with it. RTL prioritizes selecting elements by accessible roles, labels, and text rather than component implementation details.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';

test('increments counter on click', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

---

### Q96: What is the difference between `getBy...`, `queryBy...`, and `findBy...` in RTL?
**Answer:**
* **`getBy...`:** Returns element or throws an error if not found (sync).
* **`queryBy...`:** Returns element or `null` if not found (sync; great for asserting absence).
* **`findBy...`:** Returns a Promise that resolves when element appears, or rejects on timeout (async).

---

### Q97: What is the `act()` utility in React testing?
**Answer:** Ensures all pending state updates, effects, and reconciliations are resolved before running assertions on the DOM. RTL wraps user interactions in `act()` automatically.

---

### Q98: Why should you avoid storing derived state in `useState`?
**Answer:** Storing values that can be computed from existing props or state introduces data redundancy and synchronization bugs. Compute derived values during render instead.

```jsx
// Bad
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(`${first} ${last}`), [first, last]);

// Good
const fullName = `${first} ${last}`;
```

---

### Q99: What are memory leaks in React components and how do you prevent them?
**Answer:** Uncanceled asynchronous subscriptions, open web sockets, or lingering intervals that continue holding component references in memory after unmount. Always clean them up in the effect cleanup return function.

---

### Q100: What is the React Compiler (React Forget)?
**Answer:** An ahead-of-time optimizing compiler that automatically injects fine-grained memoization into React code, eliminating the manual overhead of managing `useMemo`, `useCallback`, and `React.memo`.