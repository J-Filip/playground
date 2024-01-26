
 document.addEventListener('DOMContentLoaded', () => {

let spranca = `obavještavamo Vas da je sada dostupna produkcijska verzija sustava CARNET sigma za korisnike koje ste naveli u tablici.

Poveznica za pristup je: https://sigma.e-skole.hr/.


Dodatne upute za prijavu te kako se dolazi do svih korisničkih uputa možete pronaći ovdje: https://www.carnet.hr/wp-content/uploads/2018/11/SIGMA-op%C4%87e-upute-1.pdf.

Sve video upute možete pronaći na sljedećoj poveznici: https://meduza.carnet.hr/index.php/media/videos?pack=553 .

Također, edukaciju za modul “Urudžbeni zapisnik” se nalazi na sljedećoj poveznici: https://meduza.carnet.hr/index.php/media/watch/28497 .
`

// fjugkala@carnet.hr




let cleanButton = document.getElementById('clean')
cleanButton.addEventListener('click',cleanLinks)



async function cleanLinks(){
     event.preventDefault()
    let boxValue = document.querySelector("#mejlomlat").value;
   
    // console.log(boxValue);
    
    let re = /(\bhttp\S+\b)/ig;
    
    let newStr = await boxValue.replace(re, `<a href="$&">$&</a>`)
    // console.log(newStr);
    

    document.querySelector("#mejlomlat").value = newStr
    
}



 cleanLinks()

 });



 // cn helper

  function cleanLinks(){
     let re = /(\bhttp\S+\b)/ig;
   
     let boxValue = document.querySelector("#description_ifr")
     let newValue = boxValue.contentWindow.document.getElementsByTagName('body')
  
   for(e of newValue){
       
        let newStr = e.innerText.replace(re, `<a href="$&">$&</a>`)
        e.innerText = newStr
        // console.log(newStr);
   }

return 'Done'
}

cleanLinks()



function cleanLinks(){
    let re = /(\bhttp\S+\b)/ig;
  
    let boxValue = document.querySelector("#description_ifr")
    let newValue = boxValue.contentWindow.document.getElementsByTagName('body')
 
 
       let newStr = newValue.innerText.replace(re, `<a href="$&">$&</a>`)
       newValue.innerText = newStr
       // console.log(newStr);

return 'Done'
}

cleanLinks()