export const servicosIniciais = [
  {
    id: 1,
    categoria: "Cor & Tratamentos",
    titulo: "Coloração Premium",
    descricao:
      "Transformação completa ou retoque de raiz com produtos de alta performance e diagnóstico de tom.",
    duracao: "120 min",
    preco: "R$ 280",
    profissional: "Ana Lima",
    imagem:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    categoria: "Cortes & Penteados",
    titulo: "Corte Feminino",
    descricao:
      "Corte pensado para o formato do seu rosto e rotina, trazendo leveza, movimento e caimento natural.",
    duracao: "60 min",
    preco: "R$ 120",
    profissional: "Camila Alves",
    imagem:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    categoria: "Barba & Combos",
    titulo: "Corte Masculino",
    descricao:
      "Do corte social clássico ao degradê moderno na tesoura ou máquina, com acabamento detalhado.",
    duracao: "45 min",
    preco: "R$ 80",
    profissional: "Fred",
    imagem:
      "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    categoria: "Cortes & Penteados",
    titulo: "Penteado Social",
    descricao:
      "Coques estruturados, semipresos modernos ou ondas para formaturas, casamentos e eventos.",
    duracao: "90 min",
    preco: "R$ 190",
    profissional: "Camila Alves",
    imagem:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    categoria: "Barba & Combos",
    titulo: "Barba e Acabamento",
    descricao:
      "Alinhamento simétrico com toalha quente, navalha tradicional e hidratação pós-barba.",
    duracao: "30 min",
    preco: "R$ 50",
    profissional: "Fred",
    imagem:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    categoria: "Cor & Tratamentos",
    titulo: "Hidratação & Reconstrução",
    descricao:
      "Reposição profunda de nutrientes, brilho e maciez para fios ressecados ou com química.",
    duracao: "50 min",
    preco: "R$ 110",
    profissional: "Ana Lima",
    imagem:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    categoria: "Cortes & Penteados",
    titulo: "Escova Modelada",
    descricao:
      "Escova lisa alinhada ou com pontas modeladas e volume natural para durar toda a semana.",
    duracao: "45 min",
    preco: "R$ 75",
    profissional: "Camila Alves",
    imagem:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    categoria: "Cor & Tratamentos",
    titulo: "Luzes & Mechas",
    descricao:
      "Iluminação personalizada com transição suave, tonalização e proteção térmica dos fios.",
    duracao: "150 min",
    preco: "R$ 340",
    profissional: "Ana Lima",
    imagem:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    categoria: "Barba & Combos",
    titulo: "Combo Corte + Barba",
    descricao:
      "Atendimento completo reunindo corte masculino personalizado e barba alinhada na toalha quente.",
    duracao: "75 min",
    preco: "R$ 115",
    profissional: "Fred",
    imagem:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  },
].map((item, index) => ({ ...item, destaque: index < 3, ativo: true, cargo: item.profissional === 'Fred' ? 'Cabeleireiro' : 'Cabeleireira', iniciais: item.profissional.split(' ').map(p => p[0]).join('') }));
export const chaveCatalogo = 'fred-catalogo-servicos-v1';
export function carregarServicos() {
  try {
    const dados = JSON.parse(localStorage.getItem(chaveCatalogo));
    if (Array.isArray(dados) && dados.length && dados.every(s => s.id && typeof s.titulo === 'string' && s.profissional && s.duracao && s.preco)) return dados;
  } catch { /* O catálogo inicial também funciona sem armazenamento local. */ }
  return servicosIniciais;
}
