import { invoke } from '@tauri-apps/api';
import { Component, createResource, Suspense } from 'solid-js';

const listTables = async (): Promise<Array<string>> => invoke("list_tables")

const TableList: Component = () => {
    const [tables] = createResource(listTables)
    return (
        <Suspense>
            {tables}
        </Suspense>
    );
};

export default TableList;
