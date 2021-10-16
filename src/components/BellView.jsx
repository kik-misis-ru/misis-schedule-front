import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  CardHeadline3,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
} from "@sberdevices/plasma-ui";
import {  IconSettings,  IconLocation,IconMoreVertical} from "@sberdevices/plasma-icons";
import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
import { createGlobalStyle } from "styled-components";

import { text, background, gradient } from "@sberdevices/plasma-tokens";
import "../App.css";

//const ThemeBackgroundEva = createGlobalStyle(darkEva);
//const ThemeBackgroundSber = createGlobalStyle(darkSber);
//const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

const DocStyle = createGlobalStyle`
    html:root {
        min-height: 100vh;
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
    }
`;




class BellView extends React.Component{

  constructor(props){
    super(props);
    this.handleChange         = this.handleChange.bind(this)
    this.isCorrectTeacher     = this.isCorrectTeacher.bind(this);
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }
  isCorrectTeacher() {
    this.props.isCorrectTeacher();
  }

  IsUrlExist(){
    return  this.props.bell.url !== "" && this.props.bell.url !== null
  }

  IsCorrectTeacher(){
    return !this.props.student && this.props.teacher_correct
  }
  IsCurrentLesson(){
    return (this.props.bell.lessonNumber[0] === this.props.current
      && this.props.bell.teacher !== ""
      && this.props.today === this.props.timeParam && this.props.weekParam === 0)
  }




    render(){
        return <CellListItem
          key={`item:${this.props.timeParam-1}`}
          content={
            <TextBox>
              <TextBoxSubTitle lines={8}>
                {
                  this.props.bell.startAndfinishTime
                }
              </TextBoxSubTitle>
              {
                this.IsCurrentLesson()
                  ? (
                    < CardHeadline3 style={{ color: "var(--plasma-colors-button-accent)" }}>
                      {this.props.bell.lessonName}
                    </ CardHeadline3>
                  )
                  : (
                    < CardHeadline3>
                      {this.props.bell.lessonName}
                    </ CardHeadline3>
                  )
              }
              {
                this.IsCorrectTeacher()
                  ? (
                    <TextBoxTitle> {this.props.bell.groupNumber} </TextBoxTitle>)
                  : (
                    <a onClick={() => {
                      this.handleChange("teacher", this.props.bell.teacher);
                      this.isCorrectTeacher()
                    }}> {this.props.bell.teacher} </a>
                  )
              }

              {
                this.IsUrlExist() ? (
                  <a href={this.props.bell.url}
                    style={{ color: "var(--plasma-colors-white-secondary)" }}>Ссылка на
                    онлайн-конференцию</a>) : (<div></div>)
              }
            </TextBox>
          }

          contentRight={
            <TextBox>
              <Badge
                text={this.props.bell.room}
                contentLeft={<IconLocation size="xs" />}
                style={{ backgroundColor: "rgba(0,0,0, 0)" }} />
              <TextBoxTitle> {this.props.Type(this.props.bell.lessonType)}</TextBoxTitle>

            </TextBox>}
          contentLeft={this.props.bell.teacher !== "" ? (
            <Badge
              text={this.props.bell.lessonNumber[0]}
              view="primary" style={{ marginRight: "0.5em" }} size="l" />) : (<div></div>)
          }
        />
    }
}

export default BellView