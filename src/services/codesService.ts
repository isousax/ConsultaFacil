// import apiClient from './api'; // Descomentar quando integrar com backend real
import type {
  Code,
  AddCodeRequest,
  AddCodeResponse,
  CodesListResponse,
  CodesListParams,
  DeleteCodeResponse,
  UpdateNowResponse,
  CodeStatus,
} from '../types';

// Mock data storage
const MOCK_CODES_KEY = 'consultafacil_mock_codes';

// Helper to get mock codes
const getMockCodes = (): Code[] => {
  const data = localStorage.getItem(MOCK_CODES_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save mock codes
const saveMockCodes = (codes: Code[]): void => {
  localStorage.setItem(MOCK_CODES_KEY, JSON.stringify(codes));
};

// Helper to validate code format (numeric only)
const isValidCode = (code: string): boolean => {
  return /^\d+$/.test(code.trim());
};

// Helper to simulate status check
const generateRandomStatus = (): CodeStatus => {
  const statuses: CodeStatus[] = ['pending', 'confirmed', 'error', 'not_found'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const codesService = {
  // Add codes (single or multiple)
  addCodes: async (data: AddCodeRequest): Promise<AddCodeResponse> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const codes = getMockCodes();
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 'unknown';

    const added: Code[] = [];
    const invalid: string[] = [];

    data.codes.forEach((item) => {
      const trimmedCode = item.code.trim();
      const trimmedName = item.name?.trim();

      if (!isValidCode(trimmedCode)) {
        invalid.push(trimmedCode);
        return;
      }

      // Check if code already exists
      if (codes.some((c) => c.code === trimmedCode && c.userId === userId)) {
        invalid.push(`${trimmedCode} (já existe)`);
        return;
      }

      const newCode: Code = {
        id: `code_${Date.now()}_${Math.random()}`,
        code: trimmedCode,
        name: trimmedName,
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userId,
      };

      codes.push(newCode);
      added.push(newCode);
    });

    saveMockCodes(codes);

    return {
      success: true,
      added,
      invalid,
      message: `${added.length} código(s) adicionado(s) com sucesso`,
    };

    // Real implementation:
    // const response = await apiClient.post<AddCodeResponse>('/codes/add', data);
    // return response.data;
  },

  // List codes with pagination and filter
  listCodes: async (params: CodesListParams = {}): Promise<CodesListResponse> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const { page = 1, limit = 10, status = 'all' } = params;

    const allCodes = getMockCodes();
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 'unknown';

    // Filter by user and status
    let filtered = allCodes.filter((c) => c.userId === userId);

    if (status !== 'all') {
      filtered = filtered.filter((c) => c.status === status);
    }

    // Sort by most recent first
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCodes = filtered.slice(startIndex, endIndex);

    return {
      codes: paginatedCodes,
      total: filtered.length,
      page,
      limit,
      hasMore: endIndex < filtered.length,
    };

    // Real implementation:
    // const response = await apiClient.get<CodesListResponse>('/codes/list', { params });
    // return response.data;
  },

  // Delete a code
  deleteCode: async (codeId: string): Promise<DeleteCodeResponse> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const codes = getMockCodes();
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 'unknown';

    const index = codes.findIndex(
      (c) => c.id === codeId && c.userId === userId
    );

    if (index === -1) {
      throw new Error('Código não encontrado');
    }

    codes.splice(index, 1);
    saveMockCodes(codes);

    return {
      success: true,
      message: 'Código removido com sucesso',
    };

    // Real implementation:
    // const response = await apiClient.delete<DeleteCodeResponse>(`/codes/${codeId}`);
    // return response.data;
  },

  // Update all codes status now
  updateNow: async (): Promise<UpdateNowResponse> => {
    // Mock implementation - simulates checking status with backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const codes = getMockCodes();
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 'unknown';

    const updated: Code[] = [];

    codes.forEach((code) => {
      if (code.userId === userId) {
        // Simulate status update
        code.status = generateRandomStatus();
        code.lastUpdated = new Date().toISOString();
        updated.push(code);
      }
    });

    saveMockCodes(codes);

    return {
      success: true,
      updated,
      message: `${updated.length} código(s) atualizados`,
    };

    // Real implementation:
    // const response = await apiClient.post<UpdateNowResponse>('/codes/update-now');
    // return response.data;
  },

  // Get single code details
  getCode: async (codeId: string): Promise<Code> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const codes = getMockCodes();
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 'unknown';

    const code = codes.find((c) => c.id === codeId && c.userId === userId);

    if (!code) {
      throw new Error('Código não encontrado');
    }

    return code;

    // Real implementation:
    // const response = await apiClient.get<Code>(`/codes/${codeId}`);
    // return response.data;
  },
};
