import {inject, Injectable} from '@angular/core';
import {createClient, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment.development";
import {CalculateService} from "./calculate.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;
  userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : 7340248041;

  calcService = inject(CalculateService)

  constructor() {
    this.supabase = createClient(environment.supa_url, environment.supa_anon_key);
    this.supabase
      .channel('user-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'telegram_users' }, (payload) => {
        this.handleUserChange(payload);
      })
      .subscribe();

    this.supabase
      .channel('user-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_boss_actions' }, (payload) => {
        this.userActions(payload.new)
      })
      .subscribe();

  }

  userActions(act: any){
    let step = act.step;
    this.getUserActions(act.battle_id, act.step).then((data: any) => {
      let user_1:any,
          user_2:any,
          usersData: any,
          user_1_params,
          user_2_params,
          step: any;
      console.log(data)
      if(data?.length == 2 && data[data.length - 2].step == data[data.length - 1].step) {
        console.log(data);
        user_1 = data[data.length - 2];
        user_2 = data[data.length - 1];
        step = data[data.length - 1].step;
        usersData = this.getUsersDataBattle(user_1, user_2);


        // створення масиву захисту
        if(user_1.def_type){
          user_1.def = [user_1.action_def, user_1.action_def+1 > 5 ? user_1.action_def+1 - 5 : user_1.action_def+1, user_1.action_def+2 > 5 ? user_1.action_def+2 - 5 : user_1.action_def+2]
        } else user_1.def = [user_1.action_def, user_1.action_def+1]
        if(user_2.def_type){
          user_2.def = [user_2.action_def, user_2.action_def+1 > 5 ? user_2.action_def+1 - 5 : user_2.action_def+1, user_2.action_def+2 > 5 ? user_2.action_def+2 - 5 : user_2.action_def+2]
        } else user_2.def = [user_2.action_def, user_2.action_def+1]

        // опрацювання юзерів
        let interval = setInterval(() => {
          if(usersData?.length == 2) {
            clearInterval(interval);
            let el1: any = this.calcService.calcUserItemsParameters(usersData[0]);
            let el2: any;
            if(usersData[1].user_id) el2 = this.calcService.calcUserItemsParameters(usersData[1])
            user_1_params = this.calcService.concatParameters(usersData[0].user_spec, el1)
            if(!usersData[1].user_id) user_2_params = this.calcService.concatParameters(usersData[1])
            else user_2_params = this.calcService.concatParameters(usersData[1].user_spec, el2)
            user_1_params.level = usersData[0].user_exp.curr_lvl;
            user_1_params.id = usersData[0].user_id;
            user_2_params.level = usersData[1]?.user_id ? usersData[1]?.user_id : usersData[1].id;

            console.log('start 1',user_1_params,user_2_params)
            // перевірка на відповідність удар до блоку
            if(user_1.attack1 && user_2.def.indexOf(user_1.attack1) < 0){
              let resultData = this.calcService.battleBegin(user_1_params, user_2_params, 1, user_1?.attack1)
              let resCalc =this.calcResults(usersData, resultData, 11, user_1_params,user_2_params, step, act.battle_id)
              user_2_params.hp = resCalc;
            } else {
              let resCalc = this.calcResults(usersData, null, 11, user_1_params,user_2_params, step, act.battle_id)
              user_2_params.hp = resCalc;
            }
            console.log('start 2',user_1_params,user_2_params)
            if(user_1.attack2 && user_2.def.indexOf(user_1.attack2) < 0){
                let resultData = this.calcService.battleBegin(user_1_params, user_2_params, 2, user_1?.attack2)
              let resCalc = this.calcResults(usersData, resultData, 12, user_1_params,user_2_params, step, act.battle_id)
              user_2_params.hp = resCalc;
            } else if(user_1.attack2) {
              let resCalc = this.calcResults(usersData, null, 12, user_1_params,user_2_params, step, act.battle_id)
              user_2_params.hp = resCalc;
            }
            console.log('start 3',user_1_params,user_2_params)
            if(user_2.attack1 && user_1.def.indexOf(user_2.attack1) < 0){
              let resultData = this.calcService.battleBegin(user_2_params, user_1_params, 1, user_2.attack1)
              let resCalc = this.calcResults(usersData, resultData, 21,user_2_params,user_1_params, step, act.battle_id)
              user_1_params.hp = resCalc;
            } else {
              let resCalc = this.calcResults(usersData, null, 21,user_2_params,user_1_params, step, act.battle_id)
              user_1_params.hp = resCalc;
            }
            console.log('start 4',user_1_params,user_2_params)
            if(user_2.attack2 && user_1.def.indexOf(user_2.attack2) < 0){
              let resultData = this.calcService.battleBegin(user_2_params, user_1_params, 2, user_2.attack2 )
              let resCalc = this.calcResults(usersData, resultData, 22,user_2_params,user_1_params, step, act.battle_id)
              user_1_params.hp = resCalc;
            } else if(user_2.attack2){
              let resCalc = this.calcResults(usersData, null, 22, user_2_params, user_1_params, step, act.battle_id)
              user_1_params.hp = resCalc;
            }
          }
        }, 500); // Перевірка чи завантажились дані користувачів, якщо ні перезапуск 0.5с
      }
    })

  }

  calcResults(usersData: any,  resultData:any, hit: any, user_1_params:any, user_2_params:any, step:any, battle_id: any){
    console.log(usersData, resultData, hit, user_1_params, user_2_params)
    let hp1:any, hp2:any, mp1: any, mp2:any;
    if(usersData[0].user_id == user_1_params.id) {
      hp1 = user_1_params.hp;
      mp1 = user_1_params.mp;
      hp2 = user_2_params.hp - (resultData ? resultData[2] : 0)
      mp2 = user_2_params.mp;
    } else {
      hp2 = user_1_params.hp;
      mp2 = user_1_params.mp;
      hp1 = user_2_params.hp - (resultData ? resultData[2] : 0)
      mp1 = user_2_params.mp;
    }

    if(hp1 < 0) hp1 = 0;
    if(hp2 < 0) hp2 = 0;

    let opt = {
      user_1: usersData[0].user_id,
      user_1_name: usersData[0].username,
      user_2: usersData[1].user_id ? usersData[1].user_id : usersData[1].id,
      user_2_name: usersData[1].user_id ? usersData[1].username : usersData[1].name,
      hp_1: Math.floor(hp1),
      hp_2: Math.floor(hp2),
      mp_1: Math.floor(mp1),
      mp_2: Math.floor(mp2),
      atk11: hit == 11 && resultData ? 1 : 0,
      atk12: hit == 12 && resultData ? 1 : 0,
      atk21: hit == 21 && resultData ? 1 : 0,
      atk22: hit == 22 && resultData ? 1 : 0,
      def1: (hit == 21 || hit == 22) && !resultData ? 1 : 0,
      def2: (hit == 11 || hit == 12) && !resultData ? 1 : 0,
      cri: resultData ? resultData[3] : 0,
      evas: resultData ? resultData[4] : 0,
      damage: resultData ? resultData[2] : 0,
      step: step,
      battle_id: battle_id
    }
    console.log(opt)
    this.createUserActionResult(opt).then()
    if(usersData[0].user_id == user_1_params.id) return hp2
    else return hp1
  }

  getUsersDataBattle(user1: any, user2: any){
    let users: any = [{}, {}]
    // Отримати свіжу інформацію про користувача
    this.checkUserById(user1.user_id).then((data: any) => users[0] = data)
    if(user2.type == 'boss') this.getAllBosses(user2.user_id).then((data: any) => users[1] = data[0])
    else this.checkUserById(user2.user_id).then((data: any) => users[1] = data[0])
    return users
  }



  devUserId(){
    return window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : 7340248041;
  }

  handleUserChange(payload: any) {
    this.checkUserById(payload.old.user_id).then(user => {
      sessionStorage.setItem(this.userId, JSON.stringify(user));
      sessionStorage.setItem(this.userId+'_exp', JSON.stringify(user.user_exp));
    })
  }
  // Get user
  async checkUserById(userId:any = null): Promise<any> {
    let query = this.supabase
      .from('telegram_users')
      .select('* , user_spec(*), user_quests(*), user_exp(*), user_items(*)')
    if (userId !== null) { query = query.eq('user_id', userId); }
    else {
      query = query.eq('user_id', this.userId);
    }
    const { data, error } = await query;
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

  /*-- Bosses --*/
  async getAllBosses(id: any = null) {
    let query = this.supabase
      .from('bosses')
      .select('*')
      .order('id', { ascending: true })
    if (id !== null) { query = query.eq('id', id); }
    const { data, error } = await query;
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async getUserBoss() {
    const { data, error } = await this.supabase
      .from('user_boss')
      .select('*')
      .eq('user_id', this.userId)
      .eq('status', 'start')
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async createUserBoss(opt: any) {
    const { data, error } = await this.supabase
      .from('user_boss')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data[0] : null;
  }

  async getUserActions(id:any, step: any) {
    const { data, error } = await this.supabase
      .from('user_boss_actions')
      .select('*')
      .eq('battle_id', id)
      .eq('step', step)
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async createUserBossAction(opt: any) {
    const { data, error } = await this.supabase
      .from('user_boss_actions')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  // user action result //
  async createUserActionResult(opt: any) {
    const { data, error } = await this.supabase
      .from('user_actions_result')
      .insert(opt)
      .select()
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }
  async getUserActionsResult(id:any) {
    const { data, error } = await this.supabase
      .from('user_actions_result')
      .select('*')
      .eq('battle_id', id)
    if (error) {
      return null;
    }
    return data.length ? data : null;
  }


}
