/*function valueToAction(value)
{
    notif1();
}
 */

function notif1()
{
  //var makeItGreen = 'alert("LE JS CA PUE LA MERDE !");';


  /* browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    alert("Okee");
    document.body.style.cursor = "url(icon2.png) 4 12, auto";
  }); */
  //return document.body.style.cursor = "url(icon2.png) 4 12, auto";
}

function notif2()
{
  alert("Oke");
}

function notif3()
{
  alert("Oke");
}

function notif4()
{
  alert("Oke");
}

function notif5()
{
  alert("Oke");
}

function onExecuted()
{
  console.log(":D");
}

function onError(log)
{
  ;console.log(`Erreur : ${log}`);
}

//Quand on clique sur les divs (popup)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("test"))
  {
    //On récupère le message sur lequel on a cliqué

    //var test = 'alert(oke);');
    var test2 = 'document.body.style.cursor = url(icon2.png) 4 12, auto;';
    var test = browser.tabs.executeScript({
      code: test2
    //  code: test2
    });
    test.then(onExecuted, onError);

  //  valueToAction(e.target.textContent);
  }
  //Permet de 'reset' la page
  else if (e.target.classList.contains("clear"))
  {
    browser.tabs.reload();
    window.close();
  }
});
