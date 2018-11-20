import React, { Component } from 'react';

import Proptype from "prop-types";

//import './css/Content.css';

class Content extends Component {

    static propTypes = {
        body: Proptype.object.isRequired
    };
  render() {
      const {body} = this.props;
    return (
      <div className="Content">
          {body}
      </div>
    );
  }
}

export default Content;
