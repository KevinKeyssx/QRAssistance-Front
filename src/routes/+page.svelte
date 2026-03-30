<script lang="ts">
	import { goto }     from '$app/navigation';
	import { onMount }  from 'svelte';
	import { env }      from '$env/dynamic/public';

    import QRIcon from '$lib/icons/QRIcon.svelte';


    onMount( () => {
		const checkMobile   = env.PUBLIC_CHECK_MOBILE === 'true';
		const isMobile      = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );

        if ( checkMobile && !isMobile ) goto( '/unauthorized' );
	});
</script>

<svelte:head>
	<title>Asistencia QR · QRAsistencia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col items-center justify-center">
	<div class="animate-fade-in text-center">
		<div class="flex flex-col items-center space-y-8">
            <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-full bg-lds-navy dark:bg-lds-gold flex items-center justify-center shadow-lg text-white">
                    <!-- <QRIcon size={30}/> -->
                    <img src="/logo.avif" alt="logo" class="h-[60%] object-contain bg-white p-1 rounded-md shadow-sm" />
                </div>

                <h1 class="text-2xl font-bold text-lds-navy dark:text-lds-gold">
                    Asistencia QR
                </h1>
            </div>

            <img src="/logo.avif" alt="logo" class="h-36 object-contain" />

            <p class="text-sm text-gray-500 dark:text-gray-400">
				La Iglesia de Jesucristo de los Santos de los Últimos Días
			</p>

            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                Escanea el código QR de tu reunión o ingresa el enlace proporcionado por tu líder para registrar tu asistencia.
            </p>
        </div>
	</div>
</main>
