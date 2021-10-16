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
        this.setState({
            student: props.student,
            groupId: props.groupId,
            subGroup: props.subGroup,
            engGroup: props.engGroup,
            teacherId: props.teacherId,
            start: props.star,
            teacher_star: props.teacher_star
        })
    }

    handleChange(key, e) {
        this.props.setValue(key, e);
    }

    Star() {
        if (this.props.student) {
            this.setValue("star", !this.props.star)
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
            this.setValue("teacher_star", !this.props.teacher_star)
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