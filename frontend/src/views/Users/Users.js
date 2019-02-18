import React, { Component, Fragment } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody, Card, CardHeader, CardBody, ModalFooter
} from 'reactstrap';

import ReactTable from 'react-table';
import "react-table/react-table.css";
import { Formik } from "formik";


import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from '../../components/Loading';
import _ from 'lodash';
import SweetAlert from 'sweetalert2-react';


// api
import api from '../../Api';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { UserForm, userValidationSchema } from './component/Form';

export default class UserProfile extends Component {
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
        email: "test@mail.com"
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




  componentDidMount() {
		/*api.get('userManagement.js')
			.then((response) => {
				this.setState({ users: response.data });
			})
			.catch(error => {
				// error hanlding
			})*/
  }

	/**
	 * On Delete
	 */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
  }

	/**
	 * Delete User Permanently
	 */
  deleteUserPermanently() {
    const { selectedUser } = this.state;
    let users = this.state.users;
    let indexOfDeleteUser = users.indexOf(selectedUser);
    users.splice(indexOfDeleteUser, 1);
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let self = this;
    setTimeout(() => {
      self.setState({ loading: false, users, selectedUser: null });
      toast('User Deleted!');
    }, 2000);
  }

	/**
	 * Open Add New User Modal
	 */
  opnAddNewUserModal() {
    this.setState({ addNewUserModal: true });
  }

  opnFilterModal() {
    this.setState({ filterModal: true });
  }




	/**
	 * On Reload
	 */
  onReload() {
    this.setState({ loading: true });
    let self = this;
    setTimeout(() => {
      self.setState({ loading: false });
    }, 2000);
  }

	/**
	 * On Select User
	 */
  onSelectUser(user) {
    user.checked = !user.checked;
    let selectedUsers = 0;
    let users = this.state.users.map(userData => {
      if (userData.checked) {
        selectedUsers++;
      }
      if (userData.id === user.id) {
        if (userData.checked) {
          selectedUsers++;
        }
        return user;
      } else {
        return userData;
      }
    });
    this.setState({ users, selectedUsers });
  }

	/**
	 * On Change Add New User Details
	 */
  onChangeAddNewUserDetails(key, value) {
    this.setState({
      addNewUserDetail: {
        ...this.state.addNewUserDetail,
        [key]: value
      }
    });
  }

	/**
	 * View User Detail Hanlder
	 */
  viewUserDetail(data) {
    this.setState({ openViewUserDialog: true, selectedUser: data });
  }

	/**
	 * On Edit User
	 */
  onEditUser(user) {
    this.setState({ addNewUserModal: true, editUser: user });
  }

	/**
	 * On Add & Update User Modal Close
	 */
  onAddUpdateUserModalClose() {
    alert('p')
    this.setState({ addNewUserModal: false, editUser: null })
  }

  onFilterModalClose() {
    this.setState({ filterModal: false })
  }



  //Select All user
  onSelectAllUser(e) {
    const { selectedUsers, users } = this.state;
    let selectAll = selectedUsers < users.length;
    if (selectAll) {
      let selectAllUsers = users.map(user => {
        user.checked = true
        return user
      });
      this.setState({ users: selectAllUsers, selectedUsers: selectAllUsers.length })
    } else {
      let unselectedUsers = users.map(user => {
        user.checked = false
        return user;
      });
      this.setState({ selectedUsers: 0, users: unselectedUsers });
    }
  }

  requestData(page, pageSize, sorted, filtered, handleRetrievedData) {
    const sort = sorted[0];
    const desc = typeof sort === "undefined" ? false : sort.desc;
    const id = typeof sort === "undefined" ? '' : _.snakeCase(sort.id);
    const filterString = filtered.map(k => k.id + ':' + k.value).join(',');


    let url = "/users?limit=" + pageSize + "&page=" + page + "&desc=" + desc + "&sortBy=" + id + "&filtered=" + filterString;

    return api.get(url)
      .then(response => {
        handleRetrievedData(response);
      })
      .catch(response => console.log(response));
  }

  renderEditable(cellInfo) {
    return (
      <Fragment>
        <div className="list-action">
          <a href="javascript:void(0)" onClick={() => this.onEditUser(cellInfo.original)}><i className="icon-pencil pr-1"></i></a>
          <a href="javascript:void(0)" onClick={() => this.onDelete(cellInfo.original)}><i className="icon-delete pr-2"></i>X</a>
          <Link to={`/user`}>            <i className="icon-info pr-1"></i>				</Link>
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

  userSubmitValues(e) {
    console.log(e, 'form')
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

  render() {
    const { options, payload, filtered, table, users, loading, selectedUser, editUser, allSelected, selectedUsers } = this.state;

    return (
      <div className="user-management">



        <div>
          <button onClick={() => this.setState({ show: true })}>Alert</button>
          <SweetAlert
            show={this.state.show}
            title="Demo"
            text="SweetAlert in React"
            onConfirm={() => this.setState({ show: false })}
          />
        </div>

        <ToastContainer />
        {loading &&
          <Loading />
        }

        <Card>
          <CardHeader>
            <strong><i className="icon-info pr-1"></i>Lista de usuarios : {this.props.match.params.id}</strong>
          </CardHeader>
          <CardBody>

            <div className="table-responsive">
              <div className="py-10 px-10 border-bottom">
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="">
                    <div className="row">
                      <div className="col-sm-6 col-md-4 ">
                        <FormControl fullWidth>
                          <InputLabel htmlFor="name-simple">firstName</InputLabel>
                          <Input type="text" name="firstName" />
                        </FormControl>
                      </div>
                      <div className="col-sm-6 col-md-4 ">
                        <FormControl fullWidth aria-describedby="name-helper-text">
                          <InputLabel htmlFor="name-helper">lastName</InputLabel>
                          <Input id="name-helper" name="lastName" />
                        </FormControl>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div>
                          <Button type="submit" className="btn-outline-default waves-effect mr-5">  <i className="material-icons">search</i> </Button>

                          <a href="javascript:void(0)" onClick={() => this.opnFilterModal()} className="btn-outline-default mr-5"><i className="material-icons">filter_list</i></a>
                          <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-5"><i className="material-icons">loop</i></a>
                          <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} className="btn-outline-default"> <i className="material-icons">add</i> </a>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>

              </div>

              <hr></hr>
              <ReactTable
                data={table.data}
                columns={[
                  {
                    Header: "Nombre",
                    accessor: "firstName"
                  },
                  {
                    Header: "Apellido",
                    accessor: "lastName"
                  },
                  {
                    Header: "Correo",
                    accessor: "email"
                  },
                  {
                    Header: "",
                    Cell: this.renderEditable
                  }

                ]}
                defaultPageSize={50}
                className="-striped -highlight"
                sortable={true}
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



          </CardBody>

          <DeleteConfirmationDialog
            ref="deleteConfirmationDialog"
            title="Are You Sure Want To Delete?"
            message="This will delete user permanently."
            onConfirm={() => this.deleteUserPermanently()}
          />
        </Card>

        <Modal isOpen={this.state.filterModal} toggle={() => this.onFilterModalClose()}>
          <ModalHeader toggle={() => this.onFilterModalClose()}>
            Filtros
                </ModalHeader>
          <form noValidate autoComplete="off">
            <ModalBody>
              <div className="py-10 px-10 border-bottom">
                <div className="as">
                  <div className="row">
                    <div className="col-sm-6 col-md-4 ">
                      <FormControl fullWidth>
                        <InputLabel htmlFor="name-simple">firstName</InputLabel>
                        <Input type="text" name="firstName" />
                      </FormControl>
                    </div>
                    <div className="col-sm-6 col-md-4 ">
                      <FormControl fullWidth aria-describedby="name-helper-text">
                        <InputLabel htmlFor="name-helper">lastName</InputLabel>
                        <Input id="name-helper" name="lastName" />
                        <FormHelperText >Some important helper text</FormHelperText>
                      </FormControl>
                    </div>

                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" className="text-white btn-success" onClick={() => this.filter()}>Buscar</Button>
              <Button className="text-white btn-danger" onClick={() => this.onFilterModalClose()}>Cancelar</Button>
            </ModalFooter>
          </form>
        </Modal>





        <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
          <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
            {editUser === null ?
              'Add New User' : 'Update User'
            }
          </ModalHeader>
          <ModalBody>
            <Formik
              render={
                props => <UserForm {...props}
                  cancel={() => this.onAddUpdateUserModalClose()}
                />}
              initialValues={payload}
              options={options}
              validationSchema={userValidationSchema}
              onSubmit={this.userSubmitValues}
            />
          </ModalBody>
        </Modal>


      </div>
    );
  }
}
