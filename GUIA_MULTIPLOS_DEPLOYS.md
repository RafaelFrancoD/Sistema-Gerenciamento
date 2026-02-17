# 🚀 Guia: Como Criar URLs Separadas para Cada Cliente

## 🎯 Objetivo
Criar **cópias isoladas** do sistema SGF para diferentes clientes, cada um com sua própria URL no Vercel, **sem interferir no projeto original**.

---

## 📋 Método 1: Deploy Múltiplo no Vercel (MAIS FÁCIL) ⭐

### **Passo a Passo:**

#### 1️⃣ **Projeto Original (já existe)**
```
URL: https://sistema-gerenciamento.vercel.app
Status: ✅ Mantém tudo como está (INTOCÁVEL)
```

#### 2️⃣ **Para Cada Novo Cliente:**

**A. Acesse o Vercel:**
```
https://vercel.com/dashboard
```

**B. Clique em "Add New..." → "Project"**

**C. Selecione o MESMO repositório:**
```
RafaelFrancoD/Sistema-Gerenciamento
```

**D. ANTES de clicar Deploy, mude o nome do projeto:**
```
Nome Original: sistema-gerenciamento
Cliente A:     sgf-cliente-a
Cliente B:     sgf-cliente-b
Cliente C:     sgf-empresa-xyz
```

**E. Clique em "Deploy"**

#### 3️⃣ **Resultado:**

Você terá URLs SEPARADAS:
```
✅ Original:   https://sistema-gerenciamento.vercel.app
✅ Cliente A:  https://sgf-cliente-a.vercel.app
✅ Cliente B:  https://sgf-cliente-b.vercel.app
✅ Cliente C:  https://sgf-empresa-xyz.vercel.app
```

**Cada URL tem:**
- ✅ Dados completamente isolados
- ✅ Deploy independente
- ✅ Zero interferência entre eles
- ✅ Mesmo código, dados diferentes

---

## 📋 Método 2: Branches Separadas (MAIS CONTROLE)

Se quiser versões customizadas para cada cliente:

### **Passo a Passo:**

#### 1️⃣ **Criar Branch para Cliente:**
```bash
# Cliente A
git checkout -b cliente-a
git push origin cliente-a

# Cliente B
git checkout -b cliente-b
git push origin cliente-b
```

#### 2️⃣ **No Vercel, Criar Projeto:**
```
1. Add New → Project
2. Selecione: Sistema-Gerenciamento
3. Em "Branch": escolha "cliente-a" (ao invés de "main")
4. Clique Deploy
```

#### 3️⃣ **Customizar (Opcional):**
```bash
# Na branch do cliente, você pode personalizar:
git checkout cliente-a

# Editar cores, logos, textos específicos...
# Fazer commit
git add .
git commit -m "Customização para Cliente A"
git push origin cliente-a

# Deploy automático no Vercel!
```

---

## 🎨 Comparação dos Métodos

| Característica | Método 1: Deploy Múltiplo | Método 2: Branches |
|----------------|---------------------------|-------------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ Muito fácil | ⭐⭐⭐ Médio |
| **Isolamento** | ✅ Total | ✅ Total |
| **Customização** | ❌ Todos iguais | ✅ Pode personalizar |
| **Manutenção** | ⭐⭐⭐ Atualiza todos de vez | ⭐⭐ Atualiza um por um |
| **Custo** | 💰 Grátis | 💰 Grátis |
| **Recomendado** | ✅ Se todos usam o mesmo sistema | ✅ Se precisa customizar |

---

## 💡 Exemplo Prático

### **Cenário: 3 Clientes**

**Cliente: Shift Brasil**
```
1. No Vercel: Add New → Project
2. Selecione: Sistema-Gerenciamento
3. Renomeie para: sgf-shift-brasil
4. Deploy
5. URL: https://sgf-shift-brasil.vercel.app
```

**Cliente: Empresa XYZ**
```
1. No Vercel: Add New → Project
2. Selecione: Sistema-Gerenciamento
3. Renomeie para: sgf-empresa-xyz
4. Deploy
5. URL: https://sgf-empresa-xyz.vercel.app
```

