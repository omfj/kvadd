<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes;

	let { class: className, children, type = 'button', ...rest }: Props = $props();
</script>

<button
	{type}
	class={cn(
		'bg-accent focus:ring-accent flex w-full items-center justify-center gap-2 px-4 py-2 text-center font-medium text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
