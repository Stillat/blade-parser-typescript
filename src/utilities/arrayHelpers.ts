export function intersect(a: any[], b: any[]) {
    const setA = new Set(a),
        setB = new Set(b),
        intersection = new Set([...setA].filter(x => setB.has(x)));

    return Array.from(intersection);
}