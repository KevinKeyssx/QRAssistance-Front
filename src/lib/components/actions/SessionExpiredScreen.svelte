<script lang="ts">
    import WarningIcon          from '$lib/icons/WarningIcon.svelte';
    import { ERROR_CODE }       from '$lib/utils/errorCodes';
    import type { ErrorCode }   from '$lib/utils/errorCodes';


    interface Props {
		errorCode ?: ErrorCode;
	}


    let { errorCode } : Props = $props();


    let errorDetail = $derived.by(() => {
        switch ( errorCode ) {
            case ERROR_CODE.ERR_201:
                return {
                    title   : 'Clase no compatible',
                    message : 'No perteneces a esta clase. Por favor verifica con tu líder si estás en el grupo correcto.'
                };
            case ERROR_CODE.ERR_202:
                return {
                    title   : 'Código QR expirado',
                    message : 'Este código QR ha expirado. Por favor, solicita uno nuevo a tu líder para registrar tu asistencia.'
                };
            case ERROR_CODE.ERR_203:
                return {
                    title   : 'Fecha incorrecta',
                    message : 'Este código QR es para una reunión futura. Aún no puedes registrar tu asistencia para esta sesión.'
                };
            case ERROR_CODE.ERR_204:
                return {
                    title   : 'Fuera de horario',
                    message : 'Te encuentras fuera del rango horario permitido para registrar asistencia en esta reunión.'
                };
            case ERROR_CODE.ERR_206:
                return {
                    title   : 'Registro con observaciones',
                    message : 'Te registramos con éxito, pero hubo un problema al marcar tu asistencia. ¡No te preocupes! Por favor informa a tu secretario.'
                };
            case ERROR_CODE.ERR_103:
                return {
                    title   : 'Sesión no encontrada',
                    message : 'No pudimos encontrar la sesión o el miembro solicitado. Verifica que el código sea el correcto.'
                };
            default:
                return {
                    title   : 'Código QR inválido',
                    message : 'Este código QR ha expirado o no corresponde a esta reunión. Por favor solicita uno nuevo a tu líder.'
                };
        }
    });
</script>

<svelte:head>
	<title>{ errorDetail.title } · QRAsistencia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="flex flex-col items-center gap-6 animate-slide-up text-center">
	<!-- Icono QR expirado -->
	<div class="relative w-28 h-28">
		<div class="absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-900/30 animate-pulse-soft"></div>
		<div class="absolute inset-2 rounded-full bg-amber-500 flex items-center justify-center shadow-lg text-white">
			<WarningIcon size={ 48 } />
		</div>
	</div>

	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
			{ errorDetail.title }
		</h2>
		<p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
            { errorDetail.message }
		</p>
	</div>

	<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 w-full">
		<p class="text-xs text-amber-700 dark:text-amber-400 font-medium">
			💡 Los códigos QR son válidos únicamente para la fecha de la reunión.
		</p>
	</div>
</section>
