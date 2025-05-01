export class AuthService {
    static login(username: string, password: string): string {
      // mock credentials
      if (username === 'admin' && password === 'password') {
        return 'mock-token';
      }
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }
  }
  