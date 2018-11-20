import React, {Component} from 'react';
import '../Global/css/Global.css';
import Geocode from "react-geocode";


const BACK_HOSTNAME = "http://localhost:5000"; //process.env.BACK_HOSTNAME;
const API_KEY = "AIzaSyCJ-vBZePh6EmsJQ7IeTyizy0dXwtVf79U";



class NewRestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            street: "",
            number: "",
            prov: "",
            country: "",
            msg: "",
            active: true,
            active_add_other: false,
            lat: 0,
            lng: 0
        };
        this.updateValue = this.updateValue.bind(this);
        this.sendData = this.sendData.bind(this);
        this.viewAddRestEstate = this.viewAddRestEstate.bind(this);
        this.getLatLng = this.getLatLng.bind(this);

    }

    sendData(){

        //let a_body = JSON.stringify(this.state);
        let a_body = JSON.stringify({
            name: this.state.name,
            latlng: String(this.state.lat)+","+String(this.state.lng),
            email: this.state.email
        });


        fetch(BACK_HOSTNAME+"/restaurants", {headers: {'content-type': 'application/json'} , method: 'post', body:a_body})
            .then(response => response.json())
            .then(resp =>{
                this.setState({
                    msg: resp.msg
                })
            } );

        this.setState({
            name: "",
            street: "",
            number: "",
            prov: "",
            country: "",
            active: true,
            active_add_other: false
        });
    }

/*
    getLatLng() {

        fetch(BACK_HOSTNAME+"/address", {headers: {'content-type': 'application/json'} })
            .then(response => response.json())
            .then(address =>{
                console.log(address);
                this.setState({

                    lat:address.results[0].geometry.location.lat,
                    lng:address.results[0].geometry.location.lng,
                })
            } );

        this.setState({
            active_add_other: true,
            active: false
        })
    }
    */

    getLatLng(e){
        let addr = String(this.state.numb) + " "+this.state.street +", " +this.state.prov + ", "+this.state.country;

        Geocode.setApiKey(API_KEY);


        Geocode.fromAddress(addr).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;




                this.setState({
                    lat: lat,
                    lng: lng
                })
            },
            error => {
                console.error(error);
            }
        );
        this.setState({
            active_add_other: true,
            active: false
        })
    }

    viewAddRestEstate(){
            return(<h1>{this.state.msg}</h1>)
    }



    updateValue(id,value){
        if (id === "name"){
            this.setState({
                name: value
            })
        }else if (id === "email"){
            this.setState({
                email: value
            })
        }else if (id === "street"){
            this.setState({
                street: value
            })
        }else if (id === "number"){
            this.setState({
                number: value
            })
        }else if (id === "prov"){
            this.setState({
                prov: value
            })
        }else{
            this.setState({
                country: value
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
                <div className="form-group"><label>Email</label>
                    <input id="email" value={this.state.email} type="email" className="form-control" placeholder="Email" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                </div>
                <div className="form-group"><label>Street</label>
                    <input id="street" value={this.state.street} type="text" className="form-control" placeholder="Street" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                </div>
                <div className="form-group"><label>Number</label>
                    <input id="number" value={this.state.number} type="number" className="form-control" placeholder="Number" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                </div>
                <div className="form-group"><label>Province/city</label>
                    <input id="prov" value={this.state.prov} type="text" className="form-control" placeholder="Province/city" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                </div>
                <div className="form-group"><label>Country</label>
                    <input id="country" value={this.state.country} type="text" className="form-control" placeholder="Country" onChange={e => this.updateValue(e.target.id,e.target.value)}/>
                </div>
                <button type="submit" disabled={!this.state.active} className="btn btn-primary" onClick={this.getLatLng}>Confirm</button>

                        <button type="submit" disabled={!this.state.active_add_other} className="btn btn-primary" onClick={this.sendData}>Add Restaurant</button>
                        <div>{this.state.msg}</div>




                </div>

            </div>
            </div>




        );
    }
}


export default NewRestaurant;
