import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pwd)) errors.push('Pelo menos 1 letra maiúscula');
    if (!/[a-z]/.test(pwd)) errors.push('Pelo menos 1 letra minúscula');
    if (!/[0-9]/.test(pwd)) errors.push('Pelo menos 1 número');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de redefinição não encontrado na URL.');
      return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Senha inválida: ${passwordErrors.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        new_password: password,
      });
      setSuccess(true);
      setError('');
      console.log(response.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(handleApiError(err));
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md p-8">
          <Alert type="error" message="Token de redefinição de senha não encontrado. Verifique o link recebido por e-mail." />
          <Button onClick={() => navigate('/forgot-password')} className="w-full mt-4">
            Solicitar Novo Link
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Senha Redefinida!
            </h1>
            <Alert type="success" className="mb-6" message="Sua senha foi redefinida com sucesso. Redirecionando para o login..." />
            <Button onClick={() => navigate('/login')} className="w-full">
              Ir para o Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Redefinir Senha
          </h1>
          <p className="text-gray-600">
            Digite sua nova senha abaixo.
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-4" message={error} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirmar Nova Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <strong>Requisitos da senha:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mínimo 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula</li>
              <li>Pelo menos 1 letra minúscula</li>
              <li>Pelo menos 1 número</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Voltar para o Login
          </button>
        </div>
      </Card>
    </div>
  );
}
