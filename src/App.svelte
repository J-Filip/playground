<script>
  import Heading from './Header.svelte';
  //import SearchSchool from './SearchSchool.svelte';
  import Navbar from './Navbar.svelte';

  let user = { loggedIn: false };

  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>

<main class="container">
  <Heading />
  <Navbar />
</main>

<style>



</style>
