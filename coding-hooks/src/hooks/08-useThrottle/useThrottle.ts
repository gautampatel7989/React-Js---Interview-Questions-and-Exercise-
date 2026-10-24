export function useThrottle<T>(search: T, delay: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(search);
    const lastExecuted = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        const remaining = delay -(now-lastExecuted);

        if(remaining <=0) {
            setThrottledValue(search);
            lastExecuted = now;
        } else {
            const timer = setTimeout(() => {
                setThrottledValue(search);
                lastExecuted = Date.now();
            }, delay);
        }
    },[search, delay]);

    return throttledValue;
}