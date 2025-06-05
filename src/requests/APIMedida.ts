import { Medida } from "@/model/medida";
import { axiosRequest } from "./BaseAPI";

export const GetAllMedidasReq = async () => {
  const response = await axiosRequest.get<Medida[]>("/medida");
  return response.data;
};

export const GetMedidaByIdReq = async (id: string) => {
  const response = await axiosRequest.get<Medida>(`/medida/${id}`);
  return response.data;
};
export const CreateMedidaReq = async (medida: Omit<Medida, "id">) => {
  const response = await axiosRequest.post("/medida", medida);
  return response.data;
};
