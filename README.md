# NexusBank — Banking Website Simulator

Prototipo de banca digital estadounidense, **100% ficticio**, con cinco páginas HTML independientes, diseño responsive y funciones que se ejecutan exclusivamente en el navegador. No utiliza backend, frameworks, cuentas reales ni dependencias externas. Todos los textos de la interfaz están en inglés estadounidense y las cantidades monetarias en USD.

> **Importante:** NexusBank no es un banco ni una entidad financiera. No procesa pagos, solicitudes de crédito, reportes reales de fraude, disputas, depósitos de nómina o consultas de soporte. Nunca introduzcas contraseñas, CVV, números de tarjeta, SSN, datos bancarios verdaderos ni información personal sensible.

## Estructura

```text
nexusbank/
├── index.html
├── credit-card.html
├── mortgages.html
├── payroll.html
├── fraud-disputes.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       └── nexus-mark.svg
└── README.md
```

## Páginas

| Página | Archivo | Funciones principales |
| --- | --- | --- |
| Main | `index.html` | Presentación, productos, accesos a las otras secciones |
| Credit Card | `credit-card.html` | Tres tarjetas imaginarias, comparador de hasta dos, estimador de recompensas |
| Mortgages | `mortgages.html` | Comparación de tres escenarios, calculadora de pago mensual con desglose |
| Payroll | `payroll.html` | Direct Deposit de prueba, tablero de cuenta ficticia, filtros, asignación de nómina |
| Fraud & Disputes | `fraud-disputes.html` | Reportes de fraude, disputas de movimientos, seguimiento, estados y acciones de seguridad |

En **todas** aparece el botón `Report a Problem` cerca del footer, con categoría, descripción, página de origen automática y confirmación demostrativa. Su flujo es independiente de `Report Fraud`.

## Probar localmente

Opción sencilla: abrir `index.html` en un navegador moderno y usar los enlaces de la navegación. Los recursos emplean rutas relativas, por lo que no se necesita internet.

Para replicar mejor el funcionamiento de GitHub Pages y verificar las cinco URLs con un servidor estático:

```bash
cd nexusbank
python3 -m http.server 8000
```

Visitar:

- `http://localhost:8000/`
- `http://localhost:8000/credit-card.html`
- `http://localhost:8000/mortgages.html`
- `http://localhost:8000/payroll.html`
- `http://localhost:8000/fraud-disputes.html`

No hay instalación de dependencias ni proceso de compilación.

## Publicar en GitHub Pages

