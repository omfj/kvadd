<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { createGraph } from '$lib/api';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Label from '$lib/components/Label.svelte';

	let name = $state('');
	let xLabel = $state('');
	let yLabel = $state('');
	let topEmoji = $state('😊');
	let rightEmoji = $state('💪');
	let bottomEmoji = $state('😢');
	let leftEmoji = $state('🤔');
	let allowMultiplePoints = $state(true);

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
				yLabel,
				topEmoji,
				rightEmoji,
				bottomEmoji,
				leftEmoji,
				allowMultiplePoints
			});

			if (result.success) {
				alert('Graf opprettet!');
				// Reset form
				name = '';
				xLabel = '';
				yLabel = '';
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

<main class="mx-auto max-w-md p-8">
	<form class="space-y-4">
		<div>
			<Label for="name">Navn på grafen</Label>
			<Input id="name" type="text" bind:value={name} placeholder="Min graf" required />
		</div>

		<div>
			<Label for="xLabel">X-akse label</Label>
			<Input id="xLabel" type="text" bind:value={xLabel} placeholder="Horisontal akse" />
		</div>

		<div>
			<Label for="yLabel">Y-akse label</Label>
			<Input id="yLabel" type="text" bind:value={yLabel} placeholder="Vertikal akse" />
		</div>

		<div class="space-y-4">
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

		<Button type="submit" onclick={handleSubmit}>Lag graf</Button>
	</form>
</main>
