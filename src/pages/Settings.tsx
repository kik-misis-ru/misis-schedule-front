import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider, Headline3, Headline2, TextBoxRoot, Headline4} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  Caption,
  Switch,
  TimePicker,
  Tabs,
  TabItem,
  TextBoxLabel,
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronLeft, IconEdit, IconHouse} from "@sberdevices/plasma-icons";
import {
  AssistantSendAction,
} from '../types/AssistantSendAction.d'
import {
  addUserToPushNotification,
} from "../lib/ApiHelper";
import {
  ApiModel
} from '../lib/ApiModel'
import {
  getThemeBackgroundByChar,
} from '../themes/tools';
import {Spacer100,Spacer200,Spacer300} from '../components/spacers'
import {DocStyle} from '../themes/tools';
import {CharacterId} from "../types/base";
import TabSelectorRow from '../components/Home/TabSelectorRow'
import {
  HeaderLogoCol,
  HeaderTitleCol2,
} from '../components/TopMenu';
import internal from "stream";
const HOME_TITLE = 'Салют!';
const DESC_JOY = "Заполни данные, чтобы открывать расписание одной фразой";
const DESC_OTHERS = "Чтобы посмотреть расписание, укажите данные учебной группы";

const LABEL_GROUP = "Номер академической группы через дефисы";
const LABEL_SUB_GROUP = "Номер подгруппы: 1 или 2";
const LABEL_ENG_GROUP = "Число номера группы по английскому";
const LABEL_TEACHER = "Фамилия И. О.";
const LABEL_REMEMBER_FIO = "Запомнить ФИО, если Вы преподаватель ";
const LABEL_TO_VIEW_SCHEDULE = "Чтобы посмотреть расписание, укажите фамилию и инициалы через пробел и точку";
const LABEL_REMEMBER_GROUP = "Запомнить эту группу ";

const LABEL_TEACHER_NOT_FOUND_ERROR ="Такого преподавател нет"
const LABEL_TEACHER_INCORRECT_DATA ="Фамилия И. О."

export const USER_MODES = [
  'Студент',
  'Преподаватель',
];
export const TODAY_TOMORROW = [
  'Сегодня',
  'Завтра',
];

const HomeTitle = ({
                     text,
                   }: {
  text: string
}) => (
  <TextBox>
    <TextBoxBigTitle
      style={{
        margin: '1.5%',
        textAlign: "center",
      }}
    >
      {text}
    </TextBoxBigTitle>
  </TextBox>
)

