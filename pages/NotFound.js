import React from 'react';

class NotFound extends React.Component {

  render(){
    return(
      <div className="not_found">
        <h1>Page you are trying to open could not be found!</h1>
        <a href={window.location.origin}>Back to main page</a>
      </div>
    );
  }
}

export default NotFound;
