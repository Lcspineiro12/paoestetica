let carrito = [];
let total = 0;
const stockDisponible = {};

const btnAbrirCarrito = document.getElementById('abrir-carrito');
const btnCerrar = document.getElementById('cerrar-carrito');
const carritoElemento = document.querySelector('.carrito');
const main = document.querySelector('main');
const totalTexto = document.getElementById('total');
const btnWA = document.getElementById('btn-whatsapp');

const topBtn = document.getElementById('btn-top');
const otherBtn = document.getElementById('btn-other');

if (topBtn && otherBtn) {
  topBtn.addEventListener('click', () => {
    topBtn.classList.add('selected');
    otherBtn.classList.remove('selected');

    document.querySelectorAll('.producto').forEach(p => {
      if (p.dataset.marca === 'top') {
        p.classList.remove('oculto');
        p.style.animation = 'none';
        void p.offsetWidth;
        p.style.animation = 'fadeInUp 0.4s ease';
      } else {
        p.classList.add('oculto');
      }
    });

    document.querySelectorAll('h3').forEach(h3 => {
      h3.classList.toggle('oculto', !h3.textContent.includes('Norma Bustos'));
    });
  });

  otherBtn.addEventListener('click', () => {
    otherBtn.classList.add('selected');
    topBtn.classList.remove('selected');

    document.querySelectorAll('.producto').forEach(p => {
      if (p.dataset.marca === 'otra') {
        p.classList.remove('oculto');
        p.style.animation = 'none';
        void p.offsetWidth;
        p.style.animation = 'fadeInUp 0.4s ease';
      } else {
        p.classList.add('oculto');
      }
    });

    document.querySelectorAll('h3').forEach(h3 => {
      h3.classList.toggle('oculto', !h3.textContent.includes('Lidherma'));
    });
  });
}

fetch('stock.json')
  .then(res => res.json())
  .then(data => {
    Object.assign(stockDisponible, data);
    inicializarProductos();
  })
  .catch(err => {
    console.error("Error al cargar el stock:", err);
    inicializarProductos();
  });

function inicializarProductos() {
  document.querySelectorAll('.producto').forEach(prod => {
    const nombre = prod.dataset.nombre;
    const precioElem = prod.querySelector('.precio');
    const botones = prod.querySelectorAll('.medida-btn');

    if (botones.length > 0) {
      const primera = botones[0];
      prod.dataset.medida = primera.dataset.medida;
      prod.dataset.precio = primera.dataset.precio;
      precioElem.textContent = `$${primera.dataset.precio}`;
      primera.classList.add('selected');
    }

    const btnAgregar = prod.querySelector('.btn-agregar');

    let stockLabel = prod.querySelector('.stock-label');
    if (!stockLabel) {
      stockLabel = document.createElement('p');
      stockLabel.classList.add('stock-label');
      prod.appendChild(stockLabel);
    }

    const medidaInicial = prod.dataset.medida;
    const productoNombreInicial = `${nombre} - ${medidaInicial}`;
    stockLabel.textContent = `Stock disponible: ${stockDisponible[productoNombreInicial] ?? 0}`;

    btnAgregar.disabled = (stockDisponible[productoNombreInicial] ?? 0) <= 0;
    btnAgregar.textContent = btnAgregar.disabled ? "NO HAY STOCK" : "Agregar al carrito";

    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        prod.dataset.medida = btn.dataset.medida;
        prod.dataset.precio = btn.dataset.precio;
        precioElem.textContent = `$${btn.dataset.precio}`;

        const productoNombre = `${nombre} - ${btn.dataset.medida}`;
        const stock = stockDisponible[productoNombre] ?? 0;

        stockLabel.textContent = `Stock disponible: ${stock}`;
        btnAgregar.disabled = stock <= 0;
        btnAgregar.textContent = stock <= 0 ? "NO HAY STOCK" : "Agregar al carrito";
      });
    });

    btnAgregar.addEventListener('click', () => {
      const medida = prod.dataset.medida;
      const precio = parseFloat(prod.dataset.precio);
      const productoNombre = `${nombre} - ${medida}`;

      if (!(productoNombre in stockDisponible)) stockDisponible[productoNombre] = 0;

      if (stockDisponible[productoNombre] <= 0) {
        btnAgregar.disabled = true;
        btnAgregar.textContent = "NO HAY STOCK";
        stockLabel.textContent = `Stock disponible: 0`;
        return;
      }

      agregarAlCarrito(productoNombre, precio);
      stockDisponible[productoNombre]--;
      stockLabel.textContent = `Stock disponible: ${stockDisponible[productoNombre]}`;
      if (stockDisponible[productoNombre] <= 0) {
        btnAgregar.disabled = true;
        btnAgregar.textContent = "NO HAY STOCK";
      }
    });
  });

  document.querySelectorAll('.producto, h3').forEach(el => el.classList.add('oculto'));

  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
      carritoElemento.classList.remove("visible");
      main.classList.remove("con-carrito-abierto");
    });
  }

  if (btnAbrirCarrito) {
    btnAbrirCarrito.addEventListener('click', () => {
      carritoElemento.classList.add("visible");
      main.classList.add("con-carrito-abierto");
    });
  }
}