**Cliente: QA Team**
```
1. No Vercel: Add New → Project
2. Selecione: Sistema-Gerenciamento
3. Renomeie para: sgf-qa-team
4. Deploy
5. URL: https://sgf-qa-team.vercel.app
```

---

## 🔐 Isolamento Garantido

### **Como funciona:**
```
Projeto Original
├── localStorage: sgf_employees, sgf_vacations
└── URL: sistema-gerenciamento.vercel.app

Cliente A (Deploy Separado)
├── localStorage: sgf_employees, sgf_vacations (DIFERENTE!)
└── URL: sgf-cliente-a.vercel.app

Cliente B (Deploy Separado)
├── localStorage: sgf_employees, sgf_vacations (DIFERENTE!)
└── URL: sgf-cliente-b.vercel.app
```

**Por quê?**
- Cada URL roda em um **domínio diferente**
- localStorage é **isolado por domínio** (regra do navegador)
- **Impossível** um cliente ver dados do outro

---

## ⚙️ Configuração Automática

### **Auto-Deploy:**
Quando você fizer um commit na `main`, o Vercel pode:

**Opção A: Atualizar todos os clientes**
```
✅ Vantagem: Todos recebem melhorias automaticamente
❌ Desvantagem: Se algo quebrar, afeta todos
```

**Opção B: Atualizar apenas quando quiser**
```
✅ Vantagem: Controle total
❌ Desvantagem: Precisa atualizar manualmente
```

**Como configurar no Vercel:**
```
1. Entre no projeto do cliente
2. Settings → Git
3. Em "Production Branch":
   - deixe "main" para auto-deploy
   - ou mude para "cliente-a" para deploy manual
```

---

## 📊 Gerenciamento de Clientes

### **Lista de Clientes:**
Crie um arquivo para controlar:

```markdown
# Clientes SGF

## Projeto Original
- URL: https://sistema-gerenciamento.vercel.app
- Branch: main
- Status: ✅ Produção

## Cliente A - Shift Brasil
- URL: https://sgf-shift-brasil.vercel.app
- Branch: main (mesmo código)
- Deploy: Auto
- Data Criação: 17/02/2026

## Cliente B - Empresa XYZ
- URL: https://sgf-empresa-xyz.vercel.app
- Branch: cliente-xyz (customizado)
- Deploy: Manual
- Data Criação: 17/02/2026
```

---

## ⚠️ Importante

### **✅ O QUE FAZER:**
- Criar múltiplos projetos no Vercel (Método 1)
- OU criar branches separadas (Método 2)
- Compartilhar URL específica com cada cliente
- Fazer backup dos dados regularmente

### **❌ NÃO FAZER:**
- Não compartilhar a MESMA URL com clientes diferentes
- Não deletar o projeto original sem backup
- Não fazer alterações diretas em produção sem testar

---

## 🎯 Checklist

Antes de enviar URL para cliente:

- [ ] Deploy concluído com sucesso
- [ ] URL testada e funcionando
- [ ] Sistema carrega corretamente
- [ ] Nome do cliente identificável na URL
- [ ] Screenshot salvo da URL funcionando
- [ ] Cliente orientado sobre salvar URL nos favoritos

---

## 🚀 Quick Start

```bash
# Resumo rápido:
1. Acesse: https://vercel.com/new
2. Selecione: Sistema-Gerenciamento
3. Renomeie: sgf-nome-do-cliente
4. Clique: Deploy
5. Aguarde: 2-3 minutos
6. Copie: URL gerada
7. Envie: Para o cliente
```

---

## 📞 URLs dos Clientes

Após criar, adicione aqui:

```
Cliente 1: [Nome] - https://sgf-cliente1.vercel.app
Cliente 2: [Nome] - https://sgf-cliente2.vercel.app
Cliente 3: [Nome] - https://sgf-cliente3.vercel.app
```

---

**Pronto! Sistema original INTACTO, novos clientes ISOLADOS! 🎉**
