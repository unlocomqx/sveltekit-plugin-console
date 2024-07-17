<script lang="ts">
	let { children } = $props();
	// client side
	// const commonStyle = 'padding:2px 5px; border-radius:3px;margin-top:5px;color: #fff; background: #FF3E00;'
	// if (import.meta.hot) {
	// 	import.meta.hot.send('spc:log_drain');
	// 	import.meta.hot.on('spc:log_drain', (data) => {
	// 		const items = JSON.parse(data);
	// 		if (Array.isArray(items)) {
	// 			if(items.length){
	// 				console.log('%c # Server loading logs', commonStyle);
	// 			}
	// 			for(let item of items) {
	// 				console.log(...item);
	// 			}
	// 		}
	// 	});
	// 	import.meta.hot.on('spc:log', (data) => {
	// 		console.log('%c # Server log', commonStyle);
	// 		console.log(...JSON.parse(data));
	// 	});
	// }
</script>

<a href="/">Index</a>
<a href="/test">Test</a>

<br><br>

<div>
	{@render children()}
</div>