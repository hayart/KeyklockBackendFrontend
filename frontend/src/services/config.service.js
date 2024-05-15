import ApiService from '@/services/api.service';

const API_FRONTEND_INFO = '/api/frontend/info';
const AuthInfoService = {
    getAuthInfo() {
        return ApiService.get(API_FRONTEND_INFO);
    },
};

export default AuthInfoService;
