import { Imagem } from "@/model/imagem";
import { axiosRequest } from "./BaseAPI";

export const getAllImagensReq = async () => {
  const response = await axiosRequest.get<Imagem[]>("/imagem");
  return response.data;
};

export const getImagemByIdReq = async (id: string) => {
  const response = await axiosRequest.get<Imagem>(`/imagem/${id}`);
  return response.data;
};

export const createImagemReq = async (imagem: Omit<Imagem, "id">) => {
  const response = await axiosRequest.post<Imagem>("/imagem", imagem);
  return response.data;
};

export const getUltimaImagemReq = async () => {
  const response = await axiosRequest.get<Imagem>("/imagem/ultima");
  return response.data;
};
