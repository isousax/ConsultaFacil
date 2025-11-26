import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { Plus } from 'lucide-react';

export const DashboardPage = () => {
  const { addCodes, isAdding } = useCodesStore();

  const [singleCode, setSingleCode] = useState('');
  const [singleName, setSingleName] = useState('');
  const [bulkCodes, setBulkCodes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invalidCodes, setInvalidCodes] = useState<string[]>([]);

  const handleSingleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!singleCode.trim()) {
      setError('Digite um código');
      return;
    }

    try {
      const result = await addCodes([
        { code: singleCode.trim(), name: singleName.trim() || undefined }
      ]);

      if (result.added > 0) {
        setSuccess(`${result.added} código adicionado com sucesso!`);
        setSingleCode('');
        setSingleName('');
      }

      if (result.invalid.length > 0) {
        setInvalidCodes(result.invalid);
      }
    } catch (err) {
      setError('Erro ao adicionar código');
    }
  };

  const handleBulkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvalidCodes([]);

    if (!bulkCodes.trim()) {
      setError('Digite pelo menos um código');
      return;
    }

    // Parse codes - split by newline
    // Format: "code, name" or just "code"
    const lines = bulkCodes.split('\n').filter((line) => line.trim());
    const parsedCodes = lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      return {
        code: parts[0],
        name: parts[1] || undefined,
      };
    }).filter((item) => item.code.length > 0);

    if (parsedCodes.length === 0) {
      setError('Nenhum código válido encontrado');
      return;
    }

    try {
      const result = await addCodes(parsedCodes);

      if (result.added > 0) {
        setSuccess(`${result.added} código(s) adicionado(s) com sucesso!`);
        setBulkCodes('');
      }

      if (result.invalid.length > 0) {
        setInvalidCodes(result.invalid);
      }
    } catch (err) {
      setError('Erro ao adicionar códigos');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Adicione códigos de consulta para acompanhar seu status
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
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
          message={`Códigos inválidos ou duplicados: ${invalidCodes.join(', ')}`}
          onClose={() => setInvalidCodes([])}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Single code input */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Adicionar código único
          </h2>
          <form onSubmit={handleSingleCodeSubmit} className="space-y-4">
            <Input
              label="Código numérico"
              type="text"
              value={singleCode}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setSingleCode(value);
              }}
              placeholder="123456789"
              helperText="Digite apenas números"
              required
            />
            <Input
              label="Nome/Descrição (opcional)"
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Ex: Consulta Cardiologista"
              helperText="Identifique este código para facilitar"
            />
            <Button
              type="submit"
              fullWidth
              isLoading={isAdding}
              disabled={isAdding || !singleCode.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </form>
        </Card>

        {/* Bulk codes input */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Adicionar múltiplos códigos
          </h2>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <TextArea
              label="Códigos"
              value={bulkCodes}
              onChange={(e) => setBulkCodes(e.target.value)}
              placeholder="123456789, Consulta Cardiologista&#10;987654321, Exame de Sangue&#10;555555555"
              rows={6}
              helperText="Um código por linha. Formato: código, nome (nome é opcional)"
            />
            <Button
              type="submit"
              fullWidth
              isLoading={isAdding}
              disabled={isAdding || !bulkCodes.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar todos
            </Button>
          </form>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <span className="text-lg">💡</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Como funciona?</h3>
            <p className="mt-1 text-sm text-gray-700">
              Adicione seus códigos de consulta médica aqui. O sistema irá
              automaticamente verificar o status de cada código. Você pode
              acompanhar todos os códigos na página{' '}
              <strong>Meus Códigos</strong>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
