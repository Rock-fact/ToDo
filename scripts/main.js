const root = document.getElementById("root");
let cache = [];
let message = "";

class MainContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          stage: "auth"
        };
    }

    stageChange = (newState) => {
        this.setState({
            stage : newState
            });
    };

    render() {
        if(this.state.stage === "auth"){
            return (
                <div className="field">
                    <Auth onStageChange={this.stageChange}/>
                </div>
            );
        }else if(this.state.stage === "main"){
            return (
                <div className="field">
                    <Field loadedTasks={JSON.stringify(cache)}  onStageChange={this.stageChange}/>
                </div>
            );
        }else if(this.state.stage === "progress"){
            return (
                    <div className="field">
                        <Progress/>
                    </div>
            );
        }else if(this.state.stage === "error"){
            return (
                <div className="field">
                    <Auth onStageChange={this.stageChange}/>
                    <div className="warning">
                        <h2>{message}</h2>
                    </div>
                </div>
            );
        }
    }
}

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
        this.props.onStageChange("auth");
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
        this.props.onStageChange("progress");
        loadTasks(this.refs.login.value, this.refs.password.value, this.changeStage);
    };

    reg = () => {
        this.props.onStageChange("progress");
        regTasks(this.refs.login.value, this.refs.password.value, this.changeStage);
    };

    changeStage = (res, body) =>{
        if(res === true){
            cache = body;
            this.props.onStageChange("main");
        }else {
            message = body;
            this.props.onStageChange("error");
        }
    };

    render(){
        return(
            <div>
                    <div><input className="login" type="text" ref="login" placeholder="login"/></div>
                    <div><input className="password" type="password" ref="password" placeholder="password"/></div>
                    <div><button className="btn login" onClick={this.auth}>login</button>
                    <button className="btn registration" onClick={this.reg}>registration</button></div>
            </div>
        );
    }
}

class Progress extends React.Component{
    render(){
        return(
          <div className="warning">
              <h1>Loading...</h1>
          </div>
        );
    }
}

ReactDOM.render(
    <MainContainer/>, root
);