# 🎞️ Pixel3D — Galeria

Galeria de GIFs exportados pelo Pixel3D, com servidor Node.js.

---

## 🚀 Deploy no Render.com (gratuito)

### 1. Colocar o projeto no GitHub

```bash
# Na raiz do projeto pixel3d/
git init
git add .
git commit -m "Pixel3D inicial"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USER/pixel3d.git
git push -u origin main
```

### 2. Criar serviço no Render

1. Entrar em [render.com](https://render.com) → **New → Web Service**
2. Ligar o repositório GitHub
3. Configurar:
   - **Root Directory:** `galeria`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
4. Em **Environment Variables**, adicionar:
   - `UPLOAD_PASSWORD` → a tua password (ex: `12QWasZX`)
5. Clicar **Create Web Service**

O Render faz deploy automático. Em 2-3 minutos o site está em:
`https://pixel3d-galeria.onrender.com`

> ⚠️ **Nota sobre o tier gratuito:**
> O disco do Render Free é efémero — GIFs carregados via upload desaparecem
> quando o serviço reinicia (~15 min sem tráfego) ou há redeploy.
>
> **Solução A (recomendada, gratuita):** Coloca os GIFs na pasta `galeria/gifs/`
> e faz commit. Ficam permanentes no repositório e são servidos pelo servidor.
>
> **Solução B (~$1/mês):** Persistent Disk no Render:
> Settings → Disks → Add Disk, Mount Path `/data/gifs`,
> adicionar env var `GIFS_DIR=/data/gifs`. Uploads persistem para sempre.

---

## 💻 Correr localmente

```bash
cd galeria/
npm install
node server.js
# → http://localhost:3000
```

---

## 📁 Estrutura

```
pixel3d/
├── galeria/
│   ├── index.html       ← Interface da galeria
│   ├── server.js        ← Servidor Express
│   ├── package.json
│   └── gifs/            ← GIFs (commit aqui para serem permanentes)
├── render.yaml          ← Config do Render (deploy automático)
└── .gitignore
```

---

## 🔑 Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `PORT` | `3000` | Porta (Render define automaticamente) |
| `UPLOAD_PASSWORD` | `12QWasZX` | Password para upload/apagar |
| `GIFS_DIR` | `./gifs` | Pasta dos GIFs |

> Em produção, definir `UPLOAD_PASSWORD` sempre via variável de ambiente — nunca hardcoded.

---

## 🎞️ Adicionar GIFs permanentes (via Git)

```bash
cp ~/Desktop/meu_modelo.gif galeria/gifs/
git add galeria/gifs/meu_modelo.gif
git commit -m "Adiciona GIF à galeria"
git push
# Render faz redeploy automático
```
