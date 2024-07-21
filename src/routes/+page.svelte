<script>
	import { enhance } from '$app/forms';
	import { add } from '$lib/testfiles/testmodule';
</script>

<form method="post" action="?/click" use:enhance>
	<button type="submit">Click</button>
</form>

<br>

<form method="post" action="?/trouble" use:enhance>
	<button type="submit">Cause trouble</button>
</form>

<p>
	Browser action: the log should work
</p>

<button onclick="{() => add(10, 20)}">Add numbers</button>