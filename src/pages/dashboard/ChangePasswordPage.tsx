import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { changePassword, isLoading, error: storeError, clearError } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
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
    setLocalError('');
    clearError();
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError('Por favor, preencha todos os campos.');
      return;
    }

    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setLocalError(`Nova senha inválida: ${passwordErrors.join(', ')}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError('A nova senha deve ser diferente da senha atual.');
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      // Error handled by store
      console.error('Change password error:', err);
    }
  };

  const displayError = localError || storeError;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Senha Alterada!
            </h1>
            <Alert type="success" className="mb-6" message="Sua senha foi alterada com sucesso. Redirecionando..." />
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Voltar ao Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <KeyRound className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Alterar Senha
          </h1>
          <p className="text-gray-600">
            Digite sua senha atual e escolha uma nova senha.
          </p>
        </div>

        {displayError && (
          <Alert type="error" className="mb-6" message={displayError} />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              label="Senha Atual"
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="border-t pt-6">
            <div className="relative mb-4">
              <Input
                label="Nova Senha"
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <strong>Requisitos da nova senha:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mínimo 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula</li>
              <li>Pelo menos 1 letra minúscula</li>
              <li>Pelo menos 1 número</li>
              <li>Deve ser diferente da senha atual</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
