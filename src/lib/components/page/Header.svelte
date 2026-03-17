<script lang="ts">
    import DarkModeToggle from '$lib/components/page/DarkModeToggle.svelte';

    interface Props {
        darkMode : boolean;
        onToggle : () => void;
    }

    let { darkMode, onToggle }: Props = $props();
</script>

<header class="fixed top-0 w-full p-4 flex justify-end items-center z-50 pointer-events-none shadow-inner border-b border-gray-200 dark:border-gray-600">
    <div class="pointer-events-auto">
        <DarkModeToggle {darkMode} {onToggle} />
    </div>
</header>
