import api from './api';
import {
  Dumpster,
  CreateDumpsterPayload,
  UpdateDumpsterPayload,
  Rental,
} from '@/types';

interface FilterParams {
  serialNumber?: string;
  isRented?: string;
}

export const dumpstersService = {
  async getAll(filters?: FilterParams): Promise<Dumpster[]> {
    const params = new URLSearchParams();
    if (filters?.serialNumber) params.append('serialNumber', filters.serialNumber);
    if (filters?.isRented !== undefined && filters.isRented !== '')
      params.append('isRented', filters.isRented);

    const { data } = await api.get<Dumpster[]>(`/dumpsters?${params.toString()}`);
    return data;
  },

  async getById(id: string): Promise<Dumpster> {
    const { data } = await api.get<Dumpster>(`/dumpsters/${id}`);
    return data;
  },

  async create(payload: CreateDumpsterPayload): Promise<Dumpster> {
    const { data } = await api.post<Dumpster>('/dumpsters', payload);
    return data;
  },

  async update(id: string, payload: UpdateDumpsterPayload): Promise<Dumpster> {
    const { data } = await api.patch<Dumpster>(`/dumpsters/${id}`, payload);
    return data;
  },

  async getRentals(id: string): Promise<Rental[]> {
    const { data } = await api.get<Rental[]>(`/dumpsters/${id}/rentals`);
    return data;
  },
};
