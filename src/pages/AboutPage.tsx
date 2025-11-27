import { Card } from '../components/ui/Card';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';

export const AboutPage = () => {
  const features = [
    {
      icon: Clock,
      title: 'Acompanhamento Automático',
      description:
        'Chega de ficar verificando código por código no site da prefeitura. O ConsultaFácil monitora tudo pra você de forma contínua.',
    },
    {
      icon: Zap,
      title: 'Atualizações em Tempo Real',
      description:
        'Adicione quantos códigos quiser e acompanhe todos em um só lugar. Se algo mudar, você fica sabendo na hora.',
    },
    {
      icon: Shield,
      title: 'Privacidade e Segurança',
      description:
        'Todos os códigos são criptografados e armazenados com segurança. Apenas você pode visualizar seus dados.',
    },
    {
      icon: CheckCircle,
      title: 'Simples e Intuitivo',
      description:
        'Criado para pessoas comuns. Não precisa entender de tecnologia — basta fazer login e começar.',
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800 py-12 sm:py-16 text-white rounded-2xl shadow-xl">
        <div className="px-6 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Sobre o ConsultaFácil
            </h1>
            <p className="text-xl text-blue-100">
              O ConsultaFácil nasceu para resolver um problema real: a dificuldade de acompanhar códigos de consulta no site oficial da prefeitura. 
              Criamos uma plataforma que salva seus códigos, monitora automaticamente o status e te avisa quando houver qualquer mudança.
              Simples, rápido e confiável.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="flex flex-col items-start gap-4 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <feature.icon size={26} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Final Section */}
      <Card className="bg-linear-to-br from-blue-50 to-white border-blue-100 shadow-lg">
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Feito para facilitar sua vida
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Acompanhar suas consultas nunca deveria ser difícil. Com o ConsultaFácil, você mantém tudo organizado, automatizado
            e acessível em qualquer lugar. É uma forma mais moderna e inteligente de cuidar da sua saúde.
          </p>
        </div>
      </Card>
    </div>
  );
};
