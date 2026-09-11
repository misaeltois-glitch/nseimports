# NSEImports — Briefing de frontend

*v1 · para execução no Claude Code · repo nseimports*

Não vendemos roupa. Vendemos o acesso a uma peça que quase ninguém consegue ter — importada direto da filial de origem, conferida, embalada e entregue como peça de coleção.

**Tags:** Streetwear importado · Colecionáveis · Alto valor · 45 dias úteis, sem rodeio

## Como usar este documento

Peça a construção na ordem: **tokens e componentes base → Home → Produto → Catálogo → Sacola e checkout → Rastreio → Conta → Drops → Lista de espera → Admin**. As seções 03, 04, 07 e 08 são inegociáveis: nenhuma decisão visual pode contrariá-las.

- **Idioma:** Português (BR). Estrutura pronta para EN em rota futura.
- **Stack:** Next.js (App Router) · TypeScript estrito · Tailwind. Saída estática quando possível.
- **Prioridade:** Mobile-first. A maior parte do tráfego virá do Instagram.
- **Tom:** Luxo sóbrio e discreto. Sem hype, sem gritaria, sem emoji.

## 01 · Posicionamento

O erro que todo site de importados comete é se vender como loja. Loja compete por preço e por prazo — e nós perdemos nos dois. Competimos por **raridade e procedência**: a peça que o cliente quer não está no shopping, não está no marketplace, e quando aparece aqui é porque alguém foi buscá-la na fonte.

Portanto o frontend não é um catálogo. É um **arquivo curado**. Cada produto tem dossiê, não descrição. Cada compra tem processo, não frete. Cada espera tem explicação, não desculpa.

- **O que somos:** Curadoria, logística internacional e garantia de estado. Um intermediário em quem o cliente confia mais do que confiaria em si mesmo comprando fora.
- **O que não somos:** Fast fashion, dropshipping, "chegou em 3 dias". Nada de contador de escassez falso, nada de banner de cupom piscando, nada de roleta de desconto.

## 02 · Quem compra

Três perfis. O site precisa falar com os três sem diluir o tom — o colecionador paga a conta, o entusiasta traz o volume.

| Perfil | O que procura | O que trava a compra | Como o site resolve |
|---|---|---|---|
| **O Entusiasta** (18–26 · R$ 400–1.200) | Tênis e peças que os amigos não têm. Descobre pelo Instagram. | "45 dias? Vou esquecer que comprei." | Rastreio visual por etapas, aviso no WhatsApp, página de espera bonita de mostrar. |
| **O Colecionador** (25–45 · R$ 2.000+) | Peça específica, numerada, deadstock. | "Como sei que é original e que chega intacta?" | Dossiê de procedência, fotos da unidade real, embalagem personalizada, laudo de conferência. |
| **O Presenteador** (qualquer idade) | Um presente que impressiona. | Prazo contra a data do evento. | Data estimada em destaque e aviso explícito de que não chega antes dela. |

## 03 · Princípios de design (inegociável)

Seis regras. Em qualquer dúvida de layout, decida pela regra — não pelo gosto.

1. **O produto é o herói; a interface some.** Fundo preto profundo, foto ocupando 60–70% da tela, controles discretos nas bordas. Nada de moldura decorativa em volta da peça.
2. **Dourado é assinatura, não decoração.** Linha de 1px, número de série, selo de autenticidade, anel de foco. Nunca um botão inteiro preenchido de dourado, nunca gradiente dourado, nunca texto longo em dourado.
3. **Honestidade é conversão.** O prazo aparece antes do preço em toda ficha de produto. Quem desiste por causa do prazo não teria ficado — e não vira reclamação depois.
4. **Movimento lento e pesado.** Transições de 400–600ms, easing `cubic-bezier(.16,1,.3,1)`, fade com deslocamento curto (12–20px). Nada de bounce, nada de confete. Respeitar `prefers-reduced-motion`.
5. **Densidade baixa, respiro alto.** No máximo 3 colunas de catálogo no desktop e 2 no mobile. Espaço vazio comunica preço alto melhor do que qualquer selo "premium".
6. **Todo número é monoespaçado.** Preço, referência, série, código de pedido, contagem de dias. Se é um fato verificável, é mono — esse é o truque que faz o site parecer registro de arquivo e não vitrine.

