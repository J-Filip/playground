window.addEventListener('load', async () => {
  const lockedToggle = document.createElement('input');
  lockedToggle.setAttribute('type', 'checkbox');
  lockedToggle.classList.add('checkbox');
  lockedToggle.setAttribute('id', 'wakelock-checkbox');

  //const lockedToggleLabel = document.createElement('label')
  const lockedToggleLabel = document.createElement('label');
  lockedToggleLabel.setAttribute('for', 'wakelock-checkbox');
  lockedToggleLabel.classList.add('checkbox-label');
  //lockedToggleLabel.innerText = 'Lock screen';
  //lockedToggleLabel.innerText = 'Locked'

  const desktopBar = document.querySelector('#toolbar');
  desktopBar.append(lockedToggle, lockedToggleLabel);

  checkToggleState();

  document.addEventListener('visibilitychange', checkVisibility);

  function checkVisibility() {
    if (document.visibilityState === 'visible') {
      let state = getStorageState('LockToggle');
      if (state === 'ON') {
        lockPage();
      }
    }
  }

  function lockUnlock() {
    if (getStorageState('LockToggle') === 'ON') {
      unlockPage();
      return;
    }
    lockPage();
  }

  lockedToggle.addEventListener('click', lockUnlock);

  function checkToggleState() {
    let toggleState = getStorageState('LockToggle');
    if (toggleState === 'ON') {
      lockPage();
      lockedToggle.checked = true;
      //lockedToggleLabel.innerText = 'ON';
      //localStorage.setItem('LockButton', 'ON');
      //lockedButton.removeEventListener('click', lockUnlock)
      return;
    }
    //lockedToggleLabel.innerText = 'OFF';

    //localStorage.setItem('LockButton', 'OFF');
    //lockedButton.addEventListener('click', lockUnlock)
  }

  // first time I needed recursion
  function getStorageState(key) {
    let state;
    try {
      state = localStorage.getItem(key);
      if (state === null) {
        console.log('nema');
        throw error;
      }
    } catch {
      localStorage.setItem(key, 'OFF');
      getStorageState(key);
    }
    return state;
  }

  let wakeLock = null;
  function lockPage() {
    // Function that attempts to request a wake lock.
    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        // wakeLock.addEventListener('release', () => {
        //   lockedToggleLabel.innerText = 'OFF';
        //   lockedToggle.checked = false;
        //   localStorage.setItem('LockToggle', 'OFF');
        console.log('Wake Lock was released');
        // });
        localStorage.setItem('LockToggle', 'ON');
        lockedToggle.checked = true;
        //lockedToggleLabel.innerText = 'ON';
        console.log('Wake Lock is active');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };
    requestWakeLock();
  }

  function unlockPage() {
    const releaseWakeLock = async () => {
      if (!wakeLock) {
        return;
      }
      try {
        await wakeLock.release();
        wakeLock = null;

        // lockedToggleLabel.innerText = 'OFF';
        lockedToggle.checked = false;
        localStorage.setItem('LockToggle', 'OFF');
        console.log('Wake Lock was released');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };
    releaseWakeLock();
  }
});

// ? testing

window.addEventListener('storage', function (e) {
  console.log(e.newValue);
});

function checkButtonState() {
  localStorage.setItem('LockButton', 'OFF');
  // let toggleState = getStorageState('LockToggle');
  // if (toggleState === 'ON') {
  //   lockPage();
  //   localStorage.setItem('LockButton', 'ON');
  //   return;
  // }
  // lockedButton.innerText = 'OFF';
}
