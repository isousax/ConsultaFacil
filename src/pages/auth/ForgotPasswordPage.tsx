import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { KeyRound, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.requestPasswordReset({ email });
      setSuccess(true);
      setError('');
      console.log(response.message);
    } catch (err) {
      setError(handleApiError(err));
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Esqueceu sua senha?
          </h1>
          <p className="text-gray-600">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-4" message={error} />
        )}

        {success && (
          <Alert type="success" className="mb-4" message="Se o e-mail estiver cadastrado, você receberá as instruções de redefinição. Verifique sua caixa de entrada e spam." />
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para o Login
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Observação:</strong> Por segurança, sempre informamos que o e-mail foi enviado, 
            mesmo que o endereço não esteja cadastrado. Há um limite de 3 requisições a cada 5 minutos 
            e um intervalo de 60 segundos entre cada envio.
          </p>
        </div>
      </Card>
    </div>
  );
}
