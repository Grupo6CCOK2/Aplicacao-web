import test from 'node:test';
import assert from 'node:assert/strict';
import { profissionaisDoServico } from './profissionais.js';
import { funcionariosIniciais } from '../data/funcionarios.js';

test('corte masculino permite escolher outros cabeleireiros mesmo na categoria de barba e combos', () => {
  const servico = { titulo: 'Corte Masculino', categoria: 'Barba & Combos', profissional: 'Fred' };
  assert.deepEqual(profissionaisDoServico(servico, funcionariosIniciais).map(item => item.nome), ['Fred Santos', 'Camila Alves', 'Julia Rocha']);
});

test('barba e combo preservam a exigência da especialidade de barba', () => {
  for (const titulo of ['Barba e Acabamento', 'Combo Corte + Barba']) {
    assert.deepEqual(profissionaisDoServico({ titulo, categoria: 'Barba & Combos', profissional: 'Fred' }, funcionariosIniciais).map(item => item.nome), ['Fred Santos']);
  }
});

test('funcionários inativos ou removidos não aparecem entre as opções', () => {
  const equipe = funcionariosIniciais.filter(item => item.nome !== 'Julia Rocha').map(item => ({ ...item, status: item.nome === 'Fred Santos' ? 'Inativo' : item.status }));
  assert.deepEqual(profissionaisDoServico({ titulo: 'Corte Masculino', categoria: 'Barba & Combos', profissional: 'Fred' }, equipe).map(item => item.nome), ['Camila Alves']);
});

test('serviço de categoria personalizada aceita o responsável ativo cadastrado', () => {
  const servico = { titulo: 'Novo serviço', categoria: 'Nova categoria', profissional: 'Ana Lima' };
  assert.deepEqual(profissionaisDoServico(servico, funcionariosIniciais).map(item => item.nome), ['Ana Lima']);
  assert.deepEqual(profissionaisDoServico(servico, []), []);
});
