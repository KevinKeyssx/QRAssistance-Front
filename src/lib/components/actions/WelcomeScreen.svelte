<script lang="ts">
	import { LDS_CLASSES } from '$lib/utils/classes';


	interface Props {
		firstName   : string;
		lastName    : string;
		classSlug   : string;
		sessionDate : string;
	}

    let { firstName, lastName, classSlug, sessionDate }: Props = $props();

	// svelte-ignore state_referenced_locally
    const classLabel = LDS_CLASSES.find( ( c ) => c.slug === classSlug )?.label ?? classSlug;

	// svelte-ignore state_referenced_locally
	const dateFormatted = new Date( sessionDate + 'T12:00:00' ).toLocaleDateString( 'es-ES', {
		weekday : 'long',
		year    : 'numeric',
		month   : 'long',
		day     : 'numeric'
	} );
</script>

<section class="flex flex-col items-center gap-6 animate-slide-up">
	<!-- Checkmark animado -->
	<div class="relative w-28 h-28">
		<div class="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse-soft"></div>
		<div class="absolute inset-2 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
			<svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					d="M5 13l4 4L19 7"
				/>
			</svg>
		</div>
	</div>

	<!-- Bienvenida -->
	<div class="text-center">
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wider">
			Asistencia registrada
		</p>

        <h2 class="text-3xl font-bold text-lds-navy dark:text-lds-gold leading-tight">
			¡Bienvenido,
		</h2>

        <h2 class="text-3xl font-bold text-lds-navy dark:text-lds-gold leading-tight">
			{firstName}!
		</h2>

        <p class="text-gray-600 dark:text-gray-300 text-base mt-1">
			{firstName} {lastName}
		</p>
	</div>

	<!-- Detalles -->
	<div class="w-full space-y-3">
		<div class="flex items-center gap-3 bg-lds-navy/5 dark:bg-lds-gold/10 rounded-xl px-4 py-3">
			<div class="w-8 h-8 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shrink-0">
				<svg class="w-4 h-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
				</svg>
			</div>

            <div>
				<p class="text-xs text-gray-500 dark:text-gray-400">Clase</p>

                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{classLabel}</p>
			</div>
		</div>

		<div class="flex items-center gap-3 bg-lds-navy/5 dark:bg-lds-gold/10 rounded-xl px-4 py-3">
			<div class="w-8 h-8 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shrink-0">
				<svg class="w-4 h-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
				</svg>
			</div>

            <div>
				<p class="text-xs text-gray-500 dark:text-gray-400">Fecha</p>

                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">{dateFormatted}</p>
			</div>
		</div>
	</div>

	<!-- Mensaje inspirador -->
	<p class="text-xs text-center text-gray-400 dark:text-gray-600 italic leading-relaxed">
		"La fe sin obras está muerta." — Santiago 2:17
	</p>
</section>
