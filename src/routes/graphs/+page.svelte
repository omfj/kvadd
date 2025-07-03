<script lang="ts">
	import { ChartBar, Check, Eye, Users } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Mine grafer - Kvadda</title>
</svelte:head>

<main class="mx-auto max-w-4xl p-8 pt-20">
	{#if data.graphs.length === 0}
		<div class="py-12 text-center">
			<ChartBar class="mx-auto h-24 w-24 text-gray-300" />
			<h3 class="mt-4 text-lg font-medium text-gray-900">Ingen grafer ennå</h3>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.graphs as graph}
				<a
					class="cursor-pointer overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
					href="/q/{graph.id}"
				>
					<div class="p-6">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="truncate text-lg font-semibold text-gray-900">
									{graph.name}
								</h3>

								<div class="mt-3 flex flex-col space-x-4 text-xs text-gray-400">
									{#if graph.allowMultiplePoints}
										<span class="flex items-center">
											<Check class="mr-1 h-3 w-3" />
											Flere punkter
										</span>
									{/if}
									{#if graph.showPoints}
										<span class="flex items-center">
											<Eye class="mr-1 h-3 w-3" />
											Synlige punkter
										</span>
									{/if}
									<span class="flex items-center">
										<Users class="mr-1 h-3 w-3" />
										{graph.points} Punkter
									</span>
								</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>
