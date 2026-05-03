import { json }  from '@sveltejs/kit';

import type { RequestHandler }  from './$types';
import connectRequest           from '$lib/services/fetch.service';
import { ENV }                  from '$lib/utils/env.server';


export const GET: RequestHandler = async ({ url }) => {
    const q     = url.searchParams.get( 'q' )    || '';
    const page  = url.searchParams.get( 'page' ) || '1';
    const size  = url.searchParams.get( 'size' ) || '20';

    if ( !q ) {
        return json({
            items : [],
            total : 0,
            page  : 1,
            size  : 20,
            pages : 1,
        });
    }

    const data = await connectRequest({
        endpoint    : `api/v1/members/search/${encodeURIComponent( q )}?page=${page}&size=${size}`,
        isInternal  : false,
        headers     : {
            'X-Internal-Key': ENV.INTERNAL_SECRET_KEY
        }
    });

    return json( data );
};
