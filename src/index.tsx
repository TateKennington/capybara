/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { AppProvider } from './AppProvider';

render(() => <AppProvider><App /></AppProvider>, document.getElementById('root') as HTMLElement);
