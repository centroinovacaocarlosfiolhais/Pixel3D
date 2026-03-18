// ============================================================
// PIXEL3D — app.js
// Modelador 3D Voxel para o Clube de Código
// Centro de Inovação Carlos Fiolhais
// ============================================================

const GRID_SIZE = 16;

// Paleta PICO-8 — 16 cores fixas
const PALETTE = [
    { hex: '#000000', r: 0,   g: 0,   b: 0,   name: 'Preto'    },
    { hex: '#1D2B53', r: 29,  g: 43,  b: 83,  name: 'Marinho'  },
    { hex: '#7E2553', r: 126, g: 37,  b: 83,  name: 'Bordô'    },
    { hex: '#008751', r: 0,   g: 135, b: 81,  name: 'Verde'     },
    { hex: '#AB5236', r: 171, g: 82,  b: 54,  name: 'Castanho' },
    { hex: '#5F574F', r: 95,  g: 87,  b: 79,  name: 'Cinza'    },
    { hex: '#C2C3C7', r: 194, g: 195, b: 199, name: 'Prata'    },
    { hex: '#FFF1E8', r: 255, g: 241, b: 232, name: 'Branco'   },
    { hex: '#FF004D', r: 255, g: 0,   b: 77,  name: 'Vermelho' },
    { hex: '#FFA300', r: 255, g: 163, b: 0,   name: 'Laranja'  },
    { hex: '#FFEC27', r: 255, g: 236, b: 39,  name: 'Amarelo'  },
    { hex: '#00E436', r: 0,   g: 228, b: 54,  name: 'Lima'     },
    { hex: '#29ADFF', r: 41,  g: 173, b: 255, name: 'Azul'     },
    { hex: '#83769C', r: 131, g: 118, b: 156, name: 'Lilás'    },
    { hex: '#FF77A8', r: 255, g: 119, b: 168, name: 'Rosa'     },
    { hex: '#FFCCAA', r: 255, g: 204, b: 170, name: 'Pêssego'  },
];

// Templates pré-fabricados: [gx, gy, gz, colorIdx]
const TEMPLATES = {
    humanoid: {
        nome: 'Humanóide', emoji: '🤖',
        blocos: [
            [5,0,7,5],[6,0,7,5],[5,1,7,5],[6,1,7,5],
            [5,2,7,12],[6,2,7,12],[5,3,7,12],[6,3,7,12],[5,4,7,12],[6,4,7,12],
            [4,2,7,8],[7,2,7,8],[4,3,7,8],[7,3,7,8],
            [5,5,7,7],[6,5,7,7],[5,6,7,7],[6,6,7,7],
        ]
    },
    animal: {
        nome: 'Animal', emoji: '🐾',
        blocos: [
            [4,0,6,4],[7,0,6,4],[4,0,9,4],[7,0,9,4],
            [4,1,6,4],[5,1,6,4],[6,1,6,4],[7,1,6,4],
            [4,1,7,4],[5,1,7,4],[6,1,7,4],[7,1,7,4],
            [4,1,8,4],[5,1,8,4],[6,1,8,4],[7,1,8,4],
            [4,1,9,4],[5,1,9,4],[6,1,9,4],[7,1,9,4],
            [4,2,6,4],[5,2,6,4],[6,2,6,4],[7,2,6,4],
            [4,2,9,4],[5,2,9,4],[6,2,9,4],[7,2,9,4],
            [5,2,5,4],[6,2,5,4],[5,3,5,4],[6,3,5,4],
            [5,4,5,4],[6,4,5,4],
            [7,3,9,10],[8,4,9,10],
        ]
    },
    foguetao: {
        nome: 'Foguetão', emoji: '🚀',
        blocos: [
            [5,0,7,9],[6,0,7,9],[5,0,8,9],[6,0,8,9],
            [4,1,7,5],[7,1,7,5],[4,1,8,5],[7,1,8,5],
            [5,1,7,6],[6,1,7,6],[5,1,8,6],[6,1,8,6],
            [5,2,7,6],[6,2,7,6],[5,2,8,6],[6,2,8,6],
            [5,3,7,6],[6,3,7,6],[5,3,8,6],[6,3,8,6],
            [5,4,7,6],[6,4,7,6],[5,4,8,6],[6,4,8,6],
            [5,3,7,12],[6,3,7,12],
            [5,5,7,8],[6,5,7,8],[5,5,8,8],[6,5,8,8],
            [5,6,7,8],[5,6,8,8],[6,6,8,8],[6,7,7,8],
        ]
    },
    arvore: {
        nome: 'Árvore', emoji: '🌲',
        blocos: [
            [7,0,7,4],[7,1,7,4],[7,2,7,4],
            [7,7,7,3],
            [6,6,6,3],[7,6,6,3],[8,6,6,3],[6,6,7,3],[7,6,7,3],[8,6,7,3],[6,6,8,3],[7,6,8,3],[8,6,8,3],
            [5,5,5,3],[6,5,5,3],[7,5,5,3],[8,5,5,3],[9,5,5,3],
            [5,5,6,3],[6,5,6,3],[7,5,6,3],[8,5,6,3],[9,5,6,3],
            [5,5,7,3],[6,5,7,3],[7,5,7,3],[8,5,7,3],[9,5,7,3],
            [5,5,8,3],[6,5,8,3],[7,5,8,3],[8,5,8,3],[9,5,8,3],
            [5,5,9,3],[6,5,9,3],[7,5,9,3],[8,5,9,3],[9,5,9,3],
            [4,3,4,3],[5,3,4,3],[6,3,4,3],[7,3,4,3],[8,3,4,3],[9,3,4,3],[10,3,4,3],
            [4,3,5,3],[5,3,5,3],[6,3,5,3],[7,3,5,3],[8,3,5,3],[9,3,5,3],[10,3,5,3],
            [4,3,6,3],[5,3,6,3],[6,3,6,3],[7,3,6,3],[8,3,6,3],[9,3,6,3],[10,3,6,3],
            [4,3,7,3],[5,3,7,3],[6,3,7,3],[7,3,7,3],[8,3,7,3],[9,3,7,3],[10,3,7,3],
            [4,3,8,3],[5,3,8,3],[6,3,8,3],[7,3,8,3],[8,3,8,3],[9,3,8,3],[10,3,8,3],
            [4,3,9,3],[5,3,9,3],[6,3,9,3],[7,3,9,3],[8,3,9,3],[9,3,9,3],[10,3,9,3],
            [4,3,10,3],[5,3,10,3],[6,3,10,3],[7,3,10,3],[8,3,10,3],[9,3,10,3],[10,3,10,3],
        ]
    },
    casa: {
        nome: 'Casa', emoji: '🏠',
        blocos: [
            [4,0,4,7],[5,0,4,7],[6,0,4,7],[7,0,4,7],[8,0,4,7],[9,0,4,7],[10,0,4,7],
            [4,0,5,7],[10,0,5,7],[4,0,6,7],[10,0,6,7],[4,0,7,7],[10,0,7,7],
            [4,0,8,7],[10,0,8,7],[4,0,9,7],[10,0,9,7],
            [4,0,10,7],[5,0,10,7],[6,0,10,7],[7,0,10,7],[8,0,10,7],[9,0,10,7],[10,0,10,7],
            [4,1,4,7],[5,1,4,7],[6,1,4,7],[7,1,4,7],[8,1,4,7],[9,1,4,7],[10,1,4,7],
            [4,1,5,7],[10,1,5,7],[4,1,6,7],[10,1,6,7],
            [4,1,7,7],[10,1,7,7],
            [4,1,8,7],[10,1,8,7],[4,1,9,7],[10,1,9,7],
            [4,1,10,7],[5,1,10,7],[6,1,10,7],[7,1,10,7],[8,1,10,7],[9,1,10,7],[10,1,10,7],
            [4,2,4,8],[5,2,4,8],[6,2,4,8],[7,2,4,8],[8,2,4,8],[9,2,4,8],[10,2,4,8],
            [4,2,5,8],[5,2,5,8],[6,2,5,8],[7,2,5,8],[8,2,5,8],[9,2,5,8],[10,2,5,8],
            [4,2,6,8],[5,2,6,8],[6,2,6,8],[7,2,6,8],[8,2,6,8],[9,2,6,8],[10,2,6,8],
            [4,2,7,8],[5,2,7,8],[6,2,7,8],[7,2,7,8],[8,2,7,8],[9,2,7,8],[10,2,7,8],
            [4,2,8,8],[5,2,8,8],[6,2,8,8],[7,2,8,8],[8,2,8,8],[9,2,8,8],[10,2,8,8],
            [4,2,9,8],[5,2,9,8],[6,2,9,8],[7,2,9,8],[8,2,9,8],[9,2,9,8],[10,2,9,8],
            [4,2,10,8],[5,2,10,8],[6,2,10,8],[7,2,10,8],[8,2,10,8],[9,2,10,8],[10,2,10,8],
            [5,3,5,8],[6,3,5,8],[7,3,5,8],[8,3,5,8],[9,3,5,8],
            [5,3,6,8],[6,3,6,8],[7,3,6,8],[8,3,6,8],[9,3,6,8],
            [5,3,7,8],[6,3,7,8],[7,3,7,8],[8,3,7,8],[9,3,7,8],
            [5,3,8,8],[6,3,8,8],[7,3,8,8],[8,3,8,8],[9,3,8,8],
            [5,3,9,8],[6,3,9,8],[7,3,9,8],[8,3,9,8],[9,3,9,8],
            [6,4,6,8],[7,4,6,8],[8,4,6,8],[6,4,7,8],[7,4,7,8],[8,4,7,8],
            [6,4,8,8],[7,4,8,8],[8,4,8,8],[7,5,7,8],
        ]
    },
    vazio: { nome: 'Vazio', emoji: '⬜', blocos: [] }
};

