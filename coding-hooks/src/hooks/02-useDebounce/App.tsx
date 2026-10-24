import { useState } from "react";
import { useDebounce } from "./useDebounce";

export default function App() {
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    return (
        <div>
            <h2>useDebounce hook</h2>

            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />

            <p>Typing: {search}</p>
            <p>Debounced value: {debouncedSearch}</p>
        </div>
    )
}