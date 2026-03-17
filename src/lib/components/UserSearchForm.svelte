<script lang="ts">
	import { searchUsersByName } from '$lib/utils/api';
	import type { ApiUser } from '$lib/types';
	import Input from './Input.svelte';

	interface Props {
		onSuccess : ( user: ApiUser ) => void;
	}
	let { onSuccess }: Props = $props();

	let query      = $state( '' );
	let results    = $state<ApiUser[]>( [] );
	let searching  = $state( false );
	let searched   = $state( false );
	let debounceId = $state<ReturnType<typeof setTimeout> | null>( null );

	function handleInput() {
		if ( debounceId ) clearTimeout( debounceId );
		if ( query.trim().length < 2 ) {
			results = [];
			searched = false;
			return;
		}
		debounceId = setTimeout( async () => {
			searching = true;
			searched  = false;
			try {
				results  = await searchUsersByName( query.trim() );
				searched = true;
			} finally {
				searching = false;
			}
		}, 400 );
	}

	function selectUser( user: ApiUser ) {
		onSuccess( user );
	}
</script>

<div class="animate-slide-up w-full">
	<!-- ═══ Header ════════════════════════════════ -->
	<div class="text-center mb-8">
		<div class="relative inline-flex mb-4">
			<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-lds-navy dark:bg-lds-gold shadow-lds-navy/30 dark:shadow-lds-gold/20">
				<svg class="w-8 h-8 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
			</div>
			<!-- Badge secundario -->
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm">
				<svg class="w-3 h-3 text-lds-navy dark:text-lds-gold" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
				</svg>
			</span>
		</div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Busca tu nombre</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
			Ingresa tu nombre o apellido para encontrarte en la lista.
		</p>
	</div>

	<!-- ═══ Búsqueda ════════════════════════════ -->
	<Input
		id="search"
		bind:value={query}
		type="search"
		placeholder="Ej: Juan Pérez"
		autocomplete="off"
		showSuccess={false}
		oninput={handleInput}
	>
		{#snippet icon()}
			<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
			</svg>
		{/snippet}
		{#snippet rightIcon()}
			{#if searching}
				<svg class="w-5 h-5 text-lds-navy dark:text-lds-gold animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
				</svg>
			{/if}
		{/snippet}
	</Input>

	{#if query.trim().length > 0 && query.trim().length < 2 && !searching}
		<p class="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center fade-in">
			Escribe al menos 2 caracteres para buscar
		</p>
	{/if}

	<!-- ═══ Resultados ════════════════════════════ -->
	<div class="mt-4">
		{#if results.length > 0}
			<div class="space-y-2 fade-in">
				{#each results as user ( user.id )}
					<button
						type="button"
						onclick={() => selectUser( user )}
						class="group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left overflow-hidden border-2 transition-all duration-200
							   bg-white dark:bg-gray-800 
							   border-gray-100 dark:border-gray-700
							   hover:border-lds-navy dark:hover:border-lds-gold hover:shadow-md
							   active:scale-[0.98]"
					>
						<!-- Avatar -->
						<div class="shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow transition-colors duration-200
									bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
									group-hover:bg-lds-navy dark:group-hover:bg-lds-gold group-hover:text-white dark:group-hover:text-gray-900"
						>
							{user.firstName[0]}{user.lastName[0]}
						</div>
						
						<!-- Datos -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate transition-colors duration-200 group-hover:text-lds-navy dark:group-hover:text-lds-gold">
								{user.firstName} {user.lastName}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate flex items-center gap-1.5">
								<span class="w-1.5 h-1.5 rounded-full bg-lds-gold dark:bg-lds-navy opacity-80"></span>
								{user.classes.length > 0 ? user.classes.join( ', ' ) : 'Sin clases asignadas'}
							</p>
						</div>

						<!-- Flecha indicadora -->
						<div class="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
							<svg class="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-lds-navy dark:group-hover:text-lds-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
							</svg>
						</div>
					</button>
				{/each}
			</div>
		{:else if searched && query.trim().length >= 2}
			<div class="py-8 text-center fade-in">
				<div class="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
					<svg class="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<p class="text-sm text-gray-700 dark:text-gray-300 font-medium">No se encontraron resultados</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
					Intenta buscar de nuevo o vuelve para crear tu perfil.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.fade-in {
		animation : fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes fadeIn {
		from {
			opacity : 0;
			transform : translateY(4px);
		}
		to {
			opacity : 1;
			transform : translateY(0);
		}
	}
</style>
