import {useState} from "react";

export function useToggle(initial=false): [boolean, () => void] {
    const [value, setValue] = useState(initial);

    const toggle = () => {
        setValue((value) => !value);
    };

    return [value, toggle];
}