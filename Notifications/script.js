function afficherFenetre(position)
 {
   switch (position) {
     case "haut_gauche":
        document.getElementById('notif').style.top = '5%';
        document.getElementById('notif').style.left = '3%';
        document.getElementById('notif').style.bottom = 'auto';
        document.getElementById('notif').style.right = 'auto';
        break;
     case "haut_droite":
        document.getElementById('notif').style.top = '5%';
        document.getElementById('notif').style.left = 'auto';
        document.getElementById('notif').style.right = '3%';
        document.getElementById('notif').style.bottom = 'auto';
        break;
     case "bas_gauche":
        document.getElementById('notif').style.top = 'auto';
        document.getElementById('notif').style.bottom = '5%';
        document.getElementById('notif').style.left = '3%';
        document.getElementById('notif').style.riht = 'auto';
        break;
     case "bas_droite":
        document.getElementById('notif').style.bottom = '5%';
        document.getElementById('notif').style.right = '3%';
        document.getElementById('notif').style.left = 'auto';
        document.getElementById('notif').style.top = 'auto';
        break;
     default:

   }
    document.getElementById('notif').style.visibility = 'visible';
}
