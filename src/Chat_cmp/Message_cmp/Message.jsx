import React from "react";
import "./Message.css";

export default function Message(props) {
  return (
    <div className="name-item">    
      <p className={props.from}>{props.name}</p>
    </div>
  );
}
