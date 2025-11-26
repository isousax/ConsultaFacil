import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            © {currentYear} ConsultaFácil. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-600">
            Feito com <Heart className="h-4 w-4 fill-red-500 text-red-500" />{' '}
            para facilitar sua vida
          </p>
        </div>
      </div>
    </footer>
  );
};
