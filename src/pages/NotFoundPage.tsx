import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Home } from 'lucide-react';
import { SEO } from '../components/SEO';
import { SEO_CONFIG } from '../config/seo';

export const NotFoundPage = () => {
  return (
    <>
      <SEO
        title={SEO_CONFIG.notFound.title}
        description={SEO_CONFIG.notFound.description}
        keywords={SEO_CONFIG.notFound.keywords}
        noindex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md text-center">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Página não encontrada
          </h2>
          <p className="mb-8 text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Voltar para o início
            </Button>
          </Link>
        </Card>
      </div>
    </>
  );
};
