document.addEventListener('DOMContentLoaded', function () {
  const productsURL = 'https://fakestoreapi.com/products';
  let originalProducts = [];
  let cartTotal = 0;
  const productsContainer = document.getElementById('productsContainer');

  fetch(productsURL)
    .then(response => response.json())
    .then(products => {
      originalProducts = products;
      showProducts(originalProducts);
    })
    .catch(error => {
      console.error('Error al obtener los productos:', error);
    });

  const showProducts = (productsToShow) => {
    productsContainer.innerHTML = '';
    productsToShow.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.classList.add('col-md-4', 'mb-3');
      productCard.innerHTML = `
        <div id="cardos${index + 1}" class="card h-100 rounded border border-5 border-dark">
        <img src="${product.image}" style="max-width: 100%; height: auto; max-height: 200px; object-fit: contain;" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
            <button class="btn btn-primary add-to-cart-btn" data-productid="${product.id}">Agregar al carrito</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(productCard);
    });
  };

  productsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
      const productId = parseInt(event.target.dataset.productid);
      addToCart(productId);
    }
  });

  document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = originalProducts.filter(product => product.title.toLowerCase().includes(searchTerm));
    showProducts(filteredProducts);
  });

  let cartItems = [];

  const showCart = () => {
    const cartItemCount = document.getElementById('cartItemCount');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartItemCount.textContent = totalQuantity;
    cartTotalDisplay.textContent = `$${cartTotal.toFixed(2)}`;
    checkoutBtn.textContent = `Ir al Checkout ${totalQuantity > 0 ? `(${totalQuantity})` : ''}`;
  };

  const addToCart = (productId) => {
    const productToAdd = originalProducts.find(product => product.id === productId);
    const existingCartItem = cartItems.find(item => item.id === productId);
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cartItems.push({
        id: productId,
        title: productToAdd.title,
        price: productToAdd.price,
        quantity: 1
      });
    }
    showCart();
  };

  const sortProductsAZ = () => {
    const sortedProducts = [...originalProducts].sort((a, b) => a.title.localeCompare(b.title));
    showProducts(sortedProducts);
  };

  const sortProductsByPrice = () => {
    const sortedProducts = [...originalProducts].sort((a, b) => a.price - b.price);
    showProducts(sortedProducts);
  };

  const toggleDarkMode = () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const isDarkMode = darkModeSwitch.checked;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');   
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  document.getElementById('sortAZBtn').addEventListener('click', sortProductsAZ);
  document.getElementById('sortByPriceBtn').addEventListener('click', sortProductsByPrice);
  document.getElementById('darkModeSwitch').addEventListener('change', toggleDarkMode);

  // Llamada inicial para mostrar los productos
  fetch(productsURL)
    .then(response => response.json())
    .then(products => {
      originalProducts = products;
      showProducts(originalProducts);
    })
    .catch(error => {
      console.error('Error al obtener los productos:', error);
    });
});