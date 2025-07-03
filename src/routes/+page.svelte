<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { createGraph } from '$lib/api';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Label from '$lib/components/Label.svelte';
	import Graph from '$lib/components/Graph.svelte';

	let name = $state('');
	let xLabel = $state('');
	let x2Label = $state('');
	let yLabel = $state('');
	let y2Label = $state('');
	let topEmoji = $state('😊');
	let rightEmoji = $state('💪');
	let bottomEmoji = $state('😢');
	let leftEmoji = $state('🤔');
	let allowMultiplePoints = $state(true);
	let showPoints = $state(true);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!name.trim()) {
			alert('Navn på grafen er påkrevd');
			return;
		}

		try {
			const result = await createGraph({
				name,
				xLabel,
				x2Label,
				yLabel,
				y2Label,
				topEmoji,
				rightEmoji,
				bottomEmoji,
				leftEmoji,
				allowMultiplePoints,
				showPoints
			});

			if (result.success) {
				alert('Graf opprettet!');
				// Reset form
				name = '';
				xLabel = '';
				x2Label = '';
				yLabel = '';
				y2Label = '';
				topEmoji = '😊';
				rightEmoji = '💪';
				bottomEmoji = '😢';
				leftEmoji = '🤔';
				allowMultiplePoints = true;
				goto(`/q/${result.graph.id}`);
			} else {
				alert('Feil ved opprettelse av graf: ' + result.error);
			}
		} catch (error) {
			console.error('Error creating graph:', error);
			alert('Feil ved opprettelse av graf');
		}
	}
</script>

<svelte:head>
	<title>📈 Kvadda</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center p-8">
	<h1 class="mb-12 text-center text-4xl font-medium">📈 Kvadda</h1>

	<div class="grid w-full grid-cols-1 gap-32 lg:grid-cols-2 lg:gap-8">
		<!-- Form section -->
		<div class="flex flex-col items-center space-y-4">
			<form class="w-full max-w-md space-y-4">
				<div>
					<Label for="name">Navn på grafen</Label>
					<Input id="name" type="text" bind:value={name} placeholder="Min graf" required />
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="xLabel">X-akse label</Label>
						<Input id="xLabel" type="text" bind:value={xLabel} placeholder="Horisontal akse" />
					</div>

					<div>
						<Label for="x2Label2">X-akse label 2</Label>
						<Input id="x2Label" type="text" bind:value={x2Label} placeholder="Horisontal akse" />
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="yLabel">Y-akse label</Label>
						<Input id="yLabel" type="text" bind:value={yLabel} placeholder="Vertikal akse" />
					</div>

					<div>
						<Label for="y2Label2">Y-akse label 2</Label>
						<Input id="y2Label" type="text" bind:value={y2Label} placeholder="Vertikal akse" />
					</div>
				</div>

				<div class="mx-auto max-w-[250px]">
					<div class="flex justify-center">
						<div class="text-center">
							<Label for="topEmoji" class="text-xs text-gray-600">Topp</Label>
							<Input
								id="topEmoji"
								type="text"
								bind:value={topEmoji}
								maxlength={2}
								class="h-12 w-12 text-center text-lg"
							/>
						</div>
					</div>

					<div class="flex items-center justify-between px-8">
						<div class="text-center">
							<Label for="leftEmoji" class="text-xs text-gray-600">Venstre</Label>
							<Input
								id="leftEmoji"
								type="text"
								bind:value={leftEmoji}
								maxlength={2}
								class="h-12 w-12 text-center text-lg"
							/>
						</div>

						<div class="text-center">
							<Label for="rightEmoji" class="text-xs text-gray-600">Høyre</Label>
							<Input
								id="rightEmoji"
								type="text"
								bind:value={rightEmoji}
								maxlength={2}
								class="h-12 w-12 text-center text-lg"
							/>
						</div>
					</div>

					<div class="flex justify-center">
						<div class="text-center">
							<Label for="bottomEmoji" class="text-xs text-gray-600">Bunn</Label>
							<Input
								id="bottomEmoji"
								type="text"
								bind:value={bottomEmoji}
								maxlength={2}
								class="h-12 w-12 text-center text-lg"
							/>
						</div>
					</div>
				</div>

				<div>
					<label class="flex items-center space-x-2">
						<Checkbox type="checkbox" bind:checked={allowMultiplePoints} />
						<span class="text-sm text-gray-700">Tillat flere punkter per person</span>
					</label>
				</div>

				<div>
					<label class="flex items-center space-x-2">
						<Checkbox type="checkbox" bind:checked={showPoints} />
						<span class="text-sm text-gray-700">Vis punkter</span>
					</label>

					<span class="text-xs text-gray-500"
						>Om du ønsker å vise alle punkter med engang. Du kan skru av og på senere.</span
					>
				</div>

				<Button type="submit" onclick={handleSubmit}>Lag graf</Button>
			</form>
		</div>

		<!-- Preview Section -->
		<div class="flex h-full w-full flex-col items-center justify-center space-y-4">
			<Graph
				class="size-80"
				{name}
				{xLabel}
				{x2Label}
				{yLabel}
				{y2Label}
				{topEmoji}
				{rightEmoji}
				{bottomEmoji}
				{leftEmoji}
				{allowMultiplePoints}
			/>
		</div>
	</div>
</main>
