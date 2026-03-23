// ============================================================
// Pixel3D — Servidor Unificado
// Centro de Inovação Carlos Fiolhais
// ============================================================
//   /          → Ferramenta de modelação (Pixel3D)
//   /galeria   → Galeria de GIFs
//   /api/gifs  → API da galeria
// ============================================================
// Local:   npm install && node server.js  → http://localhost:3000
// Railway: variável UPLOAD_PASSWORD em Environment Variables
// ============================================================

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app = express();

// ── Configuração ───────────────────────────────────────────────
const PORT            = process.env.PORT || 3000;
const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || '12QWasZX';
const ROOT_DIR        = __dirname;                          // raiz do repo
const GALERIA_DIR     = path.join(ROOT_DIR, 'galeria');     // pasta galeria/
const GIFS_DIR        = process.env.GIFS_DIR
                        || path.join(GALERIA_DIR, 'gifs');  // pasta gifs/

// Garantir que a pasta gifs existe
if (!fs.existsSync(GIFS_DIR)) fs.mkdirSync(GIFS_DIR, { recursive: true });

// ── Multer ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, GIFS_DIR),
    filename: (req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const dest = path.join(GIFS_DIR, safe);
        if (fs.existsSync(dest)) {
            const ext = path.extname(safe), base = path.basename(safe, ext);
            cb(null, `${base}_${Date.now()}${ext}`);
        } else {
            cb(null, safe);
        }
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/gif' || file.originalname.toLowerCase().endsWith('.gif'))
            cb(null, true);
        else
            cb(new Error('Apenas ficheiros .gif são aceites'));
    },
    limits: { fileSize: 50 * 1024 * 1024 }
});

// ── Middleware ─────────────────────────────────────────────────
app.use(express.json());

// Ficheiros estáticos dos GIFs (antes dos outros para evitar conflitos)
app.use('/galeria/gifs', express.static(GIFS_DIR));

// Ficheiros estáticos da galeria (em /galeria/*)
app.use('/galeria', express.static(GALERIA_DIR));

// Ficheiros estáticos da app principal (em /*)
app.use(express.static(ROOT_DIR));

// ── Rotas HTML ─────────────────────────────────────────────────
// Galeria: qualquer /galeria/* que não seja ficheiro → galeria/index.html
app.get('/galeria', (req, res) => {
    res.sendFile(path.join(GALERIA_DIR, 'index.html'));
});

// App principal: / → index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// ── API: listar GIFs ───────────────────────────────────────────
app.get('/api/gifs', (req, res) => {
    try {
        const files = fs.readdirSync(GIFS_DIR)
            .filter(f => f.toLowerCase().endsWith('.gif'))
            .sort((a, b) => {
                const sa = fs.statSync(path.join(GIFS_DIR, a)).mtime;
                const sb = fs.statSync(path.join(GIFS_DIR, b)).mtime;
                return sb - sa;
            })
            .map(f => {
                const stat = fs.statSync(path.join(GIFS_DIR, f));
                return {
                    name: f,
                    url:  `/galeria/gifs/${encodeURIComponent(f)}`,
                    size: stat.size,
                    date: stat.mtime.toISOString()
                };
            });
        res.json({ count: files.length, gifs: files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── API: upload ────────────────────────────────────────────────
app.post('/api/upload', (req, res) => {
    if ((req.headers['x-upload-password'] || '') !== UPLOAD_PASSWORD)
        return res.status(401).json({ error: 'Password incorreta' });

    upload.array('gifs', 50)(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        const uploaded = (req.files || []).map(f => ({
            name: f.filename,
            url:  `/galeria/gifs/${encodeURIComponent(f.filename)}`,
            size: f.size
        }));
        res.json({ uploaded, count: uploaded.length });
    });
});

// ── API: apagar ────────────────────────────────────────────────
app.delete('/api/gifs/:filename', (req, res) => {
    if ((req.headers['x-upload-password'] || '') !== UPLOAD_PASSWORD)
        return res.status(401).json({ error: 'Password incorreta' });

    const filename = path.basename(req.params.filename);
    const filepath = path.join(GIFS_DIR, filename);
    if (!fs.existsSync(filepath))
        return res.status(404).json({ error: 'Ficheiro não encontrado' });

    fs.unlinkSync(filepath);
    res.json({ deleted: filename });
});

// ── Iniciar ────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  🧱 Pixel3D');
    console.log('  ─────────────────────────────────────');
    console.log(`  → App:     http://localhost:${PORT}/`);
    console.log(`  → Galeria: http://localhost:${PORT}/galeria`);
    console.log(`  → GIFs:    ${GIFS_DIR}`);
    console.log('  ─────────────────────────────────────');
});
