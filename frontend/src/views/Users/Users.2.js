import React, { Component, Fragment } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input, Button, FormGroup, Label, FormText
} from 'reactstrap';


import { ToastContainer, toast } from 'react-toastify';


import ReactTable from 'react-table';
import "react-table/react-table.css";
// import UserForm from './component/Form';
import Loading from '../../components/Loading';
import _ from 'lodash';
import api from '../../api';
import { Link } from 'react-router-dom';


function UserRow(props) {
  const user = props.user
  const userLink = `#/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }
  return (
    <tr key={user.id.toString()}>
      <th scope="row"><a href={userLink}>{user.id}</a></th>
      <td><a href={userLink}>{user.name}</a></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
    </tr>
  )
}

export default class Users extends Component {

  constructor() {
    super();
    this.state = {
      all: false,
      users: null, // initial user data
      selectedUser: null, // selected user to perform operations
      loading: false, // loading activity
      addNewUserModal: false, // add new user form modal
      openViewUserDialog: false, // view user dialog box
      editUser: null,
      filterModal: false,
      allSelected: false,
      selectedUsers: 0,
      table: {
        data: [],
        loading: false,
        pages: 1,
        pageSize: 10,
      },
      filtered: [],
      payload: {
        email: "asd"
      },
      options: [
        { value: 'Food', label: 'Food' },
        { value: 'Being Fabulous', label: 'Being Fabulous' },
        { value: 'Ken Wheeler', label: 'Ken Wheeler' },
        { value: 'ReasonML', label: 'ReasonML' },
        { value: 'Unicorns', label: 'Unicorns' },
        { value: 'Kittens', label: 'Kittens' },
      ]
    }
    this.renderEditable = this.renderEditable.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  requestData(page, pageSize, sorted, filtered, handleRetrievedData) {
    const sort = sorted[0];
    const desc = typeof sort === "undefined" ? false : sort.desc;
    const id = typeof sort === "undefined" ? '' : _.snakeCase(sort.id);
    const filterString = filtered.map(k => k.id + ':' + k.value).join(',');

    // const filterString = filtered.map((k, v) => {
    // 	console.log(k, v);
    // 	return (k + ':' + v);
    // 	//k.id + ':' + k.value)
    // }).join(',');
    //http://localhost:3001/api
    let url = "/users?limit=" + pageSize + "&page=" + page + "&desc=" + desc + "&sortBy=" + id + "&filtered=" + filterString;

    return api.get(url)
      .then(response => {
        //console.log(response);
        // const toArray = response.data.map(_.values);
        // for (var i = 0; i < toArray.length; i++) {
        // 	toArray[i] = toArray[i].splice(2, 11);
        // }

        handleRetrievedData(response);
      })
      .catch(response => console.log(response));
  }

	/*get(url, params = {}) {
		return axios.get(url, params)
	}*/


  renderEditable(cellInfo) {
    return (
      <Fragment>
        <div className="list-action">
          <a href="javascript:void(0)" onClick={() => this.viewUserDetail(cellInfo.original)}><i className="ti-eye"></i></a>
          <a href="javascript:void(0)" onClick={() => this.onEditUser(cellInfo.original)}><i className="ti-pencil"></i></a>
          <a href="javascript:void(0)" onClick={() => this.onDelete(cellInfo.original)}><i className="ti-close"></i></a>
          <Link to={`/users/1`}>
            <i className="ti-notepad text-primary mr-10"></i>
          </Link>
        </div>
      </Fragment>
    );
  }


  fetchData(state, instance) {

    //console.log(state, state.page, state.pageSize, state.sorted, state.filtered);
    this.setState({ table: { loading: true } });
    this.requestData((parseInt(state.page, 10) + 1), state.pageSize, state.sorted, state.filtered, (res) => {
      this.setState({
        table: {
          data: res.data.rows,
          pages: Math.ceil(res.data.count / state.pageSize),
          loading: false
        }
      })
    });

  }

  resetState() {
    this.setState({
      filtered: [{ id: "id", value: "0059b860-1137-46d7-ae04-c6b18ae642d7" }
        , { id: "lastName", value: "w" }]
    });
  }

  handleSubmit(e) {
    const formData = new FormData(e.target)

    const rows = [];
    e.preventDefault()
    for (let entry of formData.entries()) {
      if (entry[1] !== '') {
        const formObject = {};
        formObject['id'] = entry[0];
        formObject['value'] = entry[1];
        rows.push(formObject);
      }

    }
    this.setState({
      filtered: rows
    });
  }

  notify = () => toast("Wow so easy !");

  render() {
    const { options, payload, touched, errors, filtered, table, users, loading, selectedUser, editUser, allSelected, selectedUsers } = this.state;

    return (
      <div className="user-management">

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>


        <div>
          <Button onClick={this.notify}>Notify !</Button>
          <ToastContainer />
        </div>
        <Fragment>
          {loading &&
            <Loading type="spin" color="red" />
          }
        </Fragment>

        <div className="row">

          <div className="col-xs-6">
            <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
            </FormGroup>
          </div>

          <div className="col-xs-6">
            <FormGroup>
                <Label for="firstName">firstName</Label>
                <Input type="email" name="firstName" id="firstName" placeholder="with a placeholder" />
            </FormGroup>
          </div>



        </div>

        <div className="table-responsive">
          <div className="py-10 px-10 border-bottom">
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
              <div className="">
                <div className="row">
                  <div className="col-sm-6 col-md-4 ">




        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Email</Label>
          <Col sm={10}>
            <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="examplePassword" sm={2}>Password</Label>
          <Col sm={10}>
            <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelect" sm={2}>Select</Label>
          <Col sm={10}>
            <Input type="select" name="select" id="exampleSelect" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelectMulti" sm={2}>Select Multiple</Label>
          <Col sm={10}>
            <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleText" sm={2}>Text Area</Label>
          <Col sm={10}>
            <Input type="textarea" name="text" id="exampleText" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleFile" sm={2}>File</Label>
          <Col sm={10}>
            <Input type="file" name="file" id="exampleFile" />
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
              It's a bit lighter and easily wraps to a new line.
            </FormText>
          </Col>
        </FormGroup>

                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div>
                      <button type="submit" className="btn-outline-default waves-effect mr-5">  <i className="material-icons">search</i> </button>

                      <a href="javascript:void(0)" onClick={() => this.opnFilterModal()} className="btn-outline-default mr-5"><i className="material-icons">filter_list</i></a>
                      <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-5"><i className="material-icons">loop</i></a>
                      <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} className="btn-outline-default"> <i className="material-icons">add</i> </a>
                    </div>
                  </div>
                </div>
              </div>

            </form>

          </div>

          <div>
            <ReactTable
              data={table.data}
              columns={[
                {
                  Header: "firstName",
                  accessor: "firstName"
                },
                {
                  Header: "lastName",
                  accessor: "lastName"
                },
                {
                  Header: "email",
                  accessor: "email"
                },
                {
                  Header: "test",
                  Cell: this.renderEditable
                }

              ]}
              defaultPageSize={50}
              className="-striped -highlight"
              sortable={true}
              // filterable
              loading={table.loading}
              noDataText="No matching records found"
              pages={table.pages}
              pageSize={table.pageSize}
              showPagination={true}
              showPaginationTop={false}
              showPaginationBottom={true}
              pageSizeOptions={[5, 10, 20, 25, 50, 100]}
              onPageChange={page => this.setState({ page })}
              filtered={filtered}
              onFilteredChange={filtered => this.setState({ filtered })}
              onPageSizeChange={(pageSize, page) =>
                this.setState({ table: { page, pageSize } })}
              manual  // this would indicate that server side pagination has been enabled
              onFetchData={this.fetchData}
              minRows={2}
            />
          </div>




        </div>

              </CardBody>
            </Card>
          </Col>
        </Row>




      </div>
    );
  }

}
