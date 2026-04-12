<svelte:head>
	<title>Acceso no autorizado · Asistencia QR</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col items-center justify-center min-h-dvh px-6 bg-lds-light dark:bg-lds-dark">
	<div class="animate-slide-up text-center max-w-sm">
		<!-- Icono de alerta -->
		<div class="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
			<svg class="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
			</svg>
		</div>

		<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
			Acceso no autorizado
		</h1>

		<p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2">
			Esta aplicación está diseñada exclusivamente para <strong>dispositivos móviles</strong>.
		</p>

		<p class="text-gray-400 dark:text-gray-500 text-xs">
			Por favor, escanea el código QR con tu teléfono para continuar.
		</p>

		<!-- Decoración -->
		<div class="mt-10 flex items-center justify-center gap-2 text-xs text-gray-300 dark:text-gray-700">
			<div class="w-16 h-px bg-current"></div>
			<span>Barrio La Cisterna · Asistencia QR</span>
			<div class="w-16 h-px bg-current"></div>
		</div>
	</div>
</main>
