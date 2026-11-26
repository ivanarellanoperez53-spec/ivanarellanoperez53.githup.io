// ---------- Protección: solo administradores ----------
const sesion = JSON.parse(sessionStorage.getItem("sesionIvan"));

if (!sesion) {
  window.location.href = "../index.html";
}
if (sesion.rol !== "admin") {
  alert("Acceso denegado. Solo administradores.");
  window.location.href = "inicio.html";
}

// ---------- Saludo y menú ----------
document.getElementById("saludo").textContent = "Hola, " + sesion.nombre;

const menu = document.getElementById("menuLateral");
const fondo = document.getElementById("fondo");
const btnMenu = document.getElementById("btnMenu");

function abrirMenu() {
  menu.classList.add("abierto");
  fondo.hidden = false;
  btnMenu.setAttribute("aria-expanded", "true");
}
function cerrarMenu() {
  menu.classList.remove("abierto");
  fondo.hidden = true;
  btnMenu.setAttribute("aria-expanded", "false");
}
btnMenu.addEventListener("click", abrirMenu);
document.getElementById("btnCerrar").addEventListener("click", cerrarMenu);
fondo.addEventListener("click", cerrarMenu);
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenu(); });

// ---------- Cerrar sesión ----------
document.getElementById("btnSalir").addEventListener("click", () => {
  sessionStorage.removeItem("sesionIvan");
  window.location.href = "../index.html";
});

// ================================================================
//  PRODUCTOS (solo si existe el contenedor en la página)
// ================================================================
const tablaProductos = document.getElementById("tablaProductos");

if (tablaProductos) {
  const claveStorageProd = "productosIvan";
  const productosDefault = [
    { id: 1,  nombre: "Salteñas",       categoria: "entradas",    precio: 10, descripcion: "pollo y carne",             color: "#DCE6F2" },
    { id: 2,  nombre: "Anticuchos",     categoria: "entradas",    precio: 15, descripcion: "Corazon de res",            color: "#F6E3B4" },
    { id: 3,  nombre: "Humintas",       categoria: "entradas",    precio: 20, descripcion: "con queso",                 color: "#C9D3E6" },
    { id: 4,  nombre: "Sopa de mani",   categoria: "sopas",       precio: 25, descripcion: "Carne, fideos y papas",     color: "#D8DDD0" },
    { id: 5,  nombre: "Chairo",         categoria: "sopas",       precio: 30, descripcion: "chuño, papa y carne",       color: "#E6D5CF" },
    { id: 6,  nombre: "Sopa de Quinua", categoria: "sopas",       precio: 20, descripcion: "maiz, verduras y quinua",   color: "#D5D9E3" },
    { id: 7,  nombre: "Silpancho",      categoria: "principales", precio: 25, descripcion: "arroz o fideo",             color: "#F2D4CF" },
    { id: 8,  nombre: "Pique macho",    categoria: "principales", precio: 35, descripcion: "papas, carne y salchicha",  color: "#DDE8D8" },
    { id: 9,  nombre: "Majadito",       categoria: "principales", precio: 30, descripcion: "charque y huevo",           color: "#DDE8D8" },
    { id: 10, nombre: "Chicha",         categoria: "bebidas",     precio: 6,  descripcion: "bebida de maiz",            color: "#DDE8D8" },
    { id: 11, nombre: "Mocochinche",    categoria: "bebidas",     precio: 10, descripcion: "bebida de durazno",         color: "#DDE8D8" }
  ];

  let productos = JSON.parse(sessionStorage.getItem(claveStorageProd)) || productosDefault;

  function guardarProductos() {
    sessionStorage.setItem(claveStorageProd, JSON.stringify(productos));
  }

  function renderProductos() {
    tablaProductos.innerHTML = productos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${p.descripcion}</td>
        <td>Bs ${p.precio}</td>
        <td class="acciones">
          <button class="btn-mini" data-editar="${p.id}">Editar</button>
          <button class="btn-mini btn-peligro" data-eliminar="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join("");
  }

  const form = document.getElementById("formProducto");
  const prodId = document.getElementById("prodId");
  const prodNombre = document.getElementById("prodNombre");
  const prodCategoria = document.getElementById("prodCategoria");
  const prodPrecio = document.getElementById("prodPrecio");
  const prodDescripcion = document.getElementById("prodDescripcion");

  document.getElementById("btnNuevo").addEventListener("click", () => {
    form.hidden = false;
    prodId.value = "";
    form.reset();
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    form.hidden = true;
    form.reset();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const datos = {
      nombre: prodNombre.value.trim(),
      categoria: prodCategoria.value,
      precio: Number(prodPrecio.value),
      descripcion: prodDescripcion.value.trim(),
      color: "#DCE6F2"
    };

    if (prodId.value) {
      const p = productos.find(x => x.id === Number(prodId.value));
      Object.assign(p, datos);
    } else {
      const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
      productos.push({ id: nuevoId, ...datos });
    }

    guardarProductos();
    renderProductos();
    form.hidden = true;
    form.reset();
  });

  tablaProductos.addEventListener("click", e => {
    const btnEditar = e.target.closest("[data-editar]");
    const btnEliminar = e.target.closest("[data-eliminar]");

    if (btnEditar) {
      const p = productos.find(x => x.id === Number(btnEditar.dataset.editar));
      form.hidden = false;
      prodId.value = p.id;
      prodNombre.value = p.nombre;
      prodCategoria.value = p.categoria;
      prodPrecio.value = p.precio;
      prodDescripcion.value = p.descripcion;
    }

    if (btnEliminar) {
      if (confirm("¿Eliminar este producto?")) {
        productos = productos.filter(x => x.id !== Number(btnEliminar.dataset.eliminar));
        guardarProductos();
        renderProductos();
      }
    }
  });

  renderProductos();
}

