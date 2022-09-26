import { Component, Show, useContext } from 'solid-js';
import { AppContext } from './AppProvider';
import ConnectView from './views/ConnectView';
import DatabaseView from './views/DatabaseView';

const App: Component = () => {
  const [{ ui }] = useContext(AppContext);
  return (
    <div>
      <Show when={ui.connected} fallback={<ConnectView />}>
        <DatabaseView />
      </Show>
    </div>
  );
};

export default App;
