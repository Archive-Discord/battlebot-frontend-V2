import axios, { AxiosError, AxiosResponse, Method } from "axios";

export const client = async (
  method: Method = "GET",
  endpoints: string,
  data?: any,
  auth?: string | null,
  headers?: any
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      data,
      headers: {
        ...headers,
        Authorization: auth ? "Bearer " + auth : "",
      },
      url: process.env.NEXT_PUBLIC_API_URL + endpoints,
      withCredentials: true,
    });
    return {
      data: response.data.data,
      error: false,
      status: 200,
      message: response.data.message,
    };
  } catch (response: any) {
    return {
      data: response.response.data.data,
      status: response.response.data.status,
      error: true,
      message: response.response.data.message,
    };
  }
};
export interface Response<
  T extends { [key: string]: any } = { [key: string]: any }
> {
  data?: any;
  error: boolean;
  status: number;
  message: string;
}
export default client;
