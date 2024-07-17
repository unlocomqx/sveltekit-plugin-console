<script lang="ts">
	// client side
	if (import.meta.hot) {
		import.meta.hot.on('spc:log', (data) => {
			console.log(data)
		})
	}
</script>

<a href="/">Index</a>
<a href="/test">Test</a>