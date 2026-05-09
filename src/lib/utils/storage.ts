export const TOKEN_KEY = 'ULID_TOKEN';

export function setUlidToken( token: string ): void {
	if ( typeof window === 'undefined' ) return;

	// 1. Guardar en localStorage
	localStorage.setItem( TOKEN_KEY, token );

	// 2. Guardar en Cookie de redundancia (Expira en 1 año)
	const maxAge = 60 * 60 * 24 * 365; // 365 días
	document.cookie = `${TOKEN_KEY}=${token}; max-age=${maxAge}; path=/; samesite=lax;`;
}

export function getUlidToken(): string {
	if ( typeof window === 'undefined' ) return '';

	// 1. Intentar obtener de localStorage
	let token = localStorage.getItem( TOKEN_KEY );

	if ( token ) {
		return token;
	}

	// 2. Si no está en localStorage, intentar obtener de Cookies
	const cookies = document.cookie.split( ';' );
	
	for ( let i = 0; i < cookies.length; i++ ) {
		const cookie = cookies[ i ].trim();
		
		if ( cookie.startsWith( `${TOKEN_KEY}=` ) ) {
			token = cookie.substring( TOKEN_KEY.length + 1 );
			
			// Restaurar en localStorage para futuras lecturas rápidas
			if ( token ) {
				localStorage.setItem( TOKEN_KEY, token );
				return token;
			}
		}
	}

	return '';
}
