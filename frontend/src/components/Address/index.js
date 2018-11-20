import React from 'react';
import '../Global/css/Meals.css';
import {Redirect} from "react-router-dom";
import fondo from "../Global/imagenes/cover_dark.jpg";

import Geocode from "react-geocode";




const BACK_HOSTNAME = "http://localhost:5000"; //process.env.BACK_HOSTNAME;
const API_KEY = "AIzaSyCJ-vBZePh6EmsJQ7IeTyizy0dXwtVf79U";


export class Address extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            active: true,
            ETA: 35,
            lat: 0,
            lng: 0,
            street: "",
            numb: 0,
            prov: "",
            country: ""


        };
        this.setActive = this.setActive.bind(this);
        this.onClickSendOrder = this.onClickSendOrder.bind(this);
        this.getLatLng = this.getLatLng.bind(this);

        this.updateStreet = this.updateStreet.bind(this);
        this.updateNumber = this.updateNumber.bind(this);
        this.updateProvince = this.updateProvince.bind(this);
        this.updateCountry = this.updateCountry.bind(this);
    }


    setActive(e){

        this.setState({
            active: false

        })
    }

    setETA(){
        if (!this.state.active){
            return (<p>ETA: {this.state.ETA}</p>)
        }
    }

/*    getLatLng(e){
        fetch("http://localhost:5000/address", {headers: {'content-type': 'application/json'} })
            .then(response => response.json())
            .then(address =>{
                this.setState({

                    lat:address.results[0].geometry.location.lat,
                    lng:address.results[0].geometry.location.lng,
                })
            } )
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
    }


    sendOrder(){

        let a_body = JSON.stringify({'a':'prueba a','b':'prueba b'});

        fetch(BACK_HOSTNAME+"/order", {headers: {'content-type': 'application/json'} , method: 'post', body:a_body})
            .then(response => response.json())
            .then(zzz =>{
                console.log(zzz)
            } )


    }


    onClickSendOrder(e){
        this.setActive(e);
        this.getLatLng(e);
        this.sendOrder()
    }


    updateStreet(value){
        this.setState({
            street: value
        })
        }


    updateNumber(value){
        this.setState({
            numb: Number(value)
        })
    }


    updateProvince(value){
        this.setState({
            prov: value
        })
    }


    updateCountry(value){
        this.setState({
            country: value
        })
    }


    render(){
        return(
            <div className="align-items-center d-flex photo-overlay py-5 cover" style = {{ backgroundImage: 'url('+fondo+')' }}>
                <div className="col-md-12 center align-items-center">
                <h1>Thanks!!!{this.props.ETA}</h1>
                </div>
            </div>


        );
    }
}
export default Address;
