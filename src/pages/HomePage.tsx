import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextBoxBigTitle,
  TextBox,
  Caption
} from "@sberdevices/plasma-ui";
import {TextField} from "@sberdevices/plasma-ui";
import {IAppState, SetValueFn, SetValueKeys} from "../App";
import{
  ApiModel,
IStudentValidation,
ITeacherValidation,
IStudentSettings,
ITeacherSettings,

} from '../lib/ApiModel'
import {
  getThemeBackgroundByChar,
} from '../themes/tools';
import {DocStyle} from '../themes/tools';
import {CharacterId} from "../types/base";
import Main from '../components/Home/Main';
import TabSelectorRow from '../components/Home/TabSelectorRow'
import {ShowScheduleButtonRow} from '../components/Home/ShowScheduleButtonRow'
import {RememberCheckboxRow} from '../components/Home/RememberCheckboxRow'

const HOME_TITLE = 'Салют!';
// const DESC_JOY = "Заполни данные, чтобы открывать расписание одной фразой";
// const DESC_OTHERS = "Чтобы посмотреть расписание, укажите данные учебной группы";

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
  character: CharacterId
  description: string
  theme: string
  onHandleTeacherChange: (settings: ITeacherSettings, isSave: boolean) => Promise<ITeacherValidation>
  // handleTeacherChange
  onConvertIdInGroupName: () => void
  CheckIsCorrect: (student: IStudentSettings, isSave: boolean) => Promise<IStudentValidation>
  LoadSchedule: (isSave: boolean) => void
  onShowScheduleClick: () => void
  apiModel: ApiModel
}

interface HomeViewState {
  disabled: boolean
  studentSettings: IStudentSettings
  teacherSettings: ITeacherSettings
  studentValidation: IStudentValidation
  teacherValidation: ITeacherValidation
  IsStudent: boolean
  IsSave: boolean
}

class HomePage extends React.Component<HomeViewProps, HomeViewState> {

  constructor(props: HomeViewProps) {
    super(props);
    //this.onHandleChange = this.onHandleChange.bind(this)
    this.Load_Schedule = this.Load_Schedule.bind(this)
    this.onConvertIdInGroupName = this.onConvertIdInGroupName.bind(this);
    let disabled = true;
    if (props.apiModel.user!=undefined && props.apiModel.user?.group_id !== "") disabled = false;
    let user = this.props.apiModel.user;
    this.state = {
      disabled: disabled,
      studentSettings:{
        groupName: user==undefined? "" : user.group,
        subGroupName: user==undefined? "" : user.subgroup_name,
        engGroupName: user==undefined? "" : user.eng_group,
      },
      IsStudent: this.props.apiModel.isStudent,
      teacherSettings:{
        initials: user == undefined ? "" : user.teacher
      },
      studentValidation: {
        IsGroupNameError: false, 
        IsSubGroupError: false,
        IsEngGroupError: false},
      teacherValidation : {IsInitialsError: false},
      IsSave: false
    }
    // this.onHandleChange("description", props.character === "joy"
    //   ? DESC_JOY
    //   : DESC_OTHERS)
  }

  async CheckIsCorrect(student: IStudentSettings, isSave: boolean) : Promise<IStudentValidation> {
    return await this.props.CheckIsCorrect(student, isSave);
  }

  Load_Schedule(isSave: boolean) {
    this.props.LoadSchedule(isSave)
  }

  // handleTeacherChange() {
  //   this.props.handleTeacherChange();
  // }

  onConvertIdInGroupName() {
    this.props.onConvertIdInGroupName();
  }

  render() {

    const studentContent = (
      <Container style={{
        padding: 0,
        // overflow: "hidden",
        height: '100%',
      }}>

        {/* <HomeTitle
          text={HOME_TITLE}
        /> */}

        <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.state.IsStudent ? 0 : 1}
          onSelect={(tabIndex) => this.setState({IsStudent: tabIndex === 0})}
        />

        <HomeDescription
          text={this.props.description}
        />

        <TextFieldForUserInfo
          label={LABEL_GROUP}
          isError={this.state.studentValidation.IsGroupNameError}
          value={this.state.studentSettings.groupName}
          onChange={(value) => this.setState({
            studentSettings:
            {
              groupName: value,
              engGroupName: this.state.studentSettings.engGroupName,
              subGroupName: this.state.studentSettings.subGroupName
            }
          })
        }

        />

        <TextFieldForUserInfo
          label={LABEL_SUB_GROUP}
          isError={this.state.studentValidation.IsSubGroupError}
          value={this.state.studentSettings.subGroupName}
          onChange={(value) => this.setState({
            studentSettings:
            {
              groupName: this.state.studentSettings.groupName,
              engGroupName: this.state.studentSettings.engGroupName,
              subGroupName: value
            }
          })
        }
        />

        <TextFieldForUserInfo
          label={LABEL_ENG_GROUP}
          isError={this.state.studentValidation.IsEngGroupError}
          value={this.state.studentSettings.engGroupName}
          onChange={(value) => this.setState({
            studentSettings:
            {
              groupName: this.state.studentSettings.groupName,
              engGroupName: value,
              subGroupName: this.state.studentSettings.subGroupName
            }
          })
        }
        />

        <RememberCheckboxRow
          label={LABEL_REMEMBER_GROUP}
          checked={this.state.IsSave}
          onChange={(value) => this.setState({IsSave:value})}
        />

        <ShowScheduleButtonRow
          onClick={async () => {
            let isCorrect = await this.CheckIsCorrect(this.state.studentSettings, this.state.IsSave)
            if (isCorrect) {
              await this.Load_Schedule(this.state.IsSave)
              this.props.onShowScheduleClick()
            }

          }
          }
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
          selectedIndex={this.state.IsStudent ? 0 : 1}
          onSelect={(tabIndex) => this.setState({IsStudent: tabIndex === 0})}
        />

        <HomeDescription
          text={LABEL_TO_VIEW_SCHEDULE}
        />

        <TextFieldForUserInfo
          label={LABEL_TEACHER}
          value={this.state.teacherSettings.initials}
          isError={this.state.teacherValidation.IsInitialsError}
          onChange={(value) => this.setState({teacherSettings: {initials: value}})}
        />

        <RememberCheckboxRow
          label={LABEL_REMEMBER_FIO}
          checked={this.state.IsSave}
          onChange={(value) => this.setState({IsSave:value})
          }
        />

        <ShowScheduleButtonRow
          onClick={() => this.props.onHandleTeacherChange(this.state.teacherSettings, this.state.IsSave)}
        />

      </Container>
    )

    const mainContent = this.state.IsStudent
      ? studentContent
      : teacherContent;

    return <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character, this.props.theme)
      }

      <div>
        <Main
          contentRight={mainContent}
        />
      </div>
    </DeviceThemeProvider>
  }
}

export default HomePage
