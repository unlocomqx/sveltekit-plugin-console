<script lang="ts">
	let { children } = $props();
	// client side
	if (import.meta.hot) {
		console.log('----------- get log drain');
		import.meta.hot.send('spc:log_drain');
		import.meta.hot.on('spc:log_drain', (data) => {
			const items = JSON.parse(data);
			items.forEach(item => console.log(...item));
		});
		import.meta.hot.on('spc:log', (data) => {
			console.log(...JSON.parse(data));
		});
	}
</script>

<a href="/">Index</a>
<a href="/test">Test</a>

<br><br>

<div>
	{@render children()}
</div>