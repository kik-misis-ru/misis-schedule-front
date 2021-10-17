import React from "react";
import {
    createUser,
} from "../APIHelper";
import {
    IconStar,
    IconStarFill,
} from "@sberdevices/plasma-icons";
import {
    Button
} from '@sberdevices/plasma-ui';


class StarButtonView extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(key, e) {
        this.props.setValue(key, e);
    }

    Star() {
        if (this.props.student) {
            this.handleChange("star", !this.props.star)
            if (!this.props.star) {
                /*await*/
                createUser(
                    this.props.userId,
                    // todo hardcoded 880
                    "880",
                    String(this.props.groupId),
                    String(this.props.subGroup),
                    String(this.props.engGroup),
                    String(this.props.teacherId));
                this.handleChange("checked", true)
                this.handleChange("bd", this.props.groupId)
            } else {
                /*await*/
                createUser(
                    this.props.userId,
                    "",
                    "",
                    "",
                    "",
                    "",
                );
                this.handleChange("checked", false)
                this.handleChange("bd", "");
            }
        } else {
            this.handleChange("teacher_star", !this.props.teacher_star)
            if (!this.props.teacher_star) {
                /*await*/
                createUser(
                    this.state.userId,
                    // todo hardcoded 880
                    "880",
                    String(this.props.groupId),
                    String(this.props.subGroup),
                    String(this.props.engGroup),
                    String(this.props.teacherId),
                );
                this.handleChange("teacher_checked", true)
                this.handleChange("teacher_bd", this.props.groupId)
            } else {
                /*await*/
                createUser(
                    this.props.userId,
                    "",
                    String(this.props.groupId),
                    String(this.props.subGroup),
                    "",
                    "",
                );
                this.handleChange("teacher_checked", false)
                this.handleChange("teacher_bd", "")
            }
        }
    }

    render() {
        return <Button
            size="s"
            view="clear"
            pin="circle-circle"
            onClick={this.Star}
            contentRight={
                this.props.teacher_star
                    ? <IconStarFill size="s" color="inherit" />
                    : <IconStar size="s" color="inherit" />
            }
        />
    }
}
export default StarButtonView