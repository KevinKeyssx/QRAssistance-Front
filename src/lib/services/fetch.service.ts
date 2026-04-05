import { METHOD } from './http-codes';


const BASE_URL = import.meta.env.VITE_API_URL as string;


type Connect = {
    endpoint    : string;
    method?     : METHOD;
    body?       : object;
    isInternal? : boolean;
}


export type ApiError = {
    message : string;
    code    : string;
    status? : number;
    data?   : unknown;
}


export const isApiError = ( error: any ): error is ApiError => 
    typeof error === 'object' && error !== null && 'message' in error && 'code' in error;


export default async function connectRequest<T>({
    method = METHOD.GET,
    body,
    endpoint,
    isInternal = true
}: Connect ): Promise<T | ApiError> {
    const url      = isInternal ? `/api/${endpoint}` : `${BASE_URL}/${endpoint}`;
    const response = await fetch( url, {
        method,
        body    : body ? JSON.stringify( body ) : undefined,
        cache   : 'no-cache',
        headers : {
            'Content-Type' : 'application/json',
            Accept         : 'application/json',
        }
    });

    if ( !response.ok ) {
        const errorData = await response.json().catch( () => ({}) );

        throw {
            message : errorData.message || 'Request failed',
            code    : `HTTP_${response.status}`,
            status  : response.status,
            data    : errorData,
        } as ApiError;
    }

    if ( response.status === 204 ) return true as T;

    return await response.json() as T;

}