## 04 · Sistema visual (inegociável)

### Cores

| Nome | Hex | Uso |
|---|---|---|
| Ônix | `#0A0A0A` | fundo |
| Grafite | `#141414` | cards |
| Marfim | `#F7F7F5` | texto |
| Ouro | `#C9A227` | linhas |
| Ouro claro | `#E4C76B` | texto ouro |
| Marinho | `#0E1A2B` | terciária |

**Regra do marinho:** nunca aparece como cor de marca. Serve para *separar sem cortar* — fundo de faixas secundárias, hover de linha de tabela, sombra colorida sob o produto, gradiente quase imperceptível no rodapé. Se alguém descrever o site como "preto, branco e dourado", está certo. O marinho é sentido, não visto.

**Contraste:** ouro puro não passa em texto corrido sobre preto. Use `#E4C76B` para qualquer texto abaixo de 20px e reserve `#C9A227` para linhas, bordas, ícones e títulos grandes. Texto de corpo é sempre marfim.

### Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | Neue Haas Grotesk Display ou Söhne · livre: **Archivo** | Nome do produto e títulos de seção. Peso 300–400 em corpos grandes (48–96px), tracking −0.03em. |
| Corpo | Suisse Int'l · livre: **Archivo** ou Public Sans | Texto, labels, navegação. 15–17px, line-height 1.6, máximo 70 caracteres por linha. |
| Dado | **JetBrains Mono** ou IBM Plex Mono | Preço, referência, série, código de pedido, datas, contagem de dias. |

Proibidas: Inter, Roboto, Poppins, Montserrat. Caixa alta com tracking 0.18em só em kickers e labels de até três palavras.

### Grade, forma e imagem

- Grade de 12 colunas, largura máxima 1440px, gutter 24px, margem lateral 32px (20px no mobile). Escala de espaçamento em múltiplos de 4.
- Raio de canto: 2px em botões e inputs, 4px em cards, 0px em imagens de produto. Quase reto — arredondado demais parece loja de aplicativo.
- Fotos de produto sempre sobre preto ou carvão, respiro generoso, 4:5 na grade e 1:1 no zoom.
- Mínimo por produto: 1 foto de estúdio, 1 foto da unidade real recebida, 1 detalhe de etiqueta ou costura, 1 foto da caixa.
- Ruído sutil (2–3% de opacidade) sobre grandes áreas pretas — evita banding e dá textura de impresso.
- Enquanto não houver fotos reais, use placeholders em cinza-carvão com a referência da peça em mono no centro. Placeholder honesto é melhor que imagem de banco.

## 05 · Rotas

| Rota | Tela | Objetivo único |
|---|---|---|
| `/` | Home | Convencer em 8 segundos de que isto não é uma loja comum. |
| `/arquivo` | Catálogo | Navegar por categoria, raridade e preço sem sensação de marketplace. |
| `/arquivo/[slug]` | Produto (dossiê) | Transformar desejo em pedido com o prazo aceito conscientemente. |
| `/drops` | Drops e diário | Mostrar o que está chegando e contar a história das peças. |
| `/drops/[slug]` | Post do drop | Conteúdo longo + peças relacionadas + entrada na lista de espera. |
| `/lista` | Lista de espera | Capturar interesse em peça ainda não disponível. |
| `/processo` | Como funciona | Justificar os 45 dias úteis etapa por etapa. |
| `/embalagem` | Níveis de embalagem | Vender o upgrade (Avançada e Personalizada). |
| `/sacola` | Sacola | Revisar itens e escolher embalagem por item. |
| `/checkout` | Checkout em 3 passos | Fechar sem fricção, reconfirmando a data estimada. |
| `/pedido/[id]` | Confirmação | Dar segurança imediata e abrir o canal de acompanhamento. |
| `/rastrear` | Rastreio público | Consultar por código, sem login. |
| `/conta` | Conta | Pedidos, endereços, avisos, lista de desejos. |
| `/sobre` | Sobre e procedência | Construir confiança: quem somos, de onde vem, o que garantimos. |
| `/duvidas` | Dúvidas | Matar objeção de prazo, imposto, autenticidade e devolução. |
| `/admin` | Admin | Cadastrar peça, mover etapa do pedido, responder lista de espera. |

