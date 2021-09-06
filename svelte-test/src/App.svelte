<script>
	export let name;
	let count = 0;
	$:doubled = count * 2

	function counter(){
		count+=1;
	}

	function handleClick(){
		count+=1;
	}

$:console.log(`count is ${count}`);

$: if (count >= 10) {
	alert(`count is dangerously high!`);
	
}
let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}

</script>

<main>
	<h1>Hello {name}!</h1>
	<button on:click={counter}>YO  CLICK HERE
	</button>
	<p>I am clicked {count} {count === 1 ? ' time' : 'times'}   </p>

	<button on:click={handleClick}>DOUBLE IT
	</button>
	<p> {count} doubled gives  {doubled}   </p>
	<p>or</p>
	<!-- or this -->
	<p> {count} doubled gives  {count*2}   </p>


	<!-- {#if user.loggedIn}
	<button on:click={toggle}>
		Log out
	</button>
	{/if}
	{#if !user.loggedIn }
	<button on:click={toggle}>
		Log in
	</button>
	{/if} -->
	<!-- or -->

	{#if user.loggedIn}
	<button on:click={toggle}>
		Log in
	</button>
	{:else}
	<button on:click={toggle}>
		Log out
	</button>
	{/if}
	
		
	

</main>










<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 840px;
		margin: 0 auto;
	}

	h1 {
		color:blue;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	
	
</style>