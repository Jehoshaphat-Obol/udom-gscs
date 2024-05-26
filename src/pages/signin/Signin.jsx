import React, { Component, useContext } from 'react'
import logo from '../../assets/img/logo.png'
import authService from '../../services/authService';

export default class Signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      loading: false,
      message: {},
      mainMessage: "",
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }), () => {
    })
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      }
    }, async () => {
      try {
        const response = await authService.login(this.state.username, this.state.password);
        if(response.access && response.refresh){
          location.href = '/'
        }else{
          this.setState(prevState => ({
            ...prevState,
            loading: false,
            message: response.response.data || response.response,
            mainMessage: response.message,
          }))
        }
      } catch (error) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
          message: {username: "Network Error", password: "Network Error"},
        }));
      }
    })
  }

  componentDidMount(){
  }
  render() {
    localStorage.removeItem('user');
    const { username, password, loading, message, mainMessage } = this.state;
    return (
      <main>
        <div className="container">

          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                  <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto" >
                      <img src={logo} alt="logo" />
                      <span className="d-none d-lg-block">UDOM GSCS</span>
                    </a>
                  </div>

                  <div className="card mb-3">

                    <div className="card-body">

                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                        <p className="text-center small">Enter your username & password to login</p>
                        <p className="small text-center text-danger">{mainMessage}</p>
                      </div>

                      <form className="row g-3 needs-validation" onSubmit={this.handleLogin}>
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">Username</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input type="text" name="username" className="form-control" id="yourUsername" value={username} onChange={this.handleInputChange} required />
                          </div>
                            <small className="text-danger">{message.username}</small>
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label" >Password</label>
                          <input type="password" name="password" className="form-control" id="yourPassword" value={password} onChange={this.handleInputChange} required />
                          <small className="text-danger">{message.password}</small>
                        </div>

                        {
                          (loading) ? (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div className="spinner-border text-primary" role="status" >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            </div>
                          ) : (
                            <div className="col-12">
                              <button className="btn btn-primary w-100" type="submit">Login</button>
                            </div>
                          )
                        }
                      </form>

                    </div>
                  </div>

                </div>
              </div>
            </div>

          </section>

        </div>
      </main>
    )
  }
}
