import { Component } from 'solid-js';

const TableCell: Component<{ item: any, onClick: () => void }> = ({ item, onClick }) => {
    return (
        <td onClick={() => onClick()}>
            {item}
        </td>
    );
};

export default TableCell;
