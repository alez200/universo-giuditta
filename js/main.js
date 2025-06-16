// Array delle materie
const subjects = [
    'matematica', 'scienze', 'geografia', 'storia', 'letteratura',
    'motoria', 'arte', 'inglese', 'francese', 'tecnologia', 'musica','latino'
];

// Configurazione
const config = {
    containerRadius: 400, // Raggio del cerchio in pixel
    centerX: window.innerWidth / 2,  // Centro X della finestra
    centerY: window.innerHeight / 2, // Centro Y della finestra
};

// Funzione per convertire gradi in radianti
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Funzione per posizionare le parole in cerchio
function positionWords() {
    const container = document.getElementById('subjects-container');
    
    // Rimuovi elementi esistenti
    container.innerHTML = '';

    // Calcola l'angolo tra ogni parola
    const angleStep = 360 / subjects.length;

    subjects.forEach((subject, index) => {
        // Calcola la posizione
        const angle = degreesToRadians(index * angleStep);
        const x = config.centerX + config.containerRadius * Math.cos(angle);
        const y = config.centerY + config.containerRadius * Math.sin(angle);

        // Crea l'elemento parola
        const wordElement = document.createElement('div');
        wordElement.className = 'subject-word';
        wordElement.style.left = `${x}px`;
        wordElement.style.top = `${y}px`;
        wordElement.textContent = subject;
        wordElement.dataset.subject = subject;

        // Aggiungi evento click
        wordElement.addEventListener('click', () => {
            navigateToSubject(subject);
        });

        container.appendChild(wordElement);
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

// Aggiorna le posizioni quando la finestra viene ridimensionata
window.addEventListener('resize', () => {
    config.centerX = window.innerWidth / 2;
    config.centerY = window.innerHeight / 2;
    positionWords();
});

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    positionWords();
}); 