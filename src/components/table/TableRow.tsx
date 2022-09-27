import { Component, Index } from 'solid-js';
import TableCell from './TableCell';

const TableRow: Component<{ row: Array<any>, onClick: (id: any, index: number) => void }> = ({ row, onClick }) => {
    return (
        <tr>
            <Index each={row}>
                {(item, i) => <TableCell item={item()} onClick={() => onClick(row[0], i)} />}
            </Index>
        </tr>
    );
};

export default TableRow;
