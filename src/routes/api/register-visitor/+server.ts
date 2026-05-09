import { json }  from '@sveltejs/kit';

import type { RequestHandler }  from './$types';
import connectRequest           from '$lib/services/fetch.service';
import { METHOD }               from '$lib/services/http-codes';
import { forwardError }         from '$lib/server/response';
import { ENV }                  from '$lib/utils/env.server';


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    try {
        const data = await connectRequest({
            endpoint   : 'api/v1/assistances/visitor',
            method     : METHOD.POST,
            isInternal : false,
			body       : {
				visitor_id		: body.visitor_id,
				qr_session_id	: body.qr_session_id,
			},
            headers : {
                'X-Internal-Key': ENV.INTERNAL_SECRET_KEY
            }
        });

        return json( data );
    } catch ( error ) {
        return forwardError( error );
    }
};
