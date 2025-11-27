import { Heart } from 'lucide-react';
import FooterSignature from '../../pixelaria/FooterSignature';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Conteúdo principal do footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Coluna 1 - Sobre */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">ConsultaFácil</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Facilitando seu acesso à saúde com agendamentos rápidos e eficientes.
            </p>
          </div>

          {/* Coluna 2 - Links rápidos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/dashboard/about" className="hover:text-gray-900 transition-colors">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="/dashboard/privacy" className="hover:text-gray-900 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/dashboard/terms" className="hover:text-gray-900 transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Contato</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>contato@pixelaria.com.br</p>
              <p>(81) 99272-0219</p>
              <p>Segunda a Sexta, 9h às 18h</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Direitos autorais */}
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap justify-center">
              <span>© {currentYear} ConsultaFácil</span>
              <span className="hidden md:inline">•</span>
              <span>Todos os direitos reservados</span>
            </div>

            {/* Mensagem com coração */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Feito com</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
              <span>para facilitar sua vida</span>
            </div>
          </div>

          {/* Assinatura */}
          <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
            <FooterSignature />
          </div>
        </div>
      </div>
    </footer>
  );
};