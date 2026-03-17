import type { ApiUser } from '$lib/types';

// TODO: Reemplazar BASE_URL con la URL real del backend (NestJS / FastAPI)
const BASE_URL = 'https://api.example.com';

/**
 * Registra la asistencia de un usuario en una sesión.
 * TODO: implementar llamada real al backend
 */
export async function registerAttendance(
	sessionId : string,
	userId    : string,
	date      : string,
	classSlug : string
): Promise<{ success: boolean }> {
	console.log( '[API] registerAttendance', { sessionId, userId, date, classSlug } );
	// TODO: fetch(`${BASE_URL}/attendance`, { method: 'POST', body: JSON.stringify(...)})
	return new Promise( ( resolve ) => setTimeout( () => resolve( { success: true } ), 800 ) );
}

/**
 * Registra un nuevo usuario en el sistema.
 * TODO: implementar llamada real al backend
 */
export async function createUser( data: {
	firstName : string;
	lastName  : string;
	classes   : string[];
} ): Promise<ApiUser> {
	console.log( '[API] createUser', data );
	// TODO: fetch(`${BASE_URL}/users`, { method: 'POST', body: JSON.stringify(data) })
	const mockUser: ApiUser = {
		id        : crypto.randomUUID(),
		firstName : data.firstName,
		lastName  : data.lastName,
		classes   : data.classes
	};
	return new Promise( ( resolve ) => setTimeout( () => resolve( mockUser ), 600 ) );
}

/**
 * Busca usuarios por nombre.
 * TODO: reemplazar con llamada real al backend
 */
export async function searchUsersByName( query: string ): Promise<ApiUser[]> {
	console.log( '[API] searchUsersByName', query );
	// TODO: fetch(`${BASE_URL}/users?search=${encodeURIComponent(query)}`)
	const MOCK_USERS: ApiUser[] = [
		{ id: '1', firstName: 'Carlos',    lastName: 'López García',     classes: [ 'quorum-elders' ] },
		{ id: '2', firstName: 'María',     lastName: 'Rodríguez Pérez',  classes: [ 'relief-society' ] },
		{ id: '3', firstName: 'Juan',      lastName: 'Martínez Silva',   classes: [ 'sunday-school' ] },
		{ id: '4', firstName: 'Ana',       lastName: 'González Ruiz',    classes: [ 'young-women' ] },
		{ id: '5', firstName: 'Pedro',     lastName: 'Sánchez Torres',   classes: [ 'aaronic-priesthood' ] },
		{ id: '6', firstName: 'Lucía',     lastName: 'Fernández Castro', classes: [ 'primary' ] }
	];
	const lower = query.toLowerCase();
	const results = MOCK_USERS.filter( ( u ) =>
		`${u.firstName} ${u.lastName}`.toLowerCase().includes( lower )
	);
	return new Promise( ( resolve ) => setTimeout( () => resolve( results ), 400 ) );
}
