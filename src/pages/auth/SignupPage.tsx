import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pwd)) errors.push('Pelo menos 1 letra maiúscula');
    if (!/[a-z]/.test(pwd)) errors.push('Pelo menos 1 letra minúscula');
    if (!/[0-9]/.test(pwd)) errors.push('Pelo menos 1 número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('Pelo menos 1 caractere especial');
    return errors;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.full_name) {
      errors.full_name = 'Nome completo é obrigatório';
    } else if (formData.full_name.length < 3) {
      errors.full_name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.full_name.length > 100) {
      errors.full_name = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }

    if (!formData.phone) {
      errors.phone = 'Telefone é obrigatório';
    } else if (!/^\+?55\s?\d{2}\s?\d{4,5}-?\d{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Telefone inválido (use formato +55 XX XXXXX-XXXX)';
    }

    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.birth_date = 'Você deve ter pelo menos 18 anos';
      }
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors.join(', ');
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''), // Remove non-digits
        birth_date: formData.birth_date || null,
        password: formData.password,
      });
      
      // Redirect to email confirmation page
      navigate(`/email-sent?email=${encodeURIComponent(formData.email)}`);
    } catch {
      // Error is already handled by the store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="text-2xl font-bold">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar sua conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados para começar
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
            autoClose
            autoCloseDelay={5000}
          />
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Nome completo"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={formErrors.full_name}
            placeholder="João Silva Santos"
            autoComplete="name"
            required
          />

          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={formErrors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={formErrors.phone}
            placeholder="+55 11 98765-4321"
            autoComplete="tel"
            helperText="Formato: +55 XX XXXXX-XXXX"
            required
          />

          <Input
            label="Data de Nascimento (opcional)"
            type="date"
            value={formData.birth_date}
            onChange={(e) =>
              setFormData({ ...formData, birth_date: e.target.value })
            }
            error={formErrors.birth_date}
            autoComplete="bday"
            helperText="Mínimo 18 anos"
          />

          <Input
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={formErrors.password}
            placeholder="••••••••"
            autoComplete="new-password"
            helperText="Mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial"
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={formErrors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
            <strong>Requisitos da senha:</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Mínimo 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial</li>
            </ul>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Faça login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
