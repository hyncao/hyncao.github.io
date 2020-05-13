import React from 'react';
import {
  Table as MTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderThead = this.renderThead.bind(this);
    this.renderTbody = this.renderTbody.bind(this);
  }

  renderThead() {
    const { columns, handleSort, orderBy, order } = this.props;
    const artifactHeadStyle = {
      width: '20%',
      minWidth: '140px'
    }
    return (
      <TableHead>
        <TableRow>
          {columns.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="left"
              sortDirection={orderBy === headCell.id ? order : false}
              style={headCell.id === 'artifact' ? artifactHeadStyle : {}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => handleSort(headCell.id)}
              >
                {headCell.title}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  renderTbody() {
    const { dataSource, columns } = this.props;
    return (
      <TableBody>
        {dataSource.map((data) => (
          <TableRow key={data.id} hover>
            {columns.map((headCell) => (
              <TableCell padding="none" key={headCell.id}>
                {data[headCell.id]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  render() {
    return (
      <MTable size="small">
        {this.renderThead()}
        {this.renderTbody()}
      </MTable>
    );
  }
}

export default Table;
