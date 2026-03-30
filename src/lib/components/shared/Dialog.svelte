<script lang="ts">
	import { fade, fly }	from 'svelte/transition';
	import type { Snippet }	from 'svelte';


	interface Props {
		open		: boolean;
		title?		: string;
		description?: string;
		onClose		: () => void;
		children	: Snippet;
	}


	let {
		open,
		title,
		description,
		onClose,
		children
	}: Props = $props();


	function handleKeydown( event: KeyboardEvent ) {
		if ( event.key === 'Escape' && open ) {
			onClose();
		}
	}
</script>


<svelte:window onkeydown={ handleKeydown } />


{#if open}
	<!-- Fondo Oscurecido (Backdrop) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class		= "fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
		in:fade		= {{ duration: 200 }}
		out:fade	= {{ duration: 150 }}
		onclick		= { onClose }
	>
		<!-- Panel del Modal Analógico -->
		<div 
			class		= "relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
			onclick		= { ( e ) => e.stopPropagation() }
			in:fly		= {{ y: 20, duration: 300, opacity: 0 }}
			out:fly		= {{ y: 10, duration: 200, opacity: 0 }}
		>
			<!-- Botón Flotante para Cerrar ('X') -->
			<button 
				onclick		= { onClose }
				aria-label	= "Cerrar"
				class		= "absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-lds-navy dark:focus:ring-lds-gold z-10"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Cabecera Estética de Título y Descripción -->
			{#if title || description}
				<div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
					{#if title}
						<h2 class="text-xl font-bold text-gray-900 dark:text-white pr-8">
							{ title }
						</h2>
					{/if}

					{#if description}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{ description }
						</p>
					{/if}
				</div>
			{/if}

			<!-- Contenido Central Inyectado mediante Snippet -->
			<div class="px-6 py-6">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
