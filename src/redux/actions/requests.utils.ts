interface IRequestAction<REQUEST_ACTION_TYPE, REQUEST_INFO> {
    type: REQUEST_ACTION_TYPE;
    requestActionType: RequestActionType.REQUEST;
    requestId: string;
    requestInfo: REQUEST_INFO;
}

interface IResponseAction<RESPONSE_ACTION_TYPE, REQUEST_INFO, RESPONSE_PAYLOAD> {
    type: RESPONSE_ACTION_TYPE;
    requestActionType: RequestActionType.RESPONSE;
    requestId: string;
    requestInfo: REQUEST_INFO;
    response: RESPONSE_PAYLOAD;
}

interface IErrorAction<ERROR_ACTION_TYPE, REQUEST_INFO, ERROR_PAYLOAD> {
    type: ERROR_ACTION_TYPE;
    requestActionType: RequestActionType.ERROR;
    requestId: string;
    requestInfo: REQUEST_INFO;
    error: ERROR_PAYLOAD | string;
}

export enum RequestActionType {
    REQUEST,
    RESPONSE,
    ERROR,
}

export enum LoadingState {
    INITIAL,
    LOADING,
    ERROR,
    SUCCESS,
}

export class ActionType<
    REQUEST_ACTION_TYPE extends string,
    RESPONSE_ACTION_TYPE,
    ERROR_ACTION_TYPE,
    RESPONSE_PAYLOAD,
    ERROR_PAYLOAD = string,
    REQUEST_INFO extends { id: string | number } | undefined = undefined,
> {
    public readonly ALL_ACTIONS_ONLY_TYPE!:
        | IRequestAction<REQUEST_ACTION_TYPE, REQUEST_INFO>
        | IResponseAction<RESPONSE_ACTION_TYPE, REQUEST_INFO, RESPONSE_PAYLOAD>
        | IErrorAction<ERROR_ACTION_TYPE, REQUEST_INFO, ERROR_PAYLOAD>;

    constructor(
        public readonly REQUEST: REQUEST_ACTION_TYPE,
        public readonly RESPONSE: RESPONSE_ACTION_TYPE,
        public readonly ERROR: ERROR_ACTION_TYPE,
    ) {}

    public createRequestAction(
        requestInfo: REQUEST_INFO,
    ): IRequestAction<REQUEST_ACTION_TYPE, REQUEST_INFO> {
        return {
            requestActionType: RequestActionType.REQUEST,
            requestId:
                this.REQUEST +
                (typeof requestInfo === 'object' && 'id' in requestInfo
                    ? requestInfo.id.toString()
                    : ''),
            requestInfo,
            type: this.REQUEST,
        };
    }

    public createResponseAction(
        response: RESPONSE_PAYLOAD,
        requestInfo: REQUEST_INFO,
    ): IResponseAction<RESPONSE_ACTION_TYPE, REQUEST_INFO, RESPONSE_PAYLOAD> {
        return {
            requestActionType: RequestActionType.RESPONSE,
            requestId:
                this.REQUEST +
                (typeof requestInfo === 'object' && 'id' in requestInfo
                    ? requestInfo.id.toString()
                    : ''),
            requestInfo,
            response,
            type: this.RESPONSE,
        };
    }

    public createErrorAction(
        error: ERROR_PAYLOAD | string,
        requestInfo: REQUEST_INFO,
    ): IErrorAction<ERROR_ACTION_TYPE, REQUEST_INFO, ERROR_PAYLOAD> {
        return {
            error,
            requestActionType: RequestActionType.ERROR,
            requestId:
                this.REQUEST +
                (typeof requestInfo === 'object' && 'id' in requestInfo
                    ? requestInfo.id.toString()
                    : ''),
            requestInfo,
            type: this.ERROR,
        };
    }

    public getLoadingState(
        state: { [requestId: string]: LoadingState },
        extraRequestId?: string | number,
    ): LoadingState {
        const id = this.REQUEST + (extraRequestId ? extraRequestId.toString() : '');
        return state[id] || LoadingState.INITIAL;
    }
}

export function getNextLoadingState(
    state: LoadingState,
    requestActionType: RequestActionType,
): LoadingState {
    switch (requestActionType) {
        case RequestActionType.RESPONSE:
            return LoadingState.SUCCESS;
        case RequestActionType.REQUEST:
            return LoadingState.LOADING;
        case RequestActionType.ERROR:
            return LoadingState.ERROR;
    }
}