## 06 · Tela a tela

### Home — sete blocos, nesta ordem

1. **Abertura em tela cheia.** Uma peça só, foto escura, nome em display grande à esquerda. Sobreposto em mono: origem ("Tóquio → São Paulo"), lote e data estimada de chegada. Sem carrossel.
2. **Faixa de credibilidade.** Quatro números em mono sobre marinho: peças entregues, países de origem, taxa de conferência aprovada, avaliação média. Linha dourada de 1px acima e abaixo.
3. **Arquivo recente.** Seis peças em grade 3×2; hover revela origem e estoque real ("1 de 2 unidades").
4. **O prazo, explicado.** Linha do tempo horizontal de cinco etapas (seção 07). Este bloco está na Home de propósito: o prazo não é letra miúda.
5. **Embalagem.** Três cards lado a lado com foto real de cada nível.
6. **Chegou assim.** Galeria de fotos de clientes recebendo a peça — prova social sem depoimento genérico.
7. **Avisos de drop.** Um campo de e-mail ou WhatsApp e um botão contornado. Sem pop-up, nunca.

### Arquivo (catálogo)

- Filtros em barra lateral fixa no desktop, gaveta inferior no mobile: categoria (tênis, moletom, boné, jaqueta, acessório), origem, faixa de preço, **raridade** (Comum · Limitado · Raro · Peça única) e disponibilidade.
- Ordenação: recentes, preço, e "menor prazo" — peças já em trânsito chegam antes.
- Card: foto 4:5, nome, preço em mono, tag de raridade e uma linha discreta com a data estimada. Hover troca para a segunda foto em fade de 400ms.
- Filtros ativos viram chips removíveis acima da grade; o estado dos filtros vai para a URL (compartilhável e indexável).
- Esgotados continuam visíveis a 40% de opacidade com "avisar quando voltar" — o arquivo também é vitrine de reputação.
- Paginação por "carregar mais", nunca scroll infinito.
- Estado vazio: "Nenhuma peça com esses filtros. Entre na lista e avisamos quando entrar uma." + link para `/lista`.

### Produto — o dossiê

A tela mais importante do site. Duas colunas no desktop: galeria sticky à esquerda (60%), painel de decisão à direita (40%) que rola.

- **Cabeçalho:** marca, nome, referência em mono, tag de raridade.
- **Bloco de prazo — antes do preço.** "Chega entre 12 e 26 de novembro" em destaque, "45 dias úteis a partir da confirmação" abaixo, link para `/processo`.
- **Preço** em mono grande, com parcelamento e aviso de que impostos e frete internacional já estão inclusos.
- **Tamanhos** em botões quadrados; indisponíveis riscados, não escondidos. Link para tabela de medidas em modal.
- **Embalagem escolhida aqui**, não só no checkout — é onde o colecionador decide.
- **Procedência:** filial/loja de origem, país, data de aquisição, condição (novo lacrado / deadstock / usado grau A). Ficha em mono, cada campo separado por régua dourada de 1px.
- **Conferência:** checklist do que verificamos antes de despachar — etiqueta, numeração, costura, caixa original, acessórios.
- **Galeria da unidade real:** as fotos da peça que este cliente vai receber, não do catálogo da marca.
- **Relacionados:** no máximo três, mesma origem ou mesmo lote.
- Mobile: barra inferior fixa com preço, data estimada e botão. A data nunca sai da tela.

### Sacola e checkout

- Sacola em painel lateral deslizante; cada linha traz item, tamanho, embalagem e data estimada própria.
- Com prazos diferentes no carrinho, oferecer explicitamente *enviar junto quando tudo chegar* ou *enviar em partes*, com o custo extra visível.
- Checkout em 3 passos com barra de progresso dourada fina: **Identificação → Entrega e embalagem → Pagamento**. Um passo por tela no mobile.
- Convidado permitido; conta criada depois, na confirmação, com um clique.
- CEP preenche endereço automaticamente; validação inline, mensagem de erro abaixo do campo em texto, nunca só borda vermelha.
- Pagamento: Pix com desconto exibido, cartão parcelado, boleto. Reserva da peça por 30 minutos com contador em mono — o único contador honesto do site.
- Antes do botão final, checkbox obrigatório: "Entendi que esta peça é importada e chega em até 45 dias úteis." Reduz chargeback e reclamação.
- Resumo do pedido sempre visível (coluna à direita no desktop, acordeão fixo no topo no mobile).
- Confirmação: número do pedido em mono grande, data estimada, botão para acompanhar no WhatsApp e link direto para o rastreio.

