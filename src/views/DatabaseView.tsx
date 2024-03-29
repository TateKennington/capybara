import { invoke } from '@tauri-apps/api';
import { Component, For, onCleanup, Show, useContext } from 'solid-js';
import { AppContext } from '../AppProvider';
import DataPanel from '../components/DataPanel';
import Table from '../components/table/Table';
import TableList from '../components/TablesList';

const DatabaseView: Component = () => {
    const [{ database, ui }, { updateDatabase, openTab, openDataPanel }] = useContext(AppContext);

    const interval = setInterval(async () => {
        const db: Record<string, any> = await invoke("list_tables");
        updateDatabase(db)
    }, 500)

    onCleanup(() => {
        clearInterval(interval)
    })

    return <div>
        <Show when={database.tables} fallback={<div>Loading...</div>}>
            <TableList tables={database?.tables} onClick={openTab} />
            <For each={ui?.tabs}>
                {(tab) => <Table table={database?.tables?.[tab]} onClick={(id, index) => openDataPanel(tab, id, index)} />}
            </For>
            <Show when={ui?.dataPanel}>
                <DataPanel dataPanel={ui?.dataPanel} />
            </Show>
        </Show>
    </div>;
};

export default DatabaseView;
