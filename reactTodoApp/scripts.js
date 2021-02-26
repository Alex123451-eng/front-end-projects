'use strict'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        {
          id: 1,
          itemValue: 'Learn React',
          isCompleted: false
        },
        {
          id: 2,
          itemValue: 'Go to the gym',
          isCompleted: false
        }
      ],
      inputValue: '',
      isNotificationShown: false,
      startTodoOnPage: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.clickHandle = this.clickHandle.bind(this);
    this.CheckHandle = this.CheckHandle.bind(this);
    this.bucketClickHandle = this.bucketClickHandle.bind(this);
    this.handleDisplayedData = this.handleDisplayedData.bind(this);
  }

  handleChange(e) {
    const inputValue = e.target.value;

    this.setState({ inputValue, isNotificationShown: false });
  }

  clickHandle() {
    let { todos, inputValue} = this.state;

    if (!inputValue)  {
      this.setState({ isNotificationShown: true });
      return;
    }

    todos.unshift({ id: Math.random(), itemValue: inputValue, isCompleted: false });

    this.setState({ todos, inputValue: '' });
  }

  CheckHandle(neededIndex) {
    let todos = this.state.todos;

    let newTodos = todos.map((item, index) => {
      if (index === neededIndex) {
        if (!item.isCompleted) {
          return Object.assign({}, item, { isCompleted: true });
        } else {
          return Object.assign({}, item, { isCompleted: false });
        }   
      }
      return item;
    });

    this.setState({ todos: newTodos });
  }

  bucketClickHandle(neededIndex) {
    let todos = this.state.todos;

    todos.splice(neededIndex, 1);

    this.setState({ todos })
  }

  handleDisplayedData(direction) {
    if (direction === 'forward') {
      this.setState(state => {
        return {startTodoOnPage: state.startTodoOnPage + 10}
      });
    } else {
      this.setState(state => {
        return {startTodoOnPage: state.startTodoOnPage - 10}
      });
    }
  }

  render() {
    const { todos, inputValue, isNotificationShown, startTodoOnPage } = this.state;
    let notification = null;
    let inputRedBorder = 'inputNoRedBorder';
    let isLeftDisabled = true;
    let isRightDisabled = true;

    if (isNotificationShown) {
      notification = <div className='notification'>This field is required</div>;
      inputRedBorder = 'inputRedBorder';
    }

    if (startTodoOnPage === 0) {
      isLeftDisabled = true;
    } else {
      isLeftDisabled = false;
    }

    if (todos.length <= 10 || startTodoOnPage + 10 >= todos.length) {
      isRightDisabled = true;
    } else {
      isRightDisabled = false;
    }

    return (
      <div className='appContainer'>
        <div className='upSectionContainer'>
          <div className='title'>Create a new todo</div>
          <div className='akaHr'></div>
          <div className='inputAddBtnContainer'>
            {notification}
            <input
              className={`input ${inputRedBorder}`}
              onChange={this.handleChange}
              value={inputValue}
              type='text'
              placeholder='What needs to be done?'
            />
            <button
              className='addBtn'
              onClick={this.clickHandle}
            >
              Add todo
            </button>
          </div>
        </div>

        <div className='downSectionContainer'>
          <div className='title'>Todo List</div>
          <div className='akaHr'></div>
          <div className='itemsContainer'>
            {
              todos.slice(startTodoOnPage, startTodoOnPage + 10).map((item, index) => {
                return (
                  <ToDoItem
                    key={item.id}
                    value={item.itemValue}
                    onCheck={this.CheckHandle}
                    onBucketClick={this.bucketClickHandle}
                    isCompleted={item.isCompleted}
                    index={index}
                  />
                );
              })
            }
          </div>
            <NavButtons
              isLeftDisabled={isLeftDisabled}
              isRightDisabled={isRightDisabled}
              handleDisplayedData={this.handleDisplayedData}
            />
        </div>
      </div>
    );
  }
}

class ToDoItem extends React.Component {
  render() {
    const { value, isCompleted, onCheck, index, onBucketClick } = this.props;
    let lineThrough = '';

    if (isCompleted) {
      lineThrough = 'lineThrough';
    } else {
      lineThrough = '';
    }

    return (
      <div className='toDoItemContainer'>
        <div>
          <input
            onChange={onCheck.bind(null, index)}
            type='checkbox' checked={isCompleted}
          />
          <span
            className={`${lineThrough}
            todoText`}
          >
            {value}
          </span>
        </div>
        <div
          onClick={onBucketClick.bind(null, index)}
          className='bucketContainer'
        >
          <i className="far fa-trash-alt"></i>
        </div>
      </div>
    );
  }
}

class NavButtons extends React.Component {
  render() {
    const { isLeftDisabled, isRightDisabled, handleDisplayedData } = this.props;

    return (
      <div className='navBtnsContainer'>
        <button
          id='back'
          disabled={isLeftDisabled}
          onClick={(e) => handleDisplayedData(e.target.id)}
          className={`leftArrow arrows`}
        >
        </button>
        <button
          id='forward'
          disabled={isRightDisabled}
          onClick={(e) => handleDisplayedData(e.target.id)}
          className={`rightArrow arrows`}
        >
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
