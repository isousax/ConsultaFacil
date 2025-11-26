import { Card } from '../components/ui/Card';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';

export const AboutPage = () => {
  const features = [
    {
      icon: Clock,
      title: 'Acompanhamento Automático',
      description:
        'Não perca mais tempo verificando manualmente. Nosso sistema faz isso por você automaticamente.',
    },
    {
      icon: Zap,
      title: 'Rápido e Eficiente',
      description:
        'Adicione múltiplos códigos de uma vez e receba atualizações em tempo real.',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description:
        'Seus dados são protegidos e apenas você tem acesso aos seus códigos de consulta.',
    },
    {
      icon: CheckCircle,
      title: 'Fácil de Usar',
      description:
        'Interface intuitiva e simples. Comece a usar em menos de 1 minuto.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              CF
            </div>
            <span className="text-xl font-bold text-gray-900">
              ConsultaFácil
            </span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Sobre o ConsultaFácil
            </h1>
            <p className="text-xl text-blue-100">
              A solução definitiva para gerenciar e acompanhar códigos de
              consultas médicas de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              O Problema que Resolvemos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Muitas pessoas enfrentam o desafio de acompanhar o status de
                múltiplas consultas médicas agendadas. Verificar manualmente
                cada código em diferentes sistemas pode ser:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Demorado:</strong> Acessar múltiplos sites e inserir
                  códigos um por um.
                </li>
                <li>
                  <strong>Frustrante:</strong> Não saber quando o status muda
                  sem verificar constantemente.
                </li>
                <li>
                  <strong>Desorganizado:</strong> Perder códigos importantes ou
                  esquecer de verificar.
                </li>
              </ul>
            </div>
          </Card>

          <Card className="mb-12 bg-blue-50">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Nossa Solução
            </h2>
            <p className="text-gray-700">
              O <strong>ConsultaFácil</strong> centraliza todos os seus códigos
              de consulta em um único lugar. Adicione seus códigos e deixe que
              nosso sistema verifique automaticamente o status de cada um,
              notificando você sobre qualquer mudança. Simples, rápido e
              eficiente.
            </p>
          </Card>

          {/* Features Grid */}
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Por que usar o ConsultaFácil?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="mb-4 text-2xl font-bold">
                Pronto para simplificar sua vida?
              </h2>
              <p className="mb-6 text-blue-100">
                Comece a usar o ConsultaFácil gratuitamente hoje mesmo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/signup"
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Criar Conta Grátis
                </a>
                <a
                  href="/login"
                  className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Fazer Login
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} ConsultaFácil. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
};
