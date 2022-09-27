import { Component, useContext } from 'solid-js';
import { AppContext } from '../AppProvider';

const DataPanel: Component<{ dataPanel?: { table: string, id: any, index: number } }> = ({ dataPanel }) => {
    const [{ database }] = useContext(AppContext);

    if (!dataPanel) {
        return;
    }

    const value = () => {
        const { table, id, index } = dataPanel
        return database.tables?.[table].rows.find(([rowId]) => id === rowId)?.[index]
    }

    return (
        <div>
            {value()}
        </div>
    );
};

export default DataPanel;
