# Integración de OpenPay - Documentación

## 📋 Resumen de la Implementación

Se ha integrado exitosamente **OpenPay** como nuevo método de pago en el sistema, siguiendo el mismo patrón de Culqi, Mercado Pago, Yape y Transferencias.

## 🎯 Archivos Modificados

### Frontend (JavaScript/React)

1. **`resources/js/Admin/Generals.jsx`**
   - ✅ Agregado tab de configuración de OpenPay en métodos de pago
   - ✅ Campos para: habilitación, nombre, Merchant ID, clave pública y privada
   - ✅ Handlers para gestionar los cambios
   - ✅ Guardado en base de datos mediante estructura de `generals`

2. **`resources/js/Components/Tailwind/Checkouts/Components/PaymentModal.jsx`**
   - ✅ Agregada opción de pago "OpenPay" en el modal
   - ✅ Validación para mostrar solo si está habilitado
   - ✅ UI consistente con otros métodos de pago

3. **`resources/js/Components/Tailwind/Checkouts/Components/ShippingStepSF.jsx`**
   - ✅ Import de función `processOpenPayPayment`
   - ✅ Handler completo para procesar pagos con OpenPay
   - ✅ Integración con cupones y descuentos automáticos
   - ✅ Manejo de errores y notificaciones

4. **`resources/js/Actions/openPayPayment.js`** *(NUEVO)*
   - ✅ Función para procesar pagos con OpenPay
   - ✅ Configuración del SDK
   - ✅ Manejo de errores y validaciones
   - ✅ Toast notifications

5. **`resources/js/Utils/Global.js`**
   - ✅ Agregadas constantes globales:
     - `OPENPAY_MERCHANT_ID`
     - `OPENPAY_PUBLIC_KEY`
     - `OPENPAY_PRIVATE_KEY`
     - `OPENPAY_ENABLED`
     - `OPENPAY_SANDBOX_MODE`

### Backend (PHP/Laravel)

6. **`app/Http/Controllers/OpenPayController.php`** *(NUEVO)*
   - ✅ Método `createCharge()` para procesar pagos
   - ✅ Método `webhook()` para recibir notificaciones de OpenPay
   - ✅ Creación de registros de venta
   - ✅ Actualización de stock
   - ✅ Envío de notificaciones
   - ✅ Logging completo

7. **`routes/api.php`**
   - ✅ Ruta POST `/api/openpay/charge` para procesar pagos
   - ✅ Ruta POST `/api/openpay/webhook` para webhooks
   - ✅ Import del controlador OpenPayController

## 🔧 Configuración Requerida

### 1. Base de Datos

Agregar los siguientes registros a la tabla `generals`:

```sql
-- Habilitar OpenPay
INSERT INTO generals (correlative, name, description, status) 
VALUES ('checkout_openpay', 'Habilitar OpenPay', 'false', 1);

-- Nombre del método de pago
INSERT INTO generals (correlative, name, description, status) 
VALUES ('checkout_openpay_name', 'Nombre de OpenPay', 'Pago con tarjeta', 1);

-- Merchant ID
INSERT INTO generals (correlative, name, description, status) 
VALUES ('checkout_openpay_merchant_id', 'OpenPay Merchant ID', '', 1);

-- Clave Pública
INSERT INTO generals (correlative, name, description, status) 
VALUES ('checkout_openpay_public_key', 'OpenPay Public Key', '', 1);

-- Clave Privada
INSERT INTO generals (correlative, name, description, status) 
VALUES ('checkout_openpay_private_key', 'OpenPay Private Key', '', 1);
```

### 2. Variables de Entorno (.env)

```env
# OpenPay Configuration
OPENPAY_SANDBOX_MODE=true
```

### 3. Configuración en el Panel Admin

1. Ir a **Admin → Configuración General → Métodos de Pago**
2. Hacer clic en la pestaña **"OpenPay"**
3. Configurar:
   - ✅ Marcar checkbox "Habilitar pago con OpenPay"
   - 📝 Título del formulario: `Pago con tarjeta`
   - 🔑 **Merchant ID**: Obtener desde el dashboard de OpenPay
   - 🔓 **Clave Pública**: Obtener desde el dashboard de OpenPay
   - 🔒 **Clave Privada**: Obtener desde el dashboard de OpenPay
4. Guardar cambios

### 4. Script de OpenPay en el Frontend

