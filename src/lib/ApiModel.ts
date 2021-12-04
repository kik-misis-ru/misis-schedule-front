import * as ApiHelper from "./ApiHelper";

import {addUserToPushNotification} from './ApiHelper'


// export interface IUserModel {
//   engGroup: string
//   filialId: string
//   groupId: string
//   subGroup: string
//   teacherId: string
//   userId: string
// }

export interface IPushSettings {
  Hour: number
  Minute: number
  IsActive: boolean
}


export class ApiModel {
  public userId: string | undefined
  public user: ApiHelper.IUserData | undefined
  public pushSettings: IPushSettings 

  constructor() {
    this.pushSettings ={
      Hour: -1,
      Minute: -1,
      IsActive: false
    }
  }

  public async AddPush(){
    if(this.pushSettings != undefined && this.userId != undefined){
      addUserToPushNotification(this.userId, this.pushSettings)
    }
  }

  // public async fetchUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  public async fetchUser(userId: string): Promise<void> {
    if (this.userId === userId && this.user) return;

    // try {
    const apiResult = await ApiHelper.getUser(userId);
    this.user = apiResult === '0' ? undefined : apiResult
    this.userId = userId; // устанавливаем только если данные были получены без ошибки
    // return this.user;
    // } 
  }

  // protected async _dbGetUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  //   const apiResult = await ApiHelper.getUser(userId)
  //   this.user = apiResult === '0' ? undefined : apiResult
  //   return this.user;
  // }
  //
  // protected _localGetUser(/*userId: string*/): ApiHelper.IUserData | undefined {
  //   // предполагаем, что userId не изменяется во время работы приложения
  //   return this.user;
  // }
  //
  // protected async _lazyGetUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  //   let result = this._localGetUser(/*userId*/);
  //   if (!result) {
  //     result = await this._dbGetUser(userId)
  //   }
  //   return result;
  // }
  //
  // protected _transformUser(user: ApiHelper.IUserData | undefined): IUserModel | undefined {
  //   return user
  //     ? {
  //       engGroup: user.eng_group,
  //       filialId: user.filial_id,
  //       groupId: user.group_id,
  //       subGroup: user.subgroup_name,
  //       teacherId: user.teacher_id,
  //       userId: user.teacher_id,
  //     }
  //     : undefined;
  // }
  //
  // public async getUser(userId: string): Promise<IUserModel | undefined> {
  //   return this._transformUser(await this._lazyGetUser(userId));
  // }

}


export default ApiModel
