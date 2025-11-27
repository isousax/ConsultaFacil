import { Card } from '../components/ui/Card';
import { FileText, Shield, AlertCircle, Info } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white mb-4 shadow-lg shadow-blue-500/25">
          <FileText className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Termos de Uso
        </h1>
        <p className="text-gray-600 text-sm">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Introdução */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Bem-vindo ao ConsultaFácil</h3>
            <p className="text-sm text-gray-600">
              Ao utilizar nossa plataforma, você concorda com os termos descritos abaixo. 
              Por favor, leia atentamente antes de prosseguir.
            </p>
          </div>
        </div>
      </Card>

      {/* Seções */}
      <div className="space-y-6">
        {/* 1. Aceitação dos Termos */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              1
            </span>
            Aceitação dos Termos
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Ao acessar e usar o ConsultaFácil, você aceita e concorda em cumprir estes Termos de Uso 
              e todas as leis e regulamentos aplicáveis.
            </p>
            <p>
              Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
            </p>
          </div>
        </Card>

        {/* 2. Uso da Plataforma */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              2
            </span>
            Uso da Plataforma
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>Você concorda em utilizar o ConsultaFácil apenas para fins legítimos e de acordo com:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Todas as leis e regulamentações locais, estaduais e nacionais aplicáveis</li>
              <li>Estes Termos de Uso e quaisquer políticas adicionais</li>
              <li>Diretrizes éticas e de boa conduta</li>
            </ul>
            <p className="font-medium text-gray-900 mt-4">Você NÃO pode:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Usar a plataforma para qualquer propósito ilegal ou não autorizado</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Interferir ou interromper o funcionamento da plataforma</li>
              <li>Transmitir vírus, malware ou código malicioso</li>
              <li>Coletar informações de outros usuários sem autorização</li>
            </ul>
          </div>
        </Card>

        {/* 3. Cadastro e Conta */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              3
            </span>
            Cadastro e Conta de Usuário
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Para utilizar determinadas funcionalidades, você precisará criar uma conta fornecendo 
              informações precisas e completas.
            </p>
            <p className="font-medium text-gray-900">Responsabilidades do usuário:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Aceitar responsabilidade por todas as atividades em sua conta</li>
              <li>Fornecer informações verdadeiras e atualizadas</li>
            </ul>
            <p className="text-amber-700 bg-amber-50 p-3 rounded-lg mt-4">
              <AlertCircle className="inline h-4 w-4 mr-2" />
              Você deve ter pelo menos 18 anos de idade para criar uma conta.
            </p>
          </div>
        </Card>

        {/* 4. Códigos de Consulta */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              4
            </span>
            Gerenciamento de Códigos
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              O ConsultaFácil permite que você cadastre e monitore códigos de consultas médicas. 
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Garantir que os códigos cadastrados sejam legítimos e de sua propriedade</li>
              <li>Verificar a precisão dos códigos inseridos</li>
              <li>Manter a privacidade de seus códigos de consulta</li>
              <li>Não compartilhar códigos de terceiros sem autorização</li>
            </ul>
          </div>
        </Card>

        {/* 5. Propriedade Intelectual */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              5
            </span>
            Propriedade Intelectual
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Todo o conteúdo do ConsultaFácil, incluindo texto, gráficos, logotipos, ícones, imagens, 
              clipes de áudio, downloads digitais e compilações de dados, é propriedade da Pixelaria 
              ou de seus fornecedores de conteúdo.
            </p>
            <p>
              É proibida a reprodução, distribuição ou modificação de qualquer parte do site sem 
              autorização expressa por escrito.
            </p>
          </div>
        </Card>

        {/* 6. Limitação de Responsabilidade */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              6
            </span>
            Limitação de Responsabilidade
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              O ConsultaFácil é fornecido "como está" e "conforme disponível", sem garantias de 
              qualquer tipo, expressas ou implícitas.
            </p>
            <p className="font-medium text-gray-900">Não nos responsabilizamos por:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Erros ou imprecisões nas informações de códigos fornecidas por sistemas de terceiros</li>
              <li>Interrupções ou indisponibilidade temporária do serviço</li>
              <li>Perda de dados devido a falhas técnicas</li>
              <li>Danos diretos ou indiretos resultantes do uso da plataforma</li>
            </ul>
          </div>
        </Card>

        {/* 7. Modificações */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              7
            </span>
            Modificações dos Termos
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações 
              significativas serão notificadas por e-mail ou através de um aviso destacado na plataforma.
            </p>
            <p>
              O uso continuado do serviço após as modificações constitui aceitação dos novos termos.
            </p>
          </div>
        </Card>

        {/* 8. Rescisão */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              8
            </span>
            Rescisão de Conta
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por qualquer 
              motivo, incluindo, sem limitação, se você violar estes Termos de Uso.
            </p>
            <p>
              Você pode encerrar sua conta a qualquer momento através das configurações da plataforma 
              ou entrando em contato com nosso suporte.
            </p>
          </div>
        </Card>

        {/* 9. Lei Aplicável */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              9
            </span>
            Lei Aplicável
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as leis da República 
              Federativa do Brasil, sem considerar conflitos de disposições legais.
            </p>
          </div>
        </Card>

        {/* 10. Contato */}
        <Card className="bg-linear-to-br from-blue-50 to-white border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Dúvidas sobre os Termos?
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="font-medium text-gray-900">Pixelaria - Tecnologia e Inovação</p>
              <p>Email: contato@pixelaria.com.br</p>
              <p>Telefone: (81) 99272-0219</p>
              <p>Horário: Segunda a Sexta, 9h às 18h</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
