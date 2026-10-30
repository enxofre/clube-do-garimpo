# Clube do Garimpo

Página estática de ofertas (GitHub Pages) + painel local para atualizar sem mexer em código.

## Atualizar o site (sem código)
1. Dê dois cliques em **`Abrir Painel.bat`** (precisa do Node.js instalado e do Edge).
2. Aba **Ofertas:**
   - **Atualizar da Shopee:** lê a vitrine da Collshp da Debs. Fotos, preços e links de afiliada já vêm prontos.
   - **Mercado Livre/outras lojas:** cole o link de afiliada, nome e preço. A loja é reconhecida pelo link.
   - **Amazon:** informe ASIN e nome. O link sai com `?tag=clubedogari05-20`.
   - **Publicar:** envia para o GitHub. O site atualiza em 1 a 2 minutos.
3. Aba **Vendas:** importe o relatório CSV de cada loja (painéis de afiliados) e veja comissão total, pedidos e últimas vendas. Os dados de vendas ficam só no seu computador, em `%LOCALAPPDATA%\GarimpoBot\clube-do-garimpo\` (fora desta pasta e do git).

O painel só abre em `127.0.0.1` (no seu computador). O git precisa estar logado (`gh auth login`).

## Abas da página
- **Cupons:** coletados de verdade pelo botão "Buscar cupons reais" do painel (página pública de cupons do Promobit, que o `robots.txt` deles permite). Só entram cupons com código e dentro da validade. Cupons vencidos somem sozinhos. O botão "Usar cupom" leva ao link de afiliada da Debs na loja (Amazon com a tag, Mercado Livre com o perfil dela); lojas sem link de afiliada vão para o site da própria loja, sem comissão. Também dá para adicionar cupons à mão.
- **Todos os produtos:** tudo que está em `products.js`, com busca, categorias e ordenação.

## Linha de comando (opcional)
- `npm run coletar` — busca a vitrine da Collshp em `feeds/collshp.csv`.
- `npm run gerar` — gera `products.js` a partir de `feeds/*.csv`.
- Feeds CSV de afiliados (Shopee/Lomadee etc.) também funcionam: colunas `name;price;original_price;image_link;product_link;category`.

## Amazon
Sem a API oficial não exibimos preço (a Amazon proíbe preço desatualizado). O card mostra "Veja o preço atualizado na loja".

## Publicar manualmente
`git add -A && git commit -m "Atualiza ofertas" && git push`
