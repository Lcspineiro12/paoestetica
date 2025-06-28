document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario");
    const lista = document.getElementById("lista-gastos");
    const totalSpan = document.getElementById("total");

    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    function actualizarVista() {
        lista.innerHTML = "";
        let total = 0;

        gastos.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `$${item.monto} en concepto de ${item.concepto}`;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "🗑️";
            botonEliminar.classList.add("eliminar-btn");
            botonEliminar.onclick = () => {
                gastos.splice(index, 1);
                localStorage.setItem("gastos", JSON.stringify(gastos));
                actualizarVista();
            };

            li.appendChild(botonEliminar);
            lista.appendChild(li);
            total += parseFloat(item.monto);
        });

        totalSpan.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem("gastos", JSON.stringify(gastos));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const concepto = document.getElementById("concepto").value.trim();
        const monto = parseFloat(document.getElementById("monto").value);

        if (concepto && !isNaN(monto)) {
            gastos.push({ concepto, monto });
            form.reset();
            actualizarVista();
        } else {
            alert("Por favor completá ambos campos correctamente.");
        }
    });

    actualizarVista();
});
