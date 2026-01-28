<template>
  <!-- Componente utilitário para injetar estilos globais -->
</template>

<style>
/* ====== GLOBAL STYLES ====== */

/* Títulos */
h1, h2, h3, h4, h5, h6 {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

/* Botões */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* Cards */
.card {
  background-color: rgba(15, 23, 42, 0.9);
  border-radius: 0.75rem;
  box-shadow: none;
  border: none;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Inputs */
input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Container de página responsivo (mobile-first) */
.page-container {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  padding: 1rem;
  background-color: transparent;
  min-height: 100vh;
}

/* Breakpoints */
@media (min-width: 576px) {
  .page-container { max-width: 540px; padding: 1.25rem; }
}

@media (min-width: 768px) {
  .page-container { max-width: 720px; padding: 1.5rem; }
}

@media (min-width: 992px) {
  .page-container { max-width: 960px; padding: 2rem; }
}

@media (min-width: 1200px) {
  .page-container { max-width: 1280px; padding: 2rem; }
}

/* Utilitários de layout responsivo */
.d-flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 1rem; }

/* Texto centralizado */
.text-center {
  text-align: center;
}

/* Margens e espaçamentos */
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }

/* Utilitários de tema escuro e vidro */
.glass-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 1rem;
  border: none;
  backdrop-filter: blur(12px);
  padding: 1rem;
  color: #ffffff;
}

.glass-panel {
  background: linear-gradient(135deg, rgba(88, 28, 135, 0.35), rgba(59, 130, 246, 0.25));
  border-radius: 1rem;
  border: none;
  backdrop-filter: blur(20px);
  padding: 1rem;
  color: #ffffff;
}

.glass-input {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 0.75rem;
  border: none;
  padding: 0.75rem 0.875rem;
  color: #ffffff;
}

.text-primary { color: #2563eb; }
.text-warning { color: #f59e0b; }
.text-destructive { color: #ef4444; }

.status-pending {
  background: rgba(245, 158, 11, 0.18);
  color: #fde68a;
}

.status-rejected {
  background: rgba(239, 68, 68, 0.18);
  color: #fca5a5;
}
</style>
