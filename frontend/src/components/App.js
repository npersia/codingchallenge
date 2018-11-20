import React, { Component } from 'react';
import Proptype from "prop-types";



import Header from './Global/Header';
import Content from './Global/Content';
import Footer from './Global/Footer';


import items2 from '../data/menu';


class App extends Component {
    static propTypes = {
        children: Proptype.object.isRequired
    };


    render() {
         const { children } = this.props;
    return (
      <div className="App">
        <Header title="Let's eat" items={items2}/>
        <Content body={children}/>
        <Footer copyright='&copy; Codejobs 2018'/>
      </div>
    );
  }
}

export default App;
