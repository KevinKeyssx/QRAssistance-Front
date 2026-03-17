<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	onMount( () => {
		const checkMobile = env.PUBLIC_CHECK_MOBILE === 'true';
		console.log( '🚀 ~ checkMobile:', checkMobile );
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
		if ( checkMobile && !isMobile ) {
			goto( '/unauthorized' );
		}
	} );
</script>

<main class="flex flex-col items-center justify-center min-h-dvh px-6">
	<div class="animate-fade-in text-center">
		<!-- Logo ISUD -->
		<div class="mb-8 flex flex-col items-center">
			<div class="w-20 h-20 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shadow-lg mb-4">
				<svg class="w-10 h-10 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-lds-navy dark:text-lds-gold">
				Asistencia QR
			</h1>
			<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
				La Iglesia de Jesucristo de los Santos de los Últimos Días
			</p>
		</div>

		<p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
			Escanea el código QR de tu reunión o ingresa el enlace proporcionado por tu líder para registrar tu asistencia.
		</p>
	</div>
</main>
