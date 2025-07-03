<script lang="ts">
	import { updateGraph } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import { Cog } from '@lucide/svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Label from '$lib/components/Label.svelte';
	import type { Graph } from '$lib/db/schemas';

	type Props = {
		graph: Graph;
	};

	let { graph = $bindable() }: Props = $props();

	let name = $state(graph.name);
	let showPoints = $state(graph.showPoints);
	let allowMultiplePoints = $state(graph.allowMultiplePoints);
	let isLoading = $state(false);
	let error = $state('');
	let isOpen = $state(false);

	let isDisabled = $derived.by(() => {
		return isLoading || !name.trim() || name.trim() === graph.name;
	});

	async function handleUpdateName() {
		if (!name.trim()) {
			error = 'Navn på grafen er påkrevd';
			return;
		}

		if (name.trim() === graph.name) {
			return;
		}

		isLoading = true;
		error = '';

		try {
			const result = await updateGraph(graph.id, { name: name.trim() });

			if (result.success) {
				graph = result.graph;
				invalidateAll();
			} else {
				error = result.error || 'Feil ved oppdatering av graf';
			}
		} catch (err) {
			console.error('Error updating graph name:', err);
			error = 'Feil ved oppdatering av graf';
		} finally {
			isLoading = false;
		}
	}

	async function handleToggleShowPoints() {
		isLoading = true;
		error = '';

		try {
			const result = await updateGraph(graph.id, { showPoints });

			if (result.success) {
				graph = result.graph;
				invalidateAll();
			} else {
				error = result.error || 'Feil ved oppdatering av graf';
				showPoints = graph.showPoints;
			}
		} catch (err) {
			console.error('Error updating show points:', err);
			error = 'Feil ved oppdatering av graf';
			showPoints = graph.showPoints;
		} finally {
			isLoading = false;
		}
	}

	async function handleToggleAllowMultiplePoints() {
		isLoading = true;
		error = '';

		try {
			const result = await updateGraph(graph.id, { allowMultiplePoints });

			if (result.success) {
				graph = result.graph;
				invalidateAll();
			} else {
				error = result.error || 'Feil ved oppdatering av graf';
				allowMultiplePoints = graph.allowMultiplePoints;
			}
		} catch (err) {
			console.error('Error updating allow multiple points:', err);
			error = 'Feil ved oppdatering av graf';
			allowMultiplePoints = graph.allowMultiplePoints;
		} finally {
			isLoading = false;
		}
	}

	function handleNameKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleUpdateName();
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

<div class="fixed top-4 right-4 z-50">
	<Button onclick={toggleDropdown}>
		<Cog />

		Innstillinger
	</Button>

	<!-- Dropdown Panel -->
	{#if isOpen}
		<div class="absolute top-full right-0 mt-2 w-80 border border-gray-200 bg-white shadow-xl">
			<div class="space-y-4 p-4">
				<h3 class="text-lg font-semibold text-gray-900">Grafinnstillinger</h3>

				{#if error}
					<div class="rounded-md bg-red-50 p-3">
						<p class="text-sm text-red-700">{error}</p>
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<Label for="graph-name">Navn på grafen</Label>
						<div class="flex flex-col gap-2">
							<Input
								id="graph-name"
								type="text"
								bind:value={name}
								placeholder="Grafnavn"
								disabled={isLoading}
								onkeydown={handleNameKeydown}
								class="flex-1"
							/>
							<Button onclick={handleUpdateName} disabled={isDisabled} class="px-4 py-2">
								{isLoading ? 'Lagrer...' : 'Oppdater'}
							</Button>
						</div>
					</div>

					<div>
						<label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={showPoints}
								disabled={isLoading}
								onchange={handleToggleShowPoints}
							/>
							<span class="text-sm text-gray-700">Vis punkter</span>
						</label>
						<p class="mt-1 text-xs text-gray-500">
							Skru på for å vise alle punkter som er lagt til på grafen
						</p>
					</div>

					<div>
						<label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={allowMultiplePoints}
								disabled={isLoading}
								onchange={handleToggleAllowMultiplePoints}
							/>
							<span class="text-sm text-gray-700">Tillat flere innsendinger</span>
						</label>
						<p class="mt-1 text-xs text-gray-500">
							La brukere legge til flere punkter på grafen
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
