# Desafio-Gabriel-raimundo

Aplicacao web simples que identifica a origem aproximada do usuario a partir do IP publico e informa se a UF pertence a regiao Sudeste do Brasil.

## Dependencias

- Nao foram utilizadas dependencias externas instaladas via `npm`, `yarn` ou bibliotecas locais.
- A aplicacao usa apenas `HTML`, `CSS` e `JavaScript` puro no navegador.
- A consulta de geolocalizacao usa fallback entre multiplos servicos HTTP publicos:
- `ipapi.co`
- `ipwho.is`
- `api.ipify.org` + `ip-api.com`

## Desenvolvimento da aplicacao

- Estrutura do projeto organizada com os arquivos `index.html`, `style.css` e `script.js`.
- Interface centralizada em uma unica pagina para evitar navegacao entre telas.
- Estilizacao criada no `style.css` para apresentar o botao, estado de carregamento e bloco de resultado.
- Logica de identificacao do IP e da localizacao movida integralmente para o `script.js`.
- Tratamento condicional implementado para verificar se a UF retornada e `RJ`, `SP`, `MG` ou `ES`.
- Inferencia de UF por nome do estado quando o provedor nao retorna a sigla (ex.: `Sao Paulo` -> `SP`).
- Mensagens de retorno configuradas para cenarios dentro do Sudeste, fora do Sudeste, fora do Brasil e falha na consulta.
- Em caso de falha, a interface exibe tambem o motivo tecnico acumulado das tentativas (ex.: erro DNS, HTTP 403, etc.).

## Fluxo de consulta de geolocalizacao

1. Tenta consultar o `ipapi.co`.
2. Se falhar, tenta consultar o `ipwho.is`.
3. Se tambem falhar, consulta o IP em `api.ipify.org` e depois busca a localizacao em `ip-api.com`.
4. Se todos falharem, exibe mensagem amigavel para o usuario com detalhe tecnico para diagnostico.
