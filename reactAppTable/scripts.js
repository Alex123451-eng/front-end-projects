'use strict'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      isLoadBtnClicked: false,
      error: null,
      data: [],
      itemToShow: {},
      isItemShown: false,
      firstUserOnPage: 0,
      dataToSearch: "",
      sortOrder: "upDown"
    };

    this.downLoadData = this.downLoadData.bind(this);
    this.handleAddToTable = this.handleAddToTable.bind(this);
    this.searchHandle = this.searchHandle.bind(this);
    this.getFilteredItems = this.getFilteredItems.bind(this);
    this.sort = this.sort.bind(this);
    this.onRowClickHandle = this.onRowClickHandle.bind(this);
    this.handlePagesDisp = this.handlePagesDisp.bind(this);
  }

  downLoadData(url) {
    this.setState({ isLoadBtnClicked: true });

    fetch(url)
      .then(response => response.json())
      .then(
        data => {
          this.setState({ data, isLoaded: true });
        },
        error => {
          this.setState({ error, isLoaded: true });
        }
      );
  }

  handleAddToTable(obj) {
    const { data } = this.state;

    data.unshift(obj);

    this.setState({ data });
  }

  searchHandle(dataToSearch) {
    this.setState({ dataToSearch });

    if (dataToSearch) this.setState({ firstUserOnPage: 0 });
  }

  getFilteredItems() {
    const {data, dataToSearch} = this.state;

    if (!dataToSearch) return data;

    const result = data.filter(item => {
      return (
        item["firstName"].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item["lastName"].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item["email"].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item["phone"].includes(dataToSearch)
      );
    });

    return result;
  }

  sort(columnName) {
    const { data } = this.state;

    const sortOrder = this.state.sortOrder === "downUp" ? "upDown" : "downUp";

    if (sortOrder === "downUp") {
      data.sort((a, b) => a[columnName] > b[columnName] ? 1 : -1);
    } else {
      data.sort((a, b) => b[columnName] > a[columnName] ? 1 : -1);
    }

    this.setState({
      data,
      sortOrder
    });
  }

  onRowClickHandle(obj) {
    this.setState({
      itemToShow: obj,
      isItemShown: true
    });
  }

  handlePagesDisp(direct) {
    if (direct === "back") {
      this.setState(prevState => {
        return { firstUserOnPage: prevState.firstUserOnPage - 50 };
      });
    } else {
      this.setState(prevState => {
        return { firstUserOnPage: prevState.firstUserOnPage + 50 };
      });
    }
  }

  render() {
    const { isLoaded, itemToShow, isItemShown, error, isLoadBtnClicked, firstUserOnPage } = this.state;
    const urlSmallData = "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}";
    const urlBigData = "http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}";

    const data = this.getFilteredItems();

    let isBackDisabled = false;
    let isForwardDisabled = false;

    if (data.length <= 50) {
      isBackDisabled = true;
      isForwardDisabled = true;
    }

    if (firstUserOnPage === 0) {
      isBackDisabled = true;
    }

    if (firstUserOnPage + 50 >= data.length) {
      isForwardDisabled = true;
    }

    if (!isLoadBtnClicked) {
      return (
        <div className="appContainer">
          <BtnsBlock 
            firstBtnTxt="Download small data"
            secondBtnTxt="Download big data"
            firstBtnData={urlSmallData}
            secondBtnData={urlBigData}
            handleAction={this.downLoadData}
          />
        </div>
      );
    } else if (error) {
      return <p>Error {error.message}</p>;
    } else if (!isLoaded) {
      return <img className="spiner" src="imgs/spiner.svg" alt="preloader" />;
    } else {
      return (
        <div className="appContainer">
          <Help />

          <AddContainer handleAddToTable={this.handleAddToTable} />

          <SearchContainer searchHandle={this.searchHandle} />
          <Table
            data={data}
            firstUserOnPage={firstUserOnPage}
            onRowClickHandle={this.onRowClickHandle}
            sort={this.sort}
          />

          <BtnsBlock
            firstBtnTxt="Back"
            secondBtnTxt="Forward"
            firstBtnData="back"
            secondBtnData="forward"
            handleAction={this.handlePagesDisp}
            isFirstBtnDisabled={isBackDisabled}
            isSecondBtnDisabled={isForwardDisabled}
          />

          {isItemShown ? <Description itemToShow={itemToShow} /> : null}
        </div>
      );
    }
  }
}

