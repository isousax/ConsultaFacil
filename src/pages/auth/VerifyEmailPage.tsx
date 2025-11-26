import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setStatus('error');
        setMessage('Token de verificação não encontrado na URL.');
      }, 0);
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await authService.confirmVerification({ token });
        setStatus('success');
        setMessage(response.message);
      } catch (error) {
        setStatus('error');
        setMessage(handleApiError(error));
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verificando e-mail...
              </h1>
              <p className="text-gray-600">
                Aguarde enquanto confirmamos seu endereço de e-mail.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                E-mail verificado!
              </h1>
              <Alert type="success" className="mb-6 text-left" message={message} />
              <p className="text-gray-600 mb-6">
                Sua conta foi verificada com sucesso. Agora você pode fazer login.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Ir para o Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Erro na verificação
              </h1>
              <Alert type="error" className="mb-6 text-left" message={message} />
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/resend-verification')} 
                  className="w-full"
                  variant="secondary"
                >
                  Reenviar e-mail de verificação
                </Button>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Voltar para o Login
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
