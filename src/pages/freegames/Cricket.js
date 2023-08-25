import * as React from 'react';
import Footer from "../Footer";

 class Cricket extends React.Component{
  render() {
    return (
     <>
        <iframe  width="100%" height="450px" marginheight="0" frameborder="0" border="0" scrolling="auto" src='https://doodlecricket.github.io/#/'></iframe>
        <Footer/>
     </>
    );
  };
};

export default Cricket