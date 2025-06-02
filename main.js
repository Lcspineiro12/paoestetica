let gastos = [];
let conceptos = [];
let seguir = true;

function ingresarDatos() {
    while (seguir) {
        let gasto = prompt("Ingresá un gasto:");
        let concepto = prompt("Ingresa el concepto del gasto ingresado:");
        if (concepto && gasto) {
            gastos.push(gasto);
            conceptos.push(concepto);
        } else {
            alert("No ingresaste nada.");
        }

        seguir = confirm("¿Querés agregar otro?");
    }
}

function calcularListaDeGastos() {
    let mensaje = "Lista de gastos ingresados:\n";
    for (let i = 0; i < gastos.length; i++) {
        mensaje += `$${gastos[i]} en concepto de ${conceptos[i]}\n`;
    }
    return mensaje;
}

function calcularTotalDeGastos() {
    let totalGastos = 0;
    for (let i = 0; i < gastos.length; i++) {
        let monto = parseFloat(gastos[i]);
        if (!isNaN(monto)) {
            totalGastos += monto;
        }
    }
    return totalGastos;
}

function mensajeFinal () {
    ingresarDatos();
    let mensaje = calcularListaDeGastos();
    let totalGastos = calcularTotalDeGastos();
    let total = `El total de los gastos ingresados es de: $${totalGastos}`;
    alert(`${mensaje}\n${total}`);
}

mensajeFinal();





