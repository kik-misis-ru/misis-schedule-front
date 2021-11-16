import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider, Headline3, Headline2, TextBoxRoot, Headline4} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  Caption,
  Switch,
  TimePicker,
  TextBoxLabel,
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronLeft, IconEdit, IconHouse} from "@sberdevices/plasma-icons";
import {
  AssistantSendAction,
} from '../types/AssistantSendAction.d'
import {
  addUserToPushNotification,
} from "../APIHelper";
import {
  getThemeBackgroundByChar,
} from '../themes/tools';
import {
  // NAVIGATOR_PAGE_NO,
  DASHBOARD_PAGE_NO,
  SCHEDULE_PAGE_NO,
  Spacer100,
} from '../App';
import {DocStyle} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character} from "../types/base";
import Main from '../components/Home/Main';
import TabSelectorRow from '../components/Home/TabSelectorRow'
import {ShowScheduleButtonRow} from '../components/Home/ShowScheduleButtonRow'
import {RememberCheckboxRow} from '../components/Home/RememberCheckboxRow'
import {GoToDashboardButton, GoToScheduleButton} from "../components/TopMenu";
import {
  HeaderLogoCol,
  HeaderTitleCol2,
} from '../components/TopMenu';
import { connected } from "process";
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



export const USER_MODES = [
  'Студент',
  'Преподаватель',
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
  character: Character
    // todo paramoy
    | typeof CHAR_TIMEPARAMOY
  bd: string
  teacher_bd: string
  checked: boolean
  description: string
  sendData: (action: AssistantSendAction) => void
  onDashboardClick: () => void
  onSetValue: (key: string, value: any) => void
  onValidateInput: () => void
  onHandleTeacherChange: (isSave: boolean) => Promise<boolean>
  // handleTeacherChange
  onConvertIdInGroupName: () => void
  group: string
  isGroupError: boolean
  theme: string 
  ChangeTheme: () => void
  ChangePush: (hour: number, min: number, isActive: boolean) => void
  subGroup: string
  isSubGroupError: boolean
  isActive: boolean
  pushHour: number
  pushMin: number
  engGroup: string
  isEngGroupError: boolean
  CheckIsCorrect: () => Promise<boolean>
  LoadSchedule: () => void
  student: boolean
  teacher: string
  isTeacherError: boolean
  teacher_checked: boolean
}

interface SettingsState {
  disabled: boolean
  edit: boolean
  timePush: {
    hour: number,
    min: number,
    value: Date
  }
  theme: boolean
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
    this.state = {disabled: this.props.isActive,
      timePush: {
        hour:  this.props.pushHour == -1 ? 1 : this.props.pushHour,
        min: this.props.pushMin == -1 ? 1 : this.props.pushMin,
        value: new Date(1629996400000-68400000-2760000 + this.props.pushHour * 3600000 + this.props.pushMin * 60000)
      },
      edit: edit,
      theme: false,
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

  async isCorrect() {
      console.log(this.props.student, "PROPS.STUDENT");
     this.props.student ? await this.props.onValidateInput() : this.onHandleTeacherChange(true)
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
  
     console.log("CHECK",!this.props.isTeacherError && !this.props.student)
      this.props.ChangePush(this.state.timePush.hour, this.state.timePush.min, this.state.disabled);
    addUserToPushNotification(this.props.userId, this.state.timePush.hour, this.state.timePush.min, this.state.disabled)
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
    console.log(this.props.isTeacherError, "ISTEACHERERROR")
    console.log(this.state.timePush.value, this.props.theme);
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.props.character, this.props.theme)
        }
        <Container style={{padding: "0", overflow: "hidden"}}>
        <Row style={{margin: "1em"}}>

<Button size="s" view="clear" contentLeft={<IconChevronLeft/>} onClick={() => this.props.onDashboardClick()} />

<HeaderTitleCol2
  title="Настройки"
/>

<Col style={{margin: "0 0 0 auto"}}>
  <Button size="s" view="clear" contentLeft={<IconEdit />} onClick={()=>{this.Edit()}}/>
</Col>

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
          <Switch style={{ margin: "1em" }} label="Включить пуш-уведомления " description="Напоминания о парах" checked={this.state.disabled} onChange={(() => {this.props.sendData({
                action_id: 'settings',
              }); this.setState({disabled: !this.state.disabled}); })}/>
          {this.state.disabled ?
          <Col style={{display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"}}>
          
          <Caption style={{textAlign: "center", margin: "0.5em 0.5em 0 0.5em", color: "grey"}}>Время, в которое будут приходить напоминания о завтрашних парах</Caption>
          <TimePicker style={{margin:"0.5em"}}
          visibleItems={3}  min={new Date(1629996400000-68400000-2760000)} max={new Date(1630000000000+10800000+780000)} value={this.state.timePush.value} options={{ hours: true, minutes: true, seconds: false}} onChange={((value: Date) => this.state.timePush.value=value)}></TimePicker>
       </Col>: <div></div>}
       <Switch style={{ margin: "1em" }} label="Включить светлую тему"  checked={this.state.theme} onChange={(() => {this.props.ChangeTheme(); this.setState({theme: !this.state.theme})})}/>
      <Col size={4} style={{display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"}}>
      <Button size="m" view="primary" style={{margin:"0.5em"}} onClick={ async ()=> await this.Save() }>Сохранить</Button>
      <Button size="m" style={{margin:"0.5em"}} onClick={()=>{this.setState({edit: false});  }}>Отмена</Button>
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
                 <Headline4>{this.state.timePush.hour}:{this.state.timePush.min}</Headline4>
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
      <div style={{height: "100px", width: "100px"}}></div>
         <Spacer100/>
         </Container>
      </DeviceThemeProvider>
    )
  }
}

export default Settings
