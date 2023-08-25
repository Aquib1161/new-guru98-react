import * as React from 'react';
import Footer from "../Footer";

 class Rummy extends React.Component{
  render() {
    return (
     <>
        <iframe  width="100%" height="450px" marginheight="0" frameborder="0" border="0" scrolling="auto" src='https://games.cdn.famobi.com/html5games/g/gin-rummy-classic/v190/?fg_domain=play.famobi.com&fg_aid=A1000-100&fg_uid=ab73af98-2432-4395-bae1-916323c30d93&fg_pid=5a106c0b-28b5-48e2-ab01-ce747dda340f&fg_beat=417&original_ref=https%3A%2F%2Fhtml5games.com%2F'></iframe>
        <Footer/>
     </>
    );
  };
};

export default Rummy