import { Component, Index } from 'solid-js';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table: Component<{ table: { rows: Array<Array<any>>, columns: any } }> = ({ table }) => {
    return (
        <table>
            <TableHeader columns={table.columns} />
            <Index each={table.rows}>
                {(row) => <TableRow row={row()} />}
            </Index>
        </table>
    );
};

export default Table;
