//Initialisation du local storage
let productStorage = [];


// Tableau de détails des produits
let productDetails = [];

// Si le panier est vide
/**
 * Gestion du panier.
 * @returns {Promise<void>}
 */
async function getCart() {
    // Récupérer les informations des articles avec des fetch
    productDetails = [];
    for (const product of productStorage) {
        const productResponse = await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then((res) => {
                return res.json();
            });
        productDetails.push({
            ...product,
            nameProduct: productResponse.name,
            priceProduct: productResponse.price,
            imgProduct: productResponse.imageUrl,
            altImgProduct: productResponse.altTxt
        });
    }
    console.log(productDetails);

    const cartItemsHTML = document.querySelector("#cart__items");
    if (productDetails.length == 0) {
        const emptyCart = `<p>Votre panier est vide</p>`;
        cartItemsHTML.innerHTML = emptyCart;
    }
    else {
        // Vider le div
        cartItemsHTML.innerHTML = "";

        // Ajouter les éléments dans le HTML
        for (const product of productDetails) {

            // Insertion de l'élément "ID"
            let productArticle = document.createElement("article");
            cartItemsHTML.appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', product.id);

            // Insertion de l'élément "cart__item__img"
            let productDivImg = document.createElement("div");
            productArticle.appendChild(productDivImg);
            productDivImg.className = "cart__item__img";

            // Insertion de l'image
            let productImg = document.createElement("img");
            productDivImg.appendChild(productImg);
            productImg.src = product.imgProduct;
            productImg.alt = product.altImgProduct;

            // Insertion de l'élément "div"
            let productItemContent = document.createElement("cart__item__content");
            productArticle.appendChild(productItemContent);
            productItemContent.className = "cart__item__content";

            // Insertion de l'élément "div"
            let productItemContentTitlePrice = document.createElement("cart__item__content__titlePrice");
            productItemContent.appendChild(productItemContentTitlePrice);
            productItemContentTitlePrice.className = "cart__item__content__titlePrice";

            // Insertion du titre h3
            let productTitle = document.createElement("h2");
            productItemContentTitlePrice.appendChild(productTitle);
            productTitle.innerHTML = product.nameProduct;

            // Insertion de la couleur
            let productColor = document.createElement("p");
            productTitle.appendChild(productColor);
            productColor.innerHTML = product.colorProduct;
            productColor.style.fontSize = "20px";

            // Insertion du prix
            let productPrice = document.createElement("p");
            productItemContentTitlePrice.appendChild(productPrice);
            productPrice.innerHTML = product.priceProduct + " €";

            // Insertion de l'élément "div"
            let productItemContentSettings = document.createElement("cart__item__content__settings");
            productItemContent.appendChild(productItemContentSettings);
            productItemContentSettings.className = "cart__item__content__settings";

            // Insertion de l'élément "div"
            let productItemContentSettingsQuantity = document.createElement("cart__item__content__settings__quantity");
            productItemContentSettings.appendChild(productItemContentSettingsQuantity);
            productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

            // Insertion de "Qté : "
            let productQte = document.createElement("p");
            productItemContentSettingsQuantity.appendChild(productQte);
            productQte.innerHTML = "Qté : ";

            // Insertion de la quantité
            let productQuantity = document.createElement("input");
            productItemContentSettingsQuantity.appendChild(productQuantity);
            productQuantity.value = product.quantityProduct;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // Insertion de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("cart__item__content__settings__delete");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // Insertion de "p" supprimer
            let productSupprimer = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productSupprimer);
            productSupprimer.className = "deleteItem";
            productSupprimer.innerHTML = "Supprimer";
        }
    }
}
/**
 * Calcul du prix total.
 * @returns {any}
 */