// ============================================================
// ESTADO
// ============================================================
let scene, camera, renderer;
let raycaster, mouse;
let voxelGroup, ghostMesh, layerHighlight, pickingPlane;
let gridHelper, axesHelper, pivotIndicator;           // kept for GIF export hiding
let grid = [], voxelMeshes = {};
let sharedGeometry, voxelMaterials = [], ghostMaterial;
let currentLayer = 0, selectedColor = 8, mode = 'add', animando = false;
let isDragging = false, mouseMovedAfterDown = false;
let previousMousePosition = { x: 0, y: 0 }, isPanning = false;
let cameraTarget = new THREE.Vector3(GRID_SIZE / 2, GRID_SIZE / 4, GRID_SIZE / 2);

// ============================================================
// GIF ENCODER INLINE
// ============================================================
class GIFEncoder {
    constructor() { this.bytes = []; }
    push(b) { this.bytes.push(b & 0xFF); }
    pushShort(s) { this.push(s); this.push(s >> 8); }
    pushStr(s) { for (let i = 0; i < s.length; i++) this.push(s.charCodeAt(i)); }

    lzwEncode(pixels, minCodeSize) {
        const clearCode = 1 << minCodeSize, eoi = clearCode + 1;
        let codeSize = minCodeSize + 1, nextCode = eoi + 1;
        let table = new Map();
        let bitBuf = 0, bitCount = 0;
        const out = [];

        const reset = () => {
            table.clear();
            for (let i = 0; i < clearCode; i++) table.set(String.fromCharCode(i), i);
            codeSize = minCodeSize + 1; nextCode = eoi + 1;
        };
        const emit = (code) => {
            bitBuf |= code << bitCount; bitCount += codeSize;
            while (bitCount >= 8) { out.push(bitBuf & 0xFF); bitBuf >>= 8; bitCount -= 8; }
        };

        reset(); emit(clearCode);
        let s = String.fromCharCode(pixels[0]);
        for (let i = 1; i < pixels.length; i++) {
            const c = String.fromCharCode(pixels[i]), sc = s + c;
            if (table.has(sc)) { s = sc; }
            else {
                emit(table.get(s));
                if (nextCode < 4096) {
                    table.set(sc, nextCode++);
                    if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
                } else { emit(clearCode); reset(); }
                s = c;
            }
        }
        emit(table.get(s)); emit(eoi);
        if (bitCount > 0) out.push(bitBuf & 0xFF);
        return out;
    }

    encode(w, h, palette, frames) {
        const palSize = palette.length;    // 16 ou 256
        const colorBits = palSize <= 16 ? 3 : 7;   // 2^(bits+1) = 16 ou 256
        const palEntries = 1 << (colorBits + 1);   // 16 ou 256

        this.pushStr('GIF89a');
        this.pushShort(w); this.pushShort(h);
        // Flags: global color table=1, color res=colorBits, sort=0, size=colorBits
        this.push(0x80 | (colorBits << 4) | colorBits);
        this.push(0); this.push(0);
        for (let i = 0; i < palEntries; i++) {
            if (i < palSize) { this.push(palette[i].r); this.push(palette[i].g); this.push(palette[i].b); }
            else { this.push(0); this.push(0); this.push(0); }
        }
        // Loop extension
        this.push(0x21); this.push(0xFF); this.push(11);
        this.pushStr('NETSCAPE2.0');
        this.push(3); this.push(1); this.pushShort(0); this.push(0);

        const minCS = colorBits + 1;   // min LZW code size: 4 para 16 cores, 8 para 256
        for (const frame of frames) {
            this.push(0x21); this.push(0xF9); this.push(4);
            // packed: disposal=2 (restore-to-background, limpa canvas antes de cada frame)
            //         + transparent=1  →  bits 000_010_0_1 = 0x09
            // transparent color index = 0 (reservado)
            this.push(0x09); this.pushShort(frame.delay); this.push(0); this.push(0);
            this.push(0x2C);
            this.pushShort(0); this.pushShort(0); this.pushShort(w); this.pushShort(h);
            this.push(0x00);
            this.push(minCS);
            const compressed = this.lzwEncode(frame.pixels, minCS);
            let i = 0;
            while (i < compressed.length) {
                const bs = Math.min(255, compressed.length - i);
                this.push(bs);
                for (let j = 0; j < bs; j++) this.push(compressed[i++]);
            }
            this.push(0);
        }
        this.push(0x3B);
        return new Uint8Array(this.bytes);
    }
}

