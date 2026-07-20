# Divinno — Frontend (Etapa 1: Cadastro público)

Frontend do sistema de cadastro da **Divinno Cervejaria & Restaurante**, construído do zero com React + Vite, seguindo a identidade visual da logo (preto carvão, dourado, arcos concêntricos).

Este é o **primeiro incremento** do projeto: a página pública de cadastro de clientes, totalmente funcional e estilizada. As próximas etapas (login administrativo, dashboard, lista de clientes, exportação) serão adicionadas uma a uma, sobre esta base.

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL para a URL da sua API
npm run dev
```

## Integração com o backend

O formulário envia um `POST` para `${VITE_API_URL}/clientes` com o corpo:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "dataNascimento": "1990-05-12",
  "whatsapp": "11999999999"
}
```

Ajuste `src/services/clientesService.js` caso o endpoint do seu backend tenha outro caminho ou formato.

## Estrutura

```
src/
 ├── assets/         → logo e imagens
 ├── components/     → Logo, ArchDivider, StepProgress, Panel, FormField, Button, icons
 ├── pages/
 │    └── Cadastro/  → página pública de cadastro + tela de sucesso
 ├── services/       → api.js (axios) e clientesService.js
 ├── hooks/          → useCadastroForm.js (react-hook-form + zod)
 ├── routes/         → AppRoutes.jsx
 ├── styles/         → variables.css (tokens de design) e global.css (reset)
 └── utils/          → masks.js (máscara de telefone)
```

## Identidade visual

- **Cores**: preto carvão `#1A1714` (fundo), branco-osso `#F3EFE7` (texto), dourado `#C9A227 → #8B6B1F` (acento único), grafite `#8C867C` (texto secundário).
- **Tipografia**: Bebas Neue (títulos, ecoa o "DIVINNO" maciço da logo) + Work Sans (corpo).
- **Assinatura**: o motivo de arcos duplos concêntricos da logo, reaproveitado como divisor decorativo (`ArchDivider`).

Nenhum estilo inline foi usado — toda a estilização está em CSS Modules, um arquivo por componente.

## Próximas etapas (aguardando validação desta)

1. Login administrativo (JWT)
2. Dashboard (totais, aniversariantes do mês, novos cadastros)
3. Lista de clientes (paginação, busca, ordenação, filtro por mês)
4. Exportação para Excel (filtrados / todos)
