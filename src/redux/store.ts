import { createRequestFn, QD_SERVER } from '../settings';
import { IExtraArgument } from './thunks';

export const extraThunkArgument: IExtraArgument = {
    requestFn: createRequestFn(QD_SERVER.host),
};
