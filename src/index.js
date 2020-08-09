import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import * as serviceWorker from './serviceWorker';
import WorkerIdContext from "./Components/WorkerIdContext";

function Root() {
    let params = new URLSearchParams(window.location.search);
    let workerId = params.get('wid') ? params.get('wid') : 1234;

    return (
        <React.StrictMode>
            <WorkerIdContext.Provider value={workerId}>
                <App />
            </WorkerIdContext.Provider>
        </React.StrictMode>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