function BtnsBlock(props) {
  const { firstBtnTxt, secondBtnTxt, firstBtnData, secondBtnData, isFirstBtnDisabled, isSecondBtnDisabled } = props;

  return (
    <div className="btnsBlock">
      <button
        disabled={isFirstBtnDisabled}
        onClick={() => props.handleAction(firstBtnData)} 
        className="btns"
      >
        {firstBtnTxt}
      </button>

      <button
        disabled={isSecondBtnDisabled}
        onClick={() => props.handleAction(secondBtnData)} 
        className="btns"
      >
        {secondBtnTxt}
      </button>
    </div>
  );
}

class AddContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      isAddBtnDisabled: true,
      isIdValid: "",
      isFirstNameValid: "",
      isLastNameValid: "",
      isEmailValid: "",
      isPhoneValid: "",
      isStrAddrValid: "",
      isCityValid: "",
      isStateValid: "",
      isZipValid: "",
      isDescValid: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => { this.validateFields(name, value) });
  }

  validateFields(name, value) {
    let { isIdValid, isFirstNameValid, isLastNameValid, isEmailValid, isPhoneValid } = this.state;
    let { isStrAddrValid, isCityValid, isStateValid, isZipValid, isDescValid } = this.state;

    switch(name) {
      case "id":
        isIdValid = value.match(/^\d{1,4}$/);
        break;
      case "firstName":
        isFirstNameValid = value.match(/^[A-Z]{1}[a-z]*$/)
        break;
      case "lastName":
        isLastNameValid = value.match(/^[A-Z]{1}[a-z]*$/);
        break;
      case "email":
        isEmailValid = value.match(/^\w+@[a-z]+\.[a-z]{2,}$/);
        break;
      case "phone":
        isPhoneValid = value.match(/^\(\d{3}\)\d{3}-\d{4}$/);
        break;
      case "streetAddress":
        isStrAddrValid = value.match(/^[A-Za-z0-9]+[A-Za-z0-9 ]*$/);
        break;
      case "city":
        isCityValid = value.match(/^[A-Z]{1}[A-Za-z ]*$/);
        break;
      case "state":
        isStateValid = value.match(/^[A-Z]{2}$/);
        break;
      case "zip":
        isZipValid = value.match(/^\d{5}$/);
        break;
      case "description":
        isDescValid = value.match(/^[A-Za-z0-9]+[A-Za-z0-9 ]*$/);
        break;
      default:
        break;
    }

    this.setState({
      isIdValid,
      isFirstNameValid,
      isLastNameValid,
      isEmailValid,
      isPhoneValid,
      isStrAddrValid,
      isCityValid,
      isStateValid,
      isZipValid,
      isDescValid
    });

    if (isIdValid && isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid &&
      isStrAddrValid && isCityValid && isStateValid && isZipValid && isDescValid) {
      this.setState({ isAddBtnDisabled: false });
    } else {
      this.setState({ isAddBtnDisabled: true });
    }
  }

  render() {
    const {firstName, lastName, email, phone, isAddBtnDisabled, streetAddress, city, state, zip, description  } = this.state;
    const id = +this.state.id;
    const address = {
      streetAddress,
			city,
			state,
			zip
    };

    return (
      <div className="addContainer">
        <button
          disabled={isAddBtnDisabled}
          onClick={() => this.props.handleAddToTable({ id, firstName, lastName, email, phone, address, description })}
          className="addBtn"
        >
          Add
        </button>

        <div className="addInputBlock">
          <div className="tableInputBlock">
            <input
              type="text"
              placeholder="ID"
              value={this.state.id}
              className="inputField"
              onChange={this.handleChange}
              name="id"
            /> 
            <input
              type="text"
              placeholder="First Name"
              value={this.state.firstName}
              className="inputField"
              onChange={this.handleChange}
              name="firstName"
            /> 
            <input
              type="text"
              placeholder="Last Name"
              value={this.state.lastName}
              className="inputField"
              onChange={this.handleChange}
              name="lastName"
            /> 
            <input
              type="text"
              placeholder="Email"
              value={this.state.email}
              className="inputField"
              onChange={this.handleChange}
              name="email"
            /> 
            <input
              type="text"
              placeholder="Phone"
              value={this.state.phone}
              className="inputField"
              onChange={this.handleChange}
              name="phone"
            />
          </div>

          <div className="descInputBlock">
            <input
              type="text"
              placeholder="Street Address"
              value={this.state.streetAddress}
              className="inputField"
              onChange={this.handleChange}
              name="streetAddress"
            /> 
            <input
              type="text"
              placeholder="City"
              value={this.state.city}
              className="inputField"
              onChange={this.handleChange}
              name="city"
            /> 
            <input
              type="text"
              placeholder="State"
              value={this.state.state}
              className="inputField"
              onChange={this.handleChange}
              name="state"
            /> 
            <input
              type="text"
              placeholder="Zip"
              value={this.state.zip}
              className="inputField"
              onChange={this.handleChange}
              name="zip"
            /> 
            <input
              type="text"
              placeholder="Description"
              value={this.state.description}
              className="inputField"
              onChange={this.handleChange}
              name="description"
            />
          </div>
        </div>

      </div>
    );
  }
}

