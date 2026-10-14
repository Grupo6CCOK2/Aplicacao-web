# Fred Cabeleireiros — front-end

Implementação React + Vite baseada nas 13 telas e nos tokens do documento de especificação fornecido.

## Navegação

- Páginas públicas: `#inicio`, `#servicos`, `#contato`.
- Cliente: `#entrar`, `#cadastro`, `#recuperar-senha`, `#agendamento`.
- Equipe: `#equipe`, `#agenda`, `#clientes`, `#perfil`.
- Administração: `#painel`, `#funcionarios`, `#novo-funcionario`, `#financeiro`.

O acesso da equipe está no rodapé. Para explorar, preencha os formulários com **dados fictícios**. No acesso da equipe, escolha Funcionário ou Administrador no seletor de demonstração.

## Limites da demonstração

- Não existe backend, autenticação real, JWT ou autorização segura. A sessão simulada fica em `sessionStorage`.
- Agendamentos, clientes e profissionais demonstrativos ficam em `localStorage`. Não use informações pessoais reais.
- Agendamentos checam conflitos locais, duração, expediente de terça a sábado e antecedência mínima de duas horas.
- Atualizações de status, anotações, cancelamento com motivo e horário, edição/inativação de clientes e exportação CSV funcionam localmente.
- Formulários de contato e recuperação de senha não enviam mensagens.
- Credenciais não são armazenadas. “Lembrar de mim” não constitui persistência de autenticação; será conectado ao provedor de autenticação.
- Meus agendamentos, perfil, lista da equipe, ajuda e modais complementam os destinos sem wireframe próprio.
- O painel financeiro é provisório conforme TL13. Valores, percentuais e repasses são ilustrativos; não há pagamentos reais.
- O endereço e telefone são exemplos do briefing. O mapa é ilustrativo e o botão abre uma pesquisa externa; faltam cidade e coordenadas para um mapa real.
- Descrições, durações, nomes adicionais, conteúdos institucionais e serviços complementares são propostas para validação. Termos de uso e política de privacidade continuam pendentes.

## Fontes

Montserrat e Poppins carregam pelo Google Fonts em `src/index.css`. Lubalin Graph e Lucida Condensed não estão no catálogo privado disponível. Os tokens declaram essas famílias com fallback para Georgia e Montserrat, respectivamente, até o fornecimento de arquivos licenciados.

## Fotografia ilustrativa

Fotos Unsplash armazenadas em `public/images`, sem dependência de URLs temporárias:

- Salão: Greg Trowman.
- Coloração: Ionela Mat.
- Corte feminino: Lindsay Cash.
- Corte masculino: Allef Vinicius.
- Retratos: Christian Buehner, Rachel McDermott e Jake Nackos.

As fotografias não representam o salão ou sua equipe reais.

## Verificação

Comandos do projeto: `pnpm build`, `pnpm format`.
Checagem adicional de compatibilidade: `pnpm exec tsc --noEmit`.
O servidor de desenvolvimento é supervisionado pelo ambiente; não é necessário iniciá-lo.
