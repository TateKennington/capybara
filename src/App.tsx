import type { Component } from 'solid-js';
import Sidebar from './components/Sidebar';
import TableList from './views/TablesList';

const App: Component = () => {
  return (
    <div>
      <Sidebar />
      <TableList />
    </div>
  );
};

export default App;
