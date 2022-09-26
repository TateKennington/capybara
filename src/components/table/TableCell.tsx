import { Component } from 'solid-js';

const TableCell: Component<{ item: any }> = ({ item }) => {
    return (
        <td>
            {item}
        </td>
    );
};

export default TableCell;
