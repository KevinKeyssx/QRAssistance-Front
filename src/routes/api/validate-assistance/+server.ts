import { json }  from '@sveltejs/kit';

import { METHOD }       from '$lib/services/http-codes';
import connectRequest   from '$lib/services/fetch.service';
import { forwardError } from '$lib/server/response';


export async function POST({ request }) {
    const body = await request.json();
    const { sessionId, ulidToken } = body;

    if ( !sessionId || !ulidToken ) {
        return json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    try {
        const data = await connectRequest({
            endpoint   : 'api/v1/assistances/',
            method     : METHOD.POST,
            isInternal : false,
            body       : {
                qr_session_id : sessionId,
                member_ulid   : ulidToken,
            },
        });

        return json( data );
    } catch ( error ) {
        return forwardError( error );
    }
}