function agregarAlCarrito(producto, precio) {
  const existente = carrito.find(item => item.producto === producto);
  if (existente) {
    if (existente.cantidad >= 10) {
      alert("No hay más stock disponible para este producto.");
      return;
    }
    existente.cantidad++;
    existente.precioTotal = existente.cantidad * existente.precioUnitario;
  } else {
    carrito.push({
      producto,
      cantidad: 1,
      precioUnitario: precio,
      precioTotal: precio
    });
  }
  total = carrito.reduce((acc, item) => acc + item.precioTotal, 0);
  actualizarCarrito();
}

function quitarDelCarrito(index) {
  const item = carrito[index];
  const nombre = item.producto;
  stockDisponible[nombre] = (stockDisponible[nombre] ?? 0) + 1;

  document.querySelectorAll('.producto').forEach(prod => {
    const nombreProducto = prod.dataset.nombre;
    const medida = prod.dataset.medida;
    const productoNombre = `${nombreProducto} - ${medida}`;
    if (productoNombre === nombre) {
      const btn = prod.querySelector('.btn-agregar');
      const label = prod.querySelector('.stock-label');
      btn.disabled = false;
      btn.textContent = 'Agregar al carrito';
      if (label) label.textContent = `Stock disponible: ${stockDisponible[nombre]}`;
    }
  });

  total -= item.precioTotal;
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const carritoUl = document.querySelector('.carrito ul');
  carritoUl.innerHTML = '';

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.producto} x${item.cantidad} - $${item.precioTotal}`;

    const btnQuitar = document.createElement('button');
    btnQuitar.textContent = 'Quitar';
    btnQuitar.classList.add('btn-quitar');
    btnQuitar.onclick = () => quitarDelCarrito(index);

    li.appendChild(btnQuitar);
    carritoUl.appendChild(li);
  });

  carritoUl.scrollTop = carritoUl.scrollHeight;
  totalTexto.textContent = `Total: $${total}`;

  if (carrito.length > 0) {
    btnWA.style.display = 'block';
    const numero = "5491130629201";
    let mensaje = "Hola, quiero hacer una compra:\n";
    carrito.forEach(item => {
      mensaje += `• ${item.producto} x${item.cantidad} - $${item.precioTotal}\n`;
    });
    mensaje += `Total: $${total}`;
    btnWA.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    carritoElemento.classList.add("visible");
    main.classList.add("con-carrito-abierto");
  } else {
    btnWA.style.display = 'none';
    carritoElemento.classList.remove("visible");
    main.classList.remove("con-carrito-abierto");
  }
}