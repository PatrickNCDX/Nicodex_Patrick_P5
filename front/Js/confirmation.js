/**
 * Affiche le numéro de commande sur la page "confirmation".
 * @returns {void}
 */
function main() {
    const str = window.location.href;
    const url = new URL(str);
    const orderId = url.searchParams.get("orderId");
    const idNode = document.getElementById("orderId");
    idNode.innerText = orderId;
    console.log(orderId);
}
main();
