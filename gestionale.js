
const API_URL = "https://striveschool-api.herokuapp.com/api/product/"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4Zjc1N2U4NTlmNTAwMTQ1ZjJmYWMiLCJpYXQiOjE2OTMwMDkyMTYsImV4cCI6MTY5NDIxODgxNn0.5UBxuSPC7XEJA643alGZqp3fJ7MwsDZzBumaW7EdLpk";


// REINDIRIZZAMENTO PER TORNARE ALLA HOME
function goHome() {
    window.location.href = 'index.html'
}

// REINDIRIZZAMENTO PER ANDARE AD AGGIUNGERE UN PRODOTTO
function addProduct() {
    window.location.href = 'compilaProdotto.html'
}

// RICHIESTA GET per info dati prodotti
async function fetchProducts() {

    handleAlertMessage()

    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()

        //METTO LO SPINNER DEL CARICAMENTO
        setTimeout(() => {
            document.querySelector('#spinner-row').classList.add('d-none');
        }, 1000);

        // AGGIUNGERE PRODOTTI ALLA TABELLA
        setTimeout(() => {
            displayProducts(data);
        }, 1000);

    } catch (error) {
        console.log('Errore nel recupero dei prodotti: ', error);
    }
}

// COMPILAZIONE TABELLA
function displayProducts(products) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''

    products.forEach(product => {
        const row = `
        <tr> 
          <td class="pt-3 ps-5">${product._id}</td>
          <td class="pt-3">${product.name}</td>
          <td class="pt-3 descriptionMod">${product.description}</td>
          <td class="pt-3">${product.brand}</td>
          <td class="pt-3 url-cell">${product.imageUrl}</td>
          <td class="pt-3">${product.price} €</td>
    
          <td class="pt-2 d-flex">
          <button class="btn btn-icon iconaBottone" data-product-id="${product._id}" onclick="editProduct(this)">
          <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-icon iconaBottone" data-product-id="${product._id}" onclick="deleteProduct('${product._id}')">
          <i class="bi bi-trash3-fill"></i>
          </button>
          </td>
        </tr>
      `

        tableBody.innerHTML += row
    });
}

// RICHIESTA DELETE per eliminazione prodotti
async function deleteProduct(productId) {

    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        try {
            await fetch(`${API_URL}${productId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            window.location.href = 'gestionale.html?status=cancel-ok';


            if (response.ok) {
                const deletedProduct = document.querySelector(`[data-product-id="${productId}"]`);
                if (deletedProduct) {
                    deletedProduct.remove();
                    showAlert('delete');
                }
            } else {
                console.error('Errore durante l\'eliminazione del prodotto');
            }


        } catch (error) {
            console.log('Errore nel\'eleminazione del prodotto: ', error);
        }
    }
}

// FUNZIONE PER IL BOTTON MODIFICA 
function editProduct(buttonElement) {
    const productId = buttonElement.getAttribute('data-product-id');
    window.location.href = `compilaProdotto.html?id=${productId}`;
}

// RIMOZIONE DEI PARAMETRI DALLA STRINGA DI QUERY DELL'URL
function clearQueryString() {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
}

// ALERT AVVISO DINAMICI
function showAlert(actionType) {
    const alertCnt = document.getElementById('alert-container');
    const overlay = document.querySelector('#overlay')

    alertCnt.classList.remove('d-none');
    overlay.classList.remove('d-none');


    setTimeout(() => {
        alertCnt.style.opacity = '1';
        overlay.style.opacity = '1';
    }, 10);

    alertCnt.innerHTML = actionType === 'create'
        ? 'Prodotto creato con successo'
        : actionType === 'update'
            ? 'Prodotto modificato con successo'
            : 'Prodotto eliminato con successo'


    setTimeout(() => {


        alertCnt.style.opacity = '0';
        overlay.style.opacity = '0';

        setTimeout(() => {
            alertCnt.classList.add('d-none');
            overlay.classList.add('d-none');
        }, 400);
    }, 4000)
}

// GESTIONE ALERT IN BASE AI PARAMETRI DELL'URL
function handleAlertMessage() {

    const qsParams = new URLSearchParams(window.location.search);
    const status = qsParams.get('status')

    if (status && status === 'create-ok') showAlert('create');
    if (status && status === 'edit-ok') showAlert('update');
    if (status && status === 'cancel-ok') showAlert('cancel');

    clearQueryString()
}

fetchProducts()