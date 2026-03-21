<script lang="ts">
    import { onMount } from 'svelte';

    import confetti from 'canvas-confetti';

    import { LDS_CLASSES }          from '$lib/utils/classes';
    import { formatDate }           from '$lib/utils/tempo';
    import { VERSES_BOOK_MORMON }   from '$lib/utils/versesBookMormon';
    import DateIcon                 from '$lib/icons/DateIcon.svelte';
    import HomeIcon                 from '$lib/icons/HomeIcon.svelte';
    import DoneIcon                 from '$lib/icons/DoneIcon.svelte';


	interface Props {
		firstName   : string;
		lastName    : string;
		classSlug   : string;
		sessionDate : string;
	}


    onMount( animateConfetti );


    let { firstName, lastName, classSlug, sessionDate }: Props = $props();

	// svelte-ignore state_referenced_locally
    const classLabel = LDS_CLASSES.find( ( c ) => c.slug === classSlug )?.label ?? classSlug;


    function animateConfetti() {
        confetti({
            particleCount   : 100,
            spread          : 70,
            origin          : { y: 0.6 }
        });
    }
</script>

<svelte:head>
	<title>Bienvenido · QRAsistencia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="flex flex-col items-center gap-6 animate-slide-up">
	<!-- Checkmark animado -->
	<div class="relative w-22 h-22">
		<div class="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse-soft"></div>
		<div class="absolute inset-2 rounded-full bg-green-500 flex items-center justify-center shadow-lg text-white">
			<DoneIcon />
		</div>
	</div>

	<!-- Bienvenida -->
	<div class="text-center">
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wider">
			Asistencia registrada
		</p>

        <h2 class="text-2xl font-bold text-lds-navy dark:text-lds-gold leading-tight">
			¡Bienvenido,
		</h2>

        <h2 class="text-2xl font-bold text-lds-navy dark:text-lds-gold leading-tight">
			{firstName} {lastName}!
		</h2>
	</div>

	<!-- Detalles -->
	<div class="w-full space-y-3">
		<div class="flex items-center gap-3 bg-lds-navy/5 dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm dark:shadow-xl">
			<div class="w-8 h-8 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shrink-0 text-white">
                <HomeIcon />
			</div>

            <div>
				<p class="text-xs text-gray-500 dark:text-gray-400">Clase</p>

                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{classLabel}</p>
			</div>
		</div>

		<div class="flex items-center gap-3 bg-lds-navy/5 dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm dark:shadow-xl">
			<div class="w-8 h-8 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shrink-0 text-white">
                <DateIcon />
			</div>

            <div>
				<p class="text-xs text-gray-500 dark:text-gray-400">Fecha</p>

                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">{ formatDate( new Date() )}</p>
			</div>
		</div>
	</div>

	<!-- Mensaje inspirador -->
	<p class="text-sm text-center text-gray-400 dark:text-gray-400 italic leading-relaxed">
		"{ VERSES_BOOK_MORMON[ Math.floor( Math.random() * VERSES_BOOK_MORMON.length )]}"
	</p>
</section>
