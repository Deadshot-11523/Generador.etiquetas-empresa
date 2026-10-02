function agregarProducto() {
    const contenedor = document.getElementById('lista-productos');
    const primeraFila = contenedor.querySelector('.producto-item');
    
    const nuevaFila = primeraFila.cloneNode(true);

    // Limpiar los valores de la nueva fila
    nuevaFila.querySelector('select').value = 'ekipment.jpg';
    nuevaFila.querySelector('input[name="codigo"]').value = '';
    nuevaFila.querySelector('input[name="nombre"]').value = '';
    nuevaFila.querySelector('input[name="precio"]').value = '';
    nuevaFila.querySelector('input[name="cantidad"]').value = '1';
    
    nuevaFila.querySelector('.btn-eliminar').style.display = 'block';

    contenedor.appendChild(nuevaFila);
    actualizarBotonesEliminar();
}

function eliminarFila(btn) {
    const fila = btn.closest('.producto-item');
    fila.remove();
    actualizarBotonesEliminar();
}

function actualizarBotonesEliminar() {
    const filas = document.querySelectorAll('.producto-item');
    filas.forEach((fila) => {
        const btnEliminar = fila.querySelector('.btn-eliminar');
        if (filas.length > 1) {
            btnEliminar.style.display = 'block';
        } else {
            btnEliminar.style.display = 'none';
        }
    });
}

async function generarEtiquetas(event) {
    event.preventDefault(); 

    const filas = document.querySelectorAll('.producto-item');
    const contenedorEtiquetas = document.getElementById('contenedor-etiquetas');

    contenedorEtiquetas.innerHTML = '';

    filas.forEach(fila => {
        const empresa = fila.querySelector('select').value;
        const codigo = fila.querySelector('input[name="codigo"]').value.trim();
        const nombre = fila.querySelector('input[name="nombre"]').value.trim();
        const precio = fila.querySelector('input[name="precio"]').value.trim();
        const cantidad = parseInt(fila.querySelector('input[name="cantidad"]').value) || 1;

        // Determinar la clase del borde según la opción elegida
        let claseBorde = 'borde-ekipment';
        if (empresa.toLowerCase().includes('hoverd')) {
            claseBorde = 'borde-hoverd';
        } else if (empresa.toLowerCase().includes('atp')) {
            claseBorde = 'borde-atp';
        } else if (empresa.toLowerCase().includes('proyectos')) {
            claseBorde = 'borde-proyectos';
        }

        for (let i = 0; i < cantidad; i++) {
            const etiquetaHTML = `
                <div class="etiqueta-box ${claseBorde}">
                    <div class="info-seccion">
                        <div class="nombre-producto">${nombre.toUpperCase()}</div>
                        <div class="pie-etiqueta">
                            <span class="precio-producto">${precio ? precio.toUpperCase() : ''}</span>
                            <span class="codigo-producto">${codigo.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="logo-seccion">
                        <img src="${empresa}" alt="Logo Marca">
                    </div>
                </div>
            `;

            contenedorEtiquetas.innerHTML += etiquetaHTML;
        }
    });

    // Cambiar a la vista de impresión
    document.getElementById('vista-formulario').style.display = 'none';
    document.getElementById('vista-impresion').style.display = 'block';

    // Esperar a que carguen las imágenes
    const imagenes = contenedorEtiquetas.querySelectorAll('img');
    const promesasImagenes = Array.from(imagenes).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });

    await Promise.all(promesasImagenes);

    // Abrir la ventana de impresión
    window.print();
}

function volverAlFormulario() {
    document.getElementById('vista-impresion').style.display = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
}