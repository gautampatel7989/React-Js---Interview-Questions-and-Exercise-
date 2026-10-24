import {useRef, useEffect} from "react";

export function useInterval(callback: () => void, delay: number): void {
    const callbackRef = useRef(callback);

    //Persist latest callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const timer = setInterval(() => {
            callbackRef.current();
        }, delay)

        return () => clearInterval(timer);
    },[delay]);
}