<script lang="ts">
	import { page }     from '$app/state';
	import { onMount }  from 'svelte';
	import { goto }     from '$app/navigation';
	import { env }      from '$env/dynamic/public';

    import { createQuery } from '@tanstack/svelte-query';

	import type { ApiUser }     from '$lib/types';
	import WelcomeScreen        from '$lib/components/actions/WelcomeScreen.svelte';
	import SessionExpiredScreen from '$lib/components/actions/SessionExpiredScreen.svelte';
	import RegistrationForm     from '$lib/components/actions/RegistrationForm.svelte';
	import UserSearchForm       from '$lib/components/actions/UserSearchForm.svelte';
    import { LDS_CLASSES }      from '$lib/utils/classes';
    import { ROUTER }           from '$lib/utils/apis';
    import { ERROR_CODE }       from '$lib/utils/errorCodes';
    import connectRequest       from '$lib/services/fetch.service';
    import { METHOD }           from '$lib/services/http-codes';
    import Dialog               from '$lib/components/shared/Dialog.svelte';
    import SurveyForm           from './SurveyForm.svelte';

    // ── Estados de la pantalla ──────────────────────────────────────
	type Screen = 'loading' | 'expired' | 'register' | 'search' | 'welcome';

	// ── Parámetros de URL ───────────────────────────────────────────
	const sessionId : string    = page.params.sessionId ?? '';
	const classSlug : string    = page.url.searchParams.get( 'class' )  ?? '';
    const classes   : string[]  = LDS_CLASSES.map(( c ) => c.slug );

    // ── Estados ──
	let currentScreen   = $state<Screen>( 'loading' );
	let welcomeUser     = $state<{ firstName: string; lastName: string } | null>( null );
	let readyToFetch    = $state<boolean>( false );
    let ulidToken       = $state<string>( '' );
    let surveyOpen      = $state<boolean>( false );

	// ── Svelte Query: Validación de Asistencia Backend ──────────────
	const attendanceQuery = createQuery(() => ({
		queryKey                : [ 'new_key', sessionId, classSlug ],
		enabled                 : readyToFetch,
		retry                   : false,
		refetchOnWindowFocus    : false,
        queryFn                 : () => connectRequest({
            endpoint: ROUTER.INTERNAL.VALIDATE_ASSISTANCE,
            method  : METHOD.POST,
            body    : {
                sessionId,
                ulidToken
            }
        }),

        // !*QUiTAR SOLO DEV
        // staleTime: 0,
        // gcTime: 0,
	}));


    $effect(() => {
		if ( !readyToFetch ) return;

        // ── Éxito: asistencia registrada (201) ───────────────────────────
		if ( attendanceQuery.isSuccess && currentScreen !== 'welcome' ) {
			const data = attendanceQuery.data as any;

            // El 200 devuelve MemberReadDTO { name, last_name }
            // El 201 devuelve AssistanceReadDTO (sin nombre), usamos fingerprint
			welcomeUser = {
                firstName : data?.name      || welcomeUser?.firstName || '',
                lastName  : data?.last_name || welcomeUser?.lastName  || '',
            };

            currentScreen = 'welcome';
		}

        // ── Error: interpretar códigos del backend ───────────────────────
		if ( attendanceQuery.isError && currentScreen !== 'expired' && currentScreen !== 'welcome' ) {
			const err    = attendanceQuery.error as any;
            const code   = err.data.data.detail.code  as string | undefined;
            const status = err.status      as number;

            // ERR_301: encuesta pendiente del tercer domingo
            if ( code === ERROR_CODE.ERR_301 ) {
                surveyOpen = true;
                return;
            }

            // ERR_103: miembro o QR no encontrado → expirado
            if ( status === 404 || code === ERROR_CODE.ERR_103 ) {
                currentScreen = 'expired';
                return;
            }

            // ERR_201: clase no compatible → expirado
            // ERR_202: QR expirado
            // ERR_203: QR futuro
            // ERR_204: fuera de horario
            // ERR_205: formato de hora inválido
            // Cualquier otro 400/500 → expirado
            currentScreen = 'expired';

            alert( err.data.data.detail.message + ' ' + code + ' ' + currentScreen + ' ' + status )
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

		// El backend decide si es tercer domingo y si falta encuesta (ERR_301)
		readyToFetch = true;
	});


    async function handleSurveySubmit( answers: boolean[] ): Promise<void> {
        await connectRequest({
            endpoint : ROUTER.SURVEY.CREATE,
            method   : METHOD.POST,
            body     : {
                member_ulid   : ulidToken,
                qr_session_id : sessionId,
                question1     : answers[ 0 ],
                question2     : answers[ 1 ],
                question3     : answers[ 2 ],
                question4     : answers[ 3 ],
            },
        });

        surveyOpen = false;

        attendanceQuery.refetch();
    }

    // ── Callbacks de componentes ─────────────────────────────────────
    async function doRegister( user: ApiUser ): Promise<void> {
        try {
            welcomeUser     = { firstName: user.firstName, lastName: user.lastName };
			currentScreen   = 'welcome';
		} finally {}
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

<Dialog
    open        = { surveyOpen }
    onClose     = { () => {} }
    persistent
    title       = "Encuesta Ven, Sígueme"
>
    <SurveyForm onSubmit={ handleSurveySubmit } />
</Dialog>
