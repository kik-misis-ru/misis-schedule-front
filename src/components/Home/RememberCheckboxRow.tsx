import React from "react";
import {Row} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Checkbox
} from "@sberdevices/plasma-ui";


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
        margin: "1.1em"
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
