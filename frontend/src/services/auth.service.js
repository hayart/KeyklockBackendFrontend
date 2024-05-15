import ApiService from '@/services/api.service';

const API_LOGOUT = 'api/authentication/logout';
const AuthService = {
  async logout() {
    return ApiService.get(`${API_LOGOUT}`, {})
  }
};

export default AuthService;

