<script>
	import { enhance } from '$app/forms';
</script>

<form method="post" action="?/click" use:enhance>
	<button type="submit">Click</button>
</form>

<br>

<form method="post" action="?/trouble" use:enhance>
	<button type="submit">Cause trouble</button>
</form>