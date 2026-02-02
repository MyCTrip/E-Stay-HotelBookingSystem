import request from './request';

export const authService = {
  login: (email: string, password: string): Promise<{ token: string }> =>
    request.post('/auth/login', { email, password }) as Promise<{ token: string }>,
  register: (email: string, password: string) =>
    request.post('/auth/register', { email, password }),
  me: (): Promise<Record<string, unknown>> =>
    request.get('/auth/me') as Promise<Record<string, unknown>>,
};

export default authService;