// ============================================================
// INIT
// ============================================================
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 35, 70);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(26, 22, 26);
    camera.lookAt(cameraTarget);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    voxelGroup = new THREE.Group();
    scene.add(voxelGroup);

    sharedGeometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);
    voxelMaterials = PALETTE.map(c => new THREE.MeshLambertMaterial({ color: c.hex }));
    ghostMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false });
    ghostMesh = new THREE.Mesh(sharedGeometry, ghostMaterial);
    ghostMesh.visible = false;
    scene.add(ghostMesh);

    // Plano de picking (invisível)
    const planeGeo = new THREE.PlaneGeometry(GRID_SIZE + 4, GRID_SIZE + 4);
    planeGeo.rotateX(-Math.PI / 2);
    pickingPlane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
    scene.add(pickingPlane);

    // Destaque da camada
    const hlGeo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE);
    hlGeo.rotateX(-Math.PI / 2);
    layerHighlight = new THREE.Mesh(hlGeo, new THREE.MeshBasicMaterial({
        color: 0x00ff88, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false
    }));
    scene.add(layerHighlight);

    // Luzes
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dl = new THREE.DirectionalLight(0xffffff, 0.85);
    dl.position.set(12, 24, 12); dl.castShadow = true;
    scene.add(dl);
    const fl = new THREE.DirectionalLight(0x4488ff, 0.25);
    fl.position.set(-10, 5, -10);
    scene.add(fl);
    scene.add(new THREE.HemisphereLight(0x00ff88, 0x080820, 0.18));

    // Grid do chão
    gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_SIZE, 0x00ff88, 0x1a2f3a);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    gridHelper.position.set(GRID_SIZE / 2, 0, GRID_SIZE / 2);
    scene.add(gridHelper);

    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Indicador de pivot — esfera amarela no cameraTarget
    const pivGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const pivMat = new THREE.MeshBasicMaterial({ color: 0xffec27, transparent: true, opacity: 0.85, depthTest: false });
    pivotIndicator = new THREE.Mesh(pivGeo, pivMat);
    pivotIndicator.position.copy(cameraTarget);
    scene.add(pivotIndicator);

    resetGrid();
    configurarCamera();
    configurarInput();
    configurarUI();
    atualizarCamada(0);
    carregarTemplate('humanoid');

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// ============================================================
// GRID
// ============================================================
function resetGrid() {
    grid = Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(-1))
    );
}

function voxelKey(x, y, z) { return `${x},${y},${z}`; }
function worldPos(gx, gy, gz) { return new THREE.Vector3(gx + 0.5, gy + 0.5, gz + 0.5); }

function adicionarVoxel(gx, gy, gz, ci) {
    if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE || gz < 0 || gz >= GRID_SIZE) return;
    if (grid[gx][gy][gz] !== -1) return;
    grid[gx][gy][gz] = ci;
    const mesh = new THREE.Mesh(sharedGeometry, voxelMaterials[ci]);
    mesh.position.copy(worldPos(gx, gy, gz));
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData = { gx, gy, gz };
    voxelGroup.add(mesh);
    voxelMeshes[voxelKey(gx, gy, gz)] = mesh;
    atualizarEstatisticas();
}

function removerVoxel(gx, gy, gz) {
    if (grid[gx] && grid[gx][gy] && grid[gx][gy][gz] !== -1) {
        grid[gx][gy][gz] = -1;
        const key = voxelKey(gx, gy, gz);
        if (voxelMeshes[key]) { voxelGroup.remove(voxelMeshes[key]); delete voxelMeshes[key]; }
        atualizarEstatisticas();
    }
}

function limparTudo() {
    Object.values(voxelMeshes).forEach(m => voxelGroup.remove(m));
    voxelMeshes = {}; resetGrid(); atualizarEstatisticas();
    mostrarMensagem('Cena limpa!');
}

function carregarTemplate(nome) {
    Object.values(voxelMeshes).forEach(m => voxelGroup.remove(m));
    voxelMeshes = {}; resetGrid(); atualizarEstatisticas();
    const t = TEMPLATES[nome];
    if (t && t.blocos.length > 0) {
        t.blocos.forEach(([x, y, z, c]) => adicionarVoxel(x, y, z, c));
        mostrarMensagem('Template "' + t.nome + '" carregado!');
    }
}

// ============================================================
// RAYCASTING
// ============================================================
function getRayHit(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (mode === 'erase') {
        const hits = raycaster.intersectObjects(Object.values(voxelMeshes));
        if (hits.length > 0) return { action: 'erase', ...hits[0].object.userData };
        return null;
    } else {
        const hits = raycaster.intersectObject(pickingPlane);
        if (hits.length > 0) {
            const p = hits[0].point;
            const gx = Math.floor(p.x), gz = Math.floor(p.z), gy = currentLayer;
            if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE)
                return { action: 'add', gx, gy, gz };
        }
        return null;
    }
}

function onMouseMove(e) {
    if (isDragging) { if (Math.abs(e.clientX - previousMousePosition.x) > 2 || Math.abs(e.clientY - previousMousePosition.y) > 2) mouseMovedAfterDown = true; return; }
    const r = getRayHit(e);
    if (r && r.action === 'add' && grid[r.gx][r.gy][r.gz] === -1) {
        ghostMesh.position.copy(worldPos(r.gx, r.gy, r.gz));
        ghostMesh.material.color.set(PALETTE[selectedColor].hex);
        ghostMesh.visible = true;
    } else { ghostMesh.visible = false; }
}

function onMouseClick(e) {
    if (mouseMovedAfterDown || e.button !== 0) return;
    const r = getRayHit(e);
    if (!r) return;
    if (r.action === 'add') adicionarVoxel(r.gx, r.gy, r.gz, selectedColor);
    else if (r.action === 'erase') removerVoxel(r.gx, r.gy, r.gz);
}

// ============================================================
// CAMADA
// ============================================================
function atualizarCamada(layer) {
    currentLayer = Math.max(0, Math.min(GRID_SIZE - 1, layer));
    const y = currentLayer;                                           // base do cubo, não centro
    pickingPlane.position.set(GRID_SIZE / 2, y, GRID_SIZE / 2);
    layerHighlight.position.set(GRID_SIZE / 2, y + 0.005, GRID_SIZE / 2);
    document.getElementById('layer-display').textContent = currentLayer;
    document.getElementById('layer-slider').value = currentLayer;
}