### Rastreio

Público, por código do pedido, sem login. Linha do tempo vertical de cinco etapas: etapa atual em dourado, futuras em cinza, cada uma com data real ou estimada. Abaixo, registro em mono com carimbos ("14/10 · conferência aprovada em Miami"). Barra de progresso com dias decorridos e restantes. Esta tela será aberta dez vezes durante a espera — precisa ser bonita o bastante para o cliente mandar print no grupo.

### Conta

- Entrada por e-mail com link mágico ou senha; nada de login social obrigatório.
- **Pedidos:** lista com miniatura, status por etapa e data estimada; detalhe abre o rastreio embutido, a nota e o comprovante.
- **Arquivo pessoal:** peças já recebidas apresentadas como coleção, com data de chegada e origem — dá orgulho e estimula recompra.
- **Desejos e avisos:** peças salvas e alertas de volta ao estoque.
- **Endereços e dados** em formulário simples, um por card.

### Drops e diário

- Duas naturezas no mesmo índice, diferenciadas por tag: **Drop** (lote que chega em data marcada) e **Diário** (bastidor: como uma peça foi encontrada, o que a torna rara).
- Card de drop mostra contagem regressiva até a abertura, em mono, e as peças do lote.
- Post em coluna única de 68 caracteres, imagens em largura total, citação com barra dourada à esquerda.
- Fim do post: peças relacionadas + entrada na lista de espera. Sempre.

### Lista de espera (pré-venda)

- Formulário curto: peça desejada (busca ou texto livre), tamanho, faixa de preço aceita, e-mail e WhatsApp.
- Explicar em uma frase o que acontece depois: "Procuramos na origem e respondemos em até 5 dias úteis com preço fechado e data."
- Confirmação com posição na fila em mono, quando houver fila.
- Também disponível como bloco compacto em produto esgotado e no fim de cada post de drop.

### Sobre, dúvidas e admin

- **/sobre:** como conseguimos as peças, quem confere, o que garantimos, o que fazemos se algo chegar errado. Texto longo é bem-vindo — confiança se constrói com detalhe.
- **/duvidas:** acordeão agrupado em Prazo, Autenticidade, Pagamento e impostos, Trocas e devoluções, Embalagem. A pergunta do prazo abre por padrão.
- **/admin:** área protegida, deliberadamente simples e densa (é ferramenta, não vitrine). Três telas: *Peças* (tabela com busca, criar e editar, upload de fotos), *Pedidos* (tabela com filtro por etapa e botão para avançar etapa, o que dispara a notificação), *Lista de espera* (fila com marcar como respondida). Mesmos tokens, densidade alta, sem animação.

## 07 · Os 45 dias úteis (inegociável)

O maior obstáculo comercial do negócio e, bem tratado, o maior diferencial. A regra: **o prazo nunca é escondido e nunca é pedido de desculpas — é o preço da procedência.** Três mecanismos, todos obrigatórios.

1. **O selo de data.** Componente que converte 45 dias úteis em *datas reais* ("chega entre 12 e 26 de novembro"), calculadas a partir de hoje, descontando fins de semana e feriados nacionais. Aparece no card do catálogo, no produto, na sacola, no checkout e no e-mail. Nunca escrever "45 dias úteis" sem a data ao lado.
2. **A linha do tempo explicada.** Cinco etapas com duração declarada (quadro abaixo). Aparece na Home, em `/processo` e no rastreio. Cada etapa tem uma frase de "o que está acontecendo agora".
3. **O acompanhamento por pedido.** Progresso com dias decorridos e restantes em mono, atualizado a cada etapa, com e-mail e WhatsApp em toda mudança de estado. Se o prazo escorregar, o site avisa *antes* de o cliente perguntar — com a nova data e o motivo.

