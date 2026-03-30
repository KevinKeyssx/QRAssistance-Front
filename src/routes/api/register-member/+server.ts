import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env }  from '$env/dynamic/private';


export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        
        const payload = {
            name       : body.name,
            last_name  : body.last_name,
            classes    : body.classes,
            saveFinger : body.saveFinger || false
        };

        const apiUrl = env.API_URL;

        const response = await fetch( `${apiUrl}/api/v1/members/`, {
            method  : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body    : JSON.stringify( payload )
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
        console.error( '[Register Action] Error:', error );
        
        return json( { message: 'Error interno del servidor' }, { status: 500 } );
    }
};
