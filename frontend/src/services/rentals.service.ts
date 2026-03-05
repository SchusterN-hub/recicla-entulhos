import api from './api';
import axios from 'axios';
import { Rental, CreateRentalPayload, ViaCepResponse } from '@/types';

export const rentalsService = {
  async create(payload: CreateRentalPayload): Promise<Rental> {
    const { data } = await api.post<Rental>('/rentals', payload);
    return data;
  },

  async finish(id: string): Promise<Rental> {
    const { data } = await api.patch<Rental>(`/rentals/${id}/finish`);
    return data;
  },
};

export const viaCepService = {
  async fetchAddress(cep: string): Promise<ViaCepResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    const { data } = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cleanCep}/json/`,
    );

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return data;
  },
};
