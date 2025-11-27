import { useEffect, useState } from 'react';
import { useCodesStore } from '../../stores/codesStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { TableSkeleton, CardListSkeleton } from '../../components/ui/Skeleton';
import { CodeDetailsModal } from '../../components/codes/CodeDetailsModal';
import { exportCodesPdf } from '../../services/exportCodesPdf';
import { RefreshCw, Trash2, Filter, Search, Download, Eye } from 'lucide-react';
import type { CodeStatus, Code } from '../../types';
import { clsx } from 'clsx';

const statusOptions: Array<{ value: CodeStatus | 'all'; label: string; count: number }> = [
  { value: 'all', label: 'Todos', count: 0 },
  { value: 'confirmed', label: 'Autorizada', count: 0 },
  { value: 'pending', label: 'Pendente', count: 0 },
  { value: 'cancelled', label: 'Cancelada', count: 0 },
  { value: 'rejected', label: 'Rejeitada', count: 0 },
  { value: 'denied', label: 'Negada', count: 0 },
  { value: 'expired', label: 'Expirada', count: 0 },
  { value: 'not_found', label: 'Não Encontrada', count: 0 },
  { value: 'error', label: 'Erro', count: 0 },
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const filteredCodes = codes.filter(code => 
    code.code.includes(searchTerm) || 
    (code.name && code.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (code: Code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCode(null);
  };

  const handleUpdateNow = async () => {
    try {
      await updateNow();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    if (codes.length === 0) return;
    
    setIsExporting(true);
    try {
      await exportCodesPdf(filteredCodes, {
        filename: 'meus-codigos.pdf',
        title: 'Meus Códigos de Consulta',
        includeStatus: true,
        groupByStatus: false,
        showSummary: true,
        onProgress: (phase) => console.log(phase),
      });
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (code: Code) => {
    if (!confirm(`Tem certeza que deseja remover o código ${code.code}?`)) {
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header com stats */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Meus Códigos
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
            <p className="text-sm sm:text-base text-gray-600">
              Total: <span className="font-semibold text-gray-900">{total}</span> código(s)
            </p>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <p className="text-sm sm:text-base text-gray-600">
              Exibindo: <span className="font-semibold text-gray-900">{filteredCodes.length}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            disabled={codes.length === 0 || isExporting}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={handleUpdateNow}
            isLoading={isUpdating}
            disabled={isUpdating || codes.length === 0}
            className="bg-linear-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/25 w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Tudo
          </Button>
        </div>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={clearError}
          className="animate-in slide-in-from-top duration-500"
        />
      )}

      {/* Filtros e Busca */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Status:</span>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={clsx(
                  'rounded-xl px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 border',
                  selectedStatus === option.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                    : 'bg-white/50 text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabela Modernizada */}
      <Card padding="none" className="overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft-xl">
        {isLoading ? (
          <>
            <div className="lg:hidden">
              <CardListSkeleton rows={4} />
            </div>
            <div className="hidden lg:block p-8">
              <TableSkeleton rows={6} />
            </div>
          </>
        ) : filteredCodes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum código encontrado
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Tente alterar os filtros ou termos de busca.' 
                : 'Comece adicionando seu primeiro código de consulta.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Versão Mobile - Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredCodes.map((code) => (
                <div key={code.id} className="p-4 hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                        <span className="font-mono font-semibold text-gray-900 text-sm break-all">
                          {code.code}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 wrap-break-word line-clamp-2">
                        {code.name || <span className="italic text-gray-400">Sem descrição</span>}
                      </p>
                    </div>
                    <Badge status={code.status} className="shrink-0" />
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                    <div className="flex items-center justify-between">
                      <span>Última atualização:</span>
                      <span className="font-medium">{formatDate(code.lastUpdated)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Criado em:</span>
                      <span className="font-medium">{formatDate(code.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(code)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(code)}
                      isLoading={deletingId === code.id}
                      disabled={deletingId === code.id}
                      className="bg-linear-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/25"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Versão Desktop - Tabela */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Última Atualização
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Criado em
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60">
                  {filteredCodes.map((code) => (
                    <tr
                      key={code.id}
                      className="transition-all duration-200 hover:bg-blue-50/30 group"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-mono font-semibold text-gray-900">
                            {code.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {code.name || (
                            <span className="italic text-gray-400">Sem descrição</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge status={code.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(code.lastUpdated)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(code.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewDetails(code)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(code)}
                            isLoading={deletingId === code.id}
                            disabled={deletingId === code.id}
                            className="bg-linear-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/25"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* Modal de Detalhes */}
      {selectedCode && (
        <CodeDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          codeId={selectedCode.id}
          codeNumber={selectedCode.code}
        />
      )}
    </div>
  );
};
