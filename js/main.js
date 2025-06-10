// Array delle materie
const subjects = [
    'matematica', 'scienze', 'geografia', 'storia', 'letteratura',
    'motoria', 'arte', 'inglese', 'francese', 'tecnologia', 'musica'
];

// Configurazione
const config = {
    containerRadius: 250, // Raggio del cerchio in pixel
    centerX: 300,        // Centro X del container
    centerY: 300,        // Centro Y del container
    wordSpacing: 30      // Spazio tra le parole in gradi
};

// Funzione per convertire gradi in radianti
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Funzione per posizionare le parole in cerchio
function positionWords() {
    const container = document.getElementById('subjects-container');
    const svg = document.getElementById('connections');
    
    // Rimuovi elementi esistenti
    container.innerHTML = '';
    svg.innerHTML = '';

    // Calcola l'angolo tra ogni parola
    const angleStep = 360 / subjects.length;

    subjects.forEach((subject, index) => {
        // Calcola la posizione
        const angle = degreesToRadians(index * angleStep);
        const x = config.centerX + config.containerRadius * Math.cos(angle);
        const y = config.centerY + config.containerRadius * Math.sin(angle);

        // Crea l'elemento parola
        const wordElement = document.createElement('div');
        wordElement.className = 'subject-word absolute text-white text-xl cursor-pointer transform -translate-x-1/2 -translate-y-1/2';
        wordElement.style.left = `${x}px`;
        wordElement.style.top = `${y}px`;
        wordElement.textContent = subject;
        wordElement.dataset.subject = subject;

        // Aggiungi evento click
        wordElement.addEventListener('click', () => {
            navigateToSubject(subject);
        });

        container.appendChild(wordElement);

        // Crea la linea di connessione
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = config.centerX;
        const startY = config.centerY;
        const endX = x;
        const endY = y;

        // Crea una curva di Bezier per la linea
        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2 - 50;

        const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
        line.setAttribute('d', pathData);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('fill', 'none');

        svg.appendChild(line);
    });
}

// Funzione per la navigazione alla pagina della materia
function navigateToSubject(subject) {
    // Effetto di transizione
    document.body.style.transition = 'all 1s ease-in-out';
    document.body.style.transform = 'scale(0) rotate(360deg)';
    document.body.style.opacity = '0';

    // Dopo l'animazione, reindirizza alla pagina della materia
    setTimeout(() => {
        window.location.href = `subjects/${subject}.html`;
    }, 1000);
}

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    positionWords();
}); 