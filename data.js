// Base de dados nutricional — 55 alimentos (valores por 100g)
const FOODS = [
  // CEREAIS E GRÃOS
  { id: 1, name: "Arroz branco cozido", category: "Cereais e Grãos", cal: 130, prot: 2.7, carb: 28.1, fat: 0.3, fib: 0.4, sod: 1 },
  { id: 2, name: "Arroz integral cozido", category: "Cereais e Grãos", cal: 123, prot: 2.9, carb: 25.6, fat: 0.9, fib: 1.8, sod: 1 },
  { id: 3, name: "Aveia em flocos", category: "Cereais e Grãos", cal: 394, prot: 13.9, carb: 67.0, fat: 8.5, fib: 9.1, sod: 4 },
  { id: 4, name: "Macarrão cozido", category: "Cereais e Grãos", cal: 131, prot: 4.5, carb: 26.0, fat: 0.9, fib: 1.4, sod: 2 },
  { id: 5, name: "Pão de forma integral", category: "Cereais e Grãos", cal: 247, prot: 9.4, carb: 45.1, fat: 4.2, fib: 5.2, sod: 430 },
  { id: 6, name: "Pão francês", category: "Cereais e Grãos", cal: 300, prot: 8.0, carb: 58.6, fat: 3.1, fib: 2.3, sod: 580 },
  { id: 7, name: "Granola", category: "Cereais e Grãos", cal: 471, prot: 9.2, carb: 64.0, fat: 20.0, fib: 5.3, sod: 24 },
  { id: 8, name: "Cuscuz (milho cozido)", category: "Cereais e Grãos", cal: 120, prot: 2.5, carb: 25.6, fat: 0.5, fib: 1.2, sod: 2 },

  // LEGUMINOSAS
  { id: 9, name: "Feijão carioca cozido", category: "Leguminosas", cal: 76, prot: 4.8, carb: 13.6, fat: 0.5, fib: 8.5, sod: 2 },
  { id: 10, name: "Feijão preto cozido", category: "Leguminosas", cal: 77, prot: 4.5, carb: 14.0, fat: 0.5, fib: 8.7, sod: 1 },
  { id: 11, name: "Feijão fradinho cozido", category: "Leguminosas", cal: 96, prot: 6.2, carb: 17.3, fat: 0.5, fib: 6.3, sod: 5 },
  { id: 12, name: "Lentilha cozida", category: "Leguminosas", cal: 116, prot: 9.0, carb: 20.0, fat: 0.4, fib: 7.9, sod: 2 },
  { id: 13, name: "Grão de bico cozido", category: "Leguminosas", cal: 164, prot: 8.9, carb: 27.4, fat: 2.6, fib: 7.6, sod: 7 },
  { id: 14, name: "Soja cozida", category: "Leguminosas", cal: 173, prot: 16.6, carb: 9.9, fat: 9.0, fib: 6.0, sod: 1 },

  // CARNES E PEIXES
  { id: 15, name: "Frango peito grelhado", category: "Carnes e Peixes", cal: 165, prot: 31.0, carb: 0.0, fat: 3.6, fib: 0.0, sod: 74 },
  { id: 16, name: "Frango coxa assada", category: "Carnes e Peixes", cal: 209, prot: 25.0, carb: 0.0, fat: 12.0, fib: 0.0, sod: 90 },
  { id: 17, name: "Carne bovina patinho cozido", category: "Carnes e Peixes", cal: 219, prot: 30.0, carb: 0.0, fat: 10.9, fib: 0.0, sod: 67 },
  { id: 18, name: "Carne suína lombo cozido", category: "Carnes e Peixes", cal: 242, prot: 27.2, carb: 0.0, fat: 14.4, fib: 0.0, sod: 60 },
  { id: 19, name: "Atum enlatado em água", category: "Carnes e Peixes", cal: 119, prot: 26.0, carb: 0.0, fat: 1.0, fib: 0.0, sod: 396 },
  { id: 20, name: "Salmão grelhado", category: "Carnes e Peixes", cal: 208, prot: 20.4, carb: 0.0, fat: 13.4, fib: 0.0, sod: 59 },
  { id: 21, name: "Tilápia grelhada", category: "Carnes e Peixes", cal: 128, prot: 26.2, carb: 0.0, fat: 2.7, fib: 0.0, sod: 52 },
  { id: 22, name: "Sardinha enlatada", category: "Carnes e Peixes", cal: 191, prot: 22.8, carb: 0.0, fat: 11.0, fib: 0.0, sod: 505 },
  { id: 23, name: "Ovos cozidos", category: "Ovos e Laticínios", cal: 155, prot: 13.0, carb: 1.1, fat: 11.0, fib: 0.0, sod: 124 },

  // LATICÍNIOS
  { id: 24, name: "Leite integral", category: "Ovos e Laticínios", cal: 61, prot: 3.2, carb: 4.8, fat: 3.2, fib: 0.0, sod: 43 },
  { id: 25, name: "Leite desnatado", category: "Ovos e Laticínios", cal: 35, prot: 3.4, carb: 5.0, fat: 0.1, fib: 0.0, sod: 44 },
  { id: 26, name: "Iogurte natural integral", category: "Ovos e Laticínios", cal: 61, prot: 3.5, carb: 4.7, fat: 3.3, fib: 0.0, sod: 46 },
  { id: 27, name: "Iogurte grego", category: "Ovos e Laticínios", cal: 97, prot: 9.0, carb: 3.6, fat: 5.0, fib: 0.0, sod: 36 },
  { id: 28, name: "Queijo minas frescal", category: "Ovos e Laticínios", cal: 264, prot: 17.4, carb: 3.2, fat: 20.2, fib: 0.0, sod: 580 },
  { id: 29, name: "Queijo cottage", category: "Ovos e Laticínios", cal: 98, prot: 11.1, carb: 3.4, fat: 4.3, fib: 0.0, sod: 364 },
  { id: 30, name: "Whey protein (pó)", category: "Ovos e Laticínios", cal: 370, prot: 80.0, carb: 6.0, fat: 3.0, fib: 0.0, sod: 130 },

  // FRUTAS
  { id: 31, name: "Banana nanica", category: "Frutas", cal: 92, prot: 1.4, carb: 23.8, fat: 0.1, fib: 1.9, sod: 1 },
  { id: 32, name: "Maçã fuji", category: "Frutas", cal: 56, prot: 0.3, carb: 14.9, fat: 0.1, fib: 1.3, sod: 1 },
  { id: 33, name: "Laranja pêra", category: "Frutas", cal: 47, prot: 0.9, carb: 11.5, fat: 0.1, fib: 0.8, sod: 1 },
  { id: 34, name: "Manga tommy", category: "Frutas", cal: 64, prot: 0.9, carb: 16.4, fat: 0.3, fib: 1.6, sod: 1 },
  { id: 35, name: "Morango", category: "Frutas", cal: 30, prot: 0.7, carb: 7.1, fat: 0.3, fib: 1.6, sod: 1 },
  { id: 36, name: "Abacate", category: "Frutas", cal: 160, prot: 2.0, carb: 8.5, fat: 14.9, fib: 6.7, sod: 7 },
  { id: 37, name: "Uva itália", category: "Frutas", cal: 67, prot: 0.6, carb: 17.3, fat: 0.4, fib: 0.9, sod: 2 },
  { id: 38, name: "Mamão papaia", category: "Frutas", cal: 40, prot: 0.5, carb: 10.4, fat: 0.1, fib: 1.8, sod: 2 },

  // VEGETAIS
  { id: 39, name: "Batata inglesa cozida", category: "Vegetais", cal: 87, prot: 2.5, carb: 19.1, fat: 0.1, fib: 1.8, sod: 5 },
  { id: 40, name: "Batata doce cozida", category: "Vegetais", cal: 77, prot: 1.5, carb: 18.4, fat: 0.1, fib: 2.2, sod: 27 },
  { id: 41, name: "Brócolis cozido", category: "Vegetais", cal: 35, prot: 3.7, carb: 5.1, fat: 0.4, fib: 3.3, sod: 40 },
  { id: 42, name: "Cenoura cozida", category: "Vegetais", cal: 41, prot: 0.9, carb: 9.6, fat: 0.2, fib: 3.0, sod: 58 },
  { id: 43, name: "Abobrinha refogada", category: "Vegetais", cal: 29, prot: 1.5, carb: 5.3, fat: 0.4, fib: 1.2, sod: 8 },
  { id: 44, name: "Espinafre cozido", category: "Vegetais", cal: 23, prot: 2.9, carb: 3.6, fat: 0.3, fib: 2.4, sod: 70 },
  { id: 45, name: "Tomate", category: "Vegetais", cal: 18, prot: 0.9, carb: 3.9, fat: 0.2, fib: 1.2, sod: 5 },
  { id: 46, name: "Alface", category: "Vegetais", cal: 14, prot: 1.3, carb: 2.1, fat: 0.2, fib: 1.8, sod: 9 },

  // OLEAGINOSAS E GORDURAS
  { id: 47, name: "Amendoim torrado sem sal", category: "Oleaginosas", cal: 581, prot: 24.4, carb: 21.5, fat: 47.4, fib: 8.0, sod: 4 },
  { id: 48, name: "Castanha de caju torrada", category: "Oleaginosas", cal: 570, prot: 18.5, carb: 29.7, fat: 46.3, fib: 3.0, sod: 8 },
  { id: 49, name: "Azeite de oliva", category: "Gorduras", cal: 884, prot: 0.0, carb: 0.0, fat: 100.0, fib: 0.0, sod: 2 },
  { id: 50, name: "Manteiga", category: "Gorduras", cal: 726, prot: 0.9, carb: 0.1, fat: 83.0, fib: 0.0, sod: 576 },

  // OUTROS
  { id: 51, name: "Mel", category: "Outros", cal: 309, prot: 0.4, carb: 84.2, fat: 0.0, fib: 0.2, sod: 4 },
  { id: 52, name: "Tapioca (goma)", category: "Outros", cal: 349, prot: 0.2, carb: 86.4, fat: 0.3, fib: 0.0, sod: 1 },
  { id: 53, name: "Achocolatado em pó", category: "Outros", cal: 378, prot: 6.9, carb: 75.0, fat: 7.5, fib: 2.5, sod: 223 },
  { id: 54, name: "Queijo parmesão ralado", category: "Ovos e Laticínios", cal: 456, prot: 38.5, carb: 3.2, fat: 32.7, fib: 0.0, sod: 1376 },
  { id: 55, name: "Proteína de soja texturizada", category: "Leguminosas", cal: 336, prot: 52.0, carb: 30.0, fat: 1.0, fib: 14.0, sod: 3 }
];
