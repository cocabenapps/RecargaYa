// Configuración
const tuWhatsApp = "5363954759";
const nombreEmpresa = "RecargaYa";

// Variables globales para el modal QR
let ofertaActual = null;
let precioActual = null;
let codigoOfertaActual = null;

// Función para verificar horario y actualizar indicador
function actualizarIndicadorHorario() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const horaActualDecimal = horaActual + (minutosActual / 60);
    
    // Horario: 9:00 AM - 9:00 PM (21:00)
    const horaApertura = 9;   // 9:00 AM
    const horaCierre = 21;    // 9:00 PM
    
    const indicador = document.getElementById('horario-indicador');
    const texto = document.getElementById('horario-texto');
    
    if (!indicador || !texto) return;
    
    if (horaActualDecimal >= horaApertura && horaActualDecimal < horaCierre) {
        // Está abierto
        indicador.className = 'horario-indicador abierto';
        texto.textContent = 'Abierto ahora';
        
        // Mostrar hora de cierre
        const horasRestantes = Math.floor(horaCierre - horaActualDecimal);
        const minutosRestantes = Math.round((horaCierre - horaActualDecimal - horasRestantes) * 60);
        
        if (horasRestantes > 0) {
            texto.textContent = `Abierto • Cierra en ${horasRestantes}h`;
        } else if (minutosRestantes > 0) {
            texto.textContent = `Abierto • Cierra en ${minutosRestantes}min`;
        }
    } else {
        // Está cerrado
        indicador.className = 'horario-indicador cerrado';
        texto.textContent = 'Cerrado ahora';
        
        // Calcular cuánto falta para abrir
        let horasParaAbrir;
        
        if (horaActualDecimal < horaApertura) {
            // Todavía no ha abierto hoy
            horasParaAbrir = horaApertura - horaActualDecimal;
        } else {
            // Ya cerró, abrirá mañana
            horasParaAbrir = (24 - horaActualDecimal) + horaApertura;
        }
        
        const horas = Math.floor(horasParaAbrir);
        const minutos = Math.round((horasParaAbrir - horas) * 60);
        
        if (horas > 0) {
            texto.textContent = `Cerrado • Abre en ${horas}h`;
        } else if (minutos > 0) {
            texto.textContent = `Cerrado • Abre en ${minutos}min`;
        }
    }
}

// Función mejorada para comprar ofertas (SIN EMOJIS)
function comprarOferta(nombreOferta, precio, codigoOferta) {
    // Crear mensaje sin emojis, solo con puntos/plecas
    const mensaje = `Hola RecargaYa!\n\n` +
                   `Estoy interesado en adquirir la siguiente oferta:\n\n` +
                   `----------------------------------------\n` +
                   `OFERTA: ${nombreOferta}\n` +
                   `PRECIO: ${precio}\n` +
                   `CODIGO: ${codigoOferta}\n` +
                   `----------------------------------------\n\n` +
                   `Por favor, envienme los datos para realizar el pago.\n` +
                   `(Número de tarjeta y número a confirmar pago)\n\n` +
                   `Saludos.`;

    // Codificar para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear enlace de WhatsApp
    const whatsappURL = `https://wa.me/${tuWhatsApp}?text=${mensajeCodificado}`;

    // Abrir en nueva pestaña
    window.open(whatsappURL, '_blank');

    // Mostrar confirmación
    mostrarConfirmacion(nombreOferta, 'whatsapp');
}

// Función para mostrar modal QR de Transfermóvil
function mostrarModalQR(nombreOferta, precio, codigoOferta) {
    // Guardar datos de la oferta actual
    ofertaActual = nombreOferta;
    precioActual = precio;
    codigoOfertaActual = codigoOferta;
    
    // Mostrar modal
    const modal = document.getElementById('modal-qr');
    modal.style.display = 'block';
    
    // Deshabilitar scroll del body
    document.body.style.overflow = 'hidden';
    
    // Mostrar confirmación
    mostrarConfirmacion(nombreOferta, 'transfermovil');
}

