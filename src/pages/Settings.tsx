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

// export const GoToMenuButton = (props) => (
//   <Button
//     size="s"
//     view="clear"
//     onClick={props.onClick}
//     pin="circle-circle"
//     contentRight={
//       <IconHouse size="s" color="inherit"/>
//     }
//   />
// )
//

//class Main extends React.Component {
//  constructor(props) {
//    super(props);
//    this.handleChange         = this.handleChange.bind(this)
//    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
//  }
//
//  handleChange(key, e) {
//    this.props.setValue(key, e);
//  }
//
//  convertIdInGroupName() {
//    this.props.convertIdInGroupName();
//  }
//
//
//  render() {
//    return (
//      <Container style={{ padding: 0 }}>
//
//        <Row>
//          <Col style={{ marginLeft: "auto" }}>
//            <GoToMenuButton
//              onClick={() => {
//                this.handleChange("page", DASHBOARD_PAGE_NO)
//              }}
//            />
//            <GoToScheduleButton
//              onClick={() => {
//                this.props.convertIdInGroupName();
//                this.handleChange("page", SCHEDULE_PAGE_NO)
//              }}
//              disabled={this.props.disabled}
//            />
//          </Col>
//        </Row>
//        <Cell style={{ padding: 0 }}
//              content={this.props.contentRight}>
//        </Cell>
//      </Container>
//    )
//  }
//}


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
  checked: boolean
  description: string
  onDashboardClick: () => void
  onSetValue: (key: string, value: any) => void
  onValidateInput: () => void
  onHandleTeacherChange: () => Promise<void>
  // handleTeacherChange
  onConvertIdInGroupName: () => void
  group: string
  isGroupError: boolean

  subGroup: string
  isSubGroupError: boolean

  engGroup: string
  isEngGroupError: boolean

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
  
}

class Settings extends React.Component<SettingsProps, SettingsState> {

  constructor(props: SettingsProps) {
    super(props);
    
    this.onHandleChange = this.onHandleChange.bind(this);
    //this.Save = this.Save.bind(this);
    // this.handleTeacherChange = this.handleTeacherChange.bind(this);
    this.onConvertIdInGroupName = this.onConvertIdInGroupName.bind(this);
    let disabled = true;
    if (props.groupId !== "") disabled = false;
    let edit=false;
    this.state = {disabled: false,
      timePush: {
        hour: 0,
        min: 0,
        value: new Date()
      },
      edit: false
    };
    this.onHandleChange("description", props.character === "joy"
      ? DESC_JOY
      : DESC_OTHERS)
  }
  

  onHandleChange(key: string, value: any): void {
    this.props.onSetValue(key, value);
  }

  async isCorrect() {
    await this.props.onValidateInput();
  }

  // handleTeacherChange() {
  //   this.props.handleTeacherChange();
  // }

  onConvertIdInGroupName() {
    this.props.onConvertIdInGroupName();
  }
  async Save() {
    this.isCorrect();
    this.state.timePush.hour=Number(this.state.timePush.value.getHours());
    this.state.timePush.min=Number(this.state.timePush.value.getMinutes());
    console.log(this.state.timePush.value, Number(this.state.timePush.value.getHours()), Number(this.state.timePush.value.getMinutes()), "TIMEPUSH");
    if (!this.props.isEngGroupError && !this.props.isGroupError && !this.props.isSubGroupError)
    this.setState({edit: false })
    
    await addUserToPushNotification(this.props.userId, this.state.timePush.hour, this.state.timePush.min).then()
  }

   Edit(){
    var edit = true;
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
    const studentContent = (
      <Container
        style={{padding: 0, overflow: "hidden"}}
      >

        {/* <HomeTitle
          text="Мои данные"
        /> */}

        <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.student ? 0 : 1}
          onSelect={(tabIndex) => this.onHandleChange("student", tabIndex === 0)}
        />

        <HomeDescription
          text={this.props.description}
        />

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

        <RememberCheckboxRow
          label={LABEL_REMEMBER_GROUP}
          checked={this.props.checked}
          onChange={(value) => this.onHandleChange('checked', value)}
        />

        <ShowScheduleButtonRow
          onClick={() => this.props.onValidateInput()}
        />

      </Container>
    );

    const teacherContent = (
      <Container style={{padding: 0}}>

        <HomeTitle
          text={HOME_TITLE}
          // todo: margin: '3%'
        />

        <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.student ? 0 : 1}
          onSelect={(tabIndex) => this.onHandleChange("student", tabIndex === 0)}
        />

        <HomeDescription
          text={LABEL_TO_VIEW_SCHEDULE}
        />

        <TextFieldForUserInfo
          label={LABEL_TEACHER}
          value={this.props.teacher}
          isError={this.props.isTeacherError}
          onChange={(value) => this.onHandleChange('teacher', value)}
        />

        <RememberCheckboxRow
          label={LABEL_REMEMBER_FIO}
          checked={this.props.teacher_checked}
          onChange={(value: boolean) => {
            this.onHandleChange("teacher_checked", value);
          }}
        />

        <ShowScheduleButtonRow
          onClick={() => this.props.onHandleTeacherChange()}
        />

      </Container>
    )
    
    console.log(this.state.timePush.value);
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.props.character, 'dark')
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

          { this.state.edit || this.props.group==""&&this.props.teacher=="" ? (
            <Row style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"}}>
              <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.student ? 0 : 1}
          onSelect={(tabIndex) => this.onHandleChange("student", tabIndex === 0)}
        />
        { this.props.student ? 
          <Col size={4}>
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
          <Switch style={{ margin: "1em" }} label="Включить пуш-уведомления " description="Напоминания о парах" checked={this.state.disabled} onChange={(() => this.setState({disabled: !this.state.disabled}))}/>
          {this.state.disabled ?
          <Col style={{display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"}}>
          <Caption style={{textAlign: "center", margin: "0.5em 0.5em 0 0.5em", color: "grey"}}>Время, в которое будут приходить напоминания о завтрашних парах</Caption>
          <TimePicker style={{margin:"0.5em"}}
          visibleItems={3}  min={new Date(1629996400000-68400000-2760000)} max={new Date(1630000000000+10800000+780000)} value={this.state.timePush.value} options={{ hours: true, minutes: true, seconds: false}} onChange={((value: Date) => this.state.timePush.value=value)}></TimePicker>
       </Col>: <div></div>}
      <Col size={4} style={{display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"}}>
      <Button size="m" view="primary" style={{margin:"0.5em"}} onClick={()=>this.Save() }>Сохранить</Button>
      <Button size="m" style={{margin:"0.5em"}} onClick={()=>this.setState({edit: false}) }>Отмена</Button>
      </Col>
      </Row>) : (
        <Row style={{margin: "1em"}}>
        <Headline2 style={{margin: "0 0 1em 0"}}> Мои данные </Headline2>
                                    {
            this.props.student && this.props.bd!=""
              ? (<TextBox>
                  <TextBoxLabel>
                    Номер академической группы
                  </TextBoxLabel>
                  <Headline4>{this.props.bd} </Headline4>
                  
                  </TextBox>
              )
              : (
                <TextBox> 
                  <TextBoxLabel>
                   ФИО
                  </TextBoxLabel>
                  <Headline4>{this.props.teacher}</Headline4>
                  </TextBox>
               
              ) 
              
          }

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
