<script lang="ts">
	import DarkModeToggle from '$lib/components/page/DarkModeToggle.svelte';

	interface Props {
		darkMode	: boolean;
		onToggle	: ( ) => void;
	}

	let { darkMode, onToggle } : Props = $props( );
</script>

<header class="fixed top-0 w-full h-18 bg-white flex justify-between items-center z-50 border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors pointer-events-none">
	<div class="h-full flex items-center pointer-events-auto shrink-0 relative">
		<a href="/" class="flex h-full items-center no-underline relative group">
			<!-- Se usa el archivo original como máscara CSS. Esto conserva la resolución y aspecto de la <img> original pero te permite teñirlo de los colores de layout.css dinámicamente -->
			<div class="ml-[-24px] sm:ml-[-12px] absolute top-0 left-0 h-full w-64 object-fill pointer-events-none z-0 bg-lds-navy dark:bg-lds-gold transition-colors" 
				style="mask-image: url('/blueRays.svg'); mask-size: 100% 100%; -webkit-mask-image: url('/blueRays.svg'); -webkit-mask-size: 100% 100%; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;">
			</div>

			<!-- Logo posicionado usando absolute -->
			<div class="absolute top-0 left-0 h-full flex items-center shrink-0 z-10 pointer-events-none bg-lds-navy dark:bg-lds-gold min-w-4/5 transition-colors ">
                <img src="/logo.avif" alt="logo" class="h-[45%] object-contain ml-5 bg-white p-1 rounded-md shadow-sm" />
			</div>

			<div class="w-20 shrink-0 relative z-10"></div>
		</a>

        <div class="ml-9 sm:ml-12 flex flex-col justify-center relative z-50">
            <span class="uppercase text-gray-800 dark:text-gray-300 font-medium tracking-wider" style="font-size: 10px; line-height: 1.2;">Barrio</span>
            <span class="font-serif uppercase text-lds-navy dark:text-lds-gold font-semibold tracking-wider" style="font-size: 21px; line-height: 1.1;">La Cisterna</span>
        </div>
	</div>

	<!-- Selector de idioma y DarkModeToggle a la derecha -->
	<div class="flex items-center gap-4 pr-4 sm:pr-6 pointer-events-auto shrink-0">
		<DarkModeToggle darkMode={ darkMode } onToggle={ onToggle } />
	</div>
</header>
