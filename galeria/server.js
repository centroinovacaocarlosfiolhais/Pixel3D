// ============================================================
// Pixel3D — Servidor da Galeria
// Centro de Inovação Carlos Fiolhais
// ============================================================
// Iniciar: npm install && node server.js
// Abre:    http://localhost:3000
// ============================================================

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = 3000;
const GIFS_DIR = path.join(__dirname, 'gifs');
const UPLOAD_PASSWORD = '12QWasZX';

// Garantir que a pasta gifs existe
if (!fs.existsSync(GIFS_DIR)) fs.mkdirSync(GIFS_DIR, { recursive: true });

// ── Multer: guardar uploads na pasta gifs ──────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, GIFS_DIR),
    filename: (req, file, cb) => {
        // Sanitizar nome, evitar sobrescrever: adicionar timestamp se já existe
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const dest = path.join(GIFS_DIR, safe);
        if (fs.existsSync(dest)) {
            const ext  = path.extname(safe);
            const base = path.basename(safe, ext);
            cb(null, `${base}_${Date.now()}${ext}`);
        } else {
            cb(null, safe);
        }
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Aceitar apenas GIFs
        if (file.mimetype === 'image/gif' || file.originalname.toLowerCase().endsWith('.gif')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas ficheiros .gif são aceites'));
        }
    },
    limits: { fileSize: 50 * 1024 * 1024 }   // 50 MB por ficheiro
});

// ── Middleware ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(__dirname));   // serve index.html, etc.
app.use('/gifs', express.static(GIFS_DIR));   // serve os GIFs

// ── API: listar GIFs ───────────────────────────────────────────
app.get('/api/gifs', (req, res) => {
    try {
        const files = fs.readdirSync(GIFS_DIR)
            .filter(f => f.toLowerCase().endsWith('.gif'))
            .sort((a, b) => {
                // Ordenar por data de modificação (mais recente primeiro)
                const sa = fs.statSync(path.join(GIFS_DIR, a)).mtime;
                const sb = fs.statSync(path.join(GIFS_DIR, b)).mtime;
                return sb - sa;
            })
            .map(f => {
                const stat = fs.statSync(path.join(GIFS_DIR, f));
                return {
                    name: f,
                    url:  `/gifs/${encodeURIComponent(f)}`,
                    size: stat.size,
                    date: stat.mtime.toISOString()
                };
            });
        res.json({ count: files.length, gifs: files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── API: upload com password ───────────────────────────────────
app.post('/api/upload', (req, res) => {
    // Verificar password antes de processar o ficheiro
    const pwd = req.headers['x-upload-password'] || '';
    if (pwd !== UPLOAD_PASSWORD) {
        return res.status(401).json({ error: 'Password incorreta' });
    }

    upload.array('gifs', 50)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        const uploaded = (req.files || []).map(f => ({
            name: f.filename,
            url:  `/gifs/${encodeURIComponent(f.filename)}`,
            size: f.size
        }));
        res.json({ uploaded, count: uploaded.length });
    });
});

// ── API: apagar GIF (com password) ────────────────────────────
app.delete('/api/gifs/:filename', (req, res) => {
    const pwd = req.headers['x-upload-password'] || '';
    if (pwd !== UPLOAD_PASSWORD) {
        return res.status(401).json({ error: 'Password incorreta' });
    }
    const filename = path.basename(req.params.filename);   // sem path traversal
    const filepath = path.join(GIFS_DIR, filename);
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Ficheiro não encontrado' });
    }
    fs.unlinkSync(filepath);
    res.json({ deleted: filename });
});

// ── Iniciar ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('  🧱 Pixel3D — Galeria');
    console.log('  ─────────────────────────────────────');
    console.log(`  → http://localhost:${PORT}`);
    console.log(`  → Pasta de GIFs: ${GIFS_DIR}`);
    console.log('  ─────────────────────────────────────');
    console.log('  Ctrl+C para parar');
    console.log('');
});
