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


const StarButton = ({
                      starred,
                      onChange,
                    }: {
  starred: boolean
  onChange: (newValue: boolean) => void
}) => {
  return <Button
    size="s"
    view="clear"
    pin="circle-circle"
    onClick={() => onChange(!starred)}
    contentRight={
      starred
        ? <IconStarFill size="s" color="inherit"/>
        : <IconStar size="s" color="inherit"/>
    }
  />
}

interface StarButtonViewProps {
  star: boolean
  isStudent: boolean
  userId: string
  groupId: string
  subGroup: string
  engGroup: string
  teacherId: string
  teacher_star: boolean
  setValue: (name: string, value: any) => void
  onClick: (name: string, value: any) => void
}

class StarButtonView extends React.Component<StarButtonViewProps> {
  constructor(props: StarButtonViewProps) {
    super(props)
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }

  async setGroupStar() {
    return createUser(
      this.props.userId,
      // todo hardcoded 880
      "880",
      this.props.groupId,
      this.props.subGroup,
      this.props.engGroup,
      this.props.teacherId,
    );
  }

  async unsetGroupStar() {
    return createUser(
      this.props.userId,
      "",
      "",
      "",
      "",
      "",
    );
  }

  async setTeacherStar() {
    return createUser(
      this.props.userId,
      // todo hardcoded 880
      "880",
      this.props.groupId,
      this.props.subGroup,
      this.props.engGroup,
      this.props.teacherId,
    );
  }

  async unsetTeacherStar() {
    return createUser(
      this.props.userId,
      "",
      "",
      "",
      "",
      "",
    );
  }

  async setStar() {
    if (this.props.isStudent) {
      this.handleChange("star", !this.props.star)
      if (!this.props.star) {
        /*await*/
        this.setGroupStar();
        this.handleChange("checked", true)
        this.handleChange("bd", this.props.groupId)
      } else {
        /*await*/
        this.unsetGroupStar();
        this.handleChange("checked", false)
        this.handleChange("bd", "");
      }
    } else {
      this.handleChange("teacher_star", !this.props.teacher_star)
      if (!this.props.teacher_star) {
        await createUser(
          this.props.userId,
          // todo hardcoded 880
          "880",
          String(this.props.groupId),
          String(this.props.subGroup),
          String(this.props.engGroup),
          String(this.props.teacherId),
        );
        this.handleChange("teacher_bd", this.props.groupId)
      } else {
        await createUser(
          this.props.userId,
          "",
          String(this.props.groupId),
          String(this.props.subGroup),
          "",
          "",
        );
        this.handleChange("teacher_bd", "")
      }
      this.handleChange("teacher_checked", !this.props.teacher_star)
    }
  }

  render() {
    return <Button
      size="s"
      view="clear"
      pin="circle-circle"
      onClick={() => this.setStar()}
      contentRight={
        this.props.teacher_star
          ? <IconStarFill size="s" color="inherit"/>
          : <IconStar size="s" color="inherit"/>
      }
    />
  }
}

export default StarButtonView
