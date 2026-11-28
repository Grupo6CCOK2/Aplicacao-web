# Entendendo o React neste projeto

## Componentes: as peças da tela

Um componente é uma função que descreve uma parte da interface. O arquivo `.jsx` permite escrever a estrutura visual junto com JavaScript.

O ponto de entrada é `src/main.jsx`: ele coloca o componente `App` dentro da página HTML. O `App` monta a navegação e escolhe qual tela mostrar.

| Local | Responsabilidade |
| --- | --- |
| `src/App.jsx` | Navegação e dados compartilhados entre telas |
| `src/components/` | Telas, formulários, menus e cartões |
| `src/data/` | Dados demonstrativos e informações do salão |
| `src/utils/` | Funções de validação e regras de negócio no front-end |
| `src/hooks/useAgora.js` | Atualização do relógio usado nas regras de horário |
| `src/index.css` | Estilos gerais e cores do site |

## Estado: os dados que fazem a tela mudar

`useState` guarda um valor enquanto o componente está montado. A função de atualização muda esse valor e faz o React atualizar a interface.

Exemplo do projeto:

```jsx
const [servicos, setServicos] = useState(carregarServicos);
```

`servicos` contém o catálogo atual. `setServicos` atualiza esse catálogo. `carregarServicos` busca uma cópia salva no navegador ou usa os dados iniciais.

O catálogo fica no `App`, porque várias telas precisam dele. Já o texto que está sendo digitado no formulário de serviço fica no próprio formulário.

## Props: passando dados e ações

Props são os valores que um componente recebe de outro. O `App` passa o mesmo catálogo para `HomeSections`, `ServicesPage`, `BookingPage` e `AdminDashboard`.

O cadastro de um serviço segue este caminho:

1. O usuário preenche `ServiceManager`.
2. O formulário valida os dados com `src/utils/servicos.js`.
3. A ação recebida por props chama `salvarServicos` no `App`.
4. O `App` salva o catálogo no localStorage e atualiza o estado.
5. As telas que recebem esse catálogo passam a mostrar os novos dados.

Não é necessário editar a home manualmente depois de cadastrar um serviço destacado.

## Agendamento compartilhado

`BookingPage` permite escolher serviço, profissional, data e horário. `src/utils/profissionais.js` encontra funcionários ativos que atendem o serviço, considerando o responsável cadastrado e as especialidades. Ao trocar de profissional, a seleção anterior de data e horário é limpa. `src/utils/agenda.js` verifica duração, expediente, antecedência, almoço, bloqueios e conflitos do profissional escolhido. A lista de horários mostra apenas opções disponíveis.

Depois da revisão e confirmação, a reserva entra no estado de agendamentos do `App`. A área do cliente, a administração e a agenda do profissional consultam esse estado compartilhado. `DailyAgenda` é usado tanto na área do funcionário quanto na agenda pessoal do Fred.

O horário é validado novamente ao confirmar. O cancelamento também é revalidado no momento da confirmação, pois o relógio pode atravessar o limite de duas horas com a janela aberta.

## Navegação atual

A navegação usa o estado `paginaAtual` do `App`, sem biblioteca de rotas. Os atalhos provisórios permitem visualizar áreas internas; não representam controle de acesso real.

## Onde entra o Java depois

Hoje, uma alteração atualiza dados no navegador. Na integração futura, o front-end precisará chamar uma API Java, tratar a resposta e atualizar a tela com os dados retornados pelo servidor.

O Java deverá validar novamente as regras, autenticar o usuário, conferir suas permissões e salvar os dados no banco. Uma validação feita apenas no React não garante a integridade dos dados entre diferentes usuários ou computadores.

Essa integração ainda não foi implementada. Antes de alterar o Java, o usuário deve ser avisado.