1. En [GitHub](https://github.com/new), crear un repositorio público llamado exactamente **`nexusbank`**. Puedes añadir una descripción; no hace falta generar otro README.
2. Descomprimir el ZIP y entrar a la carpeta `nexusbank/`. Subir **el contenido de esa carpeta a la raíz del repositorio** (de modo que `index.html` quede en `/index.html`, y no en `/nexusbank/index.html` dentro del repositorio).
3. Para subirlo desde la interfaz de GitHub, usar **Add file → Upload files**, arrastrar los archivos y las carpetas `css`, `js` y `assets`, y confirmar el commit. También se puede utilizar Git:

   ```bash
   cd nexusbank
   git init
   git add .
   git commit -m "Build NexusBank banking simulator"
   git branch -M main
   git remote add origin https://github.com/USERNAME/nexusbank.git
   git push -u origin main
   ```

   Sustituir `USERNAME` por el usuario u organización de GitHub que será propietario del repositorio. Si ya existe un repositorio inicializado con historial propio, hay que integrar los archivos en ese repositorio en vez de sobrescribir su historial.

4. Entrar al repositorio en GitHub → **Settings → Pages**.
5. En **Build and deployment**, seleccionar **Deploy from a branch** como origen.
6. Elegir rama **`main`**, carpeta **`/(root)`** y pulsar **Save**.
7. Esperar a que GitHub Pages muestre el enlace de publicación. Puede tardar algunos minutos.
8. Abrir cada ruta de forma independiente y comprobar la navegación:

   | Sección | Dirección esperada |
   | --- | --- |
   | Main | `https://USERNAME.github.io/nexusbank/` |
   | Credit Card | `https://USERNAME.github.io/nexusbank/credit-card.html` |
   | Mortgages | `https://USERNAME.github.io/nexusbank/mortgages.html` |
   | Payroll | `https://USERNAME.github.io/nexusbank/payroll.html` |
   | Fraud & Disputes | `https://USERNAME.github.io/nexusbank/fraud-disputes.html` |

No usar rutas con `/` al comienzo para recursos locales ni cambiar la estructura indicada. El proyecto ya utiliza enlaces relativos y funcionará bajo el subdirectorio `/nexusbank/` de GitHub Pages. HTTPS lo proporciona GitHub Pages. Estas son **URLs esperadas**, no enlaces activos antes de la publicación.

## Funcionalidad de demostración

- **Credit Card:** escoger cero, una o dos tarjetas en el comparador. Ajustar gastos mensuales y tasa de recompensas para proyectar un año ficticio.
- **Mortgages:** alternar entre 30 años, 15 años y estilo FHA de ejemplo; introducir precio, porcentaje de enganche, impuestos y seguro. Se calcula principal + interés con una fórmula de amortización, más estimaciones mensuales de gastos. El PMI se simplifica a `0.5%` anual sobre el principal cuando el enganche es inferior a 20%; no representa MIP real de FHA.
- **Payroll:** filtrar movimientos, cambiar el porcentaje entre checking y savings y explorar una inscripción de Direct Deposit completamente ficticia.
- **Report Fraud:** abrir el formulario, indicar tipo, fecha, movimiento opcional y explicación inventada. Se genera una referencia `NX-DEMO-...` y aparece en el seguimiento.
- **Dispute a Transaction:** seleccionar un movimiento de prueba, elegir motivo y describir la disputa. Se registra como caso independiente en el mismo panel.
- **Fraud Case Tracking:** consultar referencia, fecha, tipo, estado y cronología. El botón de avance es **solo para probar** `Submitted`, `Under Review`, `Additional Information Required`, `Resolved` y `Closed`.
- **Account Security Actions:** bloquear/desbloquear una tarjeta inventada, saltar a movimientos, completar una lista educativa y leer orientaciones de contacto con soporte real.
- **Report a Problem:** desde cualquier página, abrir modal con origen automático, categoría y descripción; guardar un reporte local con referencia `PR-DEMO-...`.

## Datos, privacidad y seguridad

- **No existe servidor:** ningún formulario transmite datos a un banco, empleador, operador de pagos o servicio de soporte.
- El código guarda solamente simulaciones en `localStorage`, bajo las claves `nexusbank:cases`, `nexusbank:problem-reports`, `nexusbank:card-locked` y `nexusbank:payroll-setup`.
- Este almacenamiento pertenece al navegador/origen actual; puede desaparecer al borrar datos del sitio, usar modo privado o cambiar de dispositivo. No se comparte entre visitantes.
- Las transacciones, balances, nombres comerciales, referencias, productos y tasas son ficticios. Los formularios tienen advertencias para **no introducir datos reales**.
- No se solicita ni recopila contraseña, CVV, SSN, número completo de tarjeta o identificación bancaria real.
- Una URL de GitHub Pages es pública si el repositorio se publica como público. Aun así, cada visitante verá solamente sus propios datos de ejemplo almacenados en su navegador.

Para reiniciar una demostración, eliminar las claves `nexusbank:*` en las herramientas de almacenamiento local del navegador para ese sitio y recargar.

## Extensión futura a una infraestructura auténtica

La UI está separada del almacenamiento de ejemplos en `js/main.js`: las funciones `get()` / `put()` son el punto de sustitución y `addCase()` / los manejadores de formularios definen los flujos de eventos. Una integración futura debería crear una capa de servicios/API **desde cero**, en un backend seguro; no bastaría con enviar estos formularios a una URL.

Antes de cualquier servicio bancario auténtico serían necesarios, como mínimo: autenticación y autorización robustas, verificación de identidad cuando corresponda, seguridad del transporte, controles CSRF, validación y sanitización en servidor, limitación de tasas, protección y cifrado de datos, registros auditables, retención y privacidad, control de acceso por cliente, atención humana, procesos regulatorios y revisión legal/compliance. **No conectar directamente este prototipo público a datos reales ni secretos de API.**

## Lista de comprobación para una publicación

- [ ] Las cinco URLs directas cargan bajo `/nexusbank/`.
- [ ] Header, navegación, footer y botón `Report a Problem` se ven en las cinco páginas.
- [ ] El menú móvil se abre y se cierra; no hay desplazamiento horizontal no deseado.
- [ ] El comparador de tarjetas permite máximo dos y recalcula las recompensas.
- [ ] La calculadora hipotecaria cambia al modificar términos e importes.
- [ ] Payroll filtra movimientos, divide el sueldo y guarda el setup de muestra.
- [ ] Se crea un caso con `Report Fraud`; la disputa de un movimiento crea otro distinto.
- [ ] El seguimiento permite seleccionar casos, consultar cronología y avanzar todos los estados.
- [ ] `Lock Card` se puede alternar y las demás acciones abren los controles adecuados.
- [ ] `Report a Problem` indica automáticamente la página de origen, valida el formulario y confirma.
- [ ] No hay enlaces internos rotos ni peticiones a servicios bancarios reales.

**Licencia de uso del prototipo:** contenido de demostración destinado a diseño, enseñanza y pruebas. “NexusBank” representa aquí una marca ficticia.
