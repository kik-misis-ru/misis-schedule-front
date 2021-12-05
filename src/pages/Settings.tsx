import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container, 
  Row, 
  Col, 
  Button, 
  DeviceThemeProvider, 
  Headline3, 
  Headline2, 
  TextBoxRoot, 
  Headline4, 
  HeaderContent,
  TextBoxBigTitle,
  TextBox,
  Caption,
  Switch,
  TimePicker,
  TextBoxLabel,
  TextField,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderRoot,
  HeaderMinimize
} from "@sberdevices/plasma-ui";
import {IconEdit} from "@sberdevices/plasma-icons";
import {
  AssistantSendAction,
} from '../types/AssistantSendAction.d'

import logo from "../images/App Icon.png";
import {
  ApiModel,
  IStudentSettings,
  ITeacherSettings,
  IStudentValidation,
  ITeacherValidation
} from '../lib/ApiModel'
import {AssistantWrapper} from '../lib/AssistantWrapper'
import {
  getThemeBackgroundByChar,
} from '../themes/tools';
import {Spacer100} from '../components/Spacers'
import {DocStyle} from '../themes/tools';
import {CharacterId} from "../types/base";
import TabSelectorRow from '../components/Home/TabSelectorRow'
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
  character: CharacterId
  description: string
  sendAssistantData: (action: AssistantSendAction) => void
  onDashboardClick: () => void
  theme: string
  toggleTheme: () => void
  apiModel: ApiModel
  assistant: AssistantWrapper
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
  studentSettings: IStudentSettings
  teacherSettings: ITeacherSettings
  studentValidation: IStudentValidation
  teacherValidation: ITeacherValidation
  IsStudent: boolean
}

class Settings extends React.Component<SettingsProps, SettingsState> {


  componentDidMount() {
    this.props.assistant.on('action-group', (group) => {
      console.log('action-group', group)
    })
    this.props.assistant.on('action-subGroup', (subGroup) => {
      let settings = this.state.studentSettings
      this.setState({studentSettings: 
        {groupName: settings.groupName,
        engGroupName: settings.engGroupName,
        subGroupName: subGroup
        }})
    })
    this.props.assistant.on('action-engGroup', (engGroup) => {
      let settings = this.state.studentSettings
      this.setState({studentSettings: 
        {groupName: settings.groupName,
        engGroupName: engGroup,
        subGroupName: settings.subGroupName
        }})
    })
    this.props.assistant.on('show_schedule', async () => {
      await this.Save()
    })
    
  }

  constructor(props: SettingsProps) {
    super(props);
    this.Save = this.Save.bind(this);
    let pushSettings = this.props.apiModel.pushSettings
    let user = this.props.apiModel.user;
    this.state = {disabled: pushSettings.IsActive,
      timePush: {
        hour:  pushSettings.Hour == -1 ? 1 : pushSettings.Hour,
        min: pushSettings.Minute == -1 ? 1 : pushSettings.Minute,
        value: new Date(1629996400000-68400000-2760000 + pushSettings.Hour * 3600000 + pushSettings.Minute * 60000)
      },
      edit: !this.props.apiModel.isSavedUser,
      theme: false,
      themeName: this.props.theme,
      studentSettings:{
        groupName: user?.group==undefined? "" : user.group,
        subGroupName: user?.subgroup_name==undefined? "" : user.subgroup_name,
        engGroupName: user?.eng_group==undefined? "" : user.eng_group,
      },
      IsStudent: this.props.apiModel.isStudent,
      teacherSettings:{
        initials: user?.teacher == undefined ? "" : user.teacher
      },
      studentValidation: {
        IsGroupNameError: false, 
        IsSubGroupError: false,
        IsEngGroupError: false},
      teacherValidation : {IsInitialsError: false}
    };
  }