function Help() {
  return (
    <div className="helpBlock">
      <p className="helpBlockTitle"><span className="boldText">help</span></p>
      <div><span className="boldText">This is how fields should be filled:</span></div>
      <p><span className="boldText"> ID:</span> 3-4 digits</p>
      <p><span className="boldText"> First Name:</span> first letter is capital, then whatever is necessary except gaps</p>
      <p><span className="boldText"> Last Name:</span> first letter is capital, then whatever is necessary except gaps</p>
      <p><span className="boldText"> Email:</span> standard email mask</p>
      <p><span className="boldText"> Phone:</span> phone mask can be seen in the table</p>
      <p><span className="boldText"> Street Address:</span> required address, first sign should not be a space</p>
      <p><span className="boldText"> City:</span> first letter is capital, then whatever is necessary except gaps</p>
      <p><span className="boldText"> State:</span> 2 capital letters</p>
      <p><span className="boldText"> Zip:</span> 5 digits</p>
      <div><span className="boldText">Description:</span> required description, first sign should not be a space</div>
    </div>
  );
}

class SearchContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: ""
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => { this.props.searchHandle(value) });
  }

  render() {
    const { searchInput } = this.state;

    return (
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Type data to search"
          value={searchInput}
          className="searchInput"
          onChange={this.handleSearchInput}
          name="searchInput"
        />
      </div>
    );
  }
}

function Table(props) {
  const { data, firstUserOnPage } = props;

  return (
    <React.Fragment>
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => props.sort("id")}>ID</th>
            <th onClick={() => props.sort("firstName")}>First Name</th>
            <th onClick={() => props.sort("lastName")}>Last Name</th>
            <th onClick={() => props.sort("email")}>Email</th>
            <th onClick={() => props.sort("phone")}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {
            data.slice(firstUserOnPage, firstUserOnPage + 50).map(item => {
              return (
                <Row
                  key={Math.random()}
                  item={item}
                  onRowClickHandle={() => props.onRowClickHandle(item)}
                />
              );
            })
          }
        </tbody>
      </table>
    </React.Fragment>
  );
}

function Row(props) {
  const { id, firstName, lastName, email, phone } = props.item;

  return (
    <tr
    className="row"
    onClick={() => props.onRowClickHandle()}
    >
      <td>{id}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td>{phone}</td>
    </tr>
  );
}

function Description(props) {
  const { firstName, lastName, description } = props.itemToShow;
  const { streetAddress, city, state, zip } = props.itemToShow.address;

  return (
    <div className="description">
      <div>
        Chosen user: <span className="boldText">{firstName} {lastName}</span>
        </div>
      <p>
        Description:
      </p>
      <textarea
        readOnly
        type="text"
        className="textarea"
        value={description}
      />
      <p>
        Street Address: <span className="boldText">{streetAddress}</span>
      </p>
      <p>
        City: <span className="boldText">{city}</span>
      </p>
      <p>
        State: <span className="boldText">{state}</span>
      </p>
      <div>
        Zip: <span className="boldText">{zip}</span>
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);