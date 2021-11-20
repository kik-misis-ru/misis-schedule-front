import React from "react";
import {Row, Tabs, TabItem} from '@sberdevices/plasma-ui';

export const TabSelectorRow = ({
                              tabs,
                              selectedIndex,
                              onSelect,
                            }: {
  tabs: string[],
  selectedIndex: number,
  onSelect: (tabIndex: number) => void
}) => {
  console.log(selectedIndex, "selectedIndex");
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
              <TabItem
                key={tabText}
                isActive={i === selectedIndex}
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

export default TabSelectorRow
