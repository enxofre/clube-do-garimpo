# Clube do Garimpo

Página estática de ofertas. Sem dependências além do Node.js para gerar a lista.

## Atualizar produtos a partir do Feed da Shopee
1. No painel de afiliados: **Criativo → Feed de produto**, baixe o CSV.
2. Salve em [feeds/](./feeds) (apague o `exemplo.csv`).
3. Rode `node tools/build-products.mjs --min-discount 15 --limit 60`.
4. O script gera `products.js` com foto, preço e o **link de afiliado do próprio feed**.

Se o script disser que não reconheceu colunas, mande os cabeçalhos exibidos para ajustar os nomes aceitos em `tools/build-products.mjs`.

Nome, tagline e Instagram ficam em [site.js](./site.js).

## Publicar no GitHub Pages
1. Crie um repositório e envie estes arquivos.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. Use o link gerado na bio do Instagram.
