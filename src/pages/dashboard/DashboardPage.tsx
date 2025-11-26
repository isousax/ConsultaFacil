import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Plus, Smartphone  } from 'lucide-react';

export const DashboardPage = () => {
  const { addCodes, isAdding } = useCodesStore();

  const [singleCode, setSingleCode] = useState('');
  const [singleName, setSingleName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invalidCodes, setInvalidCodes] = useState<string[]>([]);

  const handleSingleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!singleCode.trim()) {
      setError('Por favor, digite um código');
      return;
    }

    if (singleCode.length < 8 || singleCode.length > 11) {
      setError('O código deve ter entre 8 e 11 dígitos');
      return;
    }

    try {
      const result = await addCodes([
        { code: singleCode.trim(), name: singleName.trim() || undefined }
      ]);

      if (result.added > 0) {
        setSuccess(`Código "${singleCode}" adicionado com sucesso!`);
        setSingleCode('');
        setSingleName('');
      }

      if (result.invalid.length > 0) {
        setInvalidCodes(result.invalid);
      }
    } catch {
      setError('Erro ao adicionar código. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
              <Smartphone className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Meus Códigos de Consulta
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Adicione e acompanhe seus códigos de consulta médica de forma simples e segura
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Alertas */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
            autoClose={false}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
            autoClose
          />
        )}

        {invalidCodes.length > 0 && (
          <Alert
            type="warning"
            message={
              <div>
                <p className="font-semibold mb-1">Alguns códigos não puderam ser adicionados:</p>
                <p className="text-sm">{invalidCodes.join(', ')}</p>
              </div>
            }
            onClose={() => setInvalidCodes([])}
            autoClose={false}
          />
        )}

        {/* Formulário de código único */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Adicionar código de consulta
            </h2>
          </div>
          
          <form onSubmit={handleSingleCodeSubmit} className="space-y-5">
            <Input
              label={
                <span className="text-base font-medium text-gray-900">
                  Código numérico *
                </span>
              }
              type="text"
              value={singleCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                  setSingleCode(value);
                }
              }}
              placeholder="Ex: 123456789"
              required
              inputMode="numeric"
              className="text-lg py-3"
            />
            
            <Input
              label={
                <span className="text-base font-medium text-gray-900">
                  Nome/Descrição (opcional)
                </span>
              }
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Ex: Consulta com Cardiologista"
              helperText="Identifique este código para facilitar"
              className="text-lg py-3"
            />
            
            <Button
              type="submit"
              fullWidth
              isLoading={isAdding}
              disabled={isAdding || !singleCode.trim()}
              size="lg"
              className="text-lg py-4"
            >
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Código
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};