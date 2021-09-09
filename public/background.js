/**
 * DESCRIPTION:
 * RIght click options
 * FEATURES:
 * 3 options on selected text :
 * - search RT
 * - search glossary
 * - search kb
 */

// on install
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'RT | Pretraži: " %s " ',
    contexts: ['selection'],
    id: 'RT',
  });
  chrome.contextMenus.create({
    title: 'RJEČNIK | Pretraži: " %s " ',
    contexts: ['selection'],
    id: 'kb-glossary',
  });
  chrome.contextMenus.create({
    title: 'PP BAZA | Pretraži: " %s " ',
    contexts: ['selection'],
    id: 'kb-all',
  });
});
// event listener
chrome.contextMenus.onClicked.addListener(newTabSearchWord);
// functions
function newTabSearchWord(info, tab) {
  if (info.menuItemId === 'RT') {
    chrome.tabs.create({
      url:
        'https://tt.carnet.hr/rt/Ticket/Display.html?id=' + info.selectionText, // rt
    });
    return;
  } else if (info.menuItemId === 'kb-all') {
    chrome.tabs.create({
      url: `https://kb.carnet.hr/?s=${info.selectionText}&post_type=docs`, // docsi
    });
    return;
  } else if (info.menuItemId === 'kb-glossary') {
    chrome.tabs.create({
      url: `https://kb.carnet.hr/?s=${info.selectionText}&id=2540&post_type=glossary`, // rječnik
    });
    return;
  }
}
