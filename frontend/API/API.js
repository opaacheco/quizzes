const baseURL = "http://127.0.0.1:3000/";
// Define a URL base para as requisições da API, que pode ser utilizada para facilitar mudanças futuras na URL.

class API {
  // Classe utilitária para fazer chamadas à API, abstraindo os métodos HTTP.

  static async get(endpoint, params) {
    // Método GET, usado para buscar informações do servidor.
    const response = await fetch(
      baseURL + endpoint + new URLSearchParams(params),
      { credentials: "include" }
    );
    // Concatena o endpoint e os parâmetros da URL. Inclui `credentials` para enviar cookies/sessão.

    return this.treatResponse(response);
    // Trata a resposta usando um método centralizado.
  }

  static async post(endpoint, params) {
    // Método POST, usado para enviar dados ao servidor.
    const response = await fetch(baseURL + endpoint, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(params)),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      // Inclui credenciais para permitir autenticação baseada em sessão.
    });

    if (endpoint == "login") {
      if (response.ok) {
        // Se o login for bem-sucedido, redireciona para a página principal.
        window.location.href = "/frontend/home/home.html";
      }
    } else {
      if (response.ok) {
        // Em outras requisições bem-sucedidas, redireciona para a página de login.
        window.location.href = "/frontend/login/login.html";
      }
    }

    return this.treatResponse(response);
    // Trata a resposta com o método genérico.
  }

  static async put(endpoint, params) {
    // Método PUT, usado para atualizar recursos no servidor.
    const response = await fetch(baseURL + endpoint, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(params)),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return this.treatResponse(response);
    // Trata a resposta com o método genérico.
  }

  static async delete(endpoint, params) {
    // Método DELETE, usado para excluir recursos no servidor.
    const response = await fetch(baseURL + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return this.treatResponse(response);
    // Trata a resposta com o método genérico.
  }

  static treatResponse(response) {
    // Método para tratar as respostas de forma centralizada.
    if (response.ok) {
      return response.json();
      // Se o status da resposta for "ok" (2xx), retorna os dados em formato JSON.
    }

    if (response.status == 400) {
      return window.location.replace("/frontend/login/login.html");
      // Redireciona para a página de login se a resposta for 400 (erro de requisição).
    }

    if (response.status == 401) {
      return window.location.replace("/frontend/login/login.html");
      // Redireciona para a página de login se a resposta for 401 (não autorizado).
    }

    if (response.status == 422) {
      throw Error("Invalid fields", { cause: response });
      // Lança um erro customizado para campos inválidos.
    }

    throw Error("Unexpected Error", { cause: response });
    // Lança um erro genérico para outros status.
  }
}
