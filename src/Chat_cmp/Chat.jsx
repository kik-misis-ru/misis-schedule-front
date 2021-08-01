import React from "react";
import Message from "./Message_cmp/Message";
import { toNameFormat, isCorrect } from "../../service/WordChecker";
import { TextField, ActionButton } from "@sberdevices/plasma-ui";
import { IconMessage } from "@sberdevices/plasma-icons";
import { Container, Row, Col, Button, Radiobox, Tabs, TabItem, Icon, DeviceThemeProvider, Header} from '@sberdevices/plasma-ui';
import { createGlobalStyle } from "styled-components";
import "./Chat.css";
import { sendName } from "../../service/API_helper";

let clicked = false;


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.tfRef = React.createRef();
    this.state = {
      textName: "", //текст, введенный в чате
      lastSayPlayer: false, //true, если последнее имя сказал игрок
      assistantSaing: false, //true, если вызван метод assistantSayName
      nameForAssistant: "", //имя, которое должен сказать ассистент
      isPause: false,
    };
  }
  

  updateScroll = () => {
    let block = document.getElementById("block");
    block.scrollTop = block.scrollHeight;
  };

  componentDidUpdate() {
    if (this.state.lastSayPlayer) clicked = true;
    if (clicked) this.updateScroll();
    clicked = false;
  }

  async shouldComponentUpdate(nextProps, nextState) {
    if (this.props.restarted !== nextProps.restarted) {
      this.setState({
        textName: "",
        lastSayPlayer: false,
        assistantSaing: false,
        nameForAssistant: "",
        isPause: false,
      });
      return false;
    }
    //если сейчас нужно говорить ассистенту
    if (this.props.assistantSay !== nextProps.assistantSay) {
      await this.assistantSayName(this.state.nameForAssistant);
      await nextProps.assistantSaied();
      return false;
    }
    if (this.props.newname !== nextProps.newname) {
      await this.sayName(nextProps.newname);
      return false;
    }
    if (this.props.isPause !== nextProps.isPause) return true;
    if (this.props.messages !== nextProps.messages) return true;
    if (this.state !== nextState) return true;
    return false;
  }

  //добавление вводимого сообщения
  sayName = async (msg) => {
    if (!this.props.isPause) {
      if (!this.state.lastSayPlayer) {
        msg = await toNameFormat(msg); //перевод введенной строки в формат имени
        let temp = await this.props.messages;
        let res = await isCorrect(msg, temp); //проверка на синтаксическую корректность введенного имени
        if (res === 0) {
          let nameFromBackend = await sendName(this.props.userId, msg);
          nameFromBackend = nameFromBackend.data;
          switch (nameFromBackend) {
            case "1": //сказанного игроком имени нет в бд
              res = 5;
              console.log(`res = 5`);
              break;
            case "0": //нет имени для ассистента
              res = 6;
              break;
            default:
              //пришло какое-то имя для ассистента
              break;
          }
          if(nameFromBackend[nameFromBackend.length-1] === ".") {
            res = 6;
          }
          if (res !== 5) {
            await temp.push({ name: msg, from: "from-me" });
            this.setState({
              textName: this.tfRef.current.value,
              lastSayPlayer: true,
              nameForAssistant: nameFromBackend,
            });
            await this.props.update(true);
            let timeAnswer = 0;
            if (res === 6) timeAnswer = 1;
            await this.createAssistantSayTime(timeAnswer);
            return;
          }
        }
        if (res > 0 && res < 6) {
          await this.props.assistant.sendData({
            action: {
              action_id: res,
            },
          });
          return;
        } else {
          await this.props.assistant.sendData({
            action: {
              action_id: "firstSym",
              parameters: { sym: res.toUpperCase() },
            },
          });
        }
      } else if (!this.state.assistantSaing) {
        await this.assistantSayName(this.state.nameForAssistant);
      }
    }
  };

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  };

  createAssistantSayTime = (time) => {
    let chance = this.getRandomInt(0, 102);
    if (time !== 0) {
      chance = 101;
    }
    if (chance > 100 || this.state.nameForAssistant === "") {
      this.props.endGame();
    } else {
      this.props.setAssistantSayTime(29);
      this.setState({
        assistantSaing: true,
      });
    }
  };

  assistantSayName = (name) => {
    if (name !== "" && name !== "1" && name !== "0") {
      clicked = true;
      this.props.assistant.sendData({
        action: {
          action_id: "assistantSay",
          parameters: { name: name },
        },
      });
      this.props.messages.push({ name: name, from: "from-them" });
      this.setState({
        lastSayPlayer: false,
        nameForAssistant: "",
        assistantSaing: false,
      });
      this.props.update(false);
      this.updateScroll();
    }
  };

  click = () => {
    this.tfRef.current.value = "";
    if (!this.props.isPause) {
      this.sayName(this.state.textName);
      clicked = true;
    }
  };

  enters = (ev) => {
    if (ev.code === "Enter") {
      this.click();
    }
  };
  
  render() {
    let messageList = this.props.messages.map((msg, index) => (
      <Message key={index} name={msg.name} from={msg.from} />
    ));
    let disabled = this.props.isPause ? true : false;
    return (
      <div className="chat">
        
        <div className="subChat" id="block">
          {messageList}
        </div>
        <TextField
          id="tf"
          ref={this.tfRef}
          value={this.state.textName}
          className="editText"
          label="Задай вопрос"
          color="var(--plasma-colors-voice-phrase-gradient)"
          disabled={disabled}
          onChange={(v) =>
            this.setState({
              textName: v.target.value,
            })
          }
          onKeyDown={this.enters}
          contentRight={
            <ActionButton
              id="ab"
              size="l"
              view="primary"
              disabled={disabled}
              onClick={this.click}
              color="var(--plasma-colors-voice-phrase-gradient)"
              contentRight={<IconMessage />}
            />
          }
        />
      </div>
    );
  }
}