// ================================================================
//  CLIENTES
// ================================================================
const tablaClientes = document.getElementById("tablaClientes");

if (tablaClientes) {
  const claveStorageCli = "usuariosIvan";
  const usuariosDefault = [
    { usuario: "ivan",    clave: "ivan123",   nombre: "Administrador", rol: "admin" },
    { usuario: "cliente", clave: "1234",      nombre: "Camila Rojas",  rol: "cliente" },
    { usuario: "maria",   clave: "maria2026", nombre: "María Quispe",  rol: "cliente" },
    { usuario: "admin",   clave: "4321",      nombre: "Ivan Pari",     rol: "admin" }
  ];

  let usuarios = JSON.parse(sessionStorage.getItem(claveStorageCli)) || usuariosDefault;

  function guardarUsuarios() {
    sessionStorage.setItem(claveStorageCli, JSON.stringify(usuarios));
  }

  function renderClientes() {
    tablaClientes.innerHTML = usuarios.map((u, i) => `
      <tr>
        <td>${u.usuario}</td>
        <td>${u.nombre}</td>
        <td>${u.clave}</td>
        <td><span class="badge ${u.rol}">${u.rol}</span></td>
        <td class="acciones">
          <button class="btn-mini" data-editar-cli="${i}">Editar</button>
          <button class="btn-mini btn-peligro" data-eliminar-cli="${i}">Eliminar</button>
        </td>
      </tr>
    `).join("");
  }

  const form = document.getElementById("formCliente");
  const cliId = document.getElementById("cliId");
  const cliUsuario = document.getElementById("cliUsuario");
  const cliNombre = document.getElementById("cliNombre");
  const cliClave = document.getElementById("cliClave");
  const cliRol = document.getElementById("cliRol");

  document.getElementById("btnNuevoCliente").addEventListener("click", () => {
    form.hidden = false;
    cliId.value = "";
    form.reset();
  });

  document.getElementById("btnCancelarCliente").addEventListener("click", () => {
    form.hidden = true;
    form.reset();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const datos = {
      usuario: cliUsuario.value.trim().toLowerCase(),
      nombre: cliNombre.value.trim(),
      clave: cliClave.value,
      rol: cliRol.value
    };

    // Validar usuario duplicado
    const duplicado = usuarios.some((u, i) =>
      u.usuario === datos.usuario && i !== Number(cliId.value)
    );
    if (duplicado) {
      alert("Ese nombre de usuario ya existe.");
      return;
    }

    if (cliId.value !== "") {
      usuarios[Number(cliId.value)] = datos;
    } else {
      usuarios.push(datos);
    }

    guardarUsuarios();
    renderClientes();
    form.hidden = true;
    form.reset();
  });

  tablaClientes.addEventListener("click", e => {
    const btnEditar = e.target.closest("[data-editar-cli]");
    const btnEliminar = e.target.closest("[data-eliminar-cli]");

    if (btnEditar) {
      const i = Number(btnEditar.dataset.editarCli);
      const u = usuarios[i];
      form.hidden = false;
      cliId.value = i;
      cliUsuario.value = u.usuario;
      cliNombre.value = u.nombre;
      cliClave.value = u.clave;
      cliRol.value = u.rol;
    }

    if (btnEliminar) {
      const i = Number(btnEliminar.dataset.eliminarCli);
      if (usuarios[i].usuario === sesion.nombre) {
        alert("No puedes eliminar tu propia cuenta desde aquí.");
        return;
      }
      if (confirm("¿Eliminar este cliente?")) {
        usuarios.splice(i, 1);
        guardarUsuarios();
        renderClientes();
      }
    }
  });

  renderClientes();
}