// App.js
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";
function App(props) {
  useEffect(()=>{
   props.getUserAuth();
  },[])
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for the Login component */}
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

const mapStateToProps = (state)=>{
  return {};
};

const mapDispatchToProps = (dispatch) => ( {
  getUserAuth : () => dispatch(getUserAuth()),
});
 
export default connect(mapStateToProps,mapDispatchToProps)(App);