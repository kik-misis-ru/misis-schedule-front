import React from "react";
import { Row, Tabs, TabItem} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';





export const SwitchStudentTeacher = ({student, onClickStd, onClickTeach }) => {

    return (
        <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Tabs view="secondary" size="m">
                <TabItem isActive={student}
                    onClick={onClickStd}
                >Студент
                </TabItem>
                <TabItem isActive={!student}
                    onClick={onClickTeach}
                >Преподаватель
                </TabItem>
            </Tabs>
        </Row>

    )
}

export default SwitchStudentTeacher
