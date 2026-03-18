<script lang="ts">
    import { onMount } from 'svelte';

	import { initDarkMode, setDarkMode }    from '$lib/utils/darkMode';
    import Header                           from '$lib/components/page/Header.svelte';
    import Footer                           from '$lib/components/page/Footer.svelte';

    import './layout.css';

	let { children } = $props();

    let darkMode = $state( false );


    onMount( () => {
		darkMode = initDarkMode();
	});


    function handleToggle() {
		darkMode = !darkMode;
		setDarkMode( darkMode );
	}
</script>

<svelte:head><link rel="icon" href="/favicon.ico" type="image/x-icon" /></svelte:head>

<div class="relative min-h-dvh flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
	<img
        src     = "/fullLightRays.png"
        alt     = "background"
        class   = "fixed top-0 left-0 w-full h-full object-cover object-center pointer-events-none opacity-40 dark:opacity-10 select-none z-0"
    />

	<div class="relative z-10 flex flex-col min-h-dvh">
		<Header {darkMode} onToggle={handleToggle} />

		<main class="flex-1 flex flex-col items-center justify-center">
			{@render children()}
		</main>

		<Footer />
	</div>
</div>
