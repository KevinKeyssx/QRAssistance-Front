<script lang="ts">
    import { onMount } from 'svelte';

    import favicon                          from '$lib/assets/favicon.svg';
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

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="relative min-h-dvh flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
	<Header {darkMode} onToggle={handleToggle} />

    <main class="flex-1 flex flex-col items-center justify-center">
        {@render children()}
    </main>

    <Footer />
</div>
