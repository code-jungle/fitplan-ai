import { User, DietPlan, TrainingPlan, GeneratedPlan, DietMeal, TrainingWorkout, TrainingExercise } from '../types';

// Dados mock para geração de planos
const MOCK_FOODS = {
  proteinas: [
    'Frango grelhado', 'Peixe assado', 'Ovos', 'Tofu', 'Grão-de-bico', 'Lentilhas',
    'Quinoa', 'Aveia', 'Iogurte grego', 'Queijo cottage', 'Atum', 'Salmão'
  ],
  carboidratos: [
    'Arroz integral', 'Batata doce', 'Pão integral', 'Massa integral', 'Feijão',
    'Frutas', 'Vegetais', 'Milho', 'Ervilhas', 'Cenoura', 'Beterraba'
  ],
  gorduras: [
    'Abacate', 'Oleaginosas', 'Azeite de oliva', 'Sementes de chia', 'Sementes de linhaça',
    'Coco', 'Chocolate amargo', 'Peixes gordurosos', 'Iogurte integral'
  ]
};

const MOCK_EXERCISES = {
  forca: [
    { nome: 'Agachamento', categoria: 'pernas', equipamento: 'peso corporal' },
    { nome: 'Flexões', categoria: 'peito/tríceps', equipamento: 'peso corporal' },
    { nome: 'Prancha', categoria: 'core', equipamento: 'peso corporal' },
    { nome: 'Burpee', categoria: 'cardio/força', equipamento: 'peso corporal' },
    { nome: 'Mountain Climber', categoria: 'core', equipamento: 'peso corporal' }
  ],
  cardio: [
    { nome: 'Corrida', categoria: 'cardio', equipamento: 'esteira/corrida' },
    { nome: 'Bicicleta', categoria: 'cardio', equipamento: 'bicicleta' },
    { nome: 'Polichinelo', categoria: 'cardio', equipamento: 'peso corporal' },
    { nome: 'Corda', categoria: 'cardio', equipamento: 'corda' },
    { nome: 'Subida de escada', categoria: 'cardio', equipamento: 'escada' }
  ],
  flexibilidade: [
    { nome: 'Alongamento de pernas', categoria: 'flexibilidade', equipamento: 'peso corporal' },
    { nome: 'Yoga básico', categoria: 'flexibilidade', equipamento: 'tapete' },
    { nome: 'Alongamento de braços', categoria: 'flexibilidade', equipamento: 'peso corporal' },
    { nome: 'Alongamento de costas', categoria: 'flexibilidade', equipamento: 'peso corporal' }
  ]
};

export class PlanGenerator {
  /**
   * Gera um plano completo baseado no perfil do usuário
   */
  static generateCompletePlan(user: User): GeneratedPlan {
    const objetivo = this.translateObjective(user.objetivo);
    const dataGeracao = new Date().toISOString();
    const validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dias
    const proximaAvaliacao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dias

    const planoDieta = this.generateDietPlan(user);
    const planoTreino = this.generateTrainingPlan(user);

    const recomendacoes = this.generateRecommendations(user, planoDieta, planoTreino);

    return {
      id: `plan-${Date.now()}`,
      tipo: 'completo',
      objetivo,
      dataGeracao,
      validade,
      planoDieta,
      planoTreino,
      recomendacoes,
      proximaAvaliacao
    };
  }

  /**
   * Gera plano de dieta baseado no objetivo e perfil do usuário
   */
  private static generateDietPlan(user: User): DietPlan {
    const { caloriasDiarias, refeicoes } = this.calculateDailyNutrition(user);
    
    return {
      id: `diet-${Date.now()}`,
      nome: `Plano de Dieta - ${this.translateObjective(user.objetivo)}`,
      objetivo: this.translateObjective(user.objetivo),
      caloriasDiarias,
      refeicoes,
      hidratacao: {
        agua: this.calculateWaterIntake(user.peso, user.nivelAtividade),
        outros: ['Chá verde', 'Água de coco', 'Suco natural']
      },
      suplementos: this.getSupplements(user.objetivo),
      observacoes: this.getDietObservations(user),
      duracao: 30,
      dificuldade: this.getDifficultyLevel(user.nivelAtividade)
    };
  }

