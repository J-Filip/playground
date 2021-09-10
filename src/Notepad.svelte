<script>


  let tokenSerialNumber = document.querySelector("#content > div > div.w-half.left > div:nth-child(1)").nextElementSibling.innerText;

  let tokenOwnerFullName = document.querySelector("#content > div > div.w-half.left > div:nth-child(3)").nextElementSibling.innerText.split(' ') ;
   let tokenOwner = tokenOwnerFullName[tokenOwnerFullName.length-1];

  let userIdentificator = tokenSerialNumber.slice(2);

  let indexActivation = document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search('activation_number');
let indexPhone = document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search('phone');
let log = document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText;

let activationCode = log.slice( indexActivation+22, (indexActivation+27) );

  //let activationCode = '010101';
  let mailSender = '';

  let users = [
    { id: 1, msg: `Poštovana gospođo`, name: 'Gđa.' },
    { id: 2, msg: `Poštovani gospodine`, name: 'Gdin.' },
  ];
  let selectedUser = users[0];

  let mainBodies = [
    {
      msg: `,

mToken djelatnice ${tokenOwner} je`,
      text: 'za gospođu',
    },
    {
      msg: `,

mToken djelatnika ${tokenOwner} je`,
      text: 'za gospodina',
    },
    {
      msg: `,

mToken je uspješno`,
      text: 'za sebe',
    },
  ];
  let forUser = mainBodies[0];

  let operatingSystems = [
    {
      id: 1,
      msg: `Budući da se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod (${activationCode}).`,
      os: 'Android',
    },
    {
      id: 2,
      msg: `U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.

Inicijalna lozinka: ${activationCode}
Korisnički identifikator: ${userIdentificator} `,
      os: 'iOS',
    },
    {
      id: 3,
      msg: ` Ako se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod. U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.

Aktivacijski kod/inicijalna lozinka: ${activationCode}
Korisnički identifikator: ${userIdentificator}`,
      os: 'Nepoznat',
    },
  ];
  let selectedOS = operatingSystems[0];

  let actions = [
    {
      id: 1,
      status: 'aktiviran.',
      name: 'Aktivacija',
      msg: `Ako ćete mToken koristiti za prijavu u e-Dnevnik, prije prve prijave potrebno je da e-Dnevnik administrator Vaše škole unese serijski broj mTokena ${tokenSerialNumber} u sustav.`,
    },
    {
      id: 2,
      status: 'reaktiviran.',
      name: 'Reaktivacija',
      msg: `Serijski broj mTokena ostaje isti, odnosno ${tokenSerialNumber}.`,
    },
  ];
  let selectedAction = actions[0];

  $: helloUser = `${selectedUser.msg} ${mailSender}${forUser.msg}`;
  $: osAction = `${selectedAction.status} ${selectedOS.msg}`;

  // main msg
  $: mail = `${helloUser} ${osAction} 

${selectedAction.msg}

Za sve ostale upite stojimo Vam na raspolaganju.`;

  function copyTextArea() {
    let textToCopy = document.querySelector('#mail');
    //console.log(textToCopy.value);
    let split = textToCopy.value.split('\n\n');
    //console.log(split);
    let back = split.join('\n');
    console.log(back);
    textToCopy.value = back;
    textToCopy.select();
    document.execCommand('copy');
  }


function getOption(){

 let select = document.getElementById('za');
 let selectedValue = select.options[select.selectedIndex].innerText;
 if(selectedValue === 'za sebe '){
      console.log(selectedValue);
      mailSender = tokenOwner
    }
  }


