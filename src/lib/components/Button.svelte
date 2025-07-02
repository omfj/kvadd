<script lang="ts">
	interface Props {
		type?: 'button' | 'submit' | 'reset';
		onclick?: (event: MouseEvent) => void;
		class?: string;
		children: any;
	}

	let {
		type = 'button',
		onclick,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const baseClasses = 'w-full bg-accent px-4 py-2 text-black hover:opacity-90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none';
</script>

<button
	{type}
	{onclick}
	class="{baseClasses} {className}"
	{...restProps}
>
	{@render children()}
</button>