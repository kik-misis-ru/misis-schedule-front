import React from "react";
import { Container, Row, Col, Button, Tabs, TabItem, DeviceThemeProvider } from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  Checkbox
} from "@sberdevices/plasma-ui";
import { createGlobalStyle } from "styled-components";
import "../App.css";
import { TextField } from "@sberdevices/plasma-ui";
import {  IconChevronRight, IconNavigationArrow} from "@sberdevices/plasma-icons";
import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
import { text, background, gradient } from "@sberdevices/plasma-tokens";

const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

const DocStyle = createGlobalStyle`
    html:root {
        min-height: 100vh;
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
    }
`;



class Home extends React.Component{
    constructor(props){
        super(props);
        this.handleChange=this.handleChange.bind(this)
        this.isCorrect = this.isCorrect.bind(this);
        this.isCorrectTeacher = this.isCorrectTeacher.bind(this);
        this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
        let disabled = true;
        if (props.state.groupId!=="") disabled=false;
        if (props.state.character === "joy") {          
            props.state.description="Заполни данные, чтобы открывать расписание одной фразой"
          } else props.state.description="Чтобы посмотреть расписание, укажите данные учебной группы"
        this.state={disabled: disabled}
    }
     handleChange(key, e) {
         this.props.setValue(key, e);
    }
    isCorrect(){
      this.props.isCorrect();
    }
    isCorrectTeacher(){
      this.props.isCorrectTeacher();
    }
    convertIdInGroupName(){
      this.props.convertIdInGroupName();
    }

    render(){
        return <DeviceThemeProvider>
        <DocStyle />
        {(() => {
          switch (this.props.state.character) {
            case "sber":
              return <ThemeBackgroundSber />;
            case "eva":
              return <ThemeBackgroundEva />;
            case "joy":
              return <ThemeBackgroundJoy />;
            default:
              return;
          }
        })()}
      <div  >
        {this.props.state.student === true ? (
        <Container style = {{padding: 0}}>
          
        <Row >
          <Col style={{marginLeft: "auto"}}>
          <Button size="s" view="clear" pin="circle-circle" onClick={()=>{this.handleChange("page", 15)}}  contentRight={<IconNavigationArrow size="s" color="inherit"/>} />
            {this.state.disabled===false ?(
            <Button  view="clear" disabled={this.state.disabled} contentRight={<IconChevronRight size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>{this.props.convertIdInGroupName(); this.handleChange("page", 7 )}} style={{marginTop: "1em", marginRight: "1em"}}/> ) 
            : (<Button view = "clear" disabled={this.state.disabled}/>)
            }
            
          </Col>
        </Row>
        <div >
          
            <TextBox>
               <TextBoxBigTitle style={{margin: '1.5%', textAlign: "center"}}>Салют! </TextBoxBigTitle>
              </TextBox>
          <Row style={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent:"center"}}>
        <Tabs view="secondary" size="m" >
            <TabItem isActive={this.props.state.student} onClick={()=>{this.handleChange("student", true)}}>Студент
            </TabItem>
            <TabItem isActive={!this.props.state.student} onClick={()=>{this.handleChange("student", false)}}>Преподаватель
            </TabItem>
          </Tabs>
        </Row>
          <TextBox>
         
          <TextBoxSubTitle  style={{margin: '1.5em', textAlign: "center", color: "white"}}>{this.props.state.description}</TextBoxSubTitle>
          </TextBox>
          <TextField
          id="tf"
          label={this.props.state.labelGroup}
          
          className="editText"
          // placeholder="Напиши номер своей академической группы"
          value={this.props.state.group}
          style={{margin: "1em", color: `${this.props.state.color_group}`}}
          onChange={(v) =>{
            this.handleChange("group", v.target.value)
          }
        }
        />
        
          <TextField
          id="tf"
          className="editText"
          label={this.props.state.labelSubgroup}
          value={this.props.state.subGroup}
          style={{margin: "1em", color: `${this.props.state.color_sub}`}}
          onChange={(s) =>{
            this.handleChange("subGroup", s.target.value)
          }}
        />

    <TextField
              id="tf"
              label={this.props.state.labelEnggroup}
              
              className="editText"
              // placeholder="Напиши номер своей академической группы"
              value={this.props.state.engGroup}
              style={{margin: "1em", color: `${this.props.state.color_enggroup}`}}
              onChange={(e) =>{
                this.handleChange("engGroup", e.target.value)
              }}
            />
        <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "1.1em"}}><Checkbox  label="Запомнить эту группу " checked={this.props.state.checked} onChange={(event) => {
                        this.handleChange("checked", event.target.checked );
                        console.log(this.props.state.checked);
                        }
            }/>
          </Row>
          {/* <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center"}}>
            <TextBox>
            <TextBoxSubTitle color="var(--plasma-colors-secondary)" style={{ textAlign: "center"}}>Тогда не придётся вводить данные каждый раз</TextBoxSubTitle>
            </TextBox>
          </Row> */}
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "0.5em"}}>
          <Button text="Посмотреть расписание" view="primary"  onClick={()=>this.props.isCorrect()} style={{margin: "1.5%"}}/>
        </Row>
        {/* <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center", marginTop: "1em"}}>
          <Image src={image} style={{width: "250px"}}/>
        </Row> */}
        </div>
        <div style={{
        width:  '100px',
        height: '100px',
        }}></div>
        </Container> ): (
          <Container style = {{padding: 0}}>
          
          <Row >
            <Col style={{marginLeft: "auto"}}>
            <Button size="s" view="clear" pin="circle-circle" onClick={()=>{this.handleChange("page", 15 )}}  contentRight={<IconNavigationArrow size="s" color="inherit"/>} />
            {this.state.disabled===false ?(
            <Button  view="clear" disabled={this.state.disabled} contentRight={<IconChevronRight size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.handleChange("page", 7 )} style={{marginTop: "1em", marginRight: "1em"}}/> ) 
            : (<Button view = "clear" disabled={this.state.disabled}/>)
            }
            </Col>
          </Row>
          <div >
            
              <TextBox>
                 <TextBoxBigTitle style={{margin: '3%', textAlign: "center"}}>Салют! </TextBoxBigTitle>
                </TextBox>
            <Row style={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent:"center"}}>
          <Tabs view="secondary" size="m" >
              <TabItem isActive={this.props.state.student} onClick={()=>{this.handleChange("student", true)}}>Студент
              </TabItem>
              <TabItem isActive={!this.props.state.student} onClick={()=>{this.handleChange("student", false)}}>Преподаватель
              </TabItem>
            </Tabs>
          </Row>
            <TextBox>
           
            <TextBoxSubTitle  style={{margin: '1.5em', textAlign: "center", color: "white"}}>Чтобы посмотреть расписание, укажите фамилию и инициалы через пробел и точку</TextBoxSubTitle>
            </TextBox>
            <TextField
            id="tf"
            label={this.props.state.label_teacher}
            
            className="editText"
            // placeholder="Напиши номер своей академической группы"
            value={this.props.state.teacher}
            style={{margin: "1em", color: `${this.props.state.color_teacher}`}}
            onChange={(v) =>{
              this.handleChange("teacher", v.target.value)
            }}
          />
          
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "1.1em"}}><Checkbox  label="Запомнить ФИО, если Вы преподаватель " checked={this.props.state.teacher_checked} onChange={(event) => {
                          this.handleChange("teacher_checked", event.target.checked );
                          }
              }/>
            </Row>
            <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "1em"}}>
            <Button text="Посмотреть расписание" view="primary"  onClick={()=>this.props.isCorrectTeacher()} style={{margin: "3%"}}/>
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