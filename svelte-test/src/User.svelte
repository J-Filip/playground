<script>

    let user = '';
    //let user = local storage API
   
 </script>
 
 <main>
     {#if user != ''}
     <span class=" has-text-primary is-size-8">
       {user}!
     </span>
     {:else}
     <span class="is-size-8">
       Stranger!
     </span>
     {/if}
 </main>
 
 <style>
   main {
    display: inline;
     text-align: center;
     padding: .1em;
     max-width: 840px;
     margin: 0 auto;
   }
 </style>
 