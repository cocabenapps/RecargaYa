// Configuración
const tuWhatsApp = "53563954759";
const nombreEmpresa = "RecargaYa";

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
                   `(Numero de tarjeta, nombre y referencia especifica)\n\n` +
                   `Saludos cordiales.`;
    
    // Codificar para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear enlace de WhatsApp
    const whatsappURL = `https://wa.me/${tuWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappURL, '_blank');
    
    // Mostrar confirmación
    mostrarConfirmacion(nombreOferta);
}

// Mostrar confirmación animada
function mostrarConfirmacion(oferta) {
    // Crear elemento de confirmación
    const confirmacion = document.createElement('div');
    confirmacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a2980, #26d0ce);
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
            <i class="fas fa-check-circle" style="font-size: 24px; color: #25D366;"></i>
            <div>
                <strong style="font-size: 16px;">¡Solicitud enviada!</strong>
                <p style="margin-top: 5px; font-size: 14px; opacity: 0.9;">
                    Te contactaremos por WhatsApp para la oferta:<br>
                    <strong>${oferta}</strong>
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
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Añadir estilos para la animación de fadeOut
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
