/**
 * ========================================================
 * SECURITY MODULE - Dra. Gabriela B. Canché Escalante Website
 * ========================================================
 * La protección real (CSP, X-Frame-Options, HSTS, rate limiting,
 * bloqueo de archivos sensibles) vive en .htaccess a nivel servidor.
 * Este módulo solo cubre lo que el servidor no puede: UX del cliente.
 * ========================================================
 */

(function() {
    'use strict';

    // Advertencia en consola contra estafas de self-XSS
    // ("pega este código en la consola para...")
    const warningStyle = 'color: red; font-size: 24px; font-weight: bold;';
    const infoStyle = 'color: blue; font-size: 14px;';
    console.log('%c¡ALTO!', warningStyle);
    console.log('%cEsta es una función del navegador destinada a desarrolladores.', infoStyle);
    console.log('%cSi alguien te dijo que copiaras y pegaras algo aquí, es un fraude.', infoStyle);
    console.log('%cMás información: https://es.wikipedia.org/wiki/Self-XSS', infoStyle);

    // Red de seguridad: asegura rel="noopener noreferrer" en enlaces target="_blank"
    // (previene tabnabbing si algún enlace nuevo se agrega sin el atributo)
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
            link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
        }
    });

})();
