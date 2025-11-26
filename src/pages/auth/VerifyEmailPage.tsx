import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

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
        
        // Check if already verified (idempotent response)
        if (response.message.toLowerCase().includes('já confirmado') || 
            response.message.toLowerCase().includes('already confirmed')) {
          setStatus('already_verified');
          setMessage('Seu e-mail já foi verificado anteriormente.');
        } else {
          setStatus('success');
          setMessage(response.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(handleApiError(error));
      }
    };

    confirmEmail();
  }, [searchParams]);

  // Auto-redirect countdown for success
  useEffect(() => {
    if (status === 'success' || status === 'already_verified') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        navigate('/login');
      }
    }
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verificando e-mail...
              </h1>
              <p className="text-gray-600">
                Aguarde enquanto confirmamos seu endereço de e-mail.
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                E-mail verificado com sucesso!
              </h1>
              <Alert type="success" className="mb-4 text-left" message={message} />
              <p className="text-gray-600 mb-2">
                Sua conta está ativa e pronta para usar.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecionando para o login em <strong>{countdown}s</strong>...
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Ir para o Login agora
              </Button>
            </>
          )}

          {status === 'already_verified' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                E-mail já verificado
              </h1>
              <Alert type="info" className="mb-4 text-left" message={message} />
              <p className="text-gray-600 mb-2">
                Você já pode fazer login na sua conta.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecionando para o login em <strong>{countdown}s</strong>...
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Ir para o Login agora
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Erro na verificação
              </h1>
              <Alert type="error" className="mb-6 text-left" message={message} />
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm font-semibold text-gray-900 mb-2">Possíveis causas:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• O link de verificação expirou (válido por 24 horas)</li>
                  <li>• O token já foi utilizado anteriormente</li>
                  <li>• O link está incompleto ou corrompido</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/resend-verification')} 
                  className="w-full"
                >
                  Solicitar Novo E-mail de Verificação
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full"
                  variant="secondary"
                >
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
