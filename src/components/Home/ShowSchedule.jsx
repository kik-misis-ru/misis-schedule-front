import React from "react";
import {Row,  Button} from '@sberdevices/plasma-ui';



export const ShowSchedule = ({onClick}) =>{
    return (
        <Row style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", margin: "0.5em" }}>
            <Button
                text="Посмотреть расписание"
                view="primary"
                onClick={onClick}
                style={{ margin: "1.5%" }} />
        </Row>
    )
}
export default ShowSchedule