# Configuración OAuth 2.0 con Google Cloud
## Estudio Jurídico – Documentación técnica

---

## 1. Acceso a Google Cloud Console

Ingresar a:
https://console.cloud.google.com

Iniciar sesión con la cuenta Google que administrará el proyecto.

---

## 2. Crear un proyecto nuevo

1. Click en el selector de proyectos (arriba a la izquierda).
2. Click en **Nuevo proyecto**.
3. Nombre del proyecto:
   - `Estudio Juridico`
4. Click en **Crear**.
5. Esperar a que el proyecto quede activo y seleccionarlo.

---

## 3. Acceder a Google Auth Platform

Ruta:
Menú ☰ → **APIs y servicios** → **Pantalla de consentimiento OAuth**

(En interfaces nuevas puede figurar como *Google Auth Platform*).

---

## 4. Configurar Pantalla de consentimiento OAuth

### 4.1 Tipo de usuario
Seleccionar:
- **Externo**

Click en **Crear** o **Continuar**.

---

### 4.2 Información de la app

Completar:
- **Nombre de la aplicación**:  
  `Estudio Jurídico – Acceso Web`
- **Correo electrónico de asistencia al usuario**:  
  (correo válido del estudio o del responsable)

Click en **Guardar y continuar**.

---

### 4.3 Público
Mantener configuración por defecto (usuarios externos).

Click en **Guardar y continuar**.

---

### 4.4 Información de contacto
- Correo electrónico del desarrollador:  
  (correo válido)

Click en **Guardar y continuar**.

---

### 4.5 Finalizar
Click en **Crear**.

La pantalla de consentimiento queda configurada.

---

## 5. Crear credenciales OAuth (Client ID)

Ruta:
Menú ☰ → **APIs y servicios** → **Credenciales**

Click en:
- **Crear credenciales**
- **ID de cliente OAuth**

---

## 6. Configuración del cliente OAuth

### 6.1 Tipo de aplicación
Seleccionar:
- **Aplicación web**

---

### 6.2 Datos del cliente

- **Nombre**:  
  `Estudio Jurídico Web`

---

### 6.3 Orígenes autorizados de JavaScript

Agregar:
http://localhost:3000


---

### 6.4 URIs de redireccionamiento autorizados

Agregar:


http://localhost:3000/api/auth/callback/google


---

### 6.5 Crear cliente
Click en **Crear**.

---

## 7. Obtención de credenciales

Al finalizar, Google genera:

- **Client ID**
- **Client Secret**

Ambos quedan asociados al cliente OAuth creado.

---

## 8. Verificación del Client ID y Secret

Ruta:
Menú ☰ → **APIs y servicios** → **Credenciales** → Click en  
`Estudio Jurídico Web`

Verificar:
- Tipo: Aplicación web
- Estado: **Habilitada**
- Client ID visible
- Client Secret creado y activo

⚠️ El Client Secret solo se muestra completo al crearse. Guardarlo de forma segura.

---

## 9. Estado final esperado

- Proyecto creado
- Pantalla de consentimiento OAuth configurada
- Cliente OAuth 2.0 creado
- Client ID y Client Secret disponibles y habilitados

Configuración OAuth completa.