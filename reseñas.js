// Sistema de reseñas con persistencia
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de reseñas
    inicializarSistemaResenas();
    
    // Cargar reseñas guardadas
    cargarResenasGuardadas();
});

function inicializarSistemaResenas() {
    // Configurar estrellas de calificación
    const estrellas = document.querySelectorAll('.estrellas-calificacion i');
    let calificacionSeleccionada = 0;

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', function() {
            const valor = parseInt(this.getAttribute('data-value'));
            calificacionSeleccionada = valor;

            // Actualizar visualización de estrellas
            estrellas.forEach((est, index) => {
                if (index < valor) {
                    est.classList.remove('far');
                    est.classList.add('fas', 'active');
                } else {
                    est.classList.remove('fas', 'active');
                    est.classList.add('far');
                }
            });
        });

        // Efecto hover
        estrella.addEventListener('mouseover', function() {
            const valor = parseInt(this.getAttribute('data-value'));

            estrellas.forEach((est, index) => {
                if (index < valor) {
                    est.classList.add('hover');
                } else {
                    est.classList.remove('hover');
                }
            });
        });

        estrella.addEventListener('mouseout', function() {
            estrellas.forEach(est => {
                est.classList.remove('hover');
            });
        });
    });

    // Configurar botón de publicar reseña
    const btnPublicar = document.getElementById('publicar-resena');
    if (btnPublicar) {
        btnPublicar.addEventListener('click', publicarResena);
    }

    // Configurar contador de caracteres
    const textareaResena = document.getElementById('texto-resena');
    const contador = document.getElementById('contador');
    
    if (textareaResena && contador) {
        textareaResena.addEventListener('input', function() {
            const caracteresRestantes = 500 - this.value.length;
            contador.textContent = `${caracteresRestantes} caracteres disponibles`;
            
            if (caracteresRestantes < 50) {
                contador.style.color = '#ff6b6b';
            } else if (caracteresRestantes < 100) {
                contador.style.color = '#ffa726';
            } else {
                contador.style.color = '#666';
            }
        });
    }
}

function cargarResenasGuardadas() {
    try {
        const reseñasGuardadas = localStorage.getItem('recargaya_resenas');
        if (reseñasGuardadas) {
            const reseñas = JSON.parse(reseñasGuardadas);
            
            // Agregar cada reseña guardada
            reseñas.forEach(reseña => {
                const nuevaResena = crearElementoResena(
                    reseña.nombre,
                    reseña.ubicacion,
                    reseña.texto,
                    reseña.estrellas
                );
                
                // Agregar al inicio de la lista de testimonios
                const testimoniosGrid = document.querySelector('.testimonios-grid');
                if (testimoniosGrid) {
                    testimoniosGrid.insertBefore(nuevaResena, testimoniosGrid.children[3]);
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar reseñas:', error);
    }
}

function guardarResena(reseña) {
    try {
        // Obtener reseñas existentes
        let reseñasGuardadas = localStorage.getItem('recargaya_resenas');
        let reseñas = [];
        
        if (reseñasGuardadas) {
            reseñas = JSON.parse(reseñasGuardadas);
        }
        
        // Agregar nueva reseña al principio
        reseñas.unshift(reseña);
        
        // Limitar a las últimas 20 reseñas
        if (reseñas.length > 20) {
            reseñas = reseñas.slice(0, 20);
        }
        
        // Guardar en localStorage
        localStorage.setItem('recargaya_resenas', JSON.stringify(reseñas));
    } catch (error) {
        console.error('Error al guardar reseña:', error);
    }
}

function publicarResena() {
    const nombre = document.getElementById('nombre-resena').value.trim();
    const ubicacion = document.getElementById('ubicacion-resena').value.trim();
    const texto = document.getElementById('texto-resena').value.trim();
    const estrellas = document.querySelectorAll('.estrellas-calificacion i.fas').length;

    // Validar campos
    if (!nombre) {
        alert('Por favor, escribe tu nombre.');
        return;
    }
    
    if (!texto) {
        alert('Por favor, escribe tu reseña.');
        return;
    }
    
    if (texto.length < 10) {
        alert('La reseña debe tener al menos 10 caracteres.');
        return;
    }
    
    if (texto.length > 500) {
        alert('La reseña no puede exceder los 500 caracteres.');
        return;
    }
    
    if (estrellas === 0) {
        alert('Por favor, selecciona una calificación con estrellas.');
        return;
    }

    // Crear objeto de reseña
    const reseñaObjeto = {
        nombre: nombre,
        ubicacion: ubicacion,
        texto: texto,
        estrellas: estrellas,
        fecha: new Date().toISOString()
    };

    // Guardar en localStorage
    guardarResena(reseñaObjeto);

    // Crear y mostrar nueva reseña
    const nuevaResena = crearElementoResena(nombre, ubicacion, texto, estrellas);

    // Agregar después de las 3 reseñas fijas
    const testimoniosGrid = document.querySelector('.testimonios-grid');
    if (testimoniosGrid) {
        testimoniosGrid.insertBefore(nuevaResena, testimoniosGrid.children[3]);
    }

    // Limpiar formulario
    limpiarFormularioResena();

    // Mostrar confirmación
    mostrarConfirmacionResena();
}

function crearElementoResena(nombre, ubicacion, texto, estrellas) {
    const div = document.createElement('div');
    div.className = 'testimonio';

    // Generar HTML para las estrellas
    let estrellasHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= estrellas) {
            estrellasHTML += '<i class="fas fa-star"></i>';
        } else {
            estrellasHTML += '<i class="far fa-star"></i>';
        }
    }

    div.innerHTML = `
        <p class="testimonio-text">"${texto}"</p>
        <div class="testimonio-autor">
            <i class="fas fa-user-circle"></i>
            <span>${nombre}${ubicacion ? ' - ' + ubicacion : ''}</span>
            <div class="estrellas">
                ${estrellasHTML}
            </div>
        </div>
    `;

    // Agregar efecto de entrada
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
    }, 100);

    return div;
}

function limpiarFormularioResena() {
    document.getElementById('nombre-resena').value = '';
    document.getElementById('ubicacion-resena').value = '';
    document.getElementById('texto-resena').value = '';
    
    // Restablecer contador
    const contador = document.getElementById('contador');
    if (contador) {
        contador.textContent = '500 caracteres disponibles';
        contador.style.color = '#666';
    }

    // Restablecer estrellas
    const estrellas = document.querySelectorAll('.estrellas-calificacion i');
    estrellas.forEach(est => {
        est.classList.remove('fas', 'active');
        est.classList.add('far');
    });
}

function mostrarConfirmacionResena() {
    const confirmacion = document.createElement('div');
    confirmacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        max-width: 300px;
    `;

    confirmacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 20px;"></i>
            <div>
                <strong style="font-size: 14px;">¡Reseña publicada!</strong>
                <p style="margin-top: 5px; font-size: 12px; opacity: 0.9;">
                    Gracias por tu opinión. Se ha guardado localmente.
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(confirmacion);

    setTimeout(() => {
        if (confirmacion.parentNode) {
            confirmacion.parentNode.removeChild(confirmacion);
        }
    }, 3000);
}