document.addEventListener("DOMContentLoaded", () => {
  // Pillamos los elementos del menú del móvil
  const btnMenu = document.querySelector(".btn-menu");
  const menu = document.querySelector(".nav-header .menu");

  if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
      // Alternamos la clase activo para desplegarlo o recogerlo
      menu.classList.toggle("activo");
      
      // Actualizamos el aria-expanded por buenas prácticas de accesibilidad
      const estaExpandido = menu.classList.contains("activo");
      btnMenu.setAttribute("aria-expanded", estaExpandido);
    });
  }

  // Animación de las tarjetas al ir haciendo scroll
  const tarjetas = document.querySelectorAll('.card');
  const observadorTarjetas = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      // Cuando la tarjeta entra en la pantalla, le clavamos la clase para que aparezca
      if (entrada.isIntersecting) entrada.target.classList.add('visible');
    });
  });
  
  // Ponemos al observador a vigilar todas las cards
  tarjetas.forEach(tarjeta => observadorTarjetas.observe(tarjeta));


  // Funcionalidad del botón de volver arriba y atajo de teclado
  const cabeceraPrincipal = document.querySelector('.header');
  const botonSubir = document.getElementById('btnSubir');

  // Metemos la acción de subir en una función para reutilizarla y no repetir código a lo tonto
  function irHaciaArriba() {
    if (cabeceraPrincipal) {
      // Si existe la cabecera, subimos suavemente hacia ella
      cabeceraPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback a la vieja escuela por si acaso
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  // Escuchamos si se pulsa Alt + T para ejecutar la subida
  document.addEventListener('keydown', function(evento) {
    if (evento.altKey && (evento.code === 'KeyT' || evento.key.toLowerCase() === 't')) {
      evento.preventDefault(); 
      irHaciaArriba(); 
    }
  });

  // Le pasamos esa misma función al clic del botón flotante
  if (botonSubir) {
    botonSubir.addEventListener("click", irHaciaArriba); 
  }

  // Usamos otro IntersectionObserver en lugar de window.onscroll para no destrozar el rendimiento
  if (cabeceraPrincipal && botonSubir) {
    const observadorCabecera = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        // Si perdemos de vista el header porque hemos bajado, mostramos el botón
        if (!entrada.isIntersecting) {
          botonSubir.style.display = "flex"; // Con flex para que no se rompa el centrado del icono
        } else {
          // Si volvemos arriba y el header se ve, escondemos el botón
          botonSubir.style.display = "none";
        }
      });
    });

    // Lo ponemos a vigilar el header
    observadorCabecera.observe(cabeceraPrincipal);
  }
});



