'use strict'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmallDataLoading: false,
      isBigDataLoading: false
    };
    this.handleData = this.handleData.bind(this);
  }

  handleData(data) {
    if (data === 'isPushedSmallData') {
      this.setState({
        isSmallDataLoading: true,
        isBigDataLoading: false
      });
    }
    else if (data === 'isPushedBigData') {
      this.setState({
        isSmallDataLoading: false,
        isBigDataLoading: true
      });
    }
  }

  render() {
    const { isSmallDataLoading, isBigDataLoading } = this.state;
    let output, link;
    if (isSmallDataLoading) {
      link = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';
      output = 
      <Table
        key='a'
        data={link}
      />;
    } else if (isBigDataLoading) {
      link = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';
      output = 
      <Table 
        key='b'
        data={link}
      />;
    } else {
      output = <p className='startMessage'>Вы еще не загрузили никаких данных</p>
    }

    return (
      <div className='mainContainer'>
        <ButtonsLoad
          onClick={this.handleData}
        />
        {output}
      </div>
    )
  }
}

class ButtonsLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPushedSmallData: false,
      isPushedBigData: false
    };
    this.handleData = this.handleData.bind(this);
  }

  handleData(e) {
    let id = e.target.id;

    if (id === 'isPushedSmallData')
      this.setState({
        [id]: true,
        isPushedBigData: false
      });
    else {
      this.setState({
        [id]: true,
        isPushedSmallData: false
      });
    }

    this.props.onClick(e.target.id);
  }

  render() {
    const { isPushedSmallData, isPushedBigData } = this.state;
    return (
      <div className='btnsCover'>
        <button
          id='isPushedSmallData'
          onClick={this.handleData}
          className='loadBtn'
          disabled={isPushedSmallData}
          >
          Скачать маленький объем данных
        </button>

        <button
          id='isPushedBigData'
          onClick={this.handleData}
          className='loadBtn'
          disabled={isPushedBigData}
          >
          Скачать большой объем данных
        </button>
      </div>
    )
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.disp = this.disp.bind(this);
  }

  disp() {
    let { firstName, lastName, address, description } = this.props.data;
    this.props.onRowClicked({ firstName, lastName, address, description })
  }

  render() {
    const item = this.props.data;

    return (
      <React.Fragment>
      <tr className='row' onClick={this.disp}>
        <td className='idCell'>{item.id}</td>
        <td>{item.firstName}</td>
        <td>{item.lastName}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
      </tr>
      </React.Fragment>

    )
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      isFullInfoRendering: false,
      fullInfo: {
        firstName: '',
        lastname: '',
        address: '',
        description: ''
      },
      startDispItem: 0,
      sortOrder: '',
      sortedField: '',
      dataToSearch: ''
    };
    this.handleFullInfo = this.handleFullInfo.bind(this);
    this.handleDisplayedData = this.handleDisplayedData.bind(this);
    this.sort = this.sort.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.receiveFilteredItems = this.receiveFilteredItems.bind(this);
    this.addToTable = this.addToTable.bind(this);
  }

  handleFullInfo(data) {
    this.setState({
      isFullInfoRendering: true,
      fullInfo: {
        firstName: data.firstName,
        lastname: data.lastName,
        address: data.address,
        description: data.description
      }
    });
  }

  handleDisplayedData(data) {
    if (data === 'back') {
      this.setState(prevState => ({ startDispItem: prevState.startDispItem - 50 }));
    } else {
      this.setState(prevState => ({ startDispItem: prevState.startDispItem + 50 }));
    }
  }

  sort(field) {
    let cloneItems = this.state.items.slice();

    let sortOrder = this.state.sortOrder === 'downUp' ? 'upDown' : 'downUp';

    let orderedItems;

    if (sortOrder === 'downUp') {
      orderedItems = cloneItems.sort((a, b) => a[field] > b[field] ? 1 : -1);
    } else {
      orderedItems = cloneItems.sort((a, b) => b[field] > a[field] ? 1 : -1);
    }

    this.setState({
      items: orderedItems,
      sortOrder: sortOrder,
      sortedField: field
    });
  }
  
  componentDidMount() {    
    const url = this.props.data;
    fetch(url)
    .then(response => response.json())
    .then(
      result => {
        this.setState({
          isLoaded: true,
          items: result
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error: error
        });
      }
    )
  }

  searchHandler(data) {
    this.setState({ dataToSearch: data });

    if (data) this.setState({ startDispItem: 0 });
  }

  receiveFilteredItems() {
    let {items, dataToSearch} = this.state;

    if (!dataToSearch) return items;

    let result = items.filter(item => {
      return (
        item['firstName'].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item['lastName'].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item['email'].toLowerCase().includes(dataToSearch.toLowerCase()) ||
        item['phone'].toLowerCase().includes(dataToSearch.toLowerCase())
      )
    });
    if (!result.length) result = [];

    return result;
  }

  addToTable(data) {
    let items = this.state.items;
    items.unshift(data);
    this.setState({
      items: items
    });
  }
  
  render() {
    const { error, isLoaded, isFullInfoRendering, startDispItem, sortedField, sortOrder } = this.state;
    let isNavDisabled = false;
    
    const filteredItems = this.receiveFilteredItems();
    const itemsForDisp = filteredItems.slice(startDispItem, startDispItem + 50);
    const isLeftBtnNavDisabled = startDispItem === 0 ? true : false;
    const isRightBtnNavDisabled = startDispItem + 50 >= filteredItems.length ? true : false;
    if (this.state.items <= 50) isNavDisabled = true;
    if (error) {
      return <p className='errorMessage'> Ошибка {error.message} </p>
    } else if (!isLoaded) {
      return <p className='loadMessage'> Загрузка... </p>
    } else {
      let fullInfo = null;
      if (isFullInfoRendering) {
        fullInfo = 
          <div className='rowInfo'>
              Выбран пользователь <b>{this.state.fullInfo.firstName} {this.state.fullInfo.lastname}</b> 
              <br />
              Описание: 
              <br />
              <textarea className='rowInfo__textarea' readOnly value={this.state.fullInfo.description}></textarea>
              Адрес проживания: <b>{this.state.fullInfo.address.streetAddress}</b>
              <br />
              Город: <b>{this.state.fullInfo.address.city}</b>
              <br />
              Штат: <b>{this.state.fullInfo.address.state}</b>
              <br />
              Индекс: <b>{this.state.fullInfo.address.zip}</b>
          </div>
      }

      return (
        <React.Fragment>
          <AddPanel onAddToTable={this.addToTable} />
          <SearchPanel onSearch={this.searchHandler} />
          <table className='contentTable'>
            <thead>
            <tr>
              <th onClick={this.sort.bind(null, 'id')}
                className='idCell'>
                id
                {sortedField === 'id' ? <p className='sortMessage'>{sortOrder}</p> : null}
              </th>
              <th onClick={this.sort.bind(null, 'firstName')}>
                firstName
                {sortedField === 'firstName' ? <p className='sortMessage'>{sortOrder}</p> : null}
              </th>
              <th onClick={this.sort.bind(null, 'lastName')}>
                lastName
                {sortedField === 'lastName' ? <p className='sortMessage'>{sortOrder}</p> : null}
              </th>
              <th onClick={this.sort.bind(null, 'email')}>
                email
                {sortedField === 'email' ? <p className='sortMessage'>{sortOrder}</p> : null}
              </th>
              <th onClick={this.sort.bind(null, 'phone')}>
                phone
                {sortedField === 'phone' ? <p className='sortMessage'>{sortOrder}</p> : null}
              </th>
            </tr>
            </thead>
            <tbody>
              {
                itemsForDisp.map(item => (
                  <Row onRowClicked={this.handleFullInfo} key={item.description} data={item} />
                ))
              }
            </tbody>
          </table>
          <ButtonsNav
            onNavClick={this.handleDisplayedData}
            isLeftBtnNavDisabled={isLeftBtnNavDisabled}
            isRightBtnNavDisabled={isRightBtnNavDisabled}
            isNavDisabled={isNavDisabled}
          />
          {fullInfo}
        </React.Fragment>
      )
    }
  }
}

class AddPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidatedBtnDisabled: true,
      showAddForm: false,
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isIdValid: false,
      isFirstNameValid: false,
      isLastNameValid: false,
      isEmailValid: false,
      isPhoneValid: false
    }
    this.showAddFormHandle = this.showAddFormHandle.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
  }

  showAddFormHandle() {
    this.setState({ showAddForm: true });
  }

  handleUserInput(e) {
    let id = e.target.id;
    let value = e.target.value;

    this.setState({ [id]: value},
      () => { this.validateFields(id, value) });
  }

  validateFields(fieldName, value) {
    let { isIdValid, isFirstNameValid, isLastNameValid, isEmailValid, isPhoneValid } = this.state;

    switch(fieldName) {
      case 'id':
        isIdValid = value.match(/^\d{1,4}$/);
        break;
      case 'firstName':
        isFirstNameValid = value.match(/^[A-Z]{1}[a-z]*$/)
        break;
      case 'lastName':
        isLastNameValid = value.match(/^[A-Z]{1}[a-z]*$/);
        break;
      case 'email':
        isEmailValid = value.match(/^[A-Z]{2}[a-z]+@[a-z]{2,}\.[a-z]{2,}$/);
        break;
      case 'phone':
        isPhoneValid = value.match(/^\(\d{3}\)\d{3}-\d{4}$/);
        break;
      default:
        break;
    }

    this.setState({
      isIdValid,
      isFirstNameValid,
      isLastNameValid,
      isEmailValid,
      isPhoneValid
    })

    if (isIdValid && isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid) {
      this.setState({
        isValidatedBtnDisabled: false
      });
    } else {
      this.setState({
        isValidatedBtnDisabled: true
      });
    }
  }

  onAddClick() {
    let { id, firstName, lastName, email, phone } = this.state;
    let address = {streetAddress: "5193 Amet Ct", city: "Midlothian", state: "MF", zip: "97386"};
    let description = id + firstName + lastName + email + phone + Math.random();
    id = +id;
    this.props.onAddToTable({ id, firstName, lastName, email, phone, description, address });
  }

  render() {
    let { showAddForm, id, firstName, lastName, email, phone } = this.state;
    let output = showAddForm === true ? 
    <form className='addFormContainer'>
      <input
        id='id' 
        value={id} 
        onChange={this.handleUserInput} 
        type='text' 
        placeholder='id' 
        className='addForm id' />
      <input 
        id='firstName' 
        value={firstName} 
        onChange={this.handleUserInput} 
        type='text' 
        placeholder='firstName' 
        className='addForm firstName' />
      <input 
        id='lastName' 
        value={lastName} 
        onChange={this.handleUserInput} 
        type='text' placeholder='lastName' 
        className='addForm lastName' />
      <input 
        id='email' 
        value={email} 
        onChange={this.handleUserInput} 
        type='text' 
        placeholder='email' 
        className='addForm email' />
      <input 
        id='phone' 
        value={phone} 
        onChange={this.handleUserInput} 
        type='text' 
        placeholder='phone' 
        className='addForm phone' />
    </form>
    : null;

    return (
      <React.Fragment>
        <div className='addContainer'>
          <button onClick={this.showAddFormHandle} className='addNewRowBtn'>Добавить</button>
          <button 
            onClick={this.onAddClick}
            className='addNewRowBtnValidated'
            disabled={this.state.isValidatedBtnDisabled}>
            Добавить в таблицу
          </button>
        </div>
        {output}
      </React.Fragment>
    )
  }
}

class SearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: ''
    };
    this.handleSearchInpChange = this.handleSearchInpChange.bind(this);
  }

  handleSearchInpChange(e) {
    this.setState({ searchInputValue: e.target.value });
  }

  render() {
    const searchInputValue = this.state.searchInputValue;
    return (
      <div className='searchContainer'>
        <button
          onClick={() => this.props.onSearch(searchInputValue)} 
          className='searchBtn'
        >
           Найти
        </button>
        <input
          type='text'
          value={this.state.searchInputValue}
          onChange={this.handleSearchInpChange}
          className='searchInput' />
      </div>
    )
  }
}

class ButtonsNav extends React.Component { 
  constructor(props) {
    super(props);
    this.handleDisplayedData = this.handleDisplayedData.bind(this);
  }


  handleDisplayedData(e) {
    let id = e.target.id;
    this.props.onNavClick(id);
  }

  render() {
    const { isNavDisabled, isLeftBtnNavDisabled, isRightBtnNavDisabled} = this.props;
    return (
      <div className='navContainer'>
        <button
          id='back'
          className='nav'
          disabled={isNavDisabled || isLeftBtnNavDisabled}
          onClick={this.handleDisplayedData}
        >
          Назад
        </button>
        <button
          id='forward'
          className='nav'
          disabled={isNavDisabled || isRightBtnNavDisabled}
          onClick={this.handleDisplayedData}
        >
          Вперед
        </button>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
