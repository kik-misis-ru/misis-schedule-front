import React from "react";
import { Button } from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  CarouselCol
} from "@sberdevices/plasma-ui";

import "../App.css";

class DaysCarousel extends React.Component{

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(key, e) {
        this.props.setValue(key, e);
      }
     

    render(){
        return <CarouselCol key={`item:${this.props.i}`}>
            <Button
                view={this.props.ViewType ? "secondary" : "clear"}
                style={{
                    margin: "0.5em",
                    color: this.props.isCurrent
                           ? "var(--plasma-colors-accent)"
                           : ""
                }}
                size="s"
                focused={this.props.ViewType}
                pin="circle-circle"
                text={this.props.text}
                onClick={() => {
                    this.handleChange("page",  this.props.page)
                }}
            />
        </CarouselCol>
    }
}
export default DaysCarousel
