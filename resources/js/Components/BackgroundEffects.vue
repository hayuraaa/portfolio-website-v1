<template>
    <div class="background-effects">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
  
      <!-- Floating Orbs -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400/15 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute top-40 right-32 w-96 h-96 bg-purple-400/15 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/15 rounded-full blur-xl animate-pulse delay-2000"></div>
  
      <!-- Light Beams -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-20 -left-20 w-2 h-screen bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent rotate-12 animate-light-move-1"></div>
        <div class="absolute -top-20 left-1/4 w-1 h-screen bg-gradient-to-b from-transparent via-blue-400/25 to-transparent rotate-45 animate-light-move-2"></div>
        <div class="absolute -top-20 right-1/4 w-1.5 h-screen bg-gradient-to-b from-transparent via-purple-400/20 to-transparent -rotate-12 animate-light-move-3"></div>
        <div class="absolute top-1/3 -left-full w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent animate-light-sweep"></div>
      </div>
  
      <!-- Floating Particles -->
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-float-particle-1"></div>
      <div class="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-float-particle-2"></div>
      <div class="absolute bottom-1/4 left-2/3 w-1 h-1 bg-purple-400/60 rounded-full animate-float-particle-3"></div>
  
      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
    </div>
  </template>
  
  <script setup></script>
  
  <style scoped>
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  /* Animations for light beams and particles */
  @keyframes light-move-1 {
    0% { transform: translateX(-100vw) translateY(-50vh) rotate(12deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(100vw) translateY(50vh) rotate(12deg); opacity: 0; }
  }
  @keyframes light-move-2 {
    0% { transform: translateX(-100vw) translateY(-30vh) rotate(45deg); opacity: 0; }
    15% { opacity: 0.8; }
    85% { opacity: 0.8; }
    100% { transform: translateX(100vw) translateY(30vh) rotate(45deg); opacity: 0; }
  }
  @keyframes light-move-3 {
    0% { transform: translateX(100vw) translateY(-40vh) rotate(-12deg); opacity: 0; }
    20% { opacity: 0.6; }
    80% { opacity: 0.6; }
    100% { transform: translateX(-100vw) translateY(40vh) rotate(-12deg); opacity: 0; }
  }
  @keyframes light-sweep {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(200%); opacity: 0; }
  }
  @keyframes float-particle-1 {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    33% { transform: translate(30px, -20px) scale(1.2); opacity: 1; }
    66% { transform: translate(-20px, -40px) scale(0.8); opacity: 0.8; }
  }
  @keyframes float-particle-2 {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
    50% { transform: translate(-40px, 30px) scale(1.5); opacity: 1; }
  }
  @keyframes float-particle-3 {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    25% { transform: translate(20px, -30px) scale(1.3); opacity: 0.9; }
    75% { transform: translate(-30px, 20px) scale(0.7); opacity: 0.7; }
  }
  
  .animate-light-move-1 { animation: light-move-1 8s linear infinite; }
  .animate-light-move-2 { animation: light-move-2 12s linear infinite 2s; }
  .animate-light-move-3 { animation: light-move-3 10s linear infinite 4s; }
  .animate-light-sweep { animation: light-sweep 6s ease-in-out infinite 1s; }
  
  .animate-float-particle-1 { animation: float-particle-1 4s ease-in-out infinite; }
  .animate-float-particle-2 { animation: float-particle-2 6s ease-in-out infinite 1s; }
  .animate-float-particle-3 { animation: float-particle-3 5s ease-in-out infinite 2s; }
  </style>