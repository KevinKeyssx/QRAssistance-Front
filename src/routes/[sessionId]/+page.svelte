<script lang="ts">
	import { page }     from '$app/state';
	import { onMount }  from 'svelte';
	import { goto }     from '$app/navigation';
	import { env }      from '$env/dynamic/public';

	import type { ApiUser }         from '$lib/types';
	import { getFingerprint }       from '$lib/utils/fingerprint';
	import { registerAttendance }   from '$lib/utils/api';
	import WelcomeScreen            from '$lib/components/actions/WelcomeScreen.svelte';
	import SessionExpiredScreen     from '$lib/components/actions/SessionExpiredScreen.svelte';
	import RegistrationForm         from '$lib/components/actions/RegistrationForm.svelte';
	import UserSearchForm           from '$lib/components/actions/UserSearchForm.svelte';
    import QRIcon                   from '$lib/icons/QRIcon.svelte';

	// ── Parámetros de URL ───────────────────────────────────────────
	const sessionId : string = page.params.sessionId ?? '';
	// const urlDate   : string = page.url.searchParams.get( 'date' )   ?? '';
	const classSlug : string = page.url.searchParams.get( 'class' )  ?? '';

	// ── Estados de la pantalla ──────────────────────────────────────
	type Screen = 'loading' | 'expired' | 'register' | 'search' | 'welcome';

	let currentScreen  = $state<Screen>( 'loading' );
	let welcomeUser    = $state<{ firstName: string; lastName: string } | null>( null );
	let registering    = $state( false );

	// Clave única para saber si ya registró asistencia hoy en esta sesión
	// const attendanceKey = `att:${sessionId}:${urlDate}`;
	const attendanceKey = `att:${sessionId}`;

	// ── Utilidades ──────────────────────────────────────────────────
	function getTodayDate(): string {
		const now = new Date();
		const y   = now.getFullYear();
		const m   = String( now.getMonth() + 1 ).padStart( 2, '0' );
		const d   = String( now.getDate() ).padStart( 2, '0' );

        return `${y}-${m}-${d}`;
	}


    // function isValidDate(): boolean {
    //     const date = getTodayDate();
    //     console.log('🚀 ~ isValidDate ~ date:', date)
	// 	return urlDate === getTodayDate();
	// }


    async function doRegister( user: ApiUser ) {
		registering = true;

        try {
			// await registerAttendance( sessionId, user.id, urlDate, classSlug );

            sessionStorage.setItem( attendanceKey, user.id );

            welcomeUser     = { firstName: user.firstName, lastName: user.lastName };
			currentScreen   = 'welcome';
		} finally {
			registering = false;
		}
	}

	// ── Montaje ─────────────────────────────────────────────────────
	onMount( async () => {
		// 1. Guard de móvil
		const checkMobile = env.PUBLIC_CHECK_MOBILE === 'true';
		const isMobile    = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

        if ( checkMobile && !isMobile ) {
			goto( '/unauthorized' );
			return;
		}

		// 2. Validar fecha del QR
        // isValidDate()
		// if ( !isValidDate() || !sessionId || !classSlug ) {
		if ( !sessionId || !classSlug ) {
			currentScreen = 'expired';
			return;
		}

		// 3. ¿Ya registró asistencia hoy en esta sesión? (recarga)
		const existingUserId = sessionStorage.getItem( attendanceKey );

        if ( existingUserId ) {
			const fingerprint = getFingerprint();

            welcomeUser = fingerprint
				? { firstName: fingerprint.firstName, lastName: fingerprint.lastName }
				: { firstName: 'Hermano/a', lastName: '' };

            currentScreen = 'welcome';

            return;
		}

		// 4. ¿Tiene huella digital guardada?
		const fingerprint = getFingerprint();

        if ( fingerprint ) {
			// Auto-registro con la huella
			await doRegister( {
				id        : fingerprint.id,
				firstName : fingerprint.firstName,
				lastName  : fingerprint.lastName,
				classes   : fingerprint.classes
			} );
			return;
		}

		// 5. Sin huella → mostrar registro o búsqueda
		// Revisamos sessionStorage para saber si ya estuvo en este flujo antes
		// (y rechazó guardar huella, para no mostrar el formulario sino la búsqueda)
		const prevRegistered = sessionStorage.getItem( `prev_registered` );

        currentScreen = prevRegistered ? 'search' : 'register';
	} );

	// ── Callbacks de componentes ─────────────────────────────────────

	// Después del formulario de registro (nuevo usuario)
	async function handleRegistered( user: ApiUser ) {
		sessionStorage.setItem( 'prev_registered', '1' );
		await doRegister( user );
	}

	// Después de buscar y seleccionar un usuario existente
	async function handleSearchSelected( user: ApiUser ) {
		await doRegister( user );
	}
</script>

<svelte:head>
	<title>QRAsistencia · Barrio La Cisterna</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col items-center justify-center w-full px-5 py-10 mt-16 sm:mt-8">
	<!-- Logo pequeño fijo arriba -->
	<div class="mb-6 flex items-center gap-2 animate-fade-in">
		<div class="w-8 h-8 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shadow text-white">
			<QRIcon />
		</div>

        <span class="text-xs font-semibold text-lds-navy dark:text-lds-gold tracking-wide uppercase">
			QR Asistencia
		</span>
	</div>

	<!-- Card contenedor principal -->
	<div class="card w-full max-w-sm animate-fade-in">
		{#if currentScreen === 'loading'}
			<!-- Spinner de carga inicial -->
			<div class="flex flex-col items-center gap-4 py-10">
				<div class="w-12 h-12 rounded-full border-4 border-lds-navy/20 dark:border-lds-gold/20 border-t-lds-navy dark:border-t-lds-gold animate-spin"></div>

                <p class="text-sm text-gray-400 dark:text-gray-500">Verificando sesión...</p>
			</div>

		{:else if currentScreen === 'expired'}
			<SessionExpiredScreen />

		{:else if currentScreen === 'register'}
			<RegistrationForm
				// sessionId   = { sessionId }
				// classSlug   = { classSlug }
				// sessionDate = { urlDate }
				onSuccess   = { handleRegistered }
			/>

		{:else if currentScreen === 'search'}
			<UserSearchForm onSuccess={ handleSearchSelected } />

		{:else if currentScreen === 'welcome' && welcomeUser}
			<WelcomeScreen
				firstName   = { welcomeUser.firstName }
				lastName    = { welcomeUser.lastName }
				classSlug   = { classSlug }
				// sessionDate = { urlDate }
			/>
		{/if}
	</div>
</main>
