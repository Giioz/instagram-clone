export class SavePostService {
  private static baseUrl = '/api/save-posts';

  private static getAuthHeaders(): HeadersInit {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  static async savePost(postId: number): Promise<{ message: string }> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      } else {
        throw new Error('Authentication required or server error');
      }
    }

    return response.json();
  }

  static async unsavePost(postId: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}?postId=${postId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unsave post');
      } else {
        throw new Error('Authentication required or server error');
      }
    }

    return response.json();
  }

  static async getSavedPosts(): Promise<any[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get saved posts');
      } else {
        throw new Error('Authentication required or server error');
      }
    }

    return response.json();
  }
}