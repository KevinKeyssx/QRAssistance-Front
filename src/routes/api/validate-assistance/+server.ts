import { json } from '@sveltejs/kit';
import { env }  from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const { sessionId, ulidToken } = body;

		if ( !sessionId || !ulidToken ) {
			return json({ message: 'Faltan campos requeridos' }, { status: 400 });
		}

		const apiUrl = env.API_URL;

		const response = await fetch( `${apiUrl}/api/v1/assistances`, {
			method  : 'POST',
			headers : {
				'Content-Type'  : 'application/json',
                'accept'        : 'application/json'
			},
			body: JSON.stringify({
				qr_session_id   : sessionId,
				member_ulid     : ulidToken
			})
		});

		let data;

        const text = await response.text();

        try {
			data = text ? JSON.parse( text ) : {};
		} catch ( e ) {
			data = { message: text };
		}

		// Retornar exactamente el status y respuesta que manda el servicio real
		return json( data, { status: response.status });

	} catch ( error ) {
		console.error( 'Error en proxy validate-assistance:', error );
		return json( { message: 'Error interno de comunicación con el servidor' }, { status: 500 });
	}
}
