const canvas = document.getElementById('collisionCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const m1Range = document.getElementById('m1Range');
const v1Range = document.getElementById('v1Range');
const m2Range = document.getElementById('m2Range');
const v2Range = document.getElementById('v2Range');
const m1Val = document.getElementById('m1Val');
const v1Val = document.getElementById('v1Val');
const m2Val = document.getElementById('m2Val');
const v2Val = document.getElementById('v2Val');
const typeSelect = document.getElementById('collisionType');
const runBtn = document.getElementById('runBtn');
const resetBtn = document.getElementById('resetBtn');

const initMomDisplay = document.getElementById('initMom');
const finalMomDisplay = document.getElementById('finalMom');
const energyDisplay = document.getElementById('energyStatus');

let b1 = { x: 200, y: 200, m: 1, v: 2, color: '#e74c3c', r: 20 };
let b2 = { x: 600, y: 200, m: 1, v: 0, color: '#3498db', r: 20 };

let isRunning = false;
let collided = false;

function updateUI() {
    m1Val.textContent = m1Range.value;
    v1Val.textContent = v1Range.value;
    m2Val.textContent = m2Range.value;
    v2Val.textContent = v2Range.value;
    
    if (!isRunning) {
        b1.m = parseFloat(m1Range.value);
        b1.v = parseFloat(v1Range.value);
        b2.m = parseFloat(m2Range.value);
        b2.v = parseFloat(v2Range.value);
        b1.r = 15 + b1.m * 5;
        b2.r = 15 + b2.m * 5;
    }
}

function calculateCollision() {
    const m1 = b1.m;
    const m2 = b2.m;
    const u1 = b1.v;
    const u2 = b2.v;

    if (typeSelect.value === 'elastic') {
        b1.v = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
        b2.v = (2 * m1 * u1 + (m2 - m1) * u2) / (m1 + m2);
    } else {
        const vFinal = (m1 * u1 + m2 * u2) / (m1 + m2);
        b1.v = vFinal;
        b2.v = vFinal;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines for motion feel
    ctx.strokeStyle = '#eee';
    for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }

    // Draw Balls
    [b1, b2].forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    });

    if (isRunning) {
        b1.x += b1.v * 2;
        b2.x += b2.v * 2;

        // Collision check
        const dist = Math.abs(b1.x - b2.x);
        if (dist <= (b1.r + b2.r) && !collided) {
            calculateCollision();
            collided = true;
            finalMomDisplay.textContent = `P = ${(b1.m * b1.v + b2.m * b2.v).toFixed(2)} kg·m/s`;
        }

        // Boundary check
        if (b1.x < 0 || b1.x > canvas.width) isRunning = false;
        if (b2.x < 0 || b2.x > canvas.width) isRunning = false;
    }

    requestAnimationFrame(draw);
}

runBtn.onclick = () => {
    if(!isRunning) {
        collided = false;
        const pInitial = b1.m * b1.v + b2.m * b2.v;
        initMomDisplay.textContent = `P = ${pInitial.toFixed(2)} kg·m/s`;
        finalMomDisplay.textContent = "Waiting for impact...";
        isRunning = true;
    }
};

resetBtn.onclick = () => {
    isRunning = false;
    collided = false;
    b1.x = 200;
    b2.x = 600;
    updateUI();
};

m1Range.oninput = updateUI;
v1Range.oninput = updateUI;
m2Range.oninput = updateUI;
v2Range.oninput = updateUI;

updateUI();
draw();
