import axios from 'axios';
import { z } from 'zod';
import { supabase } from './supabase';
import { addDays, isAfter } from 'date-fns';

const BASEROW_API_TOKEN = '6nJUw5Gik0gBGBI4Yoq0X85CUhSQHI5v';
const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table/478093/?user_field_names=true';

// Schema for the Baserow table response
const BaserowProxySchema = z.object({
  id: z.number(),
  Name: z.string().optional(),
  Email: z.string().optional(),
  Notes: z.string().optional(),
  Active: z.boolean().optional(),
  Pedido: z.string().optional(),
  Status: z.string().optional(),
  Expiracao: z.string().optional(),
  'Data de Compra': z.string().optional(),
});

type BaserowProxy = z.infer<typeof BaserowProxySchema>;

interface ParsedProxy {
  ip: string;
  port: number;
  username: string;
  password: string;
}

export interface ProxyItem {
  id: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  status: 'active' | 'expired';
  expires_at: string;
  purchase_date?: string;
  email?: string;
  order?: string;
  name?: string;
  notes?: string;
}

export class BaserowAPI {
  private async request<T>(): Promise<T> {
    try {
      const response = await axios.get(BASEROW_API_URL, {
        headers: {
          'Authorization': `Token ${BASEROW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data as T;
    } catch (error) {
      console.error('Baserow API request error:', error);
      throw new Error('Failed to fetch data from Baserow');
    }
  }

  private parseProxyString(proxyStr: string): ParsedProxy[] {
    try {
      return proxyStr.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove any numbering prefix (e.g., "1. ")
          line = line.replace(/^\d+\.\s*/, '');
          
          const parts = line.split(/[@:]/).filter(Boolean);
          
          if (parts.length === 4) {
            let username, password, ip, port;
            
            if (line.includes('@')) {
              [username, password, ip, port] = parts;
            } else {
              [ip, port, username, password] = parts;
            }

            // Clean up username by removing any numbering prefix
            username = username.replace(/^\d+\.\s*/, '');

            return {
              username,
              password,
              ip,
              port: parseInt(port, 10)
            };
          }
          
          return null;
        })
        .filter((proxy): proxy is ParsedProxy => 
          proxy !== null && 
          !isNaN(proxy.port) && 
          proxy.ip && 
          proxy.username && 
          proxy.password
        );
    } catch (error) {
      console.error('Error parsing proxy string:', error);
      return [];
    }
  }

  private calculateExpirationDate(purchaseDate: string): string {
    const purchase = new Date(purchaseDate);
    return addDays(purchase, 30).toISOString();
  }

  private isProxyActive(purchaseDate: string): boolean {
    if (!purchaseDate) return false;
    const expirationDate = this.calculateExpirationDate(purchaseDate);
    return isAfter(new Date(expirationDate), new Date());
  }

  async getUserProxies(email: string): Promise<ProxyItem[]> {
    try {
      // First try to get from Supabase
      const { data: proxyFastData, error: proxyFastError } = await supabase
        .from('proxy_fast')
        .select('*')
        .eq('email', email)
        .single();

      if (proxyFastData && !proxyFastError) {
        return [{
          id: proxyFastData.id,
          ...proxyFastData.proxy_data,
          email: proxyFastData.email,
          name: proxyFastData.name
        }];
      }

      // If not in Supabase, fetch from Baserow
      const response = await this.request<{ results: BaserowProxy[] }>();
      const userProxies = response.results.filter(item => 
        item.Email?.toLowerCase() === email.toLowerCase()
      );

      if (!userProxies.length) {
        return [];
      }

      const allProxies = userProxies.flatMap(userProxy => {
        if (!userProxy.Notes) return [];

        const parsedProxies = this.parseProxyString(userProxy.Notes);
        return parsedProxies.map((proxy, index): ProxyItem => {
          const purchaseDate = userProxy['Data de Compra'];
          const isActive = this.isProxyActive(purchaseDate || '');
          const expiresAt = purchaseDate ? this.calculateExpirationDate(purchaseDate) : new Date().toISOString();

          return {
            id: `${userProxy.id}-${index}`,
            ip: proxy.ip,
            port: proxy.port,
            username: proxy.username,
            password: proxy.password,
            status: isActive ? 'active' : 'expired',
            expires_at: expiresAt,
            purchase_date: purchaseDate,
            email: userProxy.Email,
            order: userProxy.Pedido,
            name: userProxy.Name,
            notes: userProxy.Notes
          };
        });
      });

      // Store in Supabase for future use
      if (allProxies.length > 0) {
        const { error: insertError } = await supabase
          .from('proxy_fast')
          .insert({
            email: email,
            name: userProxies[0].Name,
            proxy_data: {
              ip: allProxies[0].ip,
              port: allProxies[0].port,
              username: allProxies[0].username,
              password: allProxies[0].password,
              status: allProxies[0].status,
              expires_at: allProxies[0].expires_at,
              purchase_date: allProxies[0].purchase_date,
              notes: allProxies[0].notes
            }
          });

        if (insertError) {
          console.error('Error storing proxy data in Supabase:', insertError);
        }
      }

      return allProxies;
    } catch (error) {
      console.error('Error fetching user proxies:', error);
      throw error;
    }
  }
}

export const baserowApi = new BaserowAPI();