import { Component, Index } from 'solid-js';

const TableHeader: Component<{ columns: Array<{ name: string }> }> = ({ columns }) => {
    console.log(columns);
    return (
        <tr>
            <Index each={columns}>
                {(column) => <th>{column().name}</th>}
            </Index>
        </tr>
    );
};

export default TableHeader;
