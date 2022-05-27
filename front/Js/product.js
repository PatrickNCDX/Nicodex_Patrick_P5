var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");
console.log(idProduct);
let article = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

getArticle();

/**
 * Un article récupéré depuis l'API.
 * @typedef {{ 
 *  _id: string, 
 *  name: string, 
 *  price: number, 
 *  imageUrl: string,
 *  description: string, 
 *  altTxt: string, 
 *  colors: string[]
 * }} Article
 */

/**
 * Récupération des articles de l'API
 * @return {Promise<Article[]>}
 */
function getArticle() {
    fetch("http://localhost:3000/api/products/" + idProduct)
        .then((res) => {
            return res.json();
        })

        // Répartition des données de l'API dans le DOM
        .then(async function (resultatAPI) {
            article = await resultatAPI;
            console.table(article);
            if (article) {
                getPost(article);
            }
        })
        .catch((error) => {
            console.log("Erreur de la requête API");
        })
}
/**
 * Insertion des informations des produits
 * @param {*} article 
 * @returns {article<any>}
 */
function getPost(article) {
    // Insertion de l'image
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Insertion "h1"
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

    // Insertion du prix
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Insertion de la description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Insertion des options de couleurs
    for (let colors of article.colors) {
        console.table(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
    addToCart(article);
}

/**
 * Ajout des produits dans le panier.
 * @param {*} article 
 * @returns  {article<void>}
 */
function addToCart(article) {
    const btn_envoyerPanier = document.querySelector("#addToCart");

    //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", (event) => {
        if (quantityPicked.value > 0 && quantityPicked.value <= 100 && quantityPicked.value != 0) {

            //Recupération du choix de la couleur
            let choixCouleur = colorPicked.value;

            //Recupération du choix de la quantité
            let choixQuantite = quantityPicked.value;

            //Récupération des options de l'article à ajouter au panier
            let optionsProduct = {
                id: idProduct,
                colorProduct: choixCouleur,
                quantityProduct: Number(choixQuantite),
            };

            //Initialisation du local storage
            let productStorage = loadCart();
            //fenêtre pop-up
            const popupConfirmation = () => {
                if (window.confirm(`Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier
Pour consulter votre panier, cliquez sur OK`)) {
                    window.location.href = "cart.html";
                }
            }

            const resultFind = productStorage.find(
                (el) => el.id === idProduct && el.colorProduct === choixCouleur);
            //Si le produit commandé est déjà dans le panier
            if (resultFind) {
                let newQuantite =
                    parseInt(optionsProduct.quantityProduct) + parseInt(resultFind.quantityProduct);
                resultFind.quantityProduct = newQuantite;
                saveCart(productStorage);
                console.table(productStorage);
                popupConfirmation();
                //Si le produit commandé n'est pas dans le panier
            } else {
                productStorage.push(optionsProduct);
                saveCart(productStorage);
                console.table(productStorage);
                popupConfirmation();
            }
        }
    });
}