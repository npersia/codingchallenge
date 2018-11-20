import React from 'react';
import {Route, Switch} from 'react-router-dom';


import App from './components/App';
import Orders from './components/Orders';
import Restaurants from './components/Restaurants';
import Home from './components/Home';
import Page404 from './components/Page404';
import Meals from './components/Meals';
import Address from './components/Address';
import NewRestaurant from './components/NewRestaurant';
import CreateMealRest from './components/CreateMealRest';
import NewMeal from './components/NewMeal';



const AppRoutes = () =>
    <App>
        <Switch>
            <Route exact path='/orders' component={Orders} />
            <Route exact path='/restaurants' component={Restaurants} />
            <Route exact path='/' component={Home} />
            <Route exact path='/meals' component={Meals} />
            <Route exact path='/address' component={Address} />
            <Route exact path='/create_rest' component={NewRestaurant} />
            <Route exact path='/create_meal_rest' component={CreateMealRest} />
            <Route exact path='/meals_create' component={NewMeal} />
            <Route component={Page404} />
        </Switch>
    </App>

export default AppRoutes;