// ============================================================
// CÂMERA
// ============================================================
function configurarCamera() {
    const c = renderer.domElement;
    c.addEventListener('contextmenu', e => e.preventDefault());
    c.addEventListener('mousedown', e => {
        isDragging = true; mouseMovedAfterDown = false;
        isPanning = (e.button === 2);
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    c.addEventListener('mousemove', e => {
        onMouseMove(e);
        if (!isDragging) return;
        const dx = e.clientX - previousMousePosition.x;
        const dy = e.clientY - previousMousePosition.y;
        if (isPanning) {
            const speed = 0.03;
            const right = new THREE.Vector3();
            camera.getWorldDirection(right);
            right.cross(new THREE.Vector3(0, 1, 0)).normalize();
            cameraTarget.addScaledVector(right, -dx * speed);
            camera.position.addScaledVector(right, -dx * speed);
            cameraTarget.y += dy * speed; camera.position.y += dy * speed;
            pivotIndicator.position.copy(cameraTarget);
        } else {
            const ang = Math.atan2(camera.position.z - cameraTarget.z, camera.position.x - cameraTarget.x);
            const rad = Math.sqrt((camera.position.x - cameraTarget.x) ** 2 + (camera.position.z - cameraTarget.z) ** 2);
            const na = ang - dx * 0.012;
            camera.position.x = cameraTarget.x + Math.cos(na) * rad;
            camera.position.z = cameraTarget.z + Math.sin(na) * rad;
            camera.position.y = Math.max(2, Math.min(45, camera.position.y - dy * 0.08));
        }
        camera.lookAt(cameraTarget);
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    c.addEventListener('mouseup', () => { isDragging = false; });
    c.addEventListener('wheel', e => {
        e.preventDefault();
        const dir = new THREE.Vector3().subVectors(camera.position, cameraTarget);
        const dist = Math.max(5, Math.min(55, dir.length() + e.deltaY * 0.05));
        camera.position.copy(cameraTarget).addScaledVector(dir.normalize(), dist);
        camera.lookAt(cameraTarget);
    }, { passive: false });
}

function configurarInput() {
    renderer.domElement.addEventListener('click', onMouseClick);
}

function centrarPivot() {
    const keys = Object.keys(voxelMeshes);
    if (keys.length === 0) {
        // Sem voxels: centrar na grelha
        cameraTarget.set(GRID_SIZE / 2, GRID_SIZE / 4, GRID_SIZE / 2);
    } else {
        let minX = GRID_SIZE, maxX = 0, minY = GRID_SIZE, maxY = 0, minZ = GRID_SIZE, maxZ = 0;
        keys.forEach(k => {
            const [x, y, z] = k.split(',').map(Number);
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
        });
        cameraTarget.set(
            (minX + maxX) / 2 + 0.5,
            (minY + maxY) / 2 + 0.5,
            (minZ + maxZ) / 2 + 0.5
        );
    }
    pivotIndicator.position.copy(cameraTarget);
    camera.lookAt(cameraTarget);
    mostrarMensagem('🎯 Pivot centrado no modelo');
}

function resetarCamera() {
    camera.position.set(26, 22, 26);
    cameraTarget.set(GRID_SIZE / 2, GRID_SIZE / 4, GRID_SIZE / 2);
    pivotIndicator.position.copy(cameraTarget);
    camera.lookAt(cameraTarget);
    mostrarMensagem('Câmera resetada');
}

// ============================================================
// UI
// ============================================================
function configurarUI() {
    const pal = document.getElementById('palette');
    PALETTE.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn' + (i === selectedColor ? ' active' : '');
        btn.style.background = c.hex;
        if (c.hex === '#000000') btn.style.border = '2px solid #444';
        btn.title = c.name;
        btn.addEventListener('click', () => {
            selectedColor = i;
            document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setMode('add');
        });
        pal.appendChild(btn);
    });

    const sl = document.getElementById('layer-slider');
    sl.max = GRID_SIZE - 1;
    sl.addEventListener('input', () => atualizarCamada(parseInt(sl.value)));
}

function setMode(m) {
    mode = m;
    document.getElementById('btn-add').classList.toggle('active', m === 'add');
    document.getElementById('btn-erase').classList.toggle('active', m === 'erase');
    ghostMesh.visible = false;
}

function atualizarEstatisticas() {
    const count = Object.keys(voxelMeshes).length;
    document.getElementById('stat-blocks').textContent = count;
    const cors = new Set(
        Object.keys(voxelMeshes).map(k => {
            const [x,y,z] = k.split(',').map(Number);
            return grid[x][y][z];
        }).filter(v => v >= 0)
    );
    document.getElementById('stat-colors').textContent = cors.size;
}

// ============================================================
// EXPORTS — Utilitários partilhados
// ============================================================

/** Calcula o centro e raio da bounding sphere de todos os voxels. */
function getModelBounds() {
    const keys = Object.keys(voxelMeshes);
    if (keys.length === 0) return null;
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
    keys.forEach(k => {
        const [x,y,z] = k.split(',').map(Number);
        if(x<minX)minX=x; if(x>maxX)maxX=x;
        if(y<minY)minY=y; if(y>maxY)maxY=y;
        if(z<minZ)minZ=z; if(z>maxZ)maxZ=z;
    });
    const center = new THREE.Vector3(
        (minX+maxX)/2+0.5, (minY+maxY)/2+0.5, (minZ+maxZ)/2+0.5
    );
    const dxz = Math.max(maxX-minX, maxZ-minZ)/2+1;
    const dy  = (maxY-minY)/2+1;
    const radius = Math.sqrt(dxz*dxz + dy*dy);
    return { center, radius };
}

/**
 * Dado o campo de visão e dimensões do render,
 * devolve a distância de câmera que faz o modelo caber no frame.
 */
function fitCamDist(radius, rw, rh, fovDeg) {
    const fovV = (fovDeg/2) * Math.PI/180;
    const fovH = Math.atan(Math.tan(fovV) * (rw/rh));
    return (radius / Math.sin(Math.min(fovV, fovH))) * 1.10;
}

// ── PNG ──────────────────────────────────────────────────────
function exportarPNG() {
    renderer.render(scene, camera);
    const a = document.createElement('a');
    a.href = renderer.domElement.toDataURL('image/png');
    a.download = 'pixel3d_' + Date.now() + '.png';
    a.click();
    mostrarMensagem('📸 PNG exportado!');
}

// ── GIF Animado ───────────────────────────────────────────────
// Técnica de transparência: render duplo (fundo preto + branco) por frame.
// Pixeis idênticos nos dois renders = modelo; diferentes = borda AA ou fundo → transparentes.
// Elimina ghosting de frames anteriores sem depender do método de disposal do decoder.
async function exportarGIF() {
    if (Object.keys(voxelMeshes).length === 0) {
        mostrarMensagem('Sem blocos para exportar!', true); return;
    }
    const btn = document.getElementById('btn-gif');
    btn.disabled = true; btn.textContent = '⏳ A gerar…';
    mostrarMensagem('A gerar GIF (aguarda…)');
    await new Promise(r => setTimeout(r, 60));

    const RW = 512, RH = 384, N = 36, DELAY = 4;
    const FOV = 50;

    const origW = renderer.domElement.width, origH = renderer.domElement.height;
    const origBG = scene.background, origFog = scene.fog;
    const origPos = camera.position.clone();
    const origFov = camera.fov, origAspect = camera.aspect;

    // Ocultar helpers
    gridHelper.visible = false; axesHelper.visible = false;
    layerHighlight.visible = false; ghostMesh.visible = false;
    pivotIndicator.visible = false;
    scene.fog = null;

    renderer.setSize(RW, RH, false);
    camera.aspect = RW / RH;
    camera.fov = FOV;
    camera.updateProjectionMatrix();

    const bounds = getModelBounds();
    const gifCenter = bounds ? bounds.center.clone()
        : new THREE.Vector3(GRID_SIZE/2, GRID_SIZE/4, GRID_SIZE/2);
    const camDist   = bounds ? fitCamDist(bounds.radius, RW, RH, FOV) : 28;
    const elevOff   = bounds ? bounds.center.y + bounds.radius * 0.55
        : GRID_SIZE/4 + 6;

    const cvs = document.createElement('canvas');
    cvs.width = RW; cvs.height = RH;
    const ctx = cvs.getContext('2d');

    // ── PASS 1 — Render duplo por frame → máscara de transparência ──────
    const frameMasks  = [];   // Uint8Array: 1=modelo, 0=fundo/AA
    const frameColors = [];   // RGBA do render em preto (cores do modelo)

    for (let f = 0; f < N; f++) {
        const ang = (f / N) * Math.PI * 2;
        camera.position.set(
            gifCenter.x + Math.cos(ang) * camDist,
            elevOff,
            gifCenter.z + Math.sin(ang) * camDist
        );
        camera.lookAt(gifCenter);

        // Render com fundo preto → cores do modelo
        scene.background = new THREE.Color(0, 0, 0);
        renderer.render(scene, camera);
        ctx.drawImage(renderer.domElement, 0, 0);
        const blackPx = ctx.getImageData(0, 0, RW, RH).data.slice();

        // Render com fundo branco → deteção de pixeis puros vs AA
        scene.background = new THREE.Color(1, 1, 1);
        renderer.render(scene, camera);
        ctx.drawImage(renderer.domElement, 0, 0);
        const whitePx = ctx.getImageData(0, 0, RW, RH).data;

        // Máscara: pixel igual nas duas renders → modelo; diferente → fundo/AA
        const mask = new Uint8Array(RW * RH);
        for (let i = 0; i < RW * RH; i++) {
            const dr = Math.abs(blackPx[i*4]   - whitePx[i*4]);
            const dg = Math.abs(blackPx[i*4+1] - whitePx[i*4+1]);
            const db = Math.abs(blackPx[i*4+2] - whitePx[i*4+2]);
            mask[i] = (dr + dg + db < 20) ? 1 : 0;
        }
        frameMasks.push(mask);
        frameColors.push(blackPx);
        await new Promise(r => setTimeout(r, 0));
    }

    // ── PASS 2 — Crop: union dos pixeis de modelo em todos os frames ─────
    let cx1 = RW, cy1 = RH, cx2 = 0, cy2 = 0;
    for (const mask of frameMasks) {
        for (let py = 0; py < RH; py++)
            for (let px = 0; px < RW; px++)
                if (mask[py*RW+px]) {
                    if (px < cx1) cx1 = px; if (px > cx2) cx2 = px;
                    if (py < cy1) cy1 = py; if (py > cy2) cy2 = py;
                }
    }
    const pad = Math.max(4, Math.round(Math.max(cx2-cx1, cy2-cy1) * 0.05));
    cx1 = Math.max(0, cx1-pad); cy1 = Math.max(0, cy1-pad);
    cx2 = Math.min(RW-1, cx2+pad); cy2 = Math.min(RH-1, cy2+pad);
    let GW = Math.max(2, (cx2-cx1+1) & ~1);   // par
    let GH = Math.max(2, (cy2-cy1+1) & ~1);

    // ── PASS 3 — Paleta adaptativa de 256 cores (só pixeis de modelo) ────
    const freqMap = new Map();
    for (let fi = 0; fi < N; fi++) {
        const mask = frameMasks[fi], col = frameColors[fi];
        for (let py = cy1; py < cy1+GH; py += 3)
            for (let px = cx1; px < cx1+GW; px += 3)
                if (mask[py*RW+px]) {
                    const i = (py*RW+px)*4;
                    const k = ((col[i]&0xF8)<<16)|((col[i+1]&0xF8)<<8)|(col[i+2]&0xF8);
                    freqMap.set(k, (freqMap.get(k)||0)+1);
                }
    }
    const sorted = [...freqMap.entries()].sort((a,b) => b[1]-a[1]);
    const gifPal = [{ r:0, g:0, b:0 }];   // índice 0 = transparente
    for (let i = 0; i < Math.min(255, sorted.length); i++) {
        const k = sorted[i][0];
        gifPal.push({ r:(k>>16)&0xFF, g:(k>>8)&0xFF, b:k&0xFF });
    }
    while (gifPal.length < 256) gifPal.push({ r:0, g:0, b:0 });

    const palCache = new Map();
    function qColor(r, g, b) {
        const k = ((r&0xF8)<<16)|((g&0xF8)<<8)|(b&0xF8);
        if (palCache.has(k)) return palCache.get(k);
        let best = 1, bestD = Infinity;
        for (let i = 1; i < gifPal.length; i++) {
            const d = (r-gifPal[i].r)**2+(g-gifPal[i].g)**2+(b-gifPal[i].b)**2;
            if (d < bestD) { bestD = d; best = i; }
        }
        palCache.set(k, best);
        return best;
    }

    // ── PASS 4 — Codificar GIF ────────────────────────────────────────────
    const enc = new GIFEncoder();
    const frames = [];
    for (let fi = 0; fi < N; fi++) {
        const mask = frameMasks[fi], col = frameColors[fi];
        const pix = new Uint8Array(GW * GH);
        for (let py = 0; py < GH; py++)
            for (let px = 0; px < GW; px++) {
                const si = (cy1+py)*RW+(cx1+px);
                if (mask[si]) {
                    const i = si*4;
                    pix[py*GW+px] = qColor(col[i], col[i+1], col[i+2]);
                }
                // else: 0 = transparente (default da Uint8Array)
            }
        frames.push({ pixels: pix, delay: DELAY });
    }

    const gifData = enc.encode(GW, GH, gifPal, frames);
    const url = URL.createObjectURL(new Blob([gifData], { type: 'image/gif' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'pixel3d_' + Date.now() + '.gif'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    // Restaurar estado
    renderer.setSize(origW, origH, false);
    camera.fov = origFov; camera.aspect = origAspect;
    camera.updateProjectionMatrix();
    scene.background = origBG; scene.fog = origFog;
    camera.position.copy(origPos); camera.lookAt(cameraTarget);
    gridHelper.visible = true; axesHelper.visible = true;
    layerHighlight.visible = true; pivotIndicator.visible = true;
    btn.disabled = false; btn.textContent = '🎞️ GIF Animado';
    mostrarMensagem(`✓ GIF exportado! (${GW}×${GH}px, ${N} frames)`);
}

// ── Ficha PDF ─────────────────────────────────────────────────
async function exportarFichaPDF() {
    if (!window.jspdf) { mostrarMensagem('jsPDF não carregado!', true); return; }
    if (Object.keys(voxelMeshes).length === 0) {
        mostrarMensagem('Sem blocos para exportar!', true); return;
    }

    const nomeParticipante = prompt('O teu nome:');
    if (nomeParticipante === null) return;
    const tituloObjeto = prompt('Nome do teu objeto:');
    if (tituloObjeto === null) return;

    const btn = document.getElementById('btn-pdf');
    btn.disabled = true; btn.textContent = '⏳ A gerar PDF…';
    mostrarMensagem('A gerar PDF (aguarda…)');
    await new Promise(r => setTimeout(r, 60));

    // ── Preparar cena ─────────────────────────────────────────
    gridHelper.visible = false; axesHelper.visible = false;
    layerHighlight.visible = false; ghostMesh.visible = false;
    pivotIndicator.visible = false;
    const origFog = scene.fog; scene.fog = null;
    const origBG = scene.background;
    const origW = renderer.domElement.width, origH = renderer.domElement.height;
    const origAspect = camera.aspect, origFov = camera.fov;
    const origPos = camera.position.clone();

    const bounds = getModelBounds();
    const mc = bounds ? bounds.center.clone()
        : new THREE.Vector3(GRID_SIZE/2, GRID_SIZE/4, GRID_SIZE/2);

    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');

    // ── Viewport principal (16:9, ângulo atual do user) ───────
    const VW = 800, VH = 450, FOV = 50;
    renderer.setSize(VW, VH, false);
    camera.aspect = VW/VH; camera.fov = FOV;
    camera.updateProjectionMatrix();

    if (bounds) {
        const dist = fitCamDist(bounds.radius, VW, VH, FOV);
        const azim = Math.atan2(origPos.z - mc.z, origPos.x - mc.x);
        camera.position.set(
            mc.x + Math.cos(azim)*dist,
            mc.y + bounds.radius*0.55,
            mc.z + Math.sin(azim)*dist
        );
        camera.lookAt(mc);
    }
    scene.background = new THREE.Color(0x0a0e27);
    renderer.render(scene, camera);
    cvs.width = VW; cvs.height = VH;
    ctx.drawImage(renderer.domElement, 0, 0);
    const vpURL = cvs.toDataURL('image/jpeg', 0.92);

    // ── 8 frames de 360° ──────────────────────────────────────
    const FW = 256, FH = 192, NF = 8;
    renderer.setSize(FW, FH, false);
    camera.aspect = FW/FH;
    camera.updateProjectionMatrix();
    const fd = bounds ? fitCamDist(bounds.radius, FW, FH, FOV) : 22;
    const fe = mc.y + (bounds ? bounds.radius*0.55 : 6);
    cvs.width = FW; cvs.height = FH;
    const frameURLs = [];
    for (let f = 0; f < NF; f++) {
        const ang = (f/NF)*Math.PI*2;
        camera.position.set(mc.x+Math.cos(ang)*fd, fe, mc.z+Math.sin(ang)*fd);
        camera.lookAt(mc);
        renderer.render(scene, camera);
        ctx.drawImage(renderer.domElement, 0, 0);
        frameURLs.push(cvs.toDataURL('image/jpeg', 0.88));
        await new Promise(r => setTimeout(r, 0));
    }

    // ── Restaurar cena ────────────────────────────────────────
    renderer.setSize(origW, origH, false);
    camera.aspect = origAspect; camera.fov = origFov;
    camera.updateProjectionMatrix();
    scene.background = origBG; scene.fog = origFog;
    camera.position.copy(origPos); camera.lookAt(cameraTarget);
    gridHelper.visible = true; axesHelper.visible = true;
    layerHighlight.visible = true; pivotIndicator.visible = true;

    // ── Construir PDF ─────────────────────────────────────────
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210, PH = 297, ML = 12, MR = 12;
    const UW = PW-ML-MR;   // 186mm utilizáveis

    const cBG    = [10, 14, 39];
    const cPanel = [15, 21, 52];
    const cGreen = [0, 255, 136];
    const cWhite = [255, 255, 255];
    const cMuted = [107, 122, 153];

    // Fundo completo
    doc.setFillColor(...cBG); doc.rect(0, 0, PW, PH, 'F');

    // Header
    doc.setFillColor(...cPanel); doc.rect(0, 0, PW, 30, 'F');
    doc.setFillColor(...cGreen);
    doc.rect(0, 0, 3, 30, 'F');          // barra lateral verde
    doc.rect(0, 29.5, PW, 0.7, 'F');     // linha inferior verde
    doc.rect(ML+3, 9, 4, 4, 'F');        // badge quadrado
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.setTextColor(...cGreen);
    doc.text('PIXEL3D', ML+10, 15);
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cMuted);
    doc.text('Modelador Voxel 3D', ML+10, 21);
    doc.text('FICHA DE PROJETO', PW-MR, 12, { align: 'right' });
    doc.text('Clube de Codigo . CICF', PW-MR, 18, { align: 'right' });

    // Título do objeto
    const titulo = (tituloObjeto || 'Sem titulo').substring(0, 48);
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cWhite);
    doc.text(titulo, PW/2, 43, { align: 'center' });

    // Nome + data
    const dateStr = new Date().toLocaleDateString('pt-PT');
    const nome = (nomeParticipante || '-').trim() || '-';
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cMuted);
    doc.text(`${nome}   .   ${dateStr}`, PW/2, 52, { align: 'center' });

    // Separador
    doc.setFillColor(...cGreen); doc.rect(ML, 55.5, UW, 0.4, 'F');

    // Viewport principal (16:9 → 186 × 104.6mm)
    const vpH_mm = UW * (VH/VW);
    doc.setFillColor(...cPanel); doc.rect(ML, 57, UW, vpH_mm, 'F');
    doc.addImage(vpURL, 'JPEG', ML, 57, UW, vpH_mm);

    let Y = 57 + vpH_mm + 6;

    // Secção frames 360°
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cGreen);
    doc.text('ANIMACAO 360 GRAUS', ML, Y+3);
    doc.setFillColor(...cGreen); doc.rect(ML, Y+4.5, UW, 0.3, 'F');
    Y += 7;

    // 2 linhas × 4 frames
    const fGap = 2, fCols = 4, fRows = 2;
    const fw = (UW - (fCols-1)*fGap) / fCols;   // ~45mm
    const fh = fw * (FH/FW);                      // ~33.75mm
    for (let row = 0; row < fRows; row++) {
        for (let col = 0; col < fCols; col++) {
            const fi = row*fCols+col;
            const fx = ML + col*(fw+fGap);
            const fy = Y + row*(fh+fGap);
            doc.setFillColor(...cPanel); doc.rect(fx, fy, fw, fh, 'F');
            doc.addImage(frameURLs[fi], 'JPEG', fx, fy, fw, fh);
            // Frame label (ângulo)
            doc.setFontSize(5); doc.setTextColor(...cMuted);
            doc.text(`${Math.round((fi/NF)*360)}°`, fx+fw-1, fy+fh-1, { align: 'right' });
        }
    }
    Y += fRows*(fh+fGap) - fGap + 5;

    // Estatísticas
    const blockCount = Object.keys(voxelMeshes).length;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cMuted);
    doc.text(`Blocos: ${blockCount}   .   Grid: 16x16x16   .   PICO-8 (16 cores)`, ML, Y+3);
    Y += 10;

    // Notas (linhas) se houver espaço
    const footerY = PH - 14;
    if (Y + 20 < footerY) {
        doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cGreen);
        doc.text('NOTAS', ML, Y+3);
        doc.setFillColor(...cGreen); doc.rect(ML, Y+4.5, UW, 0.3, 'F');
        Y += 8;
        doc.setDrawColor(...cMuted); doc.setLineWidth(0.2);
        while (Y + 7 < footerY) { doc.line(ML, Y+7, ML+UW, Y+7); Y += 7; }
    }

    // Footer
    doc.setFillColor(...cGreen); doc.rect(0, footerY, PW, 0.5, 'F');
    doc.setFillColor(...cPanel); doc.rect(0, footerY+0.5, PW, PH-(footerY+0.5), 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cMuted);
    doc.text(
        'Pixel3D . Clube de Codigo . Centro de Inovacao Carlos Fiolhais',
        PW/2, PH-5, { align: 'center' }
    );

    const safeTitle = (tituloObjeto||'modelo').toLowerCase().replace(/[^a-z0-9]/g,'_');
    doc.save(`pixel3d_${safeTitle}.pdf`);

    btn.disabled = false; btn.textContent = '📄 Ficha PDF';
    mostrarMensagem('Ficha PDF exportada!');
}

