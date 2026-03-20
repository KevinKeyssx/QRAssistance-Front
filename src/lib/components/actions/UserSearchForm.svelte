<script lang="ts">
	import Input                    from '$lib/components/shared/Input.svelte';
    import AuraLoader               from '$lib/components/loaders/AuraLoader.svelte';
    import SearchIcon               from '$lib/icons/SearchIcon.svelte';
    import UserIcon                 from '$lib/icons/UserIcon.svelte';
	import { searchUsersByName }    from '$lib/utils/api';
    import SadIcon                  from '$lib/icons/SadIcon.svelte';
    import RightArrownIcon          from '$lib/icons/RightArrownIcon.svelte';
	import type { ApiUser }         from '$lib/types';


    interface Props {
		onSuccess : ( user: ApiUser ) => void;
	}

    let { onSuccess }: Props = $props();


    const users: ApiUser[] = [
        {
            id:'1',
            firstName: 'Juan',
            lastName: 'Perez',
            classes: ['Clase 1', 'Clase 2']
        },
        {
            id: '2',
            firstName: 'Maria',
            lastName: 'Gomez',
            classes: ['Clase 1', 'Clase 2']
        },
        {
            id: '3',
            firstName: 'Pedro',
            lastName: 'Ramirez',
            classes: ['Clase 1', 'Clase 2']
        }
    ];

	let query      = $state( '' );
	let results    = $state<ApiUser[]>( users );
	let searching  = $state( false );
	let searched   = $state( false );
	let debounceId = $state<ReturnType<typeof setTimeout> | null>( null );


    function handleInput() {
		if ( debounceId ) clearTimeout( debounceId );

        if ( query.trim().length < 2 ) {
			results = [];
			searched = false;
			return;
		}

        debounceId = setTimeout( async () => {
			searching = true;
			searched  = false;
			try {
				results  = await searchUsersByName( query.trim() );
				searched = true;
			} finally {
				searching = false;
			}
		}, 400 );
	}

	function selectUser( user: ApiUser ) {
		onSuccess( user );
	}
</script>

<section class="animate-slide-up w-full">
	<!-- ═══ Header ════════════════════════════════ -->
	<div class="text-center mb-8">
		<div class="relative inline-flex mb-4">
			<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-lds-navy dark:bg-lds-gold shadow-lds-navy/30 dark:shadow-lds-gold/20 text-white dark:text-gray-800">
                <SearchIcon size={32} />
			</div>

            <!-- Badge secundario -->
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm text-lds-navy dark:text-lds-gold">
                <UserIcon size={12}/>
			</span>
		</div>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Busca tu nombre</h2>

        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
			Ingresa tu nombre o apellido para encontrarte en la lista.
		</p>
	</div>

	<!-- ═══ Búsqueda ════════════════════════════ -->
	<Input
		id              = "search"
		bind:value      = { query }
		type            = "search"
		placeholder     = "Ej: Juan Pérez"
		autocomplete    = "off"
		showSuccess     = { false }
		oninput         = { handleInput }
	>
		{#snippet icon()}
			<SearchIcon />
		{/snippet}

        {#snippet rightIcon()}
			{#if searching}
                <AuraLoader />
			{/if}
		{/snippet}
	</Input>

	{#if query.trim().length > 0 && query.trim().length < 2 && !searching}
		<p class="text-xs text-red-300 dark:text-red-700 mt-3 text-center fade-in">
			Escribe al menos 2 caracteres para buscar
		</p>
	{/if}

	<!-- ═══ Resultados ════════════════════════════ -->
	<div class="mt-4">
		{#if results.length > 0}
			<div class="space-y-2 fade-in">
				{#each results as user ( user.id )}
					<button
						type="button"
						onclick={() => selectUser( user )}
						class="group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left overflow-hidden border-2 transition-all duration-200
                            bg-white dark:bg-gray-800 
                            border-gray-100 dark:border-gray-700
                            hover:border-lds-navy dark:hover:border-lds-gold hover:shadow-md active:scale-[0.98]"
					>
						<!-- Avatar -->
                        <div class="shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow transition-colors duration-200
                            bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                            group-hover:bg-lds-navy dark:group-hover:bg-lds-gold group-hover:text-white dark:group-hover:text-gray-900"
						>
							{ user.firstName[0]}{user.lastName[0] }
						</div>

						<!-- Datos -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate transition-colors duration-200 group-hover:text-lds-navy dark:group-hover:text-lds-gold">
								{ user.firstName} {user.lastName }
							</p>

                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate flex items-center gap-1.5">
								<span class="w-1.5 h-1.5 rounded-full bg-lds-gold dark:bg-lds-navy opacity-80"></span>
								{ user.classes.length > 0 ? user.classes.join( ', ' ) : 'Sin clases asignadas' }
							</p>
						</div>

						<!-- Flecha indicadora -->
						<div class="shrink-0 transition-transform duration-200 group-hover:translate-x-1 text-gray-300 dark:text-gray-500">
                            <RightArrownIcon />
						</div>
					</button>
				{/each}
			</div>
		{:else if searched && query.trim().length >= 2}
			<div class="py-8 text-center fade-in">
				<span class="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-3 text-gray-400 dark:text-gray-400">
                    <SadIcon size={32} />
				</span>

                <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">No se encontraron resultados</p>

                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
					Intenta buscar de nuevo o vuelve para crear tu perfil.
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.fade-in {
		animation : fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes fadeIn {
		from {
			opacity : 0;
			transform : translateY(4px);
		}
		to {
			opacity : 1;
			transform : translateY(0);
		}
	}
</style>
