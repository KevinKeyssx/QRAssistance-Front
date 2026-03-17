// Tipos compartidos de la aplicación de asistencia QR

export interface LDSClass {
	slug  : string;
	label : string;
}

export interface UserFingerprint {
	id        : string;
	firstName : string;
	lastName  : string;
	classes   : string[]; // slugs de las clases seleccionadas
}

export interface AttendanceSession {
	sessionId : string;
	classSlug : string;
	date      : string; // YYYY-MM-DD
}

export interface AttendedToday {
	sessionId : string;
	date      : string;
	userId    : string;
}

export interface ApiUser {
	id        : string;
	firstName : string;
	lastName  : string;
	classes   : string[];
}
