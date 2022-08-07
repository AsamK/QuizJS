import type { BackendRequestFn } from '../api/api';

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
    const result = new Array<number>(length);
    for (let i = 0; i < length; i++) {
        let j;
        do {
            j = Math.trunc(Math.random() * length);
        } while (result[j] != null);
        result[j] = i;
    }
    return result;
}

export function toFormUrlencoded(form: { [key: string]: string }): string {
    return Object.keys(form)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(form[key]))
        .join('&');
}

export function createProxiedRequestFn(proxyUrl: string, targetHost: string, cookie?: string): BackendRequestFn {
    return async (method, path, { contentType, body, queryParams }): Promise<Response> => {
        if (queryParams) {
            path += '?' + toFormUrlencoded(queryParams);
        }

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

        const response = await fetch(proxyUrl, {
            body,
            headers,
            method,
            mode: 'cors',
        });

        if (response.status < 200 || response.status >= 300) {
            return Promise.reject(response);
        }

        return response;
    };
}

export function debounce<P>(fn: (...args: P[]) => void, milliSeconds: number): (...args: P[]) => void {
    let timer: number | null = null;
    return (...args: P[]): void => {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => fn(...args), milliSeconds);
    };
}
