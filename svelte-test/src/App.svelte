<script>
	import Heading from './Header.svelte';
	//import SearchSchool from './SearchSchool.svelte';
	import Navbar from './Navbar.svelte';


let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}

</script>

<main>
	<Heading/> 
	<Navbar/> 
	
	

	
		
	

</main>










<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 840px;
		margin: 0 auto;
	}

	
	
</style>