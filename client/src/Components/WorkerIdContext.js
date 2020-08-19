import React from "react";

const WorkerIdContext = React.createContext({
    workerId: 1234,
    scenarioId: 1,
    scenarioType: true
});
export default WorkerIdContext;