import type { UserFingerprint } from '$lib/types';

const FINGERPRINT_KEY = 'qr_attendance_fingerprint';

export function getFingerprint(): UserFingerprint | null {
	if ( typeof localStorage === 'undefined' ) return null;

    const raw = localStorage.getItem( FINGERPRINT_KEY );

    if ( !raw ) return null;

    try {
		return JSON.parse( raw ) as UserFingerprint;
	} catch {
		return null;
	}
}


export function saveFingerprint( data: UserFingerprint ): void {
	localStorage.setItem( FINGERPRINT_KEY, JSON.stringify( data ) );
}


export function clearFingerprint(): void {
	localStorage.removeItem( FINGERPRINT_KEY );
}


export function hasFingerprint(): boolean {
	return getFingerprint() !== null;
}
