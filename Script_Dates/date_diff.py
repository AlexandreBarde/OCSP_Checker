# coding: utf-8

import datetime


def duree(d):
    """
    Retourne le temps écoulé depuis la date
    d jusqu'a cet instant, d sera de la forme
    Nov 7 10:20:26 2017 GMT
    """

    month_to_int = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12
    }

    # Le mois correspond au 3 premier caracteres
    mois, jour, heure, annee, fuseau = d.split()
    # Objet date
    date_obj = datetime.date(int(annee), month_to_int[mois], int(jour))
    # Date actuelle
    date_curr = datetime.date.today()
    # Différence entre les 2 dates
    elapsed_time = date_curr - date_obj
    return elapsed_time


date_test = "Nov 3 10:20:26 2017 GMT"
print(duree(date_test))
