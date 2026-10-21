/* Conteúdo do Guia de Estudo — Técnico de Contabilidade Previdenciário (SSPREV) */
window.DATA = (() => {
  const yt = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const LEIS = {
    l4320: 'https://www.planalto.gov.br/ccivil_03/leis/l4320.htm',
    lrf: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm',
    l9717: 'https://www.planalto.gov.br/ccivil_03/leis/l9717.htm',
    l14133: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    mcasp: 'https://www.tesourotransparente.gov.br/publicacoes/manual-de-contabilidade-aplicada-ao-setor-publico-mcasp',
    camara: 'https://www.camarasaosebastiao.sp.gov.br',
    ssprev: 'https://ssprev.sp.gov.br',
    gran: 'https://questoes.grancursosonline.com.br/concursos/imais',
    granTec: 'https://questoes.grancursosonline.com.br',
    qc: 'https://www.qconcursos.com',
    imais: 'https://www.institutomais.org.br',
    jc: 'https://jcconcursos.com.br',
    epcp: 'https://www.tce.sp.gov.br/epcp',
    tesouro: 'https://www.tesourotransparente.gov.br',
  };

  const PROVA = {
    data: '2026-11-22T13:00:00-03:00',
    dataTexto: 'domingo, 22/11/2026, à tarde',
    local: 'São Sebastião (SP)',
    cargo: '202 - Técnico de Contabilidade Previdenciário',
    vagas: '1 vaga, 40h, R$ 5.998,60 (após retificação)',
    banca: 'Instituto Mais',
    edital: [
      ['Cargo', '202 - Técnico de Contabilidade Previdenciário (1 vaga, 40h, R$ 5.998,60 após retificação)'],
      ['Banca', 'Instituto Mais'],
      ['Formato', '60 questões de múltipla escolha, 4 alternativas (A a D), sem consulta'],
      ['Língua Portuguesa', '10 questões'],
      ['Legislação Municipal', '10 questões'],
      ['Conhecimentos Específicos', '40 questões (2/3 da prova)'],
      ['Duração', '4 horas; só pode sair depois de 2 horas'],
      ['Nota mínima', '50 pontos (cada questão vale 1,67 ponto) = 30 acertos'],
      ['Desempate', '1º idade 60+, 2º mais pontos em Específicos, 3º Português, 4º Legislação'],
      ['Locais de prova', 'Divulgação prevista para 13/11'],
      ['Gabarito', 'Primeiro dia útil após a prova (seg 23/11), depois das 14h'],
      ['Recurso', '2 dias úteis após o gabarito, pela área do candidato'],
    ],
    insights: [
      'Específicos decidem tudo: valem 40 pontos de 60 e são o primeiro critério de desempate. Cerca de 60% do tempo de estudo vai para eles.',
      'Português e Legislação Municipal são "pontos baratos": conteúdo menor e repetitivo. Mirar 8/10 em cada.',
      'Com 4 alternativas, eliminar 2 já dá 50% de chance no chute. Nunca deixar questão em branco (não há desconto por erro).',
      'Para passar basta acertar 30 de 60. Para ser chamada (é só 1 vaga), o alvo realista é 45+ acertos.',
    ],
  };

  const BLOCO_DIA = [
    ['1', '10 min', 'Revisar o resumo de ontem (flashcards ou caderno de erros)'],
    ['2', '50 min', 'Teoria de Específicos (videoaula ou PDF)'],
    ['—', '10 min', 'Pausa (levantar, beber água, sem celular)'],
    ['3', '40 min', 'Questões de Específicos do assunto do dia'],
    ['4', '30 min', 'Português ou Legislação Municipal (alternar dias)'],
    ['5', '10 min', 'Anotar no caderno de erros o que errou'],
  ];

  const METODO = [
    ['Teoria curta', 'Máx. 50 min por assunto. Uma videoaula ou um PDF, em velocidade 1,25x–1,5x. Anotar só o que não sabia.'],
    ['Questões logo em seguida', '20 a 30 por assunto. Filtrar pelo assunto e, quando der, por nível médio. Ler o comentário de toda questão errada.'],
    ['Caderno de erros', 'Para cada erro, uma linha: assunto → o que confundi → regra certa. Esse caderno vira o material da última semana.'],
    ['Revisão espaçada', 'Rever o assunto no dia seguinte, depois de 7 dias e na véspera. Bastam 10 minutos lendo o resumo/caderno de erros.'],
    ['Texto da lei para legislação', 'Instituto Mais e bancas parecidas copiam a letra da lei. Ler artigos-chave em voz alta e marcar prazos, números e percentuais.'],
    ['Mapas e tabelas próprias', 'Montar à mão: estágios da receita e da despesa, tipos de crédito adicional, estrutura dos 4 balanços. Fazer à mão fixa mais que ler pronto.'],
    ['Simulado como se fosse o dia', '60 questões, 4h, sem celular, de preferência à tarde (mesmo horário da prova), com gabarito em folha separada.'],
  ];

  const TRUQUES = [
    'Resolver primeiro Específicos (mais pontos), depois Português e Legislação.',
    'Questão travou por mais de 3 minutos? Marcar e pular; voltar no fim.',
    'Palavras como "sempre", "nunca", "exclusivamente" costumam indicar alternativa errada em contabilidade pública.',
    'Reservar os últimos 20 minutos só para passar para a folha de respostas com calma.',
    'Grifar no enunciado se pede a alternativa CORRETA ou INCORRETA antes de ler as opções.',
    'Com 4 alternativas, eliminar 2 já dá 50% no chute. Nunca deixar em branco.',
    'Melhor estudar todo dia um pouco do que 8 horas num dia só.',
    'Texto da lei: marcar prazos, números e percentuais. É o que a banca cobra.',
    'Treinar à tarde em alguns dias: a prova é à tarde e o cérebro se acostuma a render nesse horário.',
    'A LC 241/2019 é a lei da casa: 2 ou 3 questões só dela e quase ninguém estuda.',
  ];

  // Cronograma: cada dia tem esp (específicos) e pl (português/legislação)
  const L = (label, url) => ({ label, url });
  const CRONOGRAMA = [
    {
      semana: 1, titulo: 'Base de contabilidade e orçamento', dias: [
        { d: '2026-10-22', esp: { t: 'Partidas dobradas, débito e crédito', links: [L('vídeo', yt('partidas dobradas débito e crédito'))], tag: 'cgeral' }, pl: { m: 'Port', t: 'Interpretação de texto', links: [L('vídeo', yt('interpretação de texto para concursos'))], tag: 'port' } },
        { d: '2026-10-23', esp: { t: 'Fatos contábeis e variações do PL', links: [L('vídeo', yt('fatos contábeis permutativos modificativos mistos'))], tag: 'cgeral' }, pl: { m: 'Leg', t: 'Estatuto — conceitos e formas de provimento', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-10-24', h: 4, esp: { t: 'Operações financeiras (desconto de NP e duplicatas, empréstimos) + devedores duvidosos. Fechar com 30 questões de contabilidade geral', links: [L('vídeo desconto', yt('desconto de duplicatas contabilização')), L('vídeo PECLD', yt('PDD PECLD contabilização'))], tag: 'cgeral' }, pl: { m: 'Port', t: 'Sinônimos, antônimos, sentido próprio e figurado', links: [L('vídeo', yt('sinônimos antônimos denotação conotação'))], tag: 'port' } },
        { d: '2026-10-25', h: 4, esp: { t: 'Reservas × provisões + depreciação, amortização e exaustão', links: [L('vídeo reservas', yt('diferença reservas e provisões')), L('vídeo depreciação', yt('depreciação amortização exaustão'))], tag: 'cgeral' }, pl: { m: 'Leg', t: 'Estatuto — posse, exercício, estágio probatório, estabilidade', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-10-26', esp: { t: 'Orçamento: princípios, PPA, LDO e LOA', links: [L('vídeo', yt('princípios orçamentários PPA LDO LOA')), L('Lei 4.320, arts. 2 a 8', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Ortografia e acentuação', links: [L('vídeo', yt('acentuação gráfica novo acordo'))], tag: 'port' } },
        { d: '2026-10-27', esp: { t: 'Sistemas contábeis + receita: classificação (orçamentária × extra, corrente × capital)', links: [L('vídeo sistemas', yt('sistemas contábeis lei 4320')), L('vídeo receita', yt('receita pública classificação e estágios')), L('Lei 4.320, arts. 9 a 11', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — vacância, remoção, redistribuição', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-10-28', esp: { t: 'Receita: estágios + dívida ativa, resíduos ativos, restituições', links: [L('vídeo dívida ativa', yt('dívida ativa lei 4320')), L('Lei 4.320, arts. 39 e 51 a 57', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Pontuação', links: [L('vídeo', yt('uso da vírgula concursos'))], tag: 'port' } },
      ]
    },
    {
      semana: 2, titulo: 'Despesa, créditos e balanços', dias: [
        { d: '2026-10-29', esp: { t: 'Despesa: classificação', links: [L('vídeo', yt('despesa pública classificação lei 4320')), L('Lei 4.320, arts. 12 e 13', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — vencimento, remuneração e vantagens', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-10-30', esp: { t: 'Despesa: estágios (empenho, liquidação, pagamento)', links: [L('vídeo', yt('despesa pública estágios empenho liquidação pagamento')), L('Lei 4.320, arts. 58 a 70', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Classes de palavras', links: [L('vídeo', yt('classes de palavras resumo'))], tag: 'port' } },
        { d: '2026-10-31', h: 4, esp: { t: 'Restos a pagar, dívida flutuante, despesas de exercícios anteriores. Fechar com 40 questões de receita e despesa', links: [L('vídeo RP', yt('restos a pagar processados e não processados')), L('vídeo DEA', yt('despesas de exercícios anteriores DEA')), L('Lei 4.320, arts. 36, 37 e 92', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — férias e licenças', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-01', h: 4, esp: { t: 'Regime contábil (caixa × competência) e regime de adiantamento', links: [L('vídeo', yt('regime de caixa competência setor público suprimento de fundos')), L('Lei 4.320, arts. 35 e 68 a 69', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Conjunções', links: [L('vídeo', yt('conjunções coordenativas e subordinativas'))], tag: 'port' } },
        { d: '2026-11-02', h: 4, feriado: true, esp: { t: 'Créditos adicionais', links: [L('vídeo', yt('créditos adicionais suplementares especiais extraordinários')), L('Lei 4.320, arts. 40 a 46', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — direito de petição, deveres e proibições', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-03', esp: { t: 'Patrimônio público: ativo e passivo financeiro × permanente', links: [L('vídeo', yt('patrimônio público ativo financeiro permanente'))], tag: 'cpub' }, pl: { m: 'Port', t: 'Concordância verbal e nominal', links: [L('vídeo', yt('concordância verbal professor noslen'))], tag: 'port' } },
        { d: '2026-11-04', esp: { t: 'Balanço orçamentário e balanço financeiro', links: [L('vídeo', yt('balanço orçamentário financeiro patrimonial DVP')), L('Lei 4.320, arts. 101 a 103', LEIS.l4320), L('MCASP Parte V', LEIS.mcasp)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — responsabilidades e penalidades', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
      ]
    },
    {
      semana: 3, titulo: 'Balanços, controle, LRF e leis do cargo', dias: [
        { d: '2026-11-05', esp: { t: 'Balanço patrimonial e DVP', links: [L('vídeo', yt('balanço patrimonial DVP lei 4320')), L('Lei 4.320, arts. 104 e 105', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Regência verbal e nominal', links: [L('vídeo', yt('regência verbal concursos'))], tag: 'port' } },
        { d: '2026-11-06', esp: { t: 'Controle interno, externo e controladoria', links: [L('vídeo', yt('controle interno e externo administração pública')), L('Lei 4.320, arts. 75 a 82', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Estatuto — sindicância e processo administrativo disciplinar', links: [L('Estatuto (Câmara)', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-07', simulado: 1, esp: { t: 'SIMULADO 1 (60 questões, 4h, à tarde): prova antiga do Instituto Mais no Gran Questões. Corrigir e passar os erros para o caderno', links: [L('Gran Questões - IMAIS', LEIS.gran)], tag: 'sim' }, pl: null },
        { d: '2026-11-08', h: 4, esp: { t: 'LRF parte 1: receita corrente líquida, planejamento, renúncia de receita', links: [L('vídeo', yt('LRF para concursos receita corrente líquida renúncia de receita')), L('LRF, arts. 1 a 14', LEIS.lrf)], tag: 'lrf' }, pl: { m: 'Port', t: 'Crase', links: [L('vídeo', yt('crase português com letícia'))], tag: 'port' } },
        { d: '2026-11-09', esp: { t: 'LRF parte 2: despesa com pessoal e limites, RREO, RGF, transparência', links: [L('vídeo', yt('LRF despesa com pessoal limites RREO RGF')), L('LRF, arts. 18 a 23, 48 a 55', LEIS.lrf)], tag: 'lrf' }, pl: { m: 'Leg', t: 'Lei Orgânica — organização do município e competências', links: [L('Câmara Municipal', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-10', esp: { t: 'Lei 9.717/98 (RPPS) — ler a lei inteira, é curta', links: [L('vídeo', yt('lei 9717 RPPS')), L('Lei 9.717', LEIS.l9717)], tag: 'rpps' }, pl: { m: 'Port', t: 'Colocação pronominal', links: [L('vídeo', yt('colocação pronominal concursos'))], tag: 'port' } },
        { d: '2026-11-11', esp: { t: 'LC 241/2019 (criação do SSPREV) — 1ª leitura, marcando estrutura, órgãos e receitas', links: [L('site do SSPREV', LEIS.ssprev), L('Câmara Municipal', LEIS.camara)], tag: 'rpps' }, pl: { m: 'Leg', t: 'Lei Orgânica — Câmara, vereadores e processo legislativo', links: [L('Câmara Municipal', LEIS.camara)], tag: 'leg' } },
      ]
    },
    {
      semana: 4, titulo: 'Licitações e revisão por questões', dias: [
        { d: '2026-11-12', esp: { t: 'Lei 14.133/21: princípios, modalidades, dispensa × inexigibilidade', links: [L('vídeo', yt('lei 14133 resumo concursos')), L('Lei 14.133', LEIS.l14133)], tag: 'lic' }, pl: { m: 'Leg', t: 'Lei Orgânica — prefeito, administração, finanças e tributação', links: [L('Câmara Municipal', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-13', esp: { t: 'Questões de contabilidade geral + 2ª leitura da LC 241/2019. Conferir o local de prova no site do Instituto Mais', links: [L('Instituto Mais', LEIS.imais), L('Gran Questões', LEIS.granTec)], tag: 'cgeral' }, pl: { m: 'Port', t: '15 questões da banca', links: [L('Gran Questões - IMAIS', LEIS.gran)], tag: 'port' } },
        { d: '2026-11-14', simulado: 2, esp: { t: 'SIMULADO 2 (60 questões, 4h, à tarde): outra prova antiga do Instituto Mais', links: [L('Gran Questões - IMAIS', LEIS.gran)], tag: 'sim' }, pl: null },
        { d: '2026-11-15', h: 4, esp: { t: 'Caderno de erros + questões de receita, despesa e créditos adicionais', links: [L('Gran Questões', LEIS.granTec)], tag: 'cpub' }, pl: { m: 'Leg', t: 'Questões sobre estatuto de servidores', links: [L('Qconcursos', LEIS.qc)], tag: 'leg' } },
        { d: '2026-11-16', esp: { t: 'Questões de balanços + texto da Lei 4.320 (só artigos marcados)', links: [L('Lei 4.320', LEIS.l4320)], tag: 'cpub' }, pl: { m: 'Port', t: 'Revisão de crase e concordância por questões', links: [L('Gran Questões - IMAIS', LEIS.gran)], tag: 'port' } },
        { d: '2026-11-17', esp: { t: 'Questões de LRF e Lei 9.717 + texto da LRF sobre limites de pessoal', links: [L('LRF', LEIS.lrf), L('Lei 9.717', LEIS.l9717)], tag: 'lrf' }, pl: { m: 'Leg', t: 'Revisão da Lei Orgânica (só marcações)', links: [L('Câmara Municipal', LEIS.camara)], tag: 'leg' } },
        { d: '2026-11-18', esp: { t: 'Questões da Lei 14.133 + 3ª leitura da LC 241/2019', links: [L('Lei 14.133', LEIS.l14133), L('site do SSPREV', LEIS.ssprev)], tag: 'lic' }, pl: { m: 'Port', t: '15 questões da banca', links: [L('Gran Questões - IMAIS', LEIS.gran)], tag: 'port' } },
      ]
    },
    {
      semana: 5, titulo: 'Reta final', dias: [
        { d: '2026-11-19', esp: { t: 'Caderno de erros inteiro + revisão das marcações do Estatuto', links: [], tag: 'rev' }, pl: null },
        { d: '2026-11-20', feriado: true, simulado: 3, esp: { t: 'SIMULADO 3 à tarde: montar 60 questões no Gran Questões (10 Português, 10 legislação, 40 contabilidade)', links: [L('Gran Questões', LEIS.granTec)], tag: 'sim' }, pl: null },
        { d: '2026-11-21', esp: { t: 'Manhã: revisão leve dos resumos. Tarde: descanso e separar documento e canetas', links: [], tag: 'rev' }, pl: null },
        { d: '2026-11-22', prova: true, esp: { t: 'PROVA (à tarde). Chegar 30 min antes. Começar pelos Específicos.', links: [L('Instituto Mais', LEIS.imais)], tag: 'prova' }, pl: null },
      ]
    },
  ];

  const AJUSTE_CRONO = 'Se você já domina a contabilidade geral do curso técnico, encurte a semana 1 para 3 dias e use o tempo extra em contabilidade pública, que é onde a prova pesa.';

  const AMBIENTE = [
    'Lugar fixo e silencioso, mesa limpa, só o material do dia. Se em casa não rolar, biblioteca pública ou sala de estudos.',
    'Celular em outro cômodo ou no modo foco durante os blocos de 50 min.',
    'Mesmo horário todo dia. Se der, treinar à tarde em alguns dias: a prova é à tarde.',
    'Ter à mão: caderno de erros, caneta azul/preta (de corpo transparente, igual a da prova), marca-texto, post-its.',
  ];

  const PLATAFORMAS = [
    { n: 'Gran Questões', custo: 'Grátis, sem limite diário', uso: 'Principal banco de questões. Tem filtro por banca IMAIS (Instituto Mais).', url: LEIS.gran },
    { n: 'Qconcursos', custo: 'Grátis até 10 questões/dia; plano pago ilimitado', uso: 'Comentários de professores e videoaulas curtas por questão.', url: LEIS.qc },
    { n: 'YouTube', custo: 'Grátis', uso: 'Aulas de todos os assuntos (buscas prontas nas matérias).', url: 'https://www.youtube.com' },
    { n: 'Planalto - legislação', custo: 'Grátis', uso: 'Texto atualizado das leis federais (4.320, LRF, 9.717, 14.133).', url: 'https://www.planalto.gov.br/ccivil_03/leis/' },
    { n: 'Tesouro Transparente - MCASP', custo: 'Grátis', uso: 'Manual oficial de contabilidade pública (consulta, não ler inteiro).', url: LEIS.mcasp },
    { n: 'Escola Paulista de Contas Públicas (TCE-SP)', custo: 'Grátis (EAD)', uso: 'Curso de Contabilidade Aplicada ao Setor Público baseado no MCASP, para quem quer aula estruturada.', url: LEIS.epcp },
    { n: 'Estratégia, Gran, Direção Concursos', custo: 'Pagos', uso: 'Só se quiser PDF pronto e organizado; não é obrigatório.', url: null },
  ];
  const DICA_APOSTILA = 'Editoras como Solução e Opção costumam lançar apostila específica deste concurso. Serve como resumo único, mas não substitui questões.';

  const PORTUGUES = {
    intro: 'O edital traz o pacote clássico de nível médio. As que mais caem em banca paulista de prefeitura são interpretação, concordância, crase e colocação pronominal: começar por elas.',
    canais: 'Canais gratuitos bons para nível médio: Professor Noslen e Português com Letícia (aulas curtas, direto ao ponto).',
    treino: 'No Gran Questões, filtrar Língua Portuguesa + banca IMAIS e fazer 10 questões por dia de Português.',
    topicos: [
      { t: 'Interpretação de texto', s: 'Ideia principal, inferência, "segundo o texto" × "pode-se concluir".', v: yt('interpretação de texto para concursos'), tema: 'Interpretação' },
      { t: 'Significação das palavras', s: 'Sinônimo, antônimo, sentido próprio × figurado (denotação/conotação).', v: yt('sinônimos antônimos denotação conotação'), tema: 'Significação' },
      { t: 'Ortografia e acentuação', s: 'Regras do Novo Acordo, porquês, mal/mau, há/a.', v: yt('acentuação gráfica novo acordo'), tema: 'Ortografia' },
      { t: 'Pontuação', s: 'Vírgula (nunca entre sujeito e verbo), aposto, vocativo.', v: yt('uso da vírgula concursos'), tema: 'Pontuação' },
      { t: 'Classes de palavras', s: 'As 10 classes, com atenção a pronomes, preposições e conjunções.', v: yt('classes de palavras resumo'), tema: 'Classes' },
      { t: 'Conjunções e relação entre orações', s: 'Mas/porém (adversativa), porque (causal), embora (concessiva), portanto (conclusiva).', v: yt('conjunções coordenativas e subordinativas'), tema: 'Conjunções' },
      { t: 'Concordância verbal e nominal', s: 'Sujeito posposto, "haver" impessoal, "é proibido entrada".', v: yt('concordância verbal professor noslen'), tema: 'Concordância' },
      { t: 'Regência verbal e nominal', s: 'Assistir a, visar a, preferir X a Y, obedecer a.', v: yt('regência verbal concursos'), tema: 'Regência' },
      { t: 'Crase', s: 'A + a; antes de palavra feminina; casos proibidos e facultativos.', v: yt('crase português com letícia'), tema: 'Crase' },
      { t: 'Colocação pronominal', s: 'Próclise (palavras atrativas: não, que, advérbios), ênclise, mesóclise.', v: yt('colocação pronominal concursos'), tema: 'Colocação pronominal' },
    ],
  };

  const LEGISLACAO = {
    intro: 'São só duas leis: o Estatuto dos Servidores (LC 146/2011) e a Lei Orgânica de São Sebastião. Quase ninguém estuda isso direito, então é onde dá para ganhar dos concorrentes. A banca cobra letra da lei, prazos e exceções.',
    alerta: 'Pelo item 13.16 do edital, vale a legislação vigente até 17/08/2026 (data do edital). A Câmara discutiu uma revisão da Lei Orgânica em 2026; se o texto mudou depois de agosto, a mudança não cai.',
    estatuto: {
      titulo: 'Estatuto dos Servidores - LC 146/2011',
      texto: 'Texto: Estatuto em PDF (site da Câmara). Conferir também se há alterações posteriores no site da Câmara Municipal ou no Diário Oficial do Município.',
      url: LEIS.camara,
      itens: [
        'Conceitos: servidor, cargo, cargo efetivo × em comissão',
        'Formas de provimento (nomeação, readaptação, reversão, reintegração, recondução, aproveitamento)',
        'Posse e exercício: prazos em dias para tomar posse e entrar em exercício',
        'Estágio probatório e estabilidade (duração, o que é avaliado)',
        'Vacância (exoneração, demissão, aposentadoria, falecimento)',
        'Remoção, redistribuição, substituição',
        'Vencimento × remuneração; vantagens (adicional por tempo de serviço, sexta-parte, gratificações, diárias)',
        'Férias, licenças (prêmio, saúde, interesse particular) e afastamentos',
        'Direito de petição e prazos de recurso',
        'Deveres e proibições',
        'Acumulação de cargos',
        'Responsabilidades (civil, penal, administrativa) e penalidades (advertência, suspensão, demissão...)',
        'Sindicância e processo administrativo disciplinar (prazos e fases)',
      ],
      dica: 'O próprio edital (item 1.9) resume alguns benefícios: licença-prêmio de 90 dias a cada 5 anos, quinquênio de 5%, sexta-parte com 20 anos. Ótimo para conferir com o texto do Estatuto.',
    },
    organica: {
      titulo: 'Lei Orgânica do Município',
      texto: 'Procurar "Lei Orgânica" na área de legislação do site da Câmara Municipal de São Sebastião (versão consolidada com emendas).',
      url: LEIS.camara,
      itens: [
        'Organização do município: competências privativas e comuns',
        'Poder Legislativo: Câmara, vereadores, processo legislativo (iniciativa, sanção, veto e prazos)',
        'Poder Executivo: prefeito, vice, atribuições, responsabilidades',
        'Administração pública municipal e servidores',
        'Finanças e orçamento municipal (PPA, LDO, LOA): conversa com a parte de contabilidade pública',
        'Tributação municipal (IPTU, ISS, ITBI, taxas)',
      ],
      videos: [L('estatuto dos servidores municipais concurso', yt('estatuto dos servidores municipais concurso')), L('lei orgânica municipal concurso', yt('lei orgânica municipal concurso'))],
      dica: 'Como não existem muitas questões prontas dessas leis, uma boa tática é pedir a uma IA para gerar questões de múltipla escolha a partir do texto do Estatuto, artigo por artigo.',
    },
  };

  const ESPECIFICOS = {
    intro: 'O conteúdo do cargo 202 se divide em três blocos: contabilidade geral (base), contabilidade pública/orçamento (o miolo, maior peso) e legislação (LRF, RPPS, SSPREV e licitações). A espinha dorsal da contabilidade pública é a Lei 4.320/64: o edital não cita o número, mas quase todos os tópicos vêm dela.',
    blocos: [
      {
        id: 'cgeral', titulo: 'Bloco 1 — Contabilidade geral', peso: '6 a 8 questões', topicos: [
          { t: 'Método das partidas dobradas', s: 'Todo débito tem um crédito de mesmo valor. Ativo e despesa aumentam a débito; passivo, PL e receita aumentam a crédito.', v: yt('partidas dobradas débito e crédito') },
          { t: 'Variações do patrimônio líquido', s: 'PL = Ativo − Passivo. Fatos permutativos (não mudam PL), modificativos (mudam) e mistos.', v: yt('fatos contábeis permutativos modificativos mistos') },
          { t: 'Operações financeiras', s: 'Desconto de nota promissória e de duplicatas, empréstimo pré-fixado: juros a apropriar como conta redutora.', v: yt('desconto de duplicatas contabilização') },
          { t: 'Perdas com devedores duvidosos', s: 'Estimativa de perda de crédito (PECLD/PDD): conta redutora do ativo.', v: yt('PDD PECLD contabilização') },
          { t: 'Reservas e provisões', s: 'Reserva = parte do PL (lucro retido); provisão = passivo de prazo ou valor incerto.', v: yt('diferença reservas e provisões') },
          { t: 'Depreciação, amortização, exaustão', s: 'Depreciação = bens tangíveis; amortização = intangíveis; exaustão = recursos naturais. Método linear: (custo − valor residual) ÷ vida útil.', v: yt('depreciação amortização exaustão') },
        ]
      },
      {
        id: 'cpub', titulo: 'Bloco 2 — Contabilidade pública e orçamento', peso: '18 a 22 questões', topicos: [
          { t: 'Sistemas contábeis', s: 'Orçamentário, financeiro, patrimonial e de compensação (atos que podem virar fatos: garantias, contratos).', v: yt('sistemas contábeis lei 4320') },
          { t: 'Orçamento público', s: 'Princípios (unidade, universalidade, anualidade, exclusividade, equilíbrio...); PPA (4 anos), LDO e LOA.', v: yt('princípios orçamentários PPA LDO LOA'), lei: L('Lei 4.320, arts. 2 a 8', LEIS.l4320) },
          { t: 'Receita pública', s: 'Orçamentária × extraorçamentária. Categorias econômicas: correntes e de capital. Estágios: previsão → lançamento → arrecadação → recolhimento.', v: yt('receita pública classificação e estágios'), lei: L('Lei 4.320, arts. 9 a 11 e 51 a 57', LEIS.l4320) },
          { t: 'Resíduos ativos, dívida ativa, restituições', s: 'Dívida ativa: créditos vencidos e não pagos, inscritos; tributária × não tributária (art. 39 da Lei 4.320).', v: yt('dívida ativa lei 4320'), lei: L('Lei 4.320, art. 39', LEIS.l4320) },
          { t: 'Despesa pública', s: 'Orçamentária × extraorçamentária. Correntes e de capital. Estágios: fixação → empenho → liquidação → pagamento. Empenho ordinário, estimativo, global.', v: yt('despesa pública estágios empenho liquidação pagamento'), lei: L('Lei 4.320, arts. 12, 13 e 58 a 70', LEIS.l4320) },
          { t: 'Restos a pagar e dívida flutuante', s: 'Despesa empenhada e não paga até 31/12. Processados (já liquidados) × não processados (só empenhados).', v: yt('restos a pagar processados e não processados'), lei: L('Lei 4.320, arts. 36 e 92', LEIS.l4320) },
          { t: 'Despesas de exercícios anteriores', s: 'Despesa de ano anterior sem empenho na época (ou com empenho cancelado), paga no orçamento atual.', v: yt('despesas de exercícios anteriores DEA'), lei: L('Lei 4.320, art. 37', LEIS.l4320) },
          { t: 'Regime contábil e regime de adiantamento', s: 'Lei 4.320 (art. 35): receita pelo caixa, despesa pela competência (regime misto). Adiantamento = suprimento de fundos para despesa que não pode esperar o processo normal.', v: yt('regime de caixa competência setor público suprimento de fundos'), lei: L('Lei 4.320, arts. 35, 68 e 69', LEIS.l4320) },
          { t: 'Créditos adicionais', s: 'Suplementares (reforço de dotação), especiais (despesa sem dotação), extraordinários (urgentes e imprevisíveis: guerra, comoção, calamidade). Fontes: superávit financeiro, excesso de arrecadação, anulação de dotações, operações de crédito.', v: yt('créditos adicionais suplementares especiais extraordinários'), lei: L('Lei 4.320, arts. 40 a 46', LEIS.l4320) },
          { t: 'Patrimônio público', s: 'Ativo e passivo financeiro × permanente; superávit financeiro = ativo financeiro − passivo financeiro.', v: yt('patrimônio público ativo financeiro permanente'), lei: L('Lei 4.320, art. 105', LEIS.l4320) },
          { t: 'Balanços (levantamento)', s: 'Orçamentário (previsto × realizado), Financeiro (ingressos × dispêndios + saldos), Patrimonial (bens, direitos, obrigações), DVP (variações aumentativas − diminutivas = resultado patrimonial).', v: yt('balanço orçamentário financeiro patrimonial DVP'), lei: L('Lei 4.320, arts. 101 a 105', LEIS.l4320) },
          { t: 'Controle na administração pública', s: 'Controle interno (próprio órgão), externo (Legislativo + Tribunal de Contas; em SP, o TCE-SP), integrado; papel da controladoria.', v: yt('controle interno e externo administração pública'), lei: L('Lei 4.320, arts. 75 a 82', LEIS.l4320) },
        ],
        ref: 'Referência oficial para tirar dúvidas: MCASP - Tesouro Transparente. Não ler inteiro: usar para consultar o tema que travou.'
      },
      {
        id: 'leis', titulo: 'Bloco 3 — Legislação do cargo', peso: '10 a 14 questões', topicos: [
          { t: 'Lei 4.320/1964', s: 'Arts. 2 a 8 (orçamento), 11 a 13 (classificação), 35 a 39 (exercício financeiro, restos a pagar, DEA, dívida ativa), 40 a 46 (créditos adicionais), 58 a 70 (estágios da despesa), 101 a 106 (balanços).', v: yt('lei 4320 resumo'), lei: L('Planalto', LEIS.l4320), tag: 'cpub' },
          { t: 'LC 101/2000 (LRF)', s: 'Receita corrente líquida; renúncia de receita; despesa com pessoal (município: 60% da RCL, sendo 54% Executivo e 6% Legislativo; alerta em 90% e prudencial em 95% do limite); RREO (bimestral) e RGF (quadrimestral); transparência.', v: yt('LRF para concursos'), lei: L('Planalto', LEIS.lrf), tag: 'lrf' },
          { t: 'Lei 9.717/1998 (RPPS)', s: 'Regras gerais dos RPPS: só para servidores efetivos, caráter contributivo, equilíbrio financeiro e atuarial, avaliação atuarial, vedações (ex.: empréstimo ao ente), contribuição do ente.', v: yt('lei 9717 RPPS'), lei: L('Planalto', LEIS.l9717), tag: 'rpps' },
          { t: 'LC Municipal 241/2019 (SSPREV)', s: 'Criação do SSPREV e reestruturação do FAPS: natureza de autarquia, estrutura, órgãos (conselhos, diretoria), receitas do instituto, cargos. Ler o texto da lei 2 vezes. É bem provável que caiam 2 ou 3 questões só dela.', v: null, lei: L('Site do SSPREV / Câmara', LEIS.ssprev), tag: 'rpps' },
          { t: 'Lei 14.133/2021 (Licitações)', s: 'Princípios; modalidades (pregão, concorrência, concurso, leilão, diálogo competitivo); dispensa × inexigibilidade; fases da licitação; contratos.', v: yt('lei 14133 resumo'), lei: L('Planalto', LEIS.l14133), tag: 'lic' },
        ]
      },
    ],
  };

  const SIMULADOS = {
    intro: 'O melhor treino é prova antiga do próprio Instituto Mais, de preferência de institutos de previdência e prefeituras paulistas. O Gran Questões reúne dezenas de provas da banca, incluindo a do Instituto de Previdência de Osasco, um RPPS muito parecido com o SSPREV.',
    lista: [
      { n: 1, data: '2026-11-07', desc: 'Prova completa antiga do Instituto Mais (de preferência a de Osasco ou de um cargo de contabilidade).', meta: 40 },
      { n: 2, data: '2026-11-14', desc: 'Outra prova completa antiga do Instituto Mais.', meta: 42 },
      { n: 3, data: '2026-11-20', desc: 'Caderno de 60 questões no Gran Questões na proporção da prova: 10 Português, 10 legislação (estatuto/administração), 40 contabilidade pública + geral.', meta: 45 },
    ],
    regras: 'Cronometrar 4 horas, sem celular, à tarde. Corrigir, anotar a nota e passar todo erro para o caderno de erros. Grifar no enunciado se pede a alternativa correta ou incorreta antes de ler as opções.',
    bancos: [
      { n: 'Gran Questões - banca IMAIS', o: 'Provas inteiras do Instituto Mais para baixar e resolver online, grátis', url: LEIS.gran },
      { n: 'Gran Questões - Técnico em Contabilidade', o: 'Provas de técnico em contabilidade de várias bancas (nível igual ao dela)', url: LEIS.granTec },
      { n: 'Qconcursos', o: 'Filtrar disciplina (Contabilidade Pública, AFO) + escolaridade médio; ler comentários', url: LEIS.qc },
      { n: 'JC Concursos - provas anteriores', o: 'PDFs de provas de técnico em contabilidade de prefeituras', url: LEIS.jc },
      { n: 'Estratégia - cadernos IMAIS', o: 'Cadernos de provas recentes do Instituto Mais (alguns exigem cadastro)', url: 'https://www.estrategiaconcursos.com.br' },
      { n: 'Site do Instituto Mais', o: 'Concursos encerrados da banca costumam ter caderno de questões e gabarito publicados', url: LEIS.imais },
    ],
  };

  const DIA_PROVA = {
    antes: [
      '13/11: conferir o local de prova no site do Instituto Mais (área "Meus Concursos") e no DOEM',
      'Ver o trajeto até o local e quanto tempo leva (sair com folga, portão fecha e não tem tolerância)',
      'Sexta e sábado: dormir cedo, comer leve, nada de virar a noite estudando',
      'Nos últimos 3 dias não se aprende matéria nova: só revisão do caderno de erros, resumos e texto dos artigos marcados',
    ],
    levar: [
      'Documento original com foto (RG, CIN, CNH ou CRC). Se for usar documento digital, celular carregado e app já logado',
      'Caneta esferográfica azul ou preta, de corpo transparente (levar 2)',
      'Lápis, borracha sem capa e apontador (permitidos)',
      'Boleto e comprovante de pagamento da inscrição (só pedem se o nome não estiver na lista)',
      'Água e um lanche leve',
      'NÃO levar relógio nenhum (nem analógico), boné ou fone: é motivo de eliminação',
    ],
    durante: [
      'Chegar 30 minutos antes (mínimo exigido pelo edital).',
      'Começar pelos Específicos, depois Português e Legislação.',
      'Pular a questão que travar; voltar no fim.',
      'Não deixar nenhuma em branco: com 4 alternativas, chute educado compensa.',
      'Separar os últimos 20 minutos para passar à folha de respostas, sem rasura (questão rasurada é anulada).',
      'Só pode sair depois de 2 horas; pode levar o caderno de questões.',
    ],
    depois: [
      'Gabarito: segunda-feira 23/11, depois das 14h, no site do Instituto Mais.',
      'Recurso: 2 dias úteis após o gabarito, pela área do candidato.',
    ],
  };

  const FONTES = [
    L('Página do concurso - Instituto Mais', LEIS.imais),
    L('Site do SSPREV (edital e LC 241/2019)', LEIS.ssprev),
    L('Câmara Municipal de São Sebastião (Estatuto LC 146/2011 e Lei Orgânica)', LEIS.camara),
    L('Gran Questões - banca IMAIS', LEIS.gran),
    L('MCASP - Tesouro Transparente', LEIS.mcasp),
    L('Lei 4.320/64 (Planalto)', LEIS.l4320),
    L('LC 101/2000 - LRF (Planalto)', LEIS.lrf),
    L('Lei 9.717/98 (Planalto)', LEIS.l9717),
    L('Lei 14.133/21 (Planalto)', LEIS.l14133),
  ];

  const TAGS = {
    cgeral: 'Contabilidade geral', cpub: 'Contabilidade pública', lrf: 'LRF', rpps: 'RPPS / SSPREV', lic: 'Licitações',
    port: 'Português', leg: 'Legislação municipal', sim: 'Simulado', rev: 'Revisão', prova: 'Prova',
  };

  // Flashcards: [tag, frente, verso]
  const FLASHCARDS = [
    ['cgeral', 'Natureza das contas: o que aumenta a débito e o que aumenta a crédito?', 'Débito aumenta ATIVO e DESPESA. Crédito aumenta PASSIVO, PL e RECEITA.'],
    ['cgeral', 'Equação fundamental do patrimônio', 'PL = Ativo − Passivo (ou Ativo = Passivo + PL).'],
    ['cgeral', 'Fato permutativo × modificativo × misto', 'Permutativo: não altera o PL (troca entre elementos). Modificativo: altera o PL (aumentativo ou diminutivo). Misto: permutativo + modificativo ao mesmo tempo.'],
    ['cgeral', 'PECLD (antiga PDD) é que tipo de conta?', 'Conta REDUTORA do ativo (reduz Clientes/Duplicatas a Receber).'],
    ['cgeral', 'Reserva × provisão', 'Reserva = parte do PL (lucros retidos). Provisão = passivo de prazo ou valor incerto.'],
    ['cgeral', 'Depreciação, amortização e exaustão: a que bens se aplicam?', 'Depreciação: bens tangíveis (máquinas, veículos). Amortização: intangíveis (software, marcas). Exaustão: recursos naturais (minas, florestas).'],
    ['cgeral', 'Fórmula da depreciação linear', '(Custo − Valor residual) ÷ Vida útil. Terrenos não depreciam.'],
    ['cgeral', 'Desconto de duplicatas: como registrar os juros cobrados pelo banco?', 'Juros/encargos a apropriar: conta REDUTORA do passivo (Duplicatas Descontadas), apropriados como despesa financeira ao longo do prazo.'],
    ['cgeral', 'Lançamento de 1ª, 2ª, 3ª e 4ª fórmulas', '1ª: 1 débito e 1 crédito. 2ª: 1 débito e vários créditos. 3ª: vários débitos e 1 crédito. 4ª: vários débitos e vários créditos.'],
    ['cpub', 'Os 4 sistemas contábeis da Lei 4.320', 'Orçamentário, financeiro, patrimonial e de compensação. (O MCASP atual fala em subsistemas: orçamentário, patrimonial, custos e compensação.)'],
    ['cpub', 'Princípios orçamentários citados no art. 2 da Lei 4.320', 'Unidade, universalidade e anualidade.'],
    ['cpub', 'Princípio da exclusividade', 'A LOA não conterá dispositivo estranho à previsão da receita e à fixação da despesa. Exceções: autorização para créditos suplementares e operações de crédito, inclusive ARO.'],
    ['cpub', 'Princípio do orçamento bruto (art. 6)', 'Todas as receitas e despesas constarão da LOA pelos seus totais, vedadas quaisquer deduções.'],
    ['cpub', 'Vigência do PPA', '4 anos (do 2º ano do mandato até o 1º ano do mandato seguinte).'],
    ['cpub', 'Estágios da receita pública', 'Previsão → Lançamento → Arrecadação → Recolhimento.'],
    ['cpub', 'Estágios da despesa pública', 'Fixação (planejamento) → Empenho → Liquidação → Pagamento.'],
    ['cpub', 'Receitas correntes (art. 11)', 'Tributária, de contribuições, patrimonial, agropecuária, industrial, de serviços, transferências correntes e outras receitas correntes.'],
    ['cpub', 'Receitas de capital (art. 11)', 'Operações de crédito, alienação de bens, amortização de empréstimos, transferências de capital e outras receitas de capital.'],
    ['cpub', 'Despesas correntes × despesas de capital (art. 12)', 'Correntes: despesas de custeio e transferências correntes. Capital: investimentos, inversões financeiras e transferências de capital.'],
    ['cpub', 'Investimento × inversão financeira', 'Investimento: obras, equipamentos e material permanente NOVOS (aumentam o patrimônio). Inversão financeira: imóveis/bens JÁ em utilização, títulos de empresas já constituídas.'],
    ['cpub', 'O que é empenho (art. 58)?', 'Ato emanado de autoridade competente que cria para o Estado obrigação de pagamento pendente ou não de implemento de condição. É vedada despesa sem prévio empenho (art. 60).'],
    ['cpub', 'O que é liquidação (art. 63)?', 'Verificação do direito adquirido pelo credor, com base nos títulos e documentos. Apura: a origem e o objeto, a importância exata e a quem se deve pagar.'],
    ['cpub', 'Tipos de empenho', 'Ordinário: valor certo, pago de uma vez. Estimativo: valor não determinável (água, luz, telefone). Global: despesas contratuais parceladas (aluguéis).'],
    ['cpub', 'Restos a pagar (art. 36)', 'Despesas empenhadas mas não pagas até 31/12. Processados = já liquidados. Não processados = só empenhados.'],
    ['cpub', 'Despesas de exercícios anteriores (art. 37)', 'Despesas de exercícios encerrados com crédito próprio e saldo suficiente que não se processaram na época; RP com prescrição interrompida; compromissos reconhecidos após o encerramento. Pagas por dotação específica do orçamento atual.'],
    ['cpub', 'Regime contábil do art. 35 da Lei 4.320', 'Pertencem ao exercício as receitas nele ARRECADADAS (caixa) e as despesas nele legalmente EMPENHADAS (competência). Regime misto.'],
    ['cpub', 'Regime de adiantamento (arts. 68 e 69)', 'Entrega de numerário a servidor, sempre precedida de empenho, para despesas que não possam seguir o processo normal. Vedado a servidor em alcance ou responsável por dois adiantamentos.'],
    ['cpub', 'Dívida flutuante (art. 92)', 'Restos a pagar (excluídos os serviços da dívida), serviços da dívida a pagar, depósitos e débitos de tesouraria. Dívida fundada: exigibilidade superior a 12 meses.'],
    ['cpub', 'Três tipos de créditos adicionais (art. 41)', 'Suplementares: reforço de dotação. Especiais: despesa sem dotação específica. Extraordinários: despesas urgentes e imprevistas (guerra, comoção intestina, calamidade pública).'],
    ['cpub', 'Como se abrem os créditos suplementares, especiais e extraordinários?', 'Suplementares e especiais: autorizados por LEI e abertos por DECRETO. Extraordinários: abertos por decreto, com imediato conhecimento ao Legislativo (na União, por medida provisória).'],
    ['cpub', 'Fontes de recursos para créditos adicionais (art. 43)', 'Superávit financeiro do exercício anterior; excesso de arrecadação; anulação parcial ou total de dotações; produto de operações de crédito autorizadas.'],
    ['cpub', 'Superávit financeiro', 'Ativo financeiro − Passivo financeiro (apurado no balanço patrimonial do exercício anterior), conjugados os saldos de créditos adicionais transferidos e operações de crédito vinculadas.'],
    ['cpub', 'Ativo financeiro × ativo permanente (art. 105)', 'Financeiro: créditos e valores realizáveis INDEPENDENTEMENTE de autorização orçamentária + numerário. Permanente: bens, créditos e valores cuja mobilização DEPENDE de autorização legislativa.'],
    ['cpub', 'Passivo financeiro × passivo permanente', 'Financeiro: compromissos exigíveis cujo pagamento INDEPENDE de autorização orçamentária (ex.: restos a pagar). Permanente: dívida fundada e outras que dependem de autorização legislativa.'],
    ['cpub', 'Os 4 balanços da Lei 4.320 (art. 101)', 'Balanço Orçamentário, Balanço Financeiro, Balanço Patrimonial e Demonstração das Variações Patrimoniais (DVP).'],
    ['cpub', 'O que mostra o Balanço Orçamentário (art. 102)?', 'As receitas e despesas PREVISTAS em confronto com as REALIZADAS.'],
    ['cpub', 'O que mostra o Balanço Financeiro (art. 103)?', 'Receita e despesa orçamentárias + recebimentos e pagamentos extraorçamentários, conjugados com os saldos em espécie do exercício anterior e os que passam ao seguinte. Os RP inscritos entram como receita extraorçamentária.'],
    ['cpub', 'O que mostra a DVP (art. 104)?', 'As alterações no patrimônio, resultantes ou independentes da execução orçamentária, e o RESULTADO PATRIMONIAL do exercício (variações aumentativas − diminutivas).'],
    ['cpub', 'Quem exerce o controle interno e o externo (arts. 76 e 81)?', 'Interno: o próprio Poder Executivo. Externo: o Poder Legislativo, com auxílio do Tribunal de Contas (em SP, o TCE-SP).'],
    ['cpub', 'O que abrange o controle da execução orçamentária (art. 75)?', 'Legalidade dos atos de arrecadação e realização da despesa; fidelidade funcional dos agentes responsáveis por bens e valores; cumprimento do programa de trabalho.'],
    ['cpub', 'Dívida ativa tributária × não tributária (art. 39)', 'Tributária: crédito de obrigação legal relativa a tributos, adicionais e multas. Não tributária: demais créditos (multas não tributárias, foros, laudêmios, aluguéis, indenizações, etc.).'],
    ['cpub', 'Receita extraorçamentária: exemplos', 'Cauções, depósitos, consignações, ARO (operações de crédito por antecipação de receita), inscrição de restos a pagar. Não pertencem ao ente; são passivos.'],
    ['cpub', 'Princípio da unidade de tesouraria (art. 56)', 'Recolhimento de todas as receitas em estrita observância à unidade de tesouraria, vedada qualquer fragmentação para criação de caixas especiais.'],
    ['lrf', 'Receita corrente líquida (RCL) no município', 'Receitas correntes menos a contribuição dos servidores ao RPPS e a compensação financeira entre regimes. Apurada no mês de referência + 11 meses anteriores.'],
    ['lrf', 'Limites de despesa com pessoal no município', '60% da RCL: 54% Executivo e 6% Legislativo (incluído o Tribunal de Contas do Município, quando houver).'],
    ['lrf', 'Limite de alerta e limite prudencial', 'Alerta do Tribunal de Contas: 90% do limite. Prudencial: 95% do limite (vedações: criar cargo, alterar carreira, prover cargo, horas extras...).'],
    ['lrf', 'Prazo para eliminar excesso de despesa com pessoal (art. 23)', 'Nos dois quadrimestres seguintes, sendo pelo menos 1/3 no primeiro.'],
    ['lrf', 'RREO × RGF: periodicidade', 'RREO: bimestral, publicado até 30 dias após o bimestre. RGF: quadrimestral, publicado até 30 dias após o quadrimestre (municípios com menos de 50 mil hab. podem optar por semestral).'],
    ['lrf', 'O que é renúncia de receita (art. 14)?', 'Anistia, remissão, subsídio, crédito presumido, isenção em caráter não geral, alteração de alíquota ou base de cálculo que reduza tributos. Exige estimativa de impacto e compensação (ou demonstração de que não afeta as metas).'],
    ['lrf', 'Ato que aumenta despesa de pessoal nos 180 dias finais do mandato', 'É NULO DE PLENO DIREITO (art. 21).'],
    ['lrf', 'Anexos que integram a LDO pela LRF (art. 4)', 'Anexo de Metas Fiscais e Anexo de Riscos Fiscais.'],
    ['lrf', 'Despesa obrigatória de caráter continuado (art. 17)', 'Despesa corrente derivada de lei, MP ou ato normativo que fixe obrigação de execução por período superior a 2 exercícios.'],
    ['rpps', 'Quem pode ser segurado de um RPPS?', 'Somente servidores titulares de cargo EFETIVO (CF art. 40). Comissionados e temporários vão para o RGPS.'],
    ['rpps', 'Contribuição do ente ao RPPS (Lei 9.717, art. 2)', 'Não pode ser inferior à contribuição do servidor ativo nem superior ao DOBRO dela.'],
    ['rpps', 'Vedações da Lei 9.717 sobre recursos do RPPS', 'Vedado empréstimo de qualquer natureza (inclusive ao próprio ente e aos segurados); aplicação em títulos públicos que não sejam do Governo Federal.'],
    ['rpps', 'Princípios do RPPS na Lei 9.717 (art. 1)', 'Caráter contributivo; equilíbrio financeiro e atuarial; avaliação atuarial inicial e em cada balanço; registro contábil individualizado; pleno acesso dos segurados às informações.'],
    ['rpps', 'Benefícios que o RPPS pode conceder (após EC 103/2019)', 'Apenas aposentadorias e pensão por morte. Os afastamentos por incapacidade temporária, salário-maternidade etc. são pagos pelo ente, não pelo RPPS.'],
    ['rpps', 'Natureza jurídica do SSPREV (LC 241/2019)', 'Autarquia municipal (unidade gestora única do RPPS de São Sebastião), com conselhos e diretoria; receitas: contribuições do ente e dos servidores, rendimentos das aplicações, etc.'],
    ['lic', 'Modalidades de licitação da Lei 14.133/21 (art. 28)', 'Pregão, concorrência, concurso, leilão e diálogo competitivo. (Acabaram tomada de preços e convite.)'],
    ['lic', 'Dispensa × inexigibilidade', 'Dispensa (art. 75): a competição é possível, mas a lei permite não licitar (baixo valor, emergência...). Inexigibilidade (art. 74): competição INVIÁVEL (fornecedor exclusivo, artista consagrado, notória especialização).'],
    ['lic', 'Fases da licitação (art. 17)', 'Preparatória → divulgação do edital → apresentação de propostas e lances → julgamento → habilitação → recursal → homologação.'],
    ['lic', 'Critérios de julgamento (art. 33)', 'Menor preço, maior desconto, melhor técnica ou conteúdo artístico, técnica e preço, maior lance (leilão), maior retorno econômico.'],
    ['lic', 'Pregão: para que serve?', 'Bens e serviços COMUNS (padrões de qualidade objetivos). Critério: menor preço ou maior desconto. É obrigatório para bens e serviços comuns.'],
    ['lic', 'Leilão e concurso', 'Leilão: alienação de bens imóveis ou móveis inservíveis/apreendidos, a quem oferecer maior lance. Concurso: trabalho técnico, científico ou artístico, com prêmio ou remuneração.'],
    ['lic', 'Sanções da Lei 14.133 (art. 156)', 'Advertência; multa; impedimento de licitar e contratar (até 3 anos); declaração de inidoneidade (3 a 6 anos).'],
    ['lic', 'Prazo dos contratos de serviços e fornecimentos contínuos', 'Até 5 anos (art. 106), prorrogáveis até 10 anos (art. 107).'],
    ['port', 'Quando NÃO há crase?', 'Antes de palavra masculina, verbo, pronomes pessoais, "a" singular antes de plural (refere-se a pessoas), entre palavras repetidas (cara a cara), antes de artigo indefinido.'],
    ['port', 'Verbo "haver" no sentido de existir', 'É impessoal: fica sempre no singular. "Havia muitas pessoas" (nunca "haviam"). O mesmo para "fazer" indicando tempo: "Faz dois anos".'],
    ['port', '"É proibido entrada" ou "é proibida a entrada"?', 'Sem artigo: invariável ("é proibido entrada", "é necessário paciência"). Com artigo: concorda ("é proibida a entrada").'],
    ['port', 'Regência: assistir, visar, preferir, obedecer', 'Assistir A (ver), visar A (objetivo), preferir X A Y (nunca "do que"), obedecer A.'],
    ['port', 'Palavras que atraem o pronome (próclise)', 'Palavras negativas (não, nunca), advérbios, pronomes relativos (que, quem), indefinidos, conjunções subordinativas. Nunca iniciar frase com pronome oblíquo.'],
    ['port', 'Mesóclise: quando usar?', 'Com verbo no futuro do presente ou do pretérito, sem palavra atrativa: "Dir-se-ia", "Falar-lhe-ei".'],
    ['port', 'Os quatro porquês', 'Por que (pergunta / "pelo qual"), porque (resposta/explicação), por quê (fim de frase), porquê (substantivo: "o porquê").'],
    ['port', 'Mal × mau; há × a', 'Mal (antônimo de bem) × mau (antônimo de bom). Há = tempo passado ("há dois anos"); a = tempo futuro ou distância ("daqui a dois anos").'],
    ['port', 'Vírgula: a regra de ouro', 'NUNCA separar sujeito de verbo nem verbo de complemento. Usar para aposto, vocativo, adjunto adverbial deslocado, enumerações.'],
    ['port', 'Conjunções: mas, porque, embora, portanto', 'Mas/porém/contudo: adversativa. Porque/pois: causal ou explicativa. Embora/ainda que: concessiva. Portanto/logo: conclusiva.'],
    ['port', 'Acentuação: paroxítonas e proparoxítonas', 'Proparoxítonas: TODAS acentuadas. Paroxítonas terminadas em ditongo (história), i(s), us, um, uns, l, n, r, x, ps, ã(s), ão(s) são acentuadas. "Ideia" e "assembleia" perderam o acento (Novo Acordo).'],
    ['leg', 'Formas de provimento de cargo público', 'Nomeação, readaptação, reversão, reintegração, recondução, aproveitamento (e promoção). Exoneração NÃO é provimento: é vacância.'],
    ['leg', 'Reversão × reintegração × recondução × aproveitamento', 'Reversão: retorno do aposentado. Reintegração: volta do demitido por decisão que anulou a demissão. Recondução: retorno ao cargo anterior. Aproveitamento: retorno do servidor em disponibilidade.'],
    ['leg', 'Formas de vacância', 'Exoneração, demissão, aposentadoria, falecimento (e posse em outro cargo inacumulável, promoção, readaptação).'],
    ['leg', 'Exoneração × demissão', 'Exoneração NÃO é punição (a pedido ou de ofício). Demissão É penalidade disciplinar.'],
    ['leg', 'Benefícios citados no edital (item 1.9)', 'Licença-prêmio de 90 dias a cada 5 anos; quinquênio de 5%; sexta-parte aos 20 anos.'],
    ['leg', 'Estabilidade do servidor (CF art. 41)', 'Após 3 anos de efetivo exercício, com avaliação especial de desempenho obrigatória.'],
    ['leg', 'Responsabilidades do servidor', 'Civil, penal e administrativa: são independentes e podem ser cumulativas. A absolvição penal por inexistência do fato ou negativa de autoria afasta a administrativa.'],
    ['leg', 'Legislação vigente para a prova', 'Vale a legislação em vigor até 17/08/2026 (data do edital), item 13.16. Mudanças posteriores não caem.'],
    ['leg', 'Impostos de competência do município (CF art. 156)', 'IPTU, ISS e ITBI. (IPVA e ICMS são estaduais.)'],
    ['leg', 'Aprovação da Lei Orgânica (CF art. 29)', 'Votada em DOIS turnos, com interstício mínimo de 10 dias, aprovada por 2/3 dos membros da Câmara, que a promulga.'],
    ['leg', 'Controle externo do município (CF art. 31)', 'Exercido pela Câmara Municipal com auxílio do Tribunal de Contas (TCE-SP). O parecer prévio do TC só deixa de prevalecer por decisão de 2/3 da Câmara.'],
    ['leg', 'Acumulação de cargos públicos (CF art. 37, XVI)', 'Vedada, salvo com compatibilidade de horários: 2 de professor; 1 de professor + 1 técnico ou científico; 2 privativos de profissionais de saúde regulamentadas.'],
  ].map((c, i) => ({ id: 'fc' + i, tag: c[0], f: c[1], v: c[2] }));

  return { yt, LEIS, PROVA, BLOCO_DIA, METODO, TRUQUES, CRONOGRAMA, AJUSTE_CRONO, AMBIENTE, PLATAFORMAS, DICA_APOSTILA, PORTUGUES, LEGISLACAO, ESPECIFICOS, SIMULADOS, DIA_PROVA, FONTES, TAGS, FLASHCARDS };
})();
