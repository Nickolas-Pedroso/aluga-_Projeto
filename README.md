# Alugaê

Aplicação web de locação de equipamentos com catálogo, reserva, checkout e painel administrativo. O backend usa Azure Table Storage para produtos, clientes e pedidos, e Azure Blob Storage para imagens de produtos.

## Rodar localmente

```bash
npm install
npm run dev
```

O script carrega automaticamente o arquivo `.env` usando o suporte nativo do Node.

Acesse `http://localhost:5173`. A interface usa dados de demonstração até que o backend seja conectado a uma conta Azure.

## Configurar Azure Storage

1. Crie uma Storage Account no Azure.
2. Copie a connection string em `.env` a partir de `.env.example`.
3. Inicie novamente com `npm run dev`.

O servidor cria as tabelas `NickolasProdutos`, `NickolasClientes` e `NickolasPedidos` automaticamente. O container `nickolaspedidos-imagens` é criado no primeiro upload. Em produção, prefira URLs SAS ou um CDN em vez de acesso público ao container.

## Publicação

O workflow em `.github/workflows/ci.yml` executa `npm ci` e `npm run build` a cada push ou pull request na branch `main`.

O frontend e a API devem ser publicados separadamente. Configure `VITE_API_URL` como variável do build apontando para a API publicada e `CLIENT_ORIGIN` no backend apontando para o domínio do frontend. No ambiente de produção, configure `AZURE_STORAGE_CONNECTION_STRING` e `PORT` como variáveis do serviço de backend.

O GitHub Actions valida e gera o frontend, mas não executa o Express nem substitui a hospedagem da API.

## Publicar para iniciantes: Render + Vercel

1. No GitHub, crie um repositório e envie o projeto. Não envie o arquivo `.env`.
2. No Render, escolha **New > Web Service**, conecte o repositório e use:
	- Build Command: `npm ci`
	- Start Command: `npm run server`
	- Health Check Path: `/api/health`
3. No Render, abra **Environment** e adicione:
	- `AZURE_STORAGE_CONNECTION_STRING`: sua conexão Azure
	- `CLIENT_ORIGIN`: será preenchido depois com a URL da Vercel
4. Crie o serviço. Ao terminar, o Render mostrará uma URL parecida com `https://alugae-api.onrender.com`.
5. No Vercel, escolha **Add New > Project**, importe o mesmo repositório e mantenha o framework **Vite**.
6. Em **Environment Variables** da Vercel, adicione:
	- `VITE_API_URL`: URL do Render seguida de `/api`, por exemplo `https://alugae-api.onrender.com/api`
7. Publique o projeto na Vercel. Ela mostrará uma URL parecida com `https://alugae.vercel.app`.
8. Volte ao Render e altere `CLIENT_ORIGIN` para a URL exata da Vercel, sem barra no final.
9. Faça um novo deploy no Render e na Vercel.
10. Teste primeiro `https://alugae-api.onrender.com/api/health`. Deve retornar `ok: true`. Depois abra o endereço da Vercel.

O arquivo `render.yaml` contém a configuração básica do backend e `vercel.json` contém a configuração do frontend. Você também pode usar os painéis dos serviços seguindo os valores acima.

## API

- `GET/POST /api/products`
- `PATCH/DELETE /api/products/:id`
- `GET/POST /api/clients`
- `PATCH/DELETE /api/clients/:id`
- `GET/POST /api/orders`
- `POST /api/uploads` com `{ fileName, contentType, data }` em base64
- `GET /api/health`

## Stack

React + TypeScript + Vite, Express, `@azure/data-tables` e `@azure/storage-blob`.
