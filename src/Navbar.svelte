<script>
  import SearchTab from './SearchTab.svelte';
  import NotepadTab from './NotepadTab.svelte';

//   let appDescription = //get from manifest

  let tabs = [
    { name: 'Traži', value: 1, component: SearchTab },
    { name: 'Aplikacije', value: 2 },
    { name: 'Notepad', value: 3, component: NotepadTab },
    { name: 'Kontakti', value: 4 },
  ];

//   in production change to empty object
  let selected = {name: 'Notepad', value: 3, component: NotepadTab};
</script>

<main>
  <div class="tabs is-centered is-medium is-toggle is-fullwidth">
    <ul>
      {#each tabs as tab}
        <li
          on:click={() => {
            selected = tab;
          }}
        >
          <a>{tab.name}</a>
        </li>
      {/each}
    </ul>
  </div>

  <!-- check if object empty -->
  {#if Object.keys(selected).length !== 0}
    <svelte:component this={selected.component} />
  {:else}
    <!-- <h1>{appDescription}</h1> -->
    <h1>Welcome.</h1>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 840px;
    margin: 0 auto;
  }
</style>
