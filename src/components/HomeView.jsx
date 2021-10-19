import React from "react";
import {Container, Row, Col, Button, Tabs, TabItem, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  Checkbox
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronRight, IconHouse} from "@sberdevices/plasma-icons";

import "../App.css";
import {
  NAVIGATOR_PAGE_NO,
  DASHBOARD_PAGE_NO,
  getThemeBackgroundByChar,
} from '../App';

import {DocStyle} from '../App';

import {SwitchStudentTeacher} from './Home/SwitchTeacherStudent.jsx'
import {ShowSchedule} from './Home/ShowSchedule.jsx'
import {RememberDataCheckbox} from './Home/RememberDataCheckbox.jsx'

const DESC_JOY      = "Заполни данные, чтобы открывать расписание одной фразой";
const DESC_OTHERS   = "Чтобы посмотреть расписание, укажите данные учебной группы";
const labelGroup    = "Номер академической группы через дефисы";
const labelSubgroup = "Номер подгруппы: 1 или 2";
const labelEnggroup = "Число номера группы по английскому";
const labelTeacher  = "Фамилия И. О.";

export const GoToMenuButton = (props) => <Button
  size="s"
  view="clear"
  onClick={props.onClick}
  pin="circle-circle"
  contentRight={
    <IconHouse size="s" color="inherit"/>
  }
/>

export const GoToScheduleButton = (props) => <Button
  view="clear"
  onClick={props.onClick}
  contentRight={
    <IconChevronRight size="s" color="inherit"/>
  }
  size="s"
  pin="circle-circle"
  style={{ marginTop: "1em", marginRight: "1em" }}
/>

class TextFieldForUserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(key, e) {
    this.props.handleChange(key, e);
  }

  render() {
    return <TextField
      id="tf"
      label={this.props.label}
      status={this.props.status}
      className="editText"
      // placeholder="Напиши номер своей академической группы"
      value={this.props.value}
      style={{ margin: "1em" }}
      onChange={(v) => {
        this.handleChange(this.props.fieldType, v.target.value)
      }}
    />
  }
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange         = this.handleChange.bind(this)
    this.isCorrect            = this.isCorrect.bind(this);
    this.isCorrectTeacher     = this.isCorrectTeacher.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    let disabled              = true;
    if (props.groupId !== "") disabled = false;
    this.state = { disabled: disabled }
    this.handleChange("description", props.character === "joy"
                                     ? DESC_JOY
                                     : DESC_OTHERS)
  }

  handleChange(key, e) {
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
          <Container style={{ padding: 0 }}>

            <Row>
              <Col style={{ marginLeft: "auto" }}>
                <GoToMenuButton
                  onClick={() => {
                    this.handleChange("page", DASHBOARD_PAGE_NO)
                  }}
                />
                {
                  !this.state.disabled
                  ?
                  <GoToScheduleButton
                    onClick={() => {
                      this.props.convertIdInGroupName();
                      this.handleChange("page", 7)
                    }}
                  />
                  : <Button view="clear" disabled={this.state.disabled}/>
                }

              </Col>
            </Row>

            <div>

              <TextBox>
                <TextBoxBigTitle style={{ margin: '1.5%', textAlign: "center" }}>Салют! </TextBoxBigTitle>
              </TextBox>
              <SwitchStudentTeacher
                student={this.props.student}
                onClickStd={() => { this.handleChange("student", true) }}
                onClickTeach={() => { this.handleChange("student", false) }}
              />
{/*
              <SwitchStudentTeacher
                isStudent={this.props.student}
                onSwitch={(tabIndex) => this.handleChange("student", tabIndex === 0)}
              />
*/}

              <TextBox>
                <TextBoxSubTitle style={{
                  margin:    '1.5em',
                  textAlign: "center",
                  color:     "white"
                }}>{this.state.description}</TextBoxSubTitle>
              </TextBox>

              <TextFieldForUserInfo
                label={labelGroup}
                status={this.props.color_group}
                value={this.props.group}
                fieldType="group"
                handleChange={this.handleChange}/>

              <TextFieldForUserInfo
                label={labelSubgroup}
                status={this.props.color_sub}
                value={this.props.subGroup}
                fieldType="subGroup"
                handleChange={this.handleChange}/>

              <TextFieldForUserInfo
                label={labelEnggroup}
                status={this.props.color_enggroup}
                value={this.props.engGroup}
                fieldType="engGroup"
                handleChange={this.handleChange}/>

              <Row style={{
                display:        "flex",
                alignItems:     "flex-start",
                justifyContent: "center",
                margin:         "1.1em"
              }}>
                <RememberDataCheckbox
                  label="Запомнить эту группу "
                  checked={this.props.checked}
                  onChange={(event) => {
                    this.handleChange("checked", event.target.checked);
                  }}/>
              </Row>
              <ShowSchedule
                onClick={() => this.props.isCorrect()}/>
            </div>
            <div style={{
              width:  '100px',
              height: '100px',
            }}></div>
          </Container>) : (
           <Container style={{ padding: 0 }}>

             <Row>
               <Col style={{ marginLeft: "auto" }}>
                 <GoToMenuButton
                   onClick={() => {
                     this.handleChange("page", NAVIGATOR_PAGE_NO)
                   }}
                 />
                 {!this.state.disabled ?
                  <GoToScheduleButton
                    disabled={this.state.disabled}
                    onClick={() => {
                      this.handleChange("page", 7)
                    }}
                  />
                                       : (<Button view="clear" disabled={this.state.disabled}/>)
                 }
               </Col>
             </Row>
             <div>

               <TextBox>
                 <TextBoxBigTitle style={{ margin: '3%', textAlign: "center" }}>Салют! </TextBoxBigTitle>
               </TextBox>
               <SwitchStudentTeacher
                student={this.props.student}
                onClickStd={() => { this.handleChange("student", true) }}
                onClickTeach={() => { this.handleChange("student", false) }}
               />
{/*
               <SwitchStudentTeacher
                 isStudent={this.props.student}
                 onSwitch={(tabIndex) => this.handleChange("student", tabIndex === 0)}
               />
*/}
               <TextBox>

                 <TextBoxSubTitle style={{ margin: '1.5em', textAlign: "center", color: "white" }}>Чтобы посмотреть
                   расписание, укажите фамилию и инициалы через пробел и точку</TextBoxSubTitle>
               </TextBox>

               <TextFieldForUserInfo
                 label={labelTeacher}
                 status={this.props.color_teacher}
                 value={this.props.teacher}
                 fieldType="teacher"
                 handleChange={this.handleChange}/>

               <Row style={{
                 display:        "flex",
                 alignItems:     "flex-start",
                 justifyContent: "center",
                 margin:         "1.1em"
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
               width:  '100px',
               height: '100px',
             }}></div>
           </Container>
         )
        }
      </div>
    </DeviceThemeProvider>
  }
}

export default Home
