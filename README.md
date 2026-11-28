# HexaDevs — Fred Cabeleireiros

Site do salão em React e Vite, com áreas de cliente, funcionário e administração.

O projeto está na etapa de front-end demonstrativo. O Java e o banco de dados ainda não estão conectados.

## Como executar

Abra um terminal na pasta `D:\Importante\Programação\HexaDevs`. Com Node.js e npm instalados, execute:

```powershell
npm install
npm run dev
```

Abra o endereço local exibido pelo Vite. Para encerrar, use Ctrl+C no terminal. Se as dependências já estiverem instaladas, basta executar `npm run dev`.

## Comandos disponíveis

| Comando | Para que serve |
| --- | --- |
| `npm run dev` | Abrir o servidor de desenvolvimento |
| `npm run build` | Gerar a versão de produção em `dist` |
| `npm run preview` | Conferir localmente a versão gerada pelo build |
| `npm run lint` | Verificar o código com Oxlint |
| `npm test` | Executar os testes das regras de agenda |

## O que fica salvo

O catálogo de serviços é salvo no navegador, usando a chave `fred-catalogo-servicos-v1` do localStorage. Limpar os dados do site remove esse catálogo local. Outro navegador ou computador não recebe as alterações.

Agendamentos, bloqueios, funcionários, perfil e dependentes ficam no estado do React e são reiniciados ao recarregar a página. O login e a recuperação de senha são simulações. O formulário de contato não envia mensagens.

## Documentação

- [Entendendo o React e a estrutura do projeto](docs/ARQUITETURA.md)
- [Funcionalidades atuais e pendências](docs/ESTADO-DO-PROJETO.md)
- [Orientações para assistentes de código](AGENTS.md)
