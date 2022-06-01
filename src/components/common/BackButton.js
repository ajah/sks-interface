import React from "react";
import {useLocation} from 'react-router-dom'

export default function BackButton() {
  const history = useLocation();
  console.log(history)
  return (
    <div>
      <button className="btn btn-outline-primary">
        Go Back to Results
      </button>
    </div>
  );
}
