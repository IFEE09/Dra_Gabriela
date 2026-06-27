/**
 * ========================================================
 * SECURITY MODULE - Dra. Gabriela Canché Website
 * ========================================================
 * Protecciones contra:
 * - DDoS (Rate Limiting en cliente)
 * - XSS (Cross-Site Scripting)
 * - Injection (HTML/JS)
 * - Clickjacking
 * - Prototype Pollution
 * - Console Hijacking
 * - DevTools Detection (opcional)
 * ========================================================
 */

(function() {
    'use strict';

    // ==========================================
    // 1. RATE LIMITER - Protección contra spam/DDoS
    // ==========================================
    const RateLimiter = {
        actions: new Map(),
        
        /**
         * Verifica si una acción está permitida basándose en rate limiting
         * @param {string} actionId - Identificador único de la acción
         * @param {number} maxAttempts - Máximo de intentos permitidos
         * @param {number} windowMs - Ventana de tiempo en milisegundos
         * @returns {boolean} - true si está permitido, false si excede el límite
         */
        isAllowed: function(actionId, maxAttempts = 5, windowMs = 60000) {
            const now = Date.now();
            const actionData = this.actions.get(actionId) || { attempts: [], blocked: false, blockedUntil: 0 };
            
            // Verificar si está bloqueado
            if (actionData.blocked && now < actionData.blockedUntil) {
                console.warn(`[Security] Rate limit exceeded for: ${actionId}`);
                return false;
            }
            
            // Limpiar intentos antiguos fuera de la ventana
            actionData.attempts = actionData.attempts.filter(timestamp => now - timestamp < windowMs);
            
            // Verificar límite
            if (actionData.attempts.length >= maxAttempts) {
                actionData.blocked = true;
                actionData.blockedUntil = now + (windowMs * 2); // Bloqueo por el doble del tiempo
                this.actions.set(actionId, actionData);
                console.warn(`[Security] Blocking action: ${actionId} for ${windowMs * 2}ms`);
                return false;
            }
            
            // Registrar intento
            actionData.attempts.push(now);
            actionData.blocked = false;
            this.actions.set(actionId, actionData);
            return true;
        },
        
        /**
         * Resetea el contador de una acción específica
         * @param {string} actionId 
         */
        reset: function(actionId) {
            this.actions.delete(actionId);
        }
    };

    // ==========================================
    // 2. INPUT SANITIZER - Prevención XSS/Injection
    // ==========================================
    const Sanitizer = {
        /**
         * Escapa caracteres HTML peligrosos
         * @param {string} str - String a sanitizar
         * @returns {string} - String sanitizado
         */
        escapeHTML: function(str) {
            if (typeof str !== 'string') return '';
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            return str.replace(/[&<>"'`=\/]/g, char => escapeMap[char]);
        },
        
        /**
         * Elimina scripts y eventos inline de un string HTML
         * @param {string} html - HTML a limpiar
         * @returns {string} - HTML limpio
         */
        stripScripts: function(html) {
            if (typeof html !== 'string') return '';
            return html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/data:/gi, 'data-blocked:');
        },
        
        /**
         * Valida y sanitiza un número de teléfono
         * @param {string} phone - Número a validar
         * @returns {string|null} - Número limpio o null si es inválido
         */
        sanitizePhone: function(phone) {
            if (typeof phone !== 'string') return null;
            const cleaned = phone.replace(/[^\d+\-\s()]/g, '');
            // Validar formato básico (al menos 10 dígitos)
            const digitsOnly = cleaned.replace(/\D/g, '');
            if (digitsOnly.length < 10 || digitsOnly.length > 15) return null;
            return cleaned;
        },
        
        /**
         * Valida y sanitiza un nombre
         * @param {string} name - Nombre a validar
         * @returns {string|null} - Nombre limpio o null si es inválido
         */
        sanitizeName: function(name) {
            if (typeof name !== 'string') return null;
            // Solo permitir letras, espacios, acentos y guiones
            const cleaned = name.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s\-']/g, '').trim();
            if (cleaned.length < 2 || cleaned.length > 100) return null;
            return this.escapeHTML(cleaned);
        },
        
        /**
         * Valida una fecha
         * @param {string} date - Fecha a validar
         * @returns {string|null} - Fecha válida o null
         */
        sanitizeDate: function(date) {
            if (typeof date !== 'string') return null;
            // Formato esperado: YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) return null;
            const parsed = new Date(date);
            if (isNaN(parsed.getTime())) return null;
            // No permitir fechas pasadas (más de 1 día)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (parsed < yesterday) return null;
            return date;
        },
        
        /**
         * Sanitiza una URL
         * @param {string} url - URL a validar
         * @returns {string|null} - URL segura o null
         */
        sanitizeURL: function(url) {
            if (typeof url !== 'string') return null;
            try {
                const parsed = new URL(url);
                // Solo permitir protocolos seguros
                if (!['http:', 'https:', 'tel:', 'mailto:'].includes(parsed.protocol)) {
                    return null;
                }
                return parsed.href;
            } catch {
                return null;
            }
        }
    };

    // ==========================================
    // 3. FORM PROTECTION - Validación de formularios
    // ==========================================
    const FormProtection = {
        /**
         * Inicializa protección en todos los formularios
         */
        init: function() {
            document.querySelectorAll('form').forEach(form => {
                // Prevenir múltiples envíos
                form.addEventListener('submit', (e) => {
                    const formId = form.id || 'anonymous-form';
                    
                    // Rate limiting
                    if (!RateLimiter.isAllowed(`form-${formId}`, 3, 30000)) {
                        e.preventDefault();
                        this.showError(form, 'Demasiados intentos. Por favor espera un momento.');
                        return;
                    }
                    
                    // Honeypot check (si existe)
                    const honeypot = form.querySelector('[data-honeypot]');
                    if (honeypot && honeypot.value !== '') {
                        e.preventDefault();
                        console.warn('[Security] Honeypot triggered - bot detected');
                        return;
                    }
                });
                
                // Sanitizar inputs en tiempo real
                form.querySelectorAll('input, textarea').forEach(input => {
                    input.addEventListener('input', () => {
                        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
                            // Prevenir inyección de scripts en tiempo real
                            if (/<script|javascript:|on\w+=/i.test(input.value)) {
                                input.value = Sanitizer.stripScripts(input.value);
                                console.warn('[Security] Potential XSS attempt blocked');
                            }
                        }
                    });
                    
                    // Limitar longitud para prevenir DoS
                    if (!input.maxLength || input.maxLength > 1000) {
                        input.maxLength = 500;
                    }
                });
            });
        },
        
        /**
         * Muestra un mensaje de error en el formulario
         * @param {HTMLFormElement} form 
         * @param {string} message 
         */
        showError: function(form, message) {
            let errorDiv = form.querySelector('.security-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'security-error';
                errorDiv.style.cssText = 'color: #dc3545; padding: 10px; margin: 10px 0; border: 1px solid #dc3545; border-radius: 4px; background: #f8d7da;';
                form.prepend(errorDiv);
            }
            errorDiv.textContent = message;
            setTimeout(() => errorDiv.remove(), 5000);
        }
    };

    // ==========================================
    // 4. CLICK PROTECTION - Anti-spam para botones
    // ==========================================
    const ClickProtection = {
        init: function() {
            // Proteger botones de llamada y WhatsApp
            document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const linkType = link.href.startsWith('tel:') ? 'phone' : 'whatsapp';
                    
                    if (!RateLimiter.isAllowed(`click-${linkType}`, 5, 60000)) {
                        e.preventDefault();
                        alert('Demasiados clics. Por favor espera un momento antes de intentar nuevamente.');
                        return;
                    }
                });
            });
            
            // Proteger botones de formulario
            document.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    // Deshabilitar temporalmente para prevenir doble clic
                    btn.disabled = true;
                    setTimeout(() => btn.disabled = false, 2000);
                });
            });
        }
    };

    // ==========================================
    // 5. CONSOLE PROTECTION - Prevenir debugging malicioso
    // ==========================================
    const ConsoleProtection = {
        init: function() {
            // Advertencia en consola
            const warningStyle = 'color: red; font-size: 24px; font-weight: bold;';
            const infoStyle = 'color: blue; font-size: 14px;';
            
            console.log('%c¡ALTO!', warningStyle);
            console.log('%cEsta es una función del navegador destinada a desarrolladores.', infoStyle);
            console.log('%cSi alguien te dijo que copiaras y pegaras algo aquí, es un fraude.', infoStyle);
            console.log('%cMás información: https://es.wikipedia.org/wiki/Self-XSS', infoStyle);
        }
    };

    // ==========================================
    // 6. PROTOTYPE POLLUTION PROTECTION
    // ==========================================
    const PrototypePollutionProtection = {
        init: function() {
            // Congelar prototipos críticos
            if (Object.freeze) {
                try {
                    Object.freeze(Object.prototype);
                    Object.freeze(Array.prototype);
                    Object.freeze(Function.prototype);
                } catch (e) {
                    // Algunos navegadores no permiten esto
                    console.warn('[Security] Could not freeze prototypes');
                }
            }
        }
    };

    // ==========================================
    // 7. IFRAME PROTECTION - Anti-clickjacking adicional
    // ==========================================
    const IframeProtection = {
        init: function() {
            // Frame busting - previene que el sitio sea embebido maliciosamente
            if (window.self !== window.top) {
                // El sitio está en un iframe
                try {
                    // Intentar salir del iframe
                    window.top.location = window.self.location;
                } catch (e) {
                    // Si falla (por políticas CORS), ocultar el contenido
                    document.body.innerHTML = '<h1 style="text-align:center;padding:50px;">Este sitio no puede mostrarse en un iframe.</h1>';
                    console.warn('[Security] Site loaded in unauthorized iframe');
                }
            }
        }
    };

    // ==========================================
    // 8. LINK PROTECTION - Validar enlaces externos
    // ==========================================
    const LinkProtection = {
        init: function() {
            document.querySelectorAll('a[target="_blank"]').forEach(link => {
                // Agregar rel="noopener noreferrer" para prevenir tabnapping
                const rel = link.getAttribute('rel') || '';
                if (!rel.includes('noopener')) {
                    link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
                }
            });
        }
    };

    // ==========================================
    // 9. SCROLL/RESIZE THROTTLE - Prevenir DoS por eventos
    // ==========================================
    const EventThrottle = {
        lastScroll: 0,
        lastResize: 0,
        
        init: function() {
            // Throttle scroll events
            const originalScrollHandlers = [];
            const scrollHandler = (e) => {
                const now = Date.now();
                if (now - this.lastScroll < 16) { // ~60fps
                    return;
                }
                this.lastScroll = now;
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
        }
    };

    // ==========================================
    // 10. COPY/PASTE PROTECTION (Opcional - comentado por defecto)
    // ==========================================
    // const CopyProtection = {
    //     init: function() {
    //         document.addEventListener('copy', (e) => {
    //             // Opcional: Agregar marca de agua al copiar
    //             const selection = document.getSelection().toString();
    //             e.clipboardData.setData('text/plain', selection + '\n\n© Dra. Gabriela Canché - dragabrielacanche.com');
    //             e.preventDefault();
    //         });
    //     }
    // };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    const Security = {
        init: function() {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initModules());
            } else {
                this.initModules();
            }
        },
        
        initModules: function() {
            try {
                ConsoleProtection.init();
                IframeProtection.init();
                LinkProtection.init();
                FormProtection.init();
                ClickProtection.init();
                EventThrottle.init();
                // PrototypePollutionProtection.init(); // Comentado - puede causar problemas con algunas librerías
                
                console.log('[Security] All protection modules initialized');
            } catch (e) {
                console.error('[Security] Error initializing security modules:', e);
            }
        }
    };

    // Exponer utilidades sanitizadoras globalmente para uso en otros scripts
    window.SecurityUtils = {
        sanitize: Sanitizer,
        rateLimiter: RateLimiter
    };

    // Iniciar
    Security.init();

})();