  /**
   * Gera plano de treino baseado no objetivo e perfil do usuário
   */
  private static generateTrainingPlan(user: User): TrainingPlan {
    const { treinos, frequencia } = this.calculateTrainingSchedule(user);
    
    return {
      id: `training-${Date.now()}`,
      nome: `Plano de Treino - ${this.translateObjective(user.objetivo)}`,
      objetivo: this.translateObjective(user.objetivo),
      duracao: 12, // 12 semanas
      frequencia,
      treinos,
      descanso: {
        dias: this.getRestDays(frequencia),
        recomendacoes: this.getRestRecommendations(user.objetivo)
      },
      progressao: {
        tipo: 'linear',
        incremento: 2.5, // kg para exercícios de força
        frequencia: 2 // a cada 2 semanas
      },
      dificuldade: this.getDifficultyLevel(user.nivelAtividade)
    };
  }

  /**
   * Calcula necessidades nutricionais diárias
   */
  private static calculateDailyNutrition(user: User): { caloriasDiarias: number; refeicoes: DietMeal[] } {
    // Cálculo básico de TMB (Taxa Metabólica Basal)
    let tmb: number;
    if (user.sexo === 'masculino') {
      tmb = 88.362 + (13.397 * user.peso) + (4.799 * user.altura) - (5.677 * user.idade);
    } else {
      tmb = 447.593 + (9.247 * user.peso) + (3.098 * user.altura) - (4.330 * user.idade);
    }

    // Fator de atividade
    const activityFactors = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito-ativo': 1.9
    };

    let caloriasDiarias = tmb * activityFactors[user.nivelAtividade];

    // Ajuste baseado no objetivo
    switch (user.objetivo) {
      case 'perder-peso':
        caloriasDiarias *= 0.85; // Déficit de 15%
        break;
      case 'ganhar-massa':
        caloriasDiarias *= 1.15; // Superávit de 15%
        break;
      case 'manter-peso':
      default:
        // Manter calorias calculadas
        break;
    }

    // Distribuição de macronutrientes
    const proteinas = (caloriasDiarias * 0.25) / 4; // 25% das calorias
    const carboidratos = (caloriasDiarias * 0.55) / 4; // 55% das calorias
    const gorduras = (caloriasDiarias * 0.20) / 9; // 20% das calorias

    // Gerar refeições
    const refeicoes = this.generateMeals(caloriasDiarias, proteinas, carboidratos, gorduras, user);

