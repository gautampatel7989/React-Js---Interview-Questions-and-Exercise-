import {useState} from "react";
import { useDebounceCallback } from "./useDebounceCallback";

export default function App() {
    const [search, setSearch] = useState<string>("");
    const debounceCallback = useDebounceCallback((search: string) => {
        console.log(`Saving: ${search}`);
    }, 500);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        debounceCallback(event.target.value);
    }

    return (
        <div>
            <h2>useDebounceCallback</h2>

            <input type="text" value={search} onChange={handleChange}></input>

            <p>Value: {search}</p>

            <p>Save happens after 500 ms typing stop.</p>
        </div>
    )
}