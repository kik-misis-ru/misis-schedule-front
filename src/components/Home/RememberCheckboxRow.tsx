import React from "react";
import {Row} from '@sberdevices/plasma-ui';
import {
  Checkbox
} from "@sberdevices/plasma-ui";
import 'react-toastify/dist/ReactToastify.css';


export const RememberCheckboxRow = ({
                                       label,
                                       checked,
                                       onChange,
                                     }: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) => {
  return (
    <Row
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        margin: "0.8em"
      }}
    >
      <Checkbox
        label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </Row>
  )
}

export default RememberCheckboxRow
