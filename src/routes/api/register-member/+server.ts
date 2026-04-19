import { json }  from '@sveltejs/kit';

import type { RequestHandler }  from './$types';
import connectRequest           from '$lib/services/fetch.service';
import { METHOD }               from '$lib/services/http-codes';
import { forwardError }         from '$lib/server/response';


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    try {
        const data = await connectRequest({
            endpoint   : 'api/v1/members/',
            method     : METHOD.POST,
            isInternal : false,
			body       : {
				name			: body.name,
				last_name		: body.last_name,
				classes			: body.classes,
				saveFinger		: body.saveFinger || false,
				qr_session_id	: body.qr_session_id,
			},
        });

        return json( data );
    } catch ( error ) {
        return forwardError( error );
    }
};
