<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';

    import Input            from '$lib/components/shared/Input.svelte';
    import AuraLoader       from '$lib/components/loaders/AuraLoader.svelte';
    import SearchIcon       from '$lib/icons/SearchIcon.svelte';
    import UserIcon         from '$lib/icons/UserIcon.svelte';
    import SadIcon          from '$lib/icons/SadIcon.svelte';
    import RightArrownIcon  from '$lib/icons/RightArrownIcon.svelte';
    import Dialog           from '$lib/components/shared/Dialog.svelte';
    import Check            from '$lib/components/shared/Check.svelte';
	import type { ApiUser } from '$lib/types';


    interface Props {
		onSuccess : ( member: ApiUser ) => void;
	}

    let { onSuccess }: Props = $props();

	let query                    = $state( '' );
	let searchQuery              = $state( '' );
    let showDialog               = $state( false );
    let saveFingerPrint          = $state( false );
    let selectedMemberForConfirm = $state<ApiUser | null>( null );


    const searchQueryOptions = createQuery(() => ({
        queryKey    : ['searchMembers', searchQuery],
        enabled     : searchQuery.trim().length >= 2,
        queryFn     : async () => {
            const encoded   = encodeURIComponent( searchQuery.trim() );
            const res       = await fetch( `/api/search-member?q=${encoded}&page=1&size=20` );
            const data      = await res.json();

            if ( !res.ok ) throw { status: res.status, data };

            return ( data.items || [] ).map(( item: any ) => ({
                id        : item._id,
                firstName : item.name,
                lastName  : item.last_name,
                classes   : item.classes || [],
                ulidToken : item.ulid_token || ''
            }));
        }
    }));


    let results   = $derived( searchQueryOptions.data || [] );
    let searching = $derived( searchQueryOptions.isLoading || searchQueryOptions.isFetching );
    let searched  = $derived( searchQueryOptions.isSuccess && !searching && searchQuery.trim().length >= 2 );


    function handleInput(): void {
        if ( query.trim().length === 0 && searchQuery !== '' ) {
            searchQuery = '';
        }
    }


    function triggerSearch(): void {
        if ( query.trim().length >= 2 ) {
            searchQuery = query.trim();
        }
    }


    function selectMember( member: ApiUser ): void {
		selectedMemberForConfirm    = member;
        showDialog                  = true;
	}


    function confirmSelection() {
        if ( selectedMemberForConfirm ) {
            if ( saveFingerPrint && selectedMemberForConfirm.ulidToken ) {
                sessionStorage.setItem( 'ULID_TOKEN', selectedMemberForConfirm.ulidToken );
            }

            onSuccess( selectedMemberForConfirm );
        }

        showDialog = false;
    }
</script>

<svelte:head>
	<title>Búsqueda · QRAsistencia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

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
    <form
        onsubmit={(e) => { e.preventDefault(); triggerSearch(); }}
        class= "flex gap-1.5"
    >
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
        </Input>

        <button
            type        = "submit"
            disabled    = { searching || query.trim().length < 2 }
            class       = "w-16 flex flex-col items-center justify-center rounded-xl text-white dark:text-gray-900 bg-lds-navy dark:bg-lds-gold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold"
            title       = "Buscar"
        >
            {#if searching}
                <AuraLoader />
            {:else}
                <SearchIcon size={20} />
            {/if}
        </button>
    </form>

	{#if query.trim().length > 0 && query.trim().length < 2 && !searching}
		<p class="text-xs text-red-300 dark:text-red-700 mt-3 text-center fade-in">
			Escribe al menos 2 caracteres para buscar
		</p>
	{/if}

	<!-- ═══ Resultados ════════════════════════════ -->
	<div class="mt-4">
		{#if results.length > 0}
			<div class="space-y-2 fade-in max-h-64 overflow-y-auto">
				{#each results as user ( user.id )}
					<button
						type="button"
						onclick={() => selectMember( user )}
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
								{ user.firstName } { user.lastName }
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

<Dialog
    open        = { showDialog }
    title       = "Confirmar Selección"
    description = "Por favor confirma que eres este miembro de la lista."
    onClose     = { () => showDialog = false }
>
    {#if selectedMemberForConfirm}
        <div class="flex flex-col gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    ¿Confirmas que tu nombre es <span class="font-bold text-gray-900 dark:text-gray-100">{selectedMemberForConfirm.firstName} {selectedMemberForConfirm.lastName}</span>?
                </p>
            </div>

            <!-- ═══ Huella digital ═════════════════════ -->
            <Check
                id              = "fingerprint-consent"
                bind:checked    = { saveFingerPrint }
                title           = "Recordarme en este dispositivo"
            >
                {#snippet description()}
                    <span>Identificación automática en futuras reuniones sin reingresar datos.</span>
                {/snippet}
            </Check>

            <div class="flex items-center gap-3 mt-4">
                <button
                    type    = "button"
                    class   = "flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    onclick = { () => showDialog = false }
                >
                    Cancelar
                </button>

                <button
                    type    = "button"
                    class   = "flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white bg-lds-navy dark:bg-lds-gold hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
                    onclick = { confirmSelection }
                >
                    Confirmar
                </button>
            </div>
        </div>
    {/if}
</Dialog>

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
