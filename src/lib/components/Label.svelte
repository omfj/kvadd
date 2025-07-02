<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes;

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('mb-1 block text-sm font-medium text-gray-700', className)} {...rest}>
	{@render children?.()}
</label>
