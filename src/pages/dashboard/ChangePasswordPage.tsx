import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, CheckCircle, Shield } from 'lucide-react';

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
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('Pelo menos 1 caractere especial');
    return errors;
  };

  const passwordErrors = newPassword ? validatePassword(newPassword) : [];
  const passwordStrength = {
    weak: passwordErrors.length >= 3,
    medium: passwordErrors.length === 2,
    strong: passwordErrors.length <= 1 && newPassword.length >= 8,
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

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setLocalError(`Senha não atende aos requisitos: ${passwordErrors.join(', ')}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('A confirmação da senha não coincide.');
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError('A nova senha deve ser diferente da atual.');
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
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Change password error:', err);
    }
  };

  const displayError = localError || storeError;

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center backdrop-blur-sm bg-white/80 border border-white/20 shadow-soft-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Senha Alterada!
          </h1>
          <Alert 
            type="success" 
            className="mb-6" 
            message="Sua senha foi alterada com sucesso. Redirecionando..." 
          />
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-linear-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/25"
          >
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-2xl mx-auto p-4">

        <Card className="p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-soft-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Alterar Senha
            </h1>
            <p className="text-gray-600">
              Proteja sua conta com uma senha forte e única
            </p>
          </div>

          {displayError && (
            <Alert 
              type="error" 
              className="mb-6 animate-in slide-in-from-top duration-500" 
              message={displayError} 
            />
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
                className="bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="relative mb-4">
                <Input
                  label="Nova Senha"
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Crie uma nova senha forte"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength Meter */}
              {newPassword && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Força da senha:</span>
                    <span className={`text-sm font-semibold ${
                      passwordStrength.strong ? 'text-green-600' :
                      passwordStrength.medium ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.strong ? 'Forte' : passwordStrength.medium ? 'Média' : 'Fraca'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strong ? 'bg-green-500 w-full' :
                        passwordStrength.medium ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                </div>
              )}

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
                  className="bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 text-sm text-gray-700 backdrop-blur-sm">
              <strong className="text-blue-900">Requisitos de segurança:</strong>
              <ul className="mt-2 space-y-1.5">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Mínimo 8 caracteres</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Pelo menos 1 letra maiúscula</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Pelo menos 1 letra minúscula</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Pelo menos 1 número</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span>Pelo menos 1 caractere especial</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Alterando...
                  </div>
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}