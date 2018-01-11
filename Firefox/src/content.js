/**
 * Quand le content reçoit un message du background script,
 * il doit toujours l'afficher. Le message contient un objet JSON:
 * {
 *  maj: Age de la mise à jour,
 *  depas: A quel point la mise à jour dépasse la duree critique
 * }
 * 
 */
browser.runtime.onMessage.addListener(message => {
    alert(message.depas)
})