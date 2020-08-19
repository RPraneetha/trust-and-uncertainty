import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import WorkerIdContext from "./Components/WorkerIdContext";

function Root() {
    let params = new URLSearchParams(window.location.search);
    let workerId = params.get('wid') ? params.get('wid') : 1234;
    let scenarioId = params.get('sid') ? params.get('sid') : 1;
    let scenarioType = params.get('type') ? params.get('type') : false;

    return (
        <React.StrictMode>
            <WorkerIdContext.Provider value={{ workerId, scenarioId, scenarioType }}>
                <App />
            </WorkerIdContext.Provider>
        </React.StrictMode>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));

// serviceWorker.unregister();
