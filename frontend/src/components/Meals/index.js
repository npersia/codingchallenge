import React, {Component} from 'react';
import '../Global/css/Meals.css';
import Geocode from "react-geocode";

const BACK_HOSTNAME = "http://localhost:5000"; //process.env.BACK_HOSTNAME;
const API_KEY = "AIzaSyCJ-vBZePh6EmsJQ7IeTyizy0dXwtVf79U";


class Meals extends Component{
    constructor(props){
        super(props);
        this.state = {
            meals:[],
            order: "",
            active: true,
            active_order: false,
            ETA: 35,
            lat: 0,
            lng: 0,
            street: "",
            numb: 0,
            prov: "",
            country: "",
            phone: ""

        };

        this.updateMeals = this.updateMeals.bind(this);




        this.setActive = this.setActive.bind(this);
        this.getLatLng = this.getLatLng.bind(this);
        this.onClickSendOrder = this.onClickSendOrder.bind(this);

        this.updatePhone = this.updatePhone.bind(this);
        this.updateStreet = this.updateStreet.bind(this);
        this.updateNumber = this.updateNumber.bind(this);
        this.updateProvince = this.updateProvince.bind(this);
        this.updateCountry = this.updateCountry.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.setETA = this.setETA.bind(this);
    };


    componentDidMount(){
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantID = urlParams.get('rest');


        fetch(BACK_HOSTNAME+"/meals?rest="+restaurantID, {headers: {'content-type': 'application/json'} })
            .then(response => response.json())
            .then(meals =>{
                meals.forEach(meal =>{
                    let data = {
                        meal: meal.meal,
                        name: meal.name,
                        price: meal.price,
                        rest: meal.rest,
                        cant: 0
                    };
                    this.setState({meals:this.state.meals.concat([data])})
                })

            } )
    };


  //  componentWillUnmount(){
  //      this.updateOrder();
  //  }


/*
    getLatLng(e) {

                fetch(BACK_HOSTNAME+"/address", {headers: {'content-type': 'application/json'} })
                    .then(response => response.json())
                    .then(address =>{
                        console.log(address);
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

                console.log(response);
                console.log(lat);

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
            active: false,
            active_order: true

        })
    }


    updateMeals(value, id){
        {this.state.meals.map(m =>
            {if (m.meal === id){
                m.cant = Number(value)

            }})
        }

        /*let newOrder = "";
        let rest = "";

        {this.state.meals.map(m =>
        {if (m.cant > 0){
            rest = "rest="+ m.rest;
            newOrder= newOrder+"&"+ m.meal;
            newOrder= newOrder+"="+ m.cant
        }})
        }*/
    }

    updateOrder(){

        const urlParams = new URLSearchParams(window.location.search);
        const restaurantID = urlParams.get('rest');


        console.log("updateorder");

        var an_order_meals = [];
        let an_order_total = 0;
        let an_order_addr = String(this.state.numb) + " "+this.state.street +", " +this.state.prov + ", "+this.state.country;
        console.log(this.state.lat);
        let an_order_lat_lng = String(this.state.lat)+","+String(this.state.lng);
        let an_order_phone = String(this.state.phone);


        {this.state.meals.map(m=>
            {

                if (m.cant > 0){
                    an_order_total = an_order_total + (m.cant * m.price);
                    let data = {
                        quantity: m.cant,
                        meal: m.meal,
                    };
                    an_order_meals = an_order_meals.concat([data]);
                }
            }
        );}



        let an_order = {
            meals: an_order_meals,
            total: an_order_total,
            addr: an_order_addr,
            latlng: an_order_lat_lng,
            phone: an_order_phone,
            rest: Number(restaurantID)
        };


        let a_body = JSON.stringify(an_order);

        fetch(BACK_HOSTNAME+"/order", {headers: {'content-type': 'application/json'} , method: 'post', body:a_body})
            .then(response => response.json())
            .then(resp =>{
                this.setState({
                    ETA: resp.ETA
                })
            } )

        this.setState({
            active_order: false
        })
    }


    setActive(e){

        this.setState({
            active: false,
            active_order: true

        })
    }

    setETA(){
        if (!this.state.active && !this.state.active_order){

            return (<p>ETA: {this.state.ETA}</p>)
        }
    }



    onClickSendOrder(e){
        this.setActive(e);
        this.getLatLng(e);
    }

    updatePhone(value){
        this.setState({
            phone: value
        })
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
            <div className="Orders">


                <div className="align-items-center d-flex photo-overlay py-5 cover" >

                    <div className="py-4">


                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h2>Meals</h2>
                                    <hr/>

                                </div>
                                    <div className="container">


                                        <div>
                                                <div>
                                                    {this.state.meals.map(m =>
                                                        <li className="row" key={m.meal}>
                                                            <div className="col-md-4"><p className="lead">{m.name}</p></div>
                                                            <div className="col-md-4"><p className="lead">{m.price}</p></div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <input className="form-control" type="number" min="0" onChange={e => this.updateMeals(e.target.value, m.meal)}/>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}

                                                </div>



                                                    <div className="container">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <form className="">
                                                                            <div className="form-group"><label>Street</label>
                                                                                <input type="number" className="form-control" placeholder="Cell Phone" onChange={e => this.updatePhone(e.target.value)}/>
                                                                            </div>
                                                                            <div className="form-group"><label>Street</label>
                                                                                <input type="text" className="form-control" placeholder="Street" onChange={e => this.updateStreet(e.target.value)}/>
                                                                            </div>
                                                                            <div className="form-group"><label>Number</label>
                                                                                <input type="number" className="form-control" placeholder="Number" onChange={e => this.updateNumber(e.target.value)}/>
                                                                            </div>
                                                                            <div className="form-group"><label>Province/city</label>
                                                                                <input type="text" className="form-control" placeholder="Province/city" onChange={e => this.updateProvince(e.target.value)}/>
                                                                            </div>
                                                                            <div className="form-group"><label>Country</label>
                                                                                <input type="text" className="form-control" placeholder="Country" onChange={e => this.updateCountry(e.target.value)}/>
                                                                            </div>
                                                                            <button type="submit" className="btn btn-primary" disabled={!this.state.active} onClick={this.getLatLng}>Confirm</button>


                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>





                                                    <button className="btn btn-primary" disabled={!this.state.active_order} onClick={this.updateOrder}>Make your Order</button>
                                                    <div>{this.setETA()}</div>

                                        </div>


                                    </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        );
    }
}

export default Meals;
