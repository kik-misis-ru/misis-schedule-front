import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronRight, IconHouse} from "@sberdevices/plasma-icons";

import {
  getThemeBackgroundByChar,
} from '../themes/tools';
import {
  NAVIGATOR_PAGE_NO,
  DASHBOARD_PAGE_NO, MyDiv100, SCHEDULE_PAGE_NO,
} from '../App';
import {DocStyle} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character} from "../types/base.d";
import Main from './Home/Main';
import TabSelector from './Home/TabSelector'
import {ShowSchedule} from './Home/ShowSchedule'
import {RememberDataCheckbox} from './Home/RememberDataCheckbox'

const HOME_TITLE = 'Салют!';
const DESC_JOY = "Заполни данные, чтобы открывать расписание одной фразой";
const DESC_OTHERS = "Чтобы посмотреть расписание, укажите данные учебной группы";

const LABEL_GROUP = "Номер академической группы через дефисы";
const LABEL_SUB_GROUP = "Номер подгруппы: 1 или 2";
const LABEL_ENG_GROUP = "Число номера группы по английскому";
const LABEL_TEACHER = "Фамилия И. О.";
const LABEL_REMEMBER_FIO = "Запомнить ФИО, если Вы преподаватель ";
const LABEL_TO_VIEW_SCHEDULE = "Чтобы посмотреть расписание, укажите фамилию и инициалы через пробел и точку";
const LABEL_REMEBER_GROUP = "Запомнить эту группу ";

export const USER_MODES = [
  'Студент',
  'Преподаватель',
];

const HomeTitle = ({text}: { text: string }) => (
  <TextBox>
    <TextBoxBigTitle style={{margin: '1.5%', textAlign: "center"}}>
      {text}
    </TextBoxBigTitle>
  </TextBox>
)

export const GoToMenuButton = (props) => (
  <Button
    size="s"
    view="clear"
    onClick={props.onClick}
    pin="circle-circle"
    contentRight={
      <IconHouse size="s" color="inherit"/>
    }
  />
)

export const GoToScheduleButton = ({
                                     disabled,
                                     onClick,
                                   }: {
  disabled: boolean
  onClick: React.MouseEventHandler<HTMLElement>
}) => (
  disabled
    ? <Button
      view="clear"
      disabled={disabled}
    />
    : <Button
      view="clear"
      onClick={onClick}
      contentRight={
        <IconChevronRight size="s" color="inherit"/>
      }
      size="s"
      pin="circle-circle"
      style={{marginTop: "1em", marginRight: "1em"}}
    />
)

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
//                this.handleChange("page", 17)
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
      style={{margin: "1em"}}
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

  setValue: (key: string, value: any) => void
  validateInput: () => void
  // handleTeacherChange
  convertIdInGroupName: () => void

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

class HomeView extends React.Component<HomeViewProps, HomeViewState> {

  constructor(props: HomeViewProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    // this.handleTeacherChange = this.handleTeacherChange.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    let disabled = true;
    if (props.groupId !== "") disabled = false;
    this.state = {disabled: disabled}
    this.handleChange("description", props.character === "joy"
      ? DESC_JOY
      : DESC_OTHERS)
  }

  handleChange(key: string, value: any): void {
    this.props.setValue(key, value);
  }

  // handleTeacherChange() {
  //   this.props.handleTeacherChange();
  // }

  convertIdInGroupName() {
    this.props.convertIdInGroupName();
  }

  render() {
    return <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character)
      }
      <div>
        {
          this.props.student
            ? (
              <Main
                setValue={this.handleChange}
                convertIdInGroupName={this.convertIdInGroupName}
                disabled={this.state.disabled}
                contentRight={
                  <Container style={{padding: 0}}>

                    <HomeTitle
                      text={HOME_TITLE}
                    />

                    <TabSelector
                      tabs={USER_MODES}
                      selectedIndex={this.props.student ? 0 : 1}
                      onSelect={(tabIndex) => this.handleChange("student", tabIndex === 0)}
                    />

                    <TextBox>
                      <TextBoxSubTitle style={{
                        margin: '1.5em',
                        textAlign: "center",
                        color: "white"
                      }}>
                        {this.props.description}
                      </TextBoxSubTitle>
                    </TextBox>

                    <TextFieldForUserInfo
                      label={LABEL_GROUP}
                      isError={this.props.isGroupError}
                      value={this.props.group}
                      onChange={(value) => this.handleChange('group', value)}
                    />

                    <TextFieldForUserInfo
                      label={LABEL_SUB_GROUP}
                      isError={this.props.isSubGroupError}
                      value={this.props.subGroup}
                      onChange={(value) => this.handleChange('subGroup', value)}
                    />

                    <TextFieldForUserInfo
                      label={LABEL_ENG_GROUP}
                      isError={this.props.isEngGroupError}
                      value={this.props.engGroup}
                      onChange={(value) => this.handleChange('engGroup', value)}
                    />

                    <Row style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      margin: "1.1em"
                    }}>
                      <RememberDataCheckbox
                        label={LABEL_REMEBER_GROUP}
                        checked={this.props.checked}
                        onChange={(value) => this.handleChange('checked', value)}
                      />
                    </Row>

                    <ShowSchedule
                      onClick={() => this.props.validateInput()}
                    />

                  </Container>
                }
              />
            )
            : (
              <Container style={{padding: 0}}>

                <Row>
                  <Col style={{marginLeft: "auto"}}>
                    <GoToMenuButton
                      onClick={() => {
                        this.handleChange("page", NAVIGATOR_PAGE_NO)
                      }}
                    />
                    <GoToScheduleButton
                      onClick={() => {
                        this.props.convertIdInGroupName();
                        this.handleChange("page", SCHEDULE_PAGE_NO)
                      }}
                      disabled={this.state.disabled}
                    />
                  </Col>
                </Row>

                <div>

                  <TextBox>
                    <TextBoxBigTitle style={{margin: '3%', textAlign: "center"}}>Салют! </TextBoxBigTitle>
                  </TextBox>

                  <TabSelector
                    tabs={USER_MODES}
                    selectedIndex={this.props.student ? 0 : 1}
                    onSelect={(tabIndex) => this.handleChange("student", tabIndex === 0)}
                  />

                  <TextBox>
                    <TextBoxSubTitle style={{margin: '1.5em', textAlign: "center", color: "white"}}>
                      {LABEL_TO_VIEW_SCHEDULE}
                    </TextBoxSubTitle>
                  </TextBox>

                  <TextFieldForUserInfo
                    label={LABEL_TEACHER}
                    value={this.props.teacher}
                    isError={this.props.isTeacherError}
                    onChange={(value) => this.handleChange('teacher', value)}
                  />

                  <Row style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    margin: "1.1em"
                  }}
                  >
                    <RememberDataCheckbox
                      label={LABEL_REMEMBER_FIO}
                      checked={this.props.teacher_checked}
                      onChange={(value: boolean) => {
                        this.handleChange("teacher_checked", value);
                      }}
                    />
                  </Row>

                  <ShowSchedule
                    onClick={() => this.props.validateInput()}
                  />

                </div>
                <MyDiv100/>
              </Container>
            )
        }
      </div>
    </DeviceThemeProvider>
  }
}

export default HomeView
