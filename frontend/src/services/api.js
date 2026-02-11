const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password, state) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, state }),
    });
  }

  async getUser(userId) {
    return this.request(`/auth/user/${userId}`);
  }

  // Leads endpoints
  async getAllLeads(state, page = 1, limit = 50) {
    const query = new URLSearchParams({ page, limit });
    if (state) query.append('state', state);
    return this.request(`/leads?${query}`);
  }

  async getLeadById(id) {
    return this.request(`/leads/${id}`);
  }

  async getDashboardStats(state) {
    const query = state ? `?state=${encodeURIComponent(state)}` : '';
    return this.request(`/leads/stats${query}`);
  }

  // WhatsApp notification
  async sendNotification(phoneNumber, state) {
    return this.request('/leads/notify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, state }),
    });
  }
}

export default new ApiService();
