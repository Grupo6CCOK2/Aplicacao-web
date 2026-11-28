# Orientações do projeto

## Contexto e escopo

- Este é o front-end React/Vite do Fred Cabeleireiros. A pasta de trabalho do site é `D:\Importante\Programação\HexaDevs`.
- O projeto Java fica em `D:\Importante\Programação\Java`. Avise o usuário antes de alterar qualquer arquivo nessa pasta.
- O foco atual é o front-end. A integração com Java e banco de dados está pendente; não apresente simulações como funcionalidades integradas.
- Explique as alterações em português e de forma simples. O usuário está aprendendo React.

## Organização

- `src/App.jsx` concentra a navegação e os estados compartilhados.
- Use o catálogo compartilhado de serviços; evite listas independentes na home, catálogo e agendamento.
- Use somente os cargos Cabeleireiro e Cabeleireira. A escolha de profissional no agendamento considera os funcionários ativos e suas especialidades.
- Use as funções de `src/utils/agenda.js` para horários, conflitos, cancelamentos e fidelidade.
- Preserve a barra lateral de 240 px no desktop e adapte a disposição para telas menores.
- Preserve a identidade atual: carvão, branco, cinza claro, azul e vermelho escuro.

## Regras já definidas pelo usuário

- Cancelamento pelo cliente tem duas confirmações. Faltando duas horas ou menos, exige motivo preenchido, inclusive na validação final.
- O programa de fidelidade avisa sobre um brinde para retirar após dez cortes concluídos. Não oferece corte grátis automaticamente.
- Bloqueios administrativos de dia ou faixa de horário afetam o salão inteiro e ficam em uma aba própria.
- Horários ocupados devem ficar ocultos na seleção para novos agendamentos. Considere toda a duração do serviço e o profissional envolvido.
- Os atalhos para áreas internas na navegação são provisórios para visualização.

## Verificação e documentação

- Execute verificações proporcionais à mudança. Os comandos disponíveis estão no README.
- Para alterações nas regras de agenda, execute `npm test`. Para código de interface, confira o build e os fluxos afetados.
- Atualize a documentação quando houver mudanças relevantes no funcionamento ou na persistência dos dados.
- Não inclua conversas privadas, áudios, transcrições ou senhas na documentação do repositório.
