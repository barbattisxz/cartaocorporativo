<template>
  <nav class="bottom-navbar">
    <div class="nav-section">
      <router-link to="/home" class="nav-item" active-class="active">
        <i class="fas fa-home"></i>
        <span>Início</span>
      </router-link>
      <router-link to="/fatura" class="nav-item" active-class="active">
        <i class="fas fa-file-invoice"></i>
        <span>Faturas</span>
      </router-link>
    </div>

    <router-link to="/ocr" class="ocr-btn">
      <i class="fas fa-plus"></i>
      <span class="ocr-label">Nota</span>
    </router-link>

    <div class="nav-section">
      <router-link to="/despesas" class="nav-item" active-class="active">
        <i class="fas fa-clock"></i>
        <span>Histórico</span>
      </router-link>
      <router-link to="/perfil" class="nav-item" active-class="active">
        <i class="fas fa-user"></i>
        <span>Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(91, 33, 182, 0.35), rgba(59, 130, 246, 0.25));
  backdrop-filter: blur(14px);
  padding: 0 0.75rem;
  z-index: 1000;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-bottom: env(safe-area-inset-bottom, 0);
  box-shadow: 0 -10px 28px rgba(2, 6, 23, 0.45);
}

.navbar-content {
  width: 100%;
  max-width: 1280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.nav-section {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.75rem;
  flex: 1;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  transition: all 0.2s;
  height: 100%;
  min-width: 64px;
}

.nav-item:hover,
.nav-item.active {
  color: #ffffff;
}

.nav-item i {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.ocr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #6d28d9, #2563eb);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
  border: 2px solid rgba(255,255,255,0.16);
}
.ocr-btn i {
  font-size: 1rem;
}
.ocr-label {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