</script>


  <div class="tile is-ancestor">
    <div class="tile is-4 is-vertical is-parent">
      <div class="tile is-child ">
        <form class="box">
          <div class="field">
            <label class="label is-small">Vlasnik mTokena</label>
            <div class="control">
              <input
                value={tokenOwner}
                class="input is-small"
                type="text"
                placeholder=""
                disabled
              />
            </div>
          </div>

          <div class="field">
            <label class="label is-small">Serijski broj mTokena</label>
            <div class="control">
              <input
                value={tokenSerialNumber}
                class="input is-small"
                type="text"
                placeholder=""
                disabled
              />
            </div>
          </div>
          <div class="field">
            <label class="label is-small">Korisnički identifikator</label>
            <div class="control">
              <input
                value={userIdentificator}
                class="input is-small"
                type="text"
                placeholder=""
                disabled
              />
            </div>
          </div>
          <div class="field">
            <label class="label is-small">Aktivacijski kod</label>
            <div class="control">
              <input
                value={activationCode}
                class="input is-small"
                type="text"
                placeholder=""
                disabled
              />
            </div>
          </div>
          <!-- hide if person asks for himself -->
          {#if forUser.text !== 'za sebe'}
            <div class="field">
              <label class="label is-small">Zatražio nove podatke:</label>
              <div class="control">
                <input 
                  bind:value={mailSender}
                  class="input is-small"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            {/if}

        </form>
      </div>
      <div class="tile is-child ">
        <button on:click={copyTextArea} class="button is-primary"
          >Kopiraj</button
        >
      </div>
    </div>

    <div class="tile is-vertical is-parent">
      <div class="tile is-child box">
        <div class="field is-horizontal ">
          <div class="field ">
            <label class="label">Od:</label>
          </div>

          <div class="field-body">
            <div class="field">
              <div class="control">
                {#each users as user}
                  <label class="radio">
                    <input
                      class="is-small"
                      type="radio"
                      bind:group={selectedUser}
                      value={user}
                    />
                    {user.name}
                  </label>
                {/each}
              </div>
            </div>
          </div>

          <div class="field is-small">
            <label class="label">Za:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select ">
                  <select id= 'za'on:change={getOption} bind:value={forUser}>
                    {#each mainBodies as main}
                      <option  value={main}>
                        {main.text}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field ">
            <label class="label">OS:</label>
          </div>

          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select ">
                  <select bind:value={selectedOS}>
                    {#each operatingSystems as system}
                      <option value={system}>
                        {system.os}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div class="field is-small">
              <label class="label">Vrsta akcije:</label>
            </div>
            <div class="control ">
              {#each actions as action}
                <label class="radio">
                  <input
                    class="is-small"
                    type="radio"
                    bind:group={selectedAction}
                    value={action}
                  />
                  {action.name}
                </label>
              {/each}
            </div>
          </div>
        </div>

        <!-- 
         <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Vrsta:</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control ">
                <label class="radio">
                  <input type="radio" name="hellos" bind:group={helloMsg} value= {gdin}>
                  Gdin
                </label>
                <label class="radio">
                  <input type="radio" name="hellos" bind:group={helloMsg} value= {gđa}>
                  Gđa
                </label>
              </div>
            </div>
          </div>
          
        </div>

        <div class="field ">
          <div class="field-label is-small">
            <label class="label">Tko kome:</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-small">
                  <select bind:value= {helloMsg} >
                    {#each hellos as hello}
                    <option value={hello.msg}>
                      {hello.text}
                    </option>
                  {/each}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Operativni sustav:</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control ">
                <label class="radio">
                  <input type="radio" name="member">
                  Android
                </label>
                <label class="radio">
                  <input type="radio" name="member">
                  iOS
                </label>
                <label class="radio">
                  <input type="radio" name="member">
                  Ne znam
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Ostalo:</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="select is-multiple is-small">
                <select multiple size="3">
                  <option value="Argentina">Nedostaje broj mobitela</option>
                  <option value="Bolivia">Deaktivacija fizičkog tokena</option>
                  <option value="Brazil"></option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>  -->

        <div class="tile is-child ">
          <textarea
            id="mail"
            value={mail}
            class="textarea is-primary"
            placeholder="Write something ..."
            cols="60"
            rows="15"
          />
        </div>
      </div>
    </div>
  </div>


<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 940px;
    margin: 0 auto;
  }
</style>
