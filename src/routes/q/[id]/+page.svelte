<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { addPointToGraph } from '$lib/api.js';

	let { data } = $props();
	let graph = $derived(data.graph);
	let isCreatingPoint = $state(false);
	let canVote = $derived.by(() => {
		const hasVoted = graph.points.some((point) => point.sessionId === data.sessionId);
		if (hasVoted && !graph.allowMultiplePoints) {
			return false;
		}
		return !isCreatingPoint;
	});

	async function handleGraphClick(event: MouseEvent) {
		if (!canVote) return;
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		const relativeX = (event.clientX - rect.left) / rect.width;
		const relativeY = (event.clientY - rect.top) / rect.height;

		const x = parseFloat((relativeX * 2 - 1).toFixed(3));
		const y = parseFloat((1 - relativeY * 2).toFixed(3));

		isCreatingPoint = true;

		try {
			const ok = await addPointToGraph(graph.id, x, y);
			if (ok) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error creating point:', error);
		} finally {
			isCreatingPoint = false;
		}
	}
</script>

<svelte:head>
	<title>{graph.name} - Kvadda</title>
</svelte:head>

<main class="mx-auto max-w-2xl p-8">
	<h1 class="mb-12 text-center text-3xl font-bold">{graph.name}</h1>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative mx-auto h-96 w-96 border-2 border-gray-200 bg-white {!canVote
			? 'cursor-not-allowed opacity-75'
			: 'cursor-crosshair'}"
		onclick={handleGraphClick}
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
		{#if graph.topEmoji}
			<div class="absolute -top-8 left-1/2 -translate-x-1/2 transform text-2xl">
				{graph.topEmoji}
			</div>
		{/if}

		{#if graph.rightEmoji}
			<div class="absolute top-1/2 -right-8 -translate-y-1/2 transform text-2xl">
				{graph.rightEmoji}
			</div>
		{/if}

		{#if graph.bottomEmoji}
			<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-2xl">
				{graph.bottomEmoji}
			</div>
		{/if}

		{#if graph.leftEmoji}
			<div class="absolute top-1/2 -left-8 -translate-y-1/2 transform text-2xl">
				{graph.leftEmoji}
			</div>
		{/if}

		<!-- Axis labels -->
		{#if graph.xLabel}
			<div class="absolute -bottom-8 left-1/4 -translate-x-1/2 transform text-sm text-gray-600">
				{graph.xLabel}
			</div>
		{/if}

		{#if graph.yLabel}
			<div
				class="absolute top-3/4 -left-14 -translate-y-1/2 -rotate-90 transform text-sm text-gray-600"
			>
				{graph.yLabel}
			</div>
		{/if}

		<!-- Points -->
		{#each graph.points as point}
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
					style="left: {xPos}%; top: {yPos + 5}%"
				>
					{point.label}
				</div>
			{/if}
		{/each}
	</div>
</main>
