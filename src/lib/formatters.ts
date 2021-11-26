import {ITeacherInfo} from "./ApiHelper";

export const formatTeacherName = (teacherData: ITeacherInfo) => (
  `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`
)

export function formatFullGroupName(group: string, subGroup: string): string {
  return (subGroup !== "")
    ? `${group} (${subGroup})`
    : `${group} `
}