// Función para cerrar modal QR
function cerrarModalQR() {
    const modal = document.getElementById('modal-qr');
    modal.style.display = 'none';
    
    // Habilitar scroll del body
    document.body.style.overflow = 'auto';
}

// Función para confirmar pago realizado
function confirmarPago(banco) {
    if (!ofertaActual) return;
    
    // Crear mensaje específico para pago realizado
    const mensaje = `¡Hola RecargaYa!\n\n` +
                   `El pago fue realizado a la cuenta ${banco} para el servicio de ${ofertaActual} y espero recibir mi servicio.\n\n` +
                   `Saludos.`;

    // Codificar para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear enlace de WhatsApp
    const whatsappURL = `https://wa.me/${tuWhatsApp}?text=${mensajeCodificado}`;

    // Abrir en nueva pestaña
    window.open(whatsappURL, '_blank');
    
    // Cerrar modal
    cerrarModalQR();
    
    // Mostrar confirmación especial
    mostrarConfirmacionPagoRealizado(banco);
}

// Mostrar confirmación animada
function mostrarConfirmacion(nombreOferta, tipo) {
    const color = tipo === 'whatsapp' ? '#25D366' : '#6a11cb';
    const icono = tipo === 'whatsapp' ? 'fab fa-whatsapp' : 'fas fa-qrcode';
    const texto = tipo === 'whatsapp' ? 'WhatsApp' : 'Transfermóvil';
    
    // Crear elemento de confirmación
    const confirmacion = document.createElement('div');
    confirmacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${color}, ${tipo === 'whatsapp' ? '#128C7E' : '#2575fc'});
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        max-width: 350px;
    `;

    confirmacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="${icono}" style="font-size: 24px;"></i>
            <div>
                <strong style="font-size: 16px;">¡Solicitud enviada por ${texto}!</strong>
                <p style="margin-top: 5px; font-size: 14px; opacity: 0.9;">
                    Te contactaremos para la oferta:<br>
                    <strong>${nombreOferta}</strong>
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(confirmacion);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        if (confirmacion.parentNode) {
            confirmacion.parentNode.removeChild(confirmacion);
        }
    }, 3000);
}

// Mostrar confirmación especial para pago realizado
function mostrarConfirmacionPagoRealizado(banco) {
    const confirmacion = document.createElement('div');
    confirmacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeIn 0.5s ease, fadeOut 0.5s ease 3.5s forwards;
        max-width: 350px;
    `;

    confirmacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-check-circle" style="font-size: 24px;"></i>
            <div>
                <strong style="font-size: 16px;">¡Confirmación enviada!</strong>
                <p style="margin-top: 5px; font-size: 14px; opacity: 0.9;">
                    Se notificó tu pago por ${banco}<br>
                    <strong>Pronto recibirás tu recarga</strong>
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(confirmacion);

    // Eliminar después de 4 segundos
    setTimeout(() => {
        if (confirmacion.parentNode) {
            confirmacion.parentNode.removeChild(confirmacion);
        }
    }, 4000);
}

// Scroll suave para el menú de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar scroll suave para enlaces del menú
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcular posición considerando el menú fijo
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto de vibración táctil para botones (para móviles)
    document.querySelectorAll('.whatsapp-btn, .transfermovil-btn, .btn-pago-realizado').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal-qr');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModalQR();
            }
        });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModalQR();
        }
    });

    // Añadir estilos para las animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});

// Animación al cargar la página
window.addEventListener('load', function() {
    // Añadir clase de animación a las ofertas
    const ofertas = document.querySelectorAll('.oferta');
    ofertas.forEach((oferta, index) => {
        setTimeout(() => {
            oferta.style.opacity = '1';
            oferta.style.transform = 'translateY(0)';
        }, 300 * (index + 1));
    });
});