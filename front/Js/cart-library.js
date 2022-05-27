/**
 * Un article dans le panier.
 * @typedef {{ 
 *  id: string,  
 *  colorProduct: string,
 *  quantityProduct: number,
 * }} CartArticle
 */

/**
 * Chargement du panier stocké. 
 * @returns {CartArticle[]}
 */
const loadCart = function () {
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("product"));

    if (!cartFromLocalStorage) {
        return [];
    }

    return cartFromLocalStorage;
}

/**
 * Sauvegarde du panier.
 * 
 * @returns {any<void>}
 */
const saveCart = function (productStorage) {
    const saveLocalStorage = localStorage.setItem("product", JSON.stringify(productStorage));

    if (!saveLocalStorage) {
        return [];
    }

    return saveLocalStorage;
}

