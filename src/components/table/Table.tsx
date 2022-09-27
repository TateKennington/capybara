import { Component, Index } from 'solid-js';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table: Component<{ table?: { rows: Array<Array<any>>, columns: any }, onClick: (id: any, index: number) => void }> = ({ table, onClick }) => {
    if (!table) {
        return <></>;
    }

    return (
        <table>
            <TableHeader columns={table.columns} />
            <Index each={table.rows}>
                {(row) => <TableRow row={row()} onClick={(id, index) => onClick(id, index)} />}
            </Index>
        </table>
    );
};

export default Table;