const HomeDescription = ({
                           text,
                         }: {
  text: string
}) => (
  <TextBox>
    <Caption style={{
      margin: '1.5em',
      textAlign: "center"
    }}>
      {text}
    </Caption>
  </TextBox>

)
const TextFieldForUserInfo = ({
                                label,
                                value,
                                isError,
                                // fieldType,
                                onChange,
                              }: {
  label: string
  value: string
  isError: boolean
  // fieldType: string
  onChange: (value: string) => void
}) => {
  //this.onChange('group', value);
  return (
    <TextField
      // id="tf"
      label={label}
      status={isError ? 'error' : undefined}
      className="editText"
      // placeholder="Напиши номер своей академической группы"
      value={value}
      style={{margin: "0.5em"}}
      // onChange={(event) => {
      //   onChange(fieldType, event.target.value)
      // }}
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}


interface SettingsProps {
  userId: string
  groupId: string
  character: CharacterId
  bd: string
  teacher_bd: string
  checked: boolean
  description: string
  sendAssistantData: (action: AssistantSendAction) => void
  onDashboardClick: () => void
  onSetValue: (key: string, value: any) => void
  onHandleTeacherChange: (isSave: boolean) => Promise<boolean>
  // handleTeacherChange
  onConvertIdInGroupName: () => void
  group: string
  isGroupError: boolean
  theme: string
  ChangeTheme: () => void
  subGroup: string
  isSubGroupError: boolean
  engGroup: string
  isEngGroupError: boolean
  CheckIsCorrect: () => Promise<boolean>
  LoadSchedule: () => void
  student: boolean
  dayPush: number
  teacher: string
  isTeacherError: boolean
  teacher_checked: boolean
  apiModel: ApiModel
}

interface SettingsState {
  disabled: boolean
  edit: boolean
  timePush: {
    hour: number ,
    min: number,
    value: Date
  }
  theme: boolean
  themeName: string
  dayPush: number

}

class Settings extends React.Component<SettingsProps, SettingsState> {

  constructor(props: SettingsProps) {
    super(props);

    this.onHandleChange = this.onHandleChange.bind(this);
    this.Save = this.Save.bind(this);
    this.onConvertIdInGroupName = this.onConvertIdInGroupName.bind(this);
    this.onHandleTeacherChange = this.props.onHandleTeacherChange.bind(this);
    this.Load_Schedule = this.props.LoadSchedule.bind(this)
    console.log()
    let edit=false;
    this.props.group==""&&this.props.teacher=="" ? edit = true : edit= false;
    let pushSettings = this.props.apiModel.pushSettings
    this.state = {disabled: pushSettings.IsActive,
      dayPush: this.props.dayPush,
      timePush: {
        hour:  pushSettings.Hour == -1 ? 1 : pushSettings.Hour,
        min: pushSettings.Minute == -1 ? 1 : pushSettings.Minute,
        value: new Date(1629996400000-68400000-2760000 + pushSettings.Hour * 3600000 + pushSettings.Minute * 60000)
      },
      edit: edit,
      theme: false,
      themeName: this.props.theme,
    };
    this.onHandleChange("description", props.character === "joy"
      ? DESC_JOY
      : DESC_OTHERS)
  }


  onHandleChange(key: string, value: any): void {
    this.props.onSetValue(key, value);
  }
  async onHandleTeacherChange(isSave: boolean) : Promise<boolean>{
    return await this.props.onHandleTeacherChange(isSave);
  }
  async CheckIsCorrect(){
    return await this.props.CheckIsCorrect();
  }
  Load_Schedule(){
    this.props.LoadSchedule()
  }



  // handleTeacherChange() {
  //   this.props.handleTeacherChange();
  // }

  onConvertIdInGroupName() {
    this.props.onConvertIdInGroupName();
  }
  async Save() {
      console.log(this.state.timePush.value.getHours(), this.state.timePush.value.getMinutes(), "SETTINGS")
      this.state.timePush.hour=Number(this.state.timePush.value.getHours());
      this.state.timePush.min=Number(this.state.timePush.value.getMinutes());
      console.log(this.state.timePush.value, Number(this.state.timePush.value.getHours()), Number(this.state.timePush.value.getMinutes()), "TIMEPUSH");
      if(this.props.student){
        let isCorrect = await this.CheckIsCorrect()
        if(isCorrect && this.props.student){
          await this.Load_Schedule()
          this.setState({edit: false })
         }
      }

      else{
        console.log("TEACHER CHECK")
        this.onHandleTeacherChange(true).then((response)=>{
          if(response){
            this.setState({edit: false })
          }
        })
      }
      if (!this.props.isTeacherError && !this.props.student) this.setState({edit: false })
     console.log("CHECK",!this.props.isTeacherError && !this.props.student)
     this.props.apiModel.pushSettings = 
     {
       Hour: this.state.timePush.hour,
       Minute: this.state.timePush.min,
       IsActive:  this.state.disabled
    }
    this.props.apiModel.AddPush()
    if(this.state.disabled){
      this.props.sendAssistantData({
        action_id: 'settings',
      });
    }
  }

   Edit(){
    this.setState({edit: true});
  }
  render() {
    const Push = (
      <Row>
      <Switch style={{ margin: "0" }} label="Включить пуш-уведомления " description="Напоминания о парах"/>
          <TimePicker style={{display: "flex",
      flexDirection: "row",
      justifyContent: "center"}} min={new Date(1629996400000-68400000-2760000)} max={new Date(1630000000000+10800000+780000)} value={this.state.timePush.value} options={{ hours: true, minutes: true, seconds: false}}></TimePicker>
        </Row>
    )

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.props.character, this.props.theme)
        }
        <Container style={{
          padding: 0,
          // overflow: "hidden",
          height: '100%',
          overflow: 'auto',
        }}>
        <Row style={{margin: "1em"}}>

<Button size="s" view="clear" contentLeft={<IconChevronLeft/>} onClick={() => this.props.onDashboardClick()} />

<HeaderTitleCol2
  title="Настройки"
/>
{!this.state.edit ? (
<Col style={{margin: "0 0 0 auto"}}>
  <Button size="s" view="clear" contentLeft={<IconEdit />} onClick={()=>{this.Edit()}}/>
</Col>) : (<div></div>)
  }
</Row >

          { this.state.edit ? (
            <Row style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", margin: "0 0 1.5em 0"}}>
              <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.student ? 0 : 1}
          onSelect={(tabIndex) => this.onHandleChange("student", tabIndex === 0)}
        />
        { this.props.student ?
          <Col size={4} style={{marginTop: "1em"}}>
           <TextFieldForUserInfo
          label={LABEL_GROUP}
          isError={this.props.isGroupError}
          value={this.props.group}
          onChange={(value) => this.onHandleChange('group', value)}
        />

        <TextFieldForUserInfo
          label={LABEL_SUB_GROUP}
          isError={this.props.isSubGroupError}
          value={this.props.subGroup}
          onChange={(value) => this.onHandleChange('subGroup', value)}
        />

        <TextFieldForUserInfo
          label={LABEL_ENG_GROUP}
          isError={this.props.isEngGroupError}
          value={this.props.engGroup}
          onChange={(value) => this.onHandleChange('engGroup', value)}
        />
          </Col> :
          <Col size={4}>
           <TextFieldForUserInfo
          label={LABEL_TEACHER}
          value={this.props.teacher}
          isError={this.props.isTeacherError}
          onChange={(value) => this.onHandleChange('teacher', value)}
        />
          </Col>
        }
          <Switch style={{ margin: "1em" }} label="Включить пуш-уведомления " description="Напоминания о парах" checked={this.state.disabled}
          onChange={(() =>
          {
            this.setState({disabled: !this.state.disabled}, () =>{
              console.log("DISABLED",this.state.disabled)
              if(this.state.disabled){
                this.props.sendAssistantData({
                  action_id: 'push_on',
                });
              }
            });

            })}/>
          {this.state.disabled ?
          <Col style={{display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"}}>
            <Caption style={{textAlign: "center", margin: " 0 0.5em 0.5em 0.5em", color: "grey"}}>Время, в которое каждый день будут приходить напоминания о завтрашних парах</Caption>
      <TimePicker style={{margin:"0.5em"}}
          visibleItems={3}  min={new Date(1629925240000)} max={new Date(1630011580000)} value={this.state.timePush.value} options={{ hours: true, minutes: true, seconds: false}} onChange={((value: Date) => this.state.timePush.value=value)}></TimePicker>
       </Col>: <div></div>}
       {/* <Switch style={{ margin: "1em" }} label="Включить светлую тему"  checked={this.state.theme} onChange={(() => {this.props.ChangeTheme(); this.setState({theme: !this.state.theme})})}/> */}
      <Col size={4} style={{display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"}}>
      <Button size="m" view="primary" style={{margin:"0.5em"}} onClick={ async ()=> await this.Save() }>Сохранить</Button>
      <Button size="m" style={{margin:"0.5em"}} onClick={()=>{this.setState({edit: false});  if (this.state.themeName!=this.props.theme)
      this.props.ChangeTheme();}}>Отмена</Button>
      </Col>
      </Row>) : (
        <Row style={{margin: "1em"}}>
          <Col size={12}>
        <Headline2 style={{margin: "0 0 1em 0"}}> Мои параметры </Headline2>
          </Col>
          {
            this.props.student && this.props.bd!=""

              ? (<Col size={10}>

                {this.props.bd != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер академической группы
                  </TextBoxLabel>
                  <Headline4>{this.props.bd} </Headline4>
                </TextBox> : <div></div> }
                {this.props.subGroup != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер подгруппы
                  </TextBoxLabel>
                  <Headline4>{this.props.subGroup} </Headline4>
                </TextBox> : <div></div> }
                {this.props.engGroup != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер группы по английскому
                  </TextBoxLabel>
                  <Headline4>{this.props.engGroup} </Headline4>
                </TextBox> : <div></div> }

                  </Col>
              )
              : (<Col size={10}>
                {this.props.teacher_bd != "" ?
                <TextBox>
                  <TextBoxLabel>
                   ФИО
                  </TextBoxLabel>
                  <Headline4>{this.props.teacher_bd}</Headline4>
                  </TextBox>
                  : <div></div> }
                  </Col>
              )

          }
          <Col size={10}>
          <TextBox>
          <TextBoxLabel style={{margin: "1em 0 0  0"}}>
                   Уведомления
                  </TextBoxLabel>
          </TextBox>
          {
            this.state.disabled ?
            <TextBox>
                  <Headline4>Вкл. </Headline4>
                  <TextBoxLabel >
                  Время отправки
                 </TextBoxLabel>
                 <Headline4>{this.state.timePush.value.getHours()< 10 ? `0${this.state.timePush.value.getHours()}` : this.state.timePush.value.getHours()}:{this.state.timePush.value.getMinutes()< 10 ? `0${this.state.timePush.value.getMinutes()}` : this.state.timePush.value.getMinutes()}</Headline4>
                  </TextBox>
                  :
                  <TextBox>
                  <Headline4>Выкл.</Headline4>
                  </TextBox>
          }
          </Col>
          </Row>
      )
      }

         <Spacer100/>
         <Spacer100/>

         </Container>
      </DeviceThemeProvider>
    )
  }
}

export default Settings
