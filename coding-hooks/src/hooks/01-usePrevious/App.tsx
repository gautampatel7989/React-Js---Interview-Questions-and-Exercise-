import { useState } from "react";
import { usePrevious } from "./usePrevious";

export default function App() {
    const [count, setCount] = useState<number>(0);
    const previous = usePrevious(count);

    return (
        <div>
            <h2>usePrevious hook</h2>

            <span>Current: {count}</span>
            <span>Previous: {previous}</span>

            <button onClick={() => setCount(count => count+1)}>Increment</button>
        </div>
    );
}