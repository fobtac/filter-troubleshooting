<script>
	import Header from '$lib/components/Header.svelte';
	import '../app.pcss'
	let { children } = $props();
</script>

<Header></Header>
{@render children()}


<style>
	@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
</style>