function exportarTXT() {
    const SYMS = ['·','N','P','V','C','Z','S','B','R','L','A','M','U','I','O','E'];
    const total = Object.keys(voxelMeshes).length;
    let txt = '════════════════════════════════════\n';
    txt += '  PIXEL3D — O Teu Modelo Voxel\n';
    txt += '════════════════════════════════════\n';
    txt += `  Blocos  : ${total}\n`;
    txt += `  Grid    : ${GRID_SIZE}×${GRID_SIZE}×${GRID_SIZE}\n`;
    txt += '════════════════════════════════════\n\n';
    txt += '  Legenda: · = vazio, letra = cor\n\n';

    for (let y = 0; y < GRID_SIZE; y++) {
        let hasVoxel = false;
        for (let x = 0; x < GRID_SIZE; x++)
            for (let z = 0; z < GRID_SIZE; z++)
                if (grid[x][y][z] >= 0) hasVoxel = true;
        if (!hasVoxel) continue;
        txt += `━━━ Y=${y} ━━━\n`;
        for (let z = 0; z < GRID_SIZE; z++) {
            txt += '  ';
            for (let x = 0; x < GRID_SIZE; x++) {
                const v = grid[x][y][z];
                txt += (v >= 0 ? SYMS[v] : '·') + ' ';
            }
            txt += '\n';
        }
        txt += '\n';
    }

    txt += '════════════════════════════════════\n';
    txt += '  Pixel3D · CICF\n';
    txt += '════════════════════════════════════\n';

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    a.download = 'pixel3d_camadas.txt'; a.click();
    mostrarMensagem('📄 TXT exportado!');
}

