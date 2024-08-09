import { Injectable } from '@angular/core';
import {createClient, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment.development";
import {BehaviorSubject} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;
  userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : 7340248041;

  constructor() {
    this.supabase = createClient(environment.supa_url, environment.supa_anon_key);
    this.supabase
      .channel('user-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'telegram_users' }, (payload) => {
        this.handleUserChange(payload);
      })
      .subscribe();
  }

  handleUserChange(payload: any) {
    this.checkUserById(payload.old.user_id).then(user => {
      localStorage.setItem(this.userId, JSON.stringify(user));
    })
  }
  // Get user
  async checkUserById(userId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('telegram_users')
      .select('* , user_spec(*), user_quests(*), user_exp(*), user_items(*)')
      .eq('user_id', this.userId)
      .order('id', { ascending: true });
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }
  // Create new User
  async createUserById(opt: {}) {
    const { data, error } = await this.supabase
      .from('telegram_users')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }
  // Update User
  async patchUserData(userId:number, opt:{}){
    const {data, error} = await this.supabase
      .from('telegram_users')
      .update(opt)
      .eq('user_id', this.userId)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data[0] : null;
  }
  async getUserSpec(userId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('user_spec')
      .select('*')
      .eq('user_id', this.userId);
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }

  async createUserSpec(userId:number) {
    const { data, error } = await this.supabase
      .from('user_spec')
      .insert([
        { user_id: this.userId,
          str: 3,
          agi: 3,
          int: 3,
          ene: 3,
          vit: 3,
          men: 3,
          points: 3}
      ])
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }

  async patchUserSpec(userId:number, opt: {}){
    const {data, error} = await this.supabase
      .from('user_spec')
      .update(opt)
      .eq('user_id', this.userId)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data[0] : null;
  }

  // --- quesr -- api --- //

  async getQuests(): Promise<any> {
    const { data, error } = await this.supabase
      .from('quests')
      .select('*')
      // .eq('user_id', userId);
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async patchQuests(id: number, opt: {}){
    const {data, error} = await this.supabase
      .from('quests')
      .update(opt)
      .eq('id', id)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data[0] : null;
  }

  async getUserQuests(userId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('user_quests')
      .select('*')
    .eq('user_id', this.userId);
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async patchUserQuests(userId: number, opt: {}){
    const {data, error} = await this.supabase
      .from('user_quests')
      .update(opt)
      .eq('user_id', this.userId)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data : null;
  }
  async createUserQuests(opt: {}) {
    const { data, error } = await this.supabase
      .from('user_quests')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }

  async getQuestAction(userId: number, qqId: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('quests_action')
      .select('*')
      .eq('user_id', this.userId)
      .eq('quest_id', qqId);
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async patchQuestAction(userId: number, opt: {}){
    const {data, error} = await this.supabase
      .from('quests_action')
      .update(opt)
      .eq('user_id', this.userId)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data[0] : null;
  }
  async createQuestAction(opt: any) {
    const { data, error } = await this.supabase
      .from('quests_action')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }
  async deleteQuestAction(userId:number, qqId: number) {
    const { error } = await this.supabase
      .from('quests_action')
      .delete()
      .eq('user_id',this.userId)
      .eq('quest_id', qqId)
    if (error) {
      return null;
    }
    return 'complete delete'
  }

  // --- Experience --- //
  async getUserExp(userId: number) {
    const { data, error } = await this.supabase
      .from('user_exp')
      .select('*')
      .eq('user_id', this.userId);
    if (error) {
      return error.message;
    }
    return data.length ? data : null;
  }
  async patchUserExp(userId: number, opt: {}){
    const {data, error} = await this.supabase
      .from('user_exp')
      .update(opt)
      .eq('user_id', this.userId)
      .select()
    if (error) {
      return error.message;
    }
    return data.length ? data[0] : null;
  }
  async createUserExp(opt: any) {
    const { data, error } = await this.supabase
      .from('user_exp')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }

// --- new Shop - get - patch - post - delete --- //
  async getShopItems() {
    const { data, error } = await this.supabase
      .from('items')
      .select('*');
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
// --- User uquip --- //
  async getUserItems() {
    const { data, error } = await this.supabase
      .from('user_items')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async patchUserItems(userId: number, itemId:number, opt: {}) {
    const { data, error } = await this.supabase
      .from('user_items')
      .update(opt)
      .eq('user_id', this.userId)
      .eq('id', itemId)
      .select()
      .order('id', { ascending: true });
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async createUserItems(opt: any) {
    const { data, error } = await this.supabase
      .from('user_items')
      .insert(opt)
      .select()
    if (error) {
      return error;
    }
    return data.length ? data : null;
  }
  async deleteUserItems(userId:number, itemId: number) {
    const { error } = await this.supabase
      .from('user_items')
      .delete()
      .eq('user_id',this.userId)
      .eq('id', itemId)
    if (error) {
      return null;
    }
    return 'complete delete'
  }

}
