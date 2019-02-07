const root = document.getElementById("root");
let cache = [];
let stage = "auth";

class Field extends React.Component {
    constructor(props) {
        super(props);
        if(props.loadedTasks){
            let arr = JSON.parse(props.loadedTasks);
           this.state = {
               tasks : arr
           }
        }else {
            this.state = {
                tasks: []
            };
        }
    };

    updateText = (text, i) => {
        let arr = this.state.tasks;
        arr[i] = text;
        this.setState({tasks: arr});
        cache = this.state.tasks;
        saveTasks(this.state.tasks);
    };

    deleteBlock = (i) => {
        let arr = this.state.tasks;
        arr.splice(i,1);
        this.setState({tasks: arr});
        cache = this.state.tasks;
        saveTasks(this.state.tasks);
    };

    add = () => {
        let arr = this.state.tasks;
        arr.push(" ");
        this.setState({tasks: arr});
    };

    logout = () => {
        logoutTasks();
        stage="auth";
        switchScreen();
    };

    render(){
        return(
            <div className="field">
                <h2 className="wellcome">Wellcome, {getLogin()}</h2>
                <button className="btn new" onClick={this.add}>Add Task</button>
                {
                    this.state.tasks.map((item, i) => <Task key={i} index={i} update={this.updateText} remove={this.deleteBlock}>{item}</Task>)
                }
                <button className="btn logout" onClick={this.logout}>logout</button>
            </div>
        );
    };
}

class Auth extends React.Component{
    auth = () => {
        stage = "progress";
        switchScreen();
        loadTasks(this.refs.login.value, this.refs.password.value);
    };

    reg = () => {
        stage = "progress";
        switchScreen();
        regTasks(this.refs.login.value, this.refs.password.value);
    };

    render(){
        return(
            <div className="field">
                    <input className="login" type="text" ref="login" placeholder="login"/>
                    <input className="password" type="password" ref="password" placeholder="password"/>
                    <button className="btn login" onClick={this.auth}>login</button>
                    <button className="btn registration" onClick={this.reg}>registration</button>
            </div>
        );
    }
}

class Progress extends React.Component{
    render(){
        return(
          <div className="warning field">
              <h1>Loading...</h1>
          </div>
        );
    }
}

function loadCallback(res){
    cache = res;
    stage = "main";
    switchScreen();
}

function authFailedCallback(){
    stage = "error"
    switchScreen("Wrong email or password! Please, try again!");
}

function regFailedCallback(){
    stage = "error"
    switchScreen("User already exist!");
}

function switchScreen(msg) {
    if(stage === "main"){
        ReactDOM.render(
            <Field loadedTasks={JSON.stringify(cache)}/>, root
        );
    }else if(stage === "auth"){
        ReactDOM.render(
            <Auth/>, root
        );
    }else if(stage === "progress"){
        ReactDOM.render(
            <Progress/>, root
        );
    }else if(stage === "error"){
        ReactDOM.render(
            <div>
                <Auth/>
                <div className="warning field">
                    <h2>{msg}</h2>
                </div>
            </div>, root
        );
    }
}

$(document).ready(function () {
    switchScreen();
});