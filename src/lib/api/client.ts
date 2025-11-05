import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "../constants/api";

/**
 * Cliente HTTP configurado para la API de Factus
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptores de request y response
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Agregar token de autenticación si existe
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`
          );
        }

        return config;
      },
      (error: AxiosError) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log(
            `[API Response] ${response.status} ${response.config.url}`
          );
        }

        return response;
      },
      (error: AxiosError) => {
        // Manejar errores comunes
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 400:
              console.error("[API Error] Bad Request:", data);
              break;
            case 401:
              console.error(
                "[API Error] Unauthorized - Redirecting to login..."
              );
              // Limpiar token y redirigir
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
              break;
            case 403:
              console.error("[API Error] Forbidden:", data);
              break;
            case 404:
              console.error("[API Error] Not Found:", data);
              break;
            case 409:
              console.error("[API Error] Conflict:", data);
              break;
            case 500:
              console.error("[API Error] Internal Server Error:", data);
              break;
            default:
              console.error("[API Error] Unknown Error:", data);
          }
        } else if (error.request) {
          console.error("[API Error] No response received:", error.request);
        } else {
          console.error("[API Error] Request setup error:", error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Métodos HTTP
   */
  public get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public patch<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * Establece el token de autenticación
   */
  public setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Elimina el token de autenticación
   */
  public clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    delete this.client.defaults.headers.common["Authorization"];
  }

  /**
   * Verifica si hay un token de autenticación
   */
  public hasAuthToken(): boolean {
    return !!localStorage.getItem("auth_token");
  }
}

// Exportar instancia única (Singleton)
export const apiClient = new ApiClient();