| # | Etapa | Duração | O que acontece |
|---|---|---|---|
| 01 | Aquisição na origem | 5–10 dias úteis | Compra confirmada na filial ou no fornecedor autorizado do país de origem. |
| 02 | Conferência internacional | 3–5 dias úteis | Autenticidade, numeração, estado e acessórios verificados e fotografados. |
| 03 | Trânsito internacional | 10–18 dias úteis | Consolidação e voo até o Brasil. |
| 04 | Liberação alfandegária | 5–15 dias úteis | A etapa que não controlamos — e por isso a que mais precisa ser explicada. |
| 05 | Embalagem e entrega | 2–5 dias úteis | Embalagem no nível escolhido, foto final enviada ao cliente, despacho nacional. |

Ajuste as durações aos números reais da operação antes de publicar. A soma exibida precisa ser coerente com os 45 dias úteis prometidos, com folga.

## 08 · Embalagem (inegociável)

Três níveis, apresentados como upgrade natural e não como taxa. Cada nível precisa de foto real e de uma frase que diga para quem ele é.

- **Nível 01 · Padrão** — Caixa original protegida, plástico bolha, lacre NSE. Incluso em todo pedido. Para quem vai usar a peça.
- **Nível 02 · Avançada** (mais escolhido) — Caixa externa rígida, espuma sob medida, papel seda, cartão de procedência assinado. Para quem quer a caixa original intacta.
- **Nível 03 · Personalizada** — Caixa de colecionador, sílica, proteção UV, gravação do nome, certificado numerado. Para quem vai guardar por dez anos. Preço sob consulta dentro do fluxo.

No frontend o seletor é um grupo de rádio com foto, nome, uma linha de descrição e preço. Trocar o nível anima a foto em fade. O nível Personalizada abre campos extras (nome a gravar, observações) e um aviso de que pode somar 3 dias úteis ao prazo.

## 09 · Componentes a construir

Nesta ordem. Cada um com todas as variantes e estados: padrão, hover, ativo, foco visível, desabilitado, carregando, erro.

- **Button** — contornado, sólido marfim, fantasma, ícone. Borda dourada só no primário.
- **RarityTag** — Comum, Limitado, Raro, Peça única. Só a última usa dourado.
- **ArrivalEstimate** — calcula e formata a janela de datas. Variantes inline, destaque e compacta.
- **ProductCard** — foto 4:5, troca no hover, tag, preço mono, data estimada.
- **Gallery** — miniaturas verticais, zoom no clique, swipe no mobile.
- **SpecSheet** — ficha de procedência em mono, linhas separadas por régua dourada.
- **Timeline** — horizontal (Home) e vertical (rastreio), com estado por etapa.
- **PackagingPicker** — rádio com foto, descrição e preço.
- **FilterPanel** — sidebar no desktop, gaveta no mobile, chips de filtro ativo.
- **CartDrawer** — painel lateral com resumo e prazo por item.
- **CheckoutStepper** — 3 passos, validação inline, progresso dourado.
- **StatBand** — faixa de números sobre marinho.
- **WaitlistForm** — completo e compacto.
- **Accordion** — dúvidas, abertura com altura animada.
- **Header** — transparente no topo, sólido ao rolar, contador de sacola.
- **Footer** — gradiente sutil para marinho, mapa do site, selos de pagamento.
- **DataTable** — base do admin: busca, ordenação, ações por linha.
- **Skeleton / EmptyState / Toast** — nunca deixar tela em branco nem ação sem retorno.

## 10 · Técnico

- **Next.js (App Router), TypeScript estrito, Tailwind.** Tokens de cor, tipografia e espaçamento em `tailwind.config.ts`/variáveis CSS — nenhum hex solto em componente.
- Páginas de conteúdo (Home, arquivo, produto, drops, sobre, dúvidas) geradas estaticamente com revalidação; só sacola, checkout, conta e admin são dinâmicos. O site precisa abrir rápido em 4G ruim.
- Dados de produto em `/content/products/*.json` validados com Zod, para trocar por um CMS depois sem reescrever tela.
- Sacola em Zustand com persistência em localStorage; nunca perder o carrinho ao recarregar.
- Imagens por `next/image`, AVIF/WebP, placeholder blur, `sizes` correto, lazy fora da primeira dobra.
- Animação com Framer Motion, apenas `transform` e `opacity`.
- Estrutura: `app/` (rotas) · `components/ui/` (primitivos) · `components/commerce/` · `lib/` (cálculo de prazo, formatação, validações) · `content/` · `types/`.
- Sem dependência pesada de UI kit. Radix UI apenas para modal, acordeão e popover acessíveis.
- Testes: unitário no cálculo de dias úteis (é a regra de negócio mais sensível do site) e um teste de fluxo do checkout.

