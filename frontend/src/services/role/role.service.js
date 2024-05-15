import ApiService from '@/services/api.service';

const API_GET_ROLES = '/api/roles';
const RoleService = {
    getRoles() {
        return ApiService.get(`${API_GET_ROLES}`);
    }
};

export default RoleService;
