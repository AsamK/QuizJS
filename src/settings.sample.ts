import { BackendRequestFn } from './api/api';
import { createProxiedRequestFn } from './utils/utils';

const PROXY_URL = 'https://example.com/proxy.cgi';

export const QD_SERVER = {
    host: 'qkgermany.feoquizserver.com',
    passwordSalt: 'SQ2zgOTmQc8KXmBP',
};

export function createRequestFn(host: string, cookie?: string): BackendRequestFn {
    return createProxiedRequestFn(PROXY_URL, host, cookie);
}
