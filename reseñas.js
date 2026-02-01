// Sistema de reseñas
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de reseñas
    inicializarSistemaResenas();
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
}

function publicarResena() {
    const nombre = document.getElementById('nombre-resena').value.trim();
    const ubicacion = document.getElementById('ubicacion-resena').value.trim();
    const texto = document.getElementById('texto-resena').value.trim();
    const estrellas = document.querySelectorAll('.estrellas-calificacion i.fas').length;
    
    // Validar campos
    if (!nombre || !texto || estrellas === 0) {
        alert('Por favor, completa todos los campos y selecciona una calificación.');
        return;
    }
    
    // Crear nueva reseña
    const nuevaResena = crearElementoResena(nombre, ubicacion, texto, estrellas);
    
    // Agregar al inicio de la lista de testimonios
    const testimoniosGrid = document.querySelector('.testimonios-grid');
    if (testimoniosGrid) {
        testimoniosGrid.insertBefore(nuevaResena, testimoniosGrid.firstChild);
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
                    Gracias por tu opinión.
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
