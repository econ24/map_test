import React from 'react'
import ElementBox from '../containers/ElementBox'
import DataTable from './DataTable'
import Pagination from './Pagination'

import * as d3format from "d3-format"

const COERCE = {
  string: s => s && s.toString(),
  number: n => n && +n,
  date: d => d && new Date(d).valueOf()
}

 class TableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      filter: "",
      filteredColumns: {},
      sortColumn: "",
      sortOrder: 1
    }
    this.setPage = this.setPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }
  toggleSortColumn(sortColumn) {
    if (sortColumn === this.state.sortColumn) {
      this.setState({ sortOrder: -this.state.sortOrder })
    }
    else {
      this.setState({ sortColumn, sortOrder: -1 })
    }
  }
  setPage(page) {
    this.setState({ page });
  }
  previousPage() {
    const page = Math.max(0, this.state.page - 1);
    this.setState({ page });
  }
  nextPage() {
    const maxPages = Math.ceil(this.getFilteredData().length / this.props.pageSize);
    const page = Math.min(maxPages - 1, this.state.page + 1);
    this.setState({ page });
  }
  getValue(data, column) {
    if (!data) return data;

    const ct = this.props.columnTypes;

    if (column in ct) {
      data = COERCE[ct[column]](data);
      if (ct[column] !== 'string') {
        return data;
      }
    }
    
    const regex = /^[$]([0-9,.]+)([kKmMbBtT])*$/,
      match = regex.exec(data && data.toString());
    let value = data;
    if (match) {
      let num = +match[1].replace(",", ""),
        mult = 1;
      switch (match[2]) {
        case "k":
        case "K":
          mult = 1000;
          break;
        case "m":
        case "M":
          mult = 1000000;
          break;
        case "b":
        case "B":
          mult = 1000000000;
          break;
        case "t":
        case "T":
          mult = 1000000000000;
          break;
      }
      value = num * mult;
    }
    return value;
  }
  getFilteredData() {
    let filterKey = this.props.filterKey,
      filter = this.state.filter,
      data = this.props.data.slice(),
      fc = this.state.filteredColumns,
      sc = this.state.sortColumn,
      so = this.state.sortOrder,
      columns = this.props.columns;


    if (!columns.length) {
      columns = data.length ? Object.keys(data[0]) : columns
    }

    if (sc) {
      data.sort((a, b) => {
        const va = this.getValue(a[sc], sc),
          vb = this.getValue(b[sc], sc);
        return va < vb ? -so : va > vb ? so : 0;
      })
    }
    for (const c in fc) {
      data = data.filter(d => d[c] && fc[c].reduce((a, v) => a || d[c].toString().toLowerCase().includes(v), false))
    }
    if (filter) {;
      if (!filterKey.length) {
        filterKey = Object.keys(data[0])[0];
      }
      data = data.filter(d =>
        d[filterKey] && d[filterKey].toString().toLowerCase().includes(filter)
      );
    }
    const cf = this.props.columnFormats,
      num = Object.keys(cf).length;
    if (num) {
      data = data.map(d => {
        const row = { ...d };
        columns.forEach(c => {
          let format = cf[c];
          if (!format) return;
          if (typeof format === "string") {
            format = d3format.format(cf[c]);
          }
          row[c] = format(row[c]);
        })
        return row;
      })
    }
    return data;
  }
  setFilter(e) {
    this.setState({ filter: e.target.value.toLowerCase() });
  }

  getFilterValues(column) {
    const values = {};
    this.props.data.forEach(d => {
      if (d[column]) {
        const split = d[column].split("|").map(s => s.toString().trim().toLowerCase());
        split.forEach(s => values[s] = true);
      }
    })
    return Object.keys(values).filter(d => d).sort((a, b) => a < b ? -1 : 1)
  }
  toggleFilterColumn(column, value) {
    let { filteredColumns } = this.state;
    if (!(column in filteredColumns)) {
      filteredColumns[column] = [value];
    }
    else {
      if (filteredColumns[column].includes(value)) {
        filteredColumns[column] = filteredColumns[column].filter(v => v !== value)
        if (!filteredColumns[column].length) {
          delete filteredColumns[column];
        }
      }
      else {
        filteredColumns[column].push(value)
      }
    }
    this.setState({ filteredColumns });
  }

  downloadAsCsv(e) {
    e.preventDefault();

    let { data, columns } = this.props;
    if (!data.length) return;
    if (!columns.length) {
      columns = Object.keys(data[0])
    }
    const rows = ['"' + columns.join('","') + '"']
    data.forEach(d => {
      const row = [];
      columns.forEach(c => {
        row.push(d[c])
      })
      rows.push('"' + row.join('","') + '"');
    })
    const csv = rows.join("\n"),
      fileName = `${ this.props.downloadedFileName }.csv`,
      uri = encodeURI("data:text/csv;charset=utf-8," + csv),
      link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', fileName);
    link.click();
  }

  render() {
    const data = this.getFilteredData(),
      paginate = data.length > this.props.pageSize ? (
        <div className='controls-below-table'>
          <Pagination
            length={ data.length }
            page={ this.state.page }
            size={ this.props.pageSize }
            set={ this.setPage }
            prev={ this.previousPage }
            next={ this.nextPage }
          />
        </div>
    ) : null;

////
    const page = this.state.page,
      size = this.props.pageSize;
    let tableData = data.slice();
    if (!this.props.tableScroll) {
      tableData = tableData.slice(page * size, page * size + size);
    }

    const filterColumns = this.props.filterColumns.map(column =>
      ({ column, values: this.getFilterValues(column) }))

    const tableLink = this.props.tableLink ? <a href={ this.props.tableLink }>{ this.props.tableLinkLabel }</a> : null;

    return (
      <ElementBox title={this.props.title}
        desc={ this.props.desc || tableLink }>
        { !this.props.showControls ? null :
          <div className="controls-above-table">
            <div className="row">
              <div className="col-sm-6">
                <form className="form-inline">
                  <input className="form-control form-control-sm bright"
                    onChange={ this.setFilter }
                    placeholder="Search" type="text" />
                </form>
              </div>
              <div className="col-sm-6">
                <form className="form-inline justify-content-sm-end">
                  <a className="btn btn-sm btn-secondary" href="#"
                    onClick={ this.downloadAsCsv.bind(this) }>
                    Download CSV
                  </a>
                </form>
              </div>
            </div>
          </div>
        }
        <div className="table-responsive"
          style={ {
            minHeight: `${ this.props.pageSize * 46 + 39 }px`,
            maxHeight: this.props.tableScroll ? `${ this.props.pageSize * 46 + 39 }px` : 'auto',
            overflowY: this.props.tableScroll ? 'auto' : 'inherit'
          } }>
          <DataTable tableData={ tableData }
            columns={ this.props.columns.filter(c => !this.props.expandColumns.includes(c)) }
            links={ this.props.links }
            onClick={ this.props.onClick }
            filterColumns={ filterColumns }
            toggleFilterColumn={ this.toggleFilterColumn.bind(this) }
            filteredColumns={ this.state.filteredColumns }
            expandColumns={ this.props.expandColumns }
            urlColumn={ this.props.urlColumn }
            toggleSortColumn={ this.toggleSortColumn.bind(this) }
            sortColumn={ this.state.sortColumn }
            sortOrder={ this.state.sortOrder }/>
        </div>
        { !this.props.tableScroll ? paginate : null }
      </ElementBox>
    )
  }
}

TableBox.defaultProps = {
  pageSize: 13,
  data: [],
  columns: [],
  links: {},
  filterKey: "",
  onClick: null,
  showControls: true,
  filterColumns: [],
  expandColumns: [],
  urlColumn: null,
  columnTypes: {},
  columnFormats: {},
  tableScroll: false,
  tableLink: null,
  tableLinkLabel: "Link",
  downloadedFileName: "table-data"
}

export default TableBox;