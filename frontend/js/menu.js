// =============================================
//  MENU LATERAL + DROPDOWN PERFIL (menu.js)
// =============================================
// Este script controla el menú lateral (☰) y el menú desplegable del perfil (dropdown).
// Está encapsulado en una función autoinvocada (IIFE) para evitar conflictos en el scope global.

(() => {
  // --- ELEMENTOS DEL DOM ---
  const openMenuBtn   = document.getElementById('openMenu');     // Botón "☰" en la barra superior
  const closeMenuBtn  = document.getElementById('closeMenu');    // Botón "X" dentro del menú lateral
  const sideMenu      = document.getElementById('sideMenu');     // Contenedor del menú lateral
  const overlay       = document.getElementById('overlay');      // Fondo oscuro detrás del menú

  // --- FUNCIONES DEL MENÚ LATERAL ---
  const openSide = () => {
    sideMenu?.classList.add('active');   // Muestra el menú lateral
    overlay?.classList.add('active');    // Activa el fondo oscuro
  };

  const closeSide = () => {
    sideMenu?.classList.remove('active');  // Oculta el menú lateral
    overlay?.classList.remove('active');   // Quita el fondo oscuro
  };

  // --- EVENTOS DEL MENÚ LATERAL ---
  openMenuBtn?.addEventListener('click', openSide);       // Abre con ☰
  closeMenuBtn?.addEventListener('click', closeSide);     // Cierra con X

  // Cierra el menú al hacer clic en el overlay
  overlay?.addEventListener('click', () => {
    closeSide();
    closeDropdown();  // También cierra el menú de perfil si está abierto
  });

  // Cierra el menú si se hace clic en algún enlace dentro de él
  document.querySelectorAll('#sideMenu a').forEach(link =>
    link.addEventListener('click', closeSide)
  );

  // --- ELEMENTOS DEL DROPDOWN PERFIL ---
  const profileIcon = document.getElementById('profileIcon');   // Icono del perfil (mini foto)
  const profileMenu = document.getElementById('profileMenu');   // Menú desplegable de perfil

  // --- FUNCIONES DEL DROPDOWN ---
  const toggleDropdown = (e) => {
    e.stopPropagation();                    // Evita que el evento suba al documento
    profileMenu?.classList.toggle('active'); // Alterna la visibilidad del menú
  };

  const closeDropdown = () => {
    profileMenu?.classList.remove('active'); // Cierra el menú desplegable
  };

  // --- EVENTOS DEL DROPDOWN ---
  profileIcon?.addEventListener('click', toggleDropdown);  // Abre/cierra con clic en el icono

  // Si se hace clic fuera del menú desplegable → se cierra
  document.addEventListener('click', (e) => {
    if (!profileMenu || !profileIcon) return;
    const clickedInside = profileMenu.contains(e.target) || profileIcon.contains(e.target);
    if (!clickedInside) closeDropdown();
  });

  // Presionar ESC cierra ambos menús
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSide();
      closeDropdown();
    }
  });

})(); // Fin de la función autoinvocada

// -----------------------------------------------------------
// Este archivo controla dos componentes principales:
// - Menú lateral: se abre con ☰ y se cierra con X, overlay o clic en un link.
// - Menú de perfil (dropdown): se abre al tocar el icono y se cierra al tocar afuera o con ESC.
// Las clases .active son controladas por CSS para mostrar u ocultar los menús.
// -----------------------------------------------------------
