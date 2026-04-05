import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import connectRequest          from '$lib/services/fetch.service';
import { METHOD }              from '$lib/services/http-codes';
import { forwardError }        from '$lib/server/response';


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    try {
        const data = await connectRequest({
            endpoint   : 'api/v1/surveys/',
            method     : METHOD.POST,
            isInternal : false,
            body       : {
                member_ulid   : body.member_ulid,
                qr_session_id : body.qr_session_id,
                question1     : body.question1,
                question2     : body.question2,
                question3     : body.question3,
                question4     : body.question4,
            },
        });

        return json( data );
    } catch ( error ) {
        return forwardError( error );
    }
};
