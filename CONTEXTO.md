# Controle de Ambulâncias — Contexto do Sistema

## Visão Geral

Aplicação web single-page (`index.html`) sem backend. Todos os dados persistem em `localStorage` do navegador. Interface em português, tema escuro/claro alternável.

---

## Estrutura de Dados (localStorage)

| Chave | Conteúdo |
|---|---|
| `ca_amb_v3` | Array de ambulâncias |
| `ca_mov_v3` | Array de movimentações |
| `ca_lug_v1` | Array de lugares |
| `ca_theme` | `"dark"` ou `"light"` |

### Ambulância
```json
{ "id": "uid", "nome": "Ambulância 01", "criado": "23/07/2026 14:30" }
```

### Lugar
```json
{ "id": "uid", "desc": "Hospital do Trabalhador", "criado": "23/07/2026 14:30" }
```

### Movimentação
```json
{ "id": "uid", "ambId": "uid", "ambNome": "Ambulância 01", "tipo": "saida"|"entrada", "vita": "Hospital do Trabalhador", "data": "2026-07-23", "hora": "14:30", "reg": "23/07/2026 14:30" }
```

> `vita` armazena a **descrição do lugar** (string). Campo legado: registros antigos sem `vita` exibem "—" nas grids.

---

## Menu / Telas

| Seção | Item | Descrição |
|---|---|---|
| Início | Dashboard | Cards de acesso rápido + resumo da frota em tempo real |
| Sistemas | Ambulâncias | CRUD de ambulâncias |
| Sistemas | Lugares | CRUD de lugares (hospitais) |
| Sistemas | Movimentações | Registrar Saída/Chegada + status da frota |
| Sistemas | Histórico | Consulta com filtros (período, tipo, ambulância) |
| Dados | Exportar | Download JSON com ambulâncias + movimentações + lugares |
| Dados | Importar | Restaurar a partir de JSON exportado (substitui tudo) |
| Segurança | Limpar Dados | Apagar movimentações e/ou todos os dados (requer digitar "CONFIRMAR") |

---

## Regras de Negócio — Movimentações

### Status de uma ambulância

Determinado pelo **último movimento** registrado (ordenado por data+hora):

- Último tipo = `saida` → **Em trânsito** (amarelo)
- Último tipo = `entrada` → **No pátio — [Lugar]** (verde, exibe o lugar da última entrada)
- Sem movimentos → **No pátio** (verde, sem lugar)

### Tipos de movimentação

| Tipo | Label exibido | Significado |
|---|---|---|
| `saida` | Saída | Ambulância sai de um lugar |
| `entrada` | Chegada | Ambulância chega em um lugar |

### Regras de validação ao registrar

**Saída:**
- Ambulância deve estar **no pátio** (status `patio`). Em trânsito não pode sair.
- O **lugar selecionado** deve corresponder ao lugar onde a ambulância está parada (campo `vita` da última entrada). Ambulâncias sem histórico são aceitas em qualquer lugar.
- Não pode registrar dois saídas consecutivas sem chegada intermediária, em nenhum lugar.

**Chegada:**
- Ambulância deve estar **em trânsito** (status `saida`). No pátio não pode registrar nova chegada.
- Qualquer lugar pode ser selecionado como destino de chegada.

### Formulário de nova movimentação — ordem dos campos

1. **Tipo** — toggle Saída / Chegada
2. **Lugar** — select dinâmico populado dos lugares cadastrados; ao mudar tipo ou lugar, a lista de ambulâncias é filtrada automaticamente
3. **Ambulância** — select filtrado conforme tipo + lugar selecionados
4. **Data** e **Hora** — preenchidos com data/hora atual, editáveis

### Edição de movimentação

Permite alterar apenas **data e hora**. Tipo, ambulância e lugar não são editáveis em modo edição.

---

## Status da Frota

Exibido na tela de Movimentações (cards) e na tela de Ambulâncias (tabela):

- **Em trânsito** — badge amarelo, ícone seta saída
- **No pátio** — badge verde, ícone casa; exibe o lugar: "No pátio — Hospital do Trabalhador"
- **No pátio** (sem lugar, ambulância sem histórico) — badge verde sem sufixo

---

## Gestão de Lugares

- Cadastro com campo único: **Descrição** (ex.: "Hospital do Trabalhador")
- Descrições únicas (case-insensitive)
- Excluir lugar não apaga movimentações históricas que o referenciam
- Lista de lugares alimenta o select "Lugar" no formulário de movimentação

---

## Exportar / Importar

- Export gera JSON com campos: `versao`, `exportado`, `ambulancias`, `movimentacoes`, `lugares`
- Import valida presença de `ambulancias` e `movimentacoes` (obrigatórios); `lugares` é opcional (compatibilidade com exports antigos)
- Import **substitui todos os dados atuais** sem possibilidade de desfazer

---

## Limpar Dados

Duas operações distintas, ambas exigem digitar `CONFIRMAR` no campo de confirmação antes de habilitar o botão:

| Operação | O que apaga |
|---|---|
| Limpar Movimentações | Apenas `ca_mov_v3`; ambulâncias e lugares mantidos |
| Limpar Todos os Dados | `ca_amb_v3` + `ca_mov_v3` + `ca_lug_v1`; sistema volta ao estado inicial |

---

## Histórico — Filtros disponíveis

- **De / Até** — intervalo de datas
- **Tipo** — Todos / Saída / Chegada
- **Ambulância** — Todas ou específica

Colunas exibidas: Ambulância, Tipo, Lugar, Data, Hora, Registrado em, Excluir.

---

## Tecnologias

- HTML + CSS + JavaScript vanilla (sem framework JS)
- Bootstrap 5.3.3 (layout, modais, utilitários)
- Bootstrap Icons 1.11.3
- Sem dependências de backend ou build
