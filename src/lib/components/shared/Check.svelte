<script lang="ts">
	import type { Snippet } from 'svelte';

    import CautionIcon      from '$lib/icons/CautionIcon.svelte';
    import CheckIcon        from '$lib/icons/CheckIcon.svelte';


    interface Props {
		id          : string;
		checked     : boolean;
		title       : string;
		error?      : string;
		description : Snippet;
	}

	let {
		id,
		checked = $bindable(),
		title,
		error,
		description
	}: Props = $props();
</script>

<label for={id} class="flex items-start gap-3 cursor-pointer rounded-xl p-4 transition-all duration-200 border-2
	{!checked && !error ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' : ''}
	{checked && !error ? 'bg-lds-navy border-lds-navy dark:bg-lds-gold dark:border-lds-gold' : ''}
	{!checked && error ? 'bg-red-50 dark:bg-red-950/40 border-red-500 dark:border-red-500' : ''}
">
	<div class="mt-0.5 shrink-0">
		<input {id} type="checkbox" bind:checked class="sr-only" />
		<div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
			{checked && !error ? 'bg-white/25 dark:bg-gray-900/25 border-white/60 dark:border-gray-900/60' : ''}
			{!checked && !error ? 'border-lds-navy dark:border-lds-gold' : ''}
			{!checked && error ? 'border-red-500 dark:border-red-400' : ''}
		">
			{#if checked}
                <CheckIcon />
			{/if}
		</div>
	</div>

	<div>
		<p class="text-sm font-semibold leading-tight transition-colors"
			class:text-gray-800={!checked && !error}
			class:dark:text-gray-100={!checked && !error}
			class:text-white={checked && !error}
			class:dark:text-gray-900={checked && !error}
			class:text-red-700={!checked && error}
			class:dark:text-red-400={!checked && error}
		>
			{title}
		</p>

		<div class="text-xs mt-1 leading-relaxed transition-colors flex flex-col gap-1
			{checked && !error ? 'text-white/75 dark:text-gray-900/75' : ''}
			{!checked && !error ? 'text-gray-500 dark:text-gray-400' : ''}
			{!checked && error ? 'text-red-600 dark:text-red-400' : ''}
		">
			{@render description()}
		</div>

		{#if error && !checked}
			<p class="mt-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium">
                <CautionIcon size={16} />

				{error}
			</p>
		{/if}
	</div>
</label>
