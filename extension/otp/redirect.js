//

function redirect(){
try {
    let msg = document.querySelector("#content > div.message");
    console.log('reaktivacija');
    let input = document.querySelector("#trazilica");
    input.value = 'netko';
    let inputButton = document.querySelector("#content > form > input.pure-button.pure-button-primary");
    inputButton.click();

    //window.open("https://otp-login.carnet.hr/token", '_blank');
} catch {
    console.log('nastavi');
}
}
