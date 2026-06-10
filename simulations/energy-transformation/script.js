const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const heightRange = document.getElementById('heightRange');
const massRange = document.getElementById('massRange');
const heightVal = document.getElementById('heightVal');
const massVal = document.getElementById('massVal');
const gpeDisplay = document.getElementById('gpeDisplay');
const keDisplay = document.getElementById('keDisplay');
const totalDisplay = document.getElementById('totalDisplay');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let mass = 5;
let initialHeight = 300;
let currentY = 350 - initialHeight;
let velocity = 0;
let isRunning = false;
const g = 9.8;
const groundY = 350;

function updateDisplay() {
    heightVal.textContent = `${(initialHeight/100).toFixed(1)} m`;
    massVal.textContent = `${mass.toFixed(1)} kg`;
}

function calculateEnergy() {
    const h = Math.max(0, (groundY - currentY) / 100);
    const gpe = mass * g * h;
    const ke = 0.5 * mass * Math.pow(velocity, 2);
    
    gpeDisplay.textContent = gpe.toFixed(1);
    keDisplay.textContent = ke.toFixed(1);
    totalDisplay.textContent = (gpe + ke).toFixed(1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, groundY, canvas.width, 50);

    // Object
    ctx.beginPath();
    ctx.arc(400, currentY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();

    // Line indicator
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(350, currentY);
    ctx.lineTo(450, currentY);
    ctx.strokeStyle = '#34495e';
    ctx.stroke();
    ctx.setLineDash([]);

    if (isRunning) {
        if (currentY < groundY - 15) {
            velocity += g * 0.016; // Simple Euler integration
            currentY += velocity;
        } else {
            currentY = groundY - 15;
            velocity = 0;
            isRunning = false;
        }
    }
    
    calculateEnergy();
    requestAnimationFrame(draw);
}

heightRange.oninput = () => {
    if (!isRunning) {
        initialHeight = parseInt(heightRange.value);
        currentY = groundY - initialHeight;
        updateDisplay();
    }
};

massRange.oninput = () => {
    mass = parseFloat(massRange.value);
    updateDisplay();
};

startBtn.onclick = () => {
    isRunning = true;
};

resetBtn.onclick = () => {
    isRunning = false;
    currentY = groundY - initialHeight;
    velocity = 0;
};

updateDisplay();
draw();
