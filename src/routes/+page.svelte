<script>
	// client side
	// console.log(import.meta);
	if (import.meta.hot) {
		import.meta.hot.on('my:greetings', (data) => {
			// console.log(data.msg)
		})
	}
</script>

Project