# Possiveis erros na identificacao de IP

Este documento lista os principais erros que podem impedir a identificacao de IP e geolocalizacao da aplicacao, tanto em localhost quanto apos o deploy.

## 1) Erros comuns em localhost

| Erro/Sintoma | Causa provavel | Como identificar |
| --- | --- | --- |
| `Failed to fetch` | Falha de rede local, bloqueio por firewall/proxy/antivirus, API indisponivel | Console do navegador mostra erro de rede sem status HTTP |
| `ERR_NAME_NOT_RESOLVED` | DNS nao conseguiu resolver o dominio da API | Console mostra falha de DNS na URL da API |
| `403 Forbidden` | Provedor de geolocalizacao bloqueou a requisicao (rate limit, politica de acesso, IP bloqueado) | Aba Network mostra status 403 |
| Erro de CORS | API externa nao permite chamadas diretas do navegador | Console mostra mensagem sobre `Access-Control-Allow-Origin` |
| `HTTP 429` | Limite de requisicoes excedido no provedor | Aba Network mostra status 429 |
| Localizacao vazia ou incompleta | Provedor respondeu sem cidade/UF ou com campos ausentes | Resposta JSON sem `region_code`, `city` etc. |

## 2) Erros comuns apos deploy (Vercel)

| Erro/Sintoma | Causa provavel | Como identificar |
| --- | --- | --- |
| `Failed to fetch` para API externa | Restricao do provedor, bloqueio regional, falha temporaria da API | Logs do browser e resposta sem status detalhado |
| Falha no endpoint interno `/api/geolocation` | Rota nao publicada, erro na function, caminho incorreto | Network retorna 404/500 para `/api/geolocation` |
| Dados de localizacao incompletos no endpoint interno | Headers de geolocalizacao nao disponiveis no contexto da requisicao | Resposta da API interna com campos vazios |
| Erro por Mixed Content | Pagina em HTTPS tentando chamar API HTTP | Console mostra bloqueio de conteudo misto |
| `403` de provedores fallback | API externa recusou requisicao de ambiente cloud | Network mostra 403 apos deploy |

## 3) Diferencas importantes: localhost x deploy

- Em localhost, problemas de DNS e CORS aparecem com mais frequencia em chamadas diretas no navegador.
- Em deploy, pode haver bloqueio de provedores externos por politica de seguranca ou reputacao de IP do datacenter.
- Em deploy HTTPS, chamadas HTTP sao bloqueadas por Mixed Content.

## 4) Checklist rapido de diagnostico

1. Abrir DevTools e validar as chamadas na aba Network.
2. Confirmar status HTTP de cada provedor (`200`, `403`, `429`, `500`, etc.).
3. Validar se `/api/geolocation` responde corretamente no ambiente publicado.
4. Confirmar se nao existe chamada HTTP em pagina HTTPS.
5. Testar em outra rede (ex.: 4G) para descartar bloqueio local.
6. Verificar se extensoes do navegador estao bloqueando requisicoes.

## 5) Boas praticas para reduzir falhas

- Priorizar endpoint interno no deploy (`/api/geolocation`) em vez de chamadas diretas para APIs externas.
- Manter fallback entre mais de um provedor.
- Exibir motivo tecnico no front para facilitar suporte.
- Evitar dependencia de endpoint HTTP quando o site roda em HTTPS.
- Tratar respostas incompletas com validacao e mensagens amigaveis.
