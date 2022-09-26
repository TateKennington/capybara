import { Component, For, JSX, Show } from 'solid-js';

const TableList: Component<{ tables: any, onClick: (table: string) => void }> = ({ tables, onClick }) => {
    return (
        <div>
            <Show when={tables}>
                <For each={Object.keys(tables)}>
                    {(table) => <button onClick={() => onClick(table)}>{table}</button>}
                </For>
            </Show>
        </div>
    );
};

export default TableList;
