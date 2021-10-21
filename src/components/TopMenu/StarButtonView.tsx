import React from "react";
import {
  IconStar,
  IconStarFill,
} from "@sberdevices/plasma-icons";
import {
  Button
} from '@sberdevices/plasma-ui';

import {
  createUser,
  setGroupStar,
  setTeacherStar,
} from "../../APIHelper";

import filial from '../../data/filial.json';


const StarButtonView = ({
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


const StarButtonView_ = ({
                          star,
                          isStudent,
                          userId,
                          groupId,
                          subGroup,
                          engGroup,
                          teacherId,
                          teacher_star,
                          setValue,
  onChange,
}: {
  star: boolean
  isStudent: boolean
  userId: string
  groupId: string
  subGroup: string
  engGroup: string
  teacherId: string
  teacher_star: boolean
  setValue: (name: string, value: any) => void
  // onClick: (name: string, value: any) => void
  onChange: (newValue: boolean) => void
}) => {

  // const setStar = async (newValue) => {
  //   // const starUser = {
  //   //   userId: props.userId,
  //   //   filialId: filial.id,
  //   //   groupId: props.groupId,
  //   //   subGroup: props.subGroup,
  //   //   engGroup: props.engGroup,
  //   //   teacherId: props.teacherId
  //   // }
  //   // if (props.isStudent) {
  //     // props.setValue("star", newValue)
  //     // props.setValue("checked", newValue)
  //     // props.setValue("bd", newValue
  //     //   ? props.groupId
  //     //   : ''
  //     // )
  //     // await setGroupStar(starUser, newValue);
  //   // } else {
  //     // props.setValue("teacher_star", newValue)
  //     // props.setValue("teacher_checked", newValue)
  //     // props.setValue("teacher_bd", newValue
  //     //   ? props.groupId
  //     //   : ''
  //     // )
  //     // await setTeacherStar(starUser, newValue);
  //   // }
  //   props.onChange(newValue);
  // }

  return (
    <StarButtonView
      starred={
        isStudent
          ? star
          : teacher_star
      }
      // onChange={(newValue) => setStar(newValue)}
      onChange={(newValue) => onChange(newValue)}
    />
  );
}

export default StarButtonView
