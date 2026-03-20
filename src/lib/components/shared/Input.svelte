<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        id             : string;
        label?         : string; // The text label above the input
        value          : string; // Binds to the value
        type?          : 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
        placeholder?   : string;
        autocomplete?  : string | any;
        error?         : string;
        disabled?      : boolean;
        showSuccess?   : boolean; // Show green checkmark if value is present and no error
        icon?          : Snippet; // Content to put in the left icon slot
        rightIcon?     : Snippet; // Content to put in the right icon slot (like a clear button or loading spinner)
        oninput?       : ( e: Event ) => void;
    }

    let {
        id,
        label,
        value       = $bindable(),
        type        = 'text',
        placeholder,
        autocomplete,
        error,
        disabled,
        showSuccess = true,  // Default to true to match RegistrationForm behavior
        icon,
        rightIcon,
        oninput
    }: Props = $props();
</script>

<div class="group w-full">
    {#if label}
        <label for={id} class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            {label}
        </label>
    {/if}
    <div class="relative">
        {#if icon}
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span class="flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-lds-navy dark:group-focus-within:text-lds-gold">
                    {@render icon()}
                </span>
            </div>
        {/if}

        <input
            {id}
            {type}
            bind:value
            {placeholder}
            {autocomplete}
            {disabled}
            {oninput}
            class="w-full py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200
                bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                border-2 border-gray-200 dark:border-gray-600
                focus:border-lds-navy dark:focus:border-lds-gold"
            class:pl-10={!!icon}
            class:pl-4={!icon}
            class:pr-10={!!rightIcon || (showSuccess && value && !error)}
            class:pr-4={!(!!rightIcon || (showSuccess && value && !error))}
            class:border-red-400={!!error}
            class:dark:border-red-500={!!error}
        />

        {#if rightIcon}
            <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                {@render rightIcon()}
            </div>
        {:else if showSuccess && value && !error}
            <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none fade-in">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
            </div>
        {/if}
    </div>

    {#if error}
        <p class="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 fade-in">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {error}
        </p>
    {/if}
</div>

<style>
    .fade-in {
        animation : fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity : 0;
            transform : translateY(-2px);
        }
        to {
            opacity : 1;
            transform : translateY(0);
        }
    }
</style>
