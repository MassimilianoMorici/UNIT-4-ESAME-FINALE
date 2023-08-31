
const API_URL = "https://striveschool-api.herokuapp.com/api/product/"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4Zjc1N2U4NTlmNTAwMTQ1ZjJmYWMiLCJpYXQiOjE2OTMwMDkyMTYsImV4cCI6MTY5NDIxODgxNn0.5UBxuSPC7XEJA643alGZqp3fJ7MwsDZzBumaW7EdLpk";

const form = document.getElementById('product-form');

const productIdInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');


// CHIAMATA PUT o POST A SECONDA SE PRESENTE L'ID NELL'URL
form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const isFormValid = handelFormValidation();
  if (!isFormValid) return false;


  const product = {
    name: nameInput.value,
    description: descriptionInput.value,
    brand: brandInput.value,
    imageUrl: imageUrlInput.value,
    price: priceInput.value,
  }


  try {

    const URL = productIdInput.value
      ? `${API_URL}${productIdInput.value}`
      : `${API_URL}`

    const HTTP_METHOD = productIdInput.value ? 'PUT' : 'POST'

    const response = await fetch(URL, {
      method: HTTP_METHOD,
      body: JSON.stringify(product),
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    })


    if (response.ok) {
      window.location.href = productIdInput.value
        ? 'gestionale.html?status=edit-ok'
        : 'gestionale.html?status=create-ok'
    } else {
      alert('Si è verificato un errore durante la creazione del prodotto.')
    }


  } catch (error) {
    console.log('Errore durante il salvataggio: ', error);
    alert('Si è verificato un errore durante il salvataggio.')
  }
})

// GESTIONE VALIDAZIONE DEL FORM
function handelFormValidation() {
  const validation = validateForm();
  let isValid = true;

  if (!validation.isValid) {
    for (const field in validation.errors) {
      const errorElement = document.getElementById(`${field}-error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.textContent = validation.errors[field];
      } else {
        console.error(`Elemento non trovato: ${field}-error`);
      }
    }
    isValid = false;
  }
  return isValid;
}

// VALIDAZIONE CAMPI DEL FORM
function validateForm() {
  const errors = {}

  const name = document.getElementById('name').value
  const description = document.getElementById('description').value
  const brand = document.getElementById('brand').value
  const imageUrl = document.getElementById('imageUrl').value
  const price = document.getElementById('price').value


  if (!name) errors.name = "Il campo nome è obbligatorio."
  else errors.name = "";

  if (!description) errors.description = "Il campo descrizione è obbligatorio."
  else errors.description = "";

  if (!brand) errors.brand = "Il campo brand è obbligatorio."
  else errors.brand = "";

  if (!imageUrl) errors.imageUrl = "Il campo URL immagine è obbligatorio."
  else if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(imageUrl)) {
    errors.imageUrl = "Inserisci un URL valido.";
  }
  else errors.imageUrl = "";

  if (!price) errors.price = "Il campo prezzo è obbligatorio."
  else errors.price = "";

  return {
    isValid: Object.values(errors).every(value => value === ''),
    errors
  }
}

// CAMBIO TITOLO PAGINA A SECONDA SE PUT O POST
function buildTitle(productId) {
  const pageTitle = document.getElementById('page-title');
  pageTitle.innerHTML = productId ? 'Modifica Prodotto' : 'Inserisci nuovo Prodotto';
}

// CHIAMATA GET PER RIEMPIRE I CAMPI FORM PER EFFETTUARE SUCCESSIVAMENTE IL PUT
async function getProductData() {
  const qsParams = new URLSearchParams(window.location.search);
  const productId = qsParams.get('id');

  buildTitle(productId);

  if (productId) {


    try {
      const response = await fetch(`${API_URL}${productId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      const product = await response.json();

      setTimeout(() => {
        document.querySelector('#spinner-row').classList.add('d-none');
        document.querySelector('#product-form').classList.remove('d-none');
        document.querySelector('#page-title').classList.remove('d-none')
      }, 500)

      if (!('name' in product)) {
        console.log('Il prodotto non esiste');
        return
      }

      productIdInput.value = product._id;
      nameInput.value = product.name;
      descriptionInput.value = product.description;
      brandInput.value = product.brand;
      imageUrlInput.value = product.imageUrl;
      priceInput.value = product.price;


    } catch (error) {
      console.log('Errore nel recupero dei prodotti: ', error);
    }


  } else {
    // CREAZIONE PRODOTTO
    document.querySelector('#spinner-row').classList.add('d-none');
    document.querySelector('#product-form').classList.remove('d-none');
    document.querySelector('#page-title').classList.remove('d-none');
  }
}

// REINDIRIZZAMENTO PER TORNARE AL GESTIONALE
function goBack() {
  window.location.href = 'gestionale.html'
}

getProductData()