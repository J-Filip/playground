<script>
  import Notepad from './Notepad.svelte';


  let user = { loggedIn: false };

  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>

<main class="container is-max-desktop">
  <Notepad/>
  
</main>

<style>



</style>
