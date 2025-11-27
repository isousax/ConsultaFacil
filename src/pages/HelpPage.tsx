import { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Book, HelpCircle, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { clsx } from 'clsx';

interface FAQItem {
  question: string;
  answer: string;
  category: 'geral' | 'codigos' | 'conta' | 'problemas';
}

const faqData: FAQItem[] = [
  {
    category: 'geral',
    question: 'O que é o ConsultaFácil?',
    answer: 'O ConsultaFácil é uma plataforma que permite gerenciar e acompanhar códigos de consultas médicas de forma simples e organizada. Você pode adicionar códigos, monitorar seu status e receber atualizações automáticas.',
  },
  {
    category: 'geral',
    question: 'Como funciona o sistema?',
    answer: 'Após criar sua conta e fazer login, você pode adicionar códigos de consulta (8 a 11 dígitos). O sistema verifica periodicamente o status desses códigos e mantém você informado sobre qualquer mudança.',
  },
  {
    category: 'codigos',
    question: 'Como adiciono um novo código?',
    answer: 'Na página Dashboard, clique no botão "Adicionar Código". Digite o código (apenas números, de 8 a 11 dígitos), adicione uma descrição opcional e clique em "Adicionar". O código será registrado e começará a ser monitorado.',
  },
  {
    category: 'codigos',
    question: 'Quantos códigos posso cadastrar?',
    answer: 'Não há limite para a quantidade de códigos que você pode cadastrar. Você pode gerenciar todos os seus códigos de consulta em um único lugar.',
  },
  {
    category: 'codigos',
    question: 'O que significam os diferentes status?',
    answer: 'Os códigos podem ter os seguintes status: Pendente (aguardando verificação), Confirmado (consulta confirmada), Erro (problema na verificação), ou Não Encontrado (código não localizado no sistema).',
  },
  {
    category: 'codigos',
    question: 'Com que frequência os códigos são atualizados?',
    answer: 'Os códigos são verificados automaticamente em intervalos regulares. Você também pode forçar uma atualização clicando no botão "Atualizar Tudo" na página Meus Códigos.',
  },
  {
    category: 'codigos',
    question: 'Posso remover um código?',
    answer: 'Sim! Na página "Meus Códigos", passe o mouse sobre o código desejado e clique no botão vermelho com ícone de lixeira. Confirme a ação para remover o código permanentemente.',
  },
  {
    category: 'conta',
    question: 'Como faço para criar uma conta?',
    answer: 'Na página inicial, clique em "Criar conta". Preencha seus dados (nome completo, email e senha forte) e confirme. Você receberá um email de verificação para ativar sua conta.',
  },
  {
    category: 'conta',
    question: 'Não recebi o email de verificação. O que fazer?',
    answer: 'Verifique sua caixa de spam ou lixo eletrônico. Se não encontrar, aguarde alguns minutos e tente fazer login novamente - você verá a opção de reenviar o email de verificação.',
  },
  {
    category: 'conta',
    question: 'Como altero minha senha?',
    answer: 'Acesse o menu lateral e clique em "Alterar Senha". Digite sua senha atual, depois a nova senha duas vezes para confirmação. A senha deve ter no mínimo 8 caracteres.',
  },
  {
    category: 'conta',
    question: 'Esqueci minha senha. Como recuperar?',
    answer: 'Na tela de login, clique em "Esqueci minha senha". Digite seu email cadastrado e você receberá instruções para criar uma nova senha.',
  },
  {
    category: 'problemas',
    question: 'O sistema não está carregando meus códigos. O que fazer?',
    answer: 'Primeiro, verifique sua conexão com a internet. Tente atualizar a página (F5). Se o problema persistir, faça logout e login novamente. Caso continue, entre em contato com o suporte.',
  },
  {
    category: 'problemas',
    question: 'Meu código aparece como "Não Encontrado". Por quê?',
    answer: 'Isso pode acontecer se o código foi digitado incorretamente ou se ainda não foi registrado no sistema de origem. Verifique se os dígitos estão corretos e aguarde algumas horas antes de tentar novamente.',
  },
  {
    category: 'problemas',
    question: 'A atualização automática não está funcionando.',
    answer: 'Utilize o botão "Atualizar Tudo" para forçar uma verificação manual. Se o problema persistir, verifique se há alguma mensagem de erro e entre em contato com o suporte técnico.',
  },
  {
    category: 'problemas',
    question: 'Como entro em contato com o suporte?',
    answer: 'Você pode abrir uma issue no nosso repositório do GitHub (github.com/isousax/ConsultaF-cil) ou enviar um email para suporte@consultafacil.com.br descrevendo detalhadamente seu problema.',
  },
];

const categories = [
  { id: 'todas', label: 'Todas as Categorias', icon: Book },
  { id: 'geral', label: 'Geral', icon: HelpCircle },
  { id: 'codigos', label: 'Códigos', icon: MessageCircle },
  { id: 'conta', label: 'Conta', icon: Mail },
  { id: 'problemas', label: 'Problemas', icon: Search },
];

export const HelpPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQ = faqData.filter((item) => {
    const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">

        
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white mb-4 shadow-lg shadow-blue-500/25">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Central de Ajuda
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Encontre respostas para as perguntas mais frequentes sobre o ConsultaFácil
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar dúvidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQ.length === 0 ? (
          <Card className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma resposta encontrada
            </h3>
            <p className="text-gray-500">
              Tente usar outros termos de busca ou selecione outra categoria.
            </p>
          </Card>
        ) : (
          filteredFAQ.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-100"
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {item.question}
                  </h3>
                  <div
                    className={clsx(
                      'overflow-hidden transition-all duration-300',
                      openItems.has(index) ? 'max-h-96 mt-3' : 'max-h-0'
                    )}
                  >
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
                <button
                  className={clsx(
                    'shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200',
                    openItems.has(index) && 'rotate-180'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(index);
                  }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
        <div className="text-center">
          <MessageCircle className="h-10 w-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Não encontrou o que procurava?
          </h3>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Nossa equipe está pronta para ajudar! Entre em contato através do GitHub ou por email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/isousax/ConsultaF-cil/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
            >
              <Book className="h-4 w-4" />
              Abrir Issue no GitHub
            </a>
            <a
              href="mailto:suporte@pixelaria.com.br"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25"
            >
              <Mail className="h-4 w-4" />
              Enviar Email
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
