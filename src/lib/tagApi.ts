import { supabase } from './supabase';

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export class TagAPI {
  async getTags(userId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }

    return data;
  }

  async createTag(userId: string, name: string, color: string): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ user_id: userId, name, color }])
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      throw new Error('Failed to create tag');
    }

    return data;
  }

  async deleteTag(tagId: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      console.error('Error deleting tag:', error);
      throw new Error('Failed to delete tag');
    }
  }

  async getProxyTags(proxyId: string): Promise<Tag[]> {
    // Get the proxy from proxy_fast first to ensure it exists
    const { data: proxyData, error: proxyError } = await supabase
      .from('proxy_fast')
      .select('id')
      .eq('id', proxyId)
      .single();

    if (proxyError || !proxyData) {
      console.error('Error fetching proxy:', proxyError);
      return [];
    }

    const { data, error } = await supabase
      .from('proxy_tags')
      .select(`
        tag_id,
        tags (*)
      `)
      .eq('proxy_id', proxyId);

    if (error) {
      console.error('Error fetching proxy tags:', error);
      throw new Error('Failed to fetch proxy tags');
    }

    return data.map(item => item.tags);
  }

  async addTagToProxy(proxyId: string, tagId: string): Promise<void> {
    // Verify the proxy exists in proxy_fast
    const { data: proxyData, error: proxyError } = await supabase
      .from('proxy_fast')
      .select('id')
      .eq('id', proxyId)
      .single();

    if (proxyError || !proxyData) {
      console.error('Error verifying proxy:', proxyError);
      throw new Error('Invalid proxy ID');
    }

    const { error } = await supabase
      .from('proxy_tags')
      .insert([{ proxy_id: proxyId, tag_id: tagId }]);

    if (error) {
      console.error('Error adding tag to proxy:', error);
      throw new Error('Failed to add tag to proxy');
    }
  }

  async removeTagFromProxy(proxyId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('proxy_tags')
      .delete()
      .eq('proxy_id', proxyId)
      .eq('tag_id', tagId);

    if (error) {
      console.error('Error removing tag from proxy:', error);
      throw new Error('Failed to remove tag from proxy');
    }
  }
}

export const tagApi = new TagAPI();