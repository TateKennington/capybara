import { Component, Index } from 'solid-js';
import TableCell from './TableCell';

const TableRow: Component<{ row: Array<any> }> = ({ row }) => {
    return (
        <tr>
            <Index each={row}>
                {(item) => <TableCell item={item()} />}
            </Index>
        </tr>
    );
};

export default TableRow;
