import { Card } from '../components/ui/Card';
import { Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-600 to-green-700 text-white mb-4 shadow-lg shadow-green-500/25">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Política de Privacidade
        </h1>
        <p className="text-gray-600 text-sm">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Introdução */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-start gap-4">
          <Lock className="h-6 w-6 text-green-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Seu Compromisso com a Privacidade</h3>
            <p className="text-sm text-gray-600">
              No ConsultaFácil, levamos sua privacidade a sério. Esta política explica como coletamos, 
              usamos, protegemos e compartilhamos suas informações pessoais.
            </p>
          </div>
        </div>
      </Card>

      {/* Seções */}
      <div className="space-y-6">
        {/* 1. Informações que Coletamos */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Informações que Coletamos
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Cadastro:</strong> Nome completo, endereço de e-mail, senha criptografada</li>
                <li><strong>Códigos de Consulta:</strong> Códigos numéricos de 8 a 11 dígitos e descrições opcionais</li>
                <li><strong>Comunicações:</strong> Mensagens enviadas através do suporte ou feedback</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de permanência, funcionalidades utilizadas</li>
                <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, sistema operacional, dispositivo</li>
                <li><strong>Cookies:</strong> Armazenamos cookies essenciais para manter sua sessão ativa</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 2. Como Usamos suas Informações */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Como Usamos suas Informações
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>Utilizamos as informações coletadas para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fornecer, operar e manter nossa plataforma</li>
              <li>Processar e gerenciar seu cadastro e autenticação</li>
              <li>Monitorar e atualizar o status dos seus códigos de consulta</li>
              <li>Enviar e-mails de verificação, notificações e atualizações importantes</li>
              <li>Responder suas solicitações de suporte</li>
              <li>Melhorar, personalizar e expandir nossos serviços</li>
              <li>Analisar padrões de uso para otimizar a experiência do usuário</li>
              <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </div>
        </Card>

        {/* 3. Compartilhamento de Informações */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Compartilhamento de Informações
          </h2>
          <div className="space-y-3 text-gray-600">
            <p className="font-medium text-gray-900">
              Nós NÃO vendemos, alugamos ou comercializamos suas informações pessoais.
            </p>
            <p>Podemos compartilhar suas informações apenas nas seguintes situações:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Provedores de Serviço:</strong> Com empresas que nos ajudam a operar a plataforma 
                (hospedagem, banco de dados, e-mail), sempre sob contratos de confidencialidade
              </li>
              <li>
                <strong>Requisitos Legais:</strong> Quando exigido por lei, ordem judicial ou processo legal
              </li>
              <li>
                <strong>Proteção de Direitos:</strong> Para proteger direitos, propriedade ou segurança 
                da Pixelaria, nossos usuários ou o público
              </li>
              <li>
                <strong>Transferência de Negócios:</strong> Em caso de fusão, aquisição ou venda de ativos, 
                com notificação prévia aos usuários
              </li>
            </ul>
          </div>
        </Card>

        {/* 4. Segurança dos Dados */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-600" />
            Segurança dos Dados
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Criptografia:</strong> Senhas são armazenadas com hash bcrypt</li>
              <li><strong>HTTPS:</strong> Toda comunicação é criptografada via SSL/TLS</li>
              <li><strong>Autenticação:</strong> Sistema de tokens JWT com refresh tokens seguros</li>
              <li><strong>Controle de Acesso:</strong> Apenas pessoal autorizado pode acessar dados sensíveis</li>
              <li><strong>Monitoramento:</strong> Logs de segurança e detecção de atividades suspeitas</li>
              <li><strong>Backups:</strong> Backups regulares para prevenção de perda de dados</li>
            </ul>
            <p className="text-amber-700 bg-amber-50 p-3 rounded-lg mt-4">
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              Nenhum método de transmissão pela Internet é 100% seguro. Apesar de nossos esforços, 
              não podemos garantir segurança absoluta.
            </p>
          </div>
        </Card>

        {/* 5. Seus Direitos */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Seus Direitos (LGPD)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Confirmação e Acesso:</strong> Saber se processamos seus dados e solicitar cópias</li>
              <li><strong>Correção:</strong> Atualizar dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização ou Bloqueio:</strong> Solicitar anonimização ou bloqueio de dados desnecessários</li>
              <li><strong>Eliminação:</strong> Solicitar exclusão de dados tratados com seu consentimento</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado e interoperável</li>
              <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              <li><strong>Revogação do Consentimento:</strong> Retirar consentimento a qualquer momento</li>
            </ul>
            <p className="mt-4">
              Para exercer seus direitos, entre em contato através de: <strong>contato@pixelaria.com.br</strong>
            </p>
          </div>
        </Card>

        {/* 6. Retenção de Dados */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Retenção de Dados
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades 
              descritas nesta política, exceto quando:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Um período de retenção mais longo for exigido ou permitido por lei</li>
              <li>For necessário para resolver disputas ou fazer cumprir acordos</li>
            </ul>
            <p className="mt-4">
              Quando seus dados não forem mais necessários, serão eliminados de forma segura ou anonimizados.
            </p>
          </div>
        </Card>

        {/* 7. Cookies */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Uso de Cookies
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cookies Essenciais:</strong> Necessários para autenticação e funcionamento básico</li>
              <li><strong>Cookies de Preferência:</strong> Lembram suas preferências e configurações</li>
              <li><strong>Cookies de Análise:</strong> Ajudam a entender como você usa a plataforma</li>
            </ul>
            <p className="mt-4">
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
            </p>
          </div>
        </Card>

        {/* 8. Menores de Idade */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            Menores de Idade
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Nossos serviços são destinados a usuários com 18 anos ou mais. Não coletamos 
              intencionalmente informações de menores de idade.
            </p>
            <p>
              Se tomarmos conhecimento de que coletamos dados de um menor sem o consentimento parental 
              adequado, tomaremos medidas para excluir essas informações.
            </p>
          </div>
        </Card>

        {/* 9. Alterações na Política */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
              9
            </span>
            Alterações nesta Política
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
              mudanças significativas através de:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>E-mail para o endereço cadastrado</li>
              <li>Aviso destacado na plataforma</li>
              <li>Atualização da data "Última atualização" no topo desta página</li>
            </ul>
            <p>
              Recomendamos revisar esta política periodicamente.
            </p>
          </div>
        </Card>

        {/* 10. Contato */}
        <Card className="bg-linear-to-br from-green-50 to-white border-green-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Dúvidas sobre Privacidade?
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados:
            </p>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="font-medium text-gray-900">Encarregado de Dados (DPO)</p>
              <p>Pixelaria - Tecnologia e Inovação</p>
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
