import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Mail, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function EmailSentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await authService.resendVerification({ email });
      setResendSuccess(true);
      
      // Set cooldown (padrão 60s, ou usa Retry-After se disponível)
      const cooldownTime = retryAfter || 60;
      setCooldown(cooldownTime);
      setRetryAfter(null);
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setResendError(errorMsg);

      // Check for Retry-After header in error response
      if (err?.response?.headers?.['retry-after']) {
        const retrySeconds = parseInt(err.response.headers['retry-after'], 10);
        if (!isNaN(retrySeconds)) {
          setCooldown(retrySeconds);
          setRetryAfter(retrySeconds);
        }
      } else if (err?.retryAfter) {
        setCooldown(err.retryAfter);
        setRetryAfter(err.retryAfter);
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erro
            </h1>
            <Alert type="error" message="E-mail não encontrado. Por favor, faça o registro novamente." />
            <Button onClick={() => navigate('/signup')} className="w-full mt-6">
              Ir para Cadastro
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifique seu e-mail
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">
            Enviamos um link de confirmação para:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm font-medium text-gray-900 break-all">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Próximos passos:
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-semibold shrink-0">1.</span>
                <span>Abra sua caixa de entrada de e-mail</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold shrink-0">2.</span>
                <span>Procure por um e-mail de <strong>ConsultaFácil</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold shrink-0">3.</span>
                <span>Clique no link de confirmação</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold shrink-0">4.</span>
                <span>Retorne aqui e faça login</span>
              </li>
            </ol>
          </div>

          {/* Success/Error Messages */}
          {resendSuccess && (
            <Alert 
              type="success" 
              message="E-mail reenviado com sucesso! Verifique sua caixa de entrada."
              className="mb-4"
            />
          )}

          {resendError && (
            <Alert 
              type="error" 
              message={resendError}
              className="mb-4"
            />
          )}

          {/* Resend Button */}
          <div className="space-y-3">
            <Button
              onClick={handleResend}
              variant="secondary"
              className="w-full"
              disabled={isResending || cooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Aguarde {formatTime(cooldown)}
                </>
              ) : (
                'Reenviar e-mail de confirmação'
              )}
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Ir para o Login
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Não recebeu o e-mail?</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1 text-left">
              <li>• Verifique sua pasta de spam ou lixo eletrônico</li>
              <li>• Confirme se o e-mail está correto</li>
              <li>• Aguarde alguns minutos e tente novamente</li>
              <li>• Há um intervalo de {retryAfter || 60} segundos entre cada envio</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
