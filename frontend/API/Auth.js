class Auth extends API {
  static async login(params) {
    const response = await super.post("login", params);
    return await response.json();
  }
}
