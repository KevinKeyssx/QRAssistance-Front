<section class="flex flex-col items-center gap-6 animate-slide-up text-center">
	<!-- Icono QR expirado -->
	<div class="relative w-28 h-28">
		<div class="absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-900/30 animate-pulse-soft"></div>
		<div class="absolute inset-2 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
			<svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
			</svg>
		</div>
	</div>

	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
			Código QR inválido
		</h2>
		<p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
			Este código QR ha expirado o no corresponde a la reunión de hoy. Por favor solicita un nuevo código a tu líder.
		</p>
	</div>

	<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 w-full">
		<p class="text-xs text-amber-700 dark:text-amber-400 font-medium">
			💡 Los códigos QR son válidos únicamente para la fecha de la reunión.
		</p>
	</div>
</section>
