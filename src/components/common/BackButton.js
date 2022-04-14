import React from "react";
import { useHistory } from "react-router-dom";

export default function BackButton() {
  const history = useHistory();
  return (
    <div>
      <button className="btn btn-outline-primary" onClick={history.goBack}>
        Go Back to Results
      </button>
    </div>
  );
}
