import { useEffect, useState } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { RefreshCw, Trash2, Filter } from 'lucide-react';
import type { CodeStatus, Code } from '../../types';
import { clsx } from 'clsx';

const statusOptions: Array<{ value: CodeStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'error', label: 'Erro' },
  { value: 'not_found', label: 'Não Encontrado' },
];

export const CodesPage = () => {
  const {
    codes,
    total,
    isLoading,
    isUpdating,
    error,
    selectedStatus,
    loadCodes,
    deleteCode,
    updateNow,
    setSelectedStatus,
    clearError,
  } = useCodesStore();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const handleUpdateNow = async () => {
    try {
      await updateNow();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (code: Code) => {
    if (!confirm(`Deseja realmente remover o código ${code.code}?`)) {
      return;
    }

    setDeletingId(code.id);
    try {
      await deleteCode(code.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Códigos</h1>
          <p className="mt-2 text-gray-600">
            Total: <span className="font-semibold">{total}</span> código(s)
          </p>
        </div>

        <Button
          onClick={handleUpdateNow}
          isLoading={isUpdating}
          disabled={isUpdating || codes.length === 0}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar agora
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      {/* Filter */}
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar:</span>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={clsx(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                selectedStatus === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={5} />
            </div>
          ) : codes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">
                Nenhum código encontrado.{' '}
                {selectedStatus !== 'all' && 'Tente alterar o filtro.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {codes.map((code) => (
                  <tr
                    key={code.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {code.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {code.name || (
                        <span className="italic text-gray-400">Sem nome</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge status={code.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(code.lastUpdated)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(code.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(code)}
                        isLoading={deletingId === code.id}
                        disabled={deletingId === code.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
