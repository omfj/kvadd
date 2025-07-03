<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { addPointToGraph } from '$lib/api.js';
	import { cn } from '$lib/cn.js';
	import Graph, { type OnGraphClickParams } from '$lib/components/Graph.svelte';
	import GraphAdmin from './_components/GraphAdmin.svelte';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();
	let graph = $derived(data.graph);
	let points = $derived(data.points);
	let isOwner = $derived(data.graph.sessionId === data.sessionId);
	let isCreatingPoint = $state(false);
	let canVote = $derived.by(() => {
		const hasVoted = points.some((point) => point.sessionId === data.sessionId);
		if (hasVoted && !graph.allowMultiplePoints) {
			return false;
		}
		return !isCreatingPoint;
	});

	let ws = $state<WebSocket | null>(null);

	onMount(() => {
		ws = new WebSocket(`${data.wsUrl}/graph/${graph.id}?session=${data.sessionId}`);

		ws.onmessage = (event) => {
			const message = event.data;
			if (message === 'UPDATE') {
				invalidateAll();
			}
		};
	});

	onDestroy(() => {
		ws?.close();
	});

	async function handleGraphClick({ x, y }: OnGraphClickParams) {
		if (!canVote) return;

		isCreatingPoint = true;

		const label = prompt('Label på punktet');

		try {
			const ok = await addPointToGraph(graph.id, x, y, label);
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

{#if isOwner}
	<GraphAdmin bind:graph />
{/if}

<main class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8">
	<div class="mb-12">
		<h1 class="mb-4 text-center text-3xl font-bold">{graph.name}</h1>

		{#if !graph.showPoints && isOwner}
			<p class="text-sm text-gray-500">Punktene vises bare for deg</p>
		{/if}
	</div>

	<Graph
		class={cn({
			'cursor-not-allowed opacity-75': !canVote,
			'cursor-crosshair': canVote
		})}
		{...graph}
		{points}
		onGraphClick={handleGraphClick}
	/>
</main>
