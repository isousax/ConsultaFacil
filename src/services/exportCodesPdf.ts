interface JsPdf {
  internal: {
    pageSize: { getWidth(): number; getHeight(): number };
  };
  setFontSize(n: number): void;
  setTextColor(r: number, g: number, b: number): void;
  setFillColor(r: number, g: number, b: number): void;
  setDrawColor(r: number, g: number, b: number): void;
  text(
    text: string | string[],
    x: number,
    y: number,
    options?: Record<string, unknown>
  ): void;
  addPage(): void;
  save(filename: string): void;
  setFont(font: string, style?: string): void;
  line(x1: number, y1: number, x2: number, y2: number): void;
  rect(x: number, y: number, w: number, h: number, style?: string): void;
  roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): void;
  splitTextToSize(text: string, maxWidth: number): string[];
  getTextWidth(text: string): number;
  setPage(pageNumber: number): void;
  getNumberOfPages(): number;
  lastAutoTable?: { finalY: number };
}

interface AutoTableOptions {
  head: string[][];
  body: unknown[][];
  startY?: number;
  styles?: Record<string, unknown>;
  headStyles?: Record<string, unknown>;
  bodyStyles?: Record<string, unknown>;
  alternateRowStyles?: Record<string, unknown>;
  margin?: number | { left?: number; right?: number; top?: number; bottom?: number };
  theme?: string;
  columnStyles?: Record<string, unknown>;
}

type AutoTableFn = (doc: JsPdf, options: AutoTableOptions) => void;
type AutoTableModule = { default?: AutoTableFn; autoTable?: AutoTableFn };
type JsPdfCtor = new (opts: {
  unit: 'mm';
  format: 'a4';
  orientation: 'portrait' | 'landscape';
}) => JsPdf;

interface Code {
  id: string;
  code: string;
  name?: string;
  status: string;
  lastUpdated: string;
  createdAt: string;
}

interface ExportCodesOptions {
  filename?: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  includeStatus?: boolean;
  groupByStatus?: boolean;
  showSummary?: boolean;
  onProgress?: (phase: string) => void;
}

