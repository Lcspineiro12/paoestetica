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

  // WhatsApp link
  if (carrito.length > 0) {
    btnWA.style.display = 'block';

    const numero = "5491130629201";
    let mensaje = "Hola, quiero hacer una compra:\n";
    carrito.forEach((item) => {
      mensaje += `• ${item.producto} - $${item.precio}\n`;
    });
    mensaje += `Total: $${total}`;
    
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    btnWA.href = url;
  } else {
    btnWA.style.display = 'none';
  }
}
