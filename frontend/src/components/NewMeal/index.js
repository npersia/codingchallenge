import React, {Component} from 'react';
import '../Global/css/Global.css';

const BACK_HOSTNAME = "http://localhost:5000"; //process.env.BACK_HOSTNAME;


class NewRestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            price: "",
            rest: "",
            msg: "",
            active: true,
            active_add_other: false
        };

        this.updateValue = this.updateValue.bind(this);
        this.sendData = this.sendData.bind(this);
        this.viewAddRestEstate = this.viewAddRestEstate.bind(this);
        this.confirmData = this.confirmData.bind(this);

    }


    confirmData(){
        this.setState({
            active_add_other: true,
            active: false
        })
    }

    sendData(){
        const urlParams = new URLSearchParams(window.location.search);

        let a_body = JSON.stringify({
            name: this.state.name,
            price: this.state.price,
            rest: urlParams.get('rest')

        });

        fetch(BACK_HOSTNAME+"/meals", {headers: {'content-type': 'application/json'} , method: 'post', body:a_body})
            .then(response => response.json())
            .then(resp =>{
                this.setState({
                    msg: resp.msg
                })
            } );

        this.setState({
            name: "",
            price: "",
            rest: "",
            msg: "",
            active: true,
            active_add_other: false
        });
    }



    viewAddRestEstate(){
        return(<h1>{this.state.msg}</h1>)
    }



    updateValue(id,value) {
        if (id === "name") {
            this.setState({
                name: value
            })
        } else {
            this.setState({
                price: value
            })
        }
    }
        render(){
            return(
                <div className="align-items-center d-flex py-5 cover" >
                    <div className="row">
                        <div className="col-md-12">
                            <h1>Create a new Restaurant</h1>
                            <div className="form-group"><label>Name</label>
                                <input id="name" value={this.state.name} type="text" className="form-control" placeholder="Name" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                            </div>
                            <div className="form-group"><label>Price</label>
                                <input id="price" value={this.state.price} type="text" className="form-control" placeholder="Price" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                            </div>

                            <button type="submit" disabled={!this.state.active} className="btn btn-primary" onClick={this.confirmData}>Confirm</button>

                            <button type="submit" disabled={!this.state.active_add_other} className="btn btn-primary" onClick={this.sendData}>Add Meal</button>
                            <div>{this.state.msg}</div>




                        </div>

                    </div>
                </div>

            );}

    }



export default NewRestaurant;
