import React from "react";
import {
  TextBoxBigTitle,
  TextBox,
  Caption,
  TextBoxLabel,
  TextField,
  Container,
  Row,
  Col,
  Button,
  DeviceThemeProvider,
  Header
} from "@sberdevices/plasma-ui";
import {
  ApiModel,
  IStudentValidation,
  ITeacherValidation,
  IStudentSettings,
  ITeacherSettings,

} from '../lib/ApiModel'
import {history} from "../App";
import {AssistantWrapper} from "../lib/AssistantWrapper";
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
    <TextBoxLabel style={{
      margin: '1.5em',
      textAlign: "center"
    }}>
      {text}
    </TextBoxLabel>
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
  assistant: AssistantWrapper
  description: string
  // onShowScheduleClick: (IsSave: boolean, IsCurrentWeek: boolean) => void
  apiModel: ApiModel
  IsStudent: boolean
}

interface HomeViewState {
  disabled: boolean
  studentSettings: IStudentSettings
  teacherSettings: ITeacherSettings
  studentValidation: IStudentValidation
  teacherValidation: ITeacherValidation
  IsSave: boolean
}

class HomePage extends React.Component<HomeViewProps, HomeViewState> {

  constructor(props: HomeViewProps) {
    super(props);
    let disabled = true;
    if (props.apiModel.user != undefined && props.apiModel.user?.group_id !== "") disabled = false;
    let user = this.props.apiModel.user;
    this.state = {
      disabled: disabled,
      studentSettings: {
        groupName: user == undefined ? "" : user.group,
        subGroupName: user?.subgroup_name == undefined ? "" : user.subgroup_name,
        engGroupName: user?.eng_group == undefined ? "" : user.eng_group,
      },
      teacherSettings: {
        initials: user == undefined ? "" : user.teacher
      },
      studentValidation: {
        IsGroupNameError: false,
        IsSubGroupError: false,
        IsEngGroupError: false
      },
      teacherValidation: {IsInitialsError: false},
      IsSave: false
    }
    console.log(this.state.studentSettings, "Student Settings")
    // this.onHandleChange("description", props.character === "joy"
    //   ? DESC_JOY
    //   : DESC_OTHERS)
  }

  goToSchedule(isSave: boolean, isCurrentWeek: boolean) {
      let current_date = new Date().toISOString().slice(0, 10)
      history.push('/schedule/' + current_date + '/' + isSave + '/' + isCurrentWeek)
  }

  async save_teacher() {
    let teacherValidation = await this.props.apiModel.CheckIsCorrectTeacher(this.state.teacherSettings, this.state.IsSave)
    // console.log("Teacher validation", teacherValidation)
    if (!teacherValidation.IsInitialsError) {
      // console.log("Show Schedule")
      // console.log(this.props.apiModel)
      this.goToSchedule(this.state.IsSave, true)
    } else {
      this.setState({teacherValidation: {IsInitialsError: teacherValidation.IsInitialsError}})
    }
  }

  async save_student() {
    let isCorrect = await this.props.apiModel.CheckIsCorrectStudent(this.state.studentSettings, this.state.IsSave)
    if (!isCorrect.IsEngGroupError && !isCorrect.IsGroupNameError && !isCorrect.IsSubGroupError) {
      // console.log(this.state.IsSave)
      this.props.apiModel.isSavedSchedule = this.state.IsSave
      await this.props.apiModel.LoadSchedule(this.state.IsSave)
      this.goToSchedule(this.state.IsSave, true)
    } else {
      this.setState({
        studentValidation:
          {
            IsEngGroupError: isCorrect.IsEngGroupError,
            IsGroupNameError: isCorrect.IsGroupNameError,
            IsSubGroupError: isCorrect.IsSubGroupError
          }
      })
    }
  }

  componentDidMount() {
    this.props.assistant.on('action-group', (group) => {
      console.log('action-group', group)
    })
    this.props.assistant.on('action-subGroup', (subGroup) => {
      let settings = this.state.studentSettings
      this.setState({
        studentSettings:
          {
            groupName: settings.groupName,
            engGroupName: settings.engGroupName,
            subGroupName: subGroup
          }
      })
    })
    this.props.assistant.on('action-engGroup', (engGroup) => {
      let settings = this.state.studentSettings
      this.setState({
        studentSettings:
          {
            groupName: settings.groupName,
            engGroupName: engGroup,
            subGroupName: settings.subGroupName
          }
      })
    })
    this.props.assistant.on('show_schedule', async () => {
      this.props.IsStudent ? await this.save_student() : await this.save_teacher()
    })

  }


  componentWillUnmount() {
    this.props.assistant.removeAllListeners();
  }


  render() {

    const studentContent = (
      <Container style={{
        padding: 0,
        // overflow: "hidden",
        height: '100%',
      }}>

        <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.IsStudent ? 0 : 1}
          onSelect={(tabIndex) => tabIndex === 0 ? history.push('/home/true') : history.push('/home/false')}
        />

        <HomeDescription
          text={this.props.description}
        />

        <TextFieldForUserInfo
          label={LABEL_GROUP}
          isError={this.state.studentValidation.IsGroupNameError}
          value={this.state.studentSettings.groupName}
          onChange={(value) => this.setState(prevState => ({
            studentSettings:
              {
                ...prevState.studentSettings,
                groupName: value,

              }
          }))
          }

        />

        <TextFieldForUserInfo
          label={LABEL_SUB_GROUP}
          isError={this.state.studentValidation.IsSubGroupError}
          value={this.state.studentSettings.subGroupName}
          onChange={(value) => this.setState(prevState => ({
            studentSettings:
              {
                ...prevState.studentSettings,
                subGroupName: value,

              }
          }))
          }
        />

        <TextFieldForUserInfo
          label={LABEL_ENG_GROUP}
          isError={this.state.studentValidation.IsEngGroupError}
          value={this.state.studentSettings.engGroupName}
          onChange={(value) => this.setState(prevState => ({
            studentSettings:
              {
                ...prevState.studentSettings,
                engGroupName: value,

              }
          }))
          }
        />

        <RememberCheckboxRow
          label={LABEL_REMEMBER_GROUP}
          checked={this.state.IsSave}
          onChange={(value) => {
            this.setState({IsSave: value})
          }}
        />

        <ShowScheduleButtonRow
          onClick={async () => {
            await this.save_student()
          }
          }
        />

      </Container>
    );

    const teacherContent = (
      <Container style={{padding: 0}}>

        <TabSelectorRow
          tabs={USER_MODES}
          selectedIndex={this.props.IsStudent ? 0 : 1}
          onSelect={(tabIndex) => tabIndex === 0 ? history.push('/Home/true') : history.push('/Home/false')}
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
          onChange={(value) => this.setState({IsSave: value})
          }
        />

        <ShowScheduleButtonRow
          onClick={async () => {
            await this.save_teacher()
          }}
        />

      </Container>
    )

    const mainContent = this.props.IsStudent
      ? studentContent
      : teacherContent;

    return (
      <div>
        <Main
          contentRight={mainContent}
        />
      </div>
    )
  }
}

export default HomePage
