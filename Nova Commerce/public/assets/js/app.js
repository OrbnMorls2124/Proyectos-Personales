const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.dataset.theme = savedTheme;

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
});

document.querySelectorAll('[data-toast]').forEach((toast) => {
  if (window.Swal) Swal.fire({ toast: true, position: 'top-end', timer: 2600, showConfirmButton: false, icon: toast.classList.contains('error') ? 'error' : 'success', title: toast.textContent });
  setTimeout(() => toast.remove(), 3200);
});

document.querySelector('[data-chat-toggle]')?.addEventListener('click', () => {
  document.querySelector('[data-chat]')?.classList.toggle('open');
});

const search = document.querySelector('[data-predictive-search]');
const suggestions = document.querySelector('[data-suggestions]');
let searchTimer;
search?.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = search.value.trim();
  if (q.length < 2) {
    suggestions.style.display = 'none';
    return;
  }
  searchTimer = setTimeout(async () => {
    const res = await fetch(`/api/search/predict?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    suggestions.innerHTML = data.suggestions.map((item) => `<a href="/products?q=${encodeURIComponent(item)}">${item}</a>`).join('');
    suggestions.style.display = data.suggestions.length ? 'block' : 'none';
  }, 220);
});

document.querySelector('[data-card-number]')?.addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
  event.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  document.querySelector('[data-card-mask]').textContent = event.target.value || '•••• •••• •••• ••••';
  document.querySelector('[data-card-brand]').textContent = digits.startsWith('4') ? 'VISA SIMULADA' : digits.startsWith('5') ? 'MASTERCARD SIMULADA' : 'NOVA CARD';
});

document.querySelector('[data-payment-form]')?.addEventListener('submit', (event) => {
  const method = document.querySelector('[data-payment-method]')?.value;
  if (['credit_card', 'debit_card'].includes(method)) {
    const number = document.querySelector('[data-card-number]')?.value.replace(/\D/g, '') || '';
    if (number.length < 13) {
      event.preventDefault();
      window.Swal?.fire('Revisa la tarjeta', 'Usa una tarjeta simulada válida, por ejemplo 4111 1111 1111 1111.', 'warning');
    }
  }
});

document.querySelector('[data-wishlist]')?.addEventListener('click', () => {
  window.Swal?.fire('Guardado', 'Producto agregado a wishlist en modo visual.', 'success');
});

if (document.querySelector('#productsTable') && window.DataTable) {
  new DataTable('#productsTable', { responsive: true, pageLength: 8 });
}

if (document.querySelector('#salesChart') && window.Chart) {
  new Chart(document.querySelector('#salesChart'), {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{ label: 'Ventas', data: [1200, 1900, 1600, 2600, 3200, 4100, 3800], borderColor: '#0f766e', backgroundColor: 'rgba(15,118,110,.12)', tension: .35, fill: true }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}
