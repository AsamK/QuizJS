import type { IApiSettings } from './IApiSettings';
import type { IApiUser } from './IApiUser';

export interface IApiStateResponse {
    fullscreen_promos: [];
    logged_in: boolean;
    user: IApiUser;
    settings: IApiSettings;
}