const statusLabels: Record<string, string> = {
  confirmed: 'Autorizada',
  pending: 'Pendente',
  cancelled: 'Cancelada',
  rejected: 'Rejeitada',
  denied: 'Negada',
  expired: 'Expirada',
  not_found: 'Não Encontrada',
  error: 'Erro',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export async function exportCodesPdf(
  codes: Code[],
  opts: ExportCodesOptions = {}
) {
  const {
    filename = 'meus-codigos.pdf',
    title = 'Meus Códigos de Consulta',
    orientation = 'portrait',
    includeStatus = true,
    groupByStatus = false,
    showSummary = true,
    onProgress,
  } = opts;

  const emit = (phase: string) => onProgress?.(phase);

  emit('Preparando documento...');

  // Carregar jsPDF com autoTable
  const jsPdfModule = await import('jspdf');
  const { jsPDF } = jsPdfModule as unknown as { jsPDF: JsPdfCtor };

  const autoTableModule = (await import('jspdf-autotable')) as unknown as AutoTableModule;
  const autoTableFn: AutoTableFn | undefined =
    autoTableModule.default ?? autoTableModule.autoTable;
  
  if (!autoTableFn) {
    throw new Error('jspdf-autotable: função autoTable não encontrada');
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginMm = 15;

  // Cores profissionais
  const colors = {
    primary: [41, 128, 185],
    secondary: [52, 152, 219],
    dark: [44, 62, 80],
    light: [236, 240, 241],
    text: [52, 73, 94],
  };

  // Função para adicionar header
  const addHeader = (pageNumber: number) => {
    const totalPages = pdf.getNumberOfPages();

    // Fundo do header
    pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    pdf.rect(0, 0, pageWidth, 12, 'F');

    // Título
    pdf.setFontSize(10);
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ConsultaFácil', marginMm, 8);

    // Número da página
    if (pageNumber > 1) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(
        `Página ${pageNumber} de ${totalPages}`,
        pageWidth - marginMm,
        8,
        { align: 'right' }
      );
    }
  };

  // Função para adicionar footer
  const addFooter = () => {
    const footerY = pageHeight - 8;

    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);

    // Linha sutil
    pdf.setDrawColor(220, 220, 220);
    pdf.line(marginMm, footerY - 3, pageWidth - marginMm, footerY - 3);

    // Data de geração
    const dateStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    pdf.text(`Gerado em ${dateStr}`, pageWidth - marginMm, footerY, {
      align: 'right',
    });
  };

  // Header inicial
  addHeader(1);

  emit('Criando página de capa...');

  // Página de capa
  let currentY = 40;

  pdf.setFontSize(24);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, currentY, { align: 'center' });

  currentY += 15;

  if (showSummary) {
    // Estatísticas gerais
    const totalCodes = codes.length;
    const statusCounts = codes.reduce((acc, code) => {
      acc[code.status] = (acc[code.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    pdf.setFontSize(12);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFont('helvetica', 'normal');

    currentY += 10;

    // Box de resumo
    const boxY = currentY;
    const boxHeight = 40;
    pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    pdf.roundedRect(marginMm, boxY, pageWidth - marginMm * 2, boxHeight, 3, 3, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resumo Geral', marginMm + 5, boxY + 8);

    pdf.setFont('helvetica', 'normal');
    let summaryY = boxY + 15;

    pdf.text(`Total de códigos: ${totalCodes}`, marginMm + 5, summaryY);
    summaryY += 6;

    // Estatísticas por status
    Object.entries(statusCounts).forEach(([status, count]) => {
      const label = statusLabels[status] || status;
      pdf.text(`${label}: ${count}`, marginMm + 5, summaryY);
      summaryY += 5;
    });

    currentY = boxY + boxHeight + 15;
  }

  emit('Gerando tabela de códigos...');

  // Nova página para a tabela
  pdf.addPage();
  addHeader(2);
  currentY = 20;

  // Título da seção
  pdf.setFontSize(14);
  pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Lista de Códigos', marginMm, currentY);

  currentY += 10;

  if (groupByStatus) {
    // Agrupar por status
    const grouped = codes.reduce((acc, code) => {
      if (!acc[code.status]) acc[code.status] = [];
      acc[code.status].push(code);
      return acc;
    }, {} as Record<string, Code[]>);

    for (const [status, statusCodes] of Object.entries(grouped)) {
      const statusLabel = statusLabels[status] || status;

      // Cabeçalho do grupo
      pdf.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.rect(marginMm, currentY, pageWidth - marginMm * 2, 8, 'F');

      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `${statusLabel} (${statusCodes.length})`,
        marginMm + 3,
        currentY + 5.5
      );

      currentY += 12;

      // Tabela do grupo
      const tableData = statusCodes.map((code) => [
        code.code,
        code.name || '-',
        formatDate(code.createdAt),
        formatDate(code.lastUpdated),
      ]);

      autoTableFn(pdf, {
        startY: currentY,
        head: [['Código', 'Nome/Descrição', 'Criado em', 'Última Atualização']],
        body: tableData,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
          textColor: colors.text,
        },
        headStyles: {
          fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        margin: { left: marginMm, right: marginMm },
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 35, fontStyle: 'bold' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
      });

      currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 10;

      // Verificar se precisa de nova página
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        const pageNum = pdf.getNumberOfPages();
        addHeader(pageNum);
        currentY = 20;
      }
    }
  } else {
    // Tabela única com todos os códigos
    const headers = includeStatus
      ? ['Código', 'Nome/Descrição', 'Status', 'Criado em', 'Última Atualização']
      : ['Código', 'Nome/Descrição', 'Criado em', 'Última Atualização'];

    const tableData = codes.map((code) => {
      const row = [
        code.code,
        code.name || '-',
        ...(includeStatus ? [statusLabels[code.status] || code.status] : []),
        formatDate(code.createdAt),
        formatDate(code.lastUpdated),
      ];
      return row;
    });

    autoTableFn(pdf, {
      startY: currentY,
      head: [headers],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
        textColor: colors.text,
      },
      headStyles: {
        fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      margin: { left: marginMm, right: marginMm },
      theme: 'grid',
      columnStyles: includeStatus
        ? {
            0: { cellWidth: 30, fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
          }
        : {
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 35 },
            3: { cellWidth: 35 },
          },
    });
  }

  emit('Finalizando documento...');

  // Adicionar footers em todas as páginas
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter();
  }

  emit('Salvando arquivo...');
  pdf.save(filename);
  emit('Concluído!');
}
