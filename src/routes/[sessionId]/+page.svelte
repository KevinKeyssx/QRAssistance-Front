<script lang="ts">
	import { page }     from '$app/state';
	import { onMount }  from 'svelte';
	import { goto }     from '$app/navigation';
	import { env }      from '$env/dynamic/public';

    import { createQuery } from '@tanstack/svelte-query';

	import type { ApiUser }     from '$lib/types';
	import { getFingerprint }   from '$lib/utils/fingerprint';
	import WelcomeScreen        from '$lib/components/actions/WelcomeScreen.svelte';
	import SessionExpiredScreen from '$lib/components/actions/SessionExpiredScreen.svelte';
	import RegistrationForm     from '$lib/components/actions/RegistrationForm.svelte';
	import UserSearchForm       from '$lib/components/actions/UserSearchForm.svelte';
    import { LDS_CLASSES }      from '$lib/utils/classes';

    // ── Estados de la pantalla ──────────────────────────────────────
	type Screen = 'loading' | 'expired' | 'register' | 'search' | 'welcome';

	// ── Parámetros de URL ───────────────────────────────────────────
	const sessionId : string    = page.params.sessionId ?? '';
	const classSlug : string    = page.url.searchParams.get( 'class' )  ?? '';
    const classes   : string[]  = LDS_CLASSES.map(( c ) => c.slug );

    // ── Estados ── 
	let currentScreen   = $state<Screen>( 'loading' );
	let welcomeUser     = $state<{ firstName: string; lastName: string } | null>( null );
	// let registering     = $state( false );
	let readyToFetch    = $state<boolean>( false );
    let ulidToken       = $state<string>( '' );

	// ── Svelte Query: Validación de Asistencia Backend ──────────────
	const attendanceQuery = createQuery(() => ({
		queryKey                : ['kwedfasdfsdfda', sessionId, classSlug ],
		enabled                 : readyToFetch,
		retry                   : false,
		refetchOnWindowFocus    : false,
		queryFn                 : async () => {
			const response = await fetch( '/api/validate-assistance', {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify({
                    sessionId,
                    ulidToken
                })
			});

            let data;

            const text = await response.text();

            try {
                data = text ? JSON.parse( text ) : {};
            } catch {
                data = { message: text };
            }

			if ( !response.ok ) {
				throw { status: response.status, data };
			}

            return data;
		},
	}));


    $effect(() => {
		if ( !readyToFetch ) return;

		if ( attendanceQuery.isSuccess && currentScreen !== 'welcome' ) {
			const fp = getFingerprint();

            welcomeUser = fp
				? { firstName: fp.firstName, lastName: fp.lastName }
				: welcomeUser || { firstName: 'Herman@', lastName: '' };
			currentScreen = 'welcome';
		}

		if ( attendanceQuery.isError && currentScreen !== 'expired' && currentScreen !== 'welcome' ) {
			const err = attendanceQuery.error as any;

			if ( err.status === 404 ) {
				// Miembro o QR no encontrado
				currentScreen = 'expired';
			} else if ( err.status === 400 ) {
				const msgStr = typeof err.data?.message === 'string'
					? err.data.message
					: JSON.stringify( err.data || '' );

				if ( msgStr.includes( 'Ya registraste asistencia' )) {
					const fp = getFingerprint();

                    welcomeUser = fp
						? { firstName: fp.firstName, lastName: fp.lastName }
						: welcomeUser || { firstName: 'Herman@', lastName: '' };

                    currentScreen = 'welcome';
				} else {
					currentScreen = 'expired';
				}
			} else {
				currentScreen = 'expired';
			}
		}
	});

	// ── Montaje ─────────────────────────────────────────────────────
	onMount( () => {
		const checkMobile = env.PUBLIC_CHECK_MOBILE === 'true';
		const isMobile    = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

        if ( checkMobile && !isMobile ) {
			goto( '/unauthorized' );

            return;
		}

		if ( !sessionId || !classSlug || !classes.includes( classSlug )) {
			currentScreen = 'expired';

            return;
		}

        ulidToken = sessionStorage.getItem( 'ULID_TOKEN' ) ?? '';

		if ( !ulidToken ) {
			const prevRegistered = sessionStorage.getItem( `prev_registered` );
			currentScreen = prevRegistered ? 'search' : 'register';

            return;
		}

		readyToFetch = true;
	});

	// ── Callbacks de componentes (Temporalmente Mantenidos) ─────────
    async function doRegister( user: ApiUser ): Promise<void> {
		// registering = true;

        try {
			// (Implementación real pendiente)
            welcomeUser     = { firstName: user.firstName, lastName: user.lastName };
			currentScreen   = 'welcome';
		} finally {
			// registering = false;
		}
	}


    async function handleRegistered( user: ApiUser ): Promise<void> {
		sessionStorage.setItem( 'prev_registered', '1' );
		await doRegister( user );
	}


    async function handleSearchSelected( user: ApiUser ): Promise<void> {
		ulidToken     = user.ulidToken;
        welcomeUser   = { firstName: user.firstName, lastName: user.lastName };
        currentScreen = 'loading';
        readyToFetch  = true;

        setTimeout(() => {
            attendanceQuery.refetch();
        }, 50);
	}
</script>

<svelte:head>
	<title>QRAsistencia · Barrio La Cisterna</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col items-center justify-center w-full px-5 py-10 mt-16">
	<!-- Logo pequeño fijo arriba -->
	<div class="mb-6 flex items-center gap-2 animate-fade-in">
        <img src="/logo.avif" alt="logo" class="h-6 object-contain" />

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
				onSuccess        = { handleRegistered }
				onSwitchToSearch = { () => currentScreen = 'search' }
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
