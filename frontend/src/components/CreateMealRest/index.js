import React, {Component} from 'react';
import '../Global/css/Global.css';
import fondo from '../Global/imagenes/cover_dark.jpg';






import {Link} from "react-router-dom";


const BACK_HOSTNAME = "http://localhost:5000"; //process.env.BACK_HOSTNAME;

const rest_images = require.context('../Global/imagenes/', true);

const Restaurants = (props) => (

    <li className="contenido">

        <div className="col-lg-12 p-3">
            <hr/>

            <div className="row">



                <div className="col-md-4">
                    <img className="img-fluid d-block ml-auto" src={  rest_images(`./${props.image}`)  } width="50%" alt="logo_rest"/>
                </div>



                <div className="col-md-4 w-25 py-3" >
                    <h1 className="">{props.name}</h1>
                </div>


                <div className="col-md-4 w-25 py-3" >
                    <h1 className="">{props.rating} ★</h1>
                </div>

                <Link to={'/meals_create?rest='+props.rest}>
                    <button type="submit" className="p-4 bg-dark-opaque btn mt-4 btn-block btn-outline-primary p-2">
                        <b>Enter</b>
                    </button>
                </Link>


            </div>

        </div>
    </li>
);

class CreateMealRest extends Component{
    constructor(props){
        super(props);
        this.state = {
            rests:[]

        }
    };

    componentWillMount(){
        fetch(BACK_HOSTNAME+"/restaurants", {headers: {'content-type': 'application/json'} })
            .then(response => response.json())
            .then(rests =>{
                rests.forEach(rest =>{
                    let data = {
                        rest: rest.rest,
                        image: rest.image,
                        rating: rest.rating,
                        name: rest.name
                    };
                    this.setState({rests:this.state.rests.concat([data])})
                })

            } )
    };


    render(){
        return(
            <div className="componentWillMount">


                <div className="align-items-center d-flex py-5 cover" style = {{ backgroundImage: 'url('+fondo+')' }}>
                    <div className="container">

                        <div className="row">
                            <div>
                                {this.state.rests.map(rest => <Restaurants key={rest.rest} rest={rest.rest} image={rest.image} name={rest.name} rating={rest.rating}/>)}
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default CreateMealRest;
