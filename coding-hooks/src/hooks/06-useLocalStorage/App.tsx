import { useLocalStorage } from "./useLocalStorage";

export default function App() {
    const [name, setName] = useLocalStorage<string>("name", "");

    return (
        <div>
            <h2>useLocalStorage</h2>

            <input type="text" value={name} onChange={(event) => setName(event.target.value)}></input>

            <p>Hello {name}</p>
        </div>
    )
}