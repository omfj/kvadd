<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes;

	let { value = $bindable(), class: className, ...rest }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'focus:ring-accent w-full border border-gray-300 bg-white focus:ring-2 focus:ring-offset-2 focus:outline-none',
		className
	)}
	{...rest}
/>
