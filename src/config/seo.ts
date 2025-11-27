export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  home: {
    title: 'Início',
    description: 'Sistema completo para gerenciamento e acompanhamento de consultas médicas. Controle suas autorizações, procedimentos e códigos de forma organizada e eficiente.',
    keywords: [
      'consultas médicas',
      'gerenciamento de saúde',
      'autorização médica',
      'sistema de consultas',
      'controle de procedimentos',
      'agendamento médico',
      'saúde digital',
    ],
  },
  login: {
    title: 'Login',
    description: 'Acesse sua conta ConsultaFácil e gerencie suas consultas médicas de forma segura e prática.',
    keywords: [
      'login consultafacil',
      'acesso sistema médico',
      'entrar',
      'autenticação',
    ],
  },
  signup: {
    title: 'Criar Conta',
    description: 'Crie sua conta grátis no ConsultaFácil e comece a organizar suas consultas médicas hoje mesmo. Cadastro rápido e seguro.',
    keywords: [
      'criar conta',
      'cadastro',
      'registro',
      'nova conta',
      'cadastro médico',
      'registro grátis',
    ],
  },
  dashboard: {
    title: 'Painel de Controle',
    description: 'Visualize todas as suas consultas e autorizações médicas em um só lugar. Estatísticas completas e acesso rápido aos seus códigos.',
    keywords: [
      'painel médico',
      'dashboard',
      'estatísticas de consultas',
      'visão geral',
      'resumo médico',
    ],
  },
  codes: {
    title: 'Meus Códigos',
    description: 'Gerencie todos os seus códigos de autorização e procedimentos médicos. Filtre por status, pesquise e exporte relatórios em PDF.',
    keywords: [
      'códigos médicos',
      'autorizações',
      'procedimentos',
      'lista de consultas',
      'códigos de autorização',
      'gerenciar códigos',
    ],
  },
  profile: {
    title: 'Meu Perfil',
    description: 'Atualize seus dados pessoais e preferências da conta. Mantenha suas informações sempre atualizadas.',
    keywords: [
      'perfil',
      'dados pessoais',
      'configurações de conta',
      'editar perfil',
    ],
  },
  terms: {
    title: 'Termos de Uso',
    description: 'Termos de uso e condições de serviço do ConsultaFácil. Leia atentamente antes de utilizar nossos serviços.',
    keywords: [
      'termos de uso',
      'condições de serviço',
      'política de termos',
      'acordo de usuário',
    ],
  },
  privacy: {
    title: 'Política de Privacidade',
    description: 'Política de privacidade do ConsultaFácil. Saiba como protegemos e tratamos seus dados pessoais e de saúde.',
    keywords: [
      'política de privacidade',
      'proteção de dados',
      'LGPD',
      'privacidade',
      'segurança de dados',
    ],
  },
  notFound: {
    title: 'Página Não Encontrada',
    description: 'A página que você procura não existe ou foi removida.',
    keywords: ['erro 404', 'página não encontrada'],
  },
};
