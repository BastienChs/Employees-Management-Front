import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import EmployeesList from './Components/EmployeesList/EmployeesList';
import reportWebVitals from './reportWebVitals';
import Wrapper from "./Components/Shared/Wrapper";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Wrapper>
            <EmployeesList/>
        </Wrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
