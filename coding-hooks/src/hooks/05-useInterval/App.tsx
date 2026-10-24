import {useState} from "react";
import { useInterval } from "./useInterval";

export default function App() {
    const [count, setCount] = useState<number>(0);

    useInterval(() => {
        setCount((count) => count+1);
    }, 1000);

    return (
        <div>
            <h2>useInterval</h2>

            <p>Count: {count}</p>
        </div>
    )
}