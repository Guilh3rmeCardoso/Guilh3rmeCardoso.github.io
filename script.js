// ===============================================
// 1. LÓGICA DO CONTADOR DE TEMPO E SCROLL
// ===============================================

// *** DATA DE INÍCIO CORRIGIDA: 02 de Novembro de 2021 ***
const START_DATE = new Date('2021-11-02T00:00:00').getTime(); 

function updateCountdown() {
    const now = new Date().getTime();
    const difference = now - START_DATE;

    if (difference <= 0) {
        document.getElementById('countdown-timer').innerHTML = "Onde tudo começou.";
        return;
    }

    // Cálculos de tempo
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365.25);

    const remainingDays = Math.floor(days % 365.25);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    // Formatação da exibição
    document.getElementById('countdown-timer').innerHTML = 
        `${years} <span>anos</span> | ${remainingDays} <span>dias</span> | ${remainingHours} <span>horas</span> | ${remainingMinutes} <span>minutos</span> | ${remainingSeconds} <span>segundos</span>`;
}

// Atualiza a cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Chamada inicial para evitar delay

// Função de scroll para o primeiro ano
function scrollToFirstYear() {
    document.getElementById('year-2022').scrollIntoView({ behavior: 'smooth' });
}


// Lógica de "Reveal on Scroll"
const hiddenElements = document.querySelectorAll('.hidden-element');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
        }
    });
}, {
    threshold: 0.1 
});

hiddenElements.forEach(element => {
    observer.observe(element);
});


// ===============================================
// 2. LÓGICA DE CAPTURA E COMPARTILHAMENTO (html2canvas)
// ===============================================

function captureAndShare(elementId, fileName) {
    const element = document.getElementById(elementId);
    
    // Adiciona uma pequena mensagem para o usuário
    alert(`Preparando a imagem da seção "${fileName.replace(/_/g, ' ')}" para o Instagram! Assim que o download iniciar, volte aqui para a instrução final.`);

    // O html2canvas fará a captura do elemento
    html2canvas(element, {
        scale: 2, // Aumenta a resolução da imagem
        backgroundColor: '#121212', // Garante que o fundo seja escuro
    }).then(canvas => {
        // Converte o canvas em um Data URL (base64)
        const image = canvas.toDataURL('image/png');

        // Cria um link de download temporário
        const a = document.createElement('a');
        a.href = image;
        a.download = `Wrapped_${fileName}.png`;

        // Simula o clique para iniciar o download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Instrução final
        setTimeout(() => {
             alert(
                "✅ Download Concluído! \n\n" +
                "1. Abra seu aplicativo do Instagram. \n" +
                "2. Crie um novo Post ou Story. \n" +
                "3. Selecione a imagem que você acabou de baixar (deve estar na sua galeria)."
            );
        }, 500);
    }).catch(error => {
        console.error('Erro ao capturar a seção:', error);
        alert('Ocorreu um erro ao gerar a imagem. Verifique o console.');
    });
}


// ===============================================
// 3. LÓGICA DA ANIMAÇÃO DE CONSTELAÇÃO (CANVAS)
// ===============================================

const canvas = document.getElementById('constellationCanvas');
// Verifica se o elemento canvas existe na página antes de continuar
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 80;
    const maxDistance = 120; // Distância para conectar duas "estrelas"
    const particleColor = 'rgba(255, 255, 255, 0.8)';
    const lineColor = 'rgba(255, 255, 255, 0.1)';

    // Classe para representar cada "estrela"
    class Particle {
        constructor(x, y, radius, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.velocity = velocity;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update() {
            // Movimento: Atualiza a posição
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // Tratamento de Borda: Inverte a direção se a partícula atingir a borda
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }

            this.draw();
        }
    }

    // Inicializa as partículas
    function initParticles() {
        particles = [];
        // Garante que o canvas tenha o tamanho correto do container pai
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        for (let i = 0; i < numParticles; i++) {
            const radius = Math.random() * 2 + 1;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            
            // Velocidade muito lenta (entre -0.1 e 0.1)
            const velocity = {
                x: (Math.random() - 0.5) * 0.2, 
                y: (Math.random() - 0.5) * 0.2
            };

            particles.push(new Particle(x, y, radius, velocity));
        }
    }

    // Função principal de conexão (Desenha as constelações)
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                // Cálculo da distância euclidiana
                const distance = Math.sqrt(
                    (p1.x - p2.x) * (p1.x - p2.x) + 
                    (p1.y - p2.y) * (p1.y - p2.y)
                );

                if (distance < maxDistance) {
                    // Calcula a opacidade da linha baseada na proximidade
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`; // Linhas muito sutis
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop principal da animação
    function animate() {
        requestAnimationFrame(animate);
        // O fundo do canvas é limpo e redesenhado a cada frame
        ctx.fillStyle = '#000005'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        connectParticles();
        
        particles.forEach(particle => {
            particle.update();
        });
    }

    // Evento para reajustar o canvas se a janela for redimensionada
    window.addEventListener('resize', () => {
        initParticles();
    });

    // Inicia a animação
    initParticles();
    animate();

}
