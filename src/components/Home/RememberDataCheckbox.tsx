import React from "react";
import {Row} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
    Checkbox
  } from "@sberdevices/plasma-ui";


export const RememberDataCheckbox = ({label, checked, onChange}) => {
    return(
        <Row style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            margin: "1.1em"
        }}><Checkbox
                label={label}
                checked={checked}
                onChange={onChange} />
        </Row>
    )
}
export default RememberDataCheckbox