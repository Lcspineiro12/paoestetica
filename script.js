let carrito = [];
let total = 0;

function agregarAlCarrito(producto, precio) {
  carrito.push({ producto, precio });
  total += precio;
  actualizarCarrito();
}

function quitarDelCarrito(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalTexto = document.getElementById('total');
  const btnWA = document.getElementById('btn-whatsapp');
  const carritoElemento = document.querySelector('.carrito');
  const main = document.querySelector('main');

  lista.innerHTML = '';

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.producto} - $${item.precio}`;

    const btnQuitar = document.createElement('button');
    btnQuitar.textContent = '❌ Quitar';
    btnQuitar.className = 'btn-quitar';
    btnQuitar.onclick = () => quitarDelCarrito(index);

    li.appendChild(btnQuitar);
    lista.appendChild(li);
  });

  totalTexto.textContent = `Total: $${total}`;

  if (carrito.length > 0) {
    btnWA.style.display = 'block';
    const numero = "5491130629201";
    let mensaje = "Hola, quiero hacer una compra:\n";
    carrito.forEach(item => mensaje += `• ${item.producto} - $${item.precio}\n`);
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

// --------- Medidas, precios y cierre de carrito ---------
document.addEventListener('DOMContentLoaded', () => {
  // Manejo de productos
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

    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        prod.dataset.medida = btn.dataset.medida;
        prod.dataset.precio = btn.dataset.precio;
        precioElem.textContent = `$${btn.dataset.precio}`;
      });
    });

    const btnAgregar = prod.querySelector('.btn-agregar');
    btnAgregar.addEventListener('click', () => {
      const medida = prod.dataset.medida;
      const precio = parseFloat(prod.dataset.precio);
      agregarAlCarrito(`${nombre} - ${medida}`, precio);
    });
  });

  // Botón cerrar carrito
  const btnCerrar = document.getElementById('cerrar-carrito');
  const carritoElemento = document.querySelector('.carrito');
  const main = document.querySelector('main');

  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
      carritoElemento.classList.remove('visible');
      main.classList.remove('con-carrito-abierto');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ... tu código de productos, medidas, etc.

  // ✅ Asegurar referencia al carrito y botón
  const btnCerrar = document.querySelector('#cerrar-carrito');
  const carritoElemento = document.querySelector('.carrito');
  const main = document.querySelector('main');

  if (btnCerrar && carritoElemento && main) {
    btnCerrar.addEventListener('click', () => {
      carritoElemento.classList.remove('visible');
      main.classList.remove('con-carrito-abierto');
    });
  } else {
    console.warn('No se encontró el botón o el carrito para cerrar');
  }
});
