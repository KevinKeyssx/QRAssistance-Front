<script lang="ts">
    import PowerButton from "./PowerButton.svelte";
	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full mt-auto relative border-t border-gray-200 dark:border-gray-800 bg-transparent py-5 px-4 shrink-0 transition-colors">
	<div class="relative z-10 flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center space-y-0.5">
		<!-- Enlace oficial amplio y fácil de tocar (Mobile Friendly) -->
		<a 
			href="https://www.churchofjesuschrist.org/?lang=spa" 
			target="_blank" 
			rel="noopener noreferrer"
			class="text-lds-navy dark:text-lds-gold font-semibold text-[13px] sm:text-sm leading-snug hover:opacity-80 transition-opacity px-2 py-1"
		>
			Web oficial de la iglesia
		</a>

		<!-- Información de App y Versión -->
		<div class="flex flex-col space-y-1.5">
			<span class="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
				&copy; {currentYear} QRAssistance &bull; Barrio La Cisterna
			</span>

            <!-- <span class="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest mt-1">
				VERSIÓN 0.0.1
			</span> -->

            <p class="text-sm dark:text-lds-gold text-lds-navy">
                Desarrollado por:
            </p>

            <div class="flex justify-center">
                <PowerButton />
            </div>
        </div>
	</div>
</footer>
