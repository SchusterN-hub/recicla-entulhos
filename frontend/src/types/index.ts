export interface Dumpster {
  id: string;
  serialNumber: string;
  color: string;
  isRented: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { rentals: number };
  rentals?: Rental[];
}

export interface Rental {
  id: string;
  dumpsterId: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  startDate: string;
  expectedEndDate: string | null;
  endDate: string | null;
  createdAt: string;
  dumpster?: Dumpster;
}

export interface CreateDumpsterPayload {
  serialNumber: string;
  color: string;
}

export interface UpdateDumpsterPayload {
  serialNumber?: string;
  color?: string;
}

export interface CreateRentalPayload {
  dumpsterId: string;
  cep: string;
  expectedEndDate?: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}
