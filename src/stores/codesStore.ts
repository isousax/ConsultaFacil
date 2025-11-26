import { create } from 'zustand';
import { codesService } from '../services/codesService';
import { handleApiError } from '../services/api';
import type {
  Code,
  CodeStatus,
  AddCodeRequest,
  CodesListParams,
} from '../types';

interface CodesState {
  codes: Code[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  isAdding: boolean;
  error: string | null;
  selectedStatus: CodeStatus | 'all';

  // Actions
  addCodes: (codes: Array<{ code: string; name?: string }>) => Promise<{ added: number; invalid: string[] }>;
  loadCodes: (params?: CodesListParams) => Promise<void>;
  deleteCode: (codeId: string) => Promise<void>;
  updateNow: () => Promise<void>;
  setSelectedStatus: (status: CodeStatus | 'all') => void;
  clearError: () => void;
  resetCodes: () => void;
}

export const useCodesStore = create<CodesState>((set, get) => ({
  codes: [],
  total: 0,
  page: 1,
  limit: 10,
  hasMore: false,
  isLoading: false,
  isUpdating: false,
  isAdding: false,
  error: null,
  selectedStatus: 'all',

  addCodes: async (codes: Array<{ code: string; name?: string }>) => {
    set({ isAdding: true, error: null });
    try {
      const request: AddCodeRequest = { codes };
      const response = await codesService.addCodes(request);

      // Reload codes after adding
      await get().loadCodes({ page: 1, status: get().selectedStatus });

      set({ isAdding: false });

      return {
        added: response.added.length,
        invalid: response.invalid,
      };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isAdding: false, error: errorMessage });
      throw error;
    }
  },

  loadCodes: async (params?: CodesListParams) => {
    set({ isLoading: true, error: null });
    try {
      const currentStatus = get().selectedStatus;
      const requestParams: CodesListParams = {
        page: params?.page || get().page,
        limit: params?.limit || get().limit,
        status: params?.status !== undefined ? params.status : currentStatus,
      };

      const response = await codesService.listCodes(requestParams);

      set({
        codes: response.codes,
        total: response.total,
        page: response.page,
        limit: response.limit,
        hasMore: response.hasMore,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  deleteCode: async (codeId: string) => {
    set({ error: null });
    try {
      await codesService.deleteCode(codeId);

      // Remove from local state
      set((state) => ({
        codes: state.codes.filter((c) => c.id !== codeId),
        total: state.total - 1,
      }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage });
      throw error;
    }
  },

  updateNow: async () => {
    set({ isUpdating: true, error: null });
    try {
      await codesService.updateNow();

      // Reload codes after update
      await get().loadCodes();

      set({ isUpdating: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isUpdating: false, error: errorMessage });
      throw error;
    }
  },

  setSelectedStatus: (status: CodeStatus | 'all') => {
    set({ selectedStatus: status });
    // Reload with new filter
    get().loadCodes({ page: 1, status });
  },

  clearError: () => set({ error: null }),

  resetCodes: () =>
    set({
      codes: [],
      total: 0,
      page: 1,
      hasMore: false,
      error: null,
    }),
}));
