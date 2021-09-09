<script>
  import User from './User.svelte';

   let heading = 'CN Helper';
   let manifestData = '';
   //let manifestData = chrome.runtime.getManifest();
  
</script>

<main>
  <section class="section">
    <div class="container">
      <h1 class="title">{heading} {manifestData}</h1>
    </div>
    <h1 class="subtitle">
      Hi <User/>
    </h1>

  
    </section>
</main>

<style>

</style>