const pistaProductos = document.getElementById('pistaProductos');
  const flechaIzq = document.querySelector('.flecha-izq');
  const flechaDer = document.querySelector('.flecha-der');

  if (pistaProductos && flechaIzq && flechaDer) {
    // Calculamos cuánto tiene que saltar. Pillamos el ancho de una tarjeta y le sumamos el gap.
    // Usamos 300 como un salto estándar seguro si no podemos calcularlo exacto.
    const saltoDesplazamiento = 300; 

    // Al hacer clic en la flecha derecha, movemos el scroll en positivo
    flechaDer.addEventListener('click', () => {
      pistaProductos.scrollBy({
        left: saltoDesplazamiento,
        behavior: 'smooth'
      });
    });

    // Al hacer clic en la flecha izquierda, movemos el scroll en negativo
    flechaIzq.addEventListener('click', () => {
      pistaProductos.scrollBy({
        left: -saltoDesplazamiento,
        behavior: 'smooth'
      });
    });
  }



  const botonesAcordeon = document.querySelectorAll('.acordeon-cabecera');

  botonesAcordeon.forEach(boton => {
    boton.addEventListener('click', function() {
      // Pillamos el contenedor padre (el .acordeon-item)
      const itemActual = this.parentElement;
      const estaActivo = itemActual.classList.contains('activo');

      // Si abrimos uno los demñas se cierran
      document.querySelectorAll('.acordeon-item').forEach(item => {
        item.classList.remove('activo');
        item.querySelector('.acordeon-cabecera').setAttribute('aria-expanded', 'false');
      });

      // Si no estaba activo, lo abrimos. Si ya estaba abierto, se quedará cerrado por el paso anterior
      if (!estaActivo) {
        itemActual.classList.add('activo');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });





  const contenedorNotificaciones = document.getElementById('contenedor-notificaciones');

  // Función maestra para crear la notificación de la nada
  function mostrarNotificacion(mensaje, tipo = 'exito') {
    if (!contenedorNotificaciones) return;

    const nuevaNotificacion = document.createElement('div');
    nuevaNotificacion.classList.add('notificacion', tipo);

    // Metemos el mensaje directamente, sin iconos ni complicaciones
    nuevaNotificacion.innerHTML = `<span>${mensaje}</span>`;

    contenedorNotificaciones.appendChild(nuevaNotificacion);

    // Temporizador para que desaparezca sola a los 3 segundos
    setTimeout(() => {
      nuevaNotificacion.classList.add('saliendo');
      setTimeout(() => {
        nuevaNotificacion.remove();
      }, 400); 
    }, 3000);
  }
 // Enganchamos el aviso al botón principal de comprar el ratón
  const btnComprarProducto = document.querySelector('.btn-comprar');
  if (btnComprarProducto) {
    btnComprarProducto.addEventListener('click', (e) => {
      e.preventDefault(); 
      mostrarNotificacion('¡Ratón HyperClick añadido al carrito!', 'exito');
    });
  }

  // Hacemos lo mismo para todos los botones de la papelera en el carrusel
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      //lanzamos la notificaion
      mostrarNotificacion('Producto eliminado de favoritos', 'aviso');
    });
  });











  // 1. Array que actúa como nuestra "mochila"
  let carrito = JSON.parse(localStorage.getItem('costatech_carrito')) || [];

  const panelCarrito = document.getElementById('carrito-lateral');
  const overlayCarrito = document.getElementById('overlay-carrito');
  const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
  const divListaCarrito = document.getElementById('lista-carrito-lateral');
  const spanTotalLateral = document.getElementById('total-carrito-lateral');
  
  // Variables para el Modal
  const modal = document.getElementById('modal-confirmacion');
  const btnConfirmarBorrado = document.getElementById('btn-confirmar-borrado');
  const btnCancelarBorrado = document.getElementById('btn-cancelar-borrado');
  let idProductoABorrar = null;

  // --- FUNCIONES DE MEMORIA ---
  function guardarCarrito() {
    localStorage.setItem('costatech_carrito', JSON.stringify(carrito));
    renderizarCarritoLateral();
  }

  // --- ABRIR Y CERRAR EL PANEL ---
  // Busca el icono del carrito en el header (por el href que tenías)
  const iconosCarrito = document.querySelectorAll('a[href="/carrito"]');
  iconosCarrito.forEach(icono => {
    icono.addEventListener('click', (e) => {
      e.preventDefault(); // Evita ir a otra página, solo abre el panel
      panelCarrito.classList.add('abierto');
      overlayCarrito.classList.add('activo');
      renderizarCarritoLateral();
    });
  });

  function cerrarPanel() {
    panelCarrito.classList.remove('abierto');
    overlayCarrito.classList.remove('activo');
  }

  if(btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarPanel);
  if(overlayCarrito) overlayCarrito.addEventListener('click', cerrarPanel);

  // --- RENDERIZAR DINÁMICAMENTE ---
  function renderizarCarritoLateral() {
    if (!divListaCarrito) return;
    
    divListaCarrito.innerHTML = ''; // Limpiamos
    let total = 0;

    if (carrito.length === 0) {
      divListaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    } else {
      carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        divListaCarrito.innerHTML += `
          <div class="item-carrito-min">
            <div>
              <strong>${producto.nombre}</strong><br>
              <small>${producto.cantidad} x ${producto.precio}€</small>
            </div>
            <button onclick="abrirModalBorrado(${producto.id})" style="background:none; border:none; color:red; cursor:pointer;">❌</button>
          </div>
        `;
      });
    }
    spanTotalLateral.innerText = total.toFixed(2) + '€';
  }

  // --- MODAL DE BORRADO ---
  window.abrirModalBorrado = function(id) {
    idProductoABorrar = id;
    modal.classList.add('activo');
  };

  if(btnCancelarBorrado) {
    btnCancelarBorrado.addEventListener('click', () => modal.classList.remove('activo'));
  }

  if(btnConfirmarBorrado) {
    btnConfirmarBorrado.addEventListener('click', () => {
      // Filtramos la mochila dejando fuera el producto que queremos borrar
      carrito = carrito.filter(prod => prod.id !== idProductoABorrar);
      guardarCarrito();
      modal.classList.remove('activo');
      mostrarNotificacion('Producto eliminado', 'aviso'); // Usamos tu función de notificaciones de antes
    });
  }

  // --- AÑADIR AL CARRITO ---
  const botonComprarRaton = document.querySelector('.btn-comprar');
  if (botonComprarRaton) {
    
    const nuevoBoton = botonComprarRaton.cloneNode(true);
    botonComprarRaton.parentNode.replaceChild(nuevoBoton, botonComprarRaton);
    
    nuevoBoton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Creamos el objeto del ratón
      const producto = {
        id: 1,
        nombre: 'Ratón HyperClick',
        precio: 49.99,
        cantidad: 1
      };

      // Comprobamos si ya estaba en el carrito
      const existe = carrito.find(p => p.id === producto.id);
      if (existe) {
        existe.cantidad += 1;
      } else {
        carrito.push(producto);
      }

      guardarCarrito();
      mostrarNotificacion('¡Ratón añadido al carrito!', 'exito');
    });
  }

  // Render inicial
  renderizarCarritoLateral();



















  // LÓGICA DE MICROINTERACCIONES


  // 1. Copiar al Portapapeles
  const btnCopiar = document.getElementById('btn-copiar-cupon');
  const textoCupon = document.getElementById('texto-cupon');

  if (btnCopiar && textoCupon) {
    btnCopiar.addEventListener('click', () => {
      // Usamos la API nativa del navegador para copiar el texto
      navigator.clipboard.writeText(textoCupon.innerText).then(() => {
        //cambiamos el botón temporalmente
        const textoOriginal = btnCopiar.innerText;
        btnCopiar.innerText = '¡Copiado!';
        btnCopiar.classList.add('exito');

        // A los 2 segundos lo devolvemos a la normalidad
        setTimeout(() => {
          btnCopiar.innerText = textoOriginal;
          btnCopiar.classList.remove('exito');
        }, 2000);
      });
    });
  }

  //Leer más / Leer menos
  const btnLeerMas = document.getElementById('btn-leer-mas');
  const textoAmpliado = document.getElementById('texto-ampliado');

  if (btnLeerMas && textoAmpliado) {
    btnLeerMas.addEventListener('click', () => {
      textoAmpliado.classList.toggle('visible');
      btnLeerMas.innerText = textoAmpliado.classList.contains('visible') 
        ? 'Ocultar descripción' 
        : 'Leer más sobre esto...';
    });
  }

  // Simulador de Estrellas
  const estrellas = document.querySelectorAll('.estrella');
  const mensajeValoracion = document.getElementById('mensaje-valoracion');

  if (estrellas.length > 0) {
    estrellas.forEach(estrella => {
      estrella.addEventListener('click', function() {
        const valorSeleccionado = parseInt(this.getAttribute('data-valor'));

        estrellas.forEach(e => {
          const valorActual = parseInt(e.getAttribute('data-valor'));
          if (valorActual <= valorSeleccionado) {
            e.classList.add('activa');
          } else {
            e.classList.remove('activa');
          }
        });

        const mensajes = [
          "¡Vaya! Intentaremos mejorar.",
          "No está mal, pero tomamos nota.",
          "¡Gracias! Nos alegra que te guste.",
          "¡Genial! Disfruta de tu producto.",
          "¡Increíble! Gracias por darnos la máxima puntuación."
        ];
        mensajeValoracion.innerText = mensajes[valorSeleccionado - 1];
      });
    });
  }