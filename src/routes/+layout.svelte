<script lang="ts">
	let { children } = $props();
</script>

<a href="/">Index</a>
<a href="/test">Test</a>

<br><br>

<div>
	{@render children()}
</div>