  async Save() {
      console.log(this.state.timePush.value.getHours(), this.state.timePush.value.getMinutes(), "SETTINGS")
      this.state.timePush.hour=Number(this.state.timePush.value.getHours());
      this.state.timePush.min=Number(this.state.timePush.value.getMinutes());
      console.log(this.state.timePush.value, Number(this.state.timePush.value.getHours()), Number(this.state.timePush.value.getMinutes()), "TIMEPUSH");
      if(this.state.IsStudent){
        let studentValidation = await this.props.apiModel.CheckIsCorrectStudent(this.state.studentSettings, true)
        await this.setState({studentValidation: studentValidation})
        if(!studentValidation.IsGroupNameError && !studentValidation.IsSubGroupError && !studentValidation.IsEngGroupError){
          await this.props.apiModel.LoadSchedule(true)
          this.setState({edit: false })
         }
      }

      else{
        this.props.apiModel.CheckIsCorrectTeacher(this.state.teacherSettings, true).then((response)=>{
          console.log("response.IsInitialsError", response.IsInitialsError)
          if(!response.IsInitialsError){
            this.setState({edit: false })
          }
          else{
            this.setState({teacherValidation: {IsInitialsError: true}})
          }
        })
      }
     // if (!this.props.isTeacherError && !this.props.student) this.setState({edit: false })
     //console.log("CHECK",!this.props.isTeacherError && !this.props.student)
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
        <Row style={{margin: "1em", marginLeft: "5%", marginRight: "5%"}}>
        <HeaderRoot>
              <HeaderBack onClick={() => this.props.onDashboardClick()} />
            <HeaderLogo src={logo} alt="Logo" onClick={() => this.props.onDashboardClick()}/>
            <HeaderTitleWrapper>
              <HeaderTitle>Настройки</HeaderTitle>
            </HeaderTitleWrapper>
            <HeaderContent>
              {!this.state.edit ? (  <Button size="s" view="clear" contentLeft={<IconEdit />} onClick={()=>{this.Edit()}}/>
) : (<div></div>)}
            </HeaderContent>
        </HeaderRoot>
      

</Row >

          { this.state.edit ? (
            <Row style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", margin: "0 0 1.5em 0"}}>
              <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.state.IsStudent ? 0 : 1}
          onSelect={(tabIndex) => this.setState({IsStudent: tabIndex === 0})}
        />
        { this.state.IsStudent ?
          <Col size={4} style={{marginTop: "1em"}}>
           <TextFieldForUserInfo
          label={LABEL_GROUP}
          isError={this.state.studentValidation.IsGroupNameError}
          value={this.state.studentSettings.groupName}
          onChange={(value) => this.setState({studentSettings: 
            {groupName: value,
            subGroupName: this.state.studentSettings.subGroupName,
          engGroupName: this.state.studentSettings.engGroupName}})}
        />

        <TextFieldForUserInfo
          label={LABEL_SUB_GROUP}
          isError={this.state.studentValidation.IsSubGroupError}
          value={this.state.studentSettings.subGroupName}
          onChange={(value) =>  this.setState(
            {studentSettings: 
            {groupName: this.state.studentSettings.groupName,
            subGroupName: value,
          engGroupName: this.state.studentSettings.engGroupName}})}
        />

        <TextFieldForUserInfo
          label={LABEL_ENG_GROUP}
          isError={this.state.studentValidation.IsEngGroupError}
          value={this.state.studentSettings.engGroupName}
          onChange={(value) =>  this.setState({studentSettings: 
            {groupName: this.state.studentSettings.groupName,
            subGroupName: this.state.studentSettings.subGroupName,
          engGroupName: value}})}
        />
          </Col> :
          <Col size={4}>
           <TextFieldForUserInfo
          label={LABEL_TEACHER}
          value={this.state.teacherSettings.initials}
          isError={this.state.teacherValidation.IsInitialsError}
          onChange={(value) => this.setState({teacherSettings: {initials: value}})}
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
      <TimePicker
        style={{margin:"0.5em"}}
        visibleItems={3}
        min={new Date(1629925240000)}
        max={new Date(1630011580000)}
        value={this.state.timePush.value}
        options={{ hours: true, minutes: true, seconds: false}}
        onChange={((value: Date) => this.state.timePush.value=value)}
      ></TimePicker>
       </Col>: <div></div>}
       {/* <Switch style={{ margin: "1em" }} label="Включить светлую тему"  checked={this.state.theme} onChange={(() => {this.props.toggleTheme(); this.setState({theme: !this.state.theme})})}/> */}
      <Col size={4} style={{display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"}}>
      <Button
        size="m"
        view="primary"
        style={{margin:"0.5em"}}
        onClick={ async ()=> await this.Save() }
      >Сохранить</Button>
        <Button
          size="m"
          style={{margin: "0.5em"}}
          onClick={() => {
            this.setState({edit: false});
          }}>Отмена</Button>
      </Col>
      </Row>) : (
        <Row style={{margin: "1em"}}>
          <Col size={12}>
        <Headline2 style={{margin: "0 0 1em 0"}}> Мои параметры </Headline2>
          </Col>
          {
            this.state.IsStudent && this.state.studentSettings.groupName!=""

              ? (<Col size={10}>

                { this.state.studentSettings.groupName != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер академической группы
                  </TextBoxLabel>
                  <Headline4>{ this.state.studentSettings.groupName} </Headline4>
                </TextBox> : <div></div> }
                { this.state.studentSettings.subGroupName != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер подгруппы
                  </TextBoxLabel>
                  <Headline4>{ this.state.studentSettings.subGroupName} </Headline4>
                </TextBox> : <div></div> }
                {this.state.studentSettings.engGroupName != "" ?
                 <TextBox>
                  <TextBoxLabel >
                    Номер группы по английскому
                  </TextBoxLabel>
                  <Headline4>{this.state.studentSettings.engGroupName} </Headline4>
                </TextBox> : <div></div> }

                  </Col>
              )
              : (<Col size={10}>
                {this.state.teacherSettings.initials != "" ?
                <TextBox>
                  <TextBoxLabel>
                   ФИО
                  </TextBoxLabel>
                  <Headline4>{this.state.teacherSettings.initials}</Headline4>
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
