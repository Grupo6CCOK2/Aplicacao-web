# Estado do projeto

Documentação inicial criada em 27/11/2026, com base no código atual do HexaDevs.

## Funcionalidades de front-end

| Área | Comportamento atual |
| --- | --- |
| Home | Apresentação, serviços destacados, equipe, mapa, formulário demonstrativo de contato e link para avaliação no Google |
| Catálogo | Serviços compartilhados com a home e o agendamento |
| Cadastro de serviços | Nome, descrição, preço, duração, categoria, profissional, foto e destaque na home; permite editar e pausar |
| Agendamento | Escolha entre profissionais ativos que atendem o serviço, seleção de data e horário, revisão com confirmar/refazer e mensagem de confirmação |
| Horários | Grade de 15 minutos; opções indisponíveis ficam ocultas; conflitos consideram profissional e duração |
| Área do cliente | Início próprio, próximo agendamento, histórico, perfil, dependentes e fidelidade |
| Cancelamento do cliente | Duas etapas; motivo obrigatório quando faltam duas horas ou menos |
| Fidelidade | Conta cortes concluídos e avisa sobre brinde após dez; reservas e cancelamentos não contam |
| Funcionário | Agenda ampliada com detalhes do atendimento e perfil |
| Administração | Visão geral, agenda pessoal do Fred, agendamentos, clientes, funcionários, serviços, bloqueios e financeiro demonstrativo |
| Bloqueios | Dia inteiro ou faixa de horário para todos os profissionais, com revisão das reservas afetadas |
| Funcionários | Formulários de cadastro, edição e remoção no front-end; mudanças de senha são demonstrativas |

## Regras atuais de horários

- Atendimento de terça a sábado, das 9h às 20h, com intervalo das 12h às 13h.
- Antecedência mínima de duas horas para agendar.
- O serviço precisa caber inteiro no expediente e não atravessar o almoço.
- Reservas conflitantes do mesmo profissional e bloqueios do salão impedem novos horários.
- Cancelamentos liberam o horário, desde que as demais regras permitam uma nova reserva.

Essas são as regras implementadas atualmente, não uma confirmação definitiva dos horários comerciais do salão.

## Persistência e limitações

- Apenas o catálogo de serviços é salvo no localStorage, neste navegador.
- Agendamentos, bloqueios, funcionários, perfil e dependentes são mantidos em memória pelo React e reiniciam ao recarregar.
- Não há autenticação real, envio de recuperação de senha ou envio de mensagens pelo formulário de contato.
- Os atalhos de cliente, funcionário e administração estão expostos provisoriamente para conferir as telas.
- O financeiro usa dados demonstrativos e não representa um fechamento real do salão.
- A lista oficial de serviços do Fred ainda precisa ser fornecida; o catálogo inicial é demonstrativo.

## Próximas etapas

1. Receber e cadastrar os serviços oficiais, preços, durações e fotos aprovadas.
2. Planejar a API Java e os dados que cada tela precisa receber ou enviar.
3. Implementar autenticação e permissões reais.
4. Persistir reservas, bloqueios, clientes, dependentes, funcionários e serviços no banco.
5. Revalidar disponibilidade e cancelamentos no servidor, incluindo concorrência entre reservas.
6. Implementar envio real de contato e recuperação de senha.
7. Substituir os dados financeiros demonstrativos e retirar os acessos provisórios quando a autenticação estiver pronta.

Essas etapas ainda não foram executadas. Alterações no projeto Java exigem aviso prévio ao usuário.
