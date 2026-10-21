# Estuda SSPREV

App Android (offline) para estudar para o concurso **Técnico de Contabilidade Previdenciário — SSPREV (São Sebastião/SP)**, prova em 22/11/2026, banca Instituto Mais. Construído a partir do *Guia de Estudo* de 21/10/2026.

## O que tem no app
- **Início**: contagem regressiva, tarefas de hoje, sequência de dias, desempenho, dica do dia.
- **Plano**: cronograma dia a dia (22/10 → 22/11) com checkboxes, links de vídeo e lei seca, progresso.
- **Matérias**: resumos de Português, Legislação Municipal e Específicos (3 blocos), com vídeo, lei e atalho para quiz/flashcards.
- **Treino**: 385 questões comentadas alinhadas ao conteúdo programático do edital (quiz rápido, por matéria, mini-simulado 20 q, simulado completo 60 q na proporção do edital com 4h e correção só no fim, refazer erradas), sorteio novo a cada rodada, 89 flashcards com revisão espaçada, registro dos 3 simulados, histórico.
- **Mais**: caderno de erros (com compartilhar), timer dos blocos do dia (50/10) e cronômetro de 4h, checklist do dia da prova, edital em números, método, onde estudar, configurações (nome, tema, lembrete diário, backup).

Tudo salvo no aparelho (localStorage). Sem internet, só os links externos precisam de conexão.

## Design (v1.1)
- Paleta "mesa de estudos": papel lavanda, roxo (primário), amarelo marca-texto (destaque), azul-caneta (informação). Modo escuro com 4 níveis de superfície, sem preto puro.
- Tipografia embutida (offline): Bricolage Grotesque (títulos/números) + Figtree (texto). Arquivos em `www/fonts/`.
- Ícones SVG inline (sem emoji), navegação inferior com indicador em pílula (Material 3 Expressive), microinterações com mola e `prefers-reduced-motion` respeitado.
- Tokens em `:root` e `:root[data-theme=dark]` no topo de `www/css/style.css`.

## Banco de questões
`www/js/questions.js` (base) + `www/js/questions2.js` (ampliação por tópico do edital, inclui questões reais do Instituto Mais marcadas com `src`) + `www/js/questions3.js` (lei seca de São Sebastião: LC 146/2011, Lei Orgânica e LC 241/2019, escritas artigo por artigo a partir dos PDFs em `data/leis/`, com flashcards de números). Total: 566 questões e 125 flashcards. Campos: t (matéria), q, o (4 ou 5 alternativas), a (índice certo), e (explicação), texto (passagem), src (fonte).

## Provas reais da banca
Em Treino → "Provas reais do Instituto Mais": cadernos de concursos anteriores da banca com gabarito oficial, em modo prova (sem correção até o fim) ou treino (correção imediata). Os PDFs ficam em data/provas/ com um JSON gerado por:

    node scripts/import-prova-pdf.js data/provas/X.pdf GABARITO data/provas/X.json --id=... --orgao="..." --ano=2025 --nivel=Superior --cargo="..." --alts=5
    npm run provas   # regenera www/js/provas.js

O importador lê o PDF com coordenadas (pdfjs), separa as duas colunas, detecta seções, textos de apoio e alternativas, e valida contra o gabarito (string com uma letra por questão). Os cadernos do Instituto Mais só são publicados na área restrita do candidato; cópias públicas existem em PCI Concursos (captcha), Qconcursos e Gran Questões (conta grátis).

## Estrutura
- `www/` — o app (HTML/CSS/JS puro). `js/data.js` = conteúdo do guia; `js/questions.js` = banco de questões; `js/app.js` = telas e lógica.
- `android/` — projeto Capacitor/Android gerado.
- `assets/` + `scripts/` — ícone, splash e geradores.
- `release.keystore` + `keystore.properties` — chave de assinatura (**guarde**; sem ela não dá para atualizar o app instalado).

## Rodar no PC (sem celular)

`npm run dev` ou duplo clique em `dev.bat`: abre http://localhost:5173 no navegador e recarrega sozinho a cada alteração em `www/`. No navegador, F12 e Ctrl+Shift+M para ver no tamanho de um Android. Os dados ficam no localStorage do navegador, separados do celular.

## Como gerar o APK de novo
Pré-requisitos já instalados nesta máquina: Node 24, OpenJDK 21 (`C:\Program Files\Microsoft\jdk-21*`), Android SDK em `%USERPROFILE%\android-sdk`.

```powershell
npm install
npm test            # renderiza todas as telas com jsdom
.\build-apk.ps1     # gera EstudaSSPREV.apk na raiz
```

Para mudar conteúdo: edite `www/js/data.js` ou `www/js/questions.js`, suba `versionCode`/`versionName` em `android/app/build.gradle` e rode o build.

## Publicar atualizações (GitHub)
Repositório: https://github.com/alexsynvia/estuda-ssprev (público; o keystore e o APK ficam fora do git).

- **Nova versão do app**: `.\publish.ps1 -Notes "o que mudou"` incrementa a versão, roda os testes, gera o APK, cria a Release no GitHub com o APK anexado e atualiza `release/version.json`. O app instalado lê esse arquivo ao abrir com internet e mostra o card "Atualização disponível" com botão que baixa o APK.
- **Conteúdo sem reinstalar**: edite `release/extra.json` (questões no mesmo formato de `questions.js`, flashcards com `tag`, `f`, `v`) e rode `.\publish.ps1 -ContentOnly -Notes "..."`. O app baixa e mescla ao banco na próxima abertura, guardando em cache para uso offline.

## Instalar no celular
1. Mande o `EstudaSSPREV.apk` (WhatsApp, Drive, cabo USB).
2. No Android, abra o arquivo → permitir "instalar apps desconhecidos" para o app que abriu (Arquivos/WhatsApp) → Instalar.
3. Na primeira abertura, em Mais → Configurações, ative o lembrete diário e permita notificações.