    return {
      caloriasDiarias: Math.round(caloriasDiarias),
      refeicoes
    };
  }

  /**
   * Gera refeições baseadas nas necessidades nutricionais
   */
  private static generateMeals(
    caloriasDiarias: number,
    proteinas: number,
    carboidratos: number,
    gorduras: number,
    user: User
  ): DietMeal[] {
    const refeicoes: DietMeal[] = [];
    const mealDistribution = [
      { nome: 'Café da Manhã', categoria: 'cafe', porcentagem: 0.25, horario: '08:00' },
      { nome: 'Lanche da Manhã', categoria: 'lanche', porcentagem: 0.15, horario: '10:30' },
      { nome: 'Almoço', categoria: 'almoco', porcentagem: 0.30, horario: '12:30' },
      { nome: 'Lanche da Tarde', categoria: 'lanche', porcentagem: 0.15, horario: '16:00' },
      { nome: 'Jantar', categoria: 'jantar', porcentagem: 0.15, horario: '19:30' }
    ];

    mealDistribution.forEach((meal, index) => {
      const calorias = Math.round(caloriasDiarias * meal.porcentagem);
      const proteinas = Math.round((calorias * 0.25) / 4);
      const carboidratos = Math.round((calorias * 0.55) / 4);
      const gorduras = Math.round((calorias * 0.20) / 9);

      const alimentos = this.selectFoods(proteinas, carboidratos, gorduras, user.restricoesAlimentares);
      
      refeicoes.push({
        id: `meal-${index + 1}`,
        nome: meal.nome,
        horario: meal.horario,
        categoria: meal.categoria as any,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        alimentos,
        preparo: this.generatePreparationMethod(meal.categoria),
        tempoPreparo: this.estimatePreparationTime(meal.categoria)
      });
    });

    return refeicoes;
  }

  /**
   * Seleciona alimentos baseados nas necessidades nutricionais
   */
  private static selectFoods(
    proteinas: number,
    carboidratos: number,
    gorduras: number,
    restricoes: string[]
  ): string[] {
    const alimentos: string[] = [];
    
    // Selecionar fontes de proteína
    const proteinFoods = MOCK_FOODS.proteinas.filter(food => 
      !restricoes.some(restricao => 
        food.toLowerCase().includes(restricao.toLowerCase())
      )
    );
    if (proteinFoods.length > 0) {
      alimentos.push(proteinFoods[Math.floor(Math.random() * proteinFoods.length)]);
    }

    // Selecionar fontes de carboidrato
    const carbFoods = MOCK_FOODS.carboidratos.filter(food => 
      !restricoes.some(restricao => 
        food.toLowerCase().includes(restricao.toLowerCase())
      )
    );
    if (carbFoods.length > 0) {
      alimentos.push(carbFoods[Math.floor(Math.random() * carbFoods.length)]);
    }

    // Selecionar fontes de gordura
    const fatFoods = MOCK_FOODS.gorduras.filter(food => 
      !restricoes.some(restricao => 
        food.toLowerCase().includes(restricao.toLowerCase())
      )
    );
    if (fatFoods.length > 0) {
      alimentos.push(fatFoods[Math.floor(Math.random() * fatFoods.length)]);
    }

    return alimentos;
  }

  /**
   * Calcula cronograma de treinos
   */
  private static calculateTrainingSchedule(user: User): { treinos: TrainingWorkout[]; frequencia: number } {
    let frequencia: number;
    let treinos: TrainingWorkout[] = [];

    // Determinar frequência baseada no objetivo e nível de atividade
    switch (user.objetivo) {
      case 'perder-peso':
        frequencia = user.nivelAtividade === 'sedentario' ? 3 : 4;
        break;
      case 'ganhar-massa':
        frequencia = user.nivelAtividade === 'sedentario' ? 3 : 5;
        break;
      case 'ganhar-forca':
        frequencia = 4;
        break;
      default:
        frequencia = 3;
    }

    // Gerar treinos para a semana
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const categorias = ['forca', 'cardio', 'flexibilidade'];
    
    for (let i = 0; i < frequencia; i++) {
      const categoria = categorias[i % categorias.length];
      const exercicios = this.generateExercises(categoria, user.objetivo);
      
      treinos.push({
        id: `workout-${i + 1}`,
        nome: `Treino ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        dia: diasSemana[i],
        categoria: categoria as any,
        exercicios,
        duracaoTotal: this.calculateWorkoutDuration(exercicios),
        caloriasEstimadas: this.calculateWorkoutCalories(exercicios, user.peso),
        equipamentos: this.getRequiredEquipment(exercicios),
        aquecimento: ['Alongamento dinâmico', 'Movimentos articulares', 'Cardio leve'],
        alongamento: ['Alongamento estático', 'Respiração profunda', 'Relaxamento muscular']
      });
    }

    return { treinos, frequencia };
  }

  /**
   * Gera exercícios para uma categoria específica
   */
  private static generateExercises(categoria: string, objetivo: string): TrainingExercise[] {
    const exercises = MOCK_EXERCISES[categoria as keyof typeof MOCK_EXERCISES] || [];
    const selectedExercises: TrainingExercise[] = [];

    exercises.forEach((exercise, index) => {
      if (index < 4) { // Máximo 4 exercícios por treino
        selectedExercises.push({
          id: `exercise-${categoria}-${index + 1}`,
          nome: exercise.nome,
          series: this.getSeriesForObjective(objetivo),
          repeticoes: this.getRepetitionsForObjective(objetivo),
          peso: this.getWeightForObjective(objetivo),
          duracao: categoria === 'cardio' ? 300 : undefined, // 5 minutos para cardio
          descanso: this.getRestTimeForObjective(objetivo),
          tecnica: this.getTechniqueForExercise(exercise.nome),
          variacoes: this.getVariationsForExercise(exercise.nome),
          observacoes: this.getObservationsForExercise(exercise.nome)
        });
      }
    });

    return selectedExercises;
  }

  /**
   * Utilitários auxiliares
   */
  private static translateObjective(objetivo: string): string {
    const translations: Record<string, string> = {
      'perder-peso': 'Perda de Peso',
      'ganhar-massa': 'Ganho de Massa Muscular',
      'manter-peso': 'Manutenção de Peso',
      'melhorar-saude': 'Melhoria da Saúde',
      'ganhar-forca': 'Ganho de Força'
    };
    return translations[objetivo] || objetivo;
  }

  private static calculateWaterIntake(peso: number, nivelAtividade: string): number {
    const baseWater = peso * 0.035; // 35ml por kg
    const activityMultiplier = {
      'sedentario': 1.0,
      'leve': 1.1,
      'moderado': 1.2,
      'ativo': 1.3,
      'muito-ativo': 1.4
    };
    return Math.round(baseWater * activityMultiplier[nivelAtividade as keyof typeof activityMultiplier]);
  }

  private static getSupplements(objetivo: string): string[] {
    const supplements: Record<string, string[]> = {
      'perder-peso': ['Multivitamínico', 'Ômega-3'],
      'ganhar-massa': ['Whey Protein', 'Creatina', 'Multivitamínico'],
      'ganhar-forca': ['Creatina', 'Multivitamínico', 'Ômega-3'],
      'manter-peso': ['Multivitamínico'],
      'melhorar-saude': ['Multivitamínico', 'Ômega-3', 'Vitamina D']
    };
    return supplements[objetivo] || ['Multivitamínico'];
  }

  private static getDietObservations(user: User): string[] {
    const observations: string[] = [];
    
    if (user.restricoesAlimentares.length > 0) {
      observations.push(`Respeitar restrições: ${user.restricoesAlimentares.join(', ')}`);
    }
    
    if (user.preferencias.includes('dieta-vegetariana')) {
      observations.push('Focar em fontes vegetais de proteína');
    }
    
    observations.push('Beber água regularmente ao longo do dia');
    observations.push('Mastigue bem os alimentos');
    observations.push('Evitar refeições muito próximas ao sono');
    
    return observations;
  }

  private static getDifficultyLevel(nivelAtividade: string): 'iniciante' | 'intermediario' | 'avancado' {
    const levels: Record<string, 'iniciante' | 'intermediario' | 'avancado'> = {
      'sedentario': 'iniciante',
      'leve': 'iniciante',
      'moderado': 'intermediario',
      'ativo': 'intermediario',
      'muito-ativo': 'avancado'
    };
    return levels[nivelAtividade] || 'iniciante';
  }

  private static getRestDays(frequencia: number): number[] {
    const restDays: number[] = [];
    for (let i = 0; i < 7; i++) {
      if (i >= frequencia) {
        restDays.push(i);
      }
    }
    return restDays;
  }

  private static getRestRecommendations(objetivo: string): string[] {
    const recommendations: Record<string, string[]> = {
      'perder-peso': ['Mantenha-se ativo nos dias de descanso', 'Faça alongamentos leves'],
      'ganhar-massa': ['Descanso é fundamental para crescimento muscular', 'Evite atividades intensas'],
      'ganhar-forca': ['Recuperação muscular é essencial', 'Faça alongamentos passivos'],
      'manter-peso': ['Mantenha-se ativo com atividades leves', 'Faça caminhadas'],
      'melhorar-saude': ['Atividades leves são bem-vindas', 'Pratique meditação ou yoga']
    };
    return recommendations[objetivo] || ['Mantenha-se ativo com atividades leves'];
  }

  private static generatePreparationMethod(categoria: string): string {
    const methods: Record<string, string> = {
      'cafe': 'Preparo rápido e nutritivo para começar o dia',
      'lanche': 'Opção prática e saudável para os intervalos',
      'almoco': 'Refeição principal com equilíbrio nutricional',
      'jantar': 'Refeição leve e nutritiva para o final do dia',
      'ceia': 'Opção leve antes do sono'
    };
    return methods[categoria] || 'Preparo saudável e equilibrado';
  }

  private static estimatePreparationTime(categoria: string): number {
    const times: Record<string, number> = {
      'cafe': 15,
      'lanche': 10,
      'almoco': 30,
      'jantar': 25,
      'ceia': 10
    };
    return times[categoria] || 20;
  }

  private static getSeriesForObjective(objetivo: string): number {
    const series: Record<string, number> = {
      'perder-peso': 3,
      'ganhar-massa': 4,
      'ganhar-forca': 5,
      'manter-peso': 3,
      'melhorar-saude': 2
    };
    return series[objetivo] || 3;
  }

  private static getRepetitionsForObjective(objetivo: string): number {
    const reps: Record<string, number> = {
      'perder-peso': 15,
      'ganhar-massa': 8,
      'ganhar-forca': 5,
      'manter-peso': 12,
      'melhorar-saude': 10
    };
    return reps[objetivo] || 10;
  }

  private static getWeightForObjective(objetivo: string): number | undefined {
    if (objetivo === 'ganhar-massa' || objetivo === 'ganhar-forca') {
      return 20; // Peso inicial sugerido
    }
    return undefined; // Peso corporal para outros objetivos
  }

  private static getRestTimeForObjective(objetivo: string): number {
    const rest: Record<string, number> = {
      'perder-peso': 30,
      'ganhar-massa': 90,
      'ganhar-forca': 120,
      'manter-peso': 60,
      'melhorar-saude': 45
    };
    return rest[objetivo] || 60;
  }

  private static getTechniqueForExercise(nome: string): string {
    const techniques: Record<string, string> = {
      'Agachamento': 'Pés na largura dos ombros, joelhos alinhados com os pés',
      'Flexões': 'Corpo em linha reta, cotovelos próximos ao corpo',
      'Prancha': 'Corpo rígido, respiração controlada',
      'Burpee': 'Movimento fluido e controlado',
      'Mountain Climber': 'Mantenha o core ativo'
    };
    return techniques[nome] || 'Execute com técnica correta e controle';
  }

  private static getVariationsForExercise(nome: string): string[] {
    const variations: Record<string, string[]> = {
      'Agachamento': ['Agachamento com salto', 'Agachamento sumo', 'Agachamento búlgaro'],
      'Flexões': ['Flexões inclinadas', 'Flexões declinadas', 'Flexões diamante'],
      'Prancha': ['Prancha lateral', 'Prancha com elevação de perna', 'Prancha com movimento']
    };
    return variations[nome] || [];
  }

  private static getObservationsForExercise(nome: string): string[] {
    const observations: Record<string, string[]> = {
      'Agachamento': ['Mantenha o peito erguido', 'Joelhos não ultrapassem os pés'],
      'Flexões': ['Mantenha o corpo reto', 'Desça até quase tocar o chão'],
      'Prancha': ['Respire normalmente', 'Mantenha o abdômen contraído']
    };
    return observations[nome] || ['Mantenha a postura correta', 'Respire de forma controlada'];
  }

  private static calculateWorkoutDuration(exercicios: TrainingExercise[]): number {
    let totalTime = 0;
    exercicios.forEach(exercise => {
      if (exercise.duracao) {
        totalTime += exercise.duracao * exercise.series;
      } else {
        totalTime += 30 * exercise.series; // Estimativa para exercícios de força
      }
      totalTime += exercise.descanso * (exercise.series - 1);
    });
    return totalTime + 600; // +10 minutos para aquecimento e alongamento
  }

  private static calculateWorkoutCalories(exercicios: TrainingExercise[], peso: number): number {
    const baseCalories = peso * 0.1; // 0.1 cal por kg por minuto
    const totalDuration = this.calculateWorkoutDuration(exercicios);
    return Math.round(baseCalories * (totalDuration / 60));
  }

  private static getRequiredEquipment(exercicios: TrainingExercise[]): string[] {
    const equipment = new Set<string>();
    exercicios.forEach(exercise => {
      if (exercise.nome.includes('Peso')) {
        equipment.add('Halteres');
      }
      if (exercise.nome.includes('Corda')) {
        equipment.add('Corda de pular');
      }
    });
    return Array.from(equipment);
  }

  /**
   * Gera recomendações personalizadas
   */
  private static generateRecommendations(
    user: User,
    planoDieta: DietPlan,
    planoTreino: TrainingPlan
  ): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas no objetivo
    switch (user.objetivo) {
      case 'perder-peso':
        recommendations.push('Mantenha um déficit calórico consistente');
        recommendations.push('Combine cardio e treinamento de força');
        recommendations.push('Monitore seu progresso semanalmente');
        break;
      case 'ganhar-massa':
        recommendations.push('Consuma proteínas em todas as refeições');
        recommendations.push('Progredir gradualmente nos pesos');
        recommendations.push('Descanse adequadamente entre os treinos');
        break;
      case 'ganhar-forca':
        recommendations.push('Foque na técnica antes de aumentar peso');
        recommendations.push('Mantenha um diário de treinos');
        recommendations.push('Inclua exercícios compostos');
        break;
    }

    // Recomendações gerais
    recommendations.push('Mantenha-se hidratado durante todo o dia');
    recommendations.push('Durma 7-9 horas por noite');
    recommendations.push('Faça ajustes no plano conforme necessário');

    return recommendations;
  }
}
