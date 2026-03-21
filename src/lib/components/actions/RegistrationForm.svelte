<script lang="ts">
	import type {
        UserFingerprint,
        ApiUser
    }                           from '$lib/types';
	import Input                from '$lib/components/shared/Input.svelte';
	import Check                from '$lib/components/shared/Check.svelte';
    import AuraLoader           from '$lib/components/loaders/AuraLoader.svelte';
    import UserCircleIcon       from '$lib/icons/UserCircleIcon.svelte';
    import UserIcon             from '$lib/icons/UserIcon.svelte';
    import UserLastName         from '$lib/icons/UserLastNameIcon.svelte';
    import SendIcon             from '$lib/icons/SendIcon.svelte';
    import CautionIcon          from '$lib/icons/CautionIcon.svelte';
	import { createUser }       from '$lib/utils/api';
	import { LDS_CLASSES }      from '$lib/utils/classes';
	import { saveFingerprint }  from '$lib/utils/fingerprint';


	interface Props {
		sessionId   : string;
		classSlug   : string;
		sessionDate : string;
		onSuccess   : ( user: ApiUser ) => void;
	}

    let { sessionId, classSlug, sessionDate, onSuccess }: Props = $props();

	let firstName       = $state( '' );
	let lastName        = $state( '' );
	let selectedClasses = $state<string[]>( [] );
	let saveFingerPrint = $state( false );
	let saveTerms       = $state( false );
	let loading         = $state( false );
	let errors          = $state<Record<string, string>>( {} );


    let compatibleClasses = $derived.by(() => {
		if ( selectedClasses.length === 0 ) return null;

        const firstClass = LDS_CLASSES.find(( c ) => c.slug === selectedClasses[ 0 ] );

        return firstClass ? firstClass.classCompatible : [];
	});


    function toggleClass( slug: string ): void {
		if ( selectedClasses.includes( slug )) {
			selectedClasses = selectedClasses.filter(( s ) => s !== slug );
		} else if ( selectedClasses.length === 0 ) {
			selectedClasses = [ slug ];
		} else if ( selectedClasses.length === 1 ) {
			if ( compatibleClasses !== null && compatibleClasses.includes( slug ) ) {
				selectedClasses = [ ...selectedClasses, slug ];
			}
		}
	}


    function validate(): boolean {
		const newErrors: Record<string, string> = {};

        if ( !firstName.trim() )            newErrors.firstName = 'El nombre es requerido.';
		if ( !lastName.trim() )             newErrors.lastName  = 'Los apellidos son requeridos.';
		if ( selectedClasses.length === 0 ) newErrors.classes   = 'Selecciona al menos una clase.';
        if ( !saveTerms )                   newErrors.terms     = 'Debes aceptar los términos y condiciones.';

        errors = newErrors;

        return Object.keys( newErrors ).length === 0;
	}


    async function handleSubmit( e: Event ): Promise<void> {
		e.preventDefault();

        if ( !validate() ) return;

        loading = true;

        try {
			const user = await createUser({
				firstName : firstName.trim(),
				lastName  : lastName.trim(),
				classes   : selectedClasses
			});

			if ( saveFingerPrint ) {
				const fingerprint: UserFingerprint = {
					id        : user.id,
					firstName : user.firstName,
					lastName  : user.lastName,
					classes   : user.classes
				};

                saveFingerprint( fingerprint );
			}

			onSuccess( user );
		} catch {
			errors = { global: 'Ocurrió un error al registrar. Intenta de nuevo.' };
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Registro · QRAsistencia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="w-full">
	<!-- ═══ Header ════════════════════════════════ -->
	<div class="text-center mb-8">
		<div class="relative inline-flex mb-4">
			<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg form-brand-bg text-white">
				<UserCircleIcon />
			</div>

            <span class="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
				<svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
				</svg>
			</span>
		</div>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Crear tu perfil</h2>

        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
			Solo toma unos segundos. Completa tus datos para registrar tu asistencia.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6" novalidate>
		<!-- ═══ Inputs ════════════════════════════ -->
		<div class="space-y-4">
			<!-- Nombre -->
			<Input
				bind:value      = { firstName }
				id              = "firstName"
				label           = "Nombre(s)"
				placeholder     = "Ej: Juan Carlos"
				autocomplete    = "given-name"
				error           = { errors.firstName }
			>
				{#snippet icon()}
					<UserIcon />
				{/snippet}
			</Input>

			<!-- Apellidos -->
			<Input
				id              = "lastName"
				label           = "Apellidos"
				bind:value      = { lastName }
				placeholder     = "Ej: Pérez García"
				autocomplete    = "family-name"
				error           = { errors.lastName }
			>
				{#snippet icon()}
					<UserLastName />
				{/snippet}
			</Input>
		</div>

		<!-- ═══ Selección de clases ════════════════ -->
		<div>
			<div class="flex items-center justify-between mb-3">
				<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					Clase(s)
				</span>
				<span class="text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-200"
					class:bg-lds-navy={selectedClasses.length > 0}
					class:text-white={selectedClasses.length > 0}
					class:dark:bg-lds-gold={selectedClasses.length > 0}
					class:dark:text-gray-900={selectedClasses.length > 0}
					class:bg-gray-100={selectedClasses.length === 0}
					class:text-gray-400={selectedClasses.length === 0}
					class:dark:bg-gray-700={selectedClasses.length === 0}
					class:dark:text-gray-500={selectedClasses.length === 0}
				>
					{selectedClasses.length}/2
				</span>
			</div>

			<div class="grid grid-cols-2 gap-2">
				{#each LDS_CLASSES as cls ( cls.slug )}
					{@const isSelected = selectedClasses.includes( cls.slug )}
					{@const isDisabled = !isSelected && (
                        selectedClasses.length >= 2 ||
                        ( compatibleClasses !== null && !compatibleClasses.includes( cls.slug ) )
                    )}
					{@const Icon       = cls.icon}
					<button
						type="button"
						onclick={() => toggleClass( cls.slug )}
						disabled={isDisabled}
						class="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                            border-2 transition-all duration-200 overflow-hidden
                            disabled:opacity-30 disabled:pointer-events-none"
						class:bg-lds-navy={isSelected}
						class:border-lds-navy={isSelected}
						class:dark:bg-lds-gold={isSelected}
						class:dark:border-lds-gold={isSelected}
					>
						<!-- Ícono contenedor -->
						<div class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors
							{isSelected ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}"
						>
							{#if Icon}
								<Icon />
							{/if}
						</div>

						<!-- Label -->
						<span class="text-xs font-semibold leading-tight flex-1 transition-colors"
							class:text-gray-700={!isSelected}
							class:dark:text-gray-300={!isSelected}
							class:text-white={isSelected}
							class:dark:text-gray-900={isSelected}
						>
							{cls.label}
						</span>

						<!-- Borde hover para no seleccionados -->
						{#if !isSelected}
							<div class="absolute inset-0 rounded-xl border-2 border-transparent
                                hover:border-lds-navy dark:hover:border-lds-gold
                                transition-colors duration-200 pointer-events-none">
							</div>
						{/if}
					</button>
				{/each}
			</div>

			{#if errors.classes}
				<p class="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <CautionIcon size={16} />

                    { errors.classes }
				</p>
			{/if}
		</div>

        <Check
			id              = "terms-consent"
			bind:checked    = { saveTerms }
			title           = "Declaro que mis datos son reales"
			error           = { errors.terms }
		>
			{#snippet description()}
                <div>
                    <span class="italic">"¡Ay de aquel que miente, porque será empujado al infierno!"</span>
                    <span class="font-semibold">2 Nefi 9:34</span>
                </div>
			{/snippet}
		</Check>

		<!-- ═══ Huella digital ═════════════════════ -->
		<Check
			id              = "fingerprint-consent"
			bind:checked    = { saveFingerPrint }
			title           = "Recordarme en este dispositivo"
		>
			{#snippet description()}
				<span>Identificación automática en futuras reuniones sin reingresar datos.</span>
			{/snippet}
		</Check>

		<!-- Error global -->
		{#if errors.global}
			<div class="rounded-xl px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2">
                <CautionIcon size={16} />

                <p class="text-sm text-red-600 dark:text-red-400">
                    { errors.global }
                </p>
			</div>
		{/if}

		<!-- ═══ Submit ═════════════════════════════ -->
		<button
			type="submit"
			disabled={loading}
			class="w-full py-4 rounded-xl font-bold text-sm text-white dark:text-gray-900
                bg-lds-navy dark:bg-lds-gold shadow-btn-nav
                hover:opacity-90 hover:scale-[1.01]
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-200"
		>
			{#if loading}
				<span class="flex items-center justify-center gap-2">
                    <AuraLoader />

                    Registrando asistencia...
				</span>
			{:else}
				<span class="flex items-center justify-center gap-2 text-white dark:text-gray-800">
                    <SendIcon />

                    Registrar asistencia
				</span>
			{/if}
		</button>
	</form>
</section>

<style>
	.form-brand-bg {
		background-color : var( --color-lds-navy );
	}

	.shadow-btn-nav {
		box-shadow : 0 4px 20px color-mix( in srgb, var( --color-lds-navy ) 40%, transparent );
	}

	:global( .dark ) .form-brand-bg {
		background-color : var( --color-lds-gold );
	}

	:global( .dark ) .shadow-btn-nav {
		box-shadow : 0 4px 20px color-mix( in srgb, var( --color-lds-gold ) 40%, transparent );
	}
</style>
