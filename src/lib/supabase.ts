import { apiFetch } from './api';

// Create a mock Supabase client that translates requests to our new API
export const supabase = {
  from: (table: string) => {
    return {
      select: (query?: string) => {
        let builder: any = {
          eq: () => builder,
          order: () => builder,
          limit: () => builder,
          single: () => builder,
        };

        builder.then = async (resolve: any, reject: any) => {
          try {
            // Translate the table to our endpoint
            let endpoint = '';
            if (table === 'articles') endpoint = '/articles';
            else if (table === 'podcast_episodes') endpoint = '/episodes';
            else if (table === 'blog_posts') endpoint = '/blogs';
            else if (table === 'contact_messages') endpoint = '/contact';
            else if (table === 'guest_applications') endpoint = '/applications';
            else {
              return resolve({ data: [], error: null });
            }

            // Attempt to hit the new Railway Express backend
            const response = await fetch(`/api${endpoint}`);
            if (!response.ok) throw new Error('API Error');
            const result = await response.json();
            resolve({ data: result.data || [], error: null });
          } catch (error) {
            // If it fails, return error so the fallback data logic triggers
            resolve({ data: null, error });
          }
        };

        return builder;
      },
      insert: (data: any) => {
        let insertBuilder: any = {
          select: () => insertBuilder,
        };
        insertBuilder.then = async (resolve: any) => {
          try {
            let endpoint = '';
            if (table === 'articles') endpoint = '/articles';
            if (!endpoint) return resolve({ data: [data], error: null });

            const response = await fetch(`/api${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(Array.isArray(data) ? data[0] : data)
            });
            const result = await response.json();
            resolve({ data: [result.data], error: null });
          } catch (error) {
            resolve({ data: null, error });
          }
        };
        return insertBuilder;
      },
      update: (data: any) => {
        let updateBuilder: any = {
          eq: () => updateBuilder,
          select: () => updateBuilder,
        };
        updateBuilder.then = async (resolve: any) => {
            resolve({ data: [data], error: null });
        };
        return updateBuilder;
      },
      delete: () => {
        let deleteBuilder: any = {
          eq: () => deleteBuilder,
        };
        deleteBuilder.then = async (resolve: any) => {
            resolve({ data: [], error: null });
        };
        return deleteBuilder;
      }
    };
  },
  functions: {
    invoke: async (functionName: string, options?: any) => {
      try {
        const response = await fetch(`/api/functions/${functionName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options?.body || {})
        });
        const result = await response.json();
        return { data: result.data || result, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};

// Re-export the types
export * from './api';