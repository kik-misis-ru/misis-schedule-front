import React from "react";
import {Container, Row, Col, Button, Tabs, TabItem, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  Checkbox
} from "@sberdevices/plasma-ui";
import {createGlobalStyle} from "styled-components";
import {TextField} from "@sberdevices/plasma-ui";
import {IconChevronRight, IconNavigationArrow} from "@sberdevices/plasma-icons";
import {darkJoy, darkEva, darkSber} from "@sberdevices/plasma-tokens/themes";
import {text, background, gradient} from "@sberdevices/plasma-tokens";

import "../App.css";
import {
  NAV_PAGE_NO,
  getThemeBackgroundByChar,
} from '../App';

//const ThemeBackgroundEva  = createGlobalStyle(darkEva);
//const ThemeBackgroundSber = createGlobalStyle(darkSber);
//const ThemeBackgroundJoy  = createGlobalStyle(darkJoy);

const DocStyle = createGlobalStyle`
  html:root {
    min-height: 100vh;
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
  }
`;

const DESC_JOY    = "Заполни данные, чтобы открывать расписание одной фразой";
const DESC_OTHERS = "Чтобы посмотреть расписание, укажите данные учебной группы";

const GoToNavButton = (props) => <Button
  size="s"
  view="clear"
  onClick = {props.onClick}
  pin="circle-circle"
  contentRight={
    <IconNavigationArrow size="s" color="inherit"/>
  }
/>

const GoToScheduleButton = (props) =>  <Button
view="clear"
disabled={props.disabled}
onClick={props.onClick}
contentRight={
  <IconChevronRight size="s" color="inherit"/>
}
size="s"
pin="circle-circle"
style={{ marginTop: "1em", marginRight: "1em" }}
/>

class TextFieldForUserInfo extends React.Component{

  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(key, e) {
    this.props.handleChange(key, e);
  }

  render(){
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
    this.state              = { disabled: disabled }
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
                <GoToNavButton
                  onClick={() => {
                    this.handleChange("page", NAV_PAGE_NO)
                  }}
                />
                {
                  this.state.disabled 
                  ? 
                  <GoToScheduleButton
                  disabled={this.state.disabled}
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

              <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Tabs view="secondary" size="m">
                  <TabItem isActive={this.props.student} onClick={() => {
                    this.handleChange("student", true)
                  }}>Студент
                  </TabItem>
                  <TabItem isActive={!this.props.student} onClick={() => {
                    this.handleChange("student", false)
                  }}>Преподаватель
                  </TabItem>
                </Tabs>
              </Row>

              <TextBox>
                <TextBoxSubTitle style={{
                  margin:    '1.5em',
                  textAlign: "center",
                  color:     "white"
                }}>{this.state.description}</TextBoxSubTitle>
              </TextBox>

              <TextFieldForUserInfo 
              label={this.props.labelGroup}
              status={this.props.color_group}
              value={this.props.group}
              fieldType="group"
              handleChange={this.handleChange}/>

              <TextFieldForUserInfo 
              label={this.props.labelSubgroup}
              status={this.props.color_sub}
              value={this.props.subGroup}
              fieldType="subGroup"
              handleChange={this.handleChange}/>

              <TextFieldForUserInfo 
              label={this.props.labelEnggroup}
              status={this.props.color_enggroup}
              value={this.props.engGroup}
              fieldType="engGroup"
              handleChange={this.handleChange}/>

              <Row style={{
                display:        "flex",
                alignItems:     "flex-start",
                justifyContent: "center",
                margin:         "1.1em"
              }}><Checkbox label="Запомнить эту группу " checked={this.props.checked} onChange={(event) => {
                this.handleChange("checked", event.target.checked);
                console.log(this.props.checked);
              }
              }/>
              </Row>
              <Row style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", margin: "0.5em" }}>
                <Button text="Посмотреть расписание" view="primary" onClick={() => this.props.isCorrect()}
                        style={{ margin: "1.5%" }}/>
              </Row>
            </div>
            <div style={{
              width:  '100px',
              height: '100px',
            }}></div>
          </Container>) : (
           <Container style={{ padding: 0 }}>

             <Row>
               <Col style={{ marginLeft: "auto" }}>
               <GoToNavButton
                  onClick={() => {
                    this.handleChange("page", NAV_PAGE_NO)
                  }}
                />
                 {! this.state.disabled ?
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
               <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                 <Tabs view="secondary" size="m">
                   <TabItem isActive={this.props.student} onClick={() => {
                     this.handleChange("student", true)
                   }}>Студент
                   </TabItem>
                   <TabItem isActive={!this.props.student} onClick={() => {
                     this.handleChange("student", false)
                   }}>Преподаватель
                   </TabItem>
                 </Tabs>
               </Row>
               <TextBox>

                 <TextBoxSubTitle style={{ margin: '1.5em', textAlign: "center", color: "white" }}>Чтобы посмотреть
                   расписание, укажите фамилию и инициалы через пробел и точку</TextBoxSubTitle>
               </TextBox>

              <TextFieldForUserInfo 
              label={this.props.label_teacher}
              status={this.props.color_teacher}
              value={this.props.teacher}
              fieldType="teacher"
              handleChange={this.handleChange}/>

               <Row style={{
                 display:        "flex",
                 alignItems:     "flex-start",
                 justifyContent: "center",
                 margin:         "1.1em"
               }}><Checkbox label="Запомнить ФИО, если Вы преподаватель " checked={this.props.teacher_checked}
                            onChange={(event) => {
                              this.handleChange("teacher_checked", event.target.checked);
                            }
                            }/>
               </Row>
               <Row style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", margin: "1em" }}>
                 <Button text="Посмотреть расписание" view="primary" onClick={() => this.props.isCorrectTeacher()}
                         style={{ margin: "3%" }}/>
               </Row>
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
