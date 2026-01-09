# Configuração da API do WhatsApp

Este documento explica como configurar a integração com a API do WhatsApp na página de Mensagens.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL base da API do WhatsApp (ex: Evolution API, Twilio, etc.)
VITE_WHATSAPP_API_URL=http://localhost:8080

# Chave de API ou Token de autenticação
VITE_WHATSAPP_API_KEY=your_api_key_here

# Nome da instância (para Evolution API)
VITE_WHATSAPP_INSTANCE=default

# Token alternativo (se não usar API_KEY)
VITE_WHATSAPP_TOKEN=your_token_here
```

## APIs Suportadas

O serviço foi criado para ser compatível com diferentes APIs do WhatsApp:

### Evolution API
- Endpoint padrão: `http://localhost:8080`
- Autenticação via `Authorization: Bearer {token}`
- Endpoints esperados:
  - `GET /chat/fetchChats/{instanceName}` - Buscar conversas
  - `GET /chat/fetchMessages/{instanceName}/{phoneNumber}` - Buscar mensagens
  - `POST /message/sendText/{instanceName}` - Enviar texto
  - `POST /message/sendMedia/{instanceName}` - Enviar mídia

### Twilio WhatsApp API
- Ajuste os endpoints no arquivo `src/services/whatsappService.ts`
- Use `VITE_WHATSAPP_API_KEY` para o Account SID
- Use `VITE_WHATSAPP_TOKEN` para o Auth Token

### WhatsApp Business API
- Ajuste os endpoints conforme a documentação oficial
- Configure webhooks para receber mensagens em tempo real

## Personalização

Para adaptar a integração para sua API específica, edite o arquivo:
- `src/services/whatsappService.ts` - Ajuste os endpoints e formato de requisição

## Funcionalidades Implementadas

✅ Buscar contatos/conversas do WhatsApp
✅ Buscar mensagens de um número específico
✅ Enviar mensagens de texto
✅ Enviar mensagens com mídia (estrutura pronta)
✅ Verificar status da conexão
✅ Integração automática na página de Mensagens

## Como Funciona

1. Ao carregar a página de Mensagens, o sistema busca automaticamente os contatos do WhatsApp
2. Ao selecionar um cliente do WhatsApp, as mensagens são carregadas automaticamente
3. Ao enviar uma mensagem, ela é enviada pela API e adicionada à interface
4. Clientes do Instagram continuam usando dados mockados (até implementar API do Instagram)

## Troubleshooting

- **Erro ao buscar contatos**: Verifique se a API está rodando e se as credenciais estão corretas
- **Mensagens não aparecem**: Verifique o formato do número de telefone (deve estar sem caracteres especiais)
- **Erro ao enviar**: Verifique se a instância está conectada e autenticada