### Acessibilidade, performance e SEO

- Contraste mínimo 4.5:1 em texto de corpo. Alvo de toque mínimo 44px. Navegação completa por teclado, com anel de foco dourado de 2px e deslocamento de 2px.
- HTML semântico, um `h1` por página, `alt` descritivo em toda foto de produto.
- Metas: LCP abaixo de 2,5s em 4G, CLS abaixo de 0,1, JS inicial abaixo de 150 kB gzip.
- Dados estruturados `Product` e `Offer` com prazo de entrega, `BreadcrumbList` e `FAQPage`. Open Graph por produto com a foto principal.
- `sitemap.xml` e `robots.txt` gerados; URLs em português, slug com marca e modelo.

## 11 · Voz e microtexto

Frases curtas, afirmativas, sem adjetivo de propaganda. Nunca "incrível", "exclusivíssimo", "imperdível". A raridade se prova com fato — origem, quantidade, data — não com adjetivo.

| Onde | Escreva assim | Nunca assim |
|---|---|---|
| Botão de compra | Reservar peça | COMPRAR AGORA!! |
| Prazo | Chega entre 12 e 26 de novembro | Entrega em até 45 dias |
| Estoque | 1 de 2 unidades disponíveis | Últimas unidades! Corre! |
| Esgotado | Fora do arquivo. Avise-me quando entrar. | Produto indisponível |
| Erro de campo | Informe um CEP com 8 dígitos | Campo inválido |
| Espera longa | Sua peça está na alfândega. É a etapa mais lenta e não depende de nós — avisamos assim que liberar. | Aguarde, seu pedido está em processamento |
| Lista de espera | Procuramos na origem e respondemos em até 5 dias úteis com preço fechado e data. | Deixe seu e-mail para novidades |

## 12 · Critérios de aceite

O frontend só está pronto quando todos estes forem verdade:

- [ ] A data estimada de chegada aparece em catálogo, produto, sacola, checkout e confirmação — sempre como data real, nunca só como contagem de dias.
- [ ] Nenhum hex escrito dentro de componente; tudo vem dos tokens.
- [ ] Todo número visível na interface está em fonte monoespaçada.
- [ ] Nenhuma área maior que um botão está preenchida de dourado.
- [ ] O fluxo completo — descobrir peça, escolher embalagem, fechar pedido, rastrear — funciona inteiro no celular, com uma mão.
- [ ] Toda tela tem estado de carregamento e estado vazio desenhados.
- [ ] Navegação por teclado percorre o site inteiro com foco sempre visível.
- [ ] Com `prefers-reduced-motion` ativo, nada se move.
- [ ] Lighthouse acima de 90 em performance, acessibilidade e SEO no mobile.

## 13 · Roadmap de execução (adaptado do "Prompt inicial")

1. **Fundação:** tokens (seção 04) em variáveis CSS/Tailwind, componentes da seção 09 em `components/ui/`, com todos os estados, reunidos em `/estilo` para revisão.
2. **Home**, depois **Produto**, depois **Catálogo**, depois **Sacola e checkout**, depois **Rastreio**, depois **Conta**, depois **Drops**, depois **Lista de espera**, depois **Admin** — uma tela por vez, parando para revisão a cada etapa.
3. Utilitário de cálculo de dias úteis com feriados nacionais brasileiros implementado antes da tela de Produto (na prática, já na fundação, porque `ArrivalEstimate` e a Home dependem dele), com teste unitário.
4. Regras que não podem ser violadas: nenhum hex fora dos tokens, todo número em fonte monoespaçada, dourado só em linhas, bordas, ícones e títulos grandes, e a data estimada de chegada visível em toda tela de compra. Quando algo do briefing estiver ambíguo, perguntar antes de decidir.

**Em aberto** — definir antes das fases que dependem disso: o provedor de pagamento, a quantidade de peças no lançamento, e se o admin será a versão simples descrita aqui ou uma planilha ligada por API.
