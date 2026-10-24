import { useToggle } from "./useToggle";

export default function App() {
    const [open, toggle] = useToggle();

    return (
        <div>
            <h2>useToggle</h2>

            <p>Status: {open ? "Open" : "Closed"}</p>

            <button onClick={toggle}>Toggle</button>
        </div>
    )
}