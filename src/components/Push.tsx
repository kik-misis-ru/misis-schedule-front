import React from "react";
import {Row, Tabs, TabItem, Switch} from '@sberdevices/plasma-ui';

export const Pushes = ({
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
      alignItems: "start",
      justifyContent: "start"
    }}>
      <Switch view="secondary" size="m">
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
      </Switch>
    </Row>
  )
}

export default Pushes