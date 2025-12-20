// Funcionalidade do botão "Voltar"
document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btn-back");

  // Botão voltar
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      // Se tem histórico, volta
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Se não tem histórico, vai pro home
        window.location.href = "/";
      }
    });
  }

  // Easter egg: Konami Code (cima, cima, baixo, baixo, esquerda, direita, esquerda, direita, B, A)
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    // Adiciona efeito de confete/animação especial
    const errorNumber = document.querySelector(".error-number");
    errorNumber.style.animation = "none";

    setTimeout(() => {
      errorNumber.style.animation = "rainbow 2s linear infinite";

      // Cria elemento de mensagem especial
      const message = document.createElement("div");
      message.textContent = "🎉 Você descobriu o segredo! 🎉";
      message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: slideDown 0.5s ease-out;
      `;

      document.body.appendChild(message);

      // Remove depois de 3 segundos
      setTimeout(() => {
        message.style.animation = "slideUp 0.5s ease-out";
        setTimeout(() => message.remove(), 500);
      }, 3000);
    }, 10);
  }

  // Adiciona animações CSS para o easter egg
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
    }
  `;
  document.head.appendChild(style);

  // Efeito de parallax nos círculos decorativos
  const circles = document.querySelectorAll(".circle");

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    circles.forEach((circle, index) => {
      const speed = (index + 1) * 0.05;
      const x = (mouseX - 0.5) * 50 * speed;
      const y = (mouseY - 0.5) * 50 * speed;

      circle.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
});
