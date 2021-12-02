import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Container, DeviceThemeProvider} from '@sberdevices/plasma-ui';

import {DocStyle, getThemeBackgroundByChar, IThemingProps} from "../themes/tools";
import {ScheduleView, ScheduleViewProps} from '../components/ScheduleView'
import {IScheduleDays} from '../lib/ApiModel'


interface SchedulePageProps_ extends ScheduleViewProps, IThemingProps {
}

type SchedulePageProps = Omit<SchedulePageProps_, 'schedule'>

interface ScheduleState {
  schedule: { current_week: IScheduleDays, other_week: IScheduleDays }
}

class SchedulePage extends React.Component<SchedulePageProps, ScheduleState> {

  constructor(props) {
    console.log("SchedulePage: constructor")
    super(props);
    this.state = {
      schedule: {
        current_week: [],
        other_week: [],
      }
    }
    this.props.apiModel.isSchedule = false;
  }

  async refetchData() {
    console.log("SchedulePage: refetchData: apiModel", this.props.apiModel.unsavedUser)
    console.log("SchedulePage: refetchData: this.props.IsSavedSchedule:", this.props.IsSavedSchedule)
    await this.props.apiModel.getScheduleFromDb(this.props.Date, this.props.IsSavedSchedule, this.props.IsCurrentWeek)

    this.setState({
      schedule: this.props.apiModel.isSavedSchedule
        ? this.props.apiModel.saved_schedule
        : this.props.apiModel.other_schedule
    })

  }

  async componentDidMount() {
    console.log("SchedulePage: componentDidMount")
    await this.refetchData();
  }

  async componentDidUpdate(prevProps) {
    console.log("SchedulePage: ComponentDidUpdate")
    // Typical usage (don't forget to compare props):
    
    if (this.props.Date !== prevProps.Date) {
      await this.refetchData();
      // this.setState({})
    }
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
              schedule={this.state.schedule}
              {...restProps}
            />

          </Container>
        </div>
      </DeviceThemeProvider>
    )
  }
}

export default SchedulePage
