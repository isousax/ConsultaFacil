import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { SEO } from '../../components/SEO';
import { SEO_CONFIG } from '../../config/seo';

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
    acceptTerms: false,
    acceptPrivacy: false,
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

  const formatPhoneNumber = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    const limited = numbers.slice(0, 11);
    
    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
    }
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
    } else {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        errors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      }
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

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Você deve aceitar os Termos de Uso';
    }

    if (!formData.acceptPrivacy) {
      errors.acceptPrivacy = 'Você deve aceitar a Política de Privacidade';
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
      // Adiciona +55 ao telefone antes de enviar
      const digits = formData.phone.replace(/\D/g, '');
      const phoneWithCountryCode = `+55${digits}`;
      
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: phoneWithCountryCode,
        birth_date: formData.birth_date || null,
        password: formData.password,
        accept_terms: formData.acceptTerms,
        accept_privacy: formData.acceptPrivacy,
      });
      
      // Redirect to email confirmation page
      navigate(`/email-sent?email=${encodeURIComponent(formData.email)}`);
    } catch {
      // Error is already handled by the store
    }
  };

  return (
    <>
      <SEO
        title={SEO_CONFIG.signup.title}
        description={SEO_CONFIG.signup.description}
        keywords={SEO_CONFIG.signup.keywords}
      />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-2xl">🇧🇷</span>
                <span className="ml-2 text-sm text-gray-600 font-medium">+55</span>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFormData({ ...formData, phone: formatted });
                }}
                className={`block w-full pl-[88px] pr-3 py-2 border ${
                  formErrors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="(11) 98765-4321"
                autoComplete="tel"
                required
              />
            </div>
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>

          <Input
            label="Data de Nascimento"
            type="date"
            value={formData.birth_date}
            onChange={(e) =>
              setFormData({ ...formData, birth_date: e.target.value })
            }
            error={formErrors.birth_date}
            autoComplete="bday"
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

          {/* Termos e Políticas */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                Li e aceito os{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Termos de Uso
                </a>
                {' '}*
              </label>
            </div>
            {formErrors.acceptTerms && (
              <p className="text-sm text-red-600 ml-7">{formErrors.acceptTerms}</p>
            )}

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="acceptPrivacy" className="text-sm text-gray-700 cursor-pointer">
                Li e aceito a{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Política de Privacidade
                </a>
                {' '}*
              </label>
            </div>
            {formErrors.acceptPrivacy && (
              <p className="text-sm text-red-600 ml-7">{formErrors.acceptPrivacy}</p>
            )}
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
    </>
  );
};
