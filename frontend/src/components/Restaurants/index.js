import React, {Component} from 'react';
import fondo from "../Global/imagenes/cover_dark.jpg";
import '../Global/css/Global.css';
import {Redirect} from "react-router-dom";

class Restaurants extends Component{


    state = {
        redirect: false,
        meal: false
    };
    setRedirectRest = () => {
        this.setState({
            redirect: true,
            meal: true
        })
    };


    setRedirectMeal = () => {
        this.setState({
            redirect: true,
            meal: false
        })
    };

    renderRedirectCreateRestaurant = () => {
        if (this.state.redirect && this.state.meal) {
            return <Redirect to='/create_rest' />
        }
    };
    renderRedirectCreateMeal = () => {
        if (this.state.redirect && !(this.state.meal)) {
            return <Redirect to='/create_meal_rest' />
        }
    };





    render(){
        return(
            <div className="Restaurants">
                <div className="align-items-center d-flex photo-overlay py-5 cover" style = {{ backgroundImage: 'url('+fondo+')' }}>
                    <div className = "container" >
                        <div >
                            <div className = "col-lg-7 align-self-center text-lg-left text-center" >
                                <h1
                                    className = "mb-0 mt-4 display-3" >Restaurants</h1>
                            </div>


                            <div className="row">
                                <div className="col-lg-5 p-3">
                                    {this.renderRedirectCreateRestaurant()}
                                    <button type="submit" className="p-4 bg-dark-opaque btn mt-4 btn-block btn-outline-primary p-2" onClick={this.setRedirectRest}><b>Create Restaurant</b>
                                    </button>

                                </div>


                                <div className="col-lg-5 p-3">
                                    {this.renderRedirectCreateMeal()}

                                    <button type="submit" className="p-4 bg-dark-opaque btn mt-4 btn-block btn-outline-primary p-2" onClick={this.setRedirectMeal}><b>Create Meal</b></button>

                                </div>
                            </div>


                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Restaurants;
