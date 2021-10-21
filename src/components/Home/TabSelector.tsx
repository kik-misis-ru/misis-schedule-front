import React from "react";
import {Row, Tabs, TabItem} from '@sberdevices/plasma-ui';


export const TabSelector = ({
                              tabs,
                              selectedIndex,
                              onSelect,
                            }: {
  tabs: string[],
  selectedIndex: number,
  onSelect: (tabIndex: number) => void
}) => {
  return (
    <Row style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Tabs view="secondary" size="m">
        {
          tabs.map(
            (tabText, i) =>
              <TabItem isActive={i === selectedIndex}
                       onClick={() => onSelect(i)}
              >
                {tabText}
              </TabItem>
          )
        }
      </Tabs>
    </Row>
  )
}


// export const SwitchStudentTeacher = (
//   {
//     isStudent,
//     onSelect,
//   }: {
//     isStudent: boolean,
//     onSelect: (tabIndex: number) => void
//   }) => {
//   const USER_MODES = [
//     'Студент',
//     'Преподаватель',
//   ];
//   return <TabSelector
//     tabs={USER_MODES}
//     selectedIndex={isStudent ? 0 : 1}
//     onSelect={(tabIndex) => onSelect(tabIndex)}
//   />
// }

export default TabSelector
