<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Graph, Point } from '$lib/db/schemas';
	import { cn } from '$lib/cn';

	export type OnGraphClickParams = {
		x: number;
		y: number;
	};

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onclick'> &
		Partial<Graph> & {
			points?: Array<Point>;
			onGraphClick?: ({ x, y }: OnGraphClickParams) => void;
		};

	let {
		topEmoji,
		leftEmoji,
		bottomEmoji,
		rightEmoji,
		xLabel,
		x2Label,
		yLabel,
		y2Label,
		onGraphClick,
		points = [],
		class: className,
		...rest
	}: Props = $props();

	async function handleGraphClick(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		const relativeX = (event.clientX - rect.left) / rect.width;
		const relativeY = (event.clientY - rect.top) / rect.height;

		const x = parseFloat((relativeX * 2 - 1).toFixed(3));
		const y = parseFloat((1 - relativeY * 2).toFixed(3));

		onGraphClick?.({ x, y });
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn('relative mx-auto h-96 w-96 border-2 border-gray-200 bg-white', className)}
	onclick={handleGraphClick}
	{...rest}
>
	<!-- Smaller grid lines -->
	{#each [12.5, 25, 37.5, 62.5, 75, 87.5] as position}
		<!-- Vertical grid lines -->
		<div
			class="absolute top-0 h-full w-px -translate-x-0.5 transform bg-gray-200"
			style="left: {position}%"
		></div>
		<!-- Horizontal grid lines -->
		<div
			class="absolute left-0 h-px w-full -translate-y-0.5 transform bg-gray-200"
			style="top: {position}%"
		></div>
	{/each}

	<!-- Center grid lines -->
	<div class="absolute top-0 left-1/2 h-full w-0.5 -translate-x-0.5 transform bg-gray-400"></div>
	<div class="absolute top-1/2 left-0 h-0.5 w-full -translate-y-0.5 transform bg-gray-400"></div>

	<!-- Emojis -->
	{#if topEmoji}
		<div class="absolute -top-8 left-1/2 -translate-x-1/2 transform text-2xl">
			{topEmoji}
		</div>
	{/if}

	{#if rightEmoji}
		<div class="absolute top-1/2 -right-8 -translate-y-1/2 transform text-2xl">
			{rightEmoji}
		</div>
	{/if}

	{#if bottomEmoji}
		<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-2xl">
			{bottomEmoji}
		</div>
	{/if}

	{#if leftEmoji}
		<div class="absolute top-1/2 -left-8 -translate-y-1/2 transform text-2xl">
			{leftEmoji}
		</div>
	{/if}

	<!-- Axis labels -->
	{#if xLabel}
		<div class="absolute -top-8 left-1/4 -translate-x-1/2 transform text-sm text-gray-600">
			{xLabel}
		</div>
	{/if}

	{#if x2Label}
		<div class="absolute -top-8 left-3/4 -translate-x-1/2 transform text-sm text-gray-600">
			{x2Label}
		</div>
	{/if}

	{#if yLabel}
		<div
			class="absolute top-1/4 -left-14 -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-sm text-gray-600"
		>
			{yLabel}
		</div>
	{/if}

	{#if y2Label}
		<div
			class="absolute bottom-1/4 -left-14 -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-sm text-gray-600"
		>
			{y2Label}
		</div>
	{/if}

	<!-- Points -->
	{#each points as point}
		{@const x = point.x / 1000}
		{@const y = point.y / 1000}
		{@const xPos = ((x + 1) / 2) * 100}
		{@const yPos = ((1 - y) / 2) * 100}
		<div
			class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
			style="left: {xPos}%; top: {yPos}%; background-color: {point.color}"
			title={point.label || `(${x}, ${y})`}
		></div>
		{#if point.label}
			<div
				class="absolute -translate-x-1/2 transform text-xs text-gray-700"
				style="left: {xPos}%; top: {yPos + 2}%"
			>
				{point.label}
			</div>
		{/if}
	{/each}
</div>
