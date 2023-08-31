
const API_URL = "https://striveschool-api.herokuapp.com/api/product/"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4Zjc1N2U4NTlmNTAwMTQ1ZjJmYWMiLCJpYXQiOjE2OTMwMDkyMTYsImV4cCI6MTY5NDIxODgxNn0.5UBxuSPC7XEJA643alGZqp3fJ7MwsDZzBumaW7EdLpk";


// REINDIRIZZAMENTO PER ANDARE AL GESTIONALE
function gestionale() {
    window.location.href = 'gestionale.html'
}

// RICHIESTA GET per info dati prodotti
async function fetchData() {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Si è verificato un errore', error);
    }
}

// COSTRUZIONE DISPLAY PRODOTTI
function displayProducts(products) {
    const productContainer = document.getElementById('productContainer');

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('mod', 'col-xxl-3', 'col-xl-4', 'col-lg-4', 'col-md-6', 'col-sm-6',)
        productElement.innerHTML = `

            <div class="card" style="width: 250px;">
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="card-body">
                    <h1 class="card-title d-flex  align-items-center">${product.name}</h1>
                    <p class="card-text d-flex align-items-center mt-3 truncate-text">${product.brand}</p>
                        
                        <div class="d-flex align-items-center justify-content-around mb-2">         
                             <button type="button" class="btnmod btn-primary d-flex justify-content-center align-items-center"
                                 data-product-id="${product._id}" onclick="viewProduct('${product._id}')""> Dettagli </button>
                             <span class="card-text "> ${product.price}€</span>
                        </div>
                </div>
            </div>
        `;

        productContainer.appendChild(productElement);
    });
}

// GET CON ID PER RIEMPIRE IL MODAL
async function viewProduct(productId) {
    try {
        const response = await fetch(`${API_URL}${productId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const product = await response.json();


        populateModal(product);


        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();

    } catch (error) {
        console.log('Errore nel recupero del prodotto: ', error);
    }
}

// COSTRUZIONE DEL MODAL
function populateModal(product) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        
        <h1><strong></strong> ${product.name}</h1>
        <img class="imgModal" src="${product.imageUrl}" alt="${product.name}">
        <p class='mt-3'><strong></strong> ${product.description}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Prezzo:</strong> ${product.price} €</p>
    `;
}

fetchData();