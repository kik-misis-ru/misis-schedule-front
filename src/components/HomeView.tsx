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
  DASHBOARD_PAGE_NO,
} from '../App';
import {DocStyle} from '../themes/tools';
import {Character} from "../types/base";
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
                                status,
                                value,
                                fieldType,
                                onChange,
                              }: {
  label: string
  status: string
  value: string
  fieldType: string
  onChange: (fieldType: string, value: string) => void
}) => {
  return (
    <TextField
      id="tf"
      label={label}
      status={status}
      className="editText"
      // placeholder="Напиши номер своей академической группы"
      value={value}
      style={{margin: "1em"}}
      onChange={(event) => {
        onChange(fieldType, event.target.value)
      }}
    />
  )
}


interface HomeViewProps {
  groupId: string
  character: Character
  student: boolean
  disabled: boolean
  checked: boolean

  setValue: (key: string, e) => void
  isCorrect
  isCorrectTeacher
  convertIdInGroupName

  group: string
  color_group: string
  color_sub: string
  color_enggroup: string
  subGroup: string
  engGroup: string
  teacher: string
  color_teacher: string
  teacher_checked: boolean
}

class HomeView extends React.Component<HomeViewProps> {

  constructor(props: HomeViewProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.isCorrect = this.isCorrect.bind(this);
    this.isCorrectTeacher = this.isCorrectTeacher.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    let disabled = true;
    if (props.groupId !== "") disabled = false;
    this.state = {disabled: disabled}
    this.handleChange("description", props.character === "joy"
      ? DESC_JOY
      : DESC_OTHERS)
  }

  handleChange(key: string, e): void {
    this.props.setValue(key, e);
  }

  isCorrect() {
    this.props.isCorrect();
  }

  isCorrectTeacher() {
    this.props.isCorrectTeacher();
  }

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
        {this.props.student ? (
          // <Container style={{ padding: 0 }}>

          //   <Row>
          //     <Col style={{ marginLeft: "auto" }}>
          //       <GoToMenuButton
          //         onClick={() => {
          //           this.handleChange("page", DASHBOARD_PAGE_NO)
          //         }}
          //       />
          //       {
          //         !this.state.disabled 
          //         ? 
          //         <GoToScheduleButton
          //         onClick={() => {
          //           this.props.convertIdInGroupName();
          //           this.handleChange("page", 7)
          //         }}
          //         />
          //         : <Button view="clear" disabled={this.state.disabled}/>
          //       }

          //     </Col>
          //   </Row>

          //   <div>
          <Main
            setValue={this.handleChange}
            convertIdInGroupName={this.convertIdInGroupName}
            disabled={this.props.disabled}
            contentRight={
              <Container style={{padding: 0}}>
                <HomeTitle
                  text={HOME_TITLE}
                />
                <TabSelector
                  tabs={USER_MODES}
                  selectedIndex={this.props.student ? 0 : 1}
                  onSelect={(tabIndex) => this.handleChange("student", tabIndex === 0)}

                  //isStudent={this.props.student}
                  //onSelect={(tabIndex) => this.handleChange("student", tabIndex === 0)}
                />
                <TextBox>
                  <TextBoxSubTitle style={{
                    margin: '1.5em',
                    textAlign: "center",
                    color: "white"
                  }}>
                    {this.state.description}
                  </TextBoxSubTitle>
                </TextBox>

                <TextFieldForUserInfo
                  label={LABEL_GROUP}
                  status={this.props.color_group}
                  value={this.props.group}
                  fieldType="group"
                  handleChange={this.handleChange}
                />

                <TextFieldForUserInfo
                  label={LABEL_SUB_GROUP}
                  status={this.props.color_sub}
                  value={this.props.subGroup}
                  fieldType="subGroup"
                  handleChange={this.handleChange}
                />

                <TextFieldForUserInfo
                  label={LABEL_ENG_GROUP}
                  status={this.props.color_enggroup}
                  value={this.props.engGroup}
                  fieldType="engGroup"
                  handleChange={this.handleChange}
                />

                <Row style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  margin: "1.1em"
                }}>
                  <RememberDataCheckbox
                    label="Запомнить эту группу "
                    checked={this.props.checked}
                    onChange={(event) => {
                      this.handleChange("checked", event.target.checked);
                    }}
                  />
                </Row>
                <ShowSchedule
                  onClick={() => this.props.isCorrect()}
                />
              </Container>
            }
          />
          //   </div>
          //   <div style={{
          //     width:  '100px',
          //     height: '100px',
          //   }}></div>
          // </Container>) 
        ) : (

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
                    this.handleChange("page", 17)
                  }}
                  disabled={this.state.disabled}
                />
                }
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
                <TextBoxSubTitle style={{margin: '1.5em', textAlign: "center", color: "white"}}>Чтобы посмотреть
                  расписание, укажите фамилию и инициалы через пробел и точку</TextBoxSubTitle>
              </TextBox>

              <TextFieldForUserInfo
                label={LABEL_TEACHER}
                status={this.props.color_teacher}
                value={this.props.teacher}
                fieldType="teacher"
                handleChange={this.handleChange}
              />

              <Row style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                margin: "1.1em"
              }}>

                <RememberDataCheckbox
                  label="Запомнить ФИО, если Вы преподаватель "
                  checked={this.props.teacher_checked}
                  onChange={(event) => {
                    this.handleChange("teacher_checked", event.target.teacher_checked);
                  }}/>
              </Row>

              <ShowSchedule
                onClick={() => this.props.isCorrect()}/>
            </div>
            <div style={{
              width: '100px',
              height: '100px',
            }}></div>
          </Container>
        )
        }
      </div>
    </DeviceThemeProvider>
  }
}

export default HomeView
