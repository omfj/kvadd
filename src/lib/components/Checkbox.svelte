<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes;

	let { checked = $bindable(), class: className, ...rest }: Props = $props();
</script>

<input
	type="checkbox"
	bind:checked
	class={cn(
		'focus:ring-accent checked:bg-accent h-4 w-4 appearance-none border border-gray-300 bg-white text-black focus:ring-2 focus:ring-offset-2 focus:outline-none',
		className
	)}
	{...rest}
/>
