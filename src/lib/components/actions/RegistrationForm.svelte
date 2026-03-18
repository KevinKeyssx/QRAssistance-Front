<script lang="ts">
	import { LDS_CLASSES }     from '$lib/utils/classes';
	import { createUser }      from '$lib/utils/api';
	import { saveFingerprint } from '$lib/utils/fingerprint';
	import type { UserFingerprint, ApiUser } from '$lib/types';
	import Input from '../shared/Input.svelte';

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

	const CLASS_ICONS: Record<string, string> = {
		'quorum-elders'      : 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
		'relief-society'     : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		'sunday-school'      : 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
		'young-men'          : 'M13 10V3L4 14h7v7l9-11h-7z',
		'young-women'        : 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
		'primary'            : 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		'high-priests'       : 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
		'aaronic-priesthood' : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
		'sacrament-meeting'  : 'M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9',
		'nursery'            : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		'seminary'           : 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m2 0h2',
		'institute'          : 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
	};


    function toggleClass( slug: string ) {
		if ( selectedClasses.includes( slug ) ) {
			selectedClasses = selectedClasses.filter( ( s ) => s !== slug );
		} else if ( selectedClasses.length < 2 ) {
			selectedClasses = [ ...selectedClasses, slug ];
		}
	}


    function validate(): boolean {
		const newErrors: Record<string, string> = {};

        if ( !firstName.trim() ) newErrors.firstName = 'El nombre es requerido.';
		if ( !lastName.trim() ) newErrors.lastName = 'Los apellidos son requeridos.';
		if ( selectedClasses.length === 0 ) newErrors.classes = 'Selecciona al menos una clase.';

        errors = newErrors;

        return Object.keys( newErrors ).length === 0;
	}


    async function handleSubmit( e: Event ) {
		e.preventDefault();
		if ( !validate() ) return;
		loading = true;
		try {
			const user = await createUser( {
				firstName : firstName.trim(),
				lastName  : lastName.trim(),
				classes   : selectedClasses
			} );

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

<section class="w-full">
	<!-- ═══ Header ════════════════════════════════ -->
	<div class="text-center mb-8">
		<div class="relative inline-flex mb-4">
			<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg form-brand-bg">
				<svg class="w-8 h-8 form-brand-icon-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
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
				id="firstName"
				label="Nombre(s)"
				bind:value={firstName}
				placeholder="Ej: Juan Carlos"
				autocomplete="given-name"
				error={errors.firstName}
			>
				{#snippet icon()}
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
					</svg>
				{/snippet}
			</Input>

			<!-- Apellidos -->
			<Input
				id="lastName"
				label="Apellidos"
				bind:value={lastName}
				placeholder="Ej: Pérez García"
				autocomplete="family-name"
				error={errors.lastName}
			>
				{#snippet icon()}
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
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
					{@const isDisabled = !isSelected && selectedClasses.length >= 2}
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
							{isSelected ? 'bg-white/20 dark:bg-gray-900/20' : 'bg-gray-100 dark:bg-gray-700'}"
						>
							<svg class="w-3.5 h-3.5 transition-colors"
								class:text-gray-500={!isSelected}
								class:dark:text-gray-400={!isSelected}
								class:text-white={isSelected}
								class:dark:text-gray-900={isSelected}
								fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={CLASS_ICONS[ cls.slug ] ?? 'M12 4v16m8-8H4'}/>
							</svg>
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

						<!-- Check -->
						{#if isSelected}
							<svg class="w-3.5 h-3.5 shrink-0 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
						{/if}

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
					<svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
					</svg>
					{errors.classes}
				</p>
			{/if}
		</div>


        <label for="terms-consent" class="flex items-start gap-3 cursor-pointer rounded-xl p-4 transition-all duration-200 border-2"
			class:bg-gray-50={!saveTerms}
			class:dark:bg-gray-800={!saveTerms}
			class:border-gray-200={!saveTerms}
			class:dark:border-gray-600={!saveTerms}
			class:bg-lds-navy={saveTerms}
			class:border-lds-navy={saveTerms}
			class:dark:bg-lds-gold={saveTerms}
			class:dark:border-lds-gold={saveTerms}
		>
			<!-- Checkbox visual -->
			<div class="mt-0.5 shrink-0">
				<input id="terms-consent" type="checkbox" bind:checked={saveTerms} class="sr-only"/>
				<div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
					{saveTerms ? 'bg-white/25 dark:bg-gray-900/25 border-white/60 dark:border-gray-900/60' : 'border-lds-navy dark:border-lds-gold'}"
				>
					{#if saveTerms}
						<svg class="w-3 h-3 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
					{/if}
				</div>
			</div>

			<div>
				<p class="text-sm font-semibold leading-tight transition-colors"
					class:text-gray-800={!saveTerms}
					class:dark:text-gray-100={!saveTerms}
					class:text-white={saveTerms}
					class:dark:text-gray-900={saveTerms}
				>
					Declaro que mis datos son reales
				</p>
				<p class="text-xs mt-1 leading-relaxed transition-colors italic
					{saveTerms ? 'text-white/75 dark:text-gray-900/75' : 'text-gray-500 dark:text-gray-400'}"
				>
					"¡Ay de aquel que miente, porque será empujado al infierno!"
                    <span class="text-xs mt-1 leading-relaxed transition-colors font-semibold
					{saveTerms ? 'text-white/75 dark:text-gray-900/75' : 'text-gray-500 dark:text-gray-400'}"
					>2 Nefi 9:34</span>
				</p>
			</div>
		</label>

		<!-- ═══ Huella digital ═════════════════════ -->
		<label for="fingerprint-consent" class="flex items-start gap-3 cursor-pointer rounded-xl p-4 transition-all duration-200 border-2"
			class:bg-gray-50={!saveFingerPrint}
			class:dark:bg-gray-800={!saveFingerPrint}
			class:border-gray-200={!saveFingerPrint}
			class:dark:border-gray-600={!saveFingerPrint}
			class:bg-lds-navy={saveFingerPrint}
			class:border-lds-navy={saveFingerPrint}
			class:dark:bg-lds-gold={saveFingerPrint}
			class:dark:border-lds-gold={saveFingerPrint}
		>
			<!-- Checkbox visual -->
			<div class="mt-0.5 shrink-0">
				<input id="fingerprint-consent" type="checkbox" bind:checked={saveFingerPrint} class="sr-only"/>
				<div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
					{saveFingerPrint ? 'bg-white/25 dark:bg-gray-900/25 border-white/60 dark:border-gray-900/60' : 'border-lds-navy dark:border-lds-gold'}"
				>
					{#if saveFingerPrint}
						<svg class="w-3 h-3 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
					{/if}
				</div>
			</div>

			<div>
				<p class="text-sm font-semibold leading-tight transition-colors"
					class:text-gray-800={!saveFingerPrint}
					class:dark:text-gray-100={!saveFingerPrint}
					class:text-white={saveFingerPrint}
					class:dark:text-gray-900={saveFingerPrint}
				>
					Recordar mis datos en este dispositivo
				</p>
				<p class="text-xs mt-1 leading-relaxed transition-colors
					{saveFingerPrint ? 'text-white/75 dark:text-gray-900/75' : 'text-gray-500 dark:text-gray-400'}"
				>
					Identificación automática en futuras reuniones sin reingresar datos.
				</p>
			</div>
		</label>

		<!-- Error global -->
		{#if errors.global}
			<div class="rounded-xl px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2">
				<svg class="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
				</svg>
				<p class="text-sm text-red-600 dark:text-red-400">{errors.global}</p>
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
					<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
					</svg>
					Registrando asistencia...
				</span>
			{:else}
				<span class="flex items-center justify-center gap-2">
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
					</svg>
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

	.form-brand-icon-color {
		color : white;
	}

	.shadow-btn-nav {
		box-shadow : 0 4px 20px color-mix( in srgb, var( --color-lds-navy ) 40%, transparent );
	}

	:global( .dark ) .form-brand-bg {
		background-color : var( --color-lds-gold );
	}

	:global( .dark ) .form-brand-icon-color {
		color : #111827;
	}

	:global( .dark ) .shadow-btn-nav {
		box-shadow : 0 4px 20px color-mix( in srgb, var( --color-lds-gold ) 40%, transparent );
	}
</style>