// ============================================================
// MISC UI
// ============================================================
function mostrarMensagem(texto, erro = false) {
    const el = document.getElementById('message');
    el.textContent = texto;
    el.className = 'message ' + (erro ? 'error show' : 'show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const btn = document.getElementById('toggle-sidebar');
    sb.classList.toggle('hidden');
    btn.classList.toggle('moved');
    btn.textContent = sb.classList.contains('hidden') ? '▶ Painel' : '◀ Painel';
}

// ============================================================
// LOOP
// ============================================================
function animate() {
    requestAnimationFrame(animate);
    if (animando) {
        // Orbitar câmera à volta do pivot (cameraTarget)
        const dx = camera.position.x - cameraTarget.x;
        const dz = camera.position.z - cameraTarget.z;
        const ang = Math.atan2(dz, dx) + 0.012;
        const rad = Math.sqrt(dx * dx + dz * dz);
        camera.position.x = cameraTarget.x + Math.cos(ang) * rad;
        camera.position.z = cameraTarget.z + Math.sin(ang) * rad;
        camera.lookAt(cameraTarget);
    }
    renderer.render(scene, camera);
}

// ============================================================
// EXPORT FICHA PDF
// ============================================================
async function exportarFicha() {
    // ── Modal para recolher nome e título ─────────────────────────────
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;
        display:flex;align-items:center;justify-content:center;
        backdrop-filter:blur(6px);
    `;
    overlay.innerHTML = `
        <div style="background:#0f1530;border:2px solid #00ff88;border-radius:16px;
                    padding:36px 40px;width:380px;box-shadow:0 0 40px rgba(0,255,136,0.2);
                    font-family:'Segoe UI',sans-serif;color:#e0e7ff;">
            <h2 style="color:#00ff88;font-size:18px;letter-spacing:.06em;
                        text-shadow:0 0 12px rgba(0,255,136,.4);margin-bottom:24px">
                📄 Exportar Ficha PDF
            </h2>
            <label style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;
                           color:#6b7a99;display:block;margin-bottom:6px">
                Teu Nome
            </label>
            <input id="ficha-nome" type="text" placeholder="Ex: Maria Silva"
                   style="width:100%;padding:10px 14px;background:#1a2040;border:1px solid rgba(0,255,136,.35);
                          border-radius:8px;color:#e0e7ff;font-size:14px;margin-bottom:18px;outline:none;">
            <label style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;
                           color:#6b7a99;display:block;margin-bottom:6px">
                Nome do Objeto
            </label>
            <input id="ficha-titulo" type="text" placeholder="Ex: Foguetão Espacial"
                   style="width:100%;padding:10px 14px;background:#1a2040;border:1px solid rgba(0,255,136,.35);
                          border-radius:8px;color:#e0e7ff;font-size:14px;margin-bottom:28px;outline:none;">
            <div style="display:flex;gap:12px;">
                <button id="ficha-cancel"
                        style="flex:1;padding:11px;border-radius:8px;border:1px solid rgba(255,255,255,.15);
                               background:transparent;color:#6b7a99;font-size:13px;cursor:pointer;">
                    Cancelar
                </button>
                <button id="ficha-ok"
                        style="flex:2;padding:11px;border-radius:8px;border:none;
                               background:#00ff88;color:#0a0e27;font-size:13px;font-weight:700;cursor:pointer;">
                    Gerar PDF
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('ficha-nome').focus();

    const result = await new Promise(resolve => {
        document.getElementById('ficha-cancel').onclick = () => resolve(null);
        overlay.addEventListener('click', e => { if (e.target === overlay) resolve(null); });
        document.getElementById('ficha-ok').onclick = () => resolve({
            nome: document.getElementById('ficha-nome').value.trim() || 'Anónimo',
            titulo: document.getElementById('ficha-titulo').value.trim() || 'O meu modelo'
        });
        document.getElementById('ficha-titulo').addEventListener('keydown', e => {
            if (e.key === 'Enter') resolve({
                nome: document.getElementById('ficha-nome').value.trim() || 'Anónimo',
                titulo: document.getElementById('ficha-titulo').value.trim() || 'O meu modelo'
            });
        });
    });

    document.body.removeChild(overlay);
    if (!result) return;

    mostrarMensagem('A gerar ficha PDF…');
    await new Promise(r => setTimeout(r, 60));

    // ── Guardar estado da cena ────────────────────────────────────────
    const origW = renderer.domElement.width, origH = renderer.domElement.height;
    const origBG = scene.background, origFog = scene.fog;
    const origPos = camera.position.clone();
    const origFov = camera.fov, origAspect = camera.aspect;

    // ── Calcular centro e distância do modelo ─────────────────────────
    const keys = Object.keys(voxelMeshes);
    let center = new THREE.Vector3(GRID_SIZE/2, GRID_SIZE/4, GRID_SIZE/2);
    let bRadius = 8;
    if (keys.length > 0) {
        let mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity,mnZ=Infinity,mxZ=-Infinity;
        keys.forEach(k => {
            const [x,y,z] = k.split(',').map(Number);
            if(x<mnX)mnX=x; if(x>mxX)mxX=x;
            if(y<mnY)mnY=y; if(y>mxY)mxY=y;
            if(z<mnZ)mnZ=z; if(z>mxZ)mxZ=z;
        });
        center.set((mnX+mxX)/2+.5,(mnY+mxY)/2+.5,(mnZ+mxZ)/2+.5);
        const dxz = Math.max(mxX-mnX,mxZ-mnZ)/2+1;
        const dy  = (mxY-mnY)/2+1;
        bRadius = Math.sqrt(dxz*dxz+dy*dy);
    }

    // ── Ocultar helpers ───────────────────────────────────────────────
    gridHelper.visible = false;
    axesHelper.visible = false;
    layerHighlight.visible = false;
    ghostMesh.visible = false;
    pivotIndicator.visible = false;
    scene.fog = null;
    scene.background = new THREE.Color(0x0a0e27);

    // ── 1. Captura principal (viewport actual, sem helpers) ───────────
    const MAIN_W = 800, MAIN_H = 600;
    renderer.setSize(MAIN_W, MAIN_H, false);
    camera.aspect = MAIN_W / MAIN_H;
    camera.fov = 50;
    camera.updateProjectionMatrix();

    const fovHalfRad = (camera.fov/2)*Math.PI/180;
    const fovHHalfRad = Math.atan(Math.tan(fovHalfRad)*camera.aspect);
    const dist = (bRadius/Math.sin(Math.min(fovHalfRad,fovHHalfRad)))*1.12;
    const elev = center.y + bRadius*0.55;

    // Ângulo de 30° para a imagem principal (¾ vista frontal)
    camera.position.set(center.x+Math.cos(Math.PI/6)*dist, elev, center.z+Math.sin(Math.PI/6)*dist);
    camera.lookAt(center);
    renderer.render(scene, camera);
    const mainCanvas = document.createElement('canvas');
    mainCanvas.width = MAIN_W; mainCanvas.height = MAIN_H;
    mainCanvas.getContext('2d').drawImage(renderer.domElement, 0, 0);
    const mainDataURL = mainCanvas.toDataURL('image/png');

    // ── 2. Captura das 8 frames de rotação (tira de filme) ────────────
    const NF = 8, FW = 200, FH = 200;
    renderer.setSize(FW, FH, false);
    camera.aspect = FW/FH;
    camera.updateProjectionMatrix();

    const fovHRad2 = (camera.fov/2)*Math.PI/180;
    const fovHH2   = Math.atan(Math.tan(fovHRad2)*camera.aspect);
    const dist2 = (bRadius/Math.sin(Math.min(fovHRad2,fovHH2)))*1.12;
    const elev2 = center.y + bRadius*0.4;

    const frameDataURLs = [];
    for (let i = 0; i < NF; i++) {
        const ang = (i/NF)*Math.PI*2;
        camera.position.set(center.x+Math.cos(ang)*dist2, elev2, center.z+Math.sin(ang)*dist2);
        camera.lookAt(center);
        renderer.render(scene, camera);
        const fc = document.createElement('canvas');
        fc.width = FW; fc.height = FH;
        fc.getContext('2d').drawImage(renderer.domElement, 0, 0);
        frameDataURLs.push(fc.toDataURL('image/png'));
        await new Promise(r => setTimeout(r, 0));
    }

    // ── Restaurar estado ───────────────────────────────────────────────
    renderer.setSize(origW, origH, false);
    camera.fov = origFov; camera.aspect = origAspect;
    camera.updateProjectionMatrix();
    scene.background = origBG; scene.fog = origFog;
    camera.position.copy(origPos); camera.lookAt(cameraTarget);
    gridHelper.visible=true; axesHelper.visible=true;
    layerHighlight.visible=true; pivotIndicator.visible=true;

    // ── 3. Construir HTML da ficha e abrir para impressão ─────────────
    const hoje = new Date().toLocaleDateString('pt-PT');
    const framesHTML = frameDataURLs.map((url, i) => `
        <div class="frame-cell">
            <img src="${url}" alt="frame ${i+1}">
            <span class="frame-num">${i+1}</span>
        </div>
    `).join('');

    const fichaHTML = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<title>Pixel3D — ${result.titulo}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:210mm; min-height:297mm;
    font-family:'Segoe UI',Tahoma,sans-serif;
    background:#fff; color:#0a0e27;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }

  /* ── Cabeçalho ── */
  .header {
    background:#0a0e27;
    padding:18px 28px 14px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .header-brand { display:flex; flex-direction:column; gap:2px; }
  .header-app {
    font-size:22px; font-weight:800; letter-spacing:.08em;
    color:#00ff88; text-shadow:0 0 12px rgba(0,255,136,.4);
  }
  .header-sub { font-size:9px; color:#6b7a99; letter-spacing:.12em; text-transform:uppercase; }
  .header-cicf {
    font-size:10px; color:#6b7a99; letter-spacing:.08em; text-align:right; line-height:1.6;
  }
  .header-cicf strong { color:#00ff88; display:block; font-size:11px; }

  /* ── Bloco de título ── */
  .title-block {
    padding:20px 28px 16px;
    border-bottom:2px solid rgba(0,255,136,.18);
    background:linear-gradient(to right, rgba(0,255,136,.05) 0%, transparent 60%);
  }
  .proj-title {
    font-size:26px; font-weight:800; color:#0a0e27; letter-spacing:.03em;
    border-left:4px solid #00ff88; padding-left:12px; line-height:1.15;
  }
  .meta-row {
    display:flex; gap:32px; margin-top:10px; padding-left:16px;
  }
  .meta-item { display:flex; flex-direction:column; gap:1px; }
  .meta-label { font-size:8px; letter-spacing:.12em; text-transform:uppercase; color:#6b7a99; }
  .meta-value { font-size:13px; font-weight:600; color:#0a0e27; }

  /* ── Imagem principal ── */
  .main-image-wrap {
    padding:16px 28px 12px;
    border-bottom:1px solid rgba(0,255,136,.12);
  }
  .section-label {
    font-size:8px; letter-spacing:.14em; text-transform:uppercase;
    color:#00ff88; font-weight:700; margin-bottom:8px;
  }
  .main-image-wrap img {
    width:100%; border-radius:10px;
    border:1.5px solid rgba(0,255,136,.25);
    background:#0a0e27; display:block;
  }

  /* ── Tira de frames ── */
  .frames-section { padding:14px 28px 20px; }
  .frames-grid {
    display:grid; grid-template-columns:repeat(8,1fr); gap:6px;
  }
  .frame-cell {
    position:relative; border-radius:6px; overflow:hidden;
    border:1px solid rgba(0,255,136,.2); background:#0a0e27;
  }
  .frame-cell img { width:100%; display:block; }
  .frame-num {
    position:absolute; bottom:3px; right:5px;
    font-size:8px; font-weight:700; color:#00ff88;
    background:rgba(0,0,0,.55); border-radius:3px; padding:1px 4px;
    letter-spacing:.05em;
  }
  .frames-caption {
    margin-top:8px; font-size:9px; color:#6b7a99;
    letter-spacing:.06em; text-align:center;
  }

  /* ── Rodapé ── */
  .footer {
    background:#0a0e27; padding:10px 28px;
    display:flex; justify-content:space-between; align-items:center;
    position:fixed; bottom:0; width:100%;
  }
  .footer-left { font-size:9px; color:#6b7a99; letter-spacing:.06em; }
  .footer-left strong { color:#00ff88; }
  .footer-right { font-size:9px; color:#3a4460; }
  .footer-dots {
    display:flex; gap:5px;
  }
  .footer-dot {
    width:6px; height:6px; border-radius:50%; background:#00ff88; opacity:.3;
  }
  .footer-dot.active { opacity:1; }
</style>
</head>
<body>

<div class="header">
  <div class="header-brand">
    <div class="header-app">🧱 PIXEL3D</div>
    <div class="header-sub">Clube de Código · Modelador Voxel</div>
  </div>
  <div class="header-cicf">
    <strong>CICF</strong>
    Centro de Inovação Carlos Fiolhais
  </div>
</div>

<div class="title-block">
  <div class="proj-title">${result.titulo}</div>
  <div class="meta-row">
    <div class="meta-item">
      <span class="meta-label">Criado por</span>
      <span class="meta-value">${result.nome}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Data</span>
      <span class="meta-value">${hoje}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Blocos</span>
      <span class="meta-value">${Object.keys(voxelMeshes).length}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Ferramenta</span>
      <span class="meta-value">Pixel3D v1.3</span>
    </div>
  </div>
</div>

<div class="main-image-wrap">
  <div class="section-label">Vista 3D do Modelo</div>
  <img src="${mainDataURL}" alt="Vista 3D">
</div>

<div class="frames-section">
  <div class="section-label">Rotação 360° — ${NF} Frames</div>
  <div class="frames-grid">${framesHTML}</div>
  <div class="frames-caption">
    Cada frame representa ${Math.round(360/NF)}° de rotação · Exportado pelo Pixel3D · CICF
  </div>
</div>

<div class="footer">
  <div class="footer-left">
    <strong>Pixel3D</strong> · Clube de Código · CICF &nbsp;·&nbsp; ${hoje}
  </div>
  <div class="footer-dots">
    <div class="footer-dot active"></div>
    <div class="footer-dot"></div>
    <div class="footer-dot"></div>
  </div>
  <div class="footer-right">centroinovacaocarlosfiolhais.github.io</div>
</div>

<script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([fichaHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    mostrarMensagem('✓ Ficha PDF aberta — usa Ctrl+P / Cmd+P para imprimir');
}

window.addEventListener('load', init);
