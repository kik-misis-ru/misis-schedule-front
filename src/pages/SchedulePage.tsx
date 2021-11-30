import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Container, DeviceThemeProvider} from '@sberdevices/plasma-ui';

import {DocStyle, getThemeBackgroundByChar, IThemingProps} from "../themes/tools";
import {ScheduleView, ScheduleViewProps} from '../components/ScheduleView'


interface SchedulePageProps extends ScheduleViewProps, IThemingProps {
}

interface ScheduleState {
}

class SchedulePage extends React.Component<SchedulePageProps, ScheduleState> {


  async componentDidMount(){
    console.log("SchedulePage: componentDidMount")
    await this.props.apiModel.getScheduleFromDb(Number(this.props.Date), this.props.IsSavedSchedule, this.props.IsCurrentWeek)
    console.log("SchedulePage: componentDidMount: saved_schedule.other_week:", this.props.apiModel.saved_schedule.other_week)
  }

  async componentDidUpdate(){
    console.log("SchedulePage: ComponentDidUpdate")
    // await this.props.apiModel.getScheduleFromDb(Number(this.props.Date), this.props.IsSavedSchedule, this.props.IsCurrentWeek)
    // console.log("SchedulePage: ComponentDidUpdate: saved_schedule.other_week:", this.props.apiModel.saved_schedule.other_week)
  }

  constructor(props) {
    console.log("SchedulePage: constructor")
    super(props);
  }

  render() {
    console.log("SchedulePage: render")
    const {character, theme, ...restProps} = this.props;

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(character, theme)
        }
        <div>
          <Container style={{
            padding: 0,
            overflow: "hidden",
             //minHeight: '100%',
          }}>

            <ScheduleView
              {...restProps}
            />
         
          </Container>
        </div>
      </DeviceThemeProvider>
    )
  }
}

export default SchedulePage
