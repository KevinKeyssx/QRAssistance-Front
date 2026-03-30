import { json } from '@sveltejs/kit';
import { env }  from '$env/dynamic/private';

import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ url }) => {
    try {
        const q     = url.searchParams.get( 'q' )       || '';
        const page  = url.searchParams.get( 'page' )    || '1';
        const size  = url.searchParams.get( 'size' )    || '20';

        if ( !q ) {
            return json({
                items   : [],
                total   : 0,
                page    : 1,
                size    : 20,
                pages   : 1
            });
        }

        const apiUrl        = env.API_URL;
        const requestUrl    = `${apiUrl}/api/v1/members/search/${encodeURIComponent( q )}?page=${page}&size=${size}`;

        const response = await fetch( requestUrl, {
            method  : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        });

        const text = await response.text();

        let data;

        try {
            data = text ? JSON.parse( text ) : {};
        } catch {
            data = { message: text };
        }

        return json( data, { status: response.status } );
    } catch ( error ) {
        return json( { message: 'Error interno del servidor' }, { status: 500 } );
    }
};
