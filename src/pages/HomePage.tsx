import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  Caption
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronRight, IconHouse} from "@sberdevices/plasma-icons";

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


interface HomeViewProps {
  groupId: string
  character: Character
    // todo paramoy
    | typeof CHAR_TIMEPARAMOY
  // disabled: boolean
  checked: boolean
  description: string
  theme: string 
  onSetValue: (key: string, value: any) => void
  onValidateInput: () => void
  onHandleTeacherChange: (isSave: boolean) => Promise<boolean>
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

interface HomeViewState {
  disabled: boolean
}

class HomePage extends React.Component<HomeViewProps, HomeViewState> {

  constructor(props: HomeViewProps) {
    super(props);
    this.onHandleChange = this.onHandleChange.bind(this)
    // this.handleTeacherChange = this.handleTeacherChange.bind(this);
    this.onConvertIdInGroupName = this.onConvertIdInGroupName.bind(this);
    let disabled = true;
    if (props.groupId !== "") disabled = false;
    this.state = {disabled: disabled}
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

  render() {

    const studentContent = (
      <Container
        style={{padding: 0}}
      >

        {/* <HomeTitle
          text={HOME_TITLE}
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

        {/* <HomeTitle
          text={HOME_TITLE}
          // todo: margin: '3%'
        /> */}

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
          onClick={() => this.props.onHandleTeacherChange(this.props.teacher_checked)}
        />

      </Container>
    )


    return <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character, this.props.theme)
      }
      
      <div>
        {
          this.props.student
            ? (
              <Main
                setValue={this.onHandleChange}
                convertIdInGroupName={this.onConvertIdInGroupName}
                disabled={this.state.disabled}
                contentRight={studentContent}
              />
            )
            : (


              <Main
                setValue={this.onHandleChange}
                convertIdInGroupName={this.onConvertIdInGroupName}
                disabled={this.state.disabled}
                contentRight={teacherContent}
              />
            )
        }
      </div>
    </DeviceThemeProvider>
  }
}

export default HomePage
