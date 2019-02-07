class Task extends React.Component {
    constructor(props) {
        super(props);
        if(props.children!==" "){
            this.state = {
                edit: false
            };
        }else {
            this.state = {
                edit: true
            };
        }
    };


    edit = () => {
        this.setState(
            {edit: true}
        );
    };

    remove = () => {
        this.props.remove(this.props.index);
    };

    save = () => {
        let value = this.refs.newTxt.value;
        this.props.update(value, this.props.index);
        this.setState(
            {edit: false}
        );
    };

    rendEdit = () => {
        return (
            <div className="box">
                <textarea ref="newTxt" autoFocus defaultValue={this.props.children}></textarea>
                <button onClick={this.save} className="btn success">Save</button>
            </div>);
    };

    rendNorm = () => {
        return (
            <div className="box">
                <div>{this.props.children}</div>
                <button onClick={this.edit} className="btn light">Edit</button>
                <button onClick={this.remove} className="btn red">Remove</button>
            </div>
        );
    };

    render() {
        if (this.state.edit) {
            return this.rendEdit();
        } else {
            return this.rendNorm();
        }
    }
}