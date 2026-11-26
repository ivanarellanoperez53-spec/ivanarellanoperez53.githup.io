// ---------- Protección + control de rol ----------
const sesion = JSON.parse(sessionStorage.getItem("sesionIvan"));

if (!sesion) {
  window.location.href = "../index.html";
}

// Elementos comunes
document.getElementById("saludo").textContent = "Hola, " + sesion.nombre;

// ✅ Mostrar / ocultar zona admin según el rol
const zonaAdmin = document.getElementById("zonaAdmin");
if (zonaAdmin) {
  zonaAdmin.hidden = sesion.rol !== "admin";
}

// ---------- Datos (array de objetos) ----------
const productos = [
  { id: 1, nombre: "Salteñas",  categoria: "entradas",  precio: 10,desciptivo:"pollo y carne", imagen: "../img/saltenas.png", color: "#DCE6F2" },
  { id: 2, nombre: "Anticuchos",  categoria: "entradas",  precio: 15,  desciptivo: "Corazon de res",  imagen: "../img/anticucho.png", color: "#F6E3B4" },
  { id: 3, nombre: "Humintas",       categoria: "entradas", precio: 20, desciptivo: "con queso", imagen: "../img/huminta.png", color: "#C9D3E6" },
  { id: 4, nombre: "Sopa de mani",   categoria: "sopas", precio: 25, desciptivo: "Carne, fideos y papas", imagen: "../img/mani.png", color: "#D8DDD0" },
  { id: 5, nombre: "Chairo", categoria: "sopas",    precio: 30, desciptivo: "chuño,papa y carne", imagen: "../img/chairo.png", color: "#E6D5CF" },
  { id: 6, nombre: "Sopa de Quinua",     categoria: "sopas",    precio: 20, desciptivo: "mais, verduras y quinua",  imagen: "../img/quinua.png", color: "#D5D9E3" },
  { id: 7, nombre: "Silpancho",   categoria: "principales", precio: 25,  desciptivo: "arroz o fideo",  imagen: "../img/silpancho.png", color: "#F2D4CF" },
  { id: 8, nombre: "Pique macho",    categoria: "principales", precio: 35,  desciptivo: "papas, carne y salchicha",  imagen: "../img/pique.png", color: "#DDE8D8" },
  { id: 9, nombre: "Majadito",    categoria: "principales", precio: 30,  desciptivo: "charque y huevo",  imagen: "../img/majadito.png", color: "#DDE8D8" },
  { id: 10, nombre: "Chicha",    categoria: "bebidas", precio: 6,  desciptivo: "bebida de mais",  imagen: "../img/chicha.png", color: "#DDE8D8" },
  { id: 11, nombre: "Mocochinche",    categoria: "bebidas", precio: 10,  desciptivo: "bebida de durazno",  imagen: "../img/mocochinche.png", color: "#DDE8D8" }
];

const titulos = {
  todos: "Nuestro Menú", camisetas: "Camisetas", pantalones: "Pantalones",
  abrigos: "Abrigos", accesorios: "Accesorios"
};

let carrito = [];

// ---------- Elementos ----------
const contProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const totalEl = document.getElementById("total");
const tituloEl = document.getElementById("tituloCategoria");
const contadorEl = document.getElementById("contador");
const menu = document.getElementById("menuLateral");
const fondo = document.getElementById("fondo");
const btnMenu = document.getElementById("btnMenu");

document.getElementById("saludo").textContent = "Hola, " + sesion.nombre;

// ---------- Menú desplegable ----------
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

// ---------- Catálogo ----------
function mostrarProductos(filtro = "todos") {
  const lista = filtro === "todos" ? productos : productos.filter(p => p.categoria === filtro);
  tituloEl.textContent = titulos[filtro];
  contadorEl.textContent = lista.length + " productos";

  contProductos.innerHTML = lista.map(p => `
    <article class="producto">
      <div class="producto__img" style="background:${p.color}" aria-hidden="true"><img class="imagen-producto" src="${p.imagen}" alt="${p.nombre}"></div>
      <div class="producto__info">
        <h3>${p.nombre}</h3>
        <span class="talla">Descripcion: ${p.desciptivo}</span>
        <span class="precio">Bs ${p.precio}</span>
        <button data-id="${p.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".nav a").forEach(enlace => {
  enlace.addEventListener("click", () => {
    document.querySelector(".nav a.activo").classList.remove("activo");
    enlace.classList.add("activo");
    mostrarProductos(enlace.dataset.filtro);
    cerrarMenu();
  });
});

// ---------- Carrito ----------
contProductos.addEventListener("click", e => {
  const boton = e.target.closest("button[data-id]");
  if (!boton) return;
  const producto = productos.find(p => p.id === Number(boton.dataset.id));
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) existente.cantidad++;
  else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  mostrarCarrito();
});

function mostrarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="vacio">Aún no agregaste prendas.</li>';
    totalEl.textContent = "Bs 0";
    return;
  }
  listaCarrito.innerHTML = carrito.map(i =>
    `<li><span>${i.cantidad} × ${i.nombre}</span><span>Bs ${i.cantidad * i.precio}</span></li>`
  ).join("");
  const total = carrito.reduce((suma, i) => suma + i.cantidad * i.precio, 0);
  totalEl.textContent = "Bs " + total;
}

document.getElementById("btnVaciar").addEventListener("click", () => {
  carrito = [];
  mostrarCarrito();
});

// ---------- Cerrar sesión ----------
document.getElementById("btnSalir").addEventListener("click", () => {
  sessionStorage.removeItem("sesionIvan");
  window.location.href = "../index.html";
});

// ---------- Inicio ----------
mostrarProductos();
mostrarCarrito();