function getTotals() {
    console.log("getTotals");
    let totalQtt = 0;
    let totalPrice = 0;
    for (const product of productDetails) {
        console.log("product", product);
        totalQtt += product.quantityProduct;
        totalPrice += (product.quantityProduct * product.priceProduct);
    }

    console.log(totalQtt);
    console.log(totalPrice);

    const productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQtt;

    const productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;
}

/**
 * Modification d'une quantité de produit
 * @returns {any}
 */
function modifyQtt() {
    let qttModif = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < qttModif.length; k++) {
        qttModif[k].addEventListener("change", (event) => {
            event.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let quantityModif = productStorage[k].quantityProduct;
            let qttModifValue = qttModif[k].valueAsNumber;

            const resultFind = productStorage.find((el) => el.qttModifValue !== quantityModif);

            resultFind.quantityProduct = qttModifValue;
            productStorage[k].quantityProduct = resultFind.quantityProduct;

            saveCart(productStorage);

            // refresh
            onLoad();
        })
    }
}
/**
 * Suppression d'un produit
 * @returns {void}
 */
function deleteButton() {
    let btn_supprimer = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < btn_supprimer.length; j++) {
        btn_supprimer[j].addEventListener("click", (event) => {
            event.preventDefault();

            //Selection de l'element à supprimer en fonction de son id ET sa couleur
            let idDelete = productStorage[j].id;
            let colorDelete = productStorage[j].colorProduct;

            productStorage = productStorage.filter(el => el.id !== idDelete || el.colorProduct !== colorDelete);

            saveCart(productStorage);

            //Alerte produit supprimé et refresh
            alert("Ce produit a bien été supprimé du panier");
            onLoad();
        })
    }
}

/**
 * Instauration formulaire avec regex
 * @returns {void}
 */
function getForm() {
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    });

    // Ecoute de la modification du nom
    form.lastName.addEventListener('change', function () {
        validLastName(this);
    });

    // Ecoute de la modification de l'adresse
    form.address.addEventListener('change', function () {
        validAddress(this);
    });

    // Ecoute de la modification de la ville
    form.city.addEventListener('change', function () {
        validCity(this);
    });

    // Ecoute de la modification du mail
    form.email.addEventListener('change', function () {
        validEmail(this);
    });

    /**
     * validation du prénom
     * @param {any<void>} inputFirstName 
     */
    const validFirstName = function (inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (charRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };


    /**
     * validation du nom
     * @param {any<void>} inputLastName 
     */
    const validLastName = function (inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (charRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    /**
     * validation de l'adresse
     * @param {any<void>} inputAddress 
     */
    const validAddress = function (inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    /**
     * validation de la ville
     * @param {any<void>} inputCity 
     */
    const validCity = function (inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (charRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    /**
     * validation de l'email
     * @param {any<void>} inputEmail 
     */
    const validEmail = function (inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
        }
    };
}


/**
 * Envoi des informations client
 * @returns {void}
 */
function postFormButton() {
    const btn_commander = document.getElementById("order");

    //Ecouter le panier
    btn_commander.addEventListener("click", (event) => {
        event.preventDefault();

        //Récupération des coordonnées du formulaire client
        let inputName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAdress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputMail = document.getElementById('email');

        //Construction d'un array depuis le local storage
        console.log("productStorage", productStorage);

        let idProducts = [];
        for (let i = 0; i < productStorage.length; i++) {
            idProducts.push(productStorage[i].id);
        }
        console.log(idProducts);

        const order = {
            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: idProducts,
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        fetch("http://localhost:3000/api/products/order", options)
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                localStorage.clear();
                document.location.href = `confirmation.html?orderId=${data.orderId}`;
                console.log(data);
            })
            .catch((err) => {
                alert("Problème avec fetch : " + err);
            });
    })
}

/**
 * @returns {promise<void>}
 */
const onLoad = async function () {
    productStorage = loadCart();
    console.table(productStorage);

    await getCart();
    getTotals();
    modifyQtt();
    deleteButton();
    getForm();
    postFormButton();
}

onLoad();