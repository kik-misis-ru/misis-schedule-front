import React from "react";
import {Row, Tabs, TabItem} from '@sberdevices/plasma-ui';


export const TabSwitcher = ({
                              tabs,
                              activeIndex,
                              onSwitch,
                            }: {
  tabs: string[],
  activeIndex: number,
  onSwitch: (tabIndex: number) => void
}) => {
  return (
    <Row style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
      <Tabs view="secondary" size="m">
        {
          tabs.map(
            (tabText, i) =>
              <TabItem isActive={i === activeIndex}
                       onClick={() => onSwitch(i)}
              >
                {tabText}
              </TabItem>
          )
        }
      </Tabs>
    </Row>
  )
}


export const SwitchStudentTeacher = (
  {
    isStudent,
    onSwitch,
  }: {
    isStudent: boolean,
    onSwitch: (tabIndex: number) => void
  }) => {
  return <TabSwitcher
    tabs={['Студент', 'Преподаватель']}
    activeIndex={isStudent ? 0 : 1}
    onSwitch={(tabIndex) => onSwitch(tabIndex)}
  />
}

export default SwitchStudentTeacher