Agregar el script de OpenPay en el layout principal (si aún no existe):

```html
<!-- En resources/views/layouts/app.blade.php o similar -->
<script src="https://js.openpay.mx/openpay.v1.min.js"></script>
<script src="https://js.openpay.mx/openpay-data.v1.min.js"></script>
```

### 5. Cargar Configuración de OpenPay en Global.js

En el archivo donde se inicializan las variables globales (generalmente en un middleware o controller), agregar:

```php
// En el controlador que carga generals para el frontend
$generals = General::whereIn('correlative', [
    'checkout_openpay',
    'checkout_openpay_name',
    'checkout_openpay_merchant_id',
    'checkout_openpay_public_key',
    // NO incluir private_key en el frontend
])->get();
```

Y en el JavaScript que inicializa Global:

```javascript
// Cargar configuración de OpenPay
Global.set('OPENPAY_MERCHANT_ID', General.get('checkout_openpay_merchant_id'));
Global.set('OPENPAY_PUBLIC_KEY', General.get('checkout_openpay_public_key'));
Global.set('OPENPAY_ENABLED', General.get('checkout_openpay') === 'true');
Global.set('OPENPAY_SANDBOX_MODE', true); // O desde .env
```

## 📊 Flujo de Pago

1. Usuario selecciona productos y llega al checkout
2. En ShippingStepSF, hace clic en "Continuar"
3. Se abre PaymentModal con opciones de pago
4. Usuario selecciona "OpenPay"
5. Se ejecuta `handlePaymentComplete("openpay")`
6. Se llama a `processOpenPayPayment(request)`
7. El frontend envía la solicitud a `/api/openpay/charge`
8. El backend:
   - Crea registro de venta con estado "Pendiente"
   - Envía cargo a la API de OpenPay
   - Si es exitoso: actualiza a "Pagado", descuenta stock, envía notificaciones
   - Si falla: actualiza a "Rechazado"
9. El frontend redirige según el resultado

## 🔐 Seguridad

- ✅ La clave privada NUNCA se envía al frontend
- ✅ Todas las transacciones se procesan en el servidor
- ✅ Validaciones de credenciales antes de procesar
- ✅ Logging completo de operaciones
- ✅ Manejo de errores robusto

## 🌐 URLs de OpenPay

### Producción
- Dashboard: https://dashboard.openpay.mx/
- API: https://api.openpay.mx/v1

### Sandbox (Pruebas)
- Dashboard: https://sandbox-dashboard.openpay.mx/
- API: https://sandbox-api.openpay.mx/v1

## 🧪 Pruebas

### Tarjetas de Prueba (Sandbox)

**Tarjeta Aprobada:**
- Número: 4111 1111 1111 1111
- CVV: 123
- Fecha: Cualquier fecha futura

**Tarjeta Rechazada:**
- Número: 4000 0000 0000 0002
- CVV: 123
- Fecha: Cualquier fecha futura

## 📝 Notas Importantes

1. **Moneda**: Actualmente configurado para MXN (pesos mexicanos). Si necesitas PEN (soles), verifica que tu cuenta de OpenPay lo soporte y cambia el código en `OpenPayController.php` línea 153.

2. **Webhook**: Configura el webhook en el dashboard de OpenPay apuntando a:
   ```
   https://tudominio.com/api/openpay/webhook
   ```

3. **device_session_id**: Para mejor seguridad anti-fraude, implementar la captura del device_session_id usando el script de OpenPay:
   ```javascript
   window.OpenPay.deviceData.setup()
   ```

4. **Tarjetas 3D Secure**: OpenPay soporta 3D Secure. Considera implementarlo para mayor seguridad.

## 🐛 Troubleshooting

### Error: "OpenPay no está definido"
- Verificar que el script de OpenPay esté cargado
- Verificar consola del navegador

### Error: "Credenciales no configuradas"
- Verificar que las credenciales estén en la tabla `generals`
- Verificar que `checkout_openpay` esté en 'true'

### Error: "Error al procesar el pago"
- Revisar logs en `storage/logs/laravel.log`
- Verificar credenciales (Merchant ID, claves)
- Verificar modo sandbox vs producción

## 📞 Soporte

- Documentación oficial: https://www.openpay.mx/docs/
- API Reference: https://www.openpay.mx/docs/api/

---

**Desarrollado por:** Rhino Technology
**Fecha:** Octubre 2025
