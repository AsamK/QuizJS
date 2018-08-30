import { BackendRequestFn, IRequestOptions } from '../api/api';

export function shuffleArray<T>(array: T[], targetIndices: number[]): typeof array {
    const n = array.length;
    if (targetIndices.length < n) {
        throw new Error('shuffleArray: targetIndices.length is lower array.length');
    }
    const result = new Array<T>(n);
    array.forEach((entry, i) => {
        result[targetIndices[i]] = entry;
    });
    return result;
}

/**
 * Get a random list of numbers, where each number is unique and in interval [0..length)
 *
 * @param length Number of elements in result array
 */
export function getRandomOrder(length: number): number[] {
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
        let j;
        do {
            j = Math.trunc(Math.random() * length);
        } while (result[j] != null);
        result[j] = i;
    }
    return result;
}

export function createProxiedRequestFn(proxyUrl: string, targetHost: string, cookie?: string): BackendRequestFn {
    return (method: 'GET' | 'POST', path: string, { contentType, body }: IRequestOptions) => {
        const headers = new Headers([
            ['Target-Host', targetHost],
            ['Target-Path', path],
        ]);
        if (cookie) {
            headers.set('X-Cookie', cookie);
        }
        if (contentType) {
            headers.set('Content-Type', contentType);
        }

        return fetch(proxyUrl, {
            body,
            headers,
            method,
            mode: 'cors',
        });
    };
}

export function assertUnreachable(v: never): void {
    console.error('Reached unreachable code!');
}
