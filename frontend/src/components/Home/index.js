import React, {Component} from 'react';
import '../Global/css/Home.css';
import fondo from '../Global/imagenes/cover_dark.jpg';

import galeria1 from '../Global/imagenes/galeria/food_1_dark.jpg';
import galeria2 from '../Global/imagenes/galeria/food_2_dark.jpg';
import galeria3 from '../Global/imagenes/galeria/food_3_dark.jpg';
import galeria4 from '../Global/imagenes/galeria/food_4_dark.jpg';
import galeria5 from '../Global/imagenes/galeria/food_5_dark.jpg';
import galeria6 from '../Global/imagenes/galeria/food_6_dark.jpg';
import galeria7 from '../Global/imagenes/galeria/food_7_dark.jpg';
import galeria8 from '../Global/imagenes/galeria/food_8_dark.jpg';
import galeria9 from '../Global/imagenes/galeria/food_9_dark.jpg';
import galeria10 from '../Global/imagenes/galeria/food_10_dark.jpg';
import galeria11 from '../Global/imagenes/galeria/food_11_dark.jpg';
import galeria12 from '../Global/imagenes/galeria/food_12_dark.jpg';



import {Redirect} from 'react-router-dom';

class Home extends Component{


    state = {
        redirect: false,
        orders: false
    };
    setRedirectOrders = () => {
        this.setState({
            redirect: true,
            orders: true
        })
    };


    setRedirectRestaurants = () => {
        this.setState({
            redirect: true,
            orders: false
        })
    };

    renderRedirectOrders = () => {
        if (this.state.redirect && this.state.orders) {
            return <Redirect to='/orders' />
        }
    };
    renderRedirectRestaurants = () => {
        if (this.state.redirect && !(this.state.orders)) {
            return <Redirect to='/restaurants' />
        }
    };



    render(){
        return(
            <div className="Home">
            <div className="align-items-center d-flex photo-overlay py-5 cover" style = {{ backgroundImage: 'url('+fondo+')' }}>
                <div className = "container" >
                    <div >
                        <div className = "col-lg-7 align-self-center text-lg-left text-center" >
                            <h1
                                className = "mb-0 mt-4 display-3" >Restaurants< /h1>
                        </div>


                        <div className="row">
                            <div className="col-lg-5 p-3">
                                {this.renderRedirectOrders()}
                                    <button type="submit" className="p-4 bg-dark-opaque btn mt-4 btn-block btn-outline-primary p-2" onClick={this.setRedirectOrders}><b>Make an Order</b>
                                    </button>

                            </div>


                            <div className="col-lg-5 p-3">
                                {this.renderRedirectRestaurants()}

                                    <button type="submit" className="p-4 bg-dark-opaque btn mt-4 btn-block btn-outline-primary p-2" onClick={this.setRedirectRestaurants}><b>Manage
                                        Restaurants</b></button>

                            </div>
                        </div>


                    </div>
                </div>

            </div>
        <div className="asd">
            <div className="container-fluid">
                <div className="row">
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria12} className="img-fluid" alt="galeria12"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria11} className="img-fluid" alt="galeria11"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria10} className="img-fluid" alt="galeria10"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria9} className="img-fluid" alt="galeria9"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria8} className="img-fluid" alt="galeria8"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria7} className="img-fluid" alt="galeria7"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria6} className="img-fluid" alt="galeria6"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria5} className="img-fluid" alt="galeria5"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria4} className="img-fluid" alt="galeria4"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria3} className="img-fluid" alt="galeria3"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img src={galeria2} className="img-fluid" alt="galeria2"/></div>
                    <div className="p-0 col-md-2 col-4">
                        <img className="img-fluid" src={galeria1} alt="galeria1"/></div>
                </div>
            </div>
        </div>
            </div>

    );
    }
}

export default